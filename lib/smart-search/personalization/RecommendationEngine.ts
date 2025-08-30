/**
 * 内容推荐引擎
 * 基于用户画像和协同过滤算法提供个性化内容推荐
 */

import { UserProfile, BehaviorProfile, HealthProfile } from './UserProfileBuilder';
import { BehaviorTracker, EventType, ClickEvent } from './BehaviorTracker';

export interface RecommendationItem {
  contentId: string;
  contentType: 'article' | 'pdf' | 'tool';
  title: string;
  description?: string;
  score: number;
  confidence: number;
  reason: string;
  category: string;
  metadata?: Record<string, any>;
}

export interface RecommendationResult {
  recommendations: RecommendationItem[];
  totalScore: number;
  strategy: string;
  explanations: string[];
  diversity: number; // 推荐多样性 0-1
}

export interface ContentItem {
  id: string;
  type: 'article' | 'pdf' | 'tool';
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  popularity: number; // 0-1
  quality: number; // 0-1
  lastUpdated: number;
  metadata: Record<string, any>;
}

export interface RecommendationOptions {
  maxRecommendations: number;
  diversityWeight: number; // 多样性权重 0-1
  noveltyWeight: number; // 新颖性权重 0-1
  popularityWeight: number; // 热门度权重 0-1
  personalWeight: number; // 个性化权重 0-1
  includeExplanations: boolean;
  excludeIds: string[];
  forceCategories?: string[];
}

export class RecommendationEngine {
  private contentDatabase: Map<string, ContentItem>;
  private userInteractions: Map<string, Map<string, number>>; // userId -> contentId -> score
  private contentSimilarity: Map<string, Map<string, number>>; // contentId -> contentId -> similarity
  private categoryWeights: Map<string, number>;

  constructor() {
    this.contentDatabase = new Map();
    this.userInteractions = new Map();
    this.contentSimilarity = new Map();
    this.categoryWeights = new Map();
    this.initializeCategoryWeights();
  }

  /**
   * 添加内容到数据库
   */
  addContent(content: ContentItem): void {
    this.contentDatabase.set(content.id, content);
    this.updateContentSimilarity(content);
  }

  /**
   * 批量添加内容
   */
  addContentBatch(contents: ContentItem[]): void {
    for (const content of contents) {
      this.addContent(content);
    }
  }

  /**
   * 记录用户交互
   */
  recordInteraction(
    userId: string, 
    contentId: string, 
    interactionType: 'view' | 'click' | 'download' | 'share' | 'like',
    duration?: number
  ): void {
    const userInteractions = this.userInteractions.get(userId) || new Map();
    
    // 计算交互得分
    const score = this.calculateInteractionScore(interactionType, duration);
    
    // 累积得分
    const currentScore = userInteractions.get(contentId) || 0;
    userInteractions.set(contentId, currentScore + score);
    
    this.userInteractions.set(userId, userInteractions);
  }

  /**
   * 生成个性化推荐
   */
  generateRecommendations(
    userProfile: UserProfile,
    options: Partial<RecommendationOptions> = {}
  ): RecommendationResult {
    const opts: RecommendationOptions = {
      maxRecommendations: 10,
      diversityWeight: 0.3,
      noveltyWeight: 0.2,
      popularityWeight: 0.2,
      personalWeight: 0.3,
      includeExplanations: true,
      excludeIds: [],
      ...options
    };

    // 获取候选内容
    const candidates = this.getCandidateContent(userProfile, opts);
    
    // 多策略推荐
    const strategies = [
      { name: 'content_based', weight: 0.4 },
      { name: 'collaborative', weight: 0.3 },
      { name: 'popularity_based', weight: 0.2 },
      { name: 'health_focused', weight: 0.1 }
    ];

    const allRecommendations: Map<string, RecommendationItem> = new Map();
    
    for (const strategy of strategies) {
      const strategyRecs = this.applyStrategy(
        strategy.name, 
        userProfile, 
        candidates, 
        opts
      );
      
      // 合并推荐，调整权重
      for (const rec of strategyRecs) {
        const existing = allRecommendations.get(rec.contentId);
        if (existing) {
          existing.score += rec.score * strategy.weight;
          existing.confidence = Math.max(existing.confidence, rec.confidence);
        } else {
          allRecommendations.set(rec.contentId, {
            ...rec,
            score: rec.score * strategy.weight
          });
        }
      }
    }

    // 应用多样性和新颖性调整
    const adjustedRecs = this.applyDiversityAndNovelty(
      Array.from(allRecommendations.values()),
      userProfile,
      opts
    );

    // 排序和筛选
    const finalRecommendations = adjustedRecs
      .sort((a, b) => b.score - a.score)
      .slice(0, opts.maxRecommendations);

    // 计算多样性指标
    const diversity = this.calculateDiversity(finalRecommendations);
    
    // 生成解释
    const explanations = opts.includeExplanations 
      ? this.generateExplanations(finalRecommendations, userProfile)
      : [];

    return {
      recommendations: finalRecommendations,
      totalScore: finalRecommendations.reduce((sum, rec) => sum + rec.score, 0),
      strategy: 'hybrid_multi_strategy',
      explanations,
      diversity
    };
  }

