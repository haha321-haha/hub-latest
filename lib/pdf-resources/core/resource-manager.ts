// lib/pdf-resources/core/resource-manager.ts

import { 
  PDFResource, 
  ResourceCategory, 
  SupportedLanguage,
  SearchOptions,
  ResourceStats,
  ValidationResult,
  BatchOperationResult,
  SearchResult,
  PaginatedSearchResult
} from '../types/resource-types';
import { PDFResourceConfig } from '../types/config-types';
import { CacheManager } from './cache-manager';
import { ResourceValidator } from './resource-validator';
import { ErrorHandler, ErrorType, ErrorSeverity } from './error-handler';
// import { 
//   PDF_RESOURCES, 
//   LEGACY_ID_MAPPING, 
//   getPDFResourceById, 
//   getPDFResourcesByCategory,
//   getFeaturedResources,
//   getResourceStats
// } from '../../../config/resources/pdf-resources.config';

// 临时存根数据，替代缺失的导入
const PDF_RESOURCES: PDFResource[] = [];
const LEGACY_ID_MAPPING: Record<string, string> = {};
const getPDFResourceById = (id: string) => null;
const getPDFResourcesByCategory = (category: any) => [];
const getFeaturedResources = () => [];
const getResourceStats = () => ({
  totalCount: 0,
  totalSize: 0,
  averageQuality: 0,
  totalDownloads: 0,
  totalViews: 0,
  lastUpdated: Date.now(),
  byCategory: {},
  byLanguage: {},
  byStatus: {},
  topResources: {
    mostDownloaded: [],
    highestRated: [],
    mostRecent: [],
    trending: []
  }
});

/**
 * 资源适配器接口
 */
interface IResourceAdapter {
  getResource(id: string): Promise<PDFResource | null>;
  getResources(options?: ResourceQueryOptions): Promise<PDFResource[]>;
  createResource(resource: PDFResource): Promise<PDFResource>;
  updateResource(id: string, updates: Partial<PDFResource>): Promise<PDFResource>;
  deleteResource(id: string): Promise<boolean>;
  searchResources(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}

/**
 * 资源查询选项
 */
interface ResourceQueryOptions {
  category?: ResourceCategory;
  language?: SupportedLanguage;
  tags?: string[];
  featured?: boolean;
  status?: 'active' | 'draft' | 'archived';
  limit?: number;
  offset?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'updatedAt' | 'quality' | 'downloads';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 本地资源适配器实现
 */
class LocalResourceAdapter implements IResourceAdapter {
  private resources: PDFResource[] = [];
  
  constructor() {
    this.resources = [...PDF_RESOURCES];
  }

  async getResource(id: string): Promise<PDFResource | null> {
    // 首先尝试直接查找
    let resource = this.resources.find(r => r.id === id);
    
    // 如果没找到，尝试Legacy映射
    if (!resource) {
      const mappedId = LEGACY_ID_MAPPING[id as keyof typeof LEGACY_ID_MAPPING];
      if (mappedId) {
        resource = this.resources.find(r => r.id === mappedId);
      }
    }
    
    return resource || null;
  }

  async getResources(options: ResourceQueryOptions = {}): Promise<PDFResource[]> {
    let filtered = this.resources.filter(r => r.status === (options.status || 'active'));

    // 应用过滤条件
    if (options.category) {
      filtered = filtered.filter(r => r.category === options.category);
    }
    
    if (options.language) {
      filtered = filtered.filter(r => r.language === options.language);
    }
    
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(r => 
        options.tags!.some(tag => r.tags.includes(tag))
      );
    }
    
    if (options.featured !== undefined) {
      filtered = filtered.filter(r => r.metadata.featured === options.featured);
    }

    // 排序
    if (options.sortBy) {
      filtered.sort((a, b) => {
        const getValue = (resource: PDFResource) => {
          switch (options.sortBy) {
            case 'id':
              return resource.id;
            case 'title':
              return resource.metadata.title.zh || resource.metadata.title.en;
            case 'createdAt':
              return resource.createdAt.getTime();
            case 'updatedAt':
              return resource.updatedAt.getTime();
            case 'quality':
              return resource.metadata.quality.overall;
            case 'downloads':
              return resource.analytics.downloadCount;
            default:
              return resource.id;
          }
        };

        const aValue = getValue(a);
        const bValue = getValue(b);
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return options.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return options.sortOrder === 'desc' 
            ? bValue - aValue
            : aValue - bValue;
        }
        
        return 0;
      });
    }

