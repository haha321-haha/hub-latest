/**
 * 事件收集系统
 * 专门追踪Period Hub的5个核心指标
 */

export interface UserEvent {
  userId: string;
  sessionId: string;
  eventType: EventType;
  timestamp: number;
  data: EventData;
  metadata: EventMetadata;
}

export type EventType = 
  // DAU相关事件
  | 'session_start'
  | 'session_end'
  | 'page_view'
  
  // 留存率相关事件
  | 'user_first_visit'
  | 'user_return'
  | 'user_registration'
  
  // 使用深度相关事件
  | 'content_view'
  | 'search_performed'
  | 'pdf_download'
  | 'tool_usage'
  | 'content_share'
  | 'content_bookmark'
  
  // 获客成本相关事件
  | 'user_acquisition'
  | 'traffic_source'
  | 'conversion_goal'
  
  // 生命周期价值相关事件
  | 'user_engagement'
  | 'value_action'
  | 'feedback_submitted';

export interface EventData {
  // 页面相关
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  
  // 搜索相关
  searchQuery?: string;
  searchResults?: number;
  searchClickPosition?: number;
  
  // 内容相关
  contentId?: string;
  contentType?: 'article' | 'pdf' | 'tool' | 'page';
  contentCategory?: string;
  
  // 用户行为
  sessionDuration?: number;
  scrollDepth?: number;
  clickCount?: number;
  
  // 获客相关
  trafficSource?: string;
  campaign?: string;
  medium?: string;
  
  // 价值相关
  actionValue?: number;
  engagementScore?: number;
  
  // 扩展数据
  customData?: Record<string, any>;
}

export interface EventMetadata {
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  platform: string;
  language: string;
  timezone: string;
  screenResolution?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface DAUMetrics {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface RetentionMetrics {
  cohort: string; // 队列日期
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  totalUsers: number;
  retainedUsers: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface EngagementMetrics {
  date: string;
  avgSessionDuration: number;
  avgPagesPerSession: number;
  avgSearchesPerUser: number;
  avgPDFDownloadsPerUser: number;
  returnVisitRate: number;
  engagementScore: number;
}

export interface AcquisitionMetrics {
  date: string;
  totalCost: number;
  newUsers: number;
  costPerUser: number;
  channelBreakdown: {
    channel: string;
    users: number;
    cost: number;
    cpa: number;
  }[];
  efficiency: number;
}

export interface LTVMetrics {
  date: string;
  avgLTV: number;
  valueSegments: {
    segment: string;
    userCount: number;
    avgValue: number;
    percentage: number;
  }[];
  projectedValue: number;
  valueDrivers: string[];
}

export class EventCollector {
  private events: UserEvent[] = [];
  private dailyMetrics: Map<string, any> = new Map();
  private sessionStore: Map<string, SessionData> = new Map();

  constructor() {
    this.initializeCollector();
  }

  /**
   * 记录用户事件
   */
  recordEvent(event: Omit<UserEvent, 'timestamp'>): void {
    const fullEvent: UserEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);
    this.processEventForMetrics(fullEvent);
    
    // 限制内存中的事件数量
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000);
    }
  }

  /**
   * 记录页面访问（DAU关键事件）
   */
  recordPageView(
    userId: string, 
    sessionId: string, 
    pageUrl: string, 
    metadata: EventMetadata
  ): void {
    this.recordEvent({
      userId,
      sessionId,
      eventType: 'page_view',
      data: {
        pageUrl,
        pageTitle: this.extractPageTitle(pageUrl)
      },
      metadata
    });

    // 更新会话信息
    this.updateSession(userId, sessionId, metadata);
  }

  /**
   * 记录搜索行为（使用深度关键事件）
   */
  recordSearch(
    userId: string,
    sessionId: string,
    searchQuery: string,
    resultsCount: number,
    metadata: EventMetadata
  ): void {
    this.recordEvent({
      userId,
      sessionId,
      eventType: 'search_performed',
      data: {
        searchQuery,
        searchResults: resultsCount
      },
      metadata
    });
  }

  /**
   * 记录PDF下载（使用深度关键事件）
   */
  recordPDFDownload(
    userId: string,
    sessionId: string,
    contentId: string,
    contentCategory: string,
    metadata: EventMetadata
  ): void {
    this.recordEvent({
      userId,
      sessionId,
      eventType: 'pdf_download',
      data: {
        contentId,
        contentType: 'pdf',
        contentCategory,
        actionValue: 1 // PDF下载价值权重
      },
      metadata
    });
  }

