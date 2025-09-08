/**
 * 搜索意图识别分类器
 * 识别用户查询的意图类型和紧急程度
 */

import { PatternMatcher } from './PatternMatcher';
import { RuleEngine } from './RuleEngine';

export enum SearchIntent {
  INFORMATIONAL = 'informational',    // 信息查询：什么是痛经
  NAVIGATIONAL = 'navigational',      // 导航查询：痛经缓解方法
  TRANSACTIONAL = 'transactional',    // 交易查询：下载痛经指南
  COMPARISON = 'comparison',           // 比较查询：药物vs自然疗法
  TROUBLESHOOTING = 'troubleshooting', // 故障排除：如何处理严重痛经
  EMERGENCY = 'emergency',             // 紧急查询：急性痛经处理
  GENERAL = 'general'                  // 一般查询
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface IntentRecognitionResult {
  intent: SearchIntent;
  confidence: number;
  urgency: UrgencyLevel;
  keywords: string[];
  entities: Array<{
    type: string;
    value: string;
    start: number;
    end: number;
  }>;
  context: {
    medicalTerms: string[];
    symptoms: string[];
    treatments: string[];
    bodyParts: string[];
  };
}

export class IntentClassifier {
  private patternMatcher: PatternMatcher;
  private ruleEngine: RuleEngine;

  constructor() {
    this.patternMatcher = new PatternMatcher();
    this.ruleEngine = new RuleEngine();
  }

  /**
   * 识别查询意图 (别名方法)
   */
  async classifyQuery(query: string): Promise<IntentRecognitionResult> {
    return this.classifyIntent(query);
  }

  /**
   * 识别查询意图
   */
  async classifyIntent(query: string): Promise<IntentRecognitionResult> {
    const normalizedQuery = this.normalizeQuery(query);
    
    // 模式匹配识别
    const patternResults = this.patternMatcher.matchPatterns(normalizedQuery);
    
    // 规则引擎分析
    const ruleResults = this.ruleEngine.analyzeQuery(normalizedQuery);
    
    // 实体识别
    const entities = this.extractEntities(normalizedQuery);
    
    // 上下文分析
    const context = this.analyzeContext(normalizedQuery);
    
    // 紧急程度评估
    const urgency = this.assessUrgency(normalizedQuery, context);
    
    // 综合决策
    const intent = this.determineIntent(patternResults, ruleResults, urgency);
    
    // 计算置信度
    const confidence = this.calculateConfidence(patternResults, ruleResults, entities);
    
    return {
      intent,
      confidence,
      urgency,
      keywords: this.extractKeywords(normalizedQuery),
      entities,
      context
    };
  }

  /**
   * 批量意图识别
   */
  async classifyBatchIntents(queries: string[]): Promise<IntentRecognitionResult[]> {
    const results: IntentRecognitionResult[] = [];
    
    for (const query of queries) {
      const result = await this.classifyIntent(query);
      results.push(result);
    }
    
    return results;
  }

  /**
   * 获取意图建议
   */
  getIntentSuggestions(intent: SearchIntent): string[] {
    const suggestions: Record<SearchIntent, string[]> = {
      [SearchIntent.INFORMATIONAL]: [
        '什么是痛经',
        '痛经的原因',
        '痛经的症状',
        '痛经的类型'
      ],
      [SearchIntent.NAVIGATIONAL]: [
        '痛经缓解方法',
        '自然疗法',
        '药物治疗',
        '运动疗法'
      ],
      [SearchIntent.TRANSACTIONAL]: [
        '下载痛经指南',
        '获取缓解清单',
        '预约医生',
        '购买药物'
      ],
      [SearchIntent.COMPARISON]: [
        '药物vs自然疗法',
        '热敷vs冷敷',
        '不同药物对比',
        '治疗方案比较'
      ],
      [SearchIntent.TROUBLESHOOTING]: [
        '严重痛经处理',
        '药物无效怎么办',
        '持续疼痛处理',
        '副作用处理'
      ],
      [SearchIntent.EMERGENCY]: [
        '急性痛经处理',
        '紧急止痛',
        '就医指导',
        '急救措施'
      ],
      [SearchIntent.GENERAL]: [
        '痛经相关',
        '女性健康',
        '生理期护理',
        '健康管理'
      ]
    };
    
    return suggestions[intent] || [];
  }

  // ========== 私有方法 ==========

