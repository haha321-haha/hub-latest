// lib/pdf-resources/types/config.types.ts

import { SupportedLanguage, ResourceCategory, AccessLevel } from './resource-types';

/**
 * 存储提供商类型
 */
export type StorageProvider = 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary' | 'cdn';

/**
 * 缓存策略
 */
export type CacheStrategy = 'lru' | 'lfu' | 'ttl' | 'adaptive';

/**
 * 日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * 环境类型
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * 存储配置
 */
export interface StorageConfig {
  provider: StorageProvider;
  basePath: string;
  publicPath?: string;
  cdnUrl?: string;
  
  // 本地存储配置
  local?: {
    uploadPath: string;
    staticPath: string;
    maxFileSize: number;
    allowedFormats: string[];
  };
  
  // AWS S3配置
  s3?: {
    bucket: string;
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
    forcePathStyle?: boolean;
    encryption?: {
      enabled: boolean;
      kmsKeyId?: string;
    };
  };
  
  // Google Cloud Storage配置
  gcs?: {
    bucket: string;
    projectId: string;
    keyFilename?: string;
    credentials?: object;
  };
  
  // Azure Blob Storage配置
  azure?: {
    containerName: string;
    connectionString?: string;
    accountName?: string;
    accountKey?: string;
  };
  
  // CDN配置
  cdn?: {
    enabled: boolean;
    baseUrl: string;
    cacheTtl: number;
    purgeApiKey?: string;
  };
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  enabled: boolean;
  strategy: CacheStrategy;
  ttl: number;                    // 默认TTL（秒）
  maxSize: number;                // 最大条目数
  maxMemory?: number;             // 最大内存使用（字节）
  
  // 不同类型资源的TTL设置
  resourceTtl: {
    resource: number;
    search: number;
    stats: number;
    validation: number;
  };
  
  // Redis配置（如果使用Redis作为缓存）
  redis?: {
    enabled: boolean;
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    connectTimeout?: number;
    lazyConnect?: boolean;
    retryDelayOnFailover?: number;
  };
  
  // 内存缓存配置
  memory?: {
    checkPeriod: number;          // 清理检查周期（秒）
    useClones: boolean;           // 是否使用克隆
    errorOnMissing: boolean;      // 缓存未命中时是否抛错
  };
  
  // 预热配置
  warmup?: {
    enabled: boolean;
    resources: string[];          // 需要预热的资源ID
    categories: ResourceCategory[];
    priority: 'high' | 'medium' | 'low';
  };
}

/**
 * 验证配置
 */
export interface ValidationConfig {
  enabled: boolean;
  mode: 'strict' | 'loose' | 'custom';
  
  // 文件验证
  file: {
    maxFileSize: number;
    minFileSize: number;
    allowedFormats: string[];
    requireChecksum: boolean;
    virusScan: boolean;
  };
  
  // 内容验证
  content: {
    requireTitle: boolean;
    requireDescription: boolean;
    minTitleLength: number;
    maxTitleLength: number;
    minDescriptionLength: number;
    maxDescriptionLength: number;
    requireKeywords: boolean;
    minKeywords: number;
    maxKeywords: number;
    bannedWords: string[];
  };
  
  // 质量验证
  quality: {
    minOverallScore: number;
    requireAllScores: boolean;
    autoCalculateOverall: boolean;
    scoreWeights: {
      content: number;
      design: number;
      accuracy: number;
      usefulness: number;
    };
  };
  
  // 访问控制验证
  access: {
    requireAccessLevel: boolean;
    allowedLevels: AccessLevel[];
    requireRegions: boolean;
    defaultRegions: string[];
  };
  
  // 自定义验证规则
  custom?: {
    enabled: boolean;
    rules: ValidationRule[];
  };
}

/**
 * 自定义验证规则
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  field: string;                  // 验证的字段路径
  type: 'required' | 'format' | 'range' | 'custom';
  severity: 'error' | 'warning' | 'info';
  
  // 条件设置
  condition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
    value: any;
  };
  
  // 验证参数
  params?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: any[];
    customFunction?: string;      // 自定义验证函数名
  };
  
  message: string;
  suggestion?: string;
  enabled: boolean;
}

/**
 * 国际化配置
 */
export interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  fallbackLanguage: SupportedLanguage;
  
  // 资源加载配置
  resources: {
    loadPath: string;
    addPath?: string;
    allowMultiLoading?: boolean;
  };
  
  // 插值配置
  interpolation: {
    escapeValue: boolean;
    format?: (value: any, format: string, lng: string) => string;
  };
  
  // 复数规则
  pluralSeparator: string;
  contextSeparator: string;
  
  // 命名空间
  defaultNS: string;
  ns: string[];
  
  // 检测配置
  detection?: {
    order: ('localStorage' | 'navigator' | 'header' | 'path' | 'subdomain')[];
    caches: ('localStorage' | 'cookie')[];
    cookieMinutes?: number;
    lookupFromPathIndex?: number;
  };
}

/**
 * 安全配置
 */
