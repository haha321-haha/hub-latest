/**
 * Period Hub Enterprise Resource Manager
 * 企业级资源管理器核心类
 */

import { 
  EnterpriseResource, 
  ResourceSearchFilters, 
  ResourceSearchResult, 
  ResourceOperationResult,
  BulkOperationResult,
  ResourceAnalyticsReport,
  ResourceValidationError,
  ResourceManagerConfig,
  ResourceImportResult,
  ResourceExportOptions,
  ResourceType,
  ResourceStatus,
  DifficultyLevel,
  TargetAudience
} from '../types';
import { Locale } from '@/types/pdf';
import { CacheManager } from '../cache/CacheManager';
import { ResourceValidator } from '../validation/ResourceValidator';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';

export class ResourceManager {
  private config: ResourceManagerConfig;
  private cacheManager: CacheManager;
  private validator: ResourceValidator;
  private analyticsEngine: AnalyticsEngine;
  private resources: Map<string, EnterpriseResource> = new Map();
  private isInitialized = false;

  constructor(config: ResourceManagerConfig) {
    this.config = config;
    this.cacheManager = new CacheManager(config);
    this.validator = new ResourceValidator(config);
    this.analyticsEngine = new AnalyticsEngine(config);
  }

  /**
   * 初始化资源管理器
   */
  async initialize(): Promise<ResourceOperationResult<void>> {
    try {
      // 初始化各个组件
      await this.cacheManager.initialize();
      await this.validator.initialize();
      await this.analyticsEngine.initialize();
      
      // 加载现有资源
      await this.loadResources();
      
      this.isInitialized = true;
      
      return {
        success: true,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
        timestamp: new Date()
      };
    }
  }

