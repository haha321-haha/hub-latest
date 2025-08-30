/**
 * 模式匹配器
 * 基于正则表达式和模式规则识别查询意图
 */

export interface PatternMatchResult {
  informational: number;
  navigational: number;
  transactional: number;
  comparison: number;
  troubleshooting: number;
  emergency: number;
  general: number;
}

export class PatternMatcher {
  private patterns: Map<string, RegExp[]>;

  constructor() {
    this.patterns = new Map();
    this.initializePatterns();
  }

  /**
   * 匹配查询模式
   */
  matchPatterns(query: string): PatternMatchResult {
    const results: PatternMatchResult = {
      informational: 0,
      navigational: 0,
      transactional: 0,
      comparison: 0,
      troubleshooting: 0,
      emergency: 0,
      general: 0
    };

    // 对每种意图模式进行匹配
    for (const [intentType, patterns] of this.patterns) {
      let matchCount = 0;
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          matchCount++;
        }
      }
      
      // 计算匹配度（0-1之间）
      const matchScore = Math.min(matchCount / patterns.length, 1.0);
      
      // 设置结果
      if (intentType in results) {
        results[intentType as keyof PatternMatchResult] = matchScore;
      }
    }

    return results;
  }

  /**
   * 检查特定模式
   */
  checkPattern(query: string, patternType: string): boolean {
    const patterns = this.patterns.get(patternType);
    if (!patterns) return false;

    return patterns.some(pattern => pattern.test(query));
  }

  /**
   * 获取匹配的模式
   */
  getMatchedPatterns(query: string): Array<{
    type: string;
    pattern: string;
    confidence: number;
  }> {
    const matches: Array<{
      type: string;
      pattern: string;
      confidence: number;
    }> = [];

    for (const [intentType, patterns] of this.patterns) {
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          matches.push({
            type: intentType,
            pattern: pattern.source,
            confidence: 0.8
          });
        }
      }
    }

    return matches;
  }

  // ========== 私有方法 ==========

  /**
   * 初始化模式
   */
  private initializePatterns(): void {
    // 信息查询模式
    this.patterns.set('informational', [
      /什么是|什么叫|何为|定义|概念/i,
      /what\s+is|what\s+are|define|definition/i,
      /如何理解|怎么理解|含义|意思/i,
      /介绍|说明|解释|详情/i,
      /原因|为什么|why|reason|cause/i,
      /症状|表现|特征|signs|symptoms/i
    ]);

    // 导航查询模式
    this.patterns.set('navigational', [
      /如何|怎么|怎样|方法|方式/i,
      /how\s+to|how\s+can|ways\s+to|methods/i,
      /缓解|治疗|处理|应对|解决/i,
      /relief|treatment|manage|handle|solve/i,
      /步骤|流程|过程|procedure|process/i,
      /指南|指导|建议|guide|advice/i
    ]);

    // 交易查询模式
    this.patterns.set('transactional', [
      /下载|获取|获得|download|get|obtain/i,
      /购买|买|订购|buy|purchase|order/i,
      /预约|约见|appointment|book|schedule/i,
      /申请|注册|register|apply|sign\s+up/i,
      /PDF|文件|资料|document|file/i,
      /工具|清单|checklist|toolkit/i
    ]);

    // 比较查询模式
    this.patterns.set('comparison', [
      /vs|versus|对比|比较|区别/i,
      /compare|comparison|difference|different/i,
      /哪个更好|哪种更|which\s+is\s+better|which\s+one/i,
      /优缺点|利弊|pros\s+and\s+cons|advantages/i,
      /相比|比起|compared\s+to|versus/i,
      /选择|选哪个|choose|select|pick/i
    ]);

    // 故障排除模式
    this.patterns.set('troubleshooting', [
      /问题|故障|错误|problem|issue|error/i,
      /无效|不管用|没用|not\s+working|doesn't\s+work/i,
      /失败|不成功|failed|unsuccessful/i,
      /怎么办|如何处理|what\s+to\s+do|how\s+to\s+handle/i,
      /解决|修复|fix|solve|resolve/i,
      /仍然|依然|still|continue|persist/i
    ]);

    // 紧急查询模式
    this.patterns.set('emergency', [
      /急救|紧急|立即|urgent|emergency|immediate/i,
      /严重|剧烈|intense|severe|extreme/i,
      /无法|不能|can't|cannot|unable/i,
      /急性|突然|sudden|acute|sharp/i,
      /危险|危急|危害|danger|critical|risk/i,
      /马上|立刻|now|right\s+away|immediately/i
    ]);

    // 一般查询模式
    this.patterns.set('general', [
      /痛经|经痛|月经|生理期|period|menstrual/i,
      /疼痛|痛|疼|pain|ache|hurt/i,
      /健康|保健|health|wellness/i,
      /女性|妇女|women|female/i,
      /医学|医疗|medical|healthcare/i
    ]);
  }
} 