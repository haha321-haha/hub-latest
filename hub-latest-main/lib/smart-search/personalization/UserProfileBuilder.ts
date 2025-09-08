/**
 * 用户画像构建系统
 * 基于用户行为数据构建多维度的用户画像
 */

import { BehaviorTracker, UserEvent, EventType, SearchEvent, ClickEvent, ViewEvent } from './BehaviorTracker';

export interface UserProfile {
  userId: string;
  demographics: UserDemographics;
  healthProfile: HealthProfile;
  behaviorProfile: BehaviorProfile;
  preferences: UserPreferences;
  interestTopics: InterestTopic[];
  sessionContext: SessionContext;
  confidence: number; // 画像可信度 (0-1)
  lastUpdated: number;
}

export interface UserDemographics {
  estimatedAge?: 'teen' | 'young_adult' | 'adult' | 'mature';
  devicePreference: 'mobile' | 'tablet' | 'desktop';
  primaryLanguage: string;
  timeZone?: string;
  activityPeakHours: number[]; // 活跃时间段
}

export interface HealthProfile {
  severityLevel: 'mild' | 'moderate' | 'severe' | 'unknown';
  symptomPatterns: string[];
  treatmentPreferences: Array<{
    type: 'medical' | 'natural' | 'lifestyle';
    confidence: number;
  }>;
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  urgencyProfile: {
    emergencyQueries: number;
    immediateNeedQueries: number;
    planningQueries: number;
  };
}

export interface BehaviorProfile {
  searchPatterns: {
    avgQueriesPerSession: number;
    avgQueryLength: number;
    queryRefinementRate: number;
    searchDepth: 'shallow' | 'moderate' | 'deep';
  };
  engagementMetrics: {
    avgTimePerContent: number;
    avgScrollDepth: number;
    returnVisitRate: number;
    contentCompletionRate: number;
  };
  navigationPatterns: {
    preferredContentTypes: Record<string, number>;
    clickThroughRate: number;
    bounceRate: number;
  };
}

export interface UserPreferences {
  contentFormat: Array<{
    type: 'article' | 'pdf' | 'tool' | 'video';
    score: number;
  }>;
  contentLength: 'short' | 'medium' | 'long' | 'mixed';
  complexity: 'simple' | 'moderate' | 'detailed';
  topicCategories: Array<{
    category: string;
    interest: number; // 0-1
  }>;
}

export interface InterestTopic {
  topic: string;
  relevance: number; // 0-1
  frequency: number;
  lastInteraction: number;
  source: 'search' | 'click' | 'view' | 'share';
}

export interface SessionContext {
  currentSession: {
    sessionId: string;
    startTime: number;
    queries: string[];
    visitedContent: string[];
    currentIntent?: string;
  };
  recentSessions: Array<{
    sessionId: string;
    duration: number;
    activityCount: number;
    mainTopics: string[];
  }>;
}

export class UserProfileBuilder {
  private behaviorTracker: BehaviorTracker;
  private profiles: Map<string, UserProfile>;
  private topicExtractor: TopicExtractor;

  constructor(behaviorTracker: BehaviorTracker) {
    this.behaviorTracker = behaviorTracker;
    this.profiles = new Map();
    this.topicExtractor = new TopicExtractor();
  }

  /**
   * 构建或更新用户画像
   */
  buildProfile(userId: string): UserProfile {
    const events = this.behaviorTracker.getUserEvents(userId);
    
    if (events.length === 0) {
      return this.createEmptyProfile(userId);
    }

    const existingProfile = this.profiles.get(userId);
    const profile: UserProfile = {
      userId,
      demographics: this.buildDemographics(events),
      healthProfile: this.buildHealthProfile(events),
      behaviorProfile: this.buildBehaviorProfile(events),
      preferences: this.buildPreferences(events),
      interestTopics: this.buildInterestTopics(events),
      sessionContext: this.buildSessionContext(events),
      confidence: this.calculateConfidence(events),
      lastUpdated: Date.now()
    };

    // 如果存在历史画像，进行增量更新
    if (existingProfile) {
      profile.interestTopics = this.mergeInterestTopics(
        existingProfile.interestTopics,
        profile.interestTopics
      );
    }

    this.profiles.set(userId, profile);
    return profile;
  }