  /**
   * 记录用户获客信息
   */
  recordUserAcquisition(
    userId: string,
    sessionId: string,
    trafficSource: string,
    campaign?: string,
    cost?: number,
    metadata?: EventMetadata
  ): void {
    this.recordEvent({
      userId,
      sessionId,
      eventType: 'user_acquisition',
      data: {
        trafficSource,
        campaign,
        actionValue: cost
      },
      metadata: metadata || this.getDefaultMetadata()
    });
  }

  /**
   * 记录用户价值行为
   */
  recordValueAction(
    userId: string,
    sessionId: string,
    actionType: string,
    value: number,
    metadata: EventMetadata
  ): void {
    this.recordEvent({
      userId,
      sessionId,
      eventType: 'value_action',
      data: {
        customData: { actionType },
        actionValue: value,
        engagementScore: this.calculateEngagementScore(actionType, value)
      },
      metadata
    });
  }

  /**
   * 计算DAU指标
   */
  calculateDAUMetrics(date: string): DAUMetrics {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEvents = this.events.filter(event => 
      event.timestamp >= dayStart.getTime() && 
      event.timestamp <= dayEnd.getTime()
    );

    const activeUsers = new Set(dayEvents.map(e => e.userId)).size;
    
    // 计算新用户（首次访问）
    const newUserEvents = dayEvents.filter(e => e.eventType === 'user_first_visit');
    const newUsers = new Set(newUserEvents.map(e => e.userId)).size;
    
    const returningUsers = activeUsers - newUsers;

    // 计算增长率（需要历史数据）
    const weekAgo = new Date(dayStart);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoMetrics = this.getStoredMetrics('dau', weekAgo.toISOString().split('T')[0]);
    const weeklyGrowth = weekAgoMetrics ? 
      ((activeUsers - weekAgoMetrics.activeUsers) / weekAgoMetrics.activeUsers) * 100 : 0;

    const monthAgo = new Date(dayStart);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoMetrics = this.getStoredMetrics('dau', monthAgo.toISOString().split('T')[0]);
    const monthlyGrowth = monthAgoMetrics ? 
      ((activeUsers - monthAgoMetrics.activeUsers) / monthAgoMetrics.activeUsers) * 100 : 0;

    const metrics: DAUMetrics = {
      date,
      activeUsers,
      newUsers,
      returningUsers,
      weeklyGrowth,
      monthlyGrowth
    };

    this.storeMetrics('dau', date, metrics);
    return metrics;
  }

  /**
   * 计算用户留存率
   */
  calculateRetentionMetrics(cohortDate: string): RetentionMetrics {
    const cohortStart = new Date(cohortDate);
    cohortStart.setHours(0, 0, 0, 0);
    const cohortEnd = new Date(cohortDate);
    cohortEnd.setHours(23, 59, 59, 999);

    // 获取队列用户（当日新用户）
    const cohortUsers = new Set(
      this.events
        .filter(e => 
          e.eventType === 'user_first_visit' &&
          e.timestamp >= cohortStart.getTime() && 
          e.timestamp <= cohortEnd.getTime()
        )
        .map(e => e.userId)
    );

    const totalUsers = cohortUsers.size;
    if (totalUsers === 0) {
      return {
        cohort: cohortDate,
        day1Retention: 0,
        day7Retention: 0,
        day30Retention: 0,
        totalUsers: 0,
        retainedUsers: { day1: 0, day7: 0, day30: 0 }
      };
    }

    // 计算各时期留存
    const day1Retained = this.calculateRetentionForPeriod(cohortUsers, cohortStart, 1);
    const day7Retained = this.calculateRetentionForPeriod(cohortUsers, cohortStart, 7);
    const day30Retained = this.calculateRetentionForPeriod(cohortUsers, cohortStart, 30);

    const metrics: RetentionMetrics = {
      cohort: cohortDate,
      day1Retention: (day1Retained / totalUsers) * 100,
      day7Retention: (day7Retained / totalUsers) * 100,
      day30Retention: (day30Retained / totalUsers) * 100,
      totalUsers,
      retainedUsers: {
        day1: day1Retained,
        day7: day7Retained,
        day30: day30Retained
      }
    };

    this.storeMetrics('retention', cohortDate, metrics);
    return metrics;
  }

