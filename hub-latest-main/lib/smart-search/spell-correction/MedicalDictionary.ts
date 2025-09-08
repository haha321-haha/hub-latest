/**
 * 医疗术语词典
 * 专门针对女性健康和痛经相关的医疗术语
 */

export interface MedicalTermEntry {
  term: string;
  synonyms: string[];
  category: string;
  language: 'zh' | 'en';
  frequency: number; // 使用频率权重
}

export class MedicalDictionary {
  private medicalTerms: Map<string, MedicalTermEntry>;
  private synonymMap: Map<string, string>; // 同义词映射到主词条
  private categories: Set<string>;

  constructor() {
    this.medicalTerms = new Map();
    this.synonymMap = new Map();
    this.categories = new Set();
    this.initializeDictionary();
  }

  /**
   * 检查是否为有效的医疗术语
   */
  isValidTerm(term: string): boolean {
    const normalizedTerm = this.normalizeTerm(term);
    return this.medicalTerms.has(normalizedTerm) || this.synonymMap.has(normalizedTerm);
  }

  /**
   * 获取术语的主词条
   */
  getMainTerm(term: string): string | null {
    const normalizedTerm = this.normalizeTerm(term);
    
    if (this.medicalTerms.has(normalizedTerm)) {
      return normalizedTerm;
    }
    
    if (this.synonymMap.has(normalizedTerm)) {
      return this.synonymMap.get(normalizedTerm) || null;
    }
    
    return null;
  }

  /**
   * 获取术语的同义词
   */
  getSynonyms(term: string): string[] {
    const mainTerm = this.getMainTerm(term);
    if (!mainTerm) return [];
    
    const entry = this.medicalTerms.get(mainTerm);
    return entry ? entry.synonyms : [];
  }

  /**
   * 获取指定分类的术语
   */
  getTermsByCategory(category: string): string[] {
    const terms: string[] = [];
    for (const [term, entry] of this.medicalTerms) {
      if (entry.category === category) {
        terms.push(term);
      }
    }
    return terms;
  }

  /**
   * 获取所有医疗术语
   */
  getAllMedicalTerms(): string[] {
    const allTerms: Set<string> = new Set();
    
    // 添加主词条
    for (const term of this.medicalTerms.keys()) {
      allTerms.add(term);
    }
    
    // 添加同义词
    for (const synonym of this.synonymMap.keys()) {
      allTerms.add(synonym);
    }
    
    return Array.from(allTerms);
  }

