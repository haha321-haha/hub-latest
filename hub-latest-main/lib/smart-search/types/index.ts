/**
 * 智能搜索系统核心类型定义
 */

// ========== 基础类型 ==========

export type SearchScope = 'articles' | 'pdfs' | 'tools' | 'guides' | 'all';
export type SearchMode = 'instant' | 'detailed' | 'semantic';
export type SearchResultType = 'article' | 'pdf' | 'tool' | 'guide';
export type MatchType = 'exact' | 'partial' | 'fuzzy' | 'semantic';

// ========== 搜索配置 ==========

export interface UnifiedSearchConfig {
  // 搜索范围
  scope: SearchScope[];
  
  // 搜索模式
  mode: SearchMode;
  
  // 个性化设置
  personalization: boolean;
  
  // 结果配置
  maxResults: number;
  groupByType: boolean;
  
  // 性能配置
  debounceMs: number;
  enableCache: boolean;
  cacheTimeout: number;
  
  // 搜索算法权重
  weights: SearchWeights;
}

export interface SearchWeights {
  // 匹配类型权重
  exact: number;
  partial: number;
  fuzzy: number;
  semantic: number;
  
  // 字段权重
  title: number;
  description: number;
  content: number;
  keywords: number;
  tags: number;
  
  // 其他因素权重
  freshness: number;    // 内容新鲜度
  popularity: number;   // 受欢迎程度
  userPreference: number; // 用户偏好
}

// ========== 搜索结果 ==========

export interface SearchResult {
  // 基础信息
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  
  // 匹配信息
  score: number;
  matchType: MatchType;
  matchedFields: string[];
  highlights: Highlight[];
  
  // 元数据
  category?: string;
  tags?: string[];
  keywords?: string[];
  lastModified?: string;
  
  // 个性化数据
  userScore?: number;
  isRecommended?: boolean;
  viewCount?: number;
  
  // 额外数据
  metadata?: Record<string, any>;
}

export interface Highlight {
  field: string;
  text: string;
  start: number;
  end: number;
}

export interface SearchResponse {
  // 搜索结果
  results: SearchResult[];
  groupedResults?: Record<SearchResultType, SearchResult[]>;
  
  // 搜索信息
  query: string;
  totalResults: number;
  searchTime: number;
  
  // 分页信息
  page: number;
  pageSize: number;
  hasMore: boolean;
  
  // 建议和推荐
  suggestions: string[];
  relatedQueries: string[];
  recommendations: SearchResult[];
  
  // 调试信息
  debug?: SearchDebugInfo;
}

export interface SearchDebugInfo {
  algorithmScores: Record<string, number>;
  processingSteps: string[];
  cacheHit: boolean;
  indexUsed: string[];
}

// ========== 搜索选项 ==========

export interface SearchOptions {
  // 基础选项
  query: string;
  scope?: SearchScope[];
  mode?: SearchMode;
  
  // 分页选项
  page?: number;
  pageSize?: number;
  
  // 过滤选项
  filters?: SearchFilters;
  
  // 排序选项
  sortBy?: SortOption;
  sortDirection?: SortDirection;
  
  // 高级选项
  enableHighlight?: boolean;
  enableRecommendations?: boolean;
  userId?: string;
}

export interface SearchFilters {
  type?: SearchResultType[];
  category?: string[];
  tags?: string[];
  keywords?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  minScore?: number;
}

export type SortOption = 'relevance' | 'date' | 'title' | 'popularity' | 'userScore';
export type SortDirection = 'asc' | 'desc';

// ========== 搜索引擎接口 ==========

export interface ISearchEngine {
  search(options: SearchOptions): Promise<SearchResponse>;
  suggest(query: string, limit?: number): Promise<string[]>;
  getRecommendations(userId: string, limit?: number): Promise<SearchResult[]>;
  buildIndex(): Promise<void>;
  clearIndex(): Promise<void>;
}

export interface IKeywordSearchEngine extends ISearchEngine {
  keywordSearch(query: string, options: KeywordSearchOptions): Promise<SearchResult[]>;
}

export interface IFuzzySearchEngine extends ISearchEngine {
  fuzzySearch(query: string, options: FuzzySearchOptions): Promise<SearchResult[]>;
}

export interface ISemanticSearchEngine extends ISearchEngine {
  semanticSearch(query: string, options: SemanticSearchOptions): Promise<SearchResult[]>;
}

// ========== 搜索算法选项 ==========

export interface KeywordSearchOptions {
  fields: string[];
  exactMatch: boolean;
  caseSensitive: boolean;
  stemming: boolean;
  synonyms: boolean;
}

export interface FuzzySearchOptions {
  threshold: number;        // 模糊匹配阈值 (0-1)
  maxDistance: number;      // 最大编辑距离
  includeMatches: boolean;  // 是否包含匹配信息
  ignoreLocation: boolean;  // 是否忽略位置
}

export interface SemanticSearchOptions {
  vectorSize: number;       // 向量维度
  similarity: 'cosine' | 'euclidean' | 'manhattan';
  threshold: number;        // 语义相似度阈值
  contextWindow: number;    // 上下文窗口大小
}

// ========== 用户行为和个性化 ==========

export interface UserBehavior {
  userId: string;
  action: UserAction;
  targetId: string;
  targetType: SearchResultType;
  query?: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export type UserAction = 'search' | 'click' | 'view' | 'download' | 'bookmark' | 'share';

export interface UserProfile {
  userId: string;
  preferences: UserPreferences;
  interests: string[];
  searchHistory: SearchHistoryItem[];
  behaviors: UserBehavior[];
  lastUpdated: number;
}

export interface UserPreferences {
  preferredTypes: SearchResultType[];
  preferredCategories: string[];
  searchMode: SearchMode;
  resultsPerPage: number;
  sortPreference: SortOption;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
  clickedResults: string[];
}

// ========== 推荐系统 ==========

export interface Recommendation {
  item: SearchResult;
  reason: RecommendationReason;
  confidence: number;
  source: RecommendationSource;
}

export type RecommendationReason = 
  | 'similar_content'     // 相似内容
  | 'user_interest'       // 用户兴趣
  | 'popular_content'     // 热门内容
  | 'recent_activity'     // 最近活动
  | 'collaborative_filtering'; // 协同过滤

export type RecommendationSource = 'behavior' | 'content' | 'collaborative' | 'popularity';

// ========== 搜索意图识别 ==========

export interface SearchIntent {
  type: IntentType;
  confidence: number;
  entities: IntentEntity[];
  context: IntentContext;
}

export type IntentType = 
  | 'informational'       // 信息查询
  | 'navigational'        // 导航查询
  | 'transactional'       // 交易查询
  | 'comparison'          // 比较查询
  | 'troubleshooting';    // 问题解决

export interface IntentEntity {
  text: string;
  type: string;
  confidence: number;
  position: [number, number];
}

export interface IntentContext {
  domain: string;
  urgency: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
  userType: 'beginner' | 'intermediate' | 'expert';
}

// ========== 搜索分析和监控 ==========

export interface SearchAnalytics {
  // 搜索统计
  totalSearches: number;
  uniqueQueries: number;
  averageResultsPerQuery: number;
  
  // 性能指标
  averageResponseTime: number;
  cacheHitRate: number;
  
  // 用户行为
  clickThroughRate: number;
  searchSuccessRate: number;
  averageSessionDuration: number;
  
  // 热门内容
  topQueries: QueryStats[];
  topResults: ResultStats[];
  
  // 时间范围
  startDate: string;
  endDate: string;
}

export interface QueryStats {
  query: string;
  count: number;
  averageResults: number;
  clickThroughRate: number;
}

export interface ResultStats {
  resultId: string;
  title: string;
  viewCount: number;
  clickRate: number;
  averagePosition: number;
}

// ========== 错误处理 ==========

export interface SearchError extends Error {
  code: SearchErrorCode;
  details?: Record<string, any>;
}

export type SearchErrorCode = 
  | 'INVALID_QUERY'
  | 'INDEX_NOT_READY'
  | 'SEARCH_TIMEOUT'
  | 'INSUFFICIENT_RESULTS'
  | 'USER_NOT_FOUND'
  | 'CONFIGURATION_ERROR';

// ========== 导出所有类型 ==========

// 其他类型文件将在后续添加
// export * from './engines';
// export * from './providers';  
// export * from './utils'; 