/**
 * 用户行为跟踪系统
 * 追踪和分析用户的搜索、浏览、下载等行为
 */

export enum EventType {
  SEARCH = 'search',
  CLICK = 'click',
  DOWNLOAD = 'download',
  VIEW = 'view',
  SHARE = 'share',
  BOOKMARK = 'bookmark',
  RATING = 'rating',
  TIME_SPENT = 'time_spent',
  SCROLL_DEPTH = 'scroll_depth',
  QUERY_REFINEMENT = 'query_refinement'
}

export interface UserEvent {
  id: string;
  userId: string;
  sessionId: string;
  type: EventType;
  timestamp: number;
  data: Record<string, any>;
  context: EventContext;
}

export interface EventContext {
  page: string;
  userAgent: string;
  referrer?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  language: string;
  searchQuery?: string;
  searchResults?: string[];
  previousEvents?: string[];
}

export interface SearchEvent extends UserEvent {
  type: EventType.SEARCH;
  data: {
    query: string;
    filters?: Record<string, any>;
    resultsCount: number;
    responseTime: number;
    intent?: string;
    correctedQuery?: string;
  };
}

export interface ClickEvent extends UserEvent {
  type: EventType.CLICK;
  data: {
    elementType: 'article' | 'pdf' | 'tool' | 'link';
    elementId: string;
    position: number; // 在搜索结果中的位置
    query?: string;
    title?: string;
  };
}

export interface ViewEvent extends UserEvent {
  type: EventType.VIEW;
  data: {
    contentId: string;
    contentType: 'article' | 'pdf' | 'tool';
    duration: number; // 浏览时长（秒）
    scrollDepth: number; // 滚动深度百分比
    interactions: number; // 交互次数
  };
}

export class BehaviorTracker {
  private events: Map<string, UserEvent[]>; // userId -> events
  private sessions: Map<string, string[]>; // sessionId -> eventIds
  private config: {
    maxEventsPerUser: number;
    sessionTimeout: number; // 会话超时时间（毫秒）
    enableLocalStorage: boolean;
  };

  constructor(config: Partial<typeof BehaviorTracker.prototype.config> = {}) {
    this.events = new Map();
    this.sessions = new Map();
    this.config = {
      maxEventsPerUser: 1000,
      sessionTimeout: 30 * 60 * 1000, // 30分钟
      enableLocalStorage: true,
      ...config
    };
    
    this.loadFromStorage();
  }

  /**
   * 记录事件 (别名方法)
   */
  recordEvent(event: Omit<UserEvent, 'id' | 'timestamp'>): string {
    return this.trackEvent(event);
  }

  /**
   * 记录事件
   */
  trackEvent(event: Omit<UserEvent, 'id' | 'timestamp'>): string {
    const eventId = this.generateEventId();
    const fullEvent: UserEvent = {
      ...event,
      id: eventId,
      timestamp: Date.now()
    };

    // 存储事件
    const userEvents = this.events.get(event.userId) || [];
    userEvents.push(fullEvent);
    
    // 限制事件数量
    if (userEvents.length > this.config.maxEventsPerUser) {
      userEvents.shift(); // 移除最旧的事件
    }
    
    this.events.set(event.userId, userEvents);

    // 更新会话
    const sessionEvents = this.sessions.get(event.sessionId) || [];
    sessionEvents.push(eventId);
    this.sessions.set(event.sessionId, sessionEvents);

    // 保存到本地存储
    this.saveToStorage();

    return eventId;
  }

  /**
   * 追踪搜索事件
   */
  trackSearch(
    userId: string,
    sessionId: string,
    query: string,
    resultsCount: number,
    responseTime: number,
    context: EventContext,
    additionalData: Partial<SearchEvent['data']> = {}
  ): string {
    return this.trackEvent({
      userId,
      sessionId,
      type: EventType.SEARCH,
      data: {
        query,
        resultsCount,
        responseTime,
        ...additionalData
      },
      context: {
        ...context,
        searchQuery: query
      }
    });
  }

  /**
   * 追踪点击事件
   */
  trackClick(
    userId: string,
    sessionId: string,
    elementType: ClickEvent['data']['elementType'],
    elementId: string,
    position: number,
    context: EventContext,
    additionalData: Partial<ClickEvent['data']> = {}
  ): string {
    return this.trackEvent({
      userId,
      sessionId,
      type: EventType.CLICK,
      data: {
        elementType,
        elementId,
        position,
        ...additionalData
      },
      context
    });
  }

  /**
   * 追踪内容浏览事件
   */
  trackView(
    userId: string,
    sessionId: string,
    contentId: string,
    contentType: ViewEvent['data']['contentType'],
    duration: number,
    scrollDepth: number,
    context: EventContext,
    additionalData: Partial<ViewEvent['data']> = {}
  ): string {
    return this.trackEvent({
      userId,
      sessionId,
      type: EventType.VIEW,
      data: {
        contentId,
        contentType,
        duration,
        scrollDepth,
        interactions: 0,
        ...additionalData
      },
      context
    });
  }

  /**
   * 获取用户事件
   */
  getUserEvents(userId: string, eventType?: string, limit?: number): UserEvent[] {
    const events = this.events.get(userId) || [];
    let filteredEvents = events;
    
    if (eventType) {
      filteredEvents = events.filter(event => event.type === eventType);
    }
    
    return limit ? filteredEvents.slice(-limit) : filteredEvents;
  }

  /**
   * 获取总事件数
   */
  getTotalEvents(eventType?: string): number {
    let totalCount = 0;
    
    for (const userEvents of this.events.values()) {
      if (eventType) {
        totalCount += userEvents.filter(event => event.type === eventType).length;
      } else {
        totalCount += userEvents.length;
      }
    }
    
    return totalCount;
  }

