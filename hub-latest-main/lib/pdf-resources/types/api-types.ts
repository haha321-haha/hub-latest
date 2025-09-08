// lib/pdf-resources/types/api.types.ts

import { 
  PDFResource, 
  ResourceCategory, 
  SupportedLanguage, 
  SearchOptions,
  ResourceStats,
  ValidationResult,
  CacheStats
} from './resource-types';

/**
 * HTTP方法
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * API响应状态
 */
export type APIStatus = 'success' | 'error' | 'partial' | 'maintenance';

/**
 * 错误类型
 */
export type ErrorType = 
  | 'validation_error'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'rate_limited'
  | 'server_error'
  | 'bad_request'
  | 'conflict'
  | 'timeout'
  | 'service_unavailable';

/**
 * 基础API响应
 */
export interface APIResponse<T = any> {
  status: APIStatus;
  message?: string;
  data?: T;
  error?: APIError;
  meta?: ResponseMeta;
  timestamp: string;
  requestId?: string;
}

/**
 * API错误信息
 */
export interface APIError {
  type: ErrorType;
  code: string;
  message: string;
  details?: string;
  field?: string;
  suggestion?: string;
  documentation?: string;
  traceId?: string;
}

/**
 * 响应元信息
 */
export interface ResponseMeta {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  processingTime?: number;
  cacheHit?: boolean;
  version?: string;
  rateLimit?: RateLimitInfo;
}

/**
 * 速率限制信息
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
}

/**
 * 排序参数
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  secondarySort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

/**
 * 过滤参数
 */