export interface SecurityConfig {
  // 文件上传安全
  upload: {
    allowedMimeTypes: string[];
    maxFileSize: number;
    scanVirus: boolean;
    quarantineOnThreat: boolean;
    allowExecutables: boolean;
  };
  
  // 访问控制
  access: {
    enableRateLimiting: boolean;
    rateLimit: {
      windowMs: number;           // 时间窗口（毫秒）
      maxRequests: number;        // 最大请求数
      skipSuccessfulRequests: boolean;
    };
    
    // CORS配置
    cors: {
      origin: string | string[] | boolean;
      credentials: boolean;
      allowedHeaders: string[];
      exposedHeaders: string[];
    };
    
    // CSP配置
    csp: {
      enabled: boolean;
      directives: Record<string, string[]>;
    };
  };
  
  // 数据保护
  dataProtection: {
    encryptSensitiveData: boolean;
    hashPasswords: boolean;
    saltRounds: number;
    anonymizeIPs: boolean;
    gdprCompliant: boolean;
  };
  
  // API安全
  api: {
    requireApiKey: boolean;
    apiKeyHeader: string;
    enableJWT: boolean;
    jwtSecret?: string;
    jwtExpiresIn: string;
  };
}

/**
 * 监控配置
 */
export interface MonitoringConfig {
  enabled: boolean;
  
  // 性能监控
  performance: {
    enabled: boolean;
    sampleRate: number;           // 采样率 (0-1)
    trackPageLoads: boolean;
    trackAPIRequests: boolean;
    slowQueryThreshold: number;   // 慢查询阈值（毫秒）
  };
  
  // 错误监控
  errorTracking: {
    enabled: boolean;
    service: 'sentry' | 'bugsnag' | 'rollbar' | 'custom';
    dsn?: string;
    environment: Environment;
    release?: string;
    sampleRate: number;
    beforeSend?: string;          // 预处理函数名
  };
  
  // 日志配置
  logging: {
    enabled: boolean;
    level: LogLevel;
    format: 'json' | 'text' | 'structured';
    destination: 'console' | 'file' | 'remote' | 'multiple';
    
    // 文件日志配置
    file?: {
      path: string;
      maxSize: string;            // e.g., '10MB'
      maxFiles: number;
      datePattern: string;
    };
    
    // 远程日志配置
    remote?: {
      endpoint: string;
      apiKey?: string;
      batchSize: number;
      flushInterval: number;
    };
  };
  
  // 健康检查
  healthCheck: {
    enabled: boolean;
    endpoint: string;
    interval: number;             // 检查间隔（秒）
    timeout: number;              // 超时时间（毫秒）
    checks: HealthCheck[];
  };
  
  // 指标收集
  metrics: {
    enabled: boolean;
    service: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
    endpoint?: string;
    pushInterval: number;         // 推送间隔（秒）
    customMetrics: string[];
  };
}

/**
 * 健康检查项
 */
export interface HealthCheck {
  name: string;
  type: 'database' | 'storage' | 'cache' | 'api' | 'custom';
  timeout: number;
  retries: number;
  params?: Record<string, any>;
}

/**
 * 搜索配置
 */
export interface SearchConfig {
  enabled: boolean;
  provider: 'elasticsearch' | 'algolia' | 'typesense' | 'built-in';
  
  // 索引配置
  indexing: {
    batchSize: number;
    updateInterval: number;       // 增量更新间隔（秒）
    fullRebuildInterval: number;  // 全量重建间隔（秒）
    includeContent: boolean;      // 是否索引PDF内容
    languages: SupportedLanguage[];
  };
  
  // 搜索行为
  search: {
    fuzzySearch: boolean;
    stemming: boolean;
    synonyms: boolean;
    highlightResults: boolean;
    maxResults: number;
    timeout: number;              // 搜索超时（毫秒）
  };
  
  // 权重配置
  weights: {
    title: number;
    description: number;
    content: number;
    tags: number;
    keywords: number;
  };
  
  // Elasticsearch配置
  elasticsearch?: {
    node: string;
    apiKey?: string;
    auth?: {
      username: string;
      password: string;
    };
    ssl?: {
      ca?: string;
      rejectUnauthorized: boolean;
    };
    requestTimeout: number;
    maxRetries: number;
  };
  
  // Algolia配置
  algolia?: {
    applicationId: string;
    apiKey: string;
    indexName: string;
    settings: Record<string, any>;
  };
}

/**
 * 分析配置
 */
export interface AnalyticsConfig {
  enabled: boolean;
  providers: AnalyticsProvider[];
  
  // 数据收集
  collection: {
    trackDownloads: boolean;
    trackViews: boolean;
    trackSearches: boolean;
    trackErrors: boolean;
    anonymizeUsers: boolean;
    retentionDays: number;
  };
  
  // 报告生成
  reporting: {
    enabled: boolean;
    schedule: string;             // Cron表达式
    recipients: string[];
    format: 'pdf' | 'html' | 'json';
    includeCharts: boolean;
  };
  
  // 实时分析
  realtime: {
    enabled: boolean;
    updateInterval: number;       // 更新间隔（秒）
    maxDataPoints: number;
  };
}