  /**
   * 获取资源
   */
  async getResource(id: string, locale?: Locale): Promise<ResourceOperationResult<EnterpriseResource>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'ResourceManager not initialized',
        timestamp: new Date()
      };
    }

    try {
      const cacheKey = `resource:${id}:${locale || 'default'}`;
      
      // 尝试从缓存获取
      if (this.config.cacheEnabled) {
        const cached = await this.cacheManager.get<EnterpriseResource>(cacheKey);
        if (cached) {
          // 更新访问统计
          await this.updateAccessStats(id);
          return {
            success: true,
            data: cached,
            timestamp: new Date()
          };
        }
      }

      // 从数据源获取
      const resource = this.resources.get(id);
      if (!resource) {
        return {
          success: false,
          error: `Resource not found: ${id}`,
          timestamp: new Date()
        };
      }

      // 应用本地化
      const localizedResource = locale ? this.localizeResource(resource, locale) : resource;

      // 缓存结果
      if (this.config.cacheEnabled) {
        await this.cacheManager.set(cacheKey, localizedResource, this.config.cacheTimeout);
      }

      // 更新访问统计
      await this.updateAccessStats(id);

      return {
        success: true,
        data: localizedResource,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get resource',
        timestamp: new Date()
      };
    }
  }

  /**
   * 搜索资源
   */
  async searchResources(
    searchTerm: string, 
    filters: ResourceSearchFilters = {},
    locale?: Locale
  ): Promise<ResourceOperationResult<ResourceSearchResult>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'ResourceManager not initialized',
        timestamp: new Date()
      };
    }

    try {
      const startTime = Date.now();
      
      // 构建缓存键
      const cacheKey = `search:${searchTerm}:${JSON.stringify(filters)}:${locale || 'default'}`;
      
      // 尝试从缓存获取
      if (this.config.cacheEnabled) {
        const cached = await this.cacheManager.get<ResourceSearchResult>(cacheKey);
        if (cached) {
          return {
            success: true,
            data: cached,
            timestamp: new Date()
          };
        }
      }

      // 执行搜索
      let filteredResources = Array.from(this.resources.values());

      // 应用状态过滤
      if (filters.status && filters.status.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.status!.includes(r.status)
        );
      }

      // 应用类型过滤
      if (filters.type && filters.type.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.type!.includes(r.type)
        );
      }

      // 应用分类过滤
      if (filters.categories && filters.categories.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.categories!.includes(r.categoryId)
        );
      }

      // 应用标签过滤
      if (filters.tags && filters.tags.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.tags!.some(tag => r.tags.includes(tag))
        );
      }

      // 应用难度过滤
      if (filters.difficulty && filters.difficulty.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.difficulty!.includes(r.difficulty)
        );
      }

      // 应用目标用户过滤
      if (filters.targetAudience && filters.targetAudience.length > 0) {
        filteredResources = filteredResources.filter(r => 
          filters.targetAudience!.some(audience => r.targetAudience.includes(audience))
        );
      }

      // 应用评分过滤
      if (filters.minimumRating) {
        filteredResources = filteredResources.filter(r => 
          r.stats.userRating >= filters.minimumRating!
        );
      }

      // 应用搜索词过滤
      if (searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        filteredResources = filteredResources.filter(r => {
          const lang = locale || this.config.defaultLanguage;
          const title = r.title[lang]?.toLowerCase() || '';
          const description = r.description[lang]?.toLowerCase() || '';
          const keywords = r.keywords[lang]?.join(' ').toLowerCase() || '';
          const tags = r.tags.join(' ').toLowerCase();
          
          return title.includes(normalizedSearchTerm) ||
                 description.includes(normalizedSearchTerm) ||
                 keywords.includes(normalizedSearchTerm) ||
                 tags.includes(normalizedSearchTerm);
        });
      }

      // 应用排序
      this.sortResources(filteredResources, filters.sortBy || 'relevance', filters.sortOrder || 'desc');

      // 应用分页
      const page = 1; // 默认第一页
      const pageSize = 20; // 默认每页20条
      const startIndex = (page - 1) * pageSize;
      const paginatedResources = filteredResources.slice(startIndex, startIndex + pageSize);

      // 应用本地化
      const localizedResources = locale ? 
        paginatedResources.map(r => this.localizeResource(r, locale)) : 
        paginatedResources;

      const searchTime = Date.now() - startTime;

      const result: ResourceSearchResult = {
        resources: localizedResources,
        total: filteredResources.length,
        page,
        pageSize,
        filters,
        searchTerm,
        searchTime,
        suggestions: await this.generateSearchSuggestions(searchTerm, locale)
      };

      // 缓存结果
      if (this.config.cacheEnabled) {
        await this.cacheManager.set(cacheKey, result, this.config.cacheTimeout);
      }

      // 记录搜索统计
      await this.analyticsEngine.recordSearch(searchTerm, filters, result.total, searchTime);

      return {
        success: true,
        data: result,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        timestamp: new Date()
      };
    }
  }

  /**
   * 创建或更新资源
   */
  async saveResource(resource: EnterpriseResource): Promise<ResourceOperationResult<EnterpriseResource>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'ResourceManager not initialized',
        timestamp: new Date()
      };
    }

    try {
      // 验证资源
      if (this.config.validationEnabled) {
        const validationResult = await this.validator.validateResource(resource);
        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Resource validation failed',
            warnings: validationResult.errors.map((e: any) => e.message),
            timestamp: new Date()
          };
        }
      }

      // 设置时间戳
      const now = new Date();
      if (!this.resources.has(resource.id)) {
        resource.publishDate = now;
      }
      resource.lastModified = now;

      // 保存资源
      this.resources.set(resource.id, resource);

      // 清除相关缓存
      await this.cacheManager.clearPattern(`resource:${resource.id}:*`);
      await this.cacheManager.clearPattern('search:*');

      // 记录操作
      await this.analyticsEngine.recordOperation('save', resource.id, resource.type);

      return {
        success: true,
        data: resource,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save resource',
        timestamp: new Date()
      };
    }
  }

  /**
   * 删除资源
   */
  async deleteResource(id: string): Promise<ResourceOperationResult<boolean>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'ResourceManager not initialized',
        timestamp: new Date()
      };
    }

    try {
      if (!this.resources.has(id)) {
        return {
          success: false,
          error: `Resource not found: ${id}`,
          timestamp: new Date()
        };
      }

      // 删除资源
      this.resources.delete(id);

      // 清除相关缓存
      await this.cacheManager.clearPattern(`resource:${id}:*`);
      await this.cacheManager.clearPattern('search:*');

      // 记录操作
      await this.analyticsEngine.recordOperation('delete', id, ResourceType.PDF);

      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete resource',
        timestamp: new Date()
      };
    }
  }

  /**
   * 获取分析报告
   */
  async getAnalyticsReport(): Promise<ResourceOperationResult<ResourceAnalyticsReport>> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'ResourceManager not initialized',
        timestamp: new Date()
      };
    }

    try {
      const report = await this.analyticsEngine.generateReport(this.resources);
      return {
        success: true,
        data: report,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate analytics report',
        timestamp: new Date()
      };
    }
  }

  /**
   * 私有方法：加载资源
   */
  private async loadResources(): Promise<void> {
    // 这里将来会从数据库或其他数据源加载资源
    // 目前先使用空实现
  }

  /**
   * 私有方法：本地化资源
   */
  private localizeResource(resource: EnterpriseResource, locale: Locale): EnterpriseResource {
    // 创建本地化副本
    const localized = { ...resource };
    
    // 这里可以根据locale调整显示内容
    // 例如：只返回指定语言的内容
    
    return localized;
  }

  /**
   * 私有方法：排序资源
   */
  private sortResources(
    resources: EnterpriseResource[], 
    sortBy: string, 
    sortOrder: 'asc' | 'desc'
  ): void {
    resources.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'popularity':
          comparison = a.stats.popularityScore - b.stats.popularityScore;
          break;
        case 'date':
          comparison = a.publishDate.getTime() - b.publishDate.getTime();
          break;
        case 'rating':
          comparison = a.stats.userRating - b.stats.userRating;
          break;
        case 'downloads':
          comparison = a.stats.downloads - b.stats.downloads;
          break;
        case 'relevance':
        default:
          // 综合评分：下载量 + 评分 + 点击量
          const scoreA = a.stats.downloads + a.stats.userRating + a.stats.views;
          const scoreB = b.stats.downloads + b.stats.userRating + b.stats.views;
          comparison = scoreA - scoreB;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * 私有方法：生成搜索建议
   */
  private async generateSearchSuggestions(
    searchTerm: string, 
    locale?: Locale
  ): Promise<string[]> {
    // 基于搜索词生成建议
    const suggestions = ['疼痛', '缓解', '营养', '运动', '医学', '沟通'];
    
    return suggestions.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }

  /**
   * 私有方法：更新访问统计
   */
  private async updateAccessStats(id: string): Promise<void> {
    const resource = this.resources.get(id);
    if (resource) {
      resource.stats.views++;
      resource.stats.lastAccessed = new Date();
      // 更新流行度分数
      resource.stats.popularityScore = this.calculatePopularityScore(resource.stats);
    }
  }

  /**
   * 私有方法：计算流行度分数
   */
  private calculatePopularityScore(stats: any): number {
    // 综合评分算法
    const viewsWeight = 0.3;
    const downloadsWeight = 0.4;
    const ratingWeight = 0.2;
    const recencyWeight = 0.1;
    
    const viewsScore = Math.min(stats.views / 1000, 1) * viewsWeight;
    const downloadsScore = Math.min(stats.downloads / 500, 1) * downloadsWeight;
    const ratingScore = (stats.userRating / 5) * ratingWeight;
    const recencyScore = Math.max(0, 1 - (Date.now() - stats.lastAccessed.getTime()) / (1000 * 60 * 60 * 24 * 30)) * recencyWeight;
    
    return (viewsScore + downloadsScore + ratingScore + recencyScore) * 100;
  }
} 