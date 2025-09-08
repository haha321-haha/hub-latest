// lib/pdf-resources/utils/metadata-extractor.ts

import { PDFResource, LocalizedString, QualityScore, ResourceCategory, SupportedLanguage } from '../types/resource-types';
import { BUSINESS_CONSTANTS } from '../../../constants/business.constants';

/**
 * 文件元数据接口
 */
interface FileMetadata {
  filename: string;
  fileSize: number;
  mimeType: string;
  createdDate?: Date;
  modifiedDate?: Date;
  checksum?: string;
  encoding?: string;
}

/**
 * PDF特定元数据
 */
interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
  pdfVersion?: string;
  encrypted: boolean;
  permissions?: {
    printing: boolean;
    copying: boolean;
    commenting: boolean;
    formFilling: boolean;
  };
  linearized?: boolean;
  tagged?: boolean;
}

/**
 * 内容分析结果
 */
interface ContentAnalysis {
  language: SupportedLanguage;
  languageConfidence: number;
  readabilityScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  keyPhrases: string[];
  topics: Array<{
    topic: string;
    confidence: number;
  }>;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadingTime: number; // 分钟
  wordCount: number;
  characters: number;
}

/**
 * 自动分类结果
 */
interface AutoCategorizationResult {
  suggestedCategory: ResourceCategory;
  confidence: number;
  alternativeCategories: Array<{
    category: ResourceCategory;
    confidence: number;
    reasoning: string;
  }>;
  reasoning: string;
}

/**
 * 质量评估结果
 */
interface QualityAssessment {
  overallScore: number;
  contentScore: number;
  designScore: number;
  accuracyScore: number;
  usefulnessScore: number;
  factors: Array<{
    factor: string;
    score: number;
    weight: number;
    description: string;
  }>;
  improvements: string[];
}

/**
 * 提取选项
 */
interface ExtractionOptions {
  includeTextContent?: boolean;
  includeImages?: boolean;
  includeMetadata?: boolean;
  includeQualityAssessment?: boolean;
  includeContentAnalysis?: boolean;
  includeCategorization?: boolean;
  language?: SupportedLanguage;
  preserveFormatting?: boolean;
  maxTextLength?: number;
}

/**
 * 提取结果
 */
interface ExtractionResult {
  fileMetadata: FileMetadata;
  pdfMetadata?: PDFMetadata;
  textContent?: string;
  contentAnalysis?: ContentAnalysis;
  categorization?: AutoCategorizationResult;
  qualityAssessment?: QualityAssessment;
  suggestedMetadata?: Partial<PDFResource['metadata']>;
  extractedKeywords?: string[];
  images?: Array<{
    pageNumber: number;
    type: 'image' | 'chart' | 'diagram';
    description?: string;
  }>;
  errors?: string[];
  warnings?: string[];
}

/**
 * 元数据提取器类
 */
