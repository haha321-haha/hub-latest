// lib/pdf-resources/core/cache-manager.ts

import { CacheEntry, CacheStats } from '../types/resource-types';
import { CacheConfig, CacheStrategy } from '../types/config-types';

/**
 * 缓存策略接口
 */
interface ICacheStrategy<T = any> {
  get(key: string): CacheEntry<T> | null;
  set(key: string, value: T, ttl?: number): void;
  delete(key: string): boolean;
  clear(): void;
  has(key: string): boolean;
  size(): number;
  keys(): string[];
  evict(): void;
}

/**
 * LRU缓存策略实现
 */
class LRUCacheStrategy<T = any> implements ICacheStrategy<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private accessCounter = 0;
  
  constructor(private maxSize: number, private defaultTtl: number) {}
  
  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // 检查是否过期
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    
    // 更新访问记录
    entry.accessCount++;
    entry.lastAccessedAt = new Date();
    this.accessOrder.set(key, ++this.accessCounter);
    
    return entry;
  }
  
  set(key: string, value: T, ttl?: number): void {
    // 如果缓存已满，执行LRU驱逐
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }
    
    const now = new Date();
    const expirationTime = ttl || this.defaultTtl;
    const expiresAt = new Date(now.getTime() + expirationTime * 1000);
    
    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt,
      accessCount: 1,
      lastAccessedAt: now,
      size: this.calculateSize(value)
    };
    
    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
  }
  
  delete(key: string): boolean {
    this.accessOrder.delete(key);
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  size(): number {
    return this.cache.size;
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  evict(): void {
    this.evictLRU();
  }
  
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;
    
    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length * 2; // 粗略估算Unicode字符占用
    } catch {
      return 1024; // 默认1KB
    }
  }
}

/**
 * LFU缓存策略实现
 */
class LFUCacheStrategy<T = any> implements ICacheStrategy<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private frequencies = new Map<string, number>();
  
  constructor(private maxSize: number, private defaultTtl: number) {}
  
  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // 检查是否过期
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    
    // 更新访问频率
    entry.accessCount++;
    entry.lastAccessedAt = new Date();
    this.frequencies.set(key, (this.frequencies.get(key) || 0) + 1);
    
    return entry;
  }
  
  set(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLFU();
    }
    
    const now = new Date();
    const expirationTime = ttl || this.defaultTtl;
    const expiresAt = new Date(now.getTime() + expirationTime * 1000);
    
    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt,
      accessCount: 1,
      lastAccessedAt: now,
      size: this.calculateSize(value)
    };
    
    this.cache.set(key, entry);
    this.frequencies.set(key, 1);
  }
  
  delete(key: string): boolean {
    this.frequencies.delete(key);
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
    this.frequencies.clear();
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  size(): number {
    return this.cache.size;
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  evict(): void {
    this.evictLFU();
  }
  
  private evictLFU(): void {
    let leastFrequentKey: string | null = null;
    let minFrequency = Infinity;
    
    for (const [key, frequency] of this.frequencies) {
      if (frequency < minFrequency) {
        minFrequency = frequency;
        leastFrequentKey = key;
      }
    }
    
    if (leastFrequentKey) {
      this.delete(leastFrequentKey);
    }
  }
  
  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length * 2;
    } catch {
      return 1024;
    }
  }
}

/**
 * TTL缓存策略实现
 */
class TTLCacheStrategy<T = any> implements ICacheStrategy<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private timers = new Map<string, NodeJS.Timeout>();
  
  constructor(private maxSize: number, private defaultTtl: number) {}
  
  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // TTL策略不需要检查过期，由定时器自动清理
    entry.accessCount++;
    entry.lastAccessedAt = new Date();
    
    return entry;
  }
  
  set(key: string, value: T, ttl?: number): void {
    // 清除现有定时器
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }
    
    const now = new Date();
    const expirationTime = ttl || this.defaultTtl;
    const expiresAt = new Date(now.getTime() + expirationTime * 1000);
    
    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt,
      accessCount: 1,
      lastAccessedAt: now,
      size: this.calculateSize(value)
    };
    
    this.cache.set(key, entry);
    
    // 设置过期定时器
    const timer = setTimeout(() => {
      this.delete(key);
    }, expirationTime * 1000);
    
    this.timers.set(key, timer);
  }
  
  delete(key: string): boolean {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }
  
  clear(): void {
    // 清除所有定时器
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.cache.clear();
    this.timers.clear();
  }
  
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  size(): number {
    return this.cache.size;
  }
  
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  evict(): void {
    this.evictOldest();
  }
  
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.cache) {
      if (entry.createdAt.getTime() < oldestTime) {
        oldestTime = entry.createdAt.getTime();
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length * 2;
    } catch {
      return 1024;
    }
  }
}