  /**
   * 获取用户画像
   */
  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  /**
   * 获取用户画像总数
   */
  getProfileCount(): number {
    return this.profiles.size;
  }

  /**
   * 更新用户画像（增量更新）
   */
  updateProfile(userId: string, newEvents: UserEvent[]): UserProfile {
    const existingProfile = this.getProfile(userId) || this.createEmptyProfile(userId);
    
    // 分析新事件
    const newDemographics = this.buildDemographics(newEvents);
    const newHealthProfile = this.buildHealthProfile(newEvents);
    const newBehaviorProfile = this.buildBehaviorProfile(newEvents);
    const newPreferences = this.buildPreferences(newEvents);
    const newInterestTopics = this.buildInterestTopics(newEvents);

    // 合并更新
    const updatedProfile: UserProfile = {
      ...existingProfile,
      demographics: this.mergeDemographics(existingProfile.demographics, newDemographics),
      healthProfile: this.mergeHealthProfile(existingProfile.healthProfile, newHealthProfile),
      behaviorProfile: this.mergeBehaviorProfile(existingProfile.behaviorProfile, newBehaviorProfile),
      preferences: this.mergePreferences(existingProfile.preferences, newPreferences),
      interestTopics: this.mergeInterestTopics(existingProfile.interestTopics, newInterestTopics),
      sessionContext: this.buildSessionContext(this.behaviorTracker.getUserEvents(userId)),
      confidence: this.calculateConfidence(this.behaviorTracker.getUserEvents(userId)),
      lastUpdated: Date.now()
    };

    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  /**
   * 获取相似用户
   */
  findSimilarUsers(userId: string, limit: number = 5): Array<{
    userId: string;
    similarity: number;
    profile: UserProfile;
  }> {
    const targetProfile = this.getProfile(userId);
    if (!targetProfile) return [];

    const similarUsers: Array<{ userId: string; similarity: number; profile: UserProfile }> = [];

    for (const [otherUserId, otherProfile] of this.profiles) {
      if (otherUserId === userId) continue;

      const similarity = this.calculateProfileSimilarity(targetProfile, otherProfile);
      if (similarity > 0.3) { // 相似度阈值
        similarUsers.push({
          userId: otherUserId,
          similarity,
          profile: otherProfile
        });
      }
    }

    return similarUsers
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * 获取用户画像洞察
   */
  getProfileInsights(userId: string): {
    userType: string;
    mainInterests: string[];
    behaviorSummary: string;
    recommendations: string[];
  } {
    const profile = this.getProfile(userId);
    if (!profile) {
      return {
        userType: 'unknown',
        mainInterests: [],
        behaviorSummary: '用户数据不足',
        recommendations: ['继续使用以获得个性化推荐']
      };
    }

    // 分析用户类型
    const userType = this.classifyUserType(profile);
    
    // 主要兴趣
    const mainInterests = profile.interestTopics
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map(topic => topic.topic);

    // 行为总结
    const behaviorSummary = this.generateBehaviorSummary(profile);

    // 个性化建议
    const recommendations = this.generateRecommendations(profile);

    return {
      userType,
      mainInterests,
      behaviorSummary,
      recommendations
    };
  }

  // ========== 私有方法 ==========

  /**
   * 创建空的用户画像
   */
  private createEmptyProfile(userId: string): UserProfile {
    return {
      userId,
      demographics: {
        devicePreference: 'desktop',
        primaryLanguage: 'zh',
        activityPeakHours: []
      },
      healthProfile: {
        severityLevel: 'unknown',
        symptomPatterns: [],
        treatmentPreferences: [],
        knowledgeLevel: 'beginner',
        urgencyProfile: {
          emergencyQueries: 0,
          immediateNeedQueries: 0,
          planningQueries: 0
        }
      },
      behaviorProfile: {
        searchPatterns: {
          avgQueriesPerSession: 0,
          avgQueryLength: 0,
          queryRefinementRate: 0,
          searchDepth: 'shallow'
        },
        engagementMetrics: {
          avgTimePerContent: 0,
          avgScrollDepth: 0,
          returnVisitRate: 0,
          contentCompletionRate: 0
        },
        navigationPatterns: {
          preferredContentTypes: {},
          clickThroughRate: 0,
          bounceRate: 0
        }
      },
      preferences: {
        contentFormat: [],
        contentLength: 'medium',
        complexity: 'moderate',
        topicCategories: []
      },
      interestTopics: [],
      sessionContext: {
        currentSession: {
          sessionId: '',
          startTime: Date.now(),
          queries: [],
          visitedContent: [],
        },
        recentSessions: []
      },
      confidence: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * 构建用户人口统计信息
   */
  private buildDemographics(events: UserEvent[]): UserDemographics {
    const deviceCounts: Record<string, number> = {};
    const languages: Record<string, number> = {};
    const hourActivity: Record<number, number> = {};

    for (const event of events) {
      // 设备偏好
      const device = event.context.deviceType;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;

      // 语言
      const lang = event.context.language;
      languages[lang] = (languages[lang] || 0) + 1;

      // 活跃时间
      const hour = new Date(event.timestamp).getHours();
      hourActivity[hour] = (hourActivity[hour] || 0) + 1;
    }

    // 确定主要设备
    const devicePreference = Object.entries(deviceCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as 'mobile' | 'tablet' | 'desktop' || 'desktop';

    // 确定主要语言
    const primaryLanguage = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'zh';

    // 活跃时间段
    const activityPeakHours = Object.entries(hourActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      devicePreference,
      primaryLanguage,
      activityPeakHours
    };
  }

  /**
   * 构建健康画像
   */
  private buildHealthProfile(events: UserEvent[]): HealthProfile {
    const searchEvents = events.filter(e => e.type === EventType.SEARCH) as SearchEvent[];
    let severityLevel: HealthProfile['severityLevel'] = 'unknown';
    const symptomPatterns: string[] = [];
    const treatmentPreferences: HealthProfile['treatmentPreferences'] = [];
    
    // 分析查询内容判断严重程度
    let urgencyScore = 0;
    let emergencyQueries = 0;
    let immediateNeedQueries = 0;
    let planningQueries = 0;

    for (const event of searchEvents) {
      const query = event.data.query.toLowerCase();
      
      // 紧急程度分析
      if (/急救|紧急|危险|emergency|urgent/.test(query)) {
        urgencyScore += 3;
        emergencyQueries++;
      } else if (/严重|剧烈|无法|severe|intense/.test(query)) {
        urgencyScore += 2;
        immediateNeedQueries++;
      } else if (/计划|预防|长期|planning|prevention/.test(query)) {
        planningQueries++;
      }

      // 症状模式识别
      if (/头痛|恶心|呕吐|发烧/.test(query)) {
        symptomPatterns.push('伴随症状');
      }
      if (/腰痛|背痛|腹痛/.test(query)) {
        symptomPatterns.push('疼痛扩散');
      }

      // 治疗偏好分析
      if (/药物|medication|ibuprofen|布洛芬/.test(query)) {
        const existing = treatmentPreferences.find(t => t.type === 'medical');
        if (existing) {
          existing.confidence += 0.1;
        } else {
          treatmentPreferences.push({ type: 'medical', confidence: 0.6 });
        }
      }
      if (/自然|天然|热敷|按摩|瑜伽|natural/.test(query)) {
        const existing = treatmentPreferences.find(t => t.type === 'natural');
        if (existing) {
          existing.confidence += 0.1;
        } else {
          treatmentPreferences.push({ type: 'natural', confidence: 0.6 });
        }
      }
    }

    // 判断严重程度
    if (urgencyScore >= 5) {
      severityLevel = 'severe';
    } else if (urgencyScore >= 2) {
      severityLevel = 'moderate';
    } else if (searchEvents.length > 0) {
      severityLevel = 'mild';
    }

    // 知识水平判断
    let knowledgeLevel: HealthProfile['knowledgeLevel'] = 'beginner';
    const advancedTerms = searchEvents.filter(e => 
      /dysmenorrhea|prostaglandin|endometriosis/.test(e.data.query.toLowerCase())
    ).length;
    
    if (advancedTerms >= 2) {
      knowledgeLevel = 'advanced';
    } else if (searchEvents.length >= 5) {
      knowledgeLevel = 'intermediate';
    }

    return {
      severityLevel,
      symptomPatterns: Array.from(new Set(symptomPatterns)),
      treatmentPreferences,
      knowledgeLevel,
      urgencyProfile: {
        emergencyQueries,
        immediateNeedQueries,
        planningQueries
      }
    };
  }

  /**
   * 构建行为画像
   */
  private buildBehaviorProfile(events: UserEvent[]): BehaviorProfile {
    const patterns = this.behaviorTracker.analyzeSearchPatterns(events[0]?.userId || '');
    const clickEvents = events.filter(e => e.type === EventType.CLICK) as ClickEvent[];
    const viewEvents = events.filter(e => e.type === EventType.VIEW) as ViewEvent[];

    // 内容偏好统计
    const contentTypes: Record<string, number> = {};
    for (const click of clickEvents) {
      const type = click.data.elementType;
      contentTypes[type] = (contentTypes[type] || 0) + 1;
    }

    // 参与度指标
    const avgTimePerContent = viewEvents.length > 0 
      ? viewEvents.reduce((sum, e) => sum + e.data.duration, 0) / viewEvents.length 
      : 0;
    
    const avgScrollDepth = viewEvents.length > 0
      ? viewEvents.reduce((sum, e) => sum + e.data.scrollDepth, 0) / viewEvents.length
      : 0;

    return {
      searchPatterns: {
        avgQueriesPerSession: patterns.avgQueriesPerSession,
        avgQueryLength: patterns.avgQueryLength,
        queryRefinementRate: 0.1, // 简化计算
        searchDepth: patterns.avgQueriesPerSession > 3 ? 'deep' : 'shallow'
      },
      engagementMetrics: {
        avgTimePerContent,
        avgScrollDepth,
        returnVisitRate: 0.2, // 简化计算
        contentCompletionRate: avgScrollDepth > 0.8 ? 0.8 : 0.4
      },
      navigationPatterns: {
        preferredContentTypes: contentTypes,
        clickThroughRate: clickEvents.length / Math.max(events.length, 1),
        bounceRate: viewEvents.filter(e => e.data.duration < 30).length / Math.max(viewEvents.length, 1)
      }
    };
  }

  /**
   * 构建用户偏好
   */
  private buildPreferences(events: UserEvent[]): UserPreferences {
    const clickEvents = events.filter(e => e.type === EventType.CLICK) as ClickEvent[];
    const viewEvents = events.filter(e => e.type === EventType.VIEW) as ViewEvent[];

    // 内容格式偏好
    const formatCounts: Record<string, number> = {};
    for (const click of clickEvents) {
      const type = click.data.elementType;
      formatCounts[type] = (formatCounts[type] || 0) + 1;
    }

    const contentFormat = Object.entries(formatCounts)
      .map(([type, count]) => ({
        type: type as 'article' | 'pdf' | 'tool',
        score: count / clickEvents.length
      }))
      .sort((a, b) => b.score - a.score);

    // 内容长度偏好
    const avgViewTime = viewEvents.length > 0
      ? viewEvents.reduce((sum, e) => sum + e.data.duration, 0) / viewEvents.length
      : 0;
    
    let contentLength: UserPreferences['contentLength'] = 'medium';
    if (avgViewTime > 300) { // 5分钟以上
      contentLength = 'long';
    } else if (avgViewTime < 60) { // 1分钟以下
      contentLength = 'short';
    }

    return {
      contentFormat,
      contentLength,
      complexity: 'moderate', // 简化处理
      topicCategories: [] // 需要进一步实现
    };
  }

  /**
   * 构建兴趣主题
   */
  private buildInterestTopics(events: UserEvent[]): InterestTopic[] {
    const topics: Map<string, { frequency: number; lastInteraction: number; sources: string[] }> = new Map();

    for (const event of events) {
      let extractedTopics: string[] = [];

      if (event.type === EventType.SEARCH) {
        const searchEvent = event as SearchEvent;
        extractedTopics = this.topicExtractor.extractFromQuery(searchEvent.data.query);
      } else if (event.type === EventType.CLICK) {
        const clickEvent = event as ClickEvent;
        if (clickEvent.data.title) {
          extractedTopics = this.topicExtractor.extractFromTitle(clickEvent.data.title);
        }
      }

      for (const topic of extractedTopics) {
        const existing = topics.get(topic) || { frequency: 0, lastInteraction: 0, sources: [] };
        existing.frequency++;
        existing.lastInteraction = Math.max(existing.lastInteraction, event.timestamp);
        if (!existing.sources.includes(event.type)) {
          existing.sources.push(event.type);
        }
        topics.set(topic, existing);
      }
    }

    // 转换为InterestTopic数组
    const interestTopics: InterestTopic[] = [];
    for (const [topic, data] of topics) {
      const relevance = Math.min(data.frequency / events.length * 2, 1); // 归一化相关性
      interestTopics.push({
        topic,
        relevance,
        frequency: data.frequency,
        lastInteraction: data.lastInteraction,
        source: data.sources[0] as 'search' | 'click' | 'view' | 'share'
      });
    }

    return interestTopics.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * 构建会话上下文
   */
  private buildSessionContext(events: UserEvent[]): SessionContext {
    const sessions = new Map<string, UserEvent[]>();
    
    // 按会话分组事件
    for (const event of events) {
      const sessionEvents = sessions.get(event.sessionId) || [];
      sessionEvents.push(event);
      sessions.set(event.sessionId, sessionEvents);
    }

    const recentSessions = Array.from(sessions.entries())
      .map(([sessionId, sessionEvents]) => {
        const startTime = Math.min(...sessionEvents.map(e => e.timestamp));
        const endTime = Math.max(...sessionEvents.map(e => e.timestamp));
        const duration = endTime - startTime;
        
        const searchEvents = sessionEvents.filter(e => e.type === EventType.SEARCH) as SearchEvent[];
        const mainTopics = searchEvents.flatMap(e => this.topicExtractor.extractFromQuery(e.data.query));

        return {
          sessionId,
          duration,
          activityCount: sessionEvents.length,
          mainTopics: Array.from(new Set(mainTopics)).slice(0, 3)
        };
      })
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    // 当前会话（最新的会话）
    const latestSession = recentSessions[0];
    const currentSession = {
      sessionId: latestSession?.sessionId || '',
      startTime: Date.now(),
      queries: [],
      visitedContent: []
    };

    return {
      currentSession,
      recentSessions
    };
  }

  /**
   * 计算画像可信度
   */
  private calculateConfidence(events: UserEvent[]): number {
    if (events.length === 0) return 0;

    let confidence = 0;
    
    // 基于事件数量
    confidence += Math.min(events.length / 50, 0.5); // 最多贡献50%
    
    // 基于事件多样性
    const eventTypes = new Set(events.map(e => e.type));
    confidence += eventTypes.size / 10 * 0.3; // 最多贡献30%
    
    // 基于时间跨度
    const timeSpan = Math.max(...events.map(e => e.timestamp)) - Math.min(...events.map(e => e.timestamp));
    const daySpan = timeSpan / (1000 * 60 * 60 * 24);
    confidence += Math.min(daySpan / 30, 0.2); // 最多贡献20%

    return Math.min(confidence, 1.0);
  }

  /**
   * 合并兴趣主题
   */
  private mergeInterestTopics(existing: InterestTopic[], newTopics: InterestTopic[]): InterestTopic[] {
    const merged = new Map<string, InterestTopic>();

    // 添加现有主题（降低相关性）
    for (const topic of existing) {
      merged.set(topic.topic, {
        ...topic,
        relevance: topic.relevance * 0.9 // 时间衰减
      });
    }

    // 合并新主题
    for (const topic of newTopics) {
      const existing = merged.get(topic.topic);
      if (existing) {
        merged.set(topic.topic, {
          ...existing,
          relevance: Math.min(existing.relevance + topic.relevance * 0.5, 1.0),
          frequency: existing.frequency + topic.frequency,
          lastInteraction: Math.max(existing.lastInteraction, topic.lastInteraction)
        });
      } else {
        merged.set(topic.topic, topic);
      }
    }

    return Array.from(merged.values())
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20); // 保留前20个主题
  }

  /**
   * 计算画像相似度
   */
  private calculateProfileSimilarity(profile1: UserProfile, profile2: UserProfile): number {
    let similarity = 0;
    let weights = 0;

    // 健康画像相似度 (权重: 40%)
    if (profile1.healthProfile.severityLevel === profile2.healthProfile.severityLevel) {
      similarity += 0.4;
    }
    weights += 0.4;

    // 兴趣主题相似度 (权重: 35%)
    const topics1 = new Set(profile1.interestTopics.map(t => t.topic));
    const topics2 = new Set(profile2.interestTopics.map(t => t.topic));
    const intersection = new Set([...topics1].filter(x => topics2.has(x)));
    const union = new Set([...topics1, ...topics2]);
    if (union.size > 0) {
      similarity += (intersection.size / union.size) * 0.35;
    }
    weights += 0.35;

    // 行为模式相似度 (权重: 25%)
    const behavior1 = profile1.behaviorProfile;
    const behavior2 = profile2.behaviorProfile;
    const behaviorSim = 1 - Math.abs(behavior1.searchPatterns.avgQueriesPerSession - behavior2.searchPatterns.avgQueriesPerSession) / 10;
    similarity += Math.max(behaviorSim, 0) * 0.25;
    weights += 0.25;

    return weights > 0 ? similarity / weights : 0;
  }

  /**
   * 分类用户类型
   */
  private classifyUserType(profile: UserProfile): string {
    const health = profile.healthProfile;
    const behavior = profile.behaviorProfile;

    if (health.urgencyProfile.emergencyQueries > 0) {
      return '急性疼痛用户';
    }
    
    if (health.knowledgeLevel === 'advanced') {
      return '专业知识用户';
    }
    
    if (behavior.searchPatterns.searchDepth === 'deep') {
      return '深度研究用户';
    }
    
    if (health.treatmentPreferences.some(t => t.type === 'natural' && t.confidence > 0.7)) {
      return '自然疗法偏好用户';
    }
    
    return '一般健康关注用户';
  }

  /**
   * 生成行为总结
   */
  private generateBehaviorSummary(profile: UserProfile): string {
    const behavior = profile.behaviorProfile;
    const health = profile.healthProfile;

    const parts: string[] = [];
    
    if (behavior.searchPatterns.avgQueriesPerSession > 3) {
      parts.push('搜索较为深入');
    }
    
    if (behavior.engagementMetrics.avgTimePerContent > 120) {
      parts.push('内容阅读时间较长');
    }
    
    if (health.knowledgeLevel === 'advanced') {
      parts.push('具有较强的医学知识');
    }
    
    return parts.length > 0 ? parts.join('，') : '行为模式正在分析中';
  }

  /**
   * 生成个性化建议
   */
  private generateRecommendations(profile: UserProfile): string[] {
    const recommendations: string[] = [];
    const health = profile.healthProfile;
    const preferences = profile.preferences;

    if (health.severityLevel === 'severe') {
      recommendations.push('建议关注专业医疗资源');
      recommendations.push('考虑使用紧急缓解工具');
    }

    if (preferences.contentFormat.some(f => f.type === 'pdf' && f.score > 0.5)) {
      recommendations.push('为您推荐更多PDF指南');
    }

    if (health.treatmentPreferences.some(t => t.type === 'natural')) {
      recommendations.push('推荐自然疗法相关内容');
    }

    if (recommendations.length === 0) {
      recommendations.push('继续探索适合您的健康方案');
    }

    return recommendations;
  }

  /**
   * 合并人口统计信息
   */
  private mergeDemographics(existing: UserDemographics, newData: UserDemographics): UserDemographics {
    return {
      ...existing,
      devicePreference: newData.devicePreference, // 使用最新数据
      primaryLanguage: newData.primaryLanguage,
      activityPeakHours: [...new Set([...existing.activityPeakHours, ...newData.activityPeakHours])].slice(0, 5)
    };
  }

  /**
   * 合并健康画像
   */
  private mergeHealthProfile(existing: HealthProfile, newData: HealthProfile): HealthProfile {
    return {
      severityLevel: newData.severityLevel !== 'unknown' ? newData.severityLevel : existing.severityLevel,
      symptomPatterns: [...new Set([...existing.symptomPatterns, ...newData.symptomPatterns])],
      treatmentPreferences: this.mergeTreatmentPreferences(existing.treatmentPreferences, newData.treatmentPreferences),
      knowledgeLevel: newData.knowledgeLevel !== 'beginner' ? newData.knowledgeLevel : existing.knowledgeLevel,
      urgencyProfile: {
        emergencyQueries: existing.urgencyProfile.emergencyQueries + newData.urgencyProfile.emergencyQueries,
        immediateNeedQueries: existing.urgencyProfile.immediateNeedQueries + newData.urgencyProfile.immediateNeedQueries,
        planningQueries: existing.urgencyProfile.planningQueries + newData.urgencyProfile.planningQueries
      }
    };
  }

  /**
   * 合并治疗偏好
   */
  private mergeTreatmentPreferences(
    existing: HealthProfile['treatmentPreferences'], 
    newData: HealthProfile['treatmentPreferences']
  ): HealthProfile['treatmentPreferences'] {
    const merged = new Map<string, number>();
    
    for (const pref of existing) {
      merged.set(pref.type, pref.confidence);
    }
    
    for (const pref of newData) {
      const existingConf = merged.get(pref.type) || 0;
      merged.set(pref.type, Math.min(existingConf + pref.confidence * 0.3, 1.0));
    }
    
    return Array.from(merged.entries()).map(([type, confidence]) => ({
      type: type as 'medical' | 'natural' | 'lifestyle',
      confidence
    }));
  }

  /**
   * 合并行为画像
   */
  private mergeBehaviorProfile(existing: BehaviorProfile, newData: BehaviorProfile): BehaviorProfile {
    return {
      searchPatterns: {
        avgQueriesPerSession: (existing.searchPatterns.avgQueriesPerSession + newData.searchPatterns.avgQueriesPerSession) / 2,
        avgQueryLength: (existing.searchPatterns.avgQueryLength + newData.searchPatterns.avgQueryLength) / 2,
        queryRefinementRate: (existing.searchPatterns.queryRefinementRate + newData.searchPatterns.queryRefinementRate) / 2,
        searchDepth: newData.searchPatterns.searchDepth
      },
      engagementMetrics: {
        avgTimePerContent: (existing.engagementMetrics.avgTimePerContent + newData.engagementMetrics.avgTimePerContent) / 2,
        avgScrollDepth: (existing.engagementMetrics.avgScrollDepth + newData.engagementMetrics.avgScrollDepth) / 2,
        returnVisitRate: (existing.engagementMetrics.returnVisitRate + newData.engagementMetrics.returnVisitRate) / 2,
        contentCompletionRate: (existing.engagementMetrics.contentCompletionRate + newData.engagementMetrics.contentCompletionRate) / 2
      },
      navigationPatterns: newData.navigationPatterns // 使用最新数据
    };
  }

  /**
   * 合并用户偏好
   */
  private mergePreferences(existing: UserPreferences, newData: UserPreferences): UserPreferences {
    return {
      ...existing,
      contentFormat: newData.contentFormat.length > 0 ? newData.contentFormat : existing.contentFormat,
      contentLength: newData.contentLength,
      complexity: newData.complexity
    };
  }
}

/**
 * 主题提取器
 */
class TopicExtractor {
  private topics = [
    '痛经', '经痛', '月经', '生理期', '疼痛', '缓解', '治疗', '药物', 
    '自然疗法', '热敷', '按摩', '运动', '瑜伽', '饮食', '营养', '睡眠',
    '压力', '情绪', '工作', '学习', '急救', '紧急', '医生', '医院'
  ];

  extractFromQuery(query: string): string[] {
    const found: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    for (const topic of this.topics) {
      if (lowerQuery.includes(topic.toLowerCase())) {
        found.push(topic);
      }
    }
    
    return found;
  }

  extractFromTitle(title: string): string[] {
    return this.extractFromQuery(title);
  }
} 