/**
 * 实时学习系统
 * 基于用户反馈和行为数据动态优化推荐算法
 */

import { UserProfile } from './UserProfileBuilder';
import { RecommendationItem, RecommendationResult } from './RecommendationEngine';
import { BehaviorTracker, EventType } from './BehaviorTracker';

export interface FeedbackEvent {
  userId: string;
  contentId: string;
  recommendationId: string;
  feedbackType: 'positive' | 'negative' | 'neutral';
  feedbackValue: number; // -1 to 1
  timestamp: number;
  context: FeedbackContext;
}

export interface FeedbackContext {
  recommendation_position: number;
  recommendation_score: number;
  user_session: string;
  page_context: string;
  interaction_type: 'explicit' | 'implicit';
}

export interface LearningMetrics {
  precision: number; // 精确度
  recall: number; // 召回率
  clickThroughRate: number; // 点击率
  conversionRate: number; // 转化率
  userSatisfaction: number; // 用户满意度
  diversityScore: number; // 多样性得分
  noveltyScore: number; // 新颖性得分
}

export interface ModelPerformance {
  modelId: string;
  metrics: LearningMetrics;
  sampleSize: number;
  lastUpdated: number;
  confidence: number;
}

export interface ABTestResult {
  testId: string;
  variantA: ModelPerformance;
  variantB: ModelPerformance;
  winnerModel: string;
  statisticalSignificance: number;
  testDuration: number;
}

export class LearningSystem {
  private feedbackHistory: Map<string, FeedbackEvent[]>; // userId -> feedback events
  private modelWeights: Map<string, number>; // feature -> weight
  private learningRate: number;
  private abTests: Map<string, ABTestResult>;
  private behaviorTracker: BehaviorTracker;
  private performanceHistory: ModelPerformance[];

  constructor(behaviorTracker: BehaviorTracker, learningRate: number = 0.01) {
    this.feedbackHistory = new Map();
    this.modelWeights = new Map();
    this.learningRate = learningRate;
    this.abTests = new Map();
    this.behaviorTracker = behaviorTracker;
    this.performanceHistory = [];
    this.initializeWeights();
  }

  /**
   * 记录用户反馈
   */
  recordFeedback(feedback: FeedbackEvent): void {
    const userFeedback = this.feedbackHistory.get(feedback.userId) || [];
    userFeedback.push(feedback);
    
    // 限制反馈历史长度
    if (userFeedback.length > 1000) {
      userFeedback.shift();
    }
    
    this.feedbackHistory.set(feedback.userId, userFeedback);
    
    // 触发实时学习
    this.updateModelWeights(feedback);
  }

  /**
   * 记录隐式反馈
   */
  recordImplicitFeedback(
    userId: string,
    contentId: string,
    recommendationId: string,
    interactionType: 'click' | 'view' | 'download' | 'skip',
    duration?: number,
    position?: number
  ): void {
    let feedbackValue = 0;
    let feedbackType: 'positive' | 'negative' | 'neutral' = 'neutral';

    // 根据交互类型推断反馈
    switch (interactionType) {
      case 'click':
        feedbackValue = 0.6;
        feedbackType = 'positive';
        break;
      case 'view':
        if (duration && duration > 60) { // 浏览超过1分钟
          feedbackValue = 0.8;
          feedbackType = 'positive';
        } else {
          feedbackValue = 0.2;
          feedbackType = 'neutral';
        }
        break;
      case 'download':
        feedbackValue = 1.0;
        feedbackType = 'positive';
        break;
      case 'skip':
        feedbackValue = -0.3;
        feedbackType = 'negative';
        break;
    }

    // 位置偏差调整
    if (position && position > 5) {
      feedbackValue *= 1.2; // 后面位置的点击更有价值
    }

    const feedback: FeedbackEvent = {
      userId,
      contentId,
      recommendationId,
      feedbackType,
      feedbackValue,
      timestamp: Date.now(),
      context: {
        recommendation_position: position || 0,
        recommendation_score: 0.5, // 默认值
        user_session: '',
        page_context: 'recommendation',
        interaction_type: 'implicit'
      }
    };

    this.recordFeedback(feedback);
  }

  /**
   * 在线学习更新模型
   */
  updateModelWeights(feedback: FeedbackEvent): void {
    // 提取特征
    const features = this.extractFeatures(feedback);
    
    // 计算预测误差
    const predicted = this.predictScore(features);
    const actual = feedback.feedbackValue;
    const error = actual - predicted;

    // 梯度下降更新权重
    for (const [feature, value] of features) {
      const currentWeight = this.modelWeights.get(feature) || 0;
      const newWeight = currentWeight + this.learningRate * error * value;
      this.modelWeights.set(feature, newWeight);
    }

    // 应用正则化
    this.applyRegularization();
  }

