/**
 * 查询扩展器
 * 生成同义词查询变体和扩展查询
 */

import { MedicalSynonyms } from './MedicalSynonyms';

export interface QueryVariant {
  query: string;
  confidence: number;
  expansionType: 'synonym' | 'related' | 'contextual';
  changedTerms: Array<{
    original: string;
    replacement: string;
  }>;
}

export class QueryExpander {
  private medicalSynonyms: MedicalSynonyms;

  constructor(medicalSynonyms: MedicalSynonyms) {
    this.medicalSynonyms = medicalSynonyms;
  }

  /**
   * 生成查询变体
   */
  generateQueryVariants(
    originalQuery: string,
    expandedTerms: Array<{
      original: string;
      synonyms: string[];
      category: string;
      confidence: number;
    }>,
    maxVariants: number = 5
  ): string[] {
    const variants: QueryVariant[] = [];
    
    // 生成单词替换变体
    for (const termData of expandedTerms) {
      if (termData.synonyms.length > 0) {
        for (let i = 0; i < Math.min(termData.synonyms.length, 2); i++) {
          const synonym = termData.synonyms[i];
          const variantQuery = this.replaceTermInQuery(
            originalQuery, 
            termData.original, 
            synonym
          );
          
          if (variantQuery !== originalQuery) {
            variants.push({
              query: variantQuery,
              confidence: termData.confidence * (1 - i * 0.1), // 后续同义词置信度递减
              expansionType: 'synonym',
              changedTerms: [{
                original: termData.original,
                replacement: synonym
              }]
            });
          }
        }
      }
    }

    // 生成组合变体（替换多个词）
    if (expandedTerms.length > 1) {
      const combinationVariants = this.generateCombinationVariants(
        originalQuery, 
        expandedTerms, 
        2
      );
      variants.push(...combinationVariants);
    }

    // 按置信度排序并返回
    return variants
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxVariants)
      .map(v => v.query);
  }

  /**
   * 扩展查询为布尔表达式
   */
  expandToBooleanQuery(
    originalQuery: string,
    expandedTerms: Array<{
      original: string;
      synonyms: string[];
      category: string;
      confidence: number;
    }>
  ): string {
    const tokens = this.tokenizeQuery(originalQuery);
    const expandedTokens: string[] = [];

    for (const token of tokens) {
      const termData = expandedTerms.find(t => t.original === token);
      
      if (termData && termData.synonyms.length > 0) {
        // 创建同义词组
        const synonymGroup = [token, ...termData.synonyms.slice(0, 2)]
          .map(term => `"${term}"`)
          .join(' OR ');
        expandedTokens.push(`(${synonymGroup})`);
      } else {
        expandedTokens.push(`"${token}"`);
      }
    }

    return expandedTokens.join(' AND ');
  }

  /**
   * 生成上下文感知的查询扩展
   */
  generateContextualExpansion(
    query: string,
    context: {
      userHistory?: string[];
      contentCategory?: string;
      timeContext?: 'recent' | 'historical';
    } = {}
  ): string[] {
    const tokens = this.tokenizeQuery(query);
    const contextualExpansions: string[] = [query];

    // 基于用户历史的扩展
    if (context.userHistory && context.userHistory.length > 0) {
      const historyTerms = context.userHistory
        .flatMap(historyQuery => this.tokenizeQuery(historyQuery))
        .filter(term => !tokens.includes(term));
      
      // 添加历史相关术语
      for (const historyTerm of historyTerms.slice(0, 2)) {
        const relatedTerms = this.medicalSynonyms.getRelatedTerms(historyTerm, tokens, 1);
        if (relatedTerms.length > 0) {
          contextualExpansions.push(`${query} ${relatedTerms[0].term}`);
        }
      }
    }

    // 基于内容分类的扩展
    if (context.contentCategory) {
      const categoryTerms = this.medicalSynonyms.getTermsByCategory(context.contentCategory);
      const relevantCategoryTerms = categoryTerms
        .filter(term => !tokens.includes(term))
        .slice(0, 2);
      
      for (const categoryTerm of relevantCategoryTerms) {
        contextualExpansions.push(`${query} ${categoryTerm}`);
      }
    }

    return Array.from(new Set(contextualExpansions));
  }

  /**
   * 简化查询（移除冗余词汇）
   */
  simplifyQuery(query: string): string {
    const stopWords = new Set([
      '的', '了', '是', '在', '有', '和', '与', '或', '但', '而',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'
    ]);

    return this.tokenizeQuery(query)
      .filter(token => !stopWords.has(token) && token.length > 1)
      .join(' ');
  }

  // ========== 私有方法 ==========

  /**
   * 在查询中替换词条
   */
  private replaceTermInQuery(
    query: string, 
    originalTerm: string, 
    replacement: string
  ): string {
    // 使用词边界进行精确替换
    const regex = new RegExp(`\\b${this.escapeRegex(originalTerm)}\\b`, 'gi');
    return query.replace(regex, replacement);
  }

  /**
   * 生成组合变体
   */
  private generateCombinationVariants(
    originalQuery: string,
    expandedTerms: Array<{
      original: string;
      synonyms: string[];
      category: string;
      confidence: number;
    }>,
    maxCombinations: number = 2
  ): QueryVariant[] {
    const variants: QueryVariant[] = [];
    
    // 生成两词组合替换
    if (expandedTerms.length >= 2) {
      for (let i = 0; i < expandedTerms.length - 1; i++) {
        for (let j = i + 1; j < expandedTerms.length; j++) {
          const term1 = expandedTerms[i];
          const term2 = expandedTerms[j];
          
          if (term1.synonyms.length > 0 && term2.synonyms.length > 0) {
            let variantQuery = originalQuery;
            variantQuery = this.replaceTermInQuery(
              variantQuery, 
              term1.original, 
              term1.synonyms[0]
            );
            variantQuery = this.replaceTermInQuery(
              variantQuery, 
              term2.original, 
              term2.synonyms[0]
            );
            
            if (variantQuery !== originalQuery) {
              variants.push({
                query: variantQuery,
                confidence: (term1.confidence + term2.confidence) / 2 * 0.8, // 组合变体置信度稍低
                expansionType: 'synonym',
                changedTerms: [
                  { original: term1.original, replacement: term1.synonyms[0] },
                  { original: term2.original, replacement: term2.synonyms[0] }
                ]
              });
            }
          }
          
          if (variants.length >= maxCombinations) break;
        }
        if (variants.length >= maxCombinations) break;
      }
    }
    
    return variants;
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 分词查询
   */
  private tokenizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
} 