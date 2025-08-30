// lib/pdf-resources/utils/url-generator.ts

import { PDFResource, SupportedLanguage, ResourceCategory } from '../types/resource-types';
import { StorageConfig } from '../types/config-types';

/**
 * URL类型枚举
 */
export enum URLType {
  RESOURCE_VIEW = 'resource_view',
  RESOURCE_DOWNLOAD = 'resource_download',
  RESOURCE_PREVIEW = 'resource_preview',
  RESOURCE_THUMBNAIL = 'resource_thumbnail',
  CATEGORY_LIST = 'category_list',
  SEARCH_RESULTS = 'search_results',
  API_ENDPOINT = 'api_endpoint',
  CDN_ASSET = 'cdn_asset',
  ADMIN_EDIT = 'admin_edit'
}

/**
 * URL生成选项
 */
interface URLGenerationOptions {
  locale?: SupportedLanguage;
  baseUrl?: string;
  protocol?: 'http' | 'https';
  subdomain?: string;
  queryParams?: Record<string, string | number | boolean>;
  fragment?: string;
  absolute?: boolean;
  includeAuth?: boolean;
  version?: string;
  cdn?: boolean;
  secure?: boolean;
  expires?: Date;
  signature?: string;
}

/**
 * 路由模板接口
 */
interface RouteTemplate {
  pattern: string;
  parameters: string[];
  example: string;
  description: string;
  requiresAuth?: boolean;
  supportedMethods?: string[];
}

/**
 * URL验证结果
 */
interface URLValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedUrl?: string;
  parsedComponents?: {
    protocol: string;
    hostname: string;
    port?: string;
    pathname: string;
    search: string;
    hash: string;
  };
}

/**
 * 站点地图条目
 */
interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternateUrls?: Array<{
    url: string;
    language: SupportedLanguage;
  }>;
}

/**
 * URL生成器类
 */
export class URLGenerator {
  private static instance: URLGenerator;
  private config: StorageConfig;
  private routeTemplates: Map<URLType, RouteTemplate> = new Map();
  private baseUrls: Map<SupportedLanguage, string> = new Map();

  constructor(config: StorageConfig) {
    this.config = config;
    this.initializeRouteTemplates();
    this.initializeBaseUrls();
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: StorageConfig): URLGenerator {
    if (!URLGenerator.instance) {
      if (!config) {
        throw new Error('Configuration required for first initialization');
      }
      URLGenerator.instance = new URLGenerator(config);
    }
    return URLGenerator.instance;
  }

  /**
   * 生成资源查看URL
   */
  generateResourceViewUrl(
    resourceId: string,
    options: URLGenerationOptions = {}
  ): string {
    const locale = options.locale || 'zh';
    const template = this.routeTemplates.get(URLType.RESOURCE_VIEW);
    
    if (!template) {
      throw new Error('Resource view route template not found');
    }

    const pathname = template.pattern
      .replace(':locale', locale)
      .replace(':resourceId', resourceId);

    return this.buildUrl(pathname, options);
  }

  /**
   * 生成资源下载URL
   */
  generateResourceDownloadUrl(
    resource: PDFResource,
    options: URLGenerationOptions = {}
  ): string {
    // 根据存储配置生成下载URL
    if (this.config.cdn?.enabled && options.cdn !== false) {
      return this.generateCDNUrl(resource.filename, options);
    }

    const locale = options.locale || 'zh';
    const template = this.routeTemplates.get(URLType.RESOURCE_DOWNLOAD);
    
    if (!template) {
      throw new Error('Resource download route template not found');
    }

    const pathname = template.pattern
      .replace(':locale', locale)
      .replace(':resourceId', resource.id);

    // 添加文件相关查询参数
    const queryParams = {
      ...options.queryParams,
      filename: resource.filename,
      type: 'direct'
    };

    return this.buildUrl(pathname, { ...options, queryParams });
  }

  /**
   * 生成资源预览URL
   */
  generateResourcePreviewUrl(
    resourceId: string,
    page?: number,
    options: URLGenerationOptions = {}
  ): string {
    const locale = options.locale || 'zh';
    const template = this.routeTemplates.get(URLType.RESOURCE_PREVIEW);
    
    if (!template) {
      throw new Error('Resource preview route template not found');
    }

    const pathname = template.pattern
      .replace(':locale', locale)
      .replace(':resourceId', resourceId);

    const queryParams = {
      ...options.queryParams,
      ...(page && { page: page.toString() })
    };

    return this.buildUrl(pathname, { ...options, queryParams });
  }