    // 分页
    if (options.offset !== undefined || options.limit !== undefined) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  async createResource(resource: PDFResource): Promise<PDFResource> {
    // 检查ID唯一性
    const existing = await this.getResource(resource.id);
    if (existing) {
      throw new Error(`Resource with ID ${resource.id} already exists`);
    }

    const newResource = {
      ...resource,
      createdAt: new Date(),
      updatedAt: new Date(),
      analytics: {
        downloadCount: 0,
        viewCount: 0,
        shareCount: 0,
        rating: 0,
        reviewCount: 0
      }
    };

    this.resources.push(newResource);
    return newResource;
  }

  async updateResource(id: string, updates: Partial<PDFResource>): Promise<PDFResource> {
    const index = this.resources.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Resource with ID ${id} not found`);
    }

    const updatedResource = {
      ...this.resources[index],
      ...updates,
      updatedAt: new Date()
    };

    this.resources[index] = updatedResource;
    return updatedResource;
  }

  async deleteResource(id: string): Promise<boolean> {
    const index = this.resources.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }

    this.resources.splice(index, 1);
    return true;
  }

  async searchResources(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    const results: SearchResult[] = [];
    
    for (const resource of this.resources) {
      if (resource.status !== 'active') continue;
      
      const score = this.calculateSearchScore(resource, normalizedQuery, options);
      
      if (score > 0) {
        results.push({
          resource,
          score,
          matchedFields: this.getMatchedFields(resource, normalizedQuery),
          highlights: this.generateHighlights(resource, normalizedQuery)
        });
      }
    }

    // 按分数排序
    results.sort((a, b) => b.score - a.score);
    
    // 应用限制
    return results.slice(0, options.limit || 50);
  }

  private calculateSearchScore(
    resource: PDFResource, 
    query: string, 
    options: SearchOptions
  ): number {
    let score = 0;
    const queryWords = query.split(/\s+/);

    // 标题匹配 (权重: 3.0)
    const title = (resource.metadata.title.zh || resource.metadata.title.en || '').toLowerCase();
    for (const word of queryWords) {
      if (title.includes(word)) {
        score += title === query ? 3.0 : title.startsWith(query) ? 2.5 : 2.0;
      }
    }

    // 描述匹配 (权重: 2.0)
    const description = (resource.metadata.description.zh || resource.metadata.description.en || '').toLowerCase();
    for (const word of queryWords) {
      if (description.includes(word)) {
        score += 2.0;
      }
    }

    // 关键词匹配 (权重: 2.5)
    for (const keyword of resource.metadata.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      for (const word of queryWords) {
        if (lowerKeyword.includes(word)) {
          score += lowerKeyword === word ? 2.5 : 2.0;
        }
      }
    }

    // 标签匹配 (权重: 2.0)
    for (const tag of resource.tags) {
      const lowerTag = tag.toLowerCase();
      for (const word of queryWords) {
        if (lowerTag.includes(word)) {
          score += lowerTag === word ? 2.0 : 1.5;
        }
      }
    }

    // 内容搜索匹配 (权重: 1.0)
    if (resource.content.search.searchKeywords) {
      for (const searchKeyword of resource.content.search.searchKeywords) {
        const lowerSearchKeyword = searchKeyword.toLowerCase();
        for (const word of queryWords) {
          if (lowerSearchKeyword.includes(word)) {
            score += 1.0;
          }
        }
      }
    }

    // 应用过滤器
    if (options.category && resource.category !== options.category) {
      score *= 0.1; // 严重降低不匹配类别的分数
    }

    if (options.language && resource.language !== options.language) {
      score *= 0.5; // 降低不匹配语言的分数
    }

    if (options.tags && options.tags.length > 0) {
      const hasMatchingTag = options.tags.some(tag => 
        resource.tags.some(resourceTag => 
          resourceTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        score *= 0.3;
      }
    }

    // 质量加权
    if (options.minQuality && resource.metadata.quality.overall < options.minQuality) {
      score *= 0.2;
    } else {
      score *= (resource.metadata.quality.overall / 10); // 质量加权
    }

    // 精选资源加权
    if (resource.metadata.featured) {
      score *= 1.2;
    }

    return score;
  }

  private getMatchedFields(resource: PDFResource, query: string): string[] {
    const matched: string[] = [];
    const queryLower = query.toLowerCase();

    if ((resource.metadata.title.zh || '').toLowerCase().includes(queryLower) ||
        (resource.metadata.title.en || '').toLowerCase().includes(queryLower)) {
      matched.push('title');
    }

    if ((resource.metadata.description.zh || '').toLowerCase().includes(queryLower) ||
        (resource.metadata.description.en || '').toLowerCase().includes(queryLower)) {
      matched.push('description');
    }

    if (resource.metadata.keywords.some(k => k.toLowerCase().includes(queryLower))) {
      matched.push('keywords');
    }

    if (resource.tags.some(t => t.toLowerCase().includes(queryLower))) {
      matched.push('tags');
    }

    return matched;
  }

  private generateHighlights(resource: PDFResource, query: string): SearchResult['highlights'] {
    const queryLower = query.toLowerCase();
    const highlights: SearchResult['highlights'] = {};

    // 生成标题高亮
    const title = resource.metadata.title.zh || resource.metadata.title.en || '';
    if (title.toLowerCase().includes(queryLower)) {
      highlights.title = this.highlightText(title, query);
    }

    // 生成描述高亮
    const description = resource.metadata.description.zh || resource.metadata.description.en || '';
    if (description.toLowerCase().includes(queryLower)) {
      highlights.description = this.highlightText(description, query, 150);
    }

    return highlights;
  }

  private highlightText(text: string, query: string, maxLength: number = 200): string {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) return text;

    const start = Math.max(0, index - 50);
    let end = Math.min(text.length, index + query.length + 50);
    
    if (end - start > maxLength) {
      end = start + maxLength;
    }

    let excerpt = text.substring(start, end);
    
    // 添加省略号
    if (start > 0) excerpt = '...' + excerpt;
    if (end < text.length) excerpt = excerpt + '...';

    // 高亮匹配文本
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return excerpt.replace(regex, `<mark>$&</mark>`);
  }
}

/**
 * 核心资源管理器
 */
export class PDFResourceManager {
  private static instance: PDFResourceManager;
  
  private config: PDFResourceConfig;
  private cache: CacheManager;
  private validator: ResourceValidator;
  private errorHandler: ErrorHandler;
  private adapter: IResourceAdapter;
  
  private constructor(config: PDFResourceConfig) {
    this.config = config;
    this.cache = new CacheManager(config.cache);
    this.validator = new ResourceValidator(config.validation);
    this.errorHandler = new ErrorHandler(config.monitoring);
    this.adapter = new LocalResourceAdapter();
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: PDFResourceConfig): PDFResourceManager {
    if (!PDFResourceManager.instance) {
      if (!config) {
        throw new Error('Configuration required for first initialization');
      }
      PDFResourceManager.instance = new PDFResourceManager(config);
    }
    return PDFResourceManager.instance;
  }

  /**
   * 获取单个资源
   */
  async getResource(id: string): Promise<PDFResource | null> {
    try {
      // 1. 检查缓存
      const cacheKey = `resource:${id}`;
      const cached = this.cache.get<PDFResource>(cacheKey);
      if (cached) {
        await this.recordResourceAccess(id, 'view');
        return cached;
      }

      // 2. 从适配器获取
      const resource = await this.adapter.getResource(id);
      if (!resource) {
        await this.errorHandler.handleError(
          this.errorHandler.createBusinessError(
            `Resource not found: ${id}`,
            'RESOURCE_NOT_FOUND',
            { operation: 'getResource', resourceId: id }
          )
        );
        return null;
      }

      // 3. 验证资源
      const validation = await this.validator.validate(resource);
      if (!validation.isValid) {
        await this.errorHandler.logWarning(
          `Resource ${id} has validation issues`,
          { operation: 'getResource', resourceId: id }
        );
      }

      // 4. 缓存结果
      this.cache.set(cacheKey, resource, this.config.cache.resourceTtl.resource);

      // 5. 记录访问
      await this.recordResourceAccess(id, 'view');

      return resource;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'getResource',
        resourceId: id
      });
      return null;
    }
  }

  /**
   * 获取资源列表
   */
  async getResources(options: ResourceQueryOptions = {}): Promise<PDFResource[]> {
    try {
      // 生成缓存键
      const cacheKey = `resources:${JSON.stringify(options)}`;
      const cached = this.cache.get<PDFResource[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // 从适配器获取
      const resources = await this.adapter.getResources(options);

      // 缓存结果
      this.cache.set(cacheKey, resources, this.config.cache.resourceTtl.resource);

      return resources;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'getResources'
      });
      return [];
    }
  }

  /**
   * 按类别获取资源
   */
  async getResourcesByCategory(category: ResourceCategory): Promise<PDFResource[]> {
    return this.getResources({ category, status: 'active' });
  }

  /**
   * 获取精选资源
   */
  async getFeaturedResources(): Promise<PDFResource[]> {
    return this.getResources({ featured: true, status: 'active' });
  }

  /**
   * 搜索资源
   */
  async searchResources(
    query: string, 
    options: SearchOptions = {}
  ): Promise<PaginatedSearchResult> {
    try {
      // 生成缓存键
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;
      const cached = this.cache.get<PaginatedSearchResult>(cacheKey);
      if (cached) {
        return cached;
      }

      // 执行搜索
      const results = await this.adapter.searchResources(query, options);
      
      // 分页处理
      const page = Math.floor((options.offset || 0) / (options.limit || 20)) + 1;
      const pageSize = options.limit || 20;
      const total = results.length;
      
      const paginatedResults = results.slice(
        options.offset || 0, 
        (options.offset || 0) + pageSize
      );

      const searchResult: PaginatedSearchResult = {
        results: paginatedResults,
        total,
        page,
        pageSize,
        hasNext: (options.offset || 0) + pageSize < total,
        hasPrevious: (options.offset || 0) > 0,
        facets: await this.generateSearchFacets(results)
      };

      // 缓存搜索结果
      this.cache.set(cacheKey, searchResult, this.config.cache.resourceTtl.search);

      return searchResult;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'searchResources',
        metadata: { query, options }
      });
      
      return {
        results: [],
        total: 0,
        page: 1,
        pageSize: options.limit || 20,
        hasNext: false,
        hasPrevious: false
      };
    }
  }

  /**
   * 创建资源
   */
  async createResource(resource: PDFResource): Promise<PDFResource> {
    try {
      // 验证资源
      const validation = await this.validator.validate(resource);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map((e: any) => e.message).join(', ')}`);
      }