  /**
   * 获取会话事件
   */
  getSessionEvents(sessionId: string): UserEvent[] {
    const eventIds = this.sessions.get(sessionId) || [];
    const allEvents: UserEvent[] = [];
    
    for (const userEvents of this.events.values()) {
      for (const event of userEvents) {
        if (eventIds.includes(event.id)) {
          allEvents.push(event);
        }
      }
    }
    
    return allEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * 获取最近的搜索查询
   */
  getRecentSearches(userId: string, limit: number = 10): string[] {
    const events = this.getUserEvents(userId);
    const searchEvents = events
      .filter(event => event.type === EventType.SEARCH)
      .slice(-limit) as SearchEvent[];
    
    return searchEvents.map(event => event.data.query);
  }

  /**
   * 获取用户偏好内容类型
   */
  getPreferredContentTypes(userId: string): Record<string, number> {
    const events = this.getUserEvents(userId);
    const contentTypeStats: Record<string, number> = {};
    
    for (const event of events) {
      if (event.type === EventType.CLICK) {
        const clickEvent = event as ClickEvent;
        const contentType = clickEvent.data.elementType;
        contentTypeStats[contentType] = (contentTypeStats[contentType] || 0) + 1;
      }
    }
    
    return contentTypeStats;
  }

  /**
   * 分析用户搜索模式
   */
  analyzeSearchPatterns(userId: string): {
    avgQueriesPerSession: number;
    avgQueryLength: number;
    commonTerms: Array<{ term: string; frequency: number }>;
    searchTimes: Array<{ hour: number; count: number }>;
  } {
    const events = this.getUserEvents(userId);
    const searchEvents = events.filter(event => event.type === EventType.SEARCH) as SearchEvent[];
    
    if (searchEvents.length === 0) {
      return {
        avgQueriesPerSession: 0,
        avgQueryLength: 0,
        commonTerms: [],
        searchTimes: []
      };
    }

    // 计算平均每会话查询数
    const sessionsMap = new Map<string, number>();
    for (const event of searchEvents) {
      const count = sessionsMap.get(event.sessionId) || 0;
      sessionsMap.set(event.sessionId, count + 1);
    }
    const avgQueriesPerSession = Array.from(sessionsMap.values()).reduce((a, b) => a + b, 0) / sessionsMap.size;

    // 计算平均查询长度
    const totalQueryLength = searchEvents.reduce((sum, event) => sum + event.data.query.length, 0);
    const avgQueryLength = totalQueryLength / searchEvents.length;

    // 分析常用词汇
    const termFreq = new Map<string, number>();
    for (const event of searchEvents) {
      const terms = event.data.query.toLowerCase().split(/\s+/);
      for (const term of terms) {
        if (term.length > 1) {
          termFreq.set(term, (termFreq.get(term) || 0) + 1);
        }
      }
    }
    const commonTerms = Array.from(termFreq.entries())
      .map(([term, frequency]) => ({ term, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // 分析搜索时间模式
    const hourFreq = new Map<number, number>();
    for (const event of searchEvents) {
      const hour = new Date(event.timestamp).getHours();
      hourFreq.set(hour, (hourFreq.get(hour) || 0) + 1);
    }
    const searchTimes = Array.from(hourFreq.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);

    return {
      avgQueriesPerSession,
      avgQueryLength,
      commonTerms,
      searchTimes
    };
  }

  /**
   * 清理过期会话
   */
  cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, eventIds] of this.sessions) {
      // 找到会话中最新的事件
      let latestTimestamp = 0;
      for (const userEvents of this.events.values()) {
        for (const event of userEvents) {
          if (eventIds.includes(event.id) && event.timestamp > latestTimestamp) {
            latestTimestamp = event.timestamp;
          }
        }
      }

      // 检查是否过期
      if (now - latestTimestamp > this.config.sessionTimeout) {
        expiredSessions.push(sessionId);
      }
    }

    // 删除过期会话
    for (const sessionId of expiredSessions) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * 获取统计信息
   */
  getStatistics(): {
    totalUsers: number;
    totalEvents: number;
    activeSessions: number;
    eventsByType: Record<string, number>;
    averageEventsPerUser: number;
  } {
    let totalEvents = 0;
    const eventsByType: Record<string, number> = {};

    for (const userEvents of this.events.values()) {
      totalEvents += userEvents.length;
      for (const event of userEvents) {
        eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      }
    }

    return {
      totalUsers: this.events.size,
      totalEvents,
      activeSessions: this.sessions.size,
      eventsByType,
      averageEventsPerUser: this.events.size > 0 ? totalEvents / this.events.size : 0
    };
  }

  // ========== 私有方法 ==========

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 从本地存储加载数据
   */
  private loadFromStorage(): void {
    if (!this.config.enableLocalStorage || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const eventsData = localStorage.getItem('behaviorTracker_events');
      const sessionsData = localStorage.getItem('behaviorTracker_sessions');

      if (eventsData) {
        const parsed = JSON.parse(eventsData);
        this.events = new Map(parsed);
      }

      if (sessionsData) {
        const parsed = JSON.parse(sessionsData);
        this.sessions = new Map(parsed);
      }
    } catch (error) {
      console.warn('Failed to load behavior tracking data from storage:', error);
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    if (!this.config.enableLocalStorage || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem('behaviorTracker_events', JSON.stringify(Array.from(this.events.entries())));
      localStorage.setItem('behaviorTracker_sessions', JSON.stringify(Array.from(this.sessions.entries())));
    } catch (error) {
      console.warn('Failed to save behavior tracking data to storage:', error);
    }
  }
} 