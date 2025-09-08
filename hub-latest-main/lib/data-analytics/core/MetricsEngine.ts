import { 
  CoreMetrics, 
  MetricsResult, 
  EnhancedUserEvent, 
  MetricsEngineConfig,
  DashboardData,
  DEFAULT_METRICS_WEIGHTS,
  CORE_METRICS_LABELS
} from '../types/analytics.types';

/**
 * 核心指标计算引擎
 * 专门为单人运营的Period Hub设计
 */
export class MetricsEngine {
  private config: MetricsEngineConfig;
  private cache: Map<string, { data: any; timestamp: Date }> = new Map();
  private eventHistory: EnhancedUserEvent[] = [];
  private isCalculating: boolean = false;

  constructor(config: Partial<MetricsEngineConfig> = {}) {
    this.config = {
      calculationInterval: 24 * 60 * 60, // 24小时
      historyWindowDays: 30,
      enableRealTimeCalculation: true,
      cacheTtl: 60 * 60, // 1小时
      metricsWeights: DEFAULT_METRICS_WEIGHTS,
      ...config
    };
  }

  /**
   * 计算所有核心指标
   */
  async calculateAllMetrics(): Promise<CoreMetrics> {
    if (this.isCalculating) {
      // 如果正在计算，返回缓存结果
      return this.getCachedMetrics() || this.getDefaultMetrics();
    }

    this.isCalculating = true;
    
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - this.config.historyWindowDays * 24 * 60 * 60 * 1000);
      
      // 获取时间窗口内的事件
      const events = this.getEventsInWindow(windowStart, now);
      
      // 并行计算所有指标
      const [
        dailyActiveUsers,
        userRetentionRate,
        platformEngagementDepth,
        newUserAcquisitionCost,
        userLifetimeValue
      ] = await Promise.all([
        this.calculateDailyActiveUsers(events),
        this.calculateUserRetentionRate(events),
        this.calculatePlatformEngagementDepth(events),
        this.calculateNewUserAcquisitionCost(events),
        this.calculateUserLifetimeValue(events)
      ]);

      const metrics: CoreMetrics = {
        dailyActiveUsers,
        userRetentionRate,
        platformEngagementDepth,
        newUserAcquisitionCost,
        userLifetimeValue
      };

      // 缓存结果
      this.cacheMetrics(metrics);
      