  /**
   * 获取相似内容推荐
   */
  getSimilarContent(
    contentId: string, 
    limit: number = 5,
    excludeIds: string[] = []
  ): RecommendationItem[] {
    const similarities = this.contentSimilarity.get(contentId) || new Map();
    const recommendations: RecommendationItem[] = [];

    for (const [similarId, similarity] of similarities) {
      if (excludeIds.includes(similarId) || similarId === contentId) {
        continue;
      }

      const content = this.contentDatabase.get(similarId);
      if (content && similarity > 0.3) {
        recommendations.push({
          contentId: similarId,
          contentType: content.type,
          title: content.title,
          description: content.description,
          score: similarity,
          confidence: 0.8,
          reason: '基于内容相似性',
          category: content.category,
          metadata: content.metadata
        });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * 获取热门推荐
   */
  getPopularRecommendations(
    category?: string, 
    limit: number = 10
  ): RecommendationItem[] {
    const contents = Array.from(this.contentDatabase.values());
    
    let filtered = contents;
    if (category) {
      filtered = contents.filter(c => c.category === category);
    }

    return filtered
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
      .map(content => ({
        contentId: content.id,
        contentType: content.type,
        title: content.title,
        description: content.description,
        score: content.popularity,
        confidence: 0.7,
        reason: '热门内容',
        category: content.category,
        metadata: content.metadata
      }));
  }

  /**
   * 获取紧急推荐（针对高紧急度需求）
   */
  getUrgentRecommendations(urgencyLevel: 'high' | 'critical'): RecommendationItem[] {
    const contents = Array.from(this.contentDatabase.values())
      .filter(c => c.urgency === urgencyLevel || c.urgency === 'critical');

    return contents
      .sort((a, b) => b.quality - a.quality)
      .slice(0, 5)
      .map(content => ({
        contentId: content.id,
        contentType: content.type,
        title: content.title,
        description: content.description,
        score: 1.0,
        confidence: 0.95,
        reason: '紧急需求匹配',
        category: content.category,
        metadata: content.metadata
      }));
  }

  // ========== 私有方法 ==========

  /**
   * 初始化分类权重
   */
  private initializeCategoryWeights(): void {
    this.categoryWeights.set('immediate_relief', 1.0);
    this.categoryWeights.set('medical_treatment', 0.9);
    this.categoryWeights.set('natural_therapy', 0.8);
    this.categoryWeights.set('lifestyle', 0.7);
    this.categoryWeights.set('education', 0.6);
    this.categoryWeights.set('prevention', 0.5);
  }

  /**
   * 计算交互得分
   */
  private calculateInteractionScore(
    interactionType: 'view' | 'click' | 'download' | 'share' | 'like',
    duration?: number
  ): number {
    const baseScores = {
      view: 0.1,
      click: 0.3,
      download: 0.8,
      share: 1.0,
      like: 0.9
    };

    let score = baseScores[interactionType];

    // 基于浏览时长调整
    if (interactionType === 'view' && duration) {
      if (duration > 300) { // 5分钟以上
        score += 0.5;
      } else if (duration > 60) { // 1分钟以上
        score += 0.2;
      }
    }

    return Math.min(score, 1.0);
  }

  /**
   * 获取候选内容
   */
  private getCandidateContent(
    userProfile: UserProfile,
    options: RecommendationOptions
  ): ContentItem[] {
    const allContent = Array.from(this.contentDatabase.values());
    
    // 过滤排除的内容
    let candidates = allContent.filter(c => !options.excludeIds.includes(c.id));

    // 如果指定了分类，只推荐指定分类
    if (options.forceCategories && options.forceCategories.length > 0) {
      candidates = candidates.filter(c => options.forceCategories!.includes(c.category));
    }

    // 基于用户知识水平过滤
    const knowledgeLevel = userProfile.healthProfile.knowledgeLevel;
    if (knowledgeLevel === 'beginner') {
      candidates = candidates.filter(c => c.difficulty !== 'advanced');
    } else if (knowledgeLevel === 'intermediate') {
      // 中级用户可以看所有内容，但偏向中级
    }

    return candidates;
  }

  /**
   * 应用推荐策略
   */
  private applyStrategy(
    strategyName: string,
    userProfile: UserProfile,
    candidates: ContentItem[],
    options: RecommendationOptions
  ): RecommendationItem[] {
    switch (strategyName) {
      case 'content_based':
        return this.contentBasedRecommendation(userProfile, candidates);
      case 'collaborative':
        return this.collaborativeFiltering(userProfile, candidates);
      case 'popularity_based':
        return this.popularityBasedRecommendation(candidates);
      case 'health_focused':
        return this.healthFocusedRecommendation(userProfile, candidates);
      default:
        return [];
    }
  }

  /**
   * 基于内容的推荐
   */
  private contentBasedRecommendation(
    userProfile: UserProfile,
    candidates: ContentItem[]
  ): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];
    const userInterests = userProfile.interestTopics;

    for (const content of candidates) {
      let score = 0;
      const matchedTopics: string[] = [];

      // 基于兴趣主题匹配
      for (const interest of userInterests) {
        if (content.tags.some(tag => tag.toLowerCase().includes(interest.topic.toLowerCase()))) {
          score += interest.relevance * 0.8;
          matchedTopics.push(interest.topic);
        }
        if (content.title.toLowerCase().includes(interest.topic.toLowerCase())) {
          score += interest.relevance * 0.6;
          matchedTopics.push(interest.topic);
        }
      }

      // 基于健康状况匹配
      const healthProfile = userProfile.healthProfile;
      if (healthProfile.severityLevel !== 'unknown') {
        const severityMatch = this.matchSeverityLevel(content, healthProfile.severityLevel);
        score += severityMatch * 0.4;
      }

      // 基于治疗偏好匹配
      for (const preference of healthProfile.treatmentPreferences) {
        if (this.matchTreatmentPreference(content, preference.type)) {
          score += preference.confidence * 0.3;
        }
      }

      if (score > 0.2) {
        recommendations.push({
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          description: content.description,
          score,
          confidence: 0.8,
          reason: `匹配兴趣: ${matchedTopics.join(', ')}`,
          category: content.category,
          metadata: content.metadata
        });
      }
    }

    return recommendations;
  }

  /**
   * 协同过滤推荐
   */
  private collaborativeFiltering(
    userProfile: UserProfile,
    candidates: ContentItem[]
  ): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];
    const userId = userProfile.userId;
    const userInteractions = this.userInteractions.get(userId) || new Map();

