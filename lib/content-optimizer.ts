
interface ContentAnalysis {
  readabilityScore: number;
  keywordDensity: { [key: string]: number };
  semanticKeywords: string[];
  contentLength: number;
  headingStructure: string[];
  internalLinks: number;
  externalLinks: number;
  imageOptimization: boolean;
}

export class ContentOptimizer {
  
  // 分析内容可读性
  static analyzeReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, score));
  }
  
  // 计算关键词密度
  static calculateKeywordDensity(content: string, keywords: string[]): { [key: string]: number } {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const density: { [key: string]: number } = {};
    
    keywords.forEach(keyword => {
      const keywordWords = keyword.toLowerCase().split(/\s+/);
      let count = 0;
      
      for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const phrase = words.slice(i, i + keywordWords.length).join(' ');
        if (phrase === keyword.toLowerCase()) {
          count++;
        }
      }
      
      density[keyword] = (count / totalWords) * 100;
    });
    
    return density;
  }
  
  // 生成语义关键词建议
  static generateSemanticKeywords(primaryKeyword: string): string[] {
    const semanticMap: { [key: string]: string[] } = {
      '经期': ['生理周期', '月经', '例假', '大姨妈', '经血', '经期护理'],
      '健康': ['保健', '养生', '护理', '调理', '预防', '治疗'],
      '女性': ['女人', '妇女', '姐妹', '女孩', '女士', '女生'],
      '追踪': ['记录', '监测', '跟踪', '观察', '统计', '分析']
    };
    
    return semanticMap[primaryKeyword] || [];
  }
  
  // 优化建议生成
  static generateOptimizationSuggestions(analysis: ContentAnalysis): string[] {
    const suggestions: string[] = [];
    
    if (analysis.readabilityScore < 60) {
      suggestions.push('建议简化句子结构，提高内容可读性');
    }
    
    if (analysis.contentLength < 300) {
      suggestions.push('内容长度偏短，建议增加到至少300字');
    }
    
    if (analysis.internalLinks < 3) {
      suggestions.push('建议增加内部链接，提高页面权重传递');
    }
    
    if (!analysis.imageOptimization) {
      suggestions.push('优化图片alt标签和文件名');
    }
    
    return suggestions;
  }
  
  private static countSyllables(text: string): number {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiou]{2,}/g, 'a')
      .replace(/[^aeiou]/g, '')
      .length || 1;
  }
}