  /**
   * 搜索相关术语
   */
  searchTerms(query: string, limit: number = 10): MedicalTermEntry[] {
    const normalizedQuery = this.normalizeTerm(query);
    const results: Array<{ term: MedicalTermEntry; score: number }> = [];

    for (const [term, entry] of this.medicalTerms) {
      let score = 0;

      // 精确匹配
      if (term === normalizedQuery) {
        score += 100;
      }
      // 开头匹配
      else if (term.startsWith(normalizedQuery)) {
        score += 80;
      }
      // 包含匹配
      else if (term.includes(normalizedQuery)) {
        score += 60;
      }

      // 同义词匹配
      for (const synonym of entry.synonyms) {
        if (synonym.includes(normalizedQuery)) {
          score += 40;
          break;
        }
      }

      // 频率权重
      score += entry.frequency;

      if (score > 0) {
        results.push({ term: entry, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.term);
  }

  /**
   * 添加新术语
   */
  addTerm(entry: MedicalTermEntry): void {
    const normalizedTerm = this.normalizeTerm(entry.term);
    this.medicalTerms.set(normalizedTerm, { ...entry, term: normalizedTerm });
    this.categories.add(entry.category);

    // 建立同义词映射
    for (const synonym of entry.synonyms) {
      const normalizedSynonym = this.normalizeTerm(synonym);
      this.synonymMap.set(normalizedSynonym, normalizedTerm);
    }
  }

  // ========== 私有方法 ==========

  /**
   * 标准化术语
   */
  private normalizeTerm(term: string): string {
    return term.toLowerCase().trim();
  }

  /**
   * 初始化医疗词典
   */
  private initializeDictionary(): void {
    const medicalTermsData: MedicalTermEntry[] = [
      // 痛经相关术语
      {
        term: '痛经',
        synonyms: ['经痛', '月经疼痛', '生理痛', 'dysmenorrhea', 'menstrual pain'],
        category: '症状',
        language: 'zh',
        frequency: 100
      },
      {
        term: 'dysmenorrhea',
        synonyms: ['menstrual cramps', 'period pain', 'menstrual pain'],
        category: '症状',
        language: 'en',
        frequency: 95
      },

      // 疼痛相关
      {
        term: '疼痛',
        synonyms: ['痛', '疼', 'pain', 'ache', 'discomfort'],
        category: '症状',
        language: 'zh',
        frequency: 90
      },
      {
        term: '痉挛',
        synonyms: ['抽筋', '肌肉收缩', 'cramps', 'spasms'],
        category: '症状',
        language: 'zh',
        frequency: 85
      },

      // 治疗方法
      {
        term: '缓解',
        synonyms: ['减轻', '舒缓', '缓和', '改善', 'relief', 'ease'],
        category: '治疗',
        language: 'zh',
        frequency: 95
      },
      {
        term: '治疗',
        synonyms: ['疗法', '医治', '治愈', 'treatment', 'therapy'],
        category: '治疗',
        language: 'zh',
        frequency: 90
      },
      {
        term: '药物',
        synonyms: ['药品', '药剂', '医药', 'medication', 'medicine', 'drug'],
        category: '治疗',
        language: 'zh',
        frequency: 88
      },

      // 药物类型
      {
        term: '布洛芬',
        synonyms: ['ibuprofen', 'advil', 'motrin'],
        category: '药物',
        language: 'zh',
        frequency: 80
      },
      {
        term: '对乙酰氨基酚',
        synonyms: ['扑热息痛', 'acetaminophen', 'tylenol', 'paracetamol'],
        category: '药物',
        language: 'zh',
        frequency: 75
      },
      {
        term: '萘普生',
        synonyms: ['naproxen', 'aleve'],
        category: '药物',
        language: 'zh',
        frequency: 70
      },

      // 身体部位
      {
        term: '子宫',
        synonyms: ['宫腔', 'uterus', 'womb'],
        category: '解剖',
        language: 'zh',
        frequency: 85
      },
      {
        term: '卵巢',
        synonyms: ['ovaries', 'ovary'],
        category: '解剖',
        language: 'zh',
        frequency: 80
      },
      {
        term: '腹部',
        synonyms: ['肚子', '腹腔', 'abdomen', 'belly'],
        category: '解剖',
        language: 'zh',
        frequency: 90
      },

      // 症状描述
      {
        term: '严重',
        synonyms: ['重度', '剧烈', 'severe', 'intense', 'extreme'],
        category: '程度',
        language: 'zh',
        frequency: 85
      },
      {
        term: '轻微',
        synonyms: ['轻度', '微弱', 'mild', 'slight', 'minor'],
        category: '程度',
        language: 'zh',
        frequency: 80
      },
      {
        term: '持续',
        synonyms: ['连续', '不断', 'continuous', 'persistent', 'ongoing'],
        category: '时间',
        language: 'zh',
        frequency: 75
      },

      // 月经相关
      {
        term: '月经',
        synonyms: ['例假', '生理期', '大姨妈', 'menstruation', 'period', 'menses'],
        category: '生理',
        language: 'zh',
        frequency: 95
      },
      {
        term: '经期',
        synonyms: ['月经期', '生理期', 'menstrual period', 'menstrual cycle'],
        category: '时间',
        language: 'zh',
        frequency: 90
      },
      {
        term: '周期',
        synonyms: ['循环', 'cycle', 'period cycle'],
        category: '时间',
        language: 'zh',
        frequency: 85
      },

      // 自然疗法
      {
        term: '热敷',
        synonyms: ['热水袋', '加热垫', 'heat therapy', 'heating pad'],
        category: '自然疗法',
        language: 'zh',
        frequency: 85
      },
      {
        term: '按摩',
        synonyms: ['推拿', 'massage', 'rubbing'],
        category: '自然疗法',
        language: 'zh',
        frequency: 80
      },
      {
        term: '瑜伽',
        synonyms: ['yoga', '伸展运动'],
        category: '运动',
        language: 'zh',
        frequency: 75
      },

      // 情绪相关
      {
        term: '情绪',
        synonyms: ['心情', '感情', 'mood', 'emotion'],
        category: '心理',
        language: 'zh',
        frequency: 70
      },
      {
        term: '压力',
        synonyms: ['紧张', '焦虑', 'stress', 'anxiety'],
        category: '心理',
        language: 'zh',
        frequency: 80
      },

      // 生活方式
      {
        term: '饮食',
        synonyms: ['膳食', '营养', 'diet', 'nutrition'],
        category: '生活方式',
        language: 'zh',
        frequency: 85
      },
      {
        term: '睡眠',
        synonyms: ['休息', '睡觉', 'sleep', 'rest'],
        category: '生活方式',
        language: 'zh',
        frequency: 80
      },
      {
        term: '运动',
        synonyms: ['锻炼', '体育', 'exercise', 'workout', 'physical activity'],
        category: '生活方式',
        language: 'zh',
        frequency: 85
      }
    ];

    // 批量添加术语
    for (const termData of medicalTermsData) {
      this.addTerm(termData);
    }
  }
} 