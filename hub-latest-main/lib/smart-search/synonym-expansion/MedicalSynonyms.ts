/**
 * 医疗同义词库
 * 管理医疗健康领域的同义词和相关词汇
 */

export interface SynonymGroup {
  mainTerm: string;
  synonyms: string[];
  relatedTerms: string[];
  category: string;
  language: 'zh' | 'en' | 'mixed';
  confidence: number;
}

export class MedicalSynonyms {
  private synonymGroups: Map<string, SynonymGroup>;
  private termToGroup: Map<string, string>; // 词条到主词的映射
  private categories: Set<string>;

  constructor() {
    this.synonymGroups = new Map();
    this.termToGroup = new Map();
    this.categories = new Set();
    this.initializeSynonyms();
  }

  /**
   * 获取词条的同义词
   */
  getSynonyms(term: string, limit: number = 5): string[] {
    const normalizedTerm = this.normalizeTerm(term);
    const mainTerm = this.termToGroup.get(normalizedTerm);
    
    if (!mainTerm) return [];
    
    const group = this.synonymGroups.get(mainTerm);
    if (!group) return [];
    
    return group.synonyms
      .filter(synonym => synonym !== normalizedTerm) // 排除原词
      .slice(0, limit);
  }

  /**
   * 获取相关词条
   */
  getRelatedTerms(
    term: string, 
    context: string[] = [], 
    limit: number = 5
  ): Array<{
    term: string;
    relation: string;
    confidence: number;
  }> {
    const normalizedTerm = this.normalizeTerm(term);
    const mainTerm = this.termToGroup.get(normalizedTerm);
    
    if (!mainTerm) return [];
    
    const group = this.synonymGroups.get(mainTerm);
    if (!group) return [];
    
    const relatedTerms: Array<{
      term: string;
      relation: string;
      confidence: number;
    }> = [];

    // 添加直接相关词
    for (const relatedTerm of group.relatedTerms) {
      relatedTerms.push({
        term: relatedTerm,
        relation: 'related',
        confidence: 0.8
      });
    }

    // 基于上下文查找相关词
    if (context.length > 0) {
      const contextualTerms = this.findContextualTerms(normalizedTerm, context);
      for (const contextTerm of contextualTerms) {
        relatedTerms.push({
          term: contextTerm,
          relation: 'contextual',
          confidence: 0.6
        });
      }
    }

    // 基于分类查找相关词
    const categoryTerms = this.getTermsByCategory(group.category);
    for (const categoryTerm of categoryTerms) {
      if (categoryTerm !== normalizedTerm && !group.synonyms.includes(categoryTerm)) {
        relatedTerms.push({
          term: categoryTerm,
          relation: 'category',
          confidence: 0.5
        });
      }
    }

    return relatedTerms
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * 检查是否为医疗术语
   */
  isMedicalTerm(term: string): boolean {
    const normalizedTerm = this.normalizeTerm(term);
    return this.termToGroup.has(normalizedTerm);
  }

  /**
   * 获取词条分类
   */
  getTermCategory(term: string): string | null {
    const normalizedTerm = this.normalizeTerm(term);
    const mainTerm = this.termToGroup.get(normalizedTerm);
    
    if (!mainTerm) return null;
    
    const group = this.synonymGroups.get(mainTerm);
    return group ? group.category : null;
  }

  /**
   * 获取指定分类的词条
   */
  getTermsByCategory(category: string): string[] {
    const terms: string[] = [];
    
    for (const [mainTerm, group] of this.synonymGroups) {
      if (group.category === category) {
        terms.push(mainTerm);
        terms.push(...group.synonyms);
      }
    }
    
    return Array.from(new Set(terms));
  }

  /**
   * 获取所有分类
   */
  getAllCategories(): string[] {
    return Array.from(this.categories);
  }

  // ========== 私有方法 ==========

  /**
   * 标准化词条
   */
  private normalizeTerm(term: string): string {
    return term.toLowerCase().trim();
  }

  /**
   * 查找上下文相关词
   */
  private findContextualTerms(term: string, context: string[]): string[] {
    const contextualTerms: string[] = [];
    
    // 简单的上下文匹配实现
    for (const contextTerm of context) {
      const normalizedContext = this.normalizeTerm(contextTerm);
      const relatedTerms = this.getSynonyms(normalizedContext, 2);
      contextualTerms.push(...relatedTerms);
    }
    
    return Array.from(new Set(contextualTerms));
  }

  /**
   * 添加同义词组
   */
  private addSynonymGroup(group: SynonymGroup): void {
    const mainTerm = this.normalizeTerm(group.mainTerm);
    this.synonymGroups.set(mainTerm, { ...group, mainTerm });
    this.categories.add(group.category);
    
    // 建立词条到主词的映射
    this.termToGroup.set(mainTerm, mainTerm);
    
    for (const synonym of group.synonyms) {
      const normalizedSynonym = this.normalizeTerm(synonym);
      this.termToGroup.set(normalizedSynonym, mainTerm);
    }
  }

  /**
   * 初始化同义词库
   */
  private initializeSynonyms(): void {
    const synonymGroups: SynonymGroup[] = [
      // 痛经相关
      {
        mainTerm: '痛经',
        synonyms: ['经痛', '月经疼痛', '生理痛', 'dysmenorrhea', 'menstrual pain', 'period pain'],
        relatedTerms: ['子宫收缩', '盆腔疼痛', '下腹痛'],
        category: '症状',
        language: 'mixed',
        confidence: 1.0
      },

      // 疼痛相关
      {
        mainTerm: '疼痛',
        synonyms: ['痛', '疼', 'pain', 'ache', 'discomfort', 'hurt'],
        relatedTerms: ['不适', '酸痛', '刺痛', '钝痛'],
        category: '症状',
        language: 'mixed',
        confidence: 0.9
      },

      // 缓解治疗
      {
        mainTerm: '缓解',
        synonyms: ['减轻', '舒缓', '缓和', '改善', 'relief', 'ease', 'alleviate'],
        relatedTerms: ['治疗', '康复', '恢复'],
        category: '治疗',
        language: 'mixed',
        confidence: 0.95
      },

      {
        mainTerm: '治疗',
        synonyms: ['疗法', '医治', '治愈', 'treatment', 'therapy', 'cure'],
        relatedTerms: ['康复', '调理', '护理'],
        category: '治疗',
        language: 'mixed',
        confidence: 0.9
      },

      // 药物相关
      {
        mainTerm: '药物',
        synonyms: ['药品', '药剂', '医药', 'medication', 'medicine', 'drug', 'pharmaceutical'],
        relatedTerms: ['处方', '剂量', '副作用'],
        category: '药物',
        language: 'mixed',
        confidence: 0.9
      },

      {
        mainTerm: '布洛芬',
        synonyms: ['ibuprofen', 'advil', 'motrin'],
        relatedTerms: ['止痛药', '消炎药', 'NSAID'],
        category: '药物',
        language: 'mixed',
        confidence: 0.85
      },

      // 身体部位
      {
        mainTerm: '腹部',
        synonyms: ['肚子', '腹腔', '小腹', 'abdomen', 'belly', 'stomach'],
        relatedTerms: ['下腹', '盆腔', '腰部'],
        category: '解剖',
        language: 'mixed',
        confidence: 0.8
      },

      {
        mainTerm: '子宫',
        synonyms: ['宫腔', 'uterus', 'womb'],
        relatedTerms: ['子宫内膜', '宫颈', '卵巢'],
        category: '解剖',
        language: 'mixed',
        confidence: 0.9
      },

      // 月经相关
      {
        mainTerm: '月经',
        synonyms: ['例假', '生理期', '大姨妈', 'menstruation', 'period', 'menses'],
        relatedTerms: ['经期', '月经周期', '排卵'],
        category: '生理',
        language: 'mixed',
        confidence: 0.95
      },

      {
        mainTerm: '经期',
        synonyms: ['月经期', '生理期', 'menstrual period'],
        relatedTerms: ['月经周期', '排卵期', '黄体期'],
        category: '时间',
        language: 'mixed',
        confidence: 0.9
      },

      // 症状程度
      {
        mainTerm: '严重',
        synonyms: ['重度', '剧烈', '强烈', 'severe', 'intense', 'extreme', 'acute'],
        relatedTerms: ['急性', '危险', '紧急'],
        category: '程度',
        language: 'mixed',
        confidence: 0.8
      },

      {
        mainTerm: '轻微',
        synonyms: ['轻度', '微弱', 'mild', 'slight', 'minor', 'gentle'],
        relatedTerms: ['可控', '轻松', '舒适'],
        category: '程度',
        language: 'mixed',
        confidence: 0.8
      },

      // 自然疗法
      {
        mainTerm: '热敷',
        synonyms: ['热水袋', '加热垫', '热疗', 'heat therapy', 'heating pad', 'hot compress'],
        relatedTerms: ['温敷', '热水浴', '桑拿'],
        category: '自然疗法',
        language: 'mixed',
        confidence: 0.85
      },

      {
        mainTerm: '按摩',
        synonyms: ['推拿', '揉捏', 'massage', 'rubbing'],
        relatedTerms: ['穴位按压', '指压', '理疗'],
        category: '自然疗法',
        language: 'mixed',
        confidence: 0.8
      },

      // 运动相关
      {
        mainTerm: '运动',
        synonyms: ['锻炼', '体育', '健身', 'exercise', 'workout', 'physical activity'],
        relatedTerms: ['瑜伽', '步行', '游泳'],
        category: '生活方式',
        language: 'mixed',
        confidence: 0.85
      },

      {
        mainTerm: '瑜伽',
        synonyms: ['yoga', '伸展运动'],
        relatedTerms: ['冥想', '呼吸练习', '柔韧性'],
        category: '运动',
        language: 'mixed',
        confidence: 0.8
      },

      // 情绪心理
      {
        mainTerm: '情绪',
        synonyms: ['心情', '感情', '情感', 'mood', 'emotion', 'feeling'],
        relatedTerms: ['心理', '精神', '态度'],
        category: '心理',
        language: 'mixed',
        confidence: 0.7
      },

      {
        mainTerm: '压力',
        synonyms: ['紧张', '焦虑', '应激', 'stress', 'anxiety', 'tension'],
        relatedTerms: ['抑郁', '烦躁', '不安'],
        category: '心理',
        language: 'mixed',
        confidence: 0.8
      },

      // 生活方式
      {
        mainTerm: '饮食',
        synonyms: ['膳食', '营养', '食谱', 'diet', 'nutrition', 'eating'],
        relatedTerms: ['食物', '营养素', '维生素'],
        category: '生活方式',
        language: 'mixed',
        confidence: 0.85
      },

      {
        mainTerm: '睡眠',
        synonyms: ['休息', '睡觉', '入睡', 'sleep', 'rest', 'slumber'],
        relatedTerms: ['失眠', '疲劳', '恢复'],
        category: '生活方式',
        language: 'mixed',
        confidence: 0.8
      }
    ];

    // 批量添加同义词组
    for (const group of synonymGroups) {
      this.addSynonymGroup(group);
    }
  }
} 