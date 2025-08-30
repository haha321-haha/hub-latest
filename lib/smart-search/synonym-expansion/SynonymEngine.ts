/**
 * 同义词扩展引擎
 * 实现查询的同义词扩展和语义扩展
 */

import { MedicalSynonyms } from './MedicalSynonyms';
import { QueryExpander } from './QueryExpander';

export interface SynonymExpansionResult {
  originalQuery: string;
  expandedQuery: string;
  synonyms: string[]; // 添加synonyms属性以兼容SmartSearchSystem
  expandedTerms: Array<{
    original: string;
    synonyms: string[];
    category: string;
    confidence: number;
  }>;
  expansionScore: number;
}

export interface SynonymExpansionOptions {
  maxSynonymsPerTerm: number;
  includeRelatedTerms: boolean;
  contextualExpansion: boolean;
  languageMode: 'zh' | 'en' | 'mixed';
  medicalTermsOnly: boolean;
  confidenceThreshold: number;
}

export class SynonymEngine {
  private medicalSynonyms: MedicalSynonyms;
  private queryExpander: QueryExpander;

  constructor() {
    this.medicalSynonyms = new MedicalSynonyms();
    this.queryExpander = new QueryExpander(this.medicalSynonyms);
  }

  /**
   * 扩展查询中的同义词
   */
  async expandQuery(
    query: string,
    options: Partial<SynonymExpansionOptions> = {}
  ): Promise<SynonymExpansionResult> {
    const opts: SynonymExpansionOptions = {
      maxSynonymsPerTerm: 3,
      includeRelatedTerms: true,
      contextualExpansion: true,
      languageMode: 'mixed',
      medicalTermsOnly: false,
      confidenceThreshold: 0.6,
      ...options
    };

    // 分词
    const tokens = this.tokenizeQuery(query);
    const expandedTerms: Array<{
      original: string;
      synonyms: string[];
      category: string;
      confidence: number;
    }> = [];

    let expansionScore = 0;
    const expandedQueries: string[] = [query]; // 包含原查询

    // 处理每个词条
    for (const token of tokens) {
      const synonymData = await this.expandTerm(token, opts);
      
      if (synonymData.synonyms.length > 0) {
        expandedTerms.push(synonymData);
        expansionScore += synonymData.confidence;
      }
    }

    // 生成扩展查询
    const expandedQuery = this.generateExpandedQuery(query, expandedTerms, opts);
    
    // 收集所有同义词用于兼容性
    const allSynonyms: string[] = [];
    for (const termData of expandedTerms) {
      allSynonyms.push(...termData.synonyms);
    }

    return {
      originalQuery: query,
      expandedQuery,
      synonyms: allSynonyms, // 添加synonyms属性
      expandedTerms,
      expansionScore: expansionScore / Math.max(tokens.length, 1)
    };
  }

  /**
   * 获取词条的同义词
   */
  async getSynonyms(
    term: string,
    options: Partial<SynonymExpansionOptions> = {}
  ): Promise<string[]> {
    const opts: SynonymExpansionOptions = {
      maxSynonymsPerTerm: 5,
      includeRelatedTerms: false,
      contextualExpansion: false,
      languageMode: 'mixed',
      medicalTermsOnly: false,
      confidenceThreshold: 0.5,
      ...options
    };

    return this.medicalSynonyms.getSynonyms(term, opts.maxSynonymsPerTerm);
  }

  /**
   * 获取相关词条
   */
  async getRelatedTerms(
    term: string,
    context: string[] = [],
    limit: number = 5
  ): Promise<Array<{
    term: string;
    relation: string;
    confidence: number;
  }>> {
    return this.medicalSynonyms.getRelatedTerms(term, context, limit);
  }

  /**
   * 构建同义词查询变体
   */
  async buildQueryVariants(
    query: string,
    maxVariants: number = 5
  ): Promise<string[]> {
    const expansionResult = await this.expandQuery(query, {
      maxSynonymsPerTerm: 2,
      includeRelatedTerms: false,
      contextualExpansion: true
    });

    return this.queryExpander.generateQueryVariants(
      query, 
      expansionResult.expandedTerms, 
      maxVariants
    );
  }

  // ========== 私有方法 ==========

  /**
   * 扩展单个词条
   */
  private async expandTerm(
    term: string,
    options: SynonymExpansionOptions
  ): Promise<{
    original: string;
    synonyms: string[];
    category: string;
    confidence: number;
  }> {
    const cleanTerm = this.cleanTerm(term);
    
    // 获取基础同义词
    const basicSynonyms = this.medicalSynonyms.getSynonyms(
      cleanTerm, 
      options.maxSynonymsPerTerm
    );

    // 获取相关词条
    let relatedTerms: string[] = [];
    if (options.includeRelatedTerms) {
      const related = await this.getRelatedTerms(cleanTerm, [], 2);
      relatedTerms = related
        .filter(r => r.confidence >= options.confidenceThreshold)
        .map(r => r.term);
    }

    // 合并同义词和相关词
    const allSynonyms = [...basicSynonyms, ...relatedTerms]
      .slice(0, options.maxSynonymsPerTerm);

    // 计算置信度
    const confidence = this.calculateTermConfidence(cleanTerm, allSynonyms);

    // 获取词条分类
    const category = this.medicalSynonyms.getTermCategory(cleanTerm) || 'general';

    return {
      original: cleanTerm,
      synonyms: allSynonyms,
      category,
      confidence
    };
  }

  /**
   * 生成扩展查询
   */
  private generateExpandedQuery(
    originalQuery: string,
    expandedTerms: Array<{
      original: string;
      synonyms: string[];
      category: string;
      confidence: number;
    }>,
    options: SynonymExpansionOptions
  ): string {
    if (expandedTerms.length === 0) {
      return originalQuery;
    }

    // 构建扩展查询字符串
    let expandedQuery = originalQuery;
    
    // 添加高置信度的同义词
    const highConfidenceTerms = expandedTerms.filter(
      term => term.confidence >= options.confidenceThreshold
    );

    for (const termData of highConfidenceTerms) {
      if (termData.synonyms.length > 0) {
        // 添加最相关的同义词
        const topSynonym = termData.synonyms[0];
        if (!expandedQuery.includes(topSynonym)) {
          expandedQuery += ` ${topSynonym}`;
        }
      }
    }

    return expandedQuery;
  }

  /**
   * 计算词条扩展置信度
   */
  private calculateTermConfidence(
    originalTerm: string,
    synonyms: string[]
  ): number {
    if (synonyms.length === 0) return 0;

    // 基础置信度基于同义词数量
    let confidence = Math.min(synonyms.length / 3, 1.0);

    // 医疗术语加权
    if (this.medicalSynonyms.isMedicalTerm(originalTerm)) {
      confidence += 0.2;
    }

    // 常用词加权
    if (this.isCommonTerm(originalTerm)) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * 检查是否为常用词
   */
  private isCommonTerm(term: string): boolean {
    const commonTerms = new Set([
      '痛经', '疼痛', '缓解', '治疗', '药物', 
      'pain', 'relief', 'treatment', 'medicine'
    ]);
    return commonTerms.has(term.toLowerCase());
  }

  /**
   * 清理词条
   */
  private cleanTerm(term: string): string {
    return term
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]/g, '')
      .trim();
  }

  /**
   * 分词查询
   */
  private tokenizeQuery(query: string): string[] {
    // 简单的分词实现
    return query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
} 