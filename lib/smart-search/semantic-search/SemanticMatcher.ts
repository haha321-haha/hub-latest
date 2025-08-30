/**
 * 语义匹配器
 * 整合TF-IDF和余弦相似度进行语义搜索
 */

import { TFIDFVectorizer, TFIDFVector } from './TFIDFVectorizer';
import { CosineSimilarity, SimilarityResult } from './CosineSimilarity';

export interface SemanticSearchResult {
  documentId: string;
  score: number;
  similarity: number;
  relevance: number;
  matchedTerms: string[];
  explanation: string;
  metadata?: Record<string, any>;
}

export interface SemanticSearchOptions {
  similarityThreshold: number;
  maxResults: number;
  boostFactors: {
    titleBoost: number;
    contentBoost: number;
    keywordBoost: number;
  };
  includeExplanation: boolean;
}

export class SemanticMatcher {
  private vectorizer: TFIDFVectorizer;
  private documentVectors: Map<string, TFIDFVector>;
  private documentMetadata: Map<string, Record<string, any>>;

  constructor() {
    this.vectorizer = new TFIDFVectorizer();
    this.documentVectors = new Map();
    this.documentMetadata = new Map();
  }

  /**
   * 训练语义匹配器
   */
  train(documents: Array<{
    id: string;
    title?: string;
    content: string;
    keywords?: string[];
    metadata?: Record<string, any>;
  }>): void {
    // 准备训练数据
    const trainingDocs = documents.map(doc => ({
      id: doc.id,
      content: this.combineTextFields(doc.title, doc.content, doc.keywords)
    }));

    // 训练向量化器
    this.vectorizer.fit(trainingDocs);

    // 生成文档向量
    this.documentVectors.clear();
    this.documentMetadata.clear();

    for (const doc of documents) {
      const vector = this.vectorizer.transform(doc.id, trainingDocs.find(td => td.id === doc.id)?.content);
      this.documentVectors.set(doc.id, vector);
      
      if (doc.metadata) {
        this.documentMetadata.set(doc.id, doc.metadata);
      }
    }
  }

