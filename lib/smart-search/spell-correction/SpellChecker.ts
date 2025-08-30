/**
 * 智能拼写纠错系统
 * 基于Levenshtein距离算法和医疗词典的拼写检查和纠错
 */

import { MedicalDictionary } from './MedicalDictionary';

export interface SpellCheckResult {
  isCorrect: boolean;
  originalWord: string;
  suggestions: string[];
  confidence: number;
  correctionType: 'exact' | 'suggestion' | 'medical_term' | 'none';
}

export interface SpellCheckOptions {
  maxSuggestions: number;
  maxDistance: number;
  minWordLength: number;
  includeMedicalTerms: boolean;
  languageMode: 'zh' | 'en' | 'mixed';
}

export class SpellChecker {
  private dictionary: MedicalDictionary;
  private commonWords: Set<string>;
  private medicalTerms: Set<string>;

  constructor() {
    this.dictionary = new MedicalDictionary();
    this.commonWords = new Set();
    this.medicalTerms = new Set();
    this.initializeDictionaries();
  }

  /**
   * 检查单词拼写并提供纠错建议
   */
  async checkSpelling(
    word: string, 
    options: Partial<SpellCheckOptions> = {}
  ): Promise<SpellCheckResult> {
    const opts: SpellCheckOptions = {
      maxSuggestions: 3,
      maxDistance: 2,
      minWordLength: 2,
      includeMedicalTerms: true,
      languageMode: 'mixed',
      ...options
    };

    const cleanWord = this.cleanWord(word);
    
    if (cleanWord.length < opts.minWordLength) {
      return {
        isCorrect: true,
        originalWord: word,
        suggestions: [],
        confidence: 1.0,
        correctionType: 'none'
      };
    }

    // 检查是否为正确拼写
    if (this.isCorrectSpelling(cleanWord, opts)) {
      return {
        isCorrect: true,
        originalWord: word,
        suggestions: [],
        confidence: 1.0,
        correctionType: 'exact'
      };
    }

    // 生成纠错建议
    const suggestions = await this.generateSuggestions(cleanWord, opts);
    
    return {
      isCorrect: false,
      originalWord: word,
      suggestions: suggestions.slice(0, opts.maxSuggestions),
      confidence: suggestions.length > 0 ? 0.8 : 0.0,
      correctionType: suggestions.length > 0 ? 'suggestion' : 'none'
    };
  }

  /**
   * 检查并纠正查询 (简化版本)
   */
  async checkAndCorrect(query: string): Promise<string> {
    const result = await this.checkQuery(query);
    return result.correctedQuery;
  }

  /**
   * 检查并纠正整个查询字符串
   */
  async checkQuery(query: string, options?: Partial<SpellCheckOptions>): Promise<{
    originalQuery: string;
    correctedQuery: string;
    corrections: Array<{
      word: string;
      suggestion: string;
      position: number;
    }>;
    hasCorrections: boolean;
  }> {
    const words = this.tokenizeQuery(query);
    const corrections: Array<{
      word: string;
      suggestion: string;
      position: number;
    }> = [];

    let correctedQuery = query;
    let offset = 0;

    for (const { word, start, end } of words) {
      const checkResult = await this.checkSpelling(word, options);
      
      if (!checkResult.isCorrect && checkResult.suggestions.length > 0) {
        const bestSuggestion = checkResult.suggestions[0];
        corrections.push({
          word,
          suggestion: bestSuggestion,
          position: start
        });

        // 替换原查询中的单词
        const beforeCorrection = correctedQuery.substring(0, start + offset);
        const afterCorrection = correctedQuery.substring(end + offset);
        correctedQuery = beforeCorrection + bestSuggestion + afterCorrection;
        
        // 更新偏移量
        offset += bestSuggestion.length - word.length;
      }
    }

    return {
      originalQuery: query,
      correctedQuery,
      corrections,
      hasCorrections: corrections.length > 0
    };
  }

  /**
   * 获取医疗术语建议
   */
  getMedicalTermSuggestions(partialWord: string, limit: number = 5): string[] {
    const lowercasePartial = partialWord.toLowerCase();
    const suggestions: string[] = [];

    // 从医疗术语中查找匹配项
    for (const term of this.medicalTerms) {
      if (term.toLowerCase().includes(lowercasePartial)) {
        suggestions.push(term);
        if (suggestions.length >= limit) break;
      }
    }

    // 按相关性排序
    return suggestions.sort((a, b) => {
      const aIndex = a.toLowerCase().indexOf(lowercasePartial);
      const bIndex = b.toLowerCase().indexOf(lowercasePartial);
      return aIndex - bIndex;
    });
  }

