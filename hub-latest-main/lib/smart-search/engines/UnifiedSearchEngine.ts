/**
 * 统一搜索引擎核心实现
 * 整合多种搜索算法，提供统一的搜索接口
 */

import { 
  ISearchEngine, 
  SearchOptions, 
  SearchResponse, 
  SearchResult, 
  UnifiedSearchConfig,
  SearchWeights,
  SearchScope,
  SearchResultType,
  SearchError,
  UserProfile
} from '../types';

import { KeywordSearchEngine } from './KeywordSearchEngine';
import { FuzzySearchEngine } from './FuzzySearchEngine';
import { SemanticSearchEngine } from './SemanticSearchEngine';
import { ResultFusionEngine } from './ResultFusionEngine';
import { SearchIndexManager } from '../index/SearchIndexManager';
import { PersonalizationEngine } from '../personalization/PersonalizationEngine';
import { SearchCache } from '../cache/SearchCache';
import { SearchAnalytics } from '../analytics/SearchAnalytics';

export class UnifiedSearchEngine implements ISearchEngine {
  private keywordEngine!: KeywordSearchEngine;
  private fuzzyEngine!: FuzzySearchEngine;
  private semanticEngine!: SemanticSearchEngine;
  private fusionEngine!: ResultFusionEngine;
  private indexManager!: SearchIndexManager;
  private personalizationEngine!: PersonalizationEngine;
  private cache!: SearchCache;
  private analytics!: SearchAnalytics;
  private config: UnifiedSearchConfig;

  constructor(config: Partial<UnifiedSearchConfig> = {}) {
    this.config = this.mergeConfig(config);
    this.initializeEngines();
  }

  /**
   * 主搜索方法 - 统一搜索入口
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      // 1. 验证和预处理搜索查询
      const processedOptions = await this.preprocessSearch(options);
      
      // 2. 检查缓存
      if (this.config.enableCache) {
        const cachedResult = await this.cache.get(processedOptions);
        if (cachedResult) {
          await this.analytics.recordSearch(processedOptions, cachedResult, true);
          return cachedResult;
        }
      }

      // 3. 执行多引擎搜索
      const searchResults = await this.executeMultiEngineSearch(processedOptions);
      
      // 4. 融合和排序结果
      const fusedResults = await this.fusionEngine.fuseResults(
        searchResults, 
        processedOptions, 
        this.config.weights
      );

      // 5. 个性化处理
      const personalizedResults = await this.personalizeResults(fusedResults, options.userId);

      // 6. 构建响应
      const response = await this.buildSearchResponse(
        personalizedResults,
        processedOptions,
        startTime
      );

      // 7. 缓存结果
      if (this.config.enableCache) {
        await this.cache.set(processedOptions, response);
      }

      // 8. 记录分析数据
      await this.analytics.recordSearch(processedOptions, response, false);

      return response;

    } catch (error) {
      const searchError: SearchError = {
        name: 'SearchError',
        message: error instanceof Error ? error.message : 'Unknown search error',
        code: 'SEARCH_TIMEOUT',
        details: { options, duration: Date.now() - startTime }
      };
      
      await this.analytics.recordError(searchError, options);
      throw searchError;
    }
  }

  /**
   * 搜索建议
   */
  async suggest(query: string, limit: number = 5): Promise<string[]> {
    if (!query.trim()) return [];

    try {
      // 从多个来源获取建议
      const [historyBased, contentBased, popularBased] = await Promise.all([
        this.getHistoryBasedSuggestions(query, limit),
        this.getContentBasedSuggestions(query, limit),
        this.getPopularSuggestions(query, limit)
      ]);

      // 合并和去重建议
      const allSuggestions = [...historyBased, ...contentBased, ...popularBased];
      const uniqueSuggestions = Array.from(new Set(allSuggestions));

      // 按相关性排序并限制数量
      return this.rankSuggestions(uniqueSuggestions, query).slice(0, limit);
    } catch (error) {
      console.error('Suggestion generation failed:', error);
      return [];
    }
  }