export class MetadataExtractor {
  private static instance: MetadataExtractor;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): MetadataExtractor {
    if (!MetadataExtractor.instance) {
      MetadataExtractor.instance = new MetadataExtractor();
    }
    return MetadataExtractor.instance;
  }

  /**
   * 从文件提取元数据
   */
  async extractFromFile(
    file: File | Buffer,
    filename: string,
    options: ExtractionOptions = {}
  ): Promise<ExtractionResult> {
    const result: ExtractionResult = {
      fileMetadata: {
        filename,
        fileSize: 0,
        mimeType: 'application/pdf'
      },
      errors: [],
      warnings: []
    };

    try {
      // 1. 提取基础文件信息
      result.fileMetadata = await this.extractFileMetadata(file, filename);

      // 2. 提取PDF特定元数据
      if (options.includeMetadata !== false) {
        result.pdfMetadata = await this.extractPDFMetadata(file);
      }

      // 3. 提取文本内容
      if (options.includeTextContent !== false) {
        result.textContent = await this.extractTextContent(file, options);
      }

      // 4. 内容分析
      if (options.includeContentAnalysis && result.textContent) {
        result.contentAnalysis = await this.analyzeContent(
          result.textContent,
          options.language || 'zh'
        );
      }

      // 5. 自动分类
      if (options.includeCategorization && result.textContent) {
        result.categorization = await this.categorizeContent(
          result.textContent,
          result.pdfMetadata
        );
      }

      // 6. 质量评估
      if (options.includeQualityAssessment) {
        result.qualityAssessment = await this.assessQuality(
          result.textContent,
          result.pdfMetadata,
          result.fileMetadata
        );
      }

      // 7. 生成建议的元数据
      result.suggestedMetadata = this.generateSuggestedMetadata(result);

      // 8. 提取关键词
      result.extractedKeywords = this.extractKeywords(
        result.textContent,
        result.pdfMetadata
      );

    } catch (error) {
      result.errors?.push(`提取失败: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * 从现有资源更新元数据
   */
  async updateResourceMetadata(
    resource: PDFResource,
    options: ExtractionOptions = {}
  ): Promise<Partial<PDFResource>> {
    // 模拟从现有资源更新元数据
    const updates: Partial<PDFResource> = {
      updatedAt: new Date()
    };

    try {
      // 重新分析内容（如果有文本内容）
      if (resource.content.search.extractedText) {
        const contentAnalysis = await this.analyzeContent(
          resource.content.search.extractedText,
          resource.language
        );

        if (contentAnalysis) {
          updates.metadata = {
            ...resource.metadata,
            difficulty: contentAnalysis.complexity,
            estimatedReadTime: contentAnalysis.estimatedReadingTime
          };

          // 更新搜索关键词
          updates.content = {
            ...resource.content,
            search: {
              ...resource.content.search,
              searchKeywords: contentAnalysis.keyPhrases
            }
          };
        }
      }

    } catch (error) {
      console.error('更新资源元数据失败:', error);
    }

    return updates;
  }

  /**
   * 批量提取元数据
   */
  async batchExtract(
    files: Array<{ file: File | Buffer; filename: string }>,
    options: ExtractionOptions = {}
  ): Promise<Array<{ filename: string; result: ExtractionResult }>> {
    const results = [];

    for (const { file, filename } of files) {
      try {
        const result = await this.extractFromFile(file, filename, options);
        results.push({ filename, result });
      } catch (error) {
        results.push({
          filename,
          result: {
            fileMetadata: { filename, fileSize: 0, mimeType: 'application/pdf' },
            errors: [`批量提取失败: ${(error as Error).message}`]
          }
        });
      }
    }

    return results;
  }

  /**
   * 验证提取结果
   */
  validateExtractionResult(result: ExtractionResult): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    // 🔧 关键修复：明确类型注解
    const validation: {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    } = {
      isValid: true,
      errors: [],      // 明确是string[]，不是never[]
      warnings: []     // 明确是string[]，不是never[]
    };

    // 检查基础文件信息
    if (!result.fileMetadata.filename) {
      validation.isValid = false;
      validation.errors.push('缺少文件名');
    }

    if (result.fileMetadata.fileSize <= 0) {
      validation.isValid = false;
      validation.errors.push('无效的文件大小');
    }

    // 检查PDF元数据
    if (result.pdfMetadata) {
      if (result.pdfMetadata.pageCount <= 0) {
        validation.isValid = false;
        validation.errors.push('无效的页数');
      }

      // 🎯 这就是第327行的问题，现在已修复
      if (!result.pdfMetadata.title && !result.textContent) {
        validation.warnings.push('无法提取标题和内容');
      }
    }

    // 检查内容分析
    if (result.contentAnalysis) {
      if (result.contentAnalysis.languageConfidence < BUSINESS_CONSTANTS.quality.minLanguageConfidence) {
        validation.warnings.push('语言检测置信度较低');
      }

      if (result.contentAnalysis.wordCount < BUSINESS_CONSTANTS.quality.minWordCount) {
        validation.warnings.push('文档内容过少');
      }
    }

    // 检查分类结果
    if (result.categorization) {
      if (result.categorization.confidence < BUSINESS_CONSTANTS.quality.minCategorizationConfidence) {
        validation.warnings.push('自动分类置信度较低');
      }
    }

    return validation;
  }

  private async extractFileMetadata(
    file: File | Buffer,
    filename: string
  ): Promise<FileMetadata> {
    const metadata: FileMetadata = {
      filename,
      fileSize: 0,
      mimeType: 'application/pdf'
    };

    if (file instanceof File) {
      metadata.fileSize = file.size;
      metadata.mimeType = file.type || 'application/pdf';
      metadata.modifiedDate = new Date(file.lastModified);
    } else {
      metadata.fileSize = file.length;
    }

    // 生成简单的校验和
    metadata.checksum = await this.generateChecksum(file);

    return metadata;
  }

  private async extractPDFMetadata(file: File | Buffer): Promise<PDFMetadata> {
    // 模拟PDF元数据提取
    // 实际实现中应使用 pdf-parse 或类似库
    
    const metadata: PDFMetadata = {
      pageCount: this.estimatePageCount(file),
      encrypted: false,
      permissions: {
        printing: true,
        copying: true,
        commenting: true,
        formFilling: true
      }
    };

    // 从文件名推断一些信息
    const filename = file instanceof File ? file.name : 'unknown.pdf';
    
    if (filename.includes('guide') || filename.includes('指南')) {
      metadata.subject = '用户指南';
    }
    
    if (filename.includes('manual') || filename.includes('手册')) {
      metadata.subject = '操作手册';
    }

    return metadata;
  }

  private async extractTextContent(
    file: File | Buffer,
    options: ExtractionOptions
  ): Promise<string> {
    // 模拟文本提取
    // 实际实现中应使用 pdf-parse 等库
    
    const sampleTexts = [
      '经期疼痛是女性常见的健康问题，通过正确的方法可以有效缓解。本指南提供了多种自然、安全的缓解方法。',
      '热疗法是缓解经期疼痛最有效的方法之一。使用热水袋或暖宫贴可以放松子宫肌肉，减轻痉挛。',
      '呼吸练习和冥想可以帮助放松身心，减轻疼痛感受。深呼吸技巧特别适合急性疼痛时使用。',
      '营养调理在经期健康管理中起重要作用。适当补充维生素和矿物质可以预防和缓解经期不适。'
    ];

    // 基于文件大小选择合适的示例文本
    const fileSize = file instanceof File ? file.size : file.length;
    const textLength = Math.min(fileSize / 1000, 2000); // 估算文本长度
    
    let selectedText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    // 根据需要重复或截断文本
    while (selectedText.length < textLength) {
      selectedText += ' ' + sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    }

    const maxLength = options.maxTextLength || BUSINESS_CONSTANTS.quality.maxTextLength;
    if (selectedText.length > maxLength) {
      selectedText = selectedText.substring(0, maxLength);
    }

    return selectedText;
  }

  private async analyzeContent(
    text: string,
    language: SupportedLanguage
  ): Promise<ContentAnalysis> {
    const wordCount = text.split(/\s+/).length;
    const characters = text.length;

    return {
      language,
      languageConfidence: 0.95,
      readabilityScore: 7.5,
      sentiment: 'positive',
      sentimentScore: 0.7,
      keyPhrases: this.extractKeyPhrases(text),
      topics: [
        { topic: '经期健康', confidence: 0.9 },
        { topic: '疼痛管理', confidence: 0.8 },
        { topic: '自然疗法', confidence: 0.7 }
      ],
      complexity: this.assessComplexity(text),
      estimatedReadingTime: Math.ceil(wordCount / BUSINESS_CONSTANTS.content.readingSpeed),
      wordCount,
      characters
    };
  }

  private async categorizeContent(
    text: string,
    pdfMetadata?: PDFMetadata
  ): Promise<AutoCategorizationResult> {
    // 基于关键词的简单分类逻辑
    const categories: Record<ResourceCategory, string[]> = {
      'immediate-relief': ['快速', '立即', '紧急', '缓解', '5分钟', '即时'],
      'preparation': ['准备', '预防', '计划', '营养', '锻炼', '习惯'],
      'learning': ['了解', '学习', '知识', '教育', '科普', '医学'],
      'management': ['管理', '长期', '维护', '跟踪', '监控', '记录'],
      'assessment': ['评估', '测试', '检查', '诊断', '问卷', '量表'],
      'template': ['模板', '表格', '格式', '样本', '范例', '表单']
    };

    let bestCategory: ResourceCategory = 'learning';
    let bestScore = 0;
    const alternativeCategories: AutoCategorizationResult['alternativeCategories'] = [];

    for (const [category, keywords] of Object.entries(categories)) {
      let score = 0;
      const matchedKeywords: string[] = [];

      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      }

      if (score > 0) {
        alternativeCategories.push({
          category: category as ResourceCategory,
          confidence: score / keywords.length,
          reasoning: `匹配关键词: ${matchedKeywords.join(', ')}`
        });
      }

      if (score > bestScore) {
        bestScore = score;
        bestCategory = category as ResourceCategory;
      }
    }

    // 按置信度排序
    alternativeCategories.sort((a, b) => b.confidence - a.confidence);

    return {
      suggestedCategory: bestCategory,
      confidence: bestScore / (categories[bestCategory]?.length || 1),
      alternativeCategories: alternativeCategories.slice(0, 3),
      reasoning: `基于内容关键词分析，推荐分类为 ${bestCategory}`
    };
  }

  private async assessQuality(
    text?: string,
    pdfMetadata?: PDFMetadata,
    fileMetadata?: FileMetadata
  ): Promise<QualityAssessment> {
    const factors: QualityAssessment['factors'] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // 内容质量评估
    if (text) {
      const contentScore = this.assessContentQuality(text);
      factors.push({
        factor: '内容质量',
        score: contentScore,
        weight: 0.4,
        description: '基于文本长度、结构和可读性的评估'
      });
      totalScore += contentScore * 0.4;
      totalWeight += 0.4;
    }

    // 设计质量评估
    if (pdfMetadata) {
      const designScore = this.assessDesignQuality(pdfMetadata);
      factors.push({
        factor: '设计质量',
        score: designScore,
        weight: 0.2,
        description: '基于PDF元数据和结构的评估'
      });
      totalScore += designScore * 0.2;
      totalWeight += 0.2;
    }

    // 文件质量评估
    if (fileMetadata) {
      const fileScore = this.assessFileQuality(fileMetadata);
      factors.push({
        factor: '文件质量',
        score: fileScore,
        weight: 0.2,
        description: '基于文件大小和格式的评估'
      });
      totalScore += fileScore * 0.2;
      totalWeight += 0.2;
    }

    // 实用性评估（基于内容分析）
    const usefulnessScore = text ? this.assessUsefulness(text) : 7;
    factors.push({
      factor: '实用性',
      score: usefulnessScore,
      weight: 0.2,
      description: '基于内容实用性和适用性的评估'
    });
    totalScore += usefulnessScore * 0.2;
    totalWeight += 0.2;

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 5;

    return {
      overallScore,
      contentScore: factors.find(f => f.factor === '内容质量')?.score || 5,
      designScore: factors.find(f => f.factor === '设计质量')?.score || 5,
      accuracyScore: 8, // 默认假设准确性较高
      usefulnessScore,
      factors,
      improvements: this.generateImprovementSuggestions(factors, overallScore)
    };
  }

  private generateSuggestedMetadata(result: ExtractionResult): Partial<PDFResource['metadata']> {
    const metadata: Partial<PDFResource['metadata']> = {};

    // 生成标题
    if (result.pdfMetadata?.title) {
      metadata.title = {
        zh: result.pdfMetadata.title,
        en: result.pdfMetadata.title
      };
    } else {
      const filename = result.fileMetadata.filename.replace(/\.[^/.]+$/, '');
      metadata.title = {
        zh: this.generateChineseTitle(filename),
        en: filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
    }

    // 生成描述
    if (result.textContent) {
      const shortDescription = result.textContent.substring(0, 150) + '...';
      metadata.description = {
        zh: shortDescription,
        en: shortDescription
      };
    }

    // 设置作者
    if (result.pdfMetadata?.author) {
      metadata.author = result.pdfMetadata.author;
    }

    // 设置关键词
    if (result.extractedKeywords) {
      metadata.keywords = result.extractedKeywords;
    }

    // 设置质量评分
    if (result.qualityAssessment) {
      metadata.quality = {
        content: result.qualityAssessment.contentScore,
        design: result.qualityAssessment.designScore,
        accuracy: result.qualityAssessment.accuracyScore,
        usefulness: result.qualityAssessment.usefulnessScore,
        overall: result.qualityAssessment.overallScore
      };
    }

    // 设置难度和阅读时间
    if (result.contentAnalysis) {
      metadata.difficulty = result.contentAnalysis.complexity;
      metadata.estimatedReadTime = result.contentAnalysis.estimatedReadingTime;
    }

    return metadata;
  }

  private extractKeywords(text?: string, pdfMetadata?: PDFMetadata): string[] {
    const keywords: string[] = [];

    // 从PDF元数据提取
    if (pdfMetadata?.keywords) {
      keywords.push(...pdfMetadata.keywords.split(/[,;]/));
    }

    // 从文本内容提取
    if (text) {
      keywords.push(...this.extractKeyPhrases(text));
    }

    // 去重和清理
    return [...new Set(keywords)]
      .map(k => k.trim())
      .filter(k => k.length > 1 && k.length < 50)
      .slice(0, 20);
  }

  private extractKeyPhrases(text: string): string[] {
    // 简化的关键词提取
    const commonPhrases = [
      '经期疼痛', '月经痛', '痛经', '疼痛缓解', '自然疗法',
      '热疗法', '营养调理', '呼吸练习', '按摩手法', '草药茶',
      '健康管理', '预防措施', '生活方式', '饮食建议', '运动锻炼'
    ];

    return commonPhrases.filter(phrase => text.includes(phrase));
  }

  private assessComplexity(text: string): 'beginner' | 'intermediate' | 'advanced' {
    const sentences = text.split(/[。！？]/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;

    if (avgWordsPerSentence < 15) return 'beginner';
    if (avgWordsPerSentence < 25) return 'intermediate';
    return 'advanced';
  }

  private assessContentQuality(text: string): number {
    let score = 5; // 基础分

    // 文本长度评估
    if (text.length > 1000) score += 1;
    if (text.length > 3000) score += 1;

    // 结构评估（基于标点符号）
    const sentences = text.split(/[。！？]/).length;
    if (sentences > 10) score += 1;

    // 关键词密度
    const keywords = ['缓解', '方法', '健康', '疼痛', '治疗'];
    const keywordCount = keywords.reduce((count, keyword) => 
      count + (text.match(new RegExp(keyword, 'g')) || []).length, 0
    );
    
    if (keywordCount > 5) score += 1;

    return Math.min(score, 10);
  }

  private assessDesignQuality(pdfMetadata: PDFMetadata): number {
    let score = 5;

    // 页数评估
    if (pdfMetadata.pageCount > 5) score += 1;
    if (pdfMetadata.pageCount > 10) score += 1;

    // 元数据完整性
    if (pdfMetadata.title) score += 1;
    if (pdfMetadata.author) score += 1;
    if (pdfMetadata.subject) score += 1;

    return Math.min(score, 10);
  }

  private assessFileQuality(fileMetadata: FileMetadata): number {
    let score = 5;

    // 文件大小评估
    if (fileMetadata.fileSize > 100000) score += 1; // >100KB
    if (fileMetadata.fileSize < 10000000) score += 1; // <10MB

    // 文件名质量
    if (fileMetadata.filename.length > 10) score += 1;
    if (!fileMetadata.filename.includes('temp')) score += 1;

    return Math.min(score, 10);
  }

  private assessUsefulness(text: string): number {
    let score = 5;

    // 实用性关键词
    const usefulKeywords = ['方法', '步骤', '建议', '指南', '技巧', '注意事项'];
    const usefulCount = usefulKeywords.reduce((count, keyword) => 
      count + (text.includes(keyword) ? 1 : 0), 0
    );

    score += Math.min(usefulCount, 3);

    return Math.min(score, 10);
  }

  private generateImprovementSuggestions(
    factors: QualityAssessment['factors'],
    overallScore: number
  ): string[] {
    const suggestions: string[] = [];

    if (overallScore < 6) {
      suggestions.push('考虑增加更多实用的内容和示例');
    }

    factors.forEach(factor => {
      if (factor.score < 6) {
        switch (factor.factor) {
          case '内容质量':
            suggestions.push('增加文档长度和结构化内容');
            break;
          case '设计质量':
            suggestions.push('改善PDF格式和添加更多元数据');
            break;
          case '文件质量':
            suggestions.push('优化文件大小和命名规范');
            break;
          case '实用性':
            suggestions.push('增加更多实际应用的建议和指导');
            break;
        }
      }
    });

    return suggestions;
  }

  private generateChineseTitle(filename: string): string {
    // 简单的文件名到中文标题转换
    const titleMap: Record<string, string> = {
      'immediate-relief': '快速缓解指南',
      'pain-relief': '疼痛缓解方法',
      'guide': '使用指南',
      'manual': '操作手册',
      'nutrition': '营养指导',
      'exercise': '运动指导'
    };

    let title = filename;
    for (const [key, value] of Object.entries(titleMap)) {
      if (filename.includes(key)) {
        title = title.replace(key, value);
      }
    }

    return title.replace(/-/g, ' ');
  }

  private estimatePageCount(file: File | Buffer): number {
    // 基于文件大小的页数估算
    const fileSize = file instanceof File ? file.size : file.length;
    return Math.max(1, Math.floor(fileSize / 100000)); // 约100KB每页
  }

  private async generateChecksum(file: File | Buffer): Promise<string> {
    // 简化的校验和生成
    const data = file instanceof File ? await file.arrayBuffer() : file;
    let hash = 0;
    const view = new Uint8Array(data);
    
    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash + view[i]) & 0xffffffff;
    }
    
    return Math.abs(hash).toString(16);
  }
}

/**
 * 元数据提取器工具函数
 */
export const metadataExtractor = {
  getInstance: MetadataExtractor.getInstance,
  
  // 快捷方法
  extractFromFile: (file: File | Buffer, filename: string, options?: ExtractionOptions) =>
    MetadataExtractor.getInstance().extractFromFile(file, filename, options),
  
  updateResourceMetadata: (resource: PDFResource, options?: ExtractionOptions) =>
    MetadataExtractor.getInstance().updateResourceMetadata(resource, options),
  
  batchExtract: (files: Array<{ file: File | Buffer; filename: string }>, options?: ExtractionOptions) =>
    MetadataExtractor.getInstance().batchExtract(files, options)
};