/**
 * 自适应缓存策略实现
 */
class AdaptiveCacheStrategy<T = any> implements ICacheStrategy<T> {
  private lruStrategy: LRUCacheStrategy<T>;
  private lfuStrategy: LFUCacheStrategy<T>;
  private currentStrategy: ICacheStrategy<T>;
  private performanceMetrics = {
    lru: { hits: 0, misses: 0 },
    lfu: { hits: 0, misses: 0 }
  };
  private lastEvaluation = Date.now();
  private evaluationInterval = 60000; // 1分钟
  
  constructor(maxSize: number, defaultTtl: number) {
    this.lruStrategy = new LRUCacheStrategy<T>(maxSize, defaultTtl);
    this.lfuStrategy = new LFUCacheStrategy<T>(maxSize, defaultTtl);
    this.currentStrategy = this.lruStrategy; // 默认使用LRU
  }
  
  get(key: string): CacheEntry<T> | null {
    const result = this.currentStrategy.get(key);
    
    // 记录性能指标
    if (this.currentStrategy === this.lruStrategy) {
      result ? this.performanceMetrics.lru.hits++ : this.performanceMetrics.lru.misses++;
    } else {
      result ? this.performanceMetrics.lfu.hits++ : this.performanceMetrics.lfu.misses++;
    }
    
    // 定期评估策略性能
    this.evaluateStrategy();
    
    return result;
  }
  
  set(key: string, value: T, ttl?: number): void {
    this.currentStrategy.set(key, value, ttl);
  }
  
  delete(key: string): boolean {
    return this.currentStrategy.delete(key);
  }
  
  clear(): void {
    this.lruStrategy.clear();
    this.lfuStrategy.clear();
    this.performanceMetrics = {
      lru: { hits: 0, misses: 0 },
      lfu: { hits: 0, misses: 0 }
    };
  }
  
  has(key: string): boolean {
    return this.currentStrategy.has(key);
  }
  
  size(): number {
    return this.currentStrategy.size();
  }
  
  keys(): string[] {
    return this.currentStrategy.keys();
  }
  
  evict(): void {
    this.currentStrategy.evict();
  }
  
  private evaluateStrategy(): void {
    const now = Date.now();
    if (now - this.lastEvaluation < this.evaluationInterval) {
      return;
    }
    
    const lruHitRate = this.calculateHitRate(this.performanceMetrics.lru);
    const lfuHitRate = this.calculateHitRate(this.performanceMetrics.lfu);
    
    // 切换到性能更好的策略
    const newStrategy = lruHitRate > lfuHitRate ? this.lruStrategy : this.lfuStrategy;
    
    if (newStrategy !== this.currentStrategy) {
      this.migrateData(this.currentStrategy, newStrategy);
      this.currentStrategy = newStrategy;
    }
    
    this.lastEvaluation = now;
  }
  
  private calculateHitRate(metrics: { hits: number; misses: number }): number {
    const total = metrics.hits + metrics.misses;
    return total > 0 ? metrics.hits / total : 0;
  }
  
  private migrateData(from: ICacheStrategy<T>, to: ICacheStrategy<T>): void {
    // 迁移现有数据到新策略
    for (const key of from.keys()) {
      const entry = from.get(key);
      if (entry) {
        const remainingTtl = entry.expiresAt ? 
          Math.max(0, entry.expiresAt.getTime() - Date.now()) / 1000 : undefined;
        to.set(key, entry.value, remainingTtl);
      }
    }
  }
}

/**
 * 主缓存管理器
 */
export class CacheManager {
  private strategy: ICacheStrategy;
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupInterval?: NodeJS.Timeout;
  
  constructor(config: CacheConfig) {
    this.config = config;
    this.strategy = this.createStrategy(config.strategy);
    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      evictionCount: 0
    };
    