  /**
   * 评估推荐性能
   */
  evaluateRecommendations(
    userId: string,
    recommendations: RecommendationItem[],
    actualInteractions: Map<string, number> // contentId -> interaction score
  ): LearningMetrics {
    const feedback = this.feedbackHistory.get(userId) || [];
    
    // 计算精确度和召回率
    const relevantItems = new Set(
      Array.from(actualInteractions.entries())
        .filter(([, score]) => score > 0.5)
        .map(([contentId]) => contentId)
    );
    
    const recommendedItems = new Set(recommendations.map(r => r.contentId));
    const relevantRecommended = new Set(
      [...recommendedItems].filter(id => relevantItems.has(id))
    );

    const precision = recommendedItems.size > 0 
      ? relevantRecommended.size / recommendedItems.size 
      : 0;
    
    const recall = relevantItems.size > 0 
      ? relevantRecommended.size / relevantItems.size 
      : 0;

    // 计算点击率
    const clickEvents = feedback.filter(f => 
      f.feedbackType === 'positive' && 
      recommendedItems.has(f.contentId)
    );
    const clickThroughRate = recommendations.length > 0 
      ? clickEvents.length / recommendations.length 
      : 0;

    // 计算转化率（下载/分享等高价值行为）
    const conversionEvents = feedback.filter(f => 
      f.feedbackValue > 0.8 && 
      recommendedItems.has(f.contentId)
    );
    const conversionRate = recommendations.length > 0 
      ? conversionEvents.length / recommendations.length 
      : 0;

    // 计算用户满意度
    const satisfactionScores = feedback
      .filter(f => recommendedItems.has(f.contentId))
      .map(f => f.feedbackValue);
    const userSatisfaction = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
      : 0;

    // 计算多样性
    const categories = new Set(recommendations.map(r => r.category));
    const diversityScore = categories.size / Math.max(recommendations.length, 1);

    // 计算新颖性（推荐了多少用户之前未接触的内容）
    const userInteractedContent = new Set(feedback.map(f => f.contentId));
    const novelItems = recommendations.filter(r => !userInteractedContent.has(r.contentId));
    const noveltyScore = recommendations.length > 0 
      ? novelItems.length / recommendations.length 
      : 0;

    return {
      precision,
      recall,
      clickThroughRate,
      conversionRate,
      userSatisfaction,
      diversityScore,
      noveltyScore
    };
  }

  /**
   * 运行A/B测试
   */
  runABTest(
    testId: string,
    userIds: string[],
    modelA: string,
    modelB: string,
    testDuration: number = 7 * 24 * 60 * 60 * 1000 // 7天
  ): void {
    const testStartTime = Date.now();
    
    // 随机分配用户到不同组
    const groupA = userIds.filter((_, index) => index % 2 === 0);
    const groupB = userIds.filter((_, index) => index % 2 === 1);

    // 记录测试配置
    const testResult: ABTestResult = {
      testId,
      variantA: {
        modelId: modelA,
        metrics: this.createEmptyMetrics(),
        sampleSize: groupA.length,
        lastUpdated: testStartTime,
        confidence: 0
      },
      variantB: {
        modelId: modelB,
        metrics: this.createEmptyMetrics(),
        sampleSize: groupB.length,
        lastUpdated: testStartTime,
        confidence: 0
      },
      winnerModel: '',
      statisticalSignificance: 0,
      testDuration
    };

    this.abTests.set(testId, testResult);

    // 定期评估测试结果
    const evaluationInterval = setInterval(() => {
      this.evaluateABTest(testId);
      
      // 检查是否测试完成
      if (Date.now() - testStartTime >= testDuration) {
        clearInterval(evaluationInterval);
        this.concludeABTest(testId);
      }
    }, 24 * 60 * 60 * 1000); // 每24小时评估一次
  }