  /**
   * 生成缩略图URL
   */
  generateThumbnailUrl(
    resource: PDFResource,
    size: 'small' | 'medium' | 'large' = 'medium',
    options: URLGenerationOptions = {}
  ): string {
    if (resource.metadata.thumbnail) {
      // 如果有预设缩略图，直接使用
      return this.resolveAssetUrl(resource.metadata.thumbnail, options);
    }

    // 动态生成缩略图URL
    const template = this.routeTemplates.get(URLType.RESOURCE_THUMBNAIL);
    
    if (!template) {
      throw new Error('Resource thumbnail route template not found');
    }

    const pathname = template.pattern
      .replace(':resourceId', resource.id)
      .replace(':size', size);

    return this.buildUrl(pathname, options);
  }

  /**
   * 生成类别列表URL
   */
  generateCategoryUrl(
    category: ResourceCategory,
    options: URLGenerationOptions = {}
  ): string {
    const locale = options.locale || 'zh';
    const template = this.routeTemplates.get(URLType.CATEGORY_LIST);
    
    if (!template) {
      throw new Error('Category list route template not found');
    }

    const pathname = template.pattern
      .replace(':locale', locale)
      .replace(':category', category);

    return this.buildUrl(pathname, options);
  }

  /**
   * 生成搜索结果URL
   */
  generateSearchUrl(
    query: string,
    filters: Record<string, string> = {},
    options: URLGenerationOptions = {}
  ): string {
    const locale = options.locale || 'zh';
    const template = this.routeTemplates.get(URLType.SEARCH_RESULTS);
    
    if (!template) {
      throw new Error('Search results route template not found');
    }

    const pathname = template.pattern.replace(':locale', locale);

    const queryParams = {
      q: encodeURIComponent(query),
      ...filters,
      ...options.queryParams
    };

    return this.buildUrl(pathname, { ...options, queryParams });
  }

  /**
   * 生成API端点URL
   */
  generateAPIUrl(
    endpoint: string,
    resourceId?: string,
    options: URLGenerationOptions = {}
  ): string {
    const template = this.routeTemplates.get(URLType.API_ENDPOINT);
    
    if (!template) {
      throw new Error('API endpoint route template not found');
    }

    let pathname = template.pattern.replace(':endpoint', endpoint);
    
    if (resourceId) {
      pathname = pathname.replace(':resourceId', resourceId);
    } else {
      pathname = pathname.replace('/:resourceId', '');
    }

    const version = options.version || 'v1';
    pathname = pathname.replace(':version', version);

    return this.buildUrl(pathname, { ...options, absolute: true });
  }

  /**
   * 生成CDN资源URL
   */
  generateCDNUrl(
    assetPath: string,
    options: URLGenerationOptions = {}
  ): string {
    if (!this.config.cdn?.enabled) {
      return this.generateStaticAssetUrl(assetPath, options);
    }

    const cdnBaseUrl = this.config.cdn.baseUrl;
    const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    
    let url = `${cdnBaseUrl}/${normalizedPath}`;

    // 添加版本参数用于缓存控制
    const queryParams: Record<string, string> = {};
    
    if (options.version) {
      queryParams.v = options.version;
    }

    if (options.queryParams) {
      Object.assign(queryParams, options.queryParams);
    }

    if (Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams(queryParams);
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * 生成静态资源URL
   */
  generateStaticAssetUrl(
    assetPath: string,
    options: URLGenerationOptions = {}
  ): string {
    const publicPath = this.config.publicPath || '/static';
    const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
    const pathname = `${publicPath}${normalizedPath}`;

    return this.buildUrl(pathname, options);
  }

  /**
   * 生成签名URL (用于安全下载)
   */
  generateSignedUrl(
    resourceId: string,
    expires: Date,
    secret: string,
    options: URLGenerationOptions = {}
  ): string {
    const baseUrl = this.generateResourceDownloadUrl(
      { id: resourceId } as PDFResource,
      { ...options, queryParams: {} }
    );

    const expiresTimestamp = Math.floor(expires.getTime() / 1000);
    const signaturePayload = `${resourceId}:${expiresTimestamp}:${secret}`;
    const signature = this.generateSignature(signaturePayload);

    const queryParams = {
      ...options.queryParams,
      expires: expiresTimestamp.toString(),
      signature
    };

    const url = new URL(baseUrl);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });

    return url.toString();
  }