  /**
   * 语义搜索
   */
  search(
    query: string,
    options: Partial<SemanticSearchOptions> = {}
  ): SemanticSearchResult[] {
    const opts: SemanticSearchOptions = {
      similarityThreshold: 0.05,
      maxResults: 20,
      boostFactors: {
        titleBoost: 1.5,
        contentBoost: 1.0,
        keywordBoost: 1.3
      },
      includeExplanation: true,
      ...options
    };

    // 生成查询向量
    const queryVector = this.vectorizer.transformQuery(query);
    
    if (queryVector.terms.length === 0) {
      return [];
    }

    // 计算相似度
    const documentVectors = Array.from(this.documentVectors.values());
    const similarities = CosineSimilarity.calculateBatch(queryVector, documentVectors);

    // 过滤和评分
    const results: SemanticSearchResult[] = [];
    
    for (const simResult of similarities) {
      if (simResult.similarity < opts.similarityThreshold) {
        continue;
      }

      const metadata = this.documentMetadata.get(simResult.documentId) || {};
      const relevance = this.calculateRelevance(simResult, metadata, opts.boostFactors);
      const score = this.calculateFinalScore(simResult.similarity, relevance);

      results.push({
        documentId: simResult.documentId,
        score,
        similarity: simResult.similarity,
        relevance,
        matchedTerms: simResult.matchedTerms,
        explanation: opts.includeExplanation ? simResult.explanation : '',
        metadata
      });
    }

    // 排序并返回
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, opts.maxResults);
  }

  /**
   * 查找相似文档
   */
  findSimilar(
    documentId: string,
    limit: number = 5,
    excludeSelf: boolean = true
  ): SemanticSearchResult[] {
    const targetVector = this.documentVectors.get(documentId);
    if (!targetVector) {
      return [];
    }

    const documentVectors = Array.from(this.documentVectors.values());
    const similarities = CosineSimilarity.calculateBatch(targetVector, documentVectors);

    const results: SemanticSearchResult[] = [];
    
    for (const simResult of similarities) {
      if (excludeSelf && simResult.documentId === documentId) {
        continue;
      }

      const metadata = this.documentMetadata.get(simResult.documentId) || {};
      
      results.push({
        documentId: simResult.documentId,
        score: simResult.similarity,
        similarity: simResult.similarity,
        relevance: 1.0,
        matchedTerms: simResult.matchedTerms,
        explanation: simResult.explanation,
        metadata
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * 获取查询建议
   */
  getQuerySuggestions(partialQuery: string, limit: number = 5): string[] {
    const vocabulary = this.vectorizer.getVocabulary();
    const queryLower = partialQuery.toLowerCase();
    
    const suggestions: Array<{ term: string; score: number }> = [];

    for (const term of vocabulary) {
      if (term.includes(queryLower)) {
        let score = 0;
        
        // 前缀匹配得分更高
        if (term.startsWith(queryLower)) {
          score += 10;
        }
        
        // 完整匹配得分最高
        if (term === queryLower) {
          score += 20;
        }
        
        // 根据IDF值调整得分（更重要的词得分更高）
        score += this.vectorizer.getIDF(term);
        
        suggestions.push({ term, score });
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.term);
  }

  /**
   * 获取文档向量
   */
  getDocumentVector(documentId: string): TFIDFVector | undefined {
    return this.documentVectors.get(documentId);
  }

  /**
   * 获取向量化器统计信息
   */
  getStatistics(): {
    vocabularySize: number;
    documentsCount: number;
    averageDocumentLength: number;
    topTerms: string[];
  } {
    const vocabularySize = this.vectorizer.getVocabularySize();
    const documentsCount = this.documentVectors.size;
    
    // 计算平均文档长度
    let totalTerms = 0;
    for (const vector of this.documentVectors.values()) {
      totalTerms += vector.terms.length;
    }
    const averageDocumentLength = documentsCount > 0 ? totalTerms / documentsCount : 0;

    // 获取高频词
    const vocabulary = this.vectorizer.getVocabulary();
    const topTerms = vocabulary
      .map(term => ({ term, idf: this.vectorizer.getIDF(term) }))
      .sort((a, b) => a.idf - b.idf) // IDF越小表示词频越高
      .slice(0, 10)
      .map(t => t.term);

    return {
      vocabularySize,
      documentsCount,
      averageDocumentLength,
      topTerms
    };
  }

  // ========== 私有方法 ==========

  /**
   * 合并文本字段
   */
  private combineTextFields(
    title?: string,
    content?: string,
    keywords?: string[]
  ): string {
    const parts: string[] = [];
    
    if (title) {
      // 标题重复3次以增加权重
      parts.push(title, title, title);
    }
    
    if (content) {
      parts.push(content);
    }
    
    if (keywords && keywords.length > 0) {
      // 关键词重复2次以增加权重
      const keywordText = keywords.join(' ');
      parts.push(keywordText, keywordText);
    }
    
    return parts.join(' ');
  }

  /**
   * 计算相关性
   */
  private calculateRelevance(
    simResult: SimilarityResult,
    metadata: Record<string, any>,
    boostFactors: { titleBoost: number; contentBoost: number; keywordBoost: number }
  ): number {
    let relevance = 1.0;

    // 根据匹配词数量调整
    const matchedTermsCount = simResult.matchedTerms.length;
    if (matchedTermsCount > 0) {
      relevance += Math.log(matchedTermsCount + 1) * 0.1;
    }

    // 根据文档类型调整
    if (metadata.type) {
      switch (metadata.type) {
        case 'article':
          relevance *= boostFactors.contentBoost;
          break;
        case 'pdf':
          relevance *= boostFactors.titleBoost;
          break;
        case 'tool':
          relevance *= boostFactors.keywordBoost;
          break;
      }
    }

    // 根据重要性权重调整
    if (metadata.importance) {
      relevance *= metadata.importance;
    }

    return Math.min(relevance, 3.0); // 限制最大boost
  }

  /**
   * 计算最终评分
   */
  private calculateFinalScore(similarity: number, relevance: number): number {
    // 结合相似度和相关性
    return similarity * relevance;
  }
} 