    // 找到相似用户
    const similarUsers = this.findSimilarUsers(userId, 5);

    for (const content of candidates) {
      let score = 0;
      let supportingUsers = 0;

      // 检查相似用户是否喜欢这个内容
      for (const { userId: similarUserId, similarity } of similarUsers) {
        const similarUserInteractions = this.userInteractions.get(similarUserId) || new Map();
        const interactionScore = similarUserInteractions.get(content.id) || 0;
        
        if (interactionScore > 0.5) {
          score += similarity * interactionScore;
          supportingUsers++;
        }
      }

      // 只推荐有足够支持的内容
      if (supportingUsers >= 2 && score > 0.3) {
        recommendations.push({
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          description: content.description,
          score,
          confidence: 0.7,
          reason: `${supportingUsers} 个相似用户喜欢`,
          category: content.category,
          metadata: content.metadata
        });
      }
    }

    return recommendations;
  }

  /**
   * 基于热门度的推荐
   */
  private popularityBasedRecommendation(candidates: ContentItem[]): RecommendationItem[] {
    return candidates
      .filter(c => c.popularity > 0.6)
      .map(content => ({
        contentId: content.id,
        contentType: content.type,
        title: content.title,
        description: content.description,
        score: content.popularity,
        confidence: 0.6,
        reason: '热门内容',
        category: content.category,
        metadata: content.metadata
      }));
  }

  /**
   * 基于健康需求的推荐
   */
  private healthFocusedRecommendation(
    userProfile: UserProfile,
    candidates: ContentItem[]
  ): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];
    const healthProfile = userProfile.healthProfile;

    for (const content of candidates) {
      let score = 0;
      const reasons: string[] = [];

      // 紧急度匹配
      if (healthProfile.urgencyProfile.emergencyQueries > 0 && content.urgency === 'critical') {
        score += 0.8;
        reasons.push('紧急需求');
      }

      // 症状模式匹配
      for (const symptom of healthProfile.symptomPatterns) {
        if (content.tags.some(tag => tag.includes(symptom))) {
          score += 0.3;
          reasons.push(`症状相关: ${symptom}`);
        }
      }

      // 知识水平匹配
      if (content.difficulty === healthProfile.knowledgeLevel) {
        score += 0.2;
        reasons.push('难度适合');
      }

      if (score > 0.3) {
        recommendations.push({
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          description: content.description,
          score,
          confidence: 0.9,
          reason: reasons.join(', '),
          category: content.category,
          metadata: content.metadata
        });
      }
    }

    return recommendations;
  }

  /**
   * 应用多样性和新颖性调整
   */
  private applyDiversityAndNovelty(
    recommendations: RecommendationItem[],
    userProfile: UserProfile,
    options: RecommendationOptions
  ): RecommendationItem[] {
    // 多样性调整：确保不同分类的内容都有
    const categoryCount = new Map<string, number>();
    const adjustedRecs: RecommendationItem[] = [];

    for (const rec of recommendations) {
      const categoryCount_ = categoryCount.get(rec.category) || 0;
      
      // 分类多样性惩罚
      const diversityPenalty = categoryCount_ * 0.1 * options.diversityWeight;
      rec.score = Math.max(rec.score - diversityPenalty, 0.1);
      
      // 新颖性奖励
      const noveltyBonus = this.calculateNoveltyBonus(rec, userProfile) * options.noveltyWeight;
      rec.score += noveltyBonus;
      
      adjustedRecs.push(rec);
      categoryCount.set(rec.category, categoryCount_ + 1);
    }

    return adjustedRecs;
  }

  /**
   * 计算多样性指标
   */
  private calculateDiversity(recommendations: RecommendationItem[]): number {
    if (recommendations.length <= 1) return 1.0;

    const categories = new Set(recommendations.map(r => r.category));
    const types = new Set(recommendations.map(r => r.contentType));
    
    const categoryDiversity = categories.size / recommendations.length;
    const typeDiversity = types.size / recommendations.length;
    
    return (categoryDiversity + typeDiversity) / 2;
  }

  /**
   * 生成推荐解释
   */
  private generateExplanations(
    recommendations: RecommendationItem[],
    userProfile: UserProfile
  ): string[] {
    const explanations: string[] = [];
    
    const topCategories = this.getTopCategories(recommendations, 3);
    explanations.push(`主要推荐分类: ${topCategories.join(', ')}`);
    
    const userType = this.classifyUserType(userProfile);
    explanations.push(`基于您的用户类型: ${userType}`);
    
    const topReasons = this.getTopReasons(recommendations, 3);
    explanations.push(`推荐理由: ${topReasons.join(', ')}`);
    
    return explanations;
  }

  /**
   * 更新内容相似度
   */
  private updateContentSimilarity(newContent: ContentItem): void {
    const allContent = Array.from(this.contentDatabase.values());
    
    for (const content of allContent) {
      if (content.id === newContent.id) continue;
      
      const similarity = this.calculateContentSimilarity(newContent, content);
      
      // 更新双向相似度
      const similarities1 = this.contentSimilarity.get(newContent.id) || new Map();
      similarities1.set(content.id, similarity);
      this.contentSimilarity.set(newContent.id, similarities1);
      
      const similarities2 = this.contentSimilarity.get(content.id) || new Map();
      similarities2.set(newContent.id, similarity);
      this.contentSimilarity.set(content.id, similarities2);
    }
  }

  /**
   * 计算内容相似度
   */
  private calculateContentSimilarity(content1: ContentItem, content2: ContentItem): number {
    let similarity = 0;

    // 分类相似度
    if (content1.category === content2.category) {
      similarity += 0.4;
    }

    // 标签相似度
    const tags1 = new Set(content1.tags);
    const tags2 = new Set(content2.tags);
    const intersection = new Set([...tags1].filter(x => tags2.has(x)));
    const union = new Set([...tags1, ...tags2]);
    if (union.size > 0) {
      similarity += (intersection.size / union.size) * 0.3;
    }

    // 难度相似度
    if (content1.difficulty === content2.difficulty) {
      similarity += 0.2;
    }

    // 类型相似度
    if (content1.type === content2.type) {
      similarity += 0.1;
    }

    return similarity;
  }

  /**
   * 匹配严重程度
   */
  private matchSeverityLevel(content: ContentItem, severityLevel: string): number {
    const contentUrgency = content.urgency;
    
    const severityMap: Record<string, string[]> = {
      'mild': ['low', 'medium'],
      'moderate': ['medium', 'high'],
      'severe': ['high', 'critical']
    };

    const matchingUrgencies = severityMap[severityLevel] || [];
    return matchingUrgencies.includes(contentUrgency) ? 1.0 : 0.0;
  }

  /**
   * 匹配治疗偏好
   */
  private matchTreatmentPreference(content: ContentItem, preferenceType: string): boolean {
    const categoryMap: Record<string, string[]> = {
      'medical': ['medical_treatment', 'medication'],
      'natural': ['natural_therapy', 'lifestyle'],
      'lifestyle': ['lifestyle', 'prevention', 'education']
    };

    const relevantCategories = categoryMap[preferenceType] || [];
    return relevantCategories.includes(content.category);
  }

  /**
   * 查找相似用户
   */
  private findSimilarUsers(userId: string, limit: number): Array<{ userId: string; similarity: number }> {
    const userInteractions = this.userInteractions.get(userId) || new Map();
    const similarities: Array<{ userId: string; similarity: number }> = [];

    for (const [otherUserId, otherInteractions] of this.userInteractions) {
      if (otherUserId === userId) continue;

      const similarity = this.calculateUserSimilarity(userInteractions, otherInteractions);
      if (similarity > 0.2) {
        similarities.push({ userId: otherUserId, similarity });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * 计算用户相似度
   */
  private calculateUserSimilarity(
    interactions1: Map<string, number>,
    interactions2: Map<string, number>
  ): number {
    const items1 = new Set(interactions1.keys());
    const items2 = new Set(interactions2.keys());
    const intersection = new Set([...items1].filter(x => items2.has(x)));
    
    if (intersection.size === 0) return 0;

    // 计算余弦相似度
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const item of intersection) {
      const score1 = interactions1.get(item) || 0;
      const score2 = interactions2.get(item) || 0;
      dotProduct += score1 * score2;
    }

    for (const score of interactions1.values()) {
      norm1 += score * score;
    }
    for (const score of interactions2.values()) {
      norm2 += score * score;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * 计算新颖性奖励
   */
  private calculateNoveltyBonus(rec: RecommendationItem, userProfile: UserProfile): number {
    const userInteractions = this.userInteractions.get(userProfile.userId) || new Map();
    
    // 如果用户从未与此内容交互，给予新颖性奖励
    if (!userInteractions.has(rec.contentId)) {
      return 0.1;
    }
    
    return 0;
  }

  /**
   * 分类用户类型
   */
  private classifyUserType(userProfile: UserProfile): string {
    const health = userProfile.healthProfile;
    
    if (health.urgencyProfile.emergencyQueries > 0) {
      return '急性疼痛用户';
    } else if (health.knowledgeLevel === 'advanced') {
      return '专业知识用户';
    } else if (health.treatmentPreferences.some(t => t.type === 'natural')) {
      return '自然疗法偏好用户';
    } else {
      return '一般健康关注用户';
    }
  }

  /**
   * 获取顶级分类
   */
  private getTopCategories(recommendations: RecommendationItem[], limit: number): string[] {
    const categoryCount = new Map<string, number>();
    
    for (const rec of recommendations) {
      categoryCount.set(rec.category, (categoryCount.get(rec.category) || 0) + 1);
    }
    
    return Array.from(categoryCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([category]) => category);
  }

  /**
   * 获取顶级推荐理由
   */
  private getTopReasons(recommendations: RecommendationItem[], limit: number): string[] {
    const reasonCount = new Map<string, number>();
    
    for (const rec of recommendations) {
      const reasons = rec.reason.split(', ');
      for (const reason of reasons) {
        reasonCount.set(reason, (reasonCount.get(reason) || 0) + 1);
      }
    }
    
    return Array.from(reasonCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([reason]) => reason);
  }
} 