export interface FilterParams {
  category?: ResourceCategory;
  language?: SupportedLanguage;
  tags?: string[];
  featured?: boolean;
  minQuality?: number;
  maxFileSize?: number;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

/**
 * 资源查询参数
 */
export interface ResourceQueryParams extends PaginationParams, SortParams, FilterParams {
  search?: string;
  include?: ('metadata' | 'analytics' | 'content' | 'related')[];
  fields?: string[];              // 指定返回字段
  expand?: string[];              // 展开关联对象
}

/**
 * 获取单个资源的API响应
 */
export interface GetResourceResponse extends APIResponse<PDFResource> {
  data: PDFResource;
}

/**
 * 获取资源列表的API响应
 */
export interface GetResourcesResponse extends APIResponse<PDFResource[]> {
  data: PDFResource[];
  meta: ResponseMeta & {
    total: number;
    filtered: number;
    facets?: SearchFacets;
  };
}

/**
 * 搜索响应
 */
export interface SearchResponse extends APIResponse {
  data: {
    results: SearchResultItem[];
    suggestions?: string[];
    corrections?: string[];
    facets?: SearchFacets;
  };
  meta: ResponseMeta & {
    query: string;
    total: number;
    searchTime: number;
  };
}

/**
 * 搜索结果项
 */
export interface SearchResultItem {
  resource: PDFResource;
  score: number;
  highlights?: {
    title?: string[];
    description?: string[];
    content?: string[];
  };
  explanation?: {
    details: string;
    factors: { factor: string; weight: number; score: number }[];
  };
}

/**
 * 搜索分面
 */
export interface SearchFacets {
  categories: FacetItem[];
  languages: FacetItem[];
  tags: FacetItem[];
  authors: FacetItem[];
  qualityRanges: FacetItem[];
  fileSizeRanges: FacetItem[];
  dateRanges: FacetItem[];
}

/**
 * 分面项
 */
export interface FacetItem {
  value: string;
  count: number;
  selected?: boolean;
}

/**
 * 统计信息API响应
 */
export interface StatsResponse extends APIResponse<ResourceStats> {
  data: ResourceStats;
}

/**
 * 创建资源请求
 */
export interface CreateResourceRequest {
  filename: string;
  fileData: string | Buffer;      // Base64编码的文件数据或Buffer
  metadata: {
    title: { [key in SupportedLanguage]?: string };
    description: { [key in SupportedLanguage]?: string };
    author?: string;
    keywords: string[];
    category: ResourceCategory;
    tags: string[];
    language: SupportedLanguage;
  };
  content?: {
    preview?: {
      enabled: boolean;
      pages?: number[];
    };
    download?: {
      enabled: boolean;
      requireAuth?: boolean;
    };
  };
  access?: {
    level: 'public' | 'protected' | 'private';
    regions?: string[];
  };
  quality?: {
    content?: number;
    design?: number;
    accuracy?: number;
    usefulness?: number;
  };
}

/**
 * 更新资源请求
 */
export interface UpdateResourceRequest {
  metadata?: Partial<CreateResourceRequest['metadata']>;
  content?: Partial<CreateResourceRequest['content']>;
  access?: Partial<CreateResourceRequest['access']>;
  quality?: Partial<CreateResourceRequest['quality']>;
  tags?: string[];
  featured?: boolean;
  status?: 'active' | 'draft' | 'archived';
}

/**
 * 批量操作请求
 */
export interface BatchOperationRequest {
  operation: 'create' | 'update' | 'delete' | 'archive' | 'activate';
  resources: Array<{
    id?: string;
    data?: CreateResourceRequest | UpdateResourceRequest;
  }>;
  options?: {
    continueOnError?: boolean;
    validateOnly?: boolean;
    dryRun?: boolean;
  };
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse extends APIResponse {
  data: {
    successful: Array<{
      id: string;
      operation: string;
      resource?: PDFResource;
    }>;
    failed: Array<{
      id?: string;
      operation: string;
      error: APIError;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
      skipped: number;
    };
  };
}

/**
 * 文件上传请求
 */
export interface FileUploadRequest {
  file: File | Buffer;
  filename: string;
  mimeType?: string;
  checksum?: string;
  metadata?: Record<string, any>;
  options?: {
    overwrite?: boolean;
    generateThumbnail?: boolean;
    extractText?: boolean;
    compress?: boolean;
  };
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse extends APIResponse {
  data: {
    fileId: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    checksum: string;
    metadata?: {
      pageCount?: number;
      dimensions?: { width: number; height: number };
      thumbnail?: string;
      extractedText?: string;
    };
  };
}

/**
 * 预览请求参数
 */
export interface PreviewParams {
  page?: number;
  pages?: number[];
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  width?: number;
  height?: number;
  watermark?: boolean;
  annotations?: boolean;
}

/**
 * 预览响应
 */
export interface PreviewResponse extends APIResponse {
  data: {
    images: Array<{
      page: number;
      url: string;
      width: number;
      height: number;
      size: number;
    }>;
    totalPages: number;
    previewPages: number[];
  };
}

/**
 * 下载统计请求
 */
export interface DownloadStatsRequest {
  resourceId: string;
  userId?: string;
  sessionId?: string;
  metadata?: {
    userAgent?: string;
    referer?: string;
    country?: string;
    source?: string;
  };
}

/**
 * 验证API响应
 */
export interface ValidationResponse extends APIResponse<ValidationResult> {
  data: ValidationResult;
}

/**
 * 健康检查响应
 */
export interface HealthCheckResponse extends APIResponse {
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      [serviceName: string]: {
        status: 'up' | 'down' | 'degraded';
        latency?: number;
        error?: string;
        lastCheck: string;
      };
    };
    system: {
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
      cpu: {
        usage: number;
      };
      disk: {
        used: number;
        total: number;
        percentage: number;
      };
      uptime: number;
    };
  };
}

/**
 * 缓存统计响应
 */
export interface CacheStatsResponse extends APIResponse<CacheStats> {
  data: CacheStats;
}

/**
 * 导出请求
 */
export interface ExportRequest {
  format: 'json' | 'csv' | 'xlsx';
  resourceIds?: string[];
  filters?: FilterParams;
  options?: {
    includeMetadata?: boolean;
    includeAnalytics?: boolean;
    includeContent?: boolean;
    compression?: boolean;
  };
}

/**
 * 导出响应
 */
export interface ExportResponse extends APIResponse {
  data: {
    downloadUrl: string;
    filename: string;
    format: string;
    size: number;
    expiresAt: string;
    resourceCount: number;
  };
}

/**
 * 导入请求
 */
export interface ImportRequest {
  file: File | Buffer;
  format: 'json' | 'csv' | 'xlsx';
  options?: {
    overwrite?: boolean;
    validateOnly?: boolean;
    dryRun?: boolean;
    batchSize?: number;
  };
  mapping?: {
    [sourceField: string]: string;  // 字段映射
  };
}

/**
 * 导入响应
 */
export interface ImportResponse extends APIResponse {
  data: {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: {
      total: number;
      processed: number;
      successful: number;
      failed: number;
      percentage: number;
    };
    errors?: Array<{
      row: number;
      field?: string;
      message: string;
    }>;
    warnings?: Array<{
      row: number;
      field?: string;
      message: string;
    }>;
  };
}

/**
 * WebSocket消息类型
 */
export type WebSocketMessageType = 
  | 'resource_updated'
  | 'resource_deleted'
  | 'stats_updated'
  | 'search_indexed'
  | 'cache_cleared'
  | 'system_maintenance'
  | 'error_occurred';

/**
 * WebSocket消息
 */
export interface WebSocketMessage {
  type: WebSocketMessageType;
  timestamp: string;
  data: any;
  requestId?: string;
  userId?: string;
}

/**
 * API端点定义
 */
export interface APIEndpoint {
  path: string;
  method: HTTPMethod;
  description: string;
  parameters?: APIParameter[];
  requestBody?: APIRequestBody;
  responses: APIResponseSpec[];
  authentication?: boolean;
  rateLimit?: {
    requests: number;
    window: string;
  };
  deprecated?: boolean;
  version?: string;
}

/**
 * API参数定义
 */
export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header';
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  example?: any;
  default?: any;
  enum?: any[];
  pattern?: string;
  minimum?: number;
  maximum?: number;
}

