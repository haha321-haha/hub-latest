/**
 * 规则引擎
 * 基于专家规则分析查询意图
 */

export interface RuleAnalysisResult {
  confidence: number;
  matchedRules: string[];
  recommendations: string[];
  context: {
    hasQuestionWords: boolean;
    hasActionWords: boolean;
    hasEmergencyWords: boolean;
    hasComparisonWords: boolean;
    hasMedicalTerms: boolean;
  };
}

export class RuleEngine {
  private rules: Map<string, (query: string) => number>;
  private emergencyRules: Array<(query: string) => boolean>;

  constructor() {
    this.rules = new Map();
    this.emergencyRules = [];
    this.initializeRules();
  }

  /**
   * 分析查询
   */
  analyzeQuery(query: string): RuleAnalysisResult {
    const matchedRules: string[] = [];
    let totalConfidence = 0;
    let ruleCount = 0;

    // 执行所有规则
    for (const [ruleName, ruleFunction] of this.rules) {
      const confidence = ruleFunction(query);
      if (confidence > 0) {
        matchedRules.push(ruleName);
        totalConfidence += confidence;
        ruleCount++;
      }
    }

    // 计算平均置信度
    const averageConfidence = ruleCount > 0 ? totalConfidence / ruleCount : 0;

    // 分析上下文
    const context = this.analyzeContext(query);

    // 生成建议
    const recommendations = this.generateRecommendations(context);

    return {
      confidence: averageConfidence,
      matchedRules,
      recommendations,
      context
    };
  }

  /**
   * 检查紧急情况
   */
  checkEmergency(query: string): boolean {
    return this.emergencyRules.some(rule => rule(query));
  }

  /**
   * 获取规则说明
   */
  getRuleDescriptions(): Record<string, string> {
    return {
      'question_word_rule': '检测疑问词（什么、如何、为什么等）',
      'action_word_rule': '检测动作词（下载、购买、预约等）',
      'comparison_rule': '检测比较词（vs、对比、区别等）',
      'emergency_rule': '检测紧急词（急救、紧急、严重等）',
      'medical_term_rule': '检测医疗术语（痛经、药物等）',
      'symptom_rule': '检测症状词（疼痛、痉挛等）',
      'treatment_rule': '检测治疗词（缓解、治疗等）'
    };
  }

  // ========== 私有方法 ==========

  /**
   * 初始化规则
   */
  private initializeRules(): void {
    // 疑问词规则
    this.rules.set('question_word_rule', (query: string) => {
      const questionWords = [
        '什么', '如何', '怎么', '为什么', '哪个', '哪种',
        'what', 'how', 'why', 'which', 'where', 'when'
      ];
      return questionWords.some(word => query.includes(word)) ? 0.8 : 0;
    });

    // 动作词规则
    this.rules.set('action_word_rule', (query: string) => {
      const actionWords = [
        '下载', '获取', '购买', '预约', '申请', '注册',
        'download', 'get', 'buy', 'book', 'apply', 'register'
      ];
      return actionWords.some(word => query.includes(word)) ? 0.9 : 0;
    });

    // 比较规则
    this.rules.set('comparison_rule', (query: string) => {
      const comparisonWords = [
        'vs', 'versus', '对比', '比较', '区别', '哪个更好',
        'compare', 'difference', 'better', 'which one'
      ];
      return comparisonWords.some(word => query.includes(word)) ? 0.9 : 0;
    });

    // 紧急规则
    this.rules.set('emergency_rule', (query: string) => {
      const emergencyWords = [
        '急救', '紧急', '严重', '剧烈', '急性', '危险',
        'emergency', 'urgent', 'severe', 'acute', 'critical'
      ];
      return emergencyWords.some(word => query.includes(word)) ? 1.0 : 0;
    });

    // 医疗术语规则
    this.rules.set('medical_term_rule', (query: string) => {
      const medicalTerms = [
        '痛经', '经痛', '月经', '生理期', '子宫', '卵巢',
        'dysmenorrhea', 'menstrual', 'period', 'uterus', 'ovaries'
      ];
      return medicalTerms.some(term => query.includes(term)) ? 0.8 : 0;
    });

    // 症状规则
    this.rules.set('symptom_rule', (query: string) => {
      const symptoms = [
        '疼痛', '痛', '痉挛', '不适', '恶心', '头痛',
        'pain', 'cramps', 'ache', 'nausea', 'headache'
      ];
      return symptoms.some(symptom => query.includes(symptom)) ? 0.7 : 0;
    });

    // 治疗规则
    this.rules.set('treatment_rule', (query: string) => {
      const treatments = [
        '缓解', '治疗', '药物', '热敷', '按摩', '运动',
        'relief', 'treatment', 'medication', 'heat', 'massage', 'exercise'
      ];
      return treatments.some(treatment => query.includes(treatment)) ? 0.8 : 0;
    });

    // 初始化紧急规则
    this.emergencyRules = [
      (query: string) => /急救|紧急|emergency|urgent/i.test(query),
      (query: string) => /严重|剧烈|severe|intense|extreme/i.test(query),
      (query: string) => /无法|不能|can't|cannot|unable/i.test(query),
      (query: string) => /急性|突然|sudden|acute/i.test(query),
      (query: string) => /危险|危急|danger|critical/i.test(query)
    ];
  }

  /**
   * 分析上下文
   */
  private analyzeContext(query: string): {
    hasQuestionWords: boolean;
    hasActionWords: boolean;
    hasEmergencyWords: boolean;
    hasComparisonWords: boolean;
    hasMedicalTerms: boolean;
  } {
    return {
      hasQuestionWords: this.rules.get('question_word_rule')!(query) > 0,
      hasActionWords: this.rules.get('action_word_rule')!(query) > 0,
      hasEmergencyWords: this.rules.get('emergency_rule')!(query) > 0,
      hasComparisonWords: this.rules.get('comparison_rule')!(query) > 0,
      hasMedicalTerms: this.rules.get('medical_term_rule')!(query) > 0
    };
  }

  /**
   * 生成建议
   */
  private generateRecommendations(context: {
    hasQuestionWords: boolean;
    hasActionWords: boolean;
    hasEmergencyWords: boolean;
    hasComparisonWords: boolean;
    hasMedicalTerms: boolean;
  }): string[] {
    const recommendations: string[] = [];

    if (context.hasEmergencyWords) {
      recommendations.push('考虑提供紧急处理指导');
      recommendations.push('优先显示急救相关内容');
    }

    if (context.hasQuestionWords) {
      recommendations.push('提供详细的解释和说明');
      recommendations.push('包含常见问题解答');
    }

    if (context.hasActionWords) {
      recommendations.push('提供操作指导和下载链接');
      recommendations.push('包含具体的行动步骤');
    }

    if (context.hasComparisonWords) {
      recommendations.push('提供比较表格和对比信息');
      recommendations.push('突出显示优缺点');
    }

    if (context.hasMedicalTerms) {
      recommendations.push('提供专业医疗建议');
      recommendations.push('包含医学术语解释');
    }

    return recommendations;
  }
} 