/**
 * 分析提供商
 */
export interface AnalyticsProvider {
  name: string;
  type: 'google_analytics' | 'matomo' | 'mixpanel' | 'amplitude' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
}

/**
 * 备份配置
 */
export interface BackupConfig {
  enabled: boolean;
  schedule: string;               // Cron表达式
  
  // 备份策略
  strategy: {
    type: 'full' | 'incremental' | 'differential';
    retention: {
      daily: number;              // 保留天数
      weekly: number;             // 保留周数
      monthly: number;            // 保留月数
      yearly: number;             // 保留年数
    };
  };
  
  // 存储位置
  storage: {
    provider: StorageProvider;
    config: Record<string, any>;
    encryption: boolean;
    compression: boolean;
  };
  
  // 验证设置
  verification: {
    enabled: boolean;
    checkIntegrity: boolean;
    testRestore: boolean;
    schedule: string;
  };
}

/**
 * 主配置接口
 */
export interface PDFResourceConfig {
  // 基础信息
  version: string;
  environment: Environment;
  lastUpdated: string;
  
  // 核心配置
  storage: StorageConfig;
  cache: CacheConfig;
  validation: ValidationConfig;
  i18n: I18nConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  search?: SearchConfig;
  analytics?: AnalyticsConfig;
  backup?: BackupConfig;
  
  // 功能开关
  features: {
    preview: boolean;
    download: boolean;
    search: boolean;
    analytics: boolean;
    comments: boolean;
    ratings: boolean;
    recommendations: boolean;
    collections: boolean;
    versioning: boolean;
    sharing: boolean;
  };
  
  // 限制设置
  limits: {
    maxResources: number;
    maxFileSize: number;
    maxPreviewPages: number;
    maxSearchResults: number;
    maxDownloadsPerDay: number;
    maxAPIRequestsPerMinute: number;
  };
  
  // 默认值
  defaults: {
    language: SupportedLanguage;
    category: ResourceCategory;
    accessLevel: AccessLevel;
    cacheTime: number;
    pageSize: number;
  };
  
  // 实验性功能
  experimental?: {
    enableAI: boolean;
    enableMLRecommendations: boolean;
    enableAdvancedSearch: boolean;
    enableRealTimeSync: boolean;
  };
}

/**
 * 配置验证结果
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
  warnings: ConfigValidationError[];
  
  sections: {
    [K in keyof PDFResourceConfig]?: {
      isValid: boolean;
      errors: ConfigValidationError[];
      warnings: ConfigValidationError[];
    };
  };
}

/**
 * 配置验证错误
 */
export interface ConfigValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
  value?: any;
  expectedType?: string;
}

/**
 * 运行时配置
 */
export interface RuntimeConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  
  // 动态配置
  dynamic: {
    maintenanceMode: boolean;
    readOnlyMode: boolean;
    featureFlags: Record<string, boolean>;
    rateLimit: Record<string, number>;
  };
  
  // 系统信息
  system: {
    nodeVersion: string;
    platform: string;
    architecture: string;
    memory: {
      total: number;
      used: number;
      available: number;
    };
    uptime: number;
  };
}

// 配置构建器
export class ConfigBuilder {
  private config: Partial<PDFResourceConfig> = {};
  
  setEnvironment(env: Environment): this {
    this.config.environment = env;
    return this;
  }
  
  setStorage(storage: StorageConfig): this {
    this.config.storage = storage;
    return this;
  }
  
  setCache(cache: CacheConfig): this {
    this.config.cache = cache;
    return this;
  }
  
  setValidation(validation: ValidationConfig): this {
    this.config.validation = validation;
    return this;
  }
  
  enableFeature(feature: keyof PDFResourceConfig['features'], enabled: boolean = true): this {
    if (!this.config.features) {
      this.config.features = {} as any;
    }
    if (this.config.features) {
      this.config.features[feature] = enabled;
    }
    return this;
  }
  
  setLimit(limit: keyof PDFResourceConfig['limits'], value: number): this {
    if (!this.config.limits) {
      this.config.limits = {} as any;
    }
    if (this.config.limits) {
      this.config.limits[limit] = value;
    }
    return this;
  }
  
  build(): PDFResourceConfig {
    // 应用默认值和验证
    return this.applyDefaults() as PDFResourceConfig;
  }
  
  private applyDefaults(): Partial<PDFResourceConfig> {
    // 实现默认值逻辑
    return {
      version: '1.0.0',
      environment: 'development',
      lastUpdated: new Date().toISOString(),
      ...this.config
    };
  }
}

// 类型保护函数
export function isValidEnvironment(env: string): env is Environment {
  return ['development', 'staging', 'production', 'test'].includes(env);
}

export function isValidStorageProvider(provider: string): provider is StorageProvider {
  return ['local', 's3', 'gcs', 'azure', 'cloudinary', 'cdn'].includes(provider);
}

export function isValidLogLevel(level: string): level is LogLevel {
  return ['debug', 'info', 'warn', 'error', 'fatal'].includes(level);
}