      return metrics;
    } finally {
      this.isCalculating = false;
    }
  }

  /**
   * 1. 计算日活跃用户数
   * 基于用户访问事件统计
   */
  private async calculateDailyActiveUsers(events: EnhancedUserEvent[]): Promise<number> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // 统计今天的唯一用户
    const activeUsers = new Set<string>();
    
    events.forEach(event => {
      if (event.timestamp >= todayStart && event.timestamp < todayEnd) {
        if (event.type === 'user_action' || event.type === 'resource_accessed') {
          activeUsers.add(event.userId);
        }
      }
    });

    return activeUsers.size;
  }

  /**
   * 2. 计算用户留存率
   * 基于用户首次访问和回访计算
   */
  private async calculateUserRetentionRate(events: EnhancedUserEvent[]): Promise<number> {
    const userFirstVisit = new Map<string, Date>();
    const userLastVisit = new Map<string, Date>();

    // 统计每个用户的首次和最后访问时间
    events.forEach(event => {
      if (event.type === 'user_action' || event.type === 'resource_accessed') {
        const userId = event.userId;
        const timestamp = event.timestamp;

        if (!userFirstVisit.has(userId) || timestamp < userFirstVisit.get(userId)!) {
          userFirstVisit.set(userId, timestamp);
        }
        
        if (!userLastVisit.has(userId) || timestamp > userLastVisit.get(userId)!) {
          userLastVisit.set(userId, timestamp);
        }
      }
    });

    // 计算7天留存率
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersSevenDaysAgo = Array.from(userFirstVisit.entries())
      .filter(([_, firstVisit]) => firstVisit >= sevenDaysAgo);

    if (newUsersSevenDaysAgo.length === 0) return 0;

    const retainedUsers = newUsersSevenDaysAgo.filter(([userId, _]) => {
      const lastVisit = userLastVisit.get(userId);
      return lastVisit && lastVisit > sevenDaysAgo;
    });

    return (retainedUsers.length / newUsersSevenDaysAgo.length) * 100;
  }

  /**
   * 3. 计算平台使用深度
   * 基于用户行为的综合评分（分钟）
   */
  private async calculatePlatformEngagementDepth(events: EnhancedUserEvent[]): Promise<number> {
    const userEngagement = new Map<string, number>();

    events.forEach(event => {
      const userId = event.userId;
      let score = 0;

      // 根据不同事件类型给分
      switch (event.type) {
        case 'resource_accessed':
          score = 1; // 访问资源 1分
          break;
        case 'search_performed':
          score = 2; // 搜索 2分
          break;
        case 'resource_created':
          score = 5; // 创建资源 5分
          break;
        case 'user_action':
          // 根据具体行为细分
          if (event.data.action === 'download') score = 3; // 下载 3分
          if (event.data.action === 'preview') score = 1; // 预览 1分
          if (event.data.action === 'rating') score = 2; // 评分 2分
          break;
        default:
          score = 0.5; // 其他行为 0.5分
      }

      userEngagement.set(userId, (userEngagement.get(userId) || 0) + score);
    });

    // 计算平均使用深度（转换为分钟）
    const totalEngagement = Array.from(userEngagement.values()).reduce((sum, score) => sum + score, 0);
    const averageEngagement = userEngagement.size > 0 ? totalEngagement / userEngagement.size : 0;
    
    // 假设每分等于1分钟的深度参与
    return Math.round(averageEngagement * 100) / 100;
  }

  /**
   * 4. 计算新用户获取成本
   * 基于营销投入和新用户数量（简化计算）
   */
  private async calculateNewUserAcquisitionCost(events: EnhancedUserEvent[]): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = new Set<string>();

    // 统计30天内的新用户
    events.forEach(event => {
      if (event.timestamp >= thirtyDaysAgo && event.type === 'user_action') {
        newUsers.add(event.userId);
      }
    });

    // 简化计算：假设每个新用户的获取成本为固定值
    // 实际应用中这里会连接到营销数据
    const assumedMonthlyCost = 100; // 假设每月投入100元
    return newUsers.size > 0 ? assumedMonthlyCost / newUsers.size : 0;
  }

  /**
   * 5. 计算用户生命周期价值
   * 基于用户行为和参与度计算
   */
  private async calculateUserLifetimeValue(events: EnhancedUserEvent[]): Promise<number> {
    const userActions = new Map<string, number>();
    const userFirstVisit = new Map<string, Date>();
    const userLastVisit = new Map<string, Date>();

    // 统计每个用户的行为和访问时间
    events.forEach(event => {
      if (event.type === 'user_action' || event.type === 'resource_accessed') {
        const userId = event.userId;
        const timestamp = event.timestamp;

        // 统计行为次数
        userActions.set(userId, (userActions.get(userId) || 0) + 1);

        // 记录访问时间
        if (!userFirstVisit.has(userId)) {
          userFirstVisit.set(userId, timestamp);
        }
        userLastVisit.set(userId, timestamp);
      }
    });

    // 计算每个用户的价值
    let totalValue = 0;
    userActions.forEach((actionCount, userId) => {
      const firstVisit = userFirstVisit.get(userId);
      const lastVisit = userLastVisit.get(userId);
      
      if (firstVisit && lastVisit) {
        const daysActive = Math.max(1, Math.ceil((lastVisit.getTime() - firstVisit.getTime()) / (24 * 60 * 60 * 1000)));
        const engagementScore = actionCount / daysActive; // 日均参与度
        
        // 简化的价值计算：参与度 * 活跃天数 * 单位价值
        const userValue = engagementScore * Math.min(daysActive, 365) * 0.5; // 假设每个参与行为价值0.5元
        totalValue += userValue;
      }
    });

    return userActions.size > 0 ? Math.round(totalValue / userActions.size * 100) / 100 : 0;
  }

  /**
   * 获取指标趋势
   */
  async getMetricsTrend(metricName: keyof CoreMetrics, days: number = 7): Promise<MetricsResult[]> {
    const results: MetricsResult[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const cacheKey = `${metricName}_${date.toISOString().split('T')[0]}`;
      
      let result = this.getFromCache(cacheKey);
      if (!result) {
        // 这里应该从历史数据中计算，暂时使用模拟数据
        const currentValue = await this.calculateSingleMetric(metricName);
        const previousValue = currentValue * (0.9 + Math.random() * 0.2); // 模拟历史变化
        
        result = {
          metricName,
          currentValue,
          previousValue,
          changeRate: ((currentValue - previousValue) / previousValue) * 100,
          trend: currentValue > previousValue ? 'increasing' : 
                 currentValue < previousValue ? 'decreasing' : 'stable',
          calculatedAt: date,
          timeWindow: {
            start: new Date(date.getTime() - 24 * 60 * 60 * 1000),
            end: date
          }
        };
        
        this.setCache(cacheKey, result);
      }
      
      results.push(result);
    }

    return results;
  }

  /**
   * 获取仪表板数据
   */
  async getDashboardData(): Promise<DashboardData> {
    const coreMetrics = await this.calculateAllMetrics();
    const metricsHistory = await this.getMetricsTrend('dailyActiveUsers', 7);
    
    return {
      coreMetrics,
      metricsHistory,
      userActivity: {
        totalUsers: this.getTotalUsers(),
        activeUsers: coreMetrics.dailyActiveUsers,
        newUsers: this.getNewUsers(),
        returningUsers: Math.max(0, coreMetrics.dailyActiveUsers - this.getNewUsers())
      },
      resourceUsage: {
        totalDownloads: this.getTotalDownloads(),
        totalViews: this.getTotalViews(),
        popularResources: this.getPopularResources()
      },
      systemHealth: {
        status: 'healthy',
        uptime: process.uptime(),
        responseTime: this.getAverageResponseTime(),
        errorRate: this.getErrorRate()
      },
      lastUpdated: new Date()
    };
  }

  /**
   * 添加事件到历史记录
   */
  addEvent(event: EnhancedUserEvent): void {
    this.eventHistory.push(event);
    
    // 限制历史记录大小
    if (this.eventHistory.length > 10000) {
      this.eventHistory = this.eventHistory.slice(-5000);
    }

    // 如果启用了实时计算，清除相关缓存
    if (this.config.enableRealTimeCalculation) {
      this.clearMetricsCache();
    }
  }

  /**
   * 获取事件历史
   */
  getEventHistory(): EnhancedUserEvent[] {
    return [...this.eventHistory];
  }

  // 私有辅助方法
  private getEventsInWindow(start: Date, end: Date): EnhancedUserEvent[] {
    return this.eventHistory.filter(event => 
      event.timestamp >= start && event.timestamp <= end
    );
  }

  private async calculateSingleMetric(metricName: keyof CoreMetrics): Promise<number> {
    const events = this.getEventsInWindow(
      new Date(Date.now() - this.config.historyWindowDays * 24 * 60 * 60 * 1000),
      new Date()
    );

    switch (metricName) {
      case 'dailyActiveUsers':
        return this.calculateDailyActiveUsers(events);
      case 'userRetentionRate':
        return this.calculateUserRetentionRate(events);
      case 'platformEngagementDepth':
        return this.calculatePlatformEngagementDepth(events);
      case 'newUserAcquisitionCost':
        return this.calculateNewUserAcquisitionCost(events);
      case 'userLifetimeValue':
        return this.calculateUserLifetimeValue(events);
      default:
        return 0;
    }
  }

  private getCachedMetrics(): CoreMetrics | null {
    const cached = this.getFromCache('all_metrics');
    return cached || null;
  }

  private cacheMetrics(metrics: CoreMetrics): void {
    this.setCache('all_metrics', metrics);
  }

  private getDefaultMetrics(): CoreMetrics {
    return {
      dailyActiveUsers: 0,
      userRetentionRate: 0,
      platformEngagementDepth: 0,
      newUserAcquisitionCost: 0,
      userLifetimeValue: 0
    };
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp.getTime()) < this.config.cacheTtl * 1000) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: new Date() });
  }

  private clearMetricsCache(): void {
    Array.from(this.cache.keys()).forEach(key => {
      if (key.includes('metrics') || key.includes('_')) {
        this.cache.delete(key);
      }
    });
  }

  // 模拟数据方法（实际应用中应连接到真实数据源）
  private getTotalUsers(): number {
    return new Set(this.eventHistory.map(e => e.userId)).size;
  }

  private getNewUsers(): number {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const newUsers = new Set<string>();
    
    this.eventHistory.forEach(event => {
      if (event.timestamp >= todayStart && event.type === 'user_action') {
        newUsers.add(event.userId);
      }
    });
    
    return newUsers.size;
  }

  private getTotalDownloads(): number {
    return this.eventHistory.filter(e => 
      e.type === 'user_action' && e.data.action === 'download'
    ).length;
  }

  private getTotalViews(): number {
    return this.eventHistory.filter(e => 
      e.type === 'resource_accessed'
    ).length;
  }

  private getPopularResources(): any[] {
    const resourceStats = new Map<string, { downloads: number; views: number }>();
    
    this.eventHistory.forEach(event => {
      if (event.data.resourceId) {
        const resourceId = event.data.resourceId;
        const stats = resourceStats.get(resourceId) || { downloads: 0, views: 0 };
        
        if (event.type === 'user_action' && event.data.action === 'download') {
          stats.downloads++;
        } else if (event.type === 'resource_accessed') {
          stats.views++;
        }
        
        resourceStats.set(resourceId, stats);
      }
    });

    return Array.from(resourceStats.entries())
      .map(([resourceId, stats]) => ({
        resourceId,
        title: `资源 ${resourceId}`,
        downloads: stats.downloads,
        views: stats.views
      }))
      .sort((a, b) => (b.downloads + b.views) - (a.downloads + a.views))
      .slice(0, 5);
  }

  private getAverageResponseTime(): number {
    // 模拟响应时间
    return Math.round(50 + Math.random() * 100);
  }

  private getErrorRate(): number {
    // 模拟错误率
    return Math.round(Math.random() * 5 * 100) / 100;
  }
} 