  /**
   * 计算使用深度指标
   */
  calculateEngagementMetrics(date: string): EngagementMetrics {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEvents = this.events.filter(event => 
      event.timestamp >= dayStart.getTime() && 
      event.timestamp <= dayEnd.getTime()
    );

    // 按用户分组统计
    const userStats = new Map<string, {
      sessionDuration: number;
      pageViews: number;
      searches: number;
      downloads: number;
      sessions: Set<string>;
    }>();

    dayEvents.forEach(event => {
      const userId = event.userId;
      const stats = userStats.get(userId) || {
        sessionDuration: 0,
        pageViews: 0,
        searches: 0,
        downloads: 0,
        sessions: new Set()
      };

      stats.sessions.add(event.sessionId);

      switch (event.eventType) {
        case 'page_view':
          stats.pageViews++;
          break;
        case 'search_performed':
          stats.searches++;
          break;
        case 'pdf_download':
          stats.downloads++;
          break;
        case 'session_end':
          stats.sessionDuration += event.data.sessionDuration || 0;
          break;
      }

      userStats.set(userId, stats);
    });

    const userCount = userStats.size;
    if (userCount === 0) {
      return {
        date,
        avgSessionDuration: 0,
        avgPagesPerSession: 0,
        avgSearchesPerUser: 0,
        avgPDFDownloadsPerUser: 0,
        returnVisitRate: 0,
        engagementScore: 0
      };
    }

    // 计算平均值
    let totalSessionDuration = 0;
    let totalPageViews = 0;
    let totalSearches = 0;
    let totalDownloads = 0;
    let totalSessions = 0;
    let returningUsers = 0;

    for (const [userId, stats] of userStats) {
      totalSessionDuration += stats.sessionDuration;
      totalPageViews += stats.pageViews;
      totalSearches += stats.searches;
      totalDownloads += stats.downloads;
      totalSessions += stats.sessions.size;
      
      // 检查是否为回访用户
      if (this.isReturningUser(userId, dayStart)) {
        returningUsers++;
      }
    }

    const avgSessionDuration = totalSessionDuration / userCount;
    const avgPagesPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
    const avgSearchesPerUser = totalSearches / userCount;
    const avgPDFDownloadsPerUser = totalDownloads / userCount;
    const returnVisitRate = (returningUsers / userCount) * 100;
    
    // 计算综合参与度评分
    const engagementScore = this.calculateOverallEngagementScore({
      sessionDuration: avgSessionDuration,
      pagesPerSession: avgPagesPerSession,
      searchesPerUser: avgSearchesPerUser,
      downloadsPerUser: avgPDFDownloadsPerUser,
      returnRate: returnVisitRate
    });

    const metrics: EngagementMetrics = {
      date,
      avgSessionDuration,
      avgPagesPerSession,
      avgSearchesPerUser,
      avgPDFDownloadsPerUser,
      returnVisitRate,
      engagementScore
    };

    this.storeMetrics('engagement', date, metrics);
    return metrics;
  }

  /**
   * 获取所有核心指标
   */
  getAllCoreMetrics(date: string) {
    return {
      dau: this.calculateDAUMetrics(date),
      retention: this.calculateRetentionMetrics(date),
      engagement: this.calculateEngagementMetrics(date),
      // acquisition 和 ltv 需要额外的成本和价值数据
    };
  }

