/**
 * TF-IDF向量化器
 * 将文档转换为TF-IDF向量用于语义搜索
 */

export interface TFIDFVector {
  terms: string[];
  values: number[];
  documentId: string;
  norm: number; // 向量的L2范数
}

export interface TermFrequency {
  term: string;
  frequency: number;
  tf: number; // 词频
  idf: number; // 逆文档频率
  tfidf: number; // TF-IDF值
}

export class TFIDFVectorizer {
  private vocabulary: Map<string, number>; // 词汇表
  private documentFrequency: Map<string, number>; // 文档频率
  private documents: Map<string, string[]>; // 文档集合
  private totalDocuments: number;

  constructor() {
    this.vocabulary = new Map();
    this.documentFrequency = new Map();
    this.documents = new Map();
    this.totalDocuments = 0;
  }

  /**
   * 训练向量化器
   */
  fit(documents: Array<{ id: string; content: string }>): void {
    this.totalDocuments = documents.length;
    this.vocabulary.clear();
    this.documentFrequency.clear();
    this.documents.clear();

    // 处理每个文档
    for (const doc of documents) {
      const tokens = this.tokenize(doc.content);
      this.documents.set(doc.id, tokens);
      
      // 构建词汇表和计算文档频率
      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        // 更新文档频率
        const currentDF = this.documentFrequency.get(term) || 0;
        this.documentFrequency.set(term, currentDF + 1);
        
        // 添加到词汇表
        if (!this.vocabulary.has(term)) {
          this.vocabulary.set(term, this.vocabulary.size);
        }
      }
    }
  }

  /**
   * 将文档转换为TF-IDF向量
   */
  transform(documentId: string, content?: string): TFIDFVector {
    let tokens: string[];
    
    if (content) {
      tokens = this.tokenize(content);
    } else {
      tokens = this.documents.get(documentId) || [];
    }

    if (tokens.length === 0) {
      return {
        terms: [],
        values: [],
        documentId,
        norm: 0
      };
    }

    // 计算词频
    const termCounts = new Map<string, number>();
    for (const token of tokens) {
      const count = termCounts.get(token) || 0;
      termCounts.set(token, count + 1);
    }

    // 计算TF-IDF向量
    const terms: string[] = [];
    const values: number[] = [];

    for (const [term, count] of termCounts) {
      if (this.vocabulary.has(term)) {
        const tf = count / tokens.length; // 词频
        const df = this.documentFrequency.get(term) || 1;
        const idf = Math.log(this.totalDocuments / df); // 逆文档频率
        const tfidf = tf * idf;

        if (tfidf > 0) {
          terms.push(term);
          values.push(tfidf);
        }
      }
    }

    // 计算L2范数
    const norm = Math.sqrt(values.reduce((sum, val) => sum + val * val, 0));

    return {
      terms,
      values,
      documentId,
      norm
    };
  }

  /**
   * 批量转换文档
   */
  transformBatch(documents: Array<{ id: string; content: string }>): TFIDFVector[] {
    return documents.map(doc => this.transform(doc.id, doc.content));
  }

  /**
   * 获取查询向量
   */
  transformQuery(query: string): TFIDFVector {
    return this.transform('query', query);
  }

  /**
   * 获取词汇表
   */
  getVocabulary(): string[] {
    return Array.from(this.vocabulary.keys());
  }

  /**
   * 获取词汇大小
   */
  getVocabularySize(): number {
    return this.vocabulary.size;
  }

  /**
   * 获取词条的IDF值
   */
  getIDF(term: string): number {
    const df = this.documentFrequency.get(term) || 1;
    return Math.log(this.totalDocuments / df);
  }

  /**
   * 获取最重要的词条
   */
  getTopTerms(documentId: string, limit: number = 10): TermFrequency[] {
    const tokens = this.documents.get(documentId) || [];
    if (tokens.length === 0) return [];

    // 计算词频
    const termCounts = new Map<string, number>();
    for (const token of tokens) {
      const count = termCounts.get(token) || 0;
      termCounts.set(token, count + 1);
    }

    // 计算TF-IDF并排序
    const termFrequencies: TermFrequency[] = [];
    for (const [term, count] of termCounts) {
      if (this.vocabulary.has(term)) {
        const tf = count / tokens.length;
        const df = this.documentFrequency.get(term) || 1;
        const idf = Math.log(this.totalDocuments / df);
        const tfidf = tf * idf;

        termFrequencies.push({
          term,
          frequency: count,
          tf,
          idf,
          tfidf
        });
      }
    }

    return termFrequencies
      .sort((a, b) => b.tfidf - a.tfidf)
      .slice(0, limit);
  }

  // ========== 私有方法 ==========

  /**
   * 分词
   */
  private tokenize(text: string): string[] {
    // 清理文本
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留字母、数字、中文
      .replace(/\s+/g, ' ')
      .trim();

    // 分词
    const tokens = cleanText.split(/\s+/).filter(token => token.length > 1);

    // 移除停用词
    const stopWords = new Set([
      // 中文停用词
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
      '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
      '自己', '这', '他', '她', '它', '我们', '你们', '他们', '什么', '怎么', '为什么',
      
      // 英文停用词
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
      'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    return tokens.filter(token => !stopWords.has(token));
  }
} 