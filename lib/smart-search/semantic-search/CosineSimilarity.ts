/**
 * 余弦相似度计算器
 * 计算两个向量之间的余弦相似度
 */

import { TFIDFVector } from './TFIDFVectorizer';

export interface SimilarityResult {
  documentId: string;
  similarity: number;
  matchedTerms: string[];
  explanation: string;
}

export class CosineSimilarity {
  /**
   * 计算两个TF-IDF向量的余弦相似度
   */
  static calculate(vector1: TFIDFVector, vector2: TFIDFVector): number {
    if (vector1.norm === 0 || vector2.norm === 0) {
      return 0;
    }

    // 计算点积
    const dotProduct = this.dotProduct(vector1, vector2);
    
    // 余弦相似度 = 点积 / (||v1|| * ||v2||)
    return dotProduct / (vector1.norm * vector2.norm);
  }

  /**
   * 计算查询与文档集合的相似度
   */
  static calculateBatch(
    queryVector: TFIDFVector, 
    documentVectors: TFIDFVector[]
  ): SimilarityResult[] {
    const results: SimilarityResult[] = [];

    for (const docVector of documentVectors) {
      const similarity = this.calculate(queryVector, docVector);
      const matchedTerms = this.getMatchedTerms(queryVector, docVector);
      const explanation = this.generateExplanation(similarity, matchedTerms);

      results.push({
        documentId: docVector.documentId,
        similarity,
        matchedTerms,
        explanation
      });
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * 获取相似度排名前N的文档
   */
  static getTopSimilar(
    queryVector: TFIDFVector,
    documentVectors: TFIDFVector[],
    topN: number = 10
  ): SimilarityResult[] {
    const results = this.calculateBatch(queryVector, documentVectors);
    return results.slice(0, topN);
  }

  /**
   * 计算相似度矩阵
   */
  static calculateMatrix(vectors: TFIDFVector[]): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < vectors.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < vectors.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0; // 自身相似度为1
        } else {
          matrix[i][j] = this.calculate(vectors[i], vectors[j]);
        }
      }
    }
    
    return matrix;
  }

  /**
   * 查找最相似的文档
   */
  static findMostSimilar(
    targetVector: TFIDFVector,
    candidateVectors: TFIDFVector[],
    excludeIds: string[] = []
  ): SimilarityResult | null {
    let maxSimilarity = -1;
    let mostSimilar: SimilarityResult | null = null;

    for (const candidate of candidateVectors) {
      if (excludeIds.includes(candidate.documentId)) {
        continue;
      }

      const similarity = this.calculate(targetVector, candidate);
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        const matchedTerms = this.getMatchedTerms(targetVector, candidate);
        mostSimilar = {
          documentId: candidate.documentId,
          similarity,
          matchedTerms,
          explanation: this.generateExplanation(similarity, matchedTerms)
        };
      }
    }

    return mostSimilar;
  }

  /**
   * 基于阈值过滤相似文档
   */
  static filterBySimilarity(
    queryVector: TFIDFVector,
    documentVectors: TFIDFVector[],
    threshold: number = 0.1
  ): SimilarityResult[] {
    const results = this.calculateBatch(queryVector, documentVectors);
    return results.filter(result => result.similarity >= threshold);
  }

  // ========== 私有方法 ==========

  /**
   * 计算两个向量的点积
   */
  private static dotProduct(vector1: TFIDFVector, vector2: TFIDFVector): number {
    let product = 0;

    // 创建词条到值的映射
    const vector1Map = new Map<string, number>();
    for (let i = 0; i < vector1.terms.length; i++) {
      vector1Map.set(vector1.terms[i], vector1.values[i]);
    }

    // 计算点积
    for (let i = 0; i < vector2.terms.length; i++) {
      const term = vector2.terms[i];
      const value1 = vector1Map.get(term) || 0;
      const value2 = vector2.values[i];
      product += value1 * value2;
    }

    return product;
  }

  /**
   * 获取匹配的词条
   */
  private static getMatchedTerms(vector1: TFIDFVector, vector2: TFIDFVector): string[] {
    const vector1Terms = new Set(vector1.terms);
    const matchedTerms: string[] = [];

    for (const term of vector2.terms) {
      if (vector1Terms.has(term)) {
        matchedTerms.push(term);
      }
    }

    return matchedTerms;
  }

  /**
   * 生成相似度解释
   */
  private static generateExplanation(similarity: number, matchedTerms: string[]): string {
    if (similarity === 0) {
      return '没有找到相关词汇匹配';
    }

    if (similarity < 0.1) {
      return `相似度较低 (${(similarity * 100).toFixed(1)}%)，匹配词汇: ${matchedTerms.slice(0, 3).join(', ')}`;
    }

    if (similarity < 0.3) {
      return `相似度一般 (${(similarity * 100).toFixed(1)}%)，主要匹配: ${matchedTerms.slice(0, 5).join(', ')}`;
    }

    if (similarity < 0.6) {
      return `相似度较高 (${(similarity * 100).toFixed(1)}%)，强匹配词汇: ${matchedTerms.slice(0, 7).join(', ')}`;
    }

    return `相似度很高 (${(similarity * 100).toFixed(1)}%)，高度匹配: ${matchedTerms.join(', ')}`;
  }
} 