/**
 * API请求体定义
 */
export interface APIRequestBody {
  contentType: string;
  schema: any;
  example?: any;
  required: boolean;
  description: string;
}

/**
 * API响应定义
 */
export interface APIResponseSpec {
  status: number;
  description: string;
  contentType?: string;
  schema?: any;
  example?: any;
  headers?: Record<string, {
    type: string;
    description: string;
  }>;
}

/**
 * API文档配置
 */
export interface APIDocumentation {
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  contact?: {
    name: string;
    email: string;
    url: string;
  };
  license?: {
    name: string;
    url: string;
  };
  servers: Array<{
    url: string;
    description: string;
    environment: 'development' | 'staging' | 'production';
  }>;
  endpoints: APIEndpoint[];
  schemas: Record<string, any>;
  examples: Record<string, any>;
}

/**
 * API客户端配置
 */
export interface APIClientConfig {
  baseURL: string;
  timeout: number;
  apiKey?: string;
  userAgent?: string;
  retries: {
    count: number;
    delay: number;
    backoff: 'linear' | 'exponential';
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
    error?: (error: any) => any;
  };
}

/**
 * API客户端接口
 */
export interface APIClient {
  // 资源管理
  getResource(id: string, options?: { include?: string[] }): Promise<GetResourceResponse>;
  getResources(params?: ResourceQueryParams): Promise<GetResourcesResponse>;
  createResource(data: CreateResourceRequest): Promise<GetResourceResponse>;
  updateResource(id: string, data: UpdateResourceRequest): Promise<GetResourceResponse>;
  deleteResource(id: string): Promise<APIResponse>;
  
  // 搜索
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;
  suggest(query: string, limit?: number): Promise<APIResponse<string[]>>;
  
  // 文件操作
  uploadFile(data: FileUploadRequest): Promise<FileUploadResponse>;
  getPreview(id: string, params?: PreviewParams): Promise<PreviewResponse>;
  downloadResource(id: string): Promise<Response>;
  
  // 统计和分析
  getStats(params?: { category?: ResourceCategory; language?: SupportedLanguage }): Promise<StatsResponse>;
  recordDownload(data: DownloadStatsRequest): Promise<APIResponse>;
  
  // 验证和健康检查
  validateResource(id: string): Promise<ValidationResponse>;
  validateConfiguration(): Promise<ValidationResponse>;
  healthCheck(): Promise<HealthCheckResponse>;
  
  // 缓存管理
  clearCache(pattern?: string): Promise<APIResponse>;
  getCacheStats(): Promise<CacheStatsResponse>;
  
  // 批量操作
  batchOperation(data: BatchOperationRequest): Promise<BatchOperationResponse>;
  
  // 导入导出
  exportResources(data: ExportRequest): Promise<ExportResponse>;
  importResources(data: ImportRequest): Promise<ImportResponse>;
  
  // 实用方法
  setApiKey(apiKey: string): void;
  setTimeout(timeout: number): void;
  enableCache(enabled: boolean): void;
}

/**
 * 类型保护函数
 */
export function isAPIError(response: APIResponse): response is APIResponse & { error: APIError } {
  return response.status === 'error' && !!response.error;
}

export function isSuccessResponse<T>(response: APIResponse<T>): response is APIResponse<T> & { data: T } {
  return response.status === 'success' && !!response.data;
}

export function isValidHTTPMethod(method: string): method is HTTPMethod {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(method);
}

export function isValidErrorType(type: string): type is ErrorType {
  return [
    'validation_error',
    'not_found',
    'unauthorized',
    'forbidden',
    'rate_limited',
    'server_error',
    'bad_request',
    'conflict',
    'timeout',
    'service_unavailable'
  ].includes(type);
}

// 常量定义
export const API_VERSION = 'v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_TIMEOUT = 30000;
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB
export const SUPPORTED_UPLOAD_FORMATS = ['application/pdf'];

// HTTP状态码映射
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// 错误代码
export const ERROR_CODES = {
  INVALID_RESOURCE_ID: 'INVALID_RESOURCE_ID',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  CACHE_ERROR: 'CACHE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  SEARCH_ERROR: 'SEARCH_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS'
} as const;