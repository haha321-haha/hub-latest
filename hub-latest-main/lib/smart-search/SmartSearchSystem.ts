/**
 * 智能搜索系统集成入口
 * 整合所有智能搜索组件，提供统一的API接口
 */

import { SpellChecker } from './spell-correction/SpellChecker';
import { SynonymEngine } from './synonym-expansion/SynonymEngine';
import { IntentClassifier } from './intent-recognition/IntentClassifier';
import { SemanticMatcher } from './semantic-search/SemanticMatcher';
import { RecommendationEngine, RecommendationItem, RecommendationResult } from './personalization/RecommendationEngine';
import { LearningSystem } from './personalization/LearningSystem';
import { BehaviorTracker, EventType } from './personalization/BehaviorTracker';
import { UserProfileBuilder, UserProfile } from './personalization/UserProfileBuilder';

export interface SmartSearchOptions {
  query: string;
  userId?: string;
  searchMode?: 'instant' | 'detailed' | 'semantic';
  maxResults?: number;
  includeRecommendations?: boolean;
  enableSpellCorrection?: boolean;
  enableSynonymExpansion?: boolean;
  enableIntentRecognition?: boolean;
  enablePersonalization?: boolean;
  category?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  page?: number;
  pageSize?: number;
}

export interface SmartSearchResult {
  // 搜索结果
  results: SearchResultItem[];
  totalResults: number;
  
  // 查询处理
  originalQuery: string;
  processedQuery: string;
  correctedQuery?: string;
  expandedQueries: string[];
  
  // 意图识别
  intent: {
    type: string;
    confidence: number;
    urgency: string;
    category: string;
  };
  
  // 推荐内容
  recommendations: RecommendationItem[];
  
  // 搜索元数据
  searchTime: number;
  searchMode: string;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  
  // 用户洞察
  userInsights?: {
    profileCompleteness: number;
    searchHistory: string[];
    preferredCategories: string[];
    personalizationLevel: number;
  };
  
  // 系统信息
  systemInfo: {
    responseTime: number;
    cacheHit: boolean;
    modelVersion: string;
    confidence: number;
  };
}

export interface SearchResultItem {
  id: string;
  type: 'article' | 'pdf' | 'tool' | 'page';
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  semanticScore: number;
  popularityScore: number;
  personalizedScore: number;
  finalScore: number;
  highlightedContent?: string;
  metadata: {
    author?: string;
    publishDate?: string;
    readTime?: number;
    difficulty?: string;
    format?: string;
    language?: string;
  };
  reasons: string[]; // 推荐理由
}

export interface SearchAnalytics {
  queryId: string;
  userId?: string;
  query: string;
  resultsCount: number;
  clickedResults: string[];
  searchTime: number;
  userSatisfied: boolean;
  improvements: string[];
  timestamp: number;
}

export class SmartSearchSystem {
  private spellChecker!: SpellChecker;
  private synonymEngine!: SynonymEngine;
  private intentClassifier!: IntentClassifier;
  private semanticMatcher!: SemanticMatcher;
  private recommendationEngine!: RecommendationEngine;
  private learningSystem!: LearningSystem;
  private behaviorTracker!: BehaviorTracker;
  private userProfileBuilder!: UserProfileBuilder;
  
  private searchCache: Map<string, SmartSearchResult>;
  private cacheExpiration: number = 5 * 60 * 1000; // 5分钟
  private isInitialized: boolean = false;
  private systemStartTime: number;

  constructor() {
    this.systemStartTime = Date.now();
    this.searchCache = new Map();
    this.initializeComponents();
  }

