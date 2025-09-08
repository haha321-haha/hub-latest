/**
 * 关键词搜索引擎
 * 实现基于关键词的精确和部分匹配搜索
 */

import { 
  IKeywordSearchEngine,
  SearchOptions, 
  SearchResponse, 
  SearchResult, 
  UnifiedSearchConfig,
  KeywordSearchOptions,
  SearchResultType,
  MatchType
} from '../types';

export class KeywordSearchEngine implements IKeywordSearchEngine {
  private config: UnifiedSearchConfig;
  private searchData: any[] = []; // 临时存储搜索数据

  constructor(config: UnifiedSearchConfig) {
    this.config = config;
    this.loadSearchData();
  }

  /**
   * 主搜索方法
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    const startTime = Date.now();
    const results = await this.keywordSearch(options.query, {
      fields: ['title', 'description', 'keywords', 'content'],
      exactMatch: false,
      caseSensitive: false,
      stemming: false,
      synonyms: false
    });

    return {
      results,
      query: options.query,
      totalResults: results.length,
      searchTime: Date.now() - startTime,
      page: options.page || 1,
      pageSize: options.pageSize || 20,
      hasMore: false,
      suggestions: [],
      relatedQueries: [],
      recommendations: []
    };
  }

  /**
   * 关键词搜索实现
   */
  async keywordSearch(query: string, options: KeywordSearchOptions): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const searchTerms = this.preprocessQuery(query);
    const results: SearchResult[] = [];

    // 搜索所有数据源
    for (const item of this.searchData) {
      const matchResult = this.matchItem(item, searchTerms, options);
      if (matchResult) {
        results.push(matchResult);
      }
    }

    // 按相关性排序
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * 搜索建议
   */
  async suggest(query: string, limit: number = 5): Promise<string[]> {
    // 基础实现：从现有数据中提取相关建议
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    for (const item of this.searchData) {
      if (item.title.toLowerCase().includes(queryLower)) {
        suggestions.push(item.title);
      }
    }

    return Array.from(new Set(suggestions)).slice(0, limit);
  }

  /**
   * 获取推荐（基础实现）
   */
  async getRecommendations(userId: string, limit: number = 10): Promise<SearchResult[]> {
    // 基础实现：返回热门内容
    return this.searchData
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit)
      .map(item => this.convertToSearchResult(item));
  }

  /**
   * 构建索引（基础实现）
   */
  async buildIndex(): Promise<void> {
    // 重新加载搜索数据
    await this.loadSearchData();
  }

  /**
   * 清除索引
   */
  async clearIndex(): Promise<void> {
    this.searchData = [];
  }

  // ========== 私有方法 ==========

  /**
   * 加载搜索数据
   */
  private async loadSearchData(): Promise<void> {
    try {
      // 这里应该从实际的数据源加载，现在先用模拟数据
      this.searchData = await this.getMockSearchData();
    } catch (error) {
      console.error('Failed to load search data:', error);
      this.searchData = [];
    }
  }

  /**
   * 获取模拟搜索数据
   */
  private async getMockSearchData(): Promise<any[]> {
    // 这里应该集成真实的数据源（文章、PDF等）
    // 临时返回一些模拟数据用于测试
    return [
      {
        id: 'article-1',
        type: 'article',
        title: '5分钟快速缓解痛经技巧',
        description: '探索您现在就可以使用的简单、可操作的技巧来快速缓解经期痉挛',
        content: '痛经是许多女性面临的问题...',
        keywords: ['痛经', '缓解', '技巧', '快速'],
        url: '/zh/articles/5-minute-period-pain-relief',
        category: '即时缓解',
        viewCount: 1250
      },
      {
        id: 'pdf-1',
        type: 'pdf',
        title: '疼痛追踪表',
        description: '专业的疼痛记录和分析工具，帮助您更好地了解疼痛模式',
        keywords: ['疼痛', '追踪', '记录', '工具'],
        url: '/zh/downloads/preview/pain-tracking-form',
        category: '管理工具',
        viewCount: 800
      }
      // 更多模拟数据...
    ];
  }

  /**
   * 预处理搜索查询
   */
  private preprocessQuery(query: string): string[] {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留字母、数字、空格和中文
      .split(/\s+/)
      .filter(term => term.length > 0);
  }

  /**
   * 匹配项目
   */
  private matchItem(item: any, searchTerms: string[], options: KeywordSearchOptions): SearchResult | null {
    let totalScore = 0;
    const matchedFields: string[] = [];
    const highlights: any[] = [];

    // 搜索各个字段
    for (const field of options.fields) {
      const fieldValue = item[field];
      if (!fieldValue) continue;

      const fieldText = Array.isArray(fieldValue) 
        ? fieldValue.join(' ') 
        : String(fieldValue);
      
      const fieldScore = this.scoreFieldMatch(fieldText, searchTerms, field);
      
      if (fieldScore > 0) {
        totalScore += fieldScore * this.getFieldWeight(field);
        matchedFields.push(field);
        
        // 添加高亮信息
        highlights.push(...this.generateHighlights(fieldText, searchTerms, field));
      }
    }

    if (totalScore === 0) return null;

    return this.convertToSearchResult(item, {
      score: totalScore,
      matchedFields,
      highlights
    });
  }

  /**
   * 计算字段匹配分数
   */
  private scoreFieldMatch(fieldText: string, searchTerms: string[], field: string): number {
    const text = fieldText.toLowerCase();
    let score = 0;

    for (const term of searchTerms) {
      if (text.includes(term)) {
        // 精确匹配得更高分
        if (text === term) {
          score += 1.0;
        } else if (text.includes(' ' + term + ' ') || text.startsWith(term + ' ') || text.endsWith(' ' + term)) {
          score += 0.8; // 词边界匹配
        } else {
          score += 0.6; // 部分匹配
        }
      }
    }

    return score;
  }

  /**
   * 获取字段权重
   */
  private getFieldWeight(field: string): number {
    const weights = this.config.weights;
    switch (field) {
      case 'title': return weights.title;
      case 'description': return weights.description;
      case 'content': return weights.content;
      case 'keywords': return weights.keywords;
      case 'tags': return weights.tags;
      default: return 0.5;
    }
  }

  /**
   * 生成高亮信息
   */
  private generateHighlights(text: string, searchTerms: string[], field: string): any[] {
    const highlights: any[] = [];
    const textLower = text.toLowerCase();

    for (const term of searchTerms) {
      let index = textLower.indexOf(term);
      while (index !== -1) {
        highlights.push({
          field,
          text: text.substring(index, index + term.length),
          start: index,
          end: index + term.length
        });
        index = textLower.indexOf(term, index + 1);
      }
    }

    return highlights;
  }

  /**
   * 转换为搜索结果格式
   */
  private convertToSearchResult(item: any, matchInfo?: any): SearchResult {
    return {
      id: item.id,
      type: item.type as SearchResultType,
      title: item.title,
      description: item.description || '',
      url: item.url,
      score: matchInfo?.score || 0,
      matchType: this.determineMatchType(matchInfo?.score || 0),
      matchedFields: matchInfo?.matchedFields || [],
      highlights: matchInfo?.highlights || [],
      category: item.category,
      keywords: item.keywords,
      tags: item.tags,
      lastModified: item.lastModified,
      viewCount: item.viewCount
    };
  }

  /**
   * 确定匹配类型
   */
  private determineMatchType(score: number): MatchType {
    if (score >= 1.0) return 'exact';
    if (score >= 0.8) return 'partial';
    return 'fuzzy';
  }
} 