  /**
   * 获取事件统计
   */
  getEventStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: UserEvent[];
  } {
    const eventsByType: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      eventsByType,
      recentEvents: this.events.slice(-10)
    };
  }

  /**
   * 获取收集到的事件
   * 用于数据处理管道
   */
  getCollectedEvents(): UserEvent[] {
    return [...this.events];
  }

  /**
   * 清除已处理的事件
   */
  clearProcessedEvents(): void {
    this.events = [];
  }

  /**
   * 获取最近的事件
   */
  getRecentEvents(limit: number = 100): UserEvent[] {
    return this.events.slice(-limit);
  }

  // ========== 私有方法 ==========

  private initializeCollector(): void {
    console.log('📊 EventCollector initialized for core metrics tracking');
  }

  private processEventForMetrics(event: UserEvent): void {
    // 实时处理事件，更新内存中的指标
    const today = new Date().toISOString().split('T')[0];
    
    // 根据事件类型更新相应指标
    switch (event.eventType) {
      case 'page_view':
        this.updateDAUMetrics(today, event.userId);
        break;
      case 'user_first_visit':
        this.updateRetentionMetrics(today, event.userId);
        break;
      // 其他事件类型...
    }
  }

  private updateSession(userId: string, sessionId: string, metadata: EventMetadata): void {
    const session = this.sessionStore.get(sessionId) || {
      userId,
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: []
    };

    session.lastActivity = Date.now();
    session.pageViews++;
    this.sessionStore.set(sessionId, session);
  }

  private calculateRetentionForPeriod(
    cohortUsers: Set<string>, 
    cohortStart: Date, 
    days: number
  ): number {
    const targetStart = new Date(cohortStart);
    targetStart.setDate(targetStart.getDate() + days);
    targetStart.setHours(0, 0, 0, 0);
    
    const targetEnd = new Date(targetStart);
    targetEnd.setHours(23, 59, 59, 999);

    const activeUsersInPeriod = new Set(
      this.events
        .filter(e => 
          e.timestamp >= targetStart.getTime() && 
          e.timestamp <= targetEnd.getTime()
        )
        .map(e => e.userId)
    );

    let retainedCount = 0;
    for (const userId of cohortUsers) {
      if (activeUsersInPeriod.has(userId)) {
        retainedCount++;
      }
    }

    return retainedCount;
  }

  private isReturningUser(userId: string, currentDate: Date): boolean {
    const firstVisit = this.events.find(e => 
      e.userId === userId && e.eventType === 'user_first_visit'
    );
    
    if (!firstVisit) return false;
    
    const firstVisitDate = new Date(firstVisit.timestamp);
    return firstVisitDate < currentDate;
  }

  private calculateEngagementScore(actionType: string, value: number): number {
    // 简化的参与度评分算法
    const weights = {
      'pdf_download': 3,
      'search': 2,
      'page_view': 1,
      'share': 4,
      'bookmark': 3
    };
    
    const weight = weights[actionType as keyof typeof weights] || 1;
    return Math.min(weight * value, 10);
  }

  private calculateOverallEngagementScore(metrics: {
    sessionDuration: number;
    pagesPerSession: number;
    searchesPerUser: number;
    downloadsPerUser: number;
    returnRate: number;
  }): number {
    // 综合参与度评分算法
    const durationScore = Math.min(metrics.sessionDuration / 300, 1) * 25; // 5分钟为满分
    const pageScore = Math.min(metrics.pagesPerSession / 5, 1) * 20; // 5页为满分
    const searchScore = Math.min(metrics.searchesPerUser / 3, 1) * 20; // 3次搜索为满分
    const downloadScore = Math.min(metrics.downloadsPerUser / 2, 1) * 20; // 2次下载为满分
    const returnScore = Math.min(metrics.returnRate / 100, 1) * 15; // 100%回访为满分

    return Math.round(durationScore + pageScore + searchScore + downloadScore + returnScore);
  }

  private updateDAUMetrics(date: string, userId: string): void {
    // 实时更新DAU统计
    const key = `dau_${date}`;
    const existing = this.dailyMetrics.get(key) || { users: new Set(), newUsers: new Set() };
    existing.users.add(userId);
    this.dailyMetrics.set(key, existing);
  }

  private updateRetentionMetrics(date: string, userId: string): void {
    // 实时更新留存统计
    const key = `retention_${date}`;
    const existing = this.dailyMetrics.get(key) || { newUsers: new Set() };
    existing.newUsers.add(userId);
    this.dailyMetrics.set(key, existing);
  }

  private storeMetrics(type: string, date: string, metrics: any): void {
    const key = `${type}_${date}`;
    this.dailyMetrics.set(key, metrics);
  }

  private getStoredMetrics(type: string, date: string): any {
    const key = `${type}_${date}`;
    return this.dailyMetrics.get(key);
  }

  private extractPageTitle(pageUrl: string): string {
    // 从URL提取页面标题的简单实现
    const urlParts = pageUrl.split('/');
    return urlParts[urlParts.length - 1] || 'Home';
  }

  private getDefaultMetadata(): EventMetadata {
    return {
      userAgent: 'Unknown',
      deviceType: 'desktop',
      platform: 'Unknown',
      language: 'zh',
      timezone: 'Asia/Shanghai'
    };
  }
}

interface SessionData {
  userId: string;
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: any[];
} 