  /**
   * 初始化所有组件
   */
  private async initializeComponents(): Promise<void> {
    try {
      // 初始化核心组件
      this.spellChecker = new SpellChecker();
      this.synonymEngine = new SynonymEngine();
      this.intentClassifier = new IntentClassifier();
      this.semanticMatcher = new SemanticMatcher();
      
      // 初始化个性化组件
      this.behaviorTracker = new BehaviorTracker();
      this.userProfileBuilder = new UserProfileBuilder(this.behaviorTracker);
      this.recommendationEngine = new RecommendationEngine();
      this.learningSystem = new LearningSystem(this.behaviorTracker);
      
      // 加载默认内容数据
      await this.loadDefaultContent();
      
      this.isInitialized = true;
      console.log('✅ Smart Search System initialized successfully');
    } catch (error) {
      console.error('❌ Smart Search System initialization failed:', error);
      throw error;
    }
  }

  /**
   * 智能搜索主入口
   */
  async search(options: SmartSearchOptions): Promise<SmartSearchResult> {
    const startTime = Date.now();
    
    // 检查初始化状态
    if (!this.isInitialized) {
      await this.initializeComponents();
    }

    // 设置默认选项
    const searchOptions: Required<SmartSearchOptions> = {
      query: options.query,
      userId: options.userId || '',
      searchMode: options.searchMode || 'detailed',
      maxResults: options.maxResults || 10,
      includeRecommendations: options.includeRecommendations ?? true,
      enableSpellCorrection: options.enableSpellCorrection ?? true,
      enableSynonymExpansion: options.enableSynonymExpansion ?? true,
      enableIntentRecognition: options.enableIntentRecognition ?? true,
      enablePersonalization: options.enablePersonalization ?? true,
      category: options.category || '',
      urgency: options.urgency || 'medium',
      page: options.page || 1,
      pageSize: options.pageSize || 10
    };

    // 生成查询ID
    const queryId = this.generateQueryId(searchOptions);
    
    // 检查缓存
    const cached = this.getCachedResult(queryId);
    if (cached) {
      this.recordSearchAnalytics(queryId, searchOptions, cached, startTime, true);
      return cached;
    }

    try {
      // 1. 记录搜索行为
      if (searchOptions.userId) {
        this.behaviorTracker.recordEvent({
          userId: searchOptions.userId,
          sessionId: 'session-' + Date.now(),
          type: EventType.SEARCH,
          data: {
            query: searchOptions.query,
            searchMode: searchOptions.searchMode,
            category: searchOptions.category
          },
          context: {
            page: 'search',
            userAgent: 'SmartSearchSystem',
            deviceType: 'desktop',
            language: 'zh'
          }
        });
      }

      // 2. 查询预处理
      const processedQuery = await this.preprocessQuery(searchOptions);
      
      // 3. 意图识别
      const intent = await this.identifyIntent(processedQuery);
      
      // 4. 执行搜索
      const searchResults = await this.executeSearch(processedQuery, intent, searchOptions);
      
      // 5. 生成推荐
      const recommendations = await this.generateRecommendations(searchOptions, intent);
      
      // 6. 获取用户洞察
      const userInsights = await this.getUserInsights(searchOptions.userId);
      
      // 7. 构建最终结果
      const result = this.buildSearchResult(
        searchOptions,
        processedQuery,
        searchResults,
        recommendations,
        intent,
        userInsights,
        startTime
      );

      // 8. 缓存结果
      this.cacheResult(queryId, result);

      // 9. 记录分析数据
      this.recordSearchAnalytics(queryId, searchOptions, result, startTime, false);

      return result;

    } catch (error) {
      console.error('Search error:', error);
      throw new Error(`搜索失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const suggestions: string[] = [];
    
    // 拼写纠错建议
    if (this.spellChecker) {
      const corrected = await this.spellChecker.checkAndCorrect(query);
      if (corrected !== query) {
        suggestions.push(corrected);
      }
    }

    // 同义词扩展建议
    if (this.synonymEngine) {
      const expanded = await this.synonymEngine.expandQuery(query);
      suggestions.push(...expanded.synonyms.slice(0, 3));
    }

    // 去重并限制数量
    return [...new Set(suggestions)].slice(0, limit);
  }

  /**
   * 记录用户反馈
   */
  async recordFeedback(
    userId: string,
    queryId: string,
    resultId: string,
    feedbackType: 'positive' | 'negative' | 'neutral',
    feedbackValue: number
  ): Promise<void> {
    if (!userId || !queryId || !resultId) return;

    // 记录到学习系统
    await this.learningSystem.recordFeedback({
      userId,
      contentId: resultId,
      recommendationId: queryId,
      feedbackType,
      feedbackValue,
      timestamp: Date.now(),
      context: {
        recommendation_position: 0,
        recommendation_score: 0.5,
        user_session: '',
        page_context: 'search_results',
        interaction_type: 'explicit'
      }
    });

    // 记录到行为追踪
    this.behaviorTracker.recordEvent({
      userId,
      sessionId: 'session-' + Date.now(),
      type: EventType.RATING,
      data: {
        queryId,
        resultId,
        feedbackType,
        feedbackValue
      },
      context: {
        page: 'feedback',
        userAgent: 'SmartSearchSystem',
        deviceType: 'desktop',
        language: 'zh'
      }
    });
  }

  /**
   * 获取用户个性化洞察
   */
  async getPersonalizedInsights(userId: string): Promise<any> {
    if (!userId) return null;

    const userProfile = await this.userProfileBuilder.buildProfile(userId);
    return this.learningSystem.getPersonalizedInsights(userId);
  }

  /**
   * 获取系统统计信息
   */
  getSystemStats(): {
    uptime: number;
    totalSearches: number;
    cacheHitRate: number;
    averageResponseTime: number;
    userProfiles: number;
    contentItems: number;
  } {
    const uptime = Date.now() - this.systemStartTime;
    
    return {
      uptime,
      totalSearches: this.behaviorTracker.getTotalEvents('search'),
      cacheHitRate: this.calculateCacheHitRate(),
      averageResponseTime: this.calculateAverageResponseTime(),
      userProfiles: this.userProfileBuilder.getProfileCount(),
      contentItems: this.getContentItemCount()
    };
  }

  // ========== 私有方法 ==========

  /**
   * 预处理查询
   */
  private async preprocessQuery(options: SmartSearchOptions): Promise<{
    originalQuery: string;
    processedQuery: string;
    correctedQuery?: string;
    expandedQueries: string[];
  }> {
    const { query } = options;
    let processedQuery = query.trim().toLowerCase();
    let correctedQuery: string | undefined;
    let expandedQueries: string[] = [];

    // 拼写纠错
    if (options.enableSpellCorrection) {
      correctedQuery = await this.spellChecker.checkAndCorrect(query);
      if (correctedQuery !== query) {
        processedQuery = correctedQuery;
      }
    }

    // 同义词扩展
    if (options.enableSynonymExpansion) {
      const expanded = await this.synonymEngine.expandQuery(processedQuery);
      expandedQueries = expanded.synonyms;
    }

    return {
      originalQuery: query,
      processedQuery,
      correctedQuery,
      expandedQueries
    };
  }

  /**
   * 识别搜索意图
   */
  private async identifyIntent(processedQuery: any): Promise<{
    type: string;
    confidence: number;
    urgency: string;
    category: string;
  }> {
    const result = await this.intentClassifier.classifyQuery(processedQuery.processedQuery);
    
    return {
      type: result.intent,
      confidence: result.confidence,
      urgency: result.urgency,
      category: result.intent // 使用intent作为category
    };
  }

  /**
   * 执行搜索
   */
  private async executeSearch(
    processedQuery: any,
    intent: any,
    options: SmartSearchOptions
  ): Promise<SearchResultItem[]> {
    // 模拟搜索结果
    const mockResults: SearchResultItem[] = [
      {
        id: 'result-1',
        type: 'article',
        title: '5分钟快速缓解痛经的自然方法',
        description: '介绍几种简单有效的自然疼痛缓解方法',
        url: '/articles/quick-relief-methods',
        category: 'immediate_relief',
        tags: ['pain_relief', 'natural_methods', 'quick_solutions'],
        relevanceScore: 0.9,
        semanticScore: 0.85,
        popularityScore: 0.8,
        personalizedScore: 0.9,
        finalScore: 0.88,
        highlightedContent: '使用热敷、深呼吸和穴位按摩可以在5分钟内显著缓解疼痛...',
        metadata: {
          author: 'Dr. Sarah Chen',
          publishDate: '2024-01-15',
          readTime: 5,
          difficulty: 'beginner',
          format: 'article',
          language: 'zh'
        },
        reasons: ['查询意图匹配', '内容相关性高', '用户偏好匹配']
      },
      {
        id: 'result-2',
        type: 'pdf',
        title: '痛经管理完全指南',
        description: '全面的痛经预防、治疗和管理策略',
        url: '/pdf/complete-pain-management-guide',
        category: 'comprehensive_guide',
        tags: ['pain_management', 'comprehensive', 'medical_advice'],
        relevanceScore: 0.8,
        semanticScore: 0.9,
        popularityScore: 0.7,
        personalizedScore: 0.75,
        finalScore: 0.8,
        highlightedContent: '本指南涵盖了从药物治疗到生活方式调整的全面策略...',
        metadata: {
          author: 'Women\'s Health Institute',
          publishDate: '2024-02-01',
          readTime: 25,
          difficulty: 'intermediate',
          format: 'pdf',
          language: 'zh'
        },
        reasons: ['权威性强', '内容全面', '专业推荐']
      }
    ];

    // 根据意图调整结果排序
    if (intent.urgency === 'high' || intent.urgency === 'critical') {
      return mockResults.filter(r => r.category === 'immediate_relief');
    }

    return mockResults;
  }

  /**
   * 生成推荐
   */
  private async generateRecommendations(
    options: SmartSearchOptions,
    intent: any
  ): Promise<RecommendationItem[]> {
    if (!options.includeRecommendations || !options.userId) {
      return [];
    }

    const userProfile = await this.userProfileBuilder.buildProfile(options.userId);
    const recommendations = await this.recommendationEngine.generateRecommendations(
      userProfile,
      {
        maxRecommendations: 5,
        includeExplanations: true
      }
    );

    return recommendations.recommendations;
  }

  /**
   * 获取用户洞察
   */
  private async getUserInsights(userId?: string): Promise<any> {
    if (!userId) return undefined;

    const userProfile = await this.userProfileBuilder.buildProfile(userId);
    const insights = await this.learningSystem.getPersonalizedInsights(userId);
    
    return {
      profileCompleteness: this.calculateProfileCompleteness(userProfile),
      searchHistory: this.getRecentSearchHistory(userId),
      preferredCategories: userProfile.interestTopics.map(t => t.topic),
      personalizationLevel: insights.learningProgress
    };
  }

  /**
   * 构建搜索结果
   */
  private buildSearchResult(
    options: SmartSearchOptions,
    processedQuery: any,
    searchResults: SearchResultItem[],
    recommendations: RecommendationItem[],
    intent: any,
    userInsights: any,
    startTime: number
  ): SmartSearchResult {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 分页处理
    const totalResults = searchResults.length;
    const totalPages = Math.ceil(totalResults / options.pageSize!);
    const startIndex = (options.page! - 1) * options.pageSize!;
    const endIndex = startIndex + options.pageSize!;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    return {
      results: paginatedResults,
      totalResults,
      originalQuery: processedQuery.originalQuery,
      processedQuery: processedQuery.processedQuery,
      correctedQuery: processedQuery.correctedQuery,
      expandedQueries: processedQuery.expandedQueries,
      intent,
      recommendations,
      searchTime: responseTime,
      searchMode: options.searchMode!,
      pagination: {
        page: options.page!,
        pageSize: options.pageSize!,
        totalPages,
        hasNext: options.page! < totalPages,
        hasPrevious: options.page! > 1
      },
      userInsights,
      systemInfo: {
        responseTime,
        cacheHit: false,
        modelVersion: '1.0.0',
        confidence: 0.85
      }
    };
  }

  /**
   * 生成查询ID
   */
  private generateQueryId(options: SmartSearchOptions): string {
    const key = `${options.query}_${options.userId}_${options.searchMode}_${options.category}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * 获取缓存结果
   */
  private getCachedResult(queryId: string): SmartSearchResult | null {
    const cached = this.searchCache.get(queryId);
    if (cached) {
      const age = Date.now() - cached.systemInfo.responseTime;
      if (age < this.cacheExpiration) {
        return { ...cached, systemInfo: { ...cached.systemInfo, cacheHit: true } };
      } else {
        this.searchCache.delete(queryId);
      }
    }
    return null;
  }

  /**
   * 缓存结果
   */
  private cacheResult(queryId: string, result: SmartSearchResult): void {
    this.searchCache.set(queryId, result);
    
    // 限制缓存大小
    if (this.searchCache.size > 1000) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }
  }

  /**
   * 记录搜索分析
   */
  private recordSearchAnalytics(
    queryId: string,
    options: SmartSearchOptions,
    result: SmartSearchResult,
    startTime: number,
    fromCache: boolean
  ): void {
    const analytics: SearchAnalytics = {
      queryId,
      userId: options.userId,
      query: options.query,
      resultsCount: result.totalResults,
      clickedResults: [],
      searchTime: result.searchTime,
      userSatisfied: result.totalResults > 0,
      improvements: [],
      timestamp: Date.now()
    };

    // 这里可以发送到分析服务或存储
    console.log('Search Analytics:', analytics);
  }

  /**
   * 加载默认内容
   */
  private async loadDefaultContent(): Promise<void> {
    // 模拟加载内容数据
    const mockContent = [
      {
        id: 'content-1',
        type: 'article' as const,
        title: '5分钟快速缓解痛经',
        description: '快速有效的疼痛缓解方法',
        category: 'immediate_relief',
        tags: ['pain_relief', 'quick_methods'],
        difficulty: 'beginner' as const,
        urgency: 'high' as const,
        popularity: 0.8,
        quality: 0.9,
        lastUpdated: Date.now(),
        metadata: {}
      }
    ];

    // 添加到推荐引擎
    this.recommendationEngine.addContentBatch(mockContent);
  }

  /**
   * 计算个人资料完整度
   */
  private calculateProfileCompleteness(profile: UserProfile): number {
    const weights = {
      demographics: 0.2,
      healthProfile: 0.3,
      behaviorProfile: 0.3,
      preferences: 0.2
    };

    let completeness = 0;
    if (profile.demographics) completeness += weights.demographics;
    if (profile.healthProfile) completeness += weights.healthProfile;
    if (profile.behaviorProfile) completeness += weights.behaviorProfile;
    if (profile.preferences) completeness += weights.preferences;

    return completeness;
  }

  /**
   * 获取最近搜索历史
   */
  private getRecentSearchHistory(userId: string): string[] {
    const events = this.behaviorTracker.getUserEvents(userId, 'search');
    return events.slice(-10).map(e => e.data.query || '').filter(q => q);
  }

  /**
   * 计算缓存命中率
   */
  private calculateCacheHitRate(): number {
    // 简化实现，实际应该统计实际的缓存命中数据
    return 0.75;
  }

  /**
   * 计算平均响应时间
   */
  private calculateAverageResponseTime(): number {
    // 简化实现，实际应该统计实际的响应时间数据
    return 150;
  }

  /**
   * 获取内容项数量
   */
  private getContentItemCount(): number {
    // 简化实现，实际应该从推荐引擎获取
    return 150;
  }
} 