      // 创建资源
      const created = await this.adapter.createResource(resource);

      // 清除相关缓存
      await this.invalidateResourceCaches();

      return created;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'createResource',
        resourceId: resource.id
      });
      throw error;
    }
  }

  /**
   * 更新资源
   */
  async updateResource(id: string, updates: Partial<PDFResource>): Promise<PDFResource> {
    try {
      // 获取现有资源
      const existing = await this.adapter.getResource(id);
      if (!existing) {
        throw new Error(`Resource not found: ${id}`);
      }

      // 合并更新
      const updated = { ...existing, ...updates };

      // 验证更新后的资源
      const validation = await this.validator.validate(updated);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map((e: any) => e.message).join(', ')}`);
      }

      // 执行更新
      const result = await this.adapter.updateResource(id, updates);

      // 清除相关缓存
      await this.invalidateResourceCaches(id);

      return result;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'updateResource',
        resourceId: id
      });
      throw error;
    }
  }

  /**
   * 删除资源
   */
  async deleteResource(id: string): Promise<boolean> {
    try {
      const result = await this.adapter.deleteResource(id);
      
      if (result) {
        // 清除相关缓存
        await this.invalidateResourceCaches(id);
      }

      return result;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'deleteResource',
        resourceId: id
      });
      return false;
    }
  }

  /**
   * 批量操作
   */
  async batchOperation(
    operation: 'create' | 'update' | 'delete',
    resources: Array<{ id?: string; data?: any }>
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      totalCount: resources.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
      warnings: [],
      duration: 0
    };

    const startTime = Date.now();

    for (const item of resources) {
      try {
        switch (operation) {
          case 'create':
            if (item.data) {
              await this.createResource(item.data);
              result.successCount++;
            }
            break;
          case 'update':
            if (item.id && item.data) {
              await this.updateResource(item.id, item.data);
              result.successCount++;
            }
            break;
          case 'delete':
            if (item.id) {
              await this.deleteResource(item.id);
              result.successCount++;
            }
            break;
        }
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          resourceId: item.id || 'unknown',
          error: (error as Error).message
        });
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * 获取资源统计
   */
  async getResourceStats(): Promise<ResourceStats> {
    try {
      const cacheKey = 'stats:resources';
      const cached = this.cache.get<ResourceStats>(cacheKey);
      if (cached) {
        return cached;
      }

      const stats = getResourceStats() as any;
      
      // 缓存统计信息
      this.cache.set(cacheKey, stats, this.config.cache.resourceTtl.stats);

      return stats;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'getResourceStats'
      });
      throw error;
    }
  }

  /**
   * 验证所有资源映射
   */
  async validateAllMappings(): Promise<ValidationResult> {
    try {
      const errors: any[] = [];
      const warnings: any[] = [];

      // 验证Legacy映射
      for (const [legacyId, modernId] of Object.entries(LEGACY_ID_MAPPING)) {
        const resource = await this.adapter.getResource(modernId);
        if (!resource) {
          errors.push({
            field: 'mapping',
            message: `Legacy mapping ${legacyId} -> ${modernId} points to non-existent resource`,
            severity: 'error',
            code: 'MISSING_MAPPED_RESOURCE'
          });
        }
      }

      // 验证所有资源
      const allResources = await this.adapter.getResources();
      for (const resource of allResources) {
        const validation = await this.validator.validate(resource);
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions: [],
        summary: {
          totalChecks: allResources.length + Object.keys(LEGACY_ID_MAPPING).length,
          passedChecks: allResources.length + Object.keys(LEGACY_ID_MAPPING).length - errors.length,
          errorCount: errors.length,
          warningCount: warnings.length
        }
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        operation: 'validateAllMappings'
      });
      throw error;
    }
  }

  /**
   * 记录资源访问
   */
  private async recordResourceAccess(
    resourceId: string, 
    action: 'view' | 'download' | 'share'
  ): Promise<void> {
    try {
      // 更新分析数据
      const resource = await this.adapter.getResource(resourceId);
      if (resource) {
        const updates: Partial<PDFResource> = {
          analytics: {
            ...resource.analytics,
            [action === 'view' ? 'viewCount' : 
             action === 'download' ? 'downloadCount' : 'shareCount']: 
             (resource.analytics[action === 'view' ? 'viewCount' : 
                                 action === 'download' ? 'downloadCount' : 'shareCount'] || 0) + 1,
            lastAccessedAt: new Date()
          }
        };

        await this.adapter.updateResource(resourceId, updates);
      }
    } catch (error) {
      // 记录访问失败不应该阻止主要操作
      await this.errorHandler.logWarning(
        `Failed to record access for resource ${resourceId}`,
        { operation: 'recordResourceAccess', resourceId }
      );
    }
  }

  /**
   * 生成搜索分面
   */
  private async generateSearchFacets(results: SearchResult[]): Promise<PaginatedSearchResult['facets']> {
    const categories: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const tags: Record<string, number> = {};

    for (const result of results) {
      const resource = result.resource;
      
      // 统计类别
      categories[resource.category] = (categories[resource.category] || 0) + 1;
      
      // 统计语言
      languages[resource.language] = (languages[resource.language] || 0) + 1;
      
      // 统计标签
      for (const tag of resource.tags) {
        tags[tag] = (tags[tag] || 0) + 1;
      }
    }

    return {
      categories: Object.entries(categories).map(([category, count]) => ({
        category: category as any,
        count
      })),
      languages: Object.entries(languages).map(([language, count]) => ({
        language: language as any,
        count
      })),
      tags: Object.entries(tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20) // 限制标签数量
        .map(([tag, count]) => ({
          tag: tag,
          count
        })),
      quality: []
    };
  }

  /**
   * 清除资源相关缓存
   */
  private async invalidateResourceCaches(resourceId?: string): Promise<void> {
    if (resourceId) {
      this.cache.delete(`resource:${resourceId}`);
    }
    
    // 清除列表和搜索缓存
    this.cache.deletePattern('resources:*');
    this.cache.deletePattern('search:*');
    this.cache.delete('stats:resources');
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<PDFResourceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.cache) {
      this.cache.updateConfig(newConfig.cache);
    }
    
    if (newConfig.validation) {
      this.validator.updateConfig(newConfig.validation);
    }
    
    if (newConfig.monitoring) {
      this.errorHandler.updateConfig(newConfig.monitoring);
    }
  }

  /**
   * 获取系统健康状态
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, { status: 'up' | 'down'; latency?: number; error?: string }>;
  }> {
    const checks: Record<string, any> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // 检查缓存
      const cacheStart = Date.now();
      this.cache.get('health-check');
      this.cache.set('health-check', 'ok');
      checks.cache = { 
        status: 'up', 
        latency: Date.now() - cacheStart 
      };
    } catch (error) {
      checks.cache = { 
        status: 'down', 
        error: (error as Error).message 
      };
      overallStatus = 'degraded';
    }

    try {
      // 检查资源访问
      const resourceStart = Date.now();
      await this.adapter.getResources({ limit: 1 });
      checks.resources = { 
        status: 'up', 
        latency: Date.now() - resourceStart 
      };
    } catch (error) {
      checks.resources = { 
        status: 'down', 
        error: (error as Error).message 
      };
      overallStatus = 'unhealthy';
    }

    try {
      // 检查验证器
      const validationStart = Date.now();
      await this.validator.validateConfig();
      checks.validation = { 
        status: 'up', 
        latency: Date.now() - validationStart 
      };
    } catch (error) {
      checks.validation = { 
        status: 'down', 
        error: (error as Error).message 
      };
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      checks
    };
  }

  /**
   * 销毁管理器实例
   */
  destroy(): void {
    this.cache.destroy();
    this.errorHandler.destroy();
    PDFResourceManager.instance = null as any;
  }
}