  /**
   * 获取个性化推荐
   */
  async getRecommendations(userId: string, limit: number = 10): Promise<SearchResult[]> {
    if (!userId) return [];

    try {
      return await this.personalizationEngine.generateRecommendations(userId, limit);
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return [];
    }
  }

  /**
   * 构建搜索索引
   */
  async buildIndex(): Promise<void> {
    try {
      await this.indexManager.buildIndex();
      console.log('Search index built successfully');
    } catch (error) {
      console.error('Failed to build search index:', error);
      throw error;
    }
  }

  /**
   * 清除搜索索引
   */
  async clearIndex(): Promise<void> {
    try {
      await this.indexManager.clearIndex();
      await this.cache.clear();
      console.log('Search index cleared successfully');
    } catch (error) {
      console.error('Failed to clear search index:', error);
      throw error;
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<UnifiedSearchConfig>): void {
    this.config = this.mergeConfig(newConfig);
    this.reinitializeEngines();
  }

  /**
   * 获取搜索分析数据
   */
  async getAnalytics(dateRange?: { start: string; end: string }) {
    return await this.analytics.getAnalytics(dateRange);
  }

  // ========== 私有方法 ==========

  /**
   * 初始化搜索引擎
   */
  private initializeEngines(): void {
    this.keywordEngine = new KeywordSearchEngine(this.config);
    this.fuzzyEngine = new FuzzySearchEngine(this.config);
    this.semanticEngine = new SemanticSearchEngine(this.config);
    this.fusionEngine = new ResultFusionEngine(this.config);
    this.indexManager = new SearchIndexManager(this.config);
    this.personalizationEngine = new PersonalizationEngine(this.config);
    this.cache = new SearchCache(this.config);
    this.analytics = new SearchAnalytics(this.config);
  }

  /**
   * 重新初始化引擎（配置更新后）
   */
  private reinitializeEngines(): void {
    this.initializeEngines();
  }

  /**
   * 合并配置
   */
  private mergeConfig(config: Partial<UnifiedSearchConfig>): UnifiedSearchConfig {
    const defaultConfig: UnifiedSearchConfig = {
      scope: ['all'],
      mode: 'instant',
      personalization: true,
      maxResults: 20,
      groupByType: true,
      debounceMs: 300,
      enableCache: true,
      cacheTimeout: 300000, // 5分钟
      weights: this.getDefaultWeights()
    };

    return { ...defaultConfig, ...config };
  }

  /**
   * 获取默认权重配置
   */
  private getDefaultWeights(): SearchWeights {
    return {
      // 匹配类型权重
      exact: 1.0,
      partial: 0.8,
      fuzzy: 0.6,
      semantic: 0.7,
      
      // 字段权重
      title: 1.0,
      description: 0.8,
      content: 0.6,
      keywords: 0.9,
      tags: 0.7,
      
      // 其他因素权重
      freshness: 0.1,
      popularity: 0.2,
      userPreference: 0.3
    };
  }

  /**
   * 预处理搜索选项
   */
  private async preprocessSearch(options: SearchOptions): Promise<SearchOptions> {
    // 清理和规范化查询
    const cleanedQuery = this.cleanQuery(options.query);
    
    // 设置默认值
    const processedOptions: SearchOptions = {
      ...options,
      query: cleanedQuery,
      scope: options.scope || this.config.scope,
      mode: options.mode || this.config.mode,
      page: options.page || 1,
      pageSize: options.pageSize || this.config.maxResults,
      enableHighlight: options.enableHighlight ?? true,
      enableRecommendations: options.enableRecommendations ?? true
    };

    return processedOptions;
  }

  /**
   * 清理搜索查询
   */
  private cleanQuery(query: string): string {
    return query
      .trim()
      .replace(/\s+/g, ' ')  // 合并多个空格
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留字母、数字、空格和中文
      .toLowerCase();
  }

  /**
   * 执行多引擎搜索
   */
  private async executeMultiEngineSearch(options: SearchOptions): Promise<{
    keyword: SearchResult[];
    fuzzy: SearchResult[];
    semantic: SearchResult[];
  }> {
    const searchPromises = [];

    // 根据搜索模式选择引擎
    switch (options.mode) {
      case 'instant':
        // 快速模式：只使用关键词搜索
        searchPromises.push(
          this.keywordEngine.search(options),
          Promise.resolve({ results: [] }), // 空的fuzzy结果
          Promise.resolve({ results: [] })  // 空的semantic结果
        );
        break;
        
      case 'detailed':
        // 详细模式：使用关键词 + 模糊搜索
        searchPromises.push(
          this.keywordEngine.search(options),
          this.fuzzyEngine.search(options),
          Promise.resolve({ results: [] })  // 空的semantic结果
        );
        break;
        
      case 'semantic':
        // 语义模式：使用所有引擎
        searchPromises.push(
          this.keywordEngine.search(options),
          this.fuzzyEngine.search(options),
          this.semanticEngine.search(options)
        );
        break;
        
      default:
        // 默认使用关键词搜索
        searchPromises.push(
          this.keywordEngine.search(options),
          Promise.resolve({ results: [] }),
          Promise.resolve({ results: [] })
        );
    }

    const [keywordResponse, fuzzyResponse, semanticResponse] = await Promise.all(searchPromises);

    return {
      keyword: keywordResponse.results || [],
      fuzzy: fuzzyResponse.results || [],
      semantic: semanticResponse.results || []
    };
  }

  /**
   * 个性化结果
   */
  private async personalizeResults(
    results: SearchResult[], 
    userId?: string
  ): Promise<SearchResult[]> {
    if (!this.config.personalization || !userId) {
      return results;
    }

    try {
      return await this.personalizationEngine.personalizeResults(results, userId);
    } catch (error) {
      console.error('Personalization failed, returning original results:', error);
      return results;
    }
  }

  /**
   * 构建搜索响应
   */
  private async buildSearchResponse(
    results: SearchResult[],
    options: SearchOptions,
    startTime: number
  ): Promise<SearchResponse> {
    const searchTime = Date.now() - startTime;
    const totalResults = results.length;
    const page = options.page || 1;
    const pageSize = options.pageSize || this.config.maxResults;
    
    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    // 按类型分组（如果需要）
    const groupedResults = this.config.groupByType 
      ? this.groupResultsByType(paginatedResults)
      : undefined;

    // 生成建议和推荐
    const suggestions = await this.suggest(options.query);
    const recommendations = options.enableRecommendations && options.userId
      ? await this.getRecommendations(options.userId, 5)
      : [];

    return {
      results: paginatedResults,
      groupedResults,
      query: options.query,
      totalResults,
      searchTime,
      page,
      pageSize,
      hasMore: endIndex < totalResults,
      suggestions,
      relatedQueries: [], // TODO: 实现相关查询
      recommendations
    };
  }

  /**
   * 按类型分组结果
   */
  private groupResultsByType(results: SearchResult[]): Record<SearchResultType, SearchResult[]> {
    const groups: Record<SearchResultType, SearchResult[]> = {
      article: [],
      pdf: [],
      tool: [],
      guide: []
    };

    results.forEach(result => {
      if (groups[result.type]) {
        groups[result.type].push(result);
      }
    });

    return groups;
  }

  /**
   * 获取基于历史的建议
   */
  private async getHistoryBasedSuggestions(query: string, limit: number): Promise<string[]> {
    // TODO: 从搜索历史中获取建议
    return [];
  }

  /**
   * 获取基于内容的建议
   */
  private async getContentBasedSuggestions(query: string, limit: number): Promise<string[]> {
    // TODO: 从内容索引中获取建议
    return [];
  }

  /**
   * 获取热门建议
   */
  private async getPopularSuggestions(query: string, limit: number): Promise<string[]> {
    // TODO: 从热门搜索中获取建议
    return [];
  }

  /**
   * 对建议进行排序
   */
  private rankSuggestions(suggestions: string[], query: string): string[] {
    // TODO: 实现建议排序逻辑
    return suggestions;
  }
} 