  // ========== 私有方法 ==========

  /**
   * 初始化词典
   */
  private initializeDictionaries(): void {
    // 加载常用词词典
    this.commonWords = new Set([
      // 中文常用词
      '痛经', '疼痛', '缓解', '治疗', '药物', '症状', '月经', '生理',
      '健康', '医生', '检查', '诊断', '护理', '预防', '调理', '改善',
      '严重', '轻微', '急性', '慢性', '持续', '间歇', '周期', '规律',
      
      // 英文常用词
      'pain', 'relief', 'treatment', 'medicine', 'health', 'doctor',
      'symptom', 'period', 'menstrual', 'cramp', 'therapy', 'care',
      'severe', 'mild', 'chronic', 'acute', 'cycle', 'regular'
    ]);

    // 加载医疗术语
    this.medicalTerms = new Set(this.dictionary.getAllMedicalTerms());
  }

  /**
   * 清理单词
   */
  private cleanWord(word: string): string {
    return word
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]/g, '') // 保留字母、数字和中文
      .trim();
  }

  /**
   * 检查是否为正确拼写
   */
  private isCorrectSpelling(word: string, options: SpellCheckOptions): boolean {
    // 检查常用词典
    if (this.commonWords.has(word)) {
      return true;
    }

    // 检查医疗术语词典
    if (options.includeMedicalTerms && this.medicalTerms.has(word)) {
      return true;
    }

    // 检查同义词词典
    if (this.dictionary.isValidTerm(word)) {
      return true;
    }

    return false;
  }

  /**
   * 生成纠错建议
   */
  private async generateSuggestions(
    word: string, 
    options: SpellCheckOptions
  ): Promise<string[]> {
    const suggestions: Array<{ word: string; distance: number; score: number }> = [];

    // 从常用词典生成建议
    for (const dictWord of this.commonWords) {
      const distance = this.levenshteinDistance(word, dictWord);
      if (distance <= options.maxDistance) {
        const score = this.calculateSuggestionScore(word, dictWord, distance);
        suggestions.push({ word: dictWord, distance, score });
      }
    }

    // 从医疗术语生成建议
    if (options.includeMedicalTerms) {
      for (const medicalTerm of this.medicalTerms) {
        const distance = this.levenshteinDistance(word, medicalTerm);
        if (distance <= options.maxDistance) {
          const score = this.calculateSuggestionScore(word, medicalTerm, distance);
          suggestions.push({ word: medicalTerm, distance, score: score + 0.1 }); // 医疗术语加权
        }
      }
    }

    // 按评分排序并返回
    return suggestions
      .sort((a, b) => b.score - a.score)
      .map(s => s.word)
      .slice(0, options.maxSuggestions);
  }

  /**
   * 计算Levenshtein距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // 初始化矩阵
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // 填充矩阵
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // 删除
          matrix[i][j - 1] + 1,     // 插入
          matrix[i - 1][j - 1] + cost // 替换
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * 计算建议评分
   */
  private calculateSuggestionScore(
    original: string, 
    suggestion: string, 
    distance: number
  ): number {
    const maxLength = Math.max(original.length, suggestion.length);
    const similarity = 1 - (distance / maxLength);
    
    // 考虑长度相似性
    const lengthSimilarity = 1 - Math.abs(original.length - suggestion.length) / maxLength;
    
    // 考虑首字母匹配
    const firstCharMatch = original[0] === suggestion[0] ? 0.1 : 0;
    
    return similarity * 0.7 + lengthSimilarity * 0.2 + firstCharMatch;
  }

  /**
   * 分词查询字符串
   */
  private tokenizeQuery(query: string): Array<{
    word: string;
    start: number;
    end: number;
  }> {
    const tokens: Array<{ word: string; start: number; end: number }> = [];
    const regex = /[\w\u4e00-\u9fff]+/g;
    let match;

    while ((match = regex.exec(query)) !== null) {
      tokens.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return tokens;
  }
} 