  /**
   * 标准化查询
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * 提取实体
   */
  private extractEntities(query: string): Array<{
    type: string;
    value: string;
    start: number;
    end: number;
  }> {
    const entities: Array<{
      type: string;
      value: string;
      start: number;
      end: number;
    }> = [];

    // 医疗术语实体
    const medicalTerms = [
      '痛经', '经痛', '月经疼痛', '布洛芬', '对乙酰氨基酚',
      'dysmenorrhea', 'ibuprofen', 'acetaminophen'
    ];

    // 症状实体
    const symptoms = [
      '疼痛', '痉挛', '恶心', '头痛', '腹痛', '背痛',
      'pain', 'cramps', 'nausea', 'headache'
    ];

    // 身体部位实体
    const bodyParts = [
      '腹部', '子宫', '卵巢', '腰部', '背部',
      'abdomen', 'uterus', 'ovaries', 'back'
    ];

    // 提取实体
    const allEntities = [
      ...medicalTerms.map(term => ({ type: 'medical', value: term })),
      ...symptoms.map(term => ({ type: 'symptom', value: term })),
      ...bodyParts.map(term => ({ type: 'body_part', value: term }))
    ];

    for (const entity of allEntities) {
      const regex = new RegExp(`\\b${this.escapeRegex(entity.value)}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(query)) !== null) {
        entities.push({
          type: entity.type,
          value: entity.value,
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }

    return entities;
  }

  /**
   * 分析上下文
   */
  private analyzeContext(query: string): {
    medicalTerms: string[];
    symptoms: string[];
    treatments: string[];
    bodyParts: string[];
  } {
    const context = {
      medicalTerms: [] as string[],
      symptoms: [] as string[],
      treatments: [] as string[],
      bodyParts: [] as string[]
    };

    // 医疗术语检测
    const medicalTermsPatterns = [
      '痛经', '经痛', '月经', '生理期', 'dysmenorrhea', 'period', 'menstrual'
    ];
    
    // 症状检测
    const symptomsPatterns = [
      '疼痛', '痛', '痉挛', '不适', '恶心', 'pain', 'cramps', 'discomfort'
    ];
    
    // 治疗方法检测
    const treatmentsPatterns = [
      '缓解', '治疗', '药物', '热敷', '按摩', 'relief', 'treatment', 'medication'
    ];
    
    // 身体部位检测
    const bodyPartsPatterns = [
      '腹部', '肚子', '子宫', '腰部', 'abdomen', 'belly', 'uterus', 'back'
    ];

    // 检测各类词汇
    for (const pattern of medicalTermsPatterns) {
      if (query.includes(pattern)) {
        context.medicalTerms.push(pattern);
      }
    }

    for (const pattern of symptomsPatterns) {
      if (query.includes(pattern)) {
        context.symptoms.push(pattern);
      }
    }

    for (const pattern of treatmentsPatterns) {
      if (query.includes(pattern)) {
        context.treatments.push(pattern);
      }
    }

    for (const pattern of bodyPartsPatterns) {
      if (query.includes(pattern)) {
        context.bodyParts.push(pattern);
      }
    }

    return context;
  }

  /**
   * 评估紧急程度
   */
  private assessUrgency(query: string, context: any): UrgencyLevel {
    // 高紧急程度关键词
    const criticalKeywords = ['急救', '紧急', '严重', '剧烈', '无法', '急性', 'emergency', 'urgent', 'severe', 'acute'];
    const highKeywords = ['很痛', '非常', '持续', '不停', '很严重', 'very', 'extremely', 'continuous'];
    const mediumKeywords = ['疼痛', '不适', '痛经', 'pain', 'discomfort', 'cramps'];

    // 检测关键词
    const hasCritical = criticalKeywords.some(keyword => query.includes(keyword));
    const hasHigh = highKeywords.some(keyword => query.includes(keyword));
    const hasMedium = mediumKeywords.some(keyword => query.includes(keyword));

    if (hasCritical) {
      return UrgencyLevel.CRITICAL;
    } else if (hasHigh) {
      return UrgencyLevel.HIGH;
    } else if (hasMedium) {
      return UrgencyLevel.MEDIUM;
    } else {
      return UrgencyLevel.LOW;
    }
  }

  /**
   * 确定意图
   */
  private determineIntent(
    patternResults: any, 
    ruleResults: any, 
    urgency: UrgencyLevel
  ): SearchIntent {
    // 紧急查询优先
    if (urgency === UrgencyLevel.CRITICAL) {
      return SearchIntent.EMERGENCY;
    }

    // 基于模式匹配结果
    if (patternResults.informational > 0.7) {
      return SearchIntent.INFORMATIONAL;
    }
    if (patternResults.comparison > 0.7) {
      return SearchIntent.COMPARISON;
    }
    if (patternResults.transactional > 0.7) {
      return SearchIntent.TRANSACTIONAL;
    }
    if (patternResults.troubleshooting > 0.6) {
      return SearchIntent.TROUBLESHOOTING;
    }
    if (patternResults.navigational > 0.6) {
      return SearchIntent.NAVIGATIONAL;
    }

    return SearchIntent.GENERAL;
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    patternResults: any, 
    ruleResults: any, 
    entities: any[]
  ): number {
    const patternValues = Object.values(patternResults) as number[];
    const patternConfidence = patternValues.length > 0 ? Math.max(...patternValues) : 0;
    const ruleConfidence = ruleResults.confidence || 0.5;
    const entityConfidence = entities.length > 0 ? 0.8 : 0.3;

    return (patternConfidence * 0.5 + ruleConfidence * 0.3 + entityConfidence * 0.2);
  }

  /**
   * 提取关键词
   */
  private extractKeywords(query: string): string[] {
    const stopWords = new Set([
      '的', '了', '是', '在', '有', '和', '与', '或', '但', '而', '如何', '什么', '怎么',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'how', 'what'
    ]);

    return query
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word));
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
} 