  /**
   * 批量生成URL
   */
  batchGenerateUrls(
    resources: PDFResource[],
    urlType: URLType,
    options: URLGenerationOptions = {}
  ): Array<{ resourceId: string; url: string }> {
    return resources.map(resource => ({
      resourceId: resource.id,
      url: this.generateUrlForResource(resource, urlType, options)
    }));
  }

  /**
   * 验证URL格式
   */
  validateUrl(url: string): URLValidationResult {
    const result: URLValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      const urlObj = new URL(url);
      
      result.parsedComponents = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash
      };

      // 检查协议
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        result.warnings.push(`不常见的协议: ${urlObj.protocol}`);
      }

      // 检查主机名
      if (!urlObj.hostname) {
        result.isValid = false;
        result.errors.push('缺少主机名');
      }

      // 检查路径长度
      if (urlObj.pathname.length > 2000) {
        result.warnings.push('URL路径过长');
      }

      // 检查查询参数
      if (urlObj.search.length > 2000) {
        result.warnings.push('查询参数过长');
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push(`URL格式无效: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * 生成站点地图
   */
  generateSitemap(
    resources: PDFResource[],
    baseUrl: string,
    options: {
      includeAlternateLanguages?: boolean;
      includeCategories?: boolean;
      includeSearch?: boolean;
    } = {}
  ): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    // 添加主页
    entries.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    });

    // 添加资源页面
    for (const resource of resources) {
      if (resource.status !== 'active') continue;

      const entry: SitemapEntry = {
        url: this.generateResourceViewUrl(resource.id, { absolute: true, baseUrl }),
        lastModified: resource.updatedAt,
        changeFrequency: 'weekly',
        priority: resource.metadata.featured ? 0.9 : 0.7
      };

      // 添加多语言版本
      if (options.includeAlternateLanguages) {
        entry.alternateUrls = [
          {
            url: this.generateResourceViewUrl(resource.id, { 
              locale: 'zh', 
              absolute: true, 
              baseUrl 
            }),
            language: 'zh'
          },
          {
            url: this.generateResourceViewUrl(resource.id, { 
              locale: 'en', 
              absolute: true, 
              baseUrl 
            }),
            language: 'en'
          }
        ];
      }

      entries.push(entry);
    }

    // 添加类别页面
    if (options.includeCategories) {
      const categories: ResourceCategory[] = [
        'immediate-relief',
        'preparation',
        'learning',
        'management',
        'assessment',
        'template'
      ];

      for (const category of categories) {
        entries.push({
          url: this.generateCategoryUrl(category, { absolute: true, baseUrl }),
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8
        });
      }
    }

    return entries;
  }

  /**
   * 获取所有路由模板
   */
  getRouteTemplates(): Map<URLType, RouteTemplate> {
    return new Map(this.routeTemplates);
  }

  /**
   * 添加自定义路由模板
   */
  addRouteTemplate(type: URLType, template: RouteTemplate): void {
    this.routeTemplates.set(type, template);
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeBaseUrls();
  }

  private initializeRouteTemplates(): void {
    this.routeTemplates.set(URLType.RESOURCE_VIEW, {
      pattern: '/:locale/resources/:resourceId',
      parameters: ['locale', 'resourceId'],
      example: '/zh/resources/immediate-pain-relief-guide-v2',
      description: '资源详情查看页面',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.RESOURCE_DOWNLOAD, {
      pattern: '/:locale/downloads/:resourceId',
      parameters: ['locale', 'resourceId'],
      example: '/zh/downloads/immediate-pain-relief-guide-v2',
      description: '资源下载页面',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.RESOURCE_PREVIEW, {
      pattern: '/:locale/downloads/preview/:resourceId',
      parameters: ['locale', 'resourceId'],
      example: '/zh/downloads/preview/immediate-pain-relief-guide-v2',
      description: '资源预览页面',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.RESOURCE_THUMBNAIL, {
      pattern: '/api/thumbnails/:resourceId/:size',
      parameters: ['resourceId', 'size'],
      example: '/api/thumbnails/immediate-pain-relief-guide-v2/medium',
      description: '资源缩略图',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.CATEGORY_LIST, {
      pattern: '/:locale/categories/:category',
      parameters: ['locale', 'category'],
      example: '/zh/categories/immediate-relief',
      description: '分类资源列表',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.SEARCH_RESULTS, {
      pattern: '/:locale/search',
      parameters: ['locale'],
      example: '/zh/search?q=pain+relief',
      description: '搜索结果页面',
      supportedMethods: ['GET']
    });

    this.routeTemplates.set(URLType.API_ENDPOINT, {
      pattern: '/api/:version/:endpoint/:resourceId',
      parameters: ['version', 'endpoint', 'resourceId'],
      example: '/api/v1/resources/immediate-pain-relief-guide-v2',
      description: 'API端点',
      requiresAuth: true,
      supportedMethods: ['GET', 'POST', 'PUT', 'DELETE']
    });

    this.routeTemplates.set(URLType.ADMIN_EDIT, {
      pattern: '/admin/resources/:resourceId/edit',
      parameters: ['resourceId'],
      example: '/admin/resources/immediate-pain-relief-guide-v2/edit',
      description: '管理员编辑页面',
      requiresAuth: true,
      supportedMethods: ['GET', 'POST']
    });
  }

  private initializeBaseUrls(): void {
    const baseUrl = this.config.publicPath || '';
    
    this.baseUrls.set('zh', `${baseUrl}/zh`);
    this.baseUrls.set('en', `${baseUrl}/en`);
    this.baseUrls.set('es', `${baseUrl}/es`);
    this.baseUrls.set('fr', `${baseUrl}/fr`);
  }

  private buildUrl(
    pathname: string,
    options: URLGenerationOptions
  ): string {
    const {
      baseUrl,
      protocol = 'https',
      subdomain,
      queryParams,
      fragment,
      absolute = false
    } = options;

    let url = '';

    if (absolute || baseUrl) {
      const host = baseUrl || 'localhost:3000';
      const fullHost = subdomain ? `${subdomain}.${host}` : host;
      url = `${protocol}://${fullHost}`;
    }

    url += pathname;

    // 添加查询参数
    if (queryParams && Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        searchParams.set(key, value.toString());
      });
      url += `?${searchParams.toString()}`;
    }

    // 添加锚点
    if (fragment) {
      url += `#${fragment}`;
    }

    return url;
  }

  private generateUrlForResource(
    resource: PDFResource,
    urlType: URLType,
    options: URLGenerationOptions
  ): string {
    switch (urlType) {
      case URLType.RESOURCE_VIEW:
        return this.generateResourceViewUrl(resource.id, options);
      case URLType.RESOURCE_DOWNLOAD:
        return this.generateResourceDownloadUrl(resource, options);
      case URLType.RESOURCE_PREVIEW:
        return this.generateResourcePreviewUrl(resource.id, undefined, options);
      case URLType.RESOURCE_THUMBNAIL:
        return this.generateThumbnailUrl(resource, 'medium', options);
      default:
        throw new Error(`Unsupported URL type for resource: ${urlType}`);
    }
  }

  private resolveAssetUrl(
    assetPath: string,
    options: URLGenerationOptions
  ): string {
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
      return assetPath; // 绝对URL
    }

    if (this.config.cdn?.enabled && options.cdn !== false) {
      return this.generateCDNUrl(assetPath, options);
    }

    return this.generateStaticAssetUrl(assetPath, options);
  }

  private generateSignature(payload: string): string {
    // 简化的签名算法，实际应用中应使用HMAC-SHA256
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * URL生成器工具函数
 */
export const urlGenerator = {
  getInstance: URLGenerator.getInstance,
  
  // 快捷方法
  resourceView: (resourceId: string, locale?: SupportedLanguage) => 
    URLGenerator.getInstance().generateResourceViewUrl(resourceId, { locale }),
  
  resourceDownload: (resource: PDFResource, locale?: SupportedLanguage) =>
    URLGenerator.getInstance().generateResourceDownloadUrl(resource, { locale }),
  
  resourcePreview: (resourceId: string, locale?: SupportedLanguage) =>
    URLGenerator.getInstance().generateResourcePreviewUrl(resourceId, undefined, { locale }),
  
  category: (category: ResourceCategory, locale?: SupportedLanguage) =>
    URLGenerator.getInstance().generateCategoryUrl(category, { locale }),
  
  search: (query: string, locale?: SupportedLanguage) =>
    URLGenerator.getInstance().generateSearchUrl(query, {}, { locale })
};