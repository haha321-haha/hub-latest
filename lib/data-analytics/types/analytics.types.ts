// lib/data-analytics/types/analytics.types.ts

// 基础类型定义
type SupportedLanguage = 'zh' | 'en' | 'es' | 'fr';
type ResourceCategory = 'immediate-relief' | 'preparation' | 'learning' | 'management' | 'assessment' | 'template';

interface AnalyticsData {
  downloadCount: number;
  viewCount: number;
  shareCount?: number;
  rating: number;
  reviewCount?: number;
  lastAccessedAt?: Date;
  popularityScore?: number;
}

interface SystemEvent {
  id: string;
  type: 'resource_created' | 'resource_updated' | 'resource_deleted' | 
        'resource_accessed' | 'search_performed' | 'error_occurred' |
        'user_action' | 'system_maintenance';
  timestamp: Date;
  data: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  correlationId?: string;
}

/**
 * 核心业务指标类型
 */
export interface CoreMetrics {
  /** 日活跃用户数 */
  dailyActiveUsers: number;
  /** 用户留存率 */
  userRetentionRate: number;
  /** 平台使用深度 */
  platformEngagementDepth: number;
  /** 新用户获取成本 */
  newUserAcquisitionCost: number;
  /** 用户生命周期价值 */
  userLifetimeValue: number;
}

/**
 * 指标计算结果
 */
export interface MetricsResult {
  /** 指标名称 */
  metricName: keyof CoreMetrics;
  /** 当前值 */
  currentValue: number;
  /** 上期值 */
  previousValue: number;
  /** 变化率 */
  changeRate: number;
  /** 趋势 */
  trend: 'increasing' | 'decreasing' | 'stable';
  /** 计算时间 */
  calculatedAt: Date;
  /** 数据时间窗口 */
  timeWindow: {
    start: Date;
    end: Date;
  };
}

/**
 * 用户行为事件扩展
 */
export interface EnhancedUserEvent extends SystemEvent {
  /** 用户ID */
  userId: string;
  /** 会话ID */
  sessionId: string;
  /** 用户代理 */
  userAgent?: string;
  /** 引用页面 */
  referrer?: string;
  /** 地理位置 */
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  /** 设备信息 */
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
}

/**
 * 仪表板数据
 */
export interface DashboardData {
  /** 核心指标 */
  coreMetrics: CoreMetrics;
  /** 指标结果历史 */
  metricsHistory: MetricsResult[];
  /** 用户活动统计 */
  userActivity: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
  };
  /** 资源使用统计 */
  resourceUsage: {
    totalDownloads: number;
    totalViews: number;
    popularResources: {
      resourceId: string;
      title: string;
      downloads: number;
      views: number;
    }[];
  };
  /** 系统健康状态 */
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  /** 更新时间 */
  lastUpdated: Date;
}

/**
 * 数据处理管道状态
 */
export interface DataPipelineStatus {
  /** 管道名称 */
  name: string;
  /** 当前状态 */
  status: 'idle' | 'processing' | 'completed' | 'failed';
  /** 最后运行时间 */
  lastRun: Date;
  /** 下次运行时间 */
  nextRun: Date;
  /** 处理的记录数 */
  processedRecords: number;
  /** 失败的记录数 */
  failedRecords: number;
  /** 处理时长（毫秒） */
  processingDuration: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 指标计算引擎配置
 */
export interface MetricsEngineConfig {
  /** 计算间隔（秒） */
  calculationInterval: number;
  /** 历史数据窗口（天） */
  historyWindowDays: number;
  /** 是否启用实时计算 */
  enableRealTimeCalculation: boolean;
  /** 缓存TTL（秒） */
  cacheTtl: number;
  /** 指标权重配置 */
  metricsWeights: {
    [K in keyof CoreMetrics]: number;
  };
}

// 常量定义
export const CORE_METRICS_LABELS: Record<keyof CoreMetrics, string> = {
  dailyActiveUsers: '日活跃用户数',
  userRetentionRate: '用户留存率',
  platformEngagementDepth: '平台使用深度',
  newUserAcquisitionCost: '新用户获取成本',
  userLifetimeValue: '用户生命周期价值'
};

export const METRICS_UNITS: Record<keyof CoreMetrics, string> = {
  dailyActiveUsers: '人',
  userRetentionRate: '%',
  platformEngagementDepth: '分',
  newUserAcquisitionCost: '元',
  userLifetimeValue: '元'
};

export const DEFAULT_METRICS_WEIGHTS: MetricsEngineConfig['metricsWeights'] = {
  dailyActiveUsers: 0.25,
  userRetentionRate: 0.25,
  platformEngagementDepth: 0.20,
  newUserAcquisitionCost: 0.15,
  userLifetimeValue: 0.15
}; 