  /**
   * 获取个性化学习洞察
   */
  getPersonalizedInsights(userId: string): {
    learningProgress: number;
    preferenceStability: number;
    engagementTrend: 'increasing' | 'decreasing' | 'stable';
    recommendationAccuracy: number;
    feedbackSummary: {
      totalFeedback: number;
      positiveRate: number;
      preferredCategories: string[];
      improvementAreas: string[];
    };
  } {
    const feedback = this.feedbackHistory.get(userId) || [];
    
    // 学习进度（基于反馈数量和质量）
    const learningProgress = Math.min(feedback.length / 50, 1.0);
    
    // 偏好稳定性（近期偏好与历史偏好的一致性）
    const preferenceStability = this.calculatePreferenceStability(feedback);
    
    // 参与度趋势
    const engagementTrend = this.analyzeEngagementTrend(feedback);
    
    // 推荐准确率
    const recentFeedback = feedback.slice(-20);
    const positiveCount = recentFeedback.filter(f => f.feedbackValue > 0).length;
    const recommendationAccuracy = recentFeedback.length > 0 
      ? positiveCount / recentFeedback.length 
      : 0;

    // 反馈摘要
    const totalFeedback = feedback.length;
    const positiveRate = feedback.filter(f => f.feedbackValue > 0).length / Math.max(totalFeedback, 1);
    
    // 分析偏好分类
    const categoryFeedback = new Map<string, number[]>();
    for (const f of feedback) {
      // 这里需要根据contentId查找分类，简化处理
      const category = 'general'; // 实际应该查找内容分类
      const scores = categoryFeedback.get(category) || [];
      scores.push(f.feedbackValue);
      categoryFeedback.set(category, scores);
    }

    const preferredCategories = Array.from(categoryFeedback.entries())
      .map(([category, scores]) => ({
        category,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .filter(item => item.avgScore > 0.3)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
      .map(item => item.category);

    // 改进建议
    const improvementAreas: string[] = [];
    if (positiveRate < 0.6) {
      improvementAreas.push('提升推荐相关性');
    }
    if (preferenceStability < 0.5) {
      improvementAreas.push('稳定偏好识别');
    }
    if (engagementTrend === 'decreasing') {
      improvementAreas.push('增加内容多样性');
    }

    return {
      learningProgress,
      preferenceStability,
      engagementTrend,
      recommendationAccuracy,
      feedbackSummary: {
        totalFeedback,
        positiveRate,
        preferredCategories,
        improvementAreas
      }
    };
  }

  /**
   * 获取模型性能历史
   */
  getPerformanceHistory(): ModelPerformance[] {
    return [...this.performanceHistory].sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  /**
   * 获取当前模型权重
   */
  getModelWeights(): Map<string, number> {
    return new Map(this.modelWeights);
  }

  // ========== 私有方法 ==========

  /**
   * 初始化模型权重
   */
  private initializeWeights(): void {
    // 初始化特征权重
    const initialWeights = {
      'content_similarity': 0.3,
      'user_preference': 0.25,
      'popularity': 0.15,
      'recency': 0.1,
      'diversity': 0.1,
      'novelty': 0.1
    };

    for (const [feature, weight] of Object.entries(initialWeights)) {
      this.modelWeights.set(feature, weight);
    }
  }

  /**
   * 提取特征
   */
  private extractFeatures(feedback: FeedbackEvent): Map<string, number> {
    const features = new Map<string, number>();
    
    // 位置特征
    features.set('position', 1.0 / (feedback.context.recommendation_position + 1));
    
    // 推荐分数特征
    features.set('recommendation_score', feedback.context.recommendation_score);
    
    // 交互类型特征
    features.set('explicit_feedback', feedback.context.interaction_type === 'explicit' ? 1.0 : 0.0);
    
    // 时间特征
    const hourOfDay = new Date(feedback.timestamp).getHours();
    features.set('hour_of_day', hourOfDay / 24.0);
    
    return features;
  }

  /**
   * 预测分数
   */
  private predictScore(features: Map<string, number>): number {
    let score = 0;
    
    for (const [feature, value] of features) {
      const weight = this.modelWeights.get(feature) || 0;
      score += weight * value;
    }
    
    return Math.max(0, Math.min(1, score)); // 归一化到[0,1]
  }

  /**
   * 应用正则化
   */
  private applyRegularization(): void {
    const lambda = 0.001; // L2正则化参数
    
    for (const [feature, weight] of this.modelWeights) {
      const regularizedWeight = weight * (1 - lambda);
      this.modelWeights.set(feature, regularizedWeight);
    }
  }

  /**
   * 创建空的指标对象
   */
  private createEmptyMetrics(): LearningMetrics {
    return {
      precision: 0,
      recall: 0,
      clickThroughRate: 0,
      conversionRate: 0,
      userSatisfaction: 0,
      diversityScore: 0,
      noveltyScore: 0
    };
  }

  /**
   * 评估A/B测试
   */
  private evaluateABTest(testId: string): void {
    const test = this.abTests.get(testId);
    if (!test) return;

    // 收集两组的性能数据
    // 这里应该根据实际的用户分组和反馈数据计算指标
    // 简化处理，实际实现需要更复杂的统计分析
    
    // 计算统计显著性
    const significanceLevel = this.calculateStatisticalSignificance(
      test.variantA.metrics,
      test.variantB.metrics,
      test.variantA.sampleSize,
      test.variantB.sampleSize
    );

    test.statisticalSignificance = significanceLevel;
    
    // 如果达到统计显著性，确定获胜者
    if (significanceLevel > 0.95) {
      const aScore = this.calculateOverallScore(test.variantA.metrics);
      const bScore = this.calculateOverallScore(test.variantB.metrics);
      test.winnerModel = aScore > bScore ? test.variantA.modelId : test.variantB.modelId;
    }

    this.abTests.set(testId, test);
  }

  /**
   * 结束A/B测试
   */
  private concludeABTest(testId: string): void {
    const test = this.abTests.get(testId);
    if (!test) return;

    console.log(`A/B测试 ${testId} 完成`);
    console.log(`获胜模型: ${test.winnerModel}`);
    console.log(`统计显著性: ${test.statisticalSignificance}`);

    // 如果有明确的获胜者，可以切换到该模型
    if (test.winnerModel && test.statisticalSignificance > 0.95) {
      console.log(`切换到获胜模型: ${test.winnerModel}`);
    }
  }

  /**
   * 计算偏好稳定性
   */
  private calculatePreferenceStability(feedback: FeedbackEvent[]): number {
    if (feedback.length < 10) return 0.5; // 数据不足时返回中等稳定性

    // 将反馈分为前后两半
    const midPoint = Math.floor(feedback.length / 2);
    const earlyFeedback = feedback.slice(0, midPoint);
    const lateFeedback = feedback.slice(midPoint);

    // 计算两个时期的偏好模式相似性
    const earlyPattern = this.extractPreferencePattern(earlyFeedback);
    const latePattern = this.extractPreferencePattern(lateFeedback);

    return this.calculatePatternSimilarity(earlyPattern, latePattern);
  }

  /**
   * 提取偏好模式
   */
  private extractPreferencePattern(feedback: FeedbackEvent[]): Map<string, number> {
    const pattern = new Map<string, number>();
    
    for (const f of feedback) {
      // 这里简化处理，实际应该根据内容特征提取模式
      const key = `score_${Math.floor(f.feedbackValue * 10)}`;
      pattern.set(key, (pattern.get(key) || 0) + 1);
    }
    
    return pattern;
  }

  /**
   * 计算模式相似性
   */
  private calculatePatternSimilarity(pattern1: Map<string, number>, pattern2: Map<string, number>): number {
    const allKeys = new Set([...pattern1.keys(), ...pattern2.keys()]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (const key of allKeys) {
      const val1 = pattern1.get(key) || 0;
      const val2 = pattern2.get(key) || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    }
    
    return norm1 > 0 && norm2 > 0 ? dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2)) : 0;
  }

  /**
   * 分析参与度趋势
   */
  private analyzeEngagementTrend(feedback: FeedbackEvent[]): 'increasing' | 'decreasing' | 'stable' {
    if (feedback.length < 20) return 'stable';

    // 将反馈分为三个时期
    const period = Math.floor(feedback.length / 3);
    const early = feedback.slice(0, period);
    const middle = feedback.slice(period, period * 2);
    const late = feedback.slice(period * 2);

    const earlyAvg = early.reduce((sum, f) => sum + f.feedbackValue, 0) / early.length;
    const middleAvg = middle.reduce((sum, f) => sum + f.feedbackValue, 0) / middle.length;
    const lateAvg = late.reduce((sum, f) => sum + f.feedbackValue, 0) / late.length;

    const trend1 = middleAvg - earlyAvg;
    const trend2 = lateAvg - middleAvg;
    const overallTrend = (trend1 + trend2) / 2;

    if (overallTrend > 0.1) return 'increasing';
    if (overallTrend < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * 计算统计显著性
   */
  private calculateStatisticalSignificance(
    metricsA: LearningMetrics,
    metricsB: LearningMetrics,
    sampleSizeA: number,
    sampleSizeB: number
  ): number {
    // 简化的Z检验实现
    const scoreA = this.calculateOverallScore(metricsA);
    const scoreB = this.calculateOverallScore(metricsB);
    
    // 假设方差相等，计算标准误差
    const pooledVariance = 0.25; // 假设值
    const standardError = Math.sqrt(pooledVariance * (1/sampleSizeA + 1/sampleSizeB));
    
    if (standardError === 0) return 0.5;
    
    const zScore = Math.abs(scoreA - scoreB) / standardError;
    
    // 转换为p值（简化处理）
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    
    return 1 - pValue; // 返回置信水平
  }

  /**
   * 计算综合得分
   */
  private calculateOverallScore(metrics: LearningMetrics): number {
    return (
      metrics.precision * 0.25 +
      metrics.recall * 0.25 +
      metrics.clickThroughRate * 0.2 +
      metrics.conversionRate * 0.15 +
      metrics.userSatisfaction * 0.15
    );
  }

  /**
   * 正态分布累积分布函数（简化实现）
   */
  private normalCDF(x: number): number {
    // 简化的正态分布CDF近似
    return 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI)));
  }
} 