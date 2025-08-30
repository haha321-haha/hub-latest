/**
 * Period Hub Cache Manager
 * 缓存管理器
 */

import { ResourceManagerConfig } from '../types';

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private config: ResourceManagerConfig;

  constructor(config: ResourceManagerConfig) {
    this.config = config;
  }

  /**
   * 初始化缓存管理器
   */
  async initialize(): Promise<void> {
    // 启动清理定时器
    if (this.config.cacheEnabled) {
      setInterval(() => {
        this.cleanup();
      }, 60000); // 每分钟清理一次过期缓存
    }
  }

  /**
   * 获取缓存数据
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.config.cacheEnabled) {
      return null;
    }

    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    // 检查是否过期
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * 设置缓存数据
   */
  async set(key: string, data: any, ttl: number): Promise<void> {
    if (!this.config.cacheEnabled) {
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * 删除缓存数据
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * 清除匹配模式的缓存
   */
  async clearPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete = Array.from(this.cache.keys()).filter(key => regex.test(key));
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl * 1000) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    hitRate: number;
    missRate: number;
  } {
    return {
      size: this.cache.size,
      hitRate: 0, // 这里需要实现命中率统计
      missRate: 0
    };
  }
} 