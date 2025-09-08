/**
 * PDF资源管理系统 - 类型定义索引
 * 
 * 统一导出所有类型定义，方便其他模块使用
 */

// 重新导出现有的类型定义
export * from './resource-types';
export * from './config-types';
export * from './api-types';

// 补充基础枚举类型
export enum ResourceCategory {
  RELIEF = 'relief',
  EDUCATION = 'education',
  LIFESTYLE = 'lifestyle',
  MEDICAL = 'medical',
  EMERGENCY = 'emergency',
  WELLNESS = 'wellness'
}

export enum ResourceType {
  PDF = 'pdf',
  CHECKLIST = 'checklist',
  GUIDE = 'guide',
  TEMPLATE = 'template',
  WORKBOOK = 'workbook',
  CARD = 'card'
}

export enum ResourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DEPRECATED = 'deprecated',
  MAINTENANCE = 'maintenance'
}

// 补充基础接口类型
export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  cdnUrl: string;
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

export interface SystemConfig {
  cache?: CacheConfig;
  validation?: ValidationConfig;
  errorHandling?: ErrorHandlingConfig;
  environment?: EnvironmentConfig;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  cleanupInterval: number;
}

export interface ValidationConfig {
  enabled: boolean;
  strictMode: boolean;
  requiredFields: string[];
  customValidators: any[];
}

export interface ErrorHandlingConfig {
  enabled: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  retryAttempts: number;
  timeout: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

// 事件类型
export interface ResourceEvent {
  type: 'resource_created' | 'resource_updated' | 'resource_deleted' | 'resource_accessed';
  resourceId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemEvent {
  type: 'system_started' | 'system_stopped' | 'cache_cleared' | 'health_check';
  timestamp: Date;
  data?: Record<string, any>;
}

export interface UserEvent {
  type: 'user_download' | 'user_preview' | 'user_search' | 'user_view';
  userId?: string;
  resourceId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// 搜索和过滤相关类型
export interface SearchParams {
  query?: string;
  category?: ResourceCategory;
  type?: ResourceType;
  status?: ResourceStatus;
  tags?: string[];
  filters?: FilterOptions;
  pagination?: PaginationOptions;
  sort?: SortOptions;
}

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  quality?: 'high' | 'medium' | 'low';
  language?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// 资源操作结果类型
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ResourceOperationResult extends OperationResult {
  resourceId?: string;
  operation: 'create' | 'read' | 'update' | 'delete';
} 