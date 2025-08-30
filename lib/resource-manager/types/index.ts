/**
 * Period Hub Enterprise Resource Management System
 * 企业级资源管理系统核心类型定义
 */

import { Locale } from '@/types/pdf';

// 资源状态枚举
export enum ResourceStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  PENDING = 'pending',
  DEPRECATED = 'deprecated'
}

// 资源类型枚举
export enum ResourceType {
  ARTICLE = 'article',
  PDF = 'pdf',
  INTERACTIVE_TOOL = 'interactive_tool',
  VIDEO = 'video',
  AUDIO = 'audio',
  INFOGRAPHIC = 'infographic'
}

// 资源难度级别
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// 目标用户群体
export enum TargetAudience {
  TEENS = 'teens',
  ADULTS = 'adults',
  PARENTS = 'parents',
  HEALTHCARE_PROVIDERS = 'healthcare_providers',
  EDUCATORS = 'educators',
  GENERAL = 'general'
}

// 扩展的资源分类
export interface ResourceCategory {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  icon?: string;
  color?: string;
  priority: number;
  isVisible: boolean;
  parentId?: string;
  children?: ResourceCategory[];
}

// 资源标签系统
export interface ResourceTag {
  id: string;
  name: Record<Locale, string>;
  category: string;
  priority: number;
  isVisible: boolean;
}

// 资源使用统计
export interface ResourceUsageStats {
  views: number;
  downloads: number;
  shares: number;
  likes: number;
  searchHits: number;
  lastAccessed: Date;
  popularityScore: number;
  userRating: number;
  ratingCount: number;
}

// 资源SEO信息
export interface ResourceSEO {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
  ogImage?: string;
  ogTitle?: Record<Locale, string>;
  ogDescription?: Record<Locale, string>;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

// 资源访问控制
export interface ResourceAccess {
  isPublic: boolean;
  requiresAuth: boolean;
  allowedRoles: string[];
  permissions: string[];
  ageRestriction?: number;
  geographicRestrictions?: string[];
}

// 企业级资源定义
export interface EnterpriseResource {
  // 基础信息
  id: string;
  type: ResourceType;
  status: ResourceStatus;
  version: string;
  
  // 内容信息
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  content?: Record<Locale, string>;
  summary: Record<Locale, string>;
  
  // 分类和标签
  categoryId: string;
  subcategoryId?: string;
  tags: string[];
  keywords: Record<Locale, string[]>;
  
  // 文件信息
  files: {
    [key: string]: {
      url: string;
      mimeType: string;
      size: number;
      checksum: string;
      lastModified: Date;
    };
  };
  
  // 元数据
  author: string;
  publishDate: Date;
  lastModified: Date;
  expiryDate?: Date;
  
  // 分级信息
  difficulty: DifficultyLevel;
  targetAudience: TargetAudience[];
  estimatedReadTime?: number;
  
  // 关联资源
  relatedResources: string[];
  prerequisites: string[];
  followUpResources: string[];
  
  // 统计信息
  stats: ResourceUsageStats;
  
  // SEO信息
  seo: ResourceSEO;
  
  // 访问控制
  access: ResourceAccess;
  
  // 自定义字段
  customFields: Record<string, any>;
  
  // 版本控制
  changeLog: {
    version: string;
    date: Date;
    changes: string;
    author: string;
  }[];
}

// 资源搜索过滤器
export interface ResourceSearchFilters {
  categories?: string[];
  tags?: string[];
  type?: ResourceType[];
  status?: ResourceStatus[];
  difficulty?: DifficultyLevel[];
  targetAudience?: TargetAudience[];
  publishDateRange?: {
    start: Date;
    end: Date;
  };
  language?: Locale[];
  hasFiles?: boolean;
  minimumRating?: number;
  sortBy?: 'relevance' | 'popularity' | 'date' | 'rating' | 'downloads';
  sortOrder?: 'asc' | 'desc';
}

// 资源搜索结果
export interface ResourceSearchResult {
  resources: EnterpriseResource[];
  total: number;
  page: number;
  pageSize: number;
  filters: ResourceSearchFilters;
  searchTerm?: string;
  searchTime: number;
  suggestions?: string[];
}

// 资源管理器配置
export interface ResourceManagerConfig {
  cacheEnabled: boolean;
  cacheTimeout: number;
  validationEnabled: boolean;
  statsEnabled: boolean;
  seoEnabled: boolean;
  accessControlEnabled: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultLanguage: Locale;
  supportedLanguages: Locale[];
}

// 资源操作结果
export interface ResourceOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  timestamp: Date;
}

// 批量操作
export interface BulkOperationResult {
  totalRequested: number;
  successful: number;
  failed: number;
  errors: { id: string; error: string }[];
  warnings: { id: string; warning: string }[];
}

// 资源分析报告
export interface ResourceAnalyticsReport {
  totalResources: number;
  resourcesByType: Record<ResourceType, number>;
  resourcesByStatus: Record<ResourceStatus, number>;
  resourcesByCategory: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  popularResources: Array<{ id: string; title: string; stats: ResourceUsageStats }>;
  recentActivity: Array<{ date: Date; action: string; resourceId: string }>;
  performanceMetrics: {
    averageSearchTime: number;
    averageLoadTime: number;
    errorRate: number;
    cacheHitRate: number;
  };
}

// 资源验证错误
export interface ResourceValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

// 资源导入/导出
export interface ResourceImportResult {
  imported: number;
  skipped: number;
  errors: Array<{ line: number; error: string }>;
  warnings: Array<{ line: number; warning: string }>;
}

export interface ResourceExportOptions {
  format: 'json' | 'csv' | 'xlsx' | 'xml';
  includeStats: boolean;
  includeContent: boolean;
  filters?: ResourceSearchFilters;
  fields?: string[];
} 