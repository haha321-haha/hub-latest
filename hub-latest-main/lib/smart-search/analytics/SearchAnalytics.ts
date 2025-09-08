/**
 * 搜索分析
 * 收集和分析搜索行为数据
 */

import { SearchOptions, SearchResponse, SearchError, UnifiedSearchConfig } from '../types';

export class SearchAnalytics {
  private config: UnifiedSearchConfig;
  private searchLog: any[] = [];

  constructor(config: UnifiedSearchConfig) {
    this.config = config;
  }

  /**
   * 记录搜索事件
   */
  async recordSearch(
    options: SearchOptions, 
    response: SearchResponse, 
    fromCache: boolean = false
  ): Promise<void> {
    const searchEvent = {
      timestamp: Date.now(),
      query: options.query,
      mode: options.mode,
      scope: options.scope,
      resultsCount: response.totalResults,
      searchTime: response.searchTime,
      fromCache,
      userId: options.userId
    };

    this.searchLog.push(searchEvent);
    
    // 限制日志大小
    if (this.searchLog.length > 1000) {
      this.searchLog = this.searchLog.slice(-500);
    }
  }

  /**
   * 记录搜索错误
   */
  async recordError(error: SearchError, options: SearchOptions): Promise<void> {
    const errorEvent = {
      timestamp: Date.now(),
      error: error.code,
      message: error.message,
      query: options.query,
      userId: options.userId
    };

    console.error('Search error recorded:', errorEvent);
  }

  /**
   * 获取搜索分析数据
   */
  async getAnalytics(dateRange?: { start: string; end: string }): Promise<any> {
    const startTime = dateRange ? new Date(dateRange.start).getTime() : 0;
    const endTime = dateRange ? new Date(dateRange.end).getTime() : Date.now();
    
    const filteredLogs = this.searchLog.filter(log => 
      log.timestamp >= startTime && log.timestamp <= endTime
    );

    return {
      totalSearches: filteredLogs.length,
      uniqueQueries: new Set(filteredLogs.map(log => log.query)).size,
      averageResultsPerQuery: filteredLogs.reduce((sum, log) => sum + log.resultsCount, 0) / filteredLogs.length || 0,
      averageResponseTime: filteredLogs.reduce((sum, log) => sum + log.searchTime, 0) / filteredLogs.length || 0,
      cacheHitRate: filteredLogs.filter(log => log.fromCache).length / filteredLogs.length || 0,
      topQueries: this.getTopQueries(filteredLogs),
      startDate: dateRange?.start || new Date(0).toISOString(),
      endDate: dateRange?.end || new Date().toISOString()
    };
  }

  /**
   * 获取热门搜索词
   */
  private getTopQueries(logs: any[]): any[] {
    const queryCount = new Map<string, number>();
    
    logs.forEach(log => {
      const count = queryCount.get(log.query) || 0;
      queryCount.set(log.query, count + 1);
    });

    return Array.from(queryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }
} 