    if (config.enabled) {
      this.startCleanupScheduler();
    }
  }
  
  /**
   * 获取缓存值
   */
  get<T = any>(key: string): T | null {
    if (!this.config.enabled) return null;
    
    const entry = this.strategy.get(key);
    
    // 更新统计信息
    if (entry) {
      this.updateHitRate(true);
      return entry.value;
    } else {
      this.updateHitRate(false);
      return null;
    }
  }
  
  /**
   * 设置缓存值
   */
  set<T = any>(key: string, value: T, ttl?: number): void {
    if (!this.config.enabled) return;
    
    const effectiveTtl = ttl || this.config.ttl;
    this.strategy.set(key, value, effectiveTtl);
    this.updateStats();
  }
  
  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    if (!this.config.enabled) return false;
    
    const result = this.strategy.delete(key);
    if (result) {
      this.updateStats();
    }
    return result;
  }
  
  /**
   * 清空所有缓存
   */
  clear(): void {
    this.strategy.clear();
    this.resetStats();
  }
  
  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    return this.config.enabled && this.strategy.has(key);
  }
  
  /**
   * 获取缓存大小
   */
  size(): number {
    return this.strategy.size();
  }
  
  /**
   * 获取所有键
   */
  keys(): string[] {
    return this.strategy.keys();
  }
  
  /**
   * 手动触发缓存清理
   */
  cleanup(): void {
    this.strategy.evict();
    this.updateStats();
  }
  
  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }
  
  /**
   * 预热缓存
   */
  async warmup(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    if (!this.config.enabled || !this.config.warmup?.enabled) return;
    
    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl);
    }
  }
  
  /**
   * 批量获取
   */
  mget<T = any>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = this.get<T>(key);
    }
    
    return result;
  }
  
  /**
   * 批量设置
   */
  mset(entries: Array<{ key: string; value: any; ttl?: number }>): void {
    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl);
    }
  }
  
  /**
   * 按模式删除
   */
  deletePattern(pattern: string): number {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete = this.keys().filter(key => regex.test(key));
    
    let deletedCount = 0;
    for (const key of keysToDelete) {
      if (this.delete(key)) {
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
  
  /**
   * 获取缓存项的详细信息
   */
  inspect(key: string): CacheEntry | null {
    return this.strategy.get(key);
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (!this.config.enabled && this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    } else if (this.config.enabled && !this.cleanupInterval) {
      this.startCleanupScheduler();
    }
  }
  
  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
  
  private createStrategy(strategyType: CacheStrategy): ICacheStrategy {
    switch (strategyType) {
      case 'lru':
        return new LRUCacheStrategy(this.config.maxSize, this.config.ttl);
      case 'lfu':
        return new LFUCacheStrategy(this.config.maxSize, this.config.ttl);
      case 'ttl':
        return new TTLCacheStrategy(this.config.maxSize, this.config.ttl);
      case 'adaptive':
        return new AdaptiveCacheStrategy(this.config.maxSize, this.config.ttl);
      default:
        return new LRUCacheStrategy(this.config.maxSize, this.config.ttl);
    }
  }
  
  private startCleanupScheduler(): void {
    const checkPeriod = (this.config.memory?.checkPeriod || 600) * 1000;
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, checkPeriod);
  }
  
  private updateStats(): void {
    const currentSize = this.strategy.size();
    let totalSize = 0;
    let oldestEntry: Date | undefined;
    let newestEntry: Date | undefined;
    let mostAccessedKey: string | undefined;
    let maxAccessCount = 0;
    
    for (const key of this.strategy.keys()) {
      const entry = this.strategy.get(key);
      if (entry) {
        totalSize += entry.size || 0;
        
        if (!oldestEntry || entry.createdAt < oldestEntry) {
          oldestEntry = entry.createdAt;
        }
        
        if (!newestEntry || entry.createdAt > newestEntry) {
          newestEntry = entry.createdAt;
        }
        
        if (entry.accessCount > maxAccessCount) {
          maxAccessCount = entry.accessCount;
          mostAccessedKey = key;
        }
      }
    }
    
    this.stats.totalEntries = currentSize;
    this.stats.totalSize = totalSize;
    this.stats.oldestEntry = oldestEntry;
    this.stats.newestEntry = newestEntry;
    this.stats.mostAccessedKey = mostAccessedKey;
  }
  
  private updateHitRate(isHit: boolean): void {
    // 使用移动平均计算命中率
    const alpha = 0.1; // 平滑因子
    const currentHit = isHit ? 1 : 0;
    this.stats.hitRate = alpha * currentHit + (1 - alpha) * this.stats.hitRate;
  }
  
  private resetStats(): void {
    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      evictionCount: 0
    };
  }
}

/**
 * 缓存管理器工厂
 */
export class CacheManagerFactory {
  private static instances = new Map<string, CacheManager>();
  
  /**
   * 创建或获取缓存管理器实例
   */
  static getInstance(name: string, config: CacheConfig): CacheManager {
    if (!this.instances.has(name)) {
      this.instances.set(name, new CacheManager(config));
    }
    return this.instances.get(name)!;
  }
  
  /**
   * 销毁缓存管理器实例
   */
  static destroyInstance(name: string): void {
    const instance = this.instances.get(name);
    if (instance) {
      instance.destroy();
      this.instances.delete(name);
    }
  }
  
  /**
   * 销毁所有实例
   */
  static destroyAll(): void {
    for (const [name, instance] of this.instances) {
      instance.destroy();
    }
    this.instances.clear();
  }
  
  /**
   * 获取所有实例的统计信息
   */
  static getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    
    for (const [name, instance] of this.instances) {
      stats[name] = instance.getStats();
    }
    
    return stats;
  }
}