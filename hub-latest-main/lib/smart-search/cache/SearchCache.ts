/**
 * 搜索缓存
 * 管理搜索结果的缓存存储
 */

import { SearchOptions, SearchResponse, UnifiedSearchConfig } from '../types';

export class SearchCache {
  private config: UnifiedSearchConfig;
  private cache: Map<string, { response: SearchResponse; timestamp: number }> = new Map();

  constructor(config: UnifiedSearchConfig) {
    this.config = config;
  }

  /**
   * 获取缓存的搜索结果
   */
  async get(options: SearchOptions): Promise<SearchResponse | null> {
    if (!this.config.enableCache) return null;

    const key = this.generateCacheKey(options);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // 检查是否过期
    const isExpired = Date.now() - cached.timestamp > this.config.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  /**
   * 设置缓存
   */
  async set(options: SearchOptions, response: SearchResponse): Promise<void> {
    if (!this.config.enableCache) return;

    const key = this.generateCacheKey(options);
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });

    // 清理过期缓存
    this.cleanup();
  }

  /**
   * 清除所有缓存
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(options: SearchOptions): string {
    return JSON.stringify({
      query: options.query,
      scope: options.scope,
      mode: options.mode,
      filters: options.filters,
      page: options.page,
      pageSize: options.pageSize
    });
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.config.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }
} 