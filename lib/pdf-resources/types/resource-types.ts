// lib/pdf-resources/types/resource.types.ts

/**
 * 支持的语言类型
 */
export type SupportedLanguage = 'zh' | 'en' | 'es' | 'fr';

/**
 * 资源类别
 */
export type ResourceCategory = 
  | 'immediate-relief'  // 即时缓解
  | 'preparation'       // 计划准备
  | 'learning'         // 学习理解
  | 'management'       // 长期管理
  | 'assessment'       // 评估工具
  | 'template';        // 模板表格

/**
 * 访问权限类型
 */
export type AccessLevel = 'public' | 'protected' | 'premium' | 'private';

/**
 * 资源状态
 */
export type ResourceStatus = 'active' | 'draft' | 'archived' | 'deprecated';

/**
 * 多语言字符串
 */
export interface LocalizedString {
  zh: string;
  en: string;
  es?: string;
  fr?: string;
}

/**
 * 质量评分
 */
export interface QualityScore {
  content: number;     // 内容质量 (1-10)
  design: number;      // 设计质量 (1-10)
  accuracy: number;    // 准确性 (1-10)
  usefulness: number;  // 实用性 (1-10)
  overall: number;     // 综合评分 (自动计算)
}

/**
 * 访问配置
 */
export interface AccessConfig {
  level: AccessLevel;
  public: boolean;
  regions: string[];          // 支持的地区 ['all', 'cn', 'us', 'eu']
  ageRestriction?: number;    // 年龄限制
  requireAuth?: boolean;      // 是否需要认证
  premiumOnly?: boolean;      // 是否仅限高级用户
}

/**
 * 分析数据
 */
export interface AnalyticsData {
  downloadCount: number;
  viewCount: number;
  shareCount?: number;
  rating: number;           // 平均评分 (0-5)
  reviewCount?: number;     // 评论数量
  lastAccessedAt?: Date;    // 最后访问时间
  popularityScore?: number; // 受欢迎程度 (自动计算)
}

/**
 * 用户评论
 */
export interface UserReview {
  id: string;
  userId?: string;
  userName?: string;
  rating: number;       // 1-5星评分
  comment: string;
  createdAt: Date;
  helpful: number;      // 有用票数
  reported?: boolean;   // 是否被举报
}

/**
 * 资源元数据
 */
export interface ResourceMetadata {
  title: LocalizedString;
  description: LocalizedString;
  author?: string;
  coAuthors?: string[];
  keywords: string[];
  thumbnail?: string;           // 缩略图URL
  banner?: string;             // 横幅图URL
  featured: boolean;           // 是否精选
  trending?: boolean;          // 是否热门
  quality: QualityScore;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';  // 难度级别
  estimatedReadTime?: number;  // 预计阅读时间（分钟）
  lastReviewed?: Date;        // 最后审核时间
  reviewedBy?: string;        // 审核人员
}

/**
 * PDF内容配置
 */
export interface PDFContent {
  preview: {
    enabled: boolean;
    pages: number[];          // 可预览的页面
    watermark?: string;       // 水印文字
    maxPreviewPages?: number; // 最大预览页数
  };
  download: {
    enabled: boolean;
    requireAuth?: boolean;
    trackDownloads: boolean;
    downloadLimit?: number;   // 每日下载限制
    fileFormat?: 'pdf' | 'compressed'; // 文件格式
  };
  search: {
    indexed: boolean;
    extractedText?: string;   // 提取的文本内容
    searchKeywords: string[]; // 搜索关键词
    searchableContent?: {     // 可搜索的结构化内容
      sections: {
        title: string;
        content: string;
        pageNumber: number;
      }[];
    };
  };
  interactive?: {
    hasForm: boolean;         // 是否包含表单
    formFields?: string[];    // 表单字段
    hasCalculator?: boolean;  // 是否包含计算器
    hasLinks?: boolean;       // 是否包含外部链接
  };
}

/**
 * 版本信息
 */
export interface VersionInfo {
  version: string;          // 版本号 (e.g., "2.1.0")
  releaseDate: Date;        // 发布日期
  changelog?: string;       // 更新日志
  isLatest: boolean;        // 是否最新版本
  deprecated?: boolean;     // 是否已废弃
  migrationPath?: string;   // 迁移路径说明
}

/**
 * 基础资源接口
 */
export interface BaseResource {
  id: string;
  type: 'pdf' | 'document' | 'template' | 'guide';
  status: ResourceStatus;
  version: VersionInfo;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  metadata: ResourceMetadata;
  access: AccessConfig;
  analytics: AnalyticsData;
}

/**
 * PDF资源接口
 */
export interface PDFResource extends BaseResource {
  type: 'pdf';
  filename: string;
  fileSize: number;         // 文件大小（字节）
  pageCount: number;        // 页数
  language: SupportedLanguage;
  category: ResourceCategory;
  tags: string[];
  content: PDFContent;
  
  // PDF特有属性
  pdfMetadata?: {
    producer?: string;      // PDF生成工具
    creator?: string;       // 创建者应用
    subject?: string;       // PDF主题
    securityLevel?: 'none' | 'password' | 'certificate'; // 安全级别
    permissions?: {         // 权限设置
      printing: boolean;
      copying: boolean;
      commenting: boolean;
      formFilling: boolean;
    };
  };
  
  // 关联资源
  relatedResources?: {
    type: 'prerequisite' | 'follow-up' | 'related' | 'alternative';
    resourceId: string;
    description?: string;
  }[];
  
  // 本地化变体
  localizedVersions?: {
    language: SupportedLanguage;
    resourceId: string;
    completeness: number;   // 本地化完成度 (0-1)
  }[];
}

/**
 * 资源集合
 */
export interface ResourceCollection {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  resourceIds: string[];
  category: ResourceCategory;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  estimatedCompletionTime?: number; // 预计完成时间（分钟）
}

/**
 * 搜索选项
 */
export interface SearchOptions {
  query?: string;
  category?: ResourceCategory;
  tags?: string[];
  language?: SupportedLanguage;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  minQuality?: number;
  maxFileSize?: number;
  hasPreview?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'quality' | 'date' | 'popularity' | 'downloads';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 搜索结果
 */
export interface SearchResult {
  resource: PDFResource;
  score: number;            // 相关性评分
  matchedFields: string[];  // 匹配的字段
  highlights?: {            // 高亮摘要
    title?: string;
    description?: string;
    content?: string;
  };
}

/**
 * 分页搜索结果
 */
export interface PaginatedSearchResult {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  facets?: {               // 搜索分面
    categories: { category: ResourceCategory; count: number }[];
    languages: { language: SupportedLanguage; count: number }[];
    tags: { tag: string; count: number }[];
    quality: { range: string; count: number }[];
  };
}

/**
 * 资源统计
 */
export interface ResourceStats {
  totalCount: number;
  totalSize: number;        // 总文件大小
  averageQuality: number;
  totalDownloads: number;
  totalViews: number;
  lastUpdated: number;      // 时间戳
  
  byCategory: Record<ResourceCategory, number>;
  byLanguage: Record<SupportedLanguage, number>;
  byStatus: Record<ResourceStatus, number>;
  
  topResources: {
    mostDownloaded: { resourceId: string; count: number }[];
    highestRated: { resourceId: string; rating: number }[];
    mostRecent: { resourceId: string; updatedAt: Date }[];
    trending: { resourceId: string; score: number }[];
  };
  
  // 时间序列数据
  timeline?: {
    date: string;
    downloads: number;
    views: number;
    newResources: number;
  }[];
}

/**
 * 验证错误
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  suggestion?: string;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions?: ValidationError[];
  
  summary: {
    totalChecks: number;
    passedChecks: number;
    errorCount: number;
    warningCount: number;
  };
}

/**
 * 缓存条目
 */
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessedAt: Date;
  size?: number;           // 条目大小（字节）
}

/**
 * 缓存统计
 */
export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;         // 命中率
  evictionCount: number;   // 驱逐次数
  oldestEntry?: Date;
  newestEntry?: Date;
  mostAccessedKey?: string;
}

/**
 * 错误上下文
 */
export interface ErrorContext {
  operation: string;
  resourceId?: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  stackTrace?: string;
  userAgent?: string;
  ip?: string;
}

/**
 * 系统事件
 */
export interface SystemEvent {
  id: string;
  type: 'resource_created' | 'resource_updated' | 'resource_deleted' | 
        'resource_accessed' | 'search_performed' | 'error_occurred' |
        'user_action' | 'system_maintenance';
  timestamp: Date;
  data: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;          // 事件来源
  correlationId?: string;  // 关联ID
}

/**
 * 导出/导入格式
 */
export interface ExportFormat {
  format: 'json' | 'csv' | 'xlsx' | 'xml';
  options?: {
    includeMetadata?: boolean;
    includeAnalytics?: boolean;
    compression?: boolean;
    encryption?: boolean;
  };
}

/**
 * 批量操作结果
 */
export interface BatchOperationResult {
  totalCount: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    resourceId: string;
    error: string;
  }>;
  warnings: Array<{
    resourceId: string;
    warning: string;
  }>;
  duration: number;        // 操作耗时（毫秒）
}

// 类型保护函数
export function isPDFResource(resource: BaseResource): resource is PDFResource {
  return resource.type === 'pdf';
}

export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return ['zh', 'en', 'es', 'fr'].includes(lang);
}

export function isValidCategory(category: string): category is ResourceCategory {
  return [
    'immediate-relief',
    'preparation', 
    'learning',
    'management',
    'assessment',
    'template'
  ].includes(category);
}

export function isValidAccessLevel(level: string): level is AccessLevel {
  return ['public', 'protected', 'premium', 'private'].includes(level);
}

// 常量定义
export const RESOURCE_CATEGORIES: Record<ResourceCategory, LocalizedString> = {
  'immediate-relief': {
    zh: '即时缓解',
    en: 'Immediate Relief'
  },
  'preparation': {
    zh: '计划准备',
    en: 'Preparation'
  },
  'learning': {
    zh: '学习理解',
    en: 'Learning'
  },
  'management': {
    zh: '长期管理',
    en: 'Management'
  },
  'assessment': {
    zh: '评估工具',
    en: 'Assessment'
  },
  'template': {
    zh: '模板表格',
    en: 'Templates'
  }
};

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English',
  es: 'Español',
  fr: 'Français'
};

export const DEFAULT_QUALITY_SCORE: QualityScore = {
  content: 5,
  design: 5,
  accuracy: 5,
  usefulness: 5,
  overall: 5
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_PREVIEW_PAGES = 5;
export const DEFAULT_CACHE_TTL = 3600; // 1小时
export const MAX_SEARCH_RESULTS = 100;