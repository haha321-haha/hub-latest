'use client';

// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags?: string[];
}

// 缓存配置
interface CacheConfig {
  maxSize: number; // 最大缓存项数量
  defaultTTL: number; // 默认生存时间（毫秒）
  cleanupInterval: number; // 清理间隔（毫秒）
  enableCompression: boolean; // 是否启用压缩
  enablePersistence: boolean; // 是否持久化到localStorage
}

// 缓存统计
interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage: number;
  oldestItem: number;
  newestItem: number;
}

// 高级缓存管理器
export class AdvancedCacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private stats = {
    hits: 0,
    misses: 0,
  };
  private cleanupTimer?: NodeJS.Timeout;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5分钟
      cleanupInterval: 60 * 1000, // 1分钟
      enableCompression: false,
      enablePersistence: true,
      ...config,
    };

    this.startCleanupTimer();
    this.loadFromPersistence();
  }

  // 设置缓存项
  set<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      priority?: 'low' | 'normal' | 'high';
    } = {}
  ): void {
    const { ttl = this.config.defaultTTL, tags = [], priority = 'normal' } = options;
    
    const now = Date.now();
    const item: CacheItem<T> = {
      data: this.config.enableCompression ? this.compress(data) as T : data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      tags,
    };

    // 如果缓存已满，根据LRU策略移除项目
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, item);
    this.saveToPersistence();
  }

  // 获取缓存项
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    // 检查是否过期
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // 更新访问统计
    item.accessCount++;
    item.lastAccessed = now;
    this.stats.hits++;

    const data = this.config.enableCompression ? this.decompress(item.data) : item.data;
    return data;
  }

  // 检查缓存项是否存在且未过期
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // 删除缓存项
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.saveToPersistence();
    return result;
  }

  // 根据标签删除缓存项
  deleteByTag(tag: string): number {
    let deletedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.tags?.includes(tag)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    this.saveToPersistence();
    return deletedCount;
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.saveToPersistence();
  }

  // 获取缓存统计
  getStats(): CacheStats {
    const now = Date.now();
    let oldestItem = now;
    let newestItem = 0;
    let memoryUsage = 0;

    for (const item of this.cache.values()) {
      oldestItem = Math.min(oldestItem, item.timestamp);
      newestItem = Math.max(newestItem, item.timestamp);
      memoryUsage += this.estimateSize(item);
    }

    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage,
      oldestItem: oldestItem === now ? 0 : oldestItem,
      newestItem,
    };
  }

  // 获取所有缓存键
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // 获取缓存项信息（不更新访问统计）
  inspect(key: string): CacheItem<any> | null {
    return this.cache.get(key) || null;
  }

  // 更新缓存项的TTL
  touch(key: string, newTTL?: number): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (newTTL !== undefined) {
      item.ttl = newTTL;
    }
    item.timestamp = Date.now();
    
    this.saveToPersistence();
    return true;
  }

  // 批量操作
  mget<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    for (const key of keys) {
      result[key] = this.get<T>(key);
    }
    return result;
  }

  mset<T>(items: Record<string, T>, options?: { ttl?: number; tags?: string[] }): void {
    for (const [key, data] of Object.entries(items)) {
      this.set(key, data, options);
    }
  }

  // LRU淘汰策略
  private evictLRU(): void {
    let lruKey = '';
    let lruTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < lruTime) {
        lruTime = item.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  // 清理过期项
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    if (expiredKeys.length > 0) {
      this.saveToPersistence();
    }
  }

  // 启动清理定时器
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  // 停止清理定时器
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  // 估算缓存项大小
  private estimateSize(item: CacheItem<any>): number {
    try {
      return JSON.stringify(item).length * 2; // 粗略估算（UTF-16）
    } catch {
      return 0;
    }
  }

  // 压缩数据（简单的JSON字符串压缩）
  private compress<T>(data: T): string {
    try {
      return JSON.stringify(data);
    } catch {
      return '';
    }
  }

  // 解压数据
  private decompress<T>(compressed: string): T {
    try {
      return JSON.parse(compressed);
    } catch {
      return null as T;
    }
  }

  // 持久化到localStorage
  private saveToPersistence(): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') {
      return;
    }

    try {
      const serialized = JSON.stringify({
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now(),
      });
      localStorage.setItem('advanced-cache', serialized);
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // 从localStorage加载
  private loadFromPersistence(): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') {
      return;
    }

    try {
      const serialized = localStorage.getItem('advanced-cache');
      if (!serialized) return;

      const data = JSON.parse(serialized);
      const now = Date.now();

      // 检查数据是否太旧（超过1天）
      if (now - data.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('advanced-cache');
        return;
      }

      // 恢复缓存项（跳过过期的）
      for (const [key, item] of data.cache) {
        if (now - item.timestamp <= item.ttl) {
          this.cache.set(key, item);
        }
      }

      // 恢复统计
      this.stats = data.stats || { hits: 0, misses: 0 };
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      localStorage.removeItem('advanced-cache');
    }
  }

  // 销毁缓存管理器
  destroy(): void {
    this.stopCleanupTimer();
    this.clear();
  }
}

// 创建默认缓存实例
export const cacheManager = new AdvancedCacheManager({
  maxSize: 500,
  defaultTTL: 10 * 60 * 1000, // 10分钟
  cleanupInterval: 2 * 60 * 1000, // 2分钟
  enablePersistence: true,
});

// React Hook
export const useCache = () => {
  return {
    get: cacheManager.get.bind(cacheManager),
    set: cacheManager.set.bind(cacheManager),
    has: cacheManager.has.bind(cacheManager),
    delete: cacheManager.delete.bind(cacheManager),
    clear: cacheManager.clear.bind(cacheManager),
    getStats: cacheManager.getStats.bind(cacheManager),
    deleteByTag: cacheManager.deleteByTag.bind(cacheManager),
  };
};
