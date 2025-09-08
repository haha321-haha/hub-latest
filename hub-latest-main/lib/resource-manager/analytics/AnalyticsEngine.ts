/**
 * Period Hub Analytics Engine
 * 分析引擎
 */

import { 
  EnterpriseResource, 
  ResourceAnalyticsReport,
  ResourceManagerConfig,
  ResourceType,
  ResourceStatus,
  ResourceSearchFilters,
  ResourceUsageStats
} from '../types';

export class AnalyticsEngine {
  private config: ResourceManagerConfig;
  private operationHistory: Array<{
    timestamp: Date;
    operation: string;
    resourceId: string;
    resourceType: ResourceType;
  }> = [];

  private searchHistory: Array<{
    timestamp: Date;
    searchTerm: string;
    filters: ResourceSearchFilters;
    resultCount: number;
    searchTime: number;
  }> = [];

  constructor(config: ResourceManagerConfig) {
    this.config = config;
  }

  /**
   * 初始化分析引擎
   */
  async initialize(): Promise<void> {
    // 初始化分析引擎
  }

  /**
   * 记录操作
   */
  async recordOperation(
    operation: string, 
    resourceId: string, 
    resourceType: ResourceType
  ): Promise<void> {
    this.operationHistory.push({
      timestamp: new Date(),
      operation,
      resourceId,
      resourceType
    });

    // 保持历史记录在合理范围内
    if (this.operationHistory.length > 10000) {
      this.operationHistory = this.operationHistory.slice(-5000);
    }
  }

  /**
   * 记录搜索
   */
  async recordSearch(
    searchTerm: string, 
    filters: ResourceSearchFilters, 
    resultCount: number, 
    searchTime: number
  ): Promise<void> {
    this.searchHistory.push({
      timestamp: new Date(),
      searchTerm,
      filters,
      resultCount,
      searchTime
    });

    // 保持历史记录在合理范围内
    if (this.searchHistory.length > 10000) {
      this.searchHistory = this.searchHistory.slice(-5000);
    }
  }

  /**
   * 生成分析报告
   */
  async generateReport(
    resources: Map<string, EnterpriseResource>
  ): Promise<ResourceAnalyticsReport> {
    const resourceArray = Array.from(resources.values());
    
    const report: ResourceAnalyticsReport = {
      totalResources: resourceArray.length,
      resourcesByType: this.getResourcesByType(resourceArray),
      resourcesByStatus: this.getResourcesByStatus(resourceArray),
      resourcesByCategory: this.getResourcesByCategory(resourceArray),
      topTags: this.getTopTags(resourceArray),
      popularResources: this.getPopularResources(resourceArray),
      recentActivity: this.getRecentActivity(),
      performanceMetrics: this.getPerformanceMetrics()
    };

    return report;
  }

  /**
   * 按类型统计资源
   */
  private getResourcesByType(resources: EnterpriseResource[]): Record<ResourceType, number> {
    const typeCount: Record<ResourceType, number> = {
      [ResourceType.ARTICLE]: 0,
      [ResourceType.PDF]: 0,
      [ResourceType.INTERACTIVE_TOOL]: 0,
      [ResourceType.VIDEO]: 0,
      [ResourceType.AUDIO]: 0,
      [ResourceType.INFOGRAPHIC]: 0
    };

    resources.forEach(resource => {
      typeCount[resource.type] = (typeCount[resource.type] || 0) + 1;
    });

    return typeCount;
  }

  /**
   * 按状态统计资源
   */
  private getResourcesByStatus(resources: EnterpriseResource[]): Record<ResourceStatus, number> {
    const statusCount: Record<ResourceStatus, number> = {
      [ResourceStatus.ACTIVE]: 0,
      [ResourceStatus.DRAFT]: 0,
      [ResourceStatus.ARCHIVED]: 0,
      [ResourceStatus.PENDING]: 0,
      [ResourceStatus.DEPRECATED]: 0
    };

    resources.forEach(resource => {
      statusCount[resource.status] = (statusCount[resource.status] || 0) + 1;
    });

    return statusCount;
  }

  /**
   * 按分类统计资源
   */
  private getResourcesByCategory(resources: EnterpriseResource[]): Record<string, number> {
    const categoryCount: Record<string, number> = {};

    resources.forEach(resource => {
      const category = resource.categoryId;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return categoryCount;
  }

  /**
   * 获取热门标签
   */
  private getTopTags(resources: EnterpriseResource[]): Array<{ tag: string; count: number }> {
    const tagCount: Record<string, number> = {};

    resources.forEach(resource => {
      resource.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * 获取热门资源
   */
  private getPopularResources(resources: EnterpriseResource[]): Array<{ 
    id: string; 
    title: string; 
    stats: ResourceUsageStats 
  }> {
    return resources
      .filter(resource => resource.stats)
      .sort((a, b) => b.stats.popularityScore - a.stats.popularityScore)
      .slice(0, 10)
      .map(resource => ({
        id: resource.id,
        title: resource.title[this.config.defaultLanguage] || Object.values(resource.title)[0] || 'Untitled',
        stats: resource.stats
      }));
  }

  /**
   * 获取最近活动
   */
  private getRecentActivity(): Array<{ 
    date: Date; 
    action: string; 
    resourceId: string 
  }> {
    return this.operationHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20)
      .map(op => ({
        date: op.timestamp,
        action: op.operation,
        resourceId: op.resourceId
      }));
  }

  /**
   * 获取性能指标
   */
  private getPerformanceMetrics(): {
    averageSearchTime: number;
    averageLoadTime: number;
    errorRate: number;
    cacheHitRate: number;
  } {
    const recentSearches = this.searchHistory.slice(-100);
    const averageSearchTime = recentSearches.length > 0 
      ? recentSearches.reduce((sum, search) => sum + search.searchTime, 0) / recentSearches.length
      : 0;

    return {
      averageSearchTime,
      averageLoadTime: 0, // 需要从其他系统获取
      errorRate: 0, // 需要从错误日志计算
      cacheHitRate: 0 // 需要从缓存系统获取
    };
  }

  /**
   * 获取搜索趋势
   */
  async getSearchTrends(days: number = 30): Promise<Array<{
    date: string;
    searchCount: number;
    topTerms: string[];
  }>> {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const recentSearches = this.searchHistory.filter(search => 
      search.timestamp >= cutoffDate
    );

    const dailyStats: Record<string, { 
      count: number; 
      terms: Record<string, number> 
    }> = {};

    recentSearches.forEach(search => {
      const dateKey = search.timestamp.toISOString().split('T')[0];
      
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { count: 0, terms: {} };
      }
      
      dailyStats[dateKey].count++;
      
      if (search.searchTerm) {
        const term = search.searchTerm.toLowerCase();
        dailyStats[dateKey].terms[term] = (dailyStats[dateKey].terms[term] || 0) + 1;
      }
    });

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      searchCount: stats.count,
      topTerms: Object.entries(stats.terms)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([term]) => term)
    }));
  }

  /**
   * 获取用户行为洞察
   */
  async getUserBehaviorInsights(): Promise<{
    mostSearchedTerms: string[];
    averageSessionTime: number;
    bounceRate: number;
    conversionRate: number;
  }> {
    const recentSearches = this.searchHistory.slice(-1000);
    
    const termCount: Record<string, number> = {};
    recentSearches.forEach(search => {
      if (search.searchTerm) {
        const term = search.searchTerm.toLowerCase();
        termCount[term] = (termCount[term] || 0) + 1;
      }
    });

    const mostSearchedTerms = Object.entries(termCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term]) => term);

    return {
      mostSearchedTerms,
      averageSessionTime: 0, // 需要从用户会话数据获取
      bounceRate: 0, // 需要从用户行为数据获取
      conversionRate: 0 // 需要从转化数据获取
    };
  }

  /**
   * 获取内容效果分析
   */
  async getContentEffectiveness(): Promise<{
    topPerformingContent: Array<{ id: string; title: string; score: number }>;
    underperformingContent: Array<{ id: string; title: string; score: number }>;
    contentGaps: string[];
  }> {
    // 基于搜索历史和资源统计分析内容效果
    const searchTerms = this.searchHistory.map(s => s.searchTerm).filter(Boolean);
    const termFrequency: Record<string, number> = {};
    
    searchTerms.forEach(term => {
      termFrequency[term] = (termFrequency[term] || 0) + 1;
    });

    const contentGaps = Object.entries(termFrequency)
      .filter(([, count]) => count > 5) // 被搜索多次但可能缺少相关内容
      .map(([term]) => term)
      .slice(0, 10);

    return {
      topPerformingContent: [],
      underperformingContent: [],
      contentGaps
    };
  }
} 