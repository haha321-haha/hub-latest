// lib/pdf-resources/core/resource-validator.ts

import { 
  PDFResource, 
  ValidationResult, 
  ValidationError,
  QualityScore,
  AccessLevel,
  ResourceCategory,
  SupportedLanguage
} from '../types/resource-types';
import { ValidationConfig, ValidationRule } from '../types/config-types';

/**
 * 验证规则接口
 */
interface IValidationRule {
  id: string;
  name: string;
  validate(resource: PDFResource, config: ValidationConfig): ValidationError[];
}

/**
 * 文件验证规则
 */
class FileValidationRule implements IValidationRule {
  id = 'file_validation';
  name = '文件验证';

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];
    const fileConfig = config.file;

    // 检查文件大小
    if (resource.fileSize > fileConfig.maxFileSize) {
      errors.push({
        field: 'fileSize',
        message: `文件大小 ${this.formatBytes(resource.fileSize)} 超过限制 ${this.formatBytes(fileConfig.maxFileSize)}`,
        severity: 'error',
        code: 'FILE_TOO_LARGE',
        suggestion: '请压缩文件或分割为多个较小的文件'
      });
    }

    if (resource.fileSize < fileConfig.minFileSize) {
      errors.push({
        field: 'fileSize',
        message: `文件大小 ${this.formatBytes(resource.fileSize)} 小于最小要求 ${this.formatBytes(fileConfig.minFileSize)}`,
        severity: 'warning',
        code: 'FILE_TOO_SMALL',
        suggestion: '请检查文件是否完整'
      });
    }

    // 检查文件格式
    if (!this.isValidFormat(resource.filename, fileConfig.allowedFormats)) {
      errors.push({
        field: 'filename',
        message: `不支持的文件格式，允许的格式: ${fileConfig.allowedFormats.join(', ')}`,
        severity: 'error',
        code: 'INVALID_FILE_FORMAT',
        suggestion: '请转换为支持的文件格式'
      });
    }

    // 检查页数合理性
    if (resource.pageCount <= 0) {
      errors.push({
        field: 'pageCount',
        message: '页数必须大于0',
        severity: 'error',
        code: 'INVALID_PAGE_COUNT'
      });
    }

    if (resource.pageCount > 500) {
      errors.push({
        field: 'pageCount',
        message: `页数 ${resource.pageCount} 过多，建议分割文件`,
        severity: 'warning',
        code: 'EXCESSIVE_PAGE_COUNT',
        suggestion: '考虑将大文件分割为多个部分'
      });
    }

    return errors;
  }

  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private isValidFormat(filename: string, allowedFormats: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return allowedFormats.includes(extension || '');
  }
}

/**
 * 内容验证规则
 */
class ContentValidationRule implements IValidationRule {
  id = 'content_validation';
  name = '内容验证';

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];
    const contentConfig = config.content;
    const metadata = resource.metadata;

    // 验证标题
    if (contentConfig.requireTitle) {
      for (const [lang, title] of Object.entries(metadata.title)) {
        if (!title || title.trim().length === 0) {
          errors.push({
            field: `metadata.title.${lang}`,
            message: `${lang} 语言标题不能为空`,
            severity: 'error',
            code: 'MISSING_TITLE'
          });
          continue;
        }

        if (title.length < contentConfig.minTitleLength) {
          errors.push({
            field: `metadata.title.${lang}`,
            message: `${lang} 语言标题长度 ${title.length} 小于最小要求 ${contentConfig.minTitleLength}`,
            severity: 'warning',
            code: 'TITLE_TOO_SHORT',
            suggestion: '标题应该更加描述性和具体'
          });
        }

        if (title.length > contentConfig.maxTitleLength) {
          errors.push({
            field: `metadata.title.${lang}`,
            message: `${lang} 语言标题长度 ${title.length} 超过最大限制 ${contentConfig.maxTitleLength}`,
            severity: 'error',
            code: 'TITLE_TOO_LONG',
            suggestion: '请简化标题或使用描述字段补充详细信息'
          });
        }

        // 检查禁用词汇
        if (this.containsBannedWords(title, contentConfig.bannedWords)) {
          errors.push({
            field: `metadata.title.${lang}`,
            message: `${lang} 语言标题包含禁用词汇`,
            severity: 'error',
            code: 'TITLE_CONTAINS_BANNED_WORDS'
          });
        }
      }
    }

    // 验证描述
    if (contentConfig.requireDescription) {
      for (const [lang, description] of Object.entries(metadata.description)) {
        if (!description || description.trim().length === 0) {
          errors.push({
            field: `metadata.description.${lang}`,
            message: `${lang} 语言描述不能为空`,
            severity: 'error',
            code: 'MISSING_DESCRIPTION'
          });
          continue;
        }

        if (description.length < contentConfig.minDescriptionLength) {
          errors.push({
            field: `metadata.description.${lang}`,
            message: `${lang} 语言描述长度 ${description.length} 小于最小要求 ${contentConfig.minDescriptionLength}`,
            severity: 'warning',
            code: 'DESCRIPTION_TOO_SHORT',
            suggestion: '描述应该更详细地说明资源内容和用途'
          });
        }

        if (description.length > contentConfig.maxDescriptionLength) {
          errors.push({
            field: `metadata.description.${lang}`,
            message: `${lang} 语言描述长度 ${description.length} 超过最大限制 ${contentConfig.maxDescriptionLength}`,
            severity: 'error',
            code: 'DESCRIPTION_TOO_LONG',
            suggestion: '请精简描述，突出重点信息'
          });
        }
      }
    }

    // 验证关键词
    if (contentConfig.requireKeywords) {
      if (!metadata.keywords || metadata.keywords.length === 0) {
        errors.push({
          field: 'metadata.keywords',
          message: '关键词不能为空',
          severity: 'error',
          code: 'MISSING_KEYWORDS',
          suggestion: '添加相关的搜索关键词以提高可发现性'
        });
      } else {
        if (metadata.keywords.length < contentConfig.minKeywords) {
          errors.push({
            field: 'metadata.keywords',
            message: `关键词数量 ${metadata.keywords.length} 少于最小要求 ${contentConfig.minKeywords}`,
            severity: 'warning',
            code: 'INSUFFICIENT_KEYWORDS',
            suggestion: '添加更多相关关键词'
          });
        }

        if (metadata.keywords.length > contentConfig.maxKeywords) {
          errors.push({
            field: 'metadata.keywords',
            message: `关键词数量 ${metadata.keywords.length} 超过最大限制 ${contentConfig.maxKeywords}`,
            severity: 'warning',
            code: 'EXCESSIVE_KEYWORDS',
            suggestion: '保留最相关的关键词'
          });
        }

        // 检查关键词质量
        const duplicateKeywords = this.findDuplicates(metadata.keywords);
        if (duplicateKeywords.length > 0) {
          errors.push({
            field: 'metadata.keywords',
            message: `发现重复关键词: ${duplicateKeywords.join(', ')}`,
            severity: 'warning',
            code: 'DUPLICATE_KEYWORDS',
            suggestion: '移除重复的关键词'
          });
        }
      }
    }

    return errors;
  }

  private containsBannedWords(text: string, bannedWords: string[]): boolean {
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word.toLowerCase()));
  }

  private findDuplicates(array: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    for (const item of array) {
      const lowerItem = item.toLowerCase();
      if (seen.has(lowerItem)) {
        duplicates.add(item);
      } else {
        seen.add(lowerItem);
      }
    }
    
    return Array.from(duplicates);
  }
}

/**
 * 质量验证规则
 */
class QualityValidationRule implements IValidationRule {
  id = 'quality_validation';
  name = '质量验证';

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];
    const qualityConfig = config.quality;
    const quality = resource.metadata.quality;

    // 验证必需的评分
    if (qualityConfig.requireAllScores) {
      const requiredFields = ['content', 'design', 'accuracy', 'usefulness'] as const;
      
      for (const field of requiredFields) {
        const score = quality[field];
        if (score === undefined || score === null) {
          errors.push({
            field: `metadata.quality.${field}`,
            message: `缺少${field}质量评分`,
            severity: 'error',
            code: 'MISSING_QUALITY_SCORE'
          });
        } else if (score < 1 || score > 10) {
          errors.push({
            field: `metadata.quality.${field}`,
            message: `${field}质量评分 ${score} 超出有效范围 (1-10)`,
            severity: 'error',
            code: 'INVALID_QUALITY_SCORE'
          });
        }
      }
    }

    // 验证总体评分
    if (qualityConfig.autoCalculateOverall) {
      const calculatedOverall = this.calculateOverallScore(quality, qualityConfig.scoreWeights);
      const difference = Math.abs(calculatedOverall - quality.overall);
      
      if (difference > 0.1) {
        errors.push({
          field: 'metadata.quality.overall',
          message: `总体评分 ${quality.overall} 与计算值 ${calculatedOverall.toFixed(1)} 不匹配`,
          severity: 'warning',
          code: 'INCORRECT_OVERALL_SCORE',
          suggestion: `建议使用计算值 ${calculatedOverall.toFixed(1)}`
        });
      }
    }

    // 验证最小质量要求
    if (quality.overall < qualityConfig.minOverallScore) {
      errors.push({
        field: 'metadata.quality.overall',
        message: `总体质量评分 ${quality.overall} 低于最小要求 ${qualityConfig.minOverallScore}`,
        severity: 'error',
        code: 'QUALITY_BELOW_MINIMUM',
        suggestion: '请提高资源质量或更新评分'
      });
    }

    // 质量一致性检查
    const scores = [quality.content, quality.design, quality.accuracy, quality.usefulness];
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    if (maxScore - minScore > 5) {
      errors.push({
        field: 'metadata.quality',
        message: `质量评分差异过大 (${minScore}-${maxScore})，可能存在评分不一致`,
        severity: 'warning',
        code: 'INCONSISTENT_QUALITY_SCORES',
        suggestion: '请重新评估各项质量指标'
      });
    }

    return errors;
  }

  private calculateOverallScore(
    quality: QualityScore, 
    weights: { content: number; design: number; accuracy: number; usefulness: number }
  ): number {
    const totalWeight = weights.content + weights.design + weights.accuracy + weights.usefulness;
    
    if (totalWeight === 0) return 0;
    
    return (
      quality.content * weights.content +
      quality.design * weights.design +
      quality.accuracy * weights.accuracy +
      quality.usefulness * weights.usefulness
    ) / totalWeight;
  }
}

/**
 * 访问控制验证规则
 */
class AccessValidationRule implements IValidationRule {
  id = 'access_validation';
  name = '访问控制验证';

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];
    const accessConfig = config.access;
    const access = resource.access;

    // 验证访问级别
    if (accessConfig.requireAccessLevel) {
      if (!access.level) {
        errors.push({
          field: 'access.level',
          message: '访问级别不能为空',
          severity: 'error',
          code: 'MISSING_ACCESS_LEVEL'
        });
      } else if (!accessConfig.allowedLevels.includes(access.level)) {
        errors.push({
          field: 'access.level',
          message: `访问级别 ${access.level} 不在允许列表中: ${accessConfig.allowedLevels.join(', ')}`,
          severity: 'error',
          code: 'INVALID_ACCESS_LEVEL'
        });
      }
    }

    // 验证地区设置
    if (accessConfig.requireRegions) {
      if (!access.regions || access.regions.length === 0) {
        errors.push({
          field: 'access.regions',
          message: '访问地区不能为空',
          severity: 'error',
          code: 'MISSING_ACCESS_REGIONS',
          suggestion: `使用默认地区: ${accessConfig.defaultRegions.join(', ')}`
        });
      }
    }

    // 年龄限制验证
    if (access.ageRestriction !== undefined) {
      if (access.ageRestriction < 0 || access.ageRestriction > 100) {
        errors.push({
          field: 'access.ageRestriction',
          message: `年龄限制 ${access.ageRestriction} 超出有效范围 (0-100)`,
          severity: 'error',
          code: 'INVALID_AGE_RESTRICTION'
        });
      }
    }

    // 访问控制一致性检查
    if (access.level === 'public' && access.requireAuth) {
      errors.push({
        field: 'access',
        message: '公开访问级别不应要求身份验证',
        severity: 'warning',
        code: 'INCONSISTENT_ACCESS_CONFIG',
        suggestion: '将访问级别改为 protected 或移除身份验证要求'
      });
    }

    if (access.level === 'private' && access.public) {
      errors.push({
        field: 'access',
        message: '私有访问级别不应设为公开',
        severity: 'error',
        code: 'CONFLICTING_ACCESS_CONFIG'
      });
    }

    return errors;
  }
}

/**
 * 结构验证规则
 */
class StructureValidationRule implements IValidationRule {
  id = 'structure_validation';
  name = '结构验证';

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    // 验证必需字段
    if (!resource.id || resource.id.trim().length === 0) {
      errors.push({
        field: 'id',
        message: '资源ID不能为空',
        severity: 'error',
        code: 'MISSING_RESOURCE_ID'
      });
    }

    // ID格式验证
    if (resource.id && !this.isValidId(resource.id)) {
      errors.push({
        field: 'id',
        message: 'ID格式无效，应使用小写字母、数字和连字符',
        severity: 'error',
        code: 'INVALID_ID_FORMAT',
        suggestion: '使用格式如: my-resource-name'
      });
    }

    // 验证资源类型
    if (resource.type !== 'pdf') {
      errors.push({
        field: 'type',
        message: `不支持的资源类型: ${resource.type}`,
        severity: 'error',
        code: 'INVALID_RESOURCE_TYPE'
      });
    }

    // 验证类别
    if (!this.isValidCategory(resource.category)) {
      errors.push({
        field: 'category',
        message: `无效的资源类别: ${resource.category}`,
        severity: 'error',
        code: 'INVALID_CATEGORY'
      });
    }

    // 验证语言
    if (!this.isValidLanguage(resource.language)) {
      errors.push({
        field: 'language',
        message: `不支持的语言: ${resource.language}`,
        severity: 'error',
        code: 'INVALID_LANGUAGE'
      });
    }

    // 验证时间戳
    if (resource.createdAt > resource.updatedAt) {
      errors.push({
        field: 'updatedAt',
        message: '更新时间不能早于创建时间',
        severity: 'error',
        code: 'INVALID_TIMESTAMP'
      });
    }

    // 验证标签
    if (resource.tags) {
      const invalidTags = resource.tags.filter(tag => !this.isValidTag(tag));
      if (invalidTags.length > 0) {
        errors.push({
          field: 'tags',
          message: `无效的标签: ${invalidTags.join(', ')}`,
          severity: 'warning',
          code: 'INVALID_TAGS',
          suggestion: '标签应该简洁且只包含字母、数字和连字符'
        });
      }
    }

    return errors;
  }

  private isValidId(id: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
  }

  private isValidCategory(category: string): boolean {
    const validCategories = [
      'immediate-relief',
      'preparation',
      'learning',
      'management',
      'assessment',
      'template'
    ];
    return validCategories.includes(category);
  }

  private isValidLanguage(language: string): boolean {
    const validLanguages = ['zh', 'en', 'es', 'fr'];
    return validLanguages.includes(language);
  }

  private isValidTag(tag: string): boolean {
    return /^[a-zA-Z0-9\u4e00-\u9fa5]+(-[a-zA-Z0-9\u4e00-\u9fa5]+)*$/.test(tag) && tag.length <= 50;
  }
}

/**
 * 自定义验证规则
 */
class CustomValidationRule implements IValidationRule {
  constructor(
    public id: string,
    public name: string,
    private rule: ValidationRule
  ) {}

  validate(resource: PDFResource, config: ValidationConfig): ValidationError[] {
    if (!this.rule.enabled) return [];

    const errors: ValidationError[] = [];

    try {
      const fieldValue = this.getFieldValue(resource, this.rule.field);
      const isValid = this.validateField(fieldValue, this.rule);

      if (!isValid) {
        errors.push({
          field: this.rule.field,
          message: this.rule.message,
          severity: this.rule.severity,
          code: this.rule.id.toUpperCase(),
          suggestion: this.rule.suggestion
        });
      }
    } catch (error) {
      errors.push({
        field: this.rule.field,
        message: `自定义验证规则执行失败: ${error}`,
        severity: 'warning',
        code: 'CUSTOM_RULE_ERROR'
      });
    }

    return errors;
  }

  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private validateField(value: any, rule: ValidationRule): boolean {
    // 检查条件
    if (rule.condition && !this.checkCondition(value, rule.condition)) {
      return true; // 条件不满足，跳过验证
    }

    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      
      case 'format':
        if (typeof value !== 'string') return false;
        return rule.params?.pattern ? new RegExp(rule.params.pattern).test(value) : true;
      
      case 'range':
        if (typeof value !== 'number') return false;
        const min = rule.params?.min ?? -Infinity;
        const max = rule.params?.max ?? Infinity;
        return value >= min && value <= max;
      
      case 'custom':
        // 这里可以实现更复杂的自定义验证逻辑
        return true;
      
      default:
        return true;
    }
  }

  private checkCondition(value: any, condition: ValidationRule['condition']): boolean {
    if (!condition) return true;

    const conditionValue = this.getFieldValue(value, condition.field);

    switch (condition.operator) {
      case 'equals':
        return conditionValue === condition.value;
      case 'not_equals':
        return conditionValue !== condition.value;
      case 'contains':
        return typeof conditionValue === 'string' && conditionValue.includes(condition.value);
      case 'not_contains':
        return typeof conditionValue === 'string' && !conditionValue.includes(condition.value);
      case 'greater_than':
        return typeof conditionValue === 'number' && conditionValue > condition.value;
      case 'less_than':
        return typeof conditionValue === 'number' && conditionValue < condition.value;
      default:
        return true;
    }
  }
}

/**
 * 资源验证器主类
 */
export class ResourceValidator {
  private rules: Map<string, IValidationRule> = new Map();
  private config: ValidationConfig;

  constructor(config: ValidationConfig) {
    this.config = config;
    this.initializeDefaultRules();
    this.initializeCustomRules();
  }

  /**
   * 验证单个资源
   */
  async validate(resource: PDFResource): Promise<ValidationResult> {
    if (!this.config.enabled) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        summary: {
          totalChecks: 0,
          passedChecks: 0,
          errorCount: 0,
          warningCount: 0
        }
      };
    }

    const allErrors: ValidationError[] = [];
    let totalChecks = 0;

    // 执行所有验证规则
    for (const rule of this.rules.values()) {
      try {
        const ruleErrors = rule.validate(resource, this.config);
        allErrors.push(...ruleErrors);
        totalChecks++;
      } catch (error) {
        allErrors.push({
          field: 'validation',
          message: `验证规则 ${rule.name} 执行失败: ${error}`,
          severity: 'warning',
          code: 'VALIDATION_RULE_ERROR'
        });
      }
    }

    // 分类错误
    const errors = allErrors.filter(e => e.severity === 'error');
    const warnings = allErrors.filter(e => e.severity === 'warning');
    const suggestions = allErrors.filter(e => e.severity === 'info');

    const isValid = errors.length === 0 && (
      this.config.mode === 'loose' || warnings.length === 0
    );

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      summary: {
        totalChecks,
        passedChecks: totalChecks - errors.length - warnings.length,
        errorCount: errors.length,
        warningCount: warnings.length
      }
    };
  }

  /**
   * 批量验证资源
   */
  async validateBatch(resources: PDFResource[]): Promise<{
    results: Array<{ resource: PDFResource; validation: ValidationResult }>;
    summary: {
      total: number;
      valid: number;
      invalid: number;
      warnings: number;
    };
  }> {
    const results = [];
    let validCount = 0;
    let invalidCount = 0;
    let warningCount = 0;

    for (const resource of resources) {
      const validation = await this.validate(resource);
      results.push({ resource, validation });

      if (validation.isValid) {
        validCount++;
      } else {
        invalidCount++;
      }

      if (validation.warnings.length > 0) {
        warningCount++;
      }
    }

    return {
      results,
      summary: {
        total: resources.length,
        valid: validCount,
        invalid: invalidCount,
        warnings: warningCount
      }
    };
  }

  /**
   * 添加自定义验证规则
   */
  addRule(rule: IValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * 移除验证规则
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * 获取所有验证规则
   */
  getRules(): IValidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 重新初始化自定义规则
    if (newConfig.custom) {
      this.initializeCustomRules();
    }
  }

  /**
   * 验证配置本身
   */
  validateConfig(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 验证文件配置
    if (this.config.file.maxFileSize <= this.config.file.minFileSize) {
      errors.push({
        field: 'file.maxFileSize',
        message: '最大文件大小必须大于最小文件大小',
        severity: 'error',
        code: 'INVALID_FILE_SIZE_CONFIG'
      });
    }

    // 验证内容配置
    if (this.config.content.maxTitleLength <= this.config.content.minTitleLength) {
      errors.push({
        field: 'content.maxTitleLength',
        message: '最大标题长度必须大于最小标题长度',
        severity: 'error',
        code: 'INVALID_TITLE_LENGTH_CONFIG'
      });
    }

    // 验证质量权重
    const weights = this.config.quality.scoreWeights;
    const totalWeight = weights.content + weights.design + weights.accuracy + weights.usefulness;
    
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      warnings.push({
        field: 'quality.scoreWeights',
        message: `质量评分权重总和为 ${totalWeight}，建议为 1.0`,
        severity: 'warning',
        code: 'INVALID_WEIGHT_SUM',
        suggestion: '调整权重使总和等于1.0'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions: [],
      summary: {
        totalChecks: 3,
        passedChecks: 3 - errors.length - warnings.length,
        errorCount: errors.length,
        warningCount: warnings.length
      }
    };
  }

  private initializeDefaultRules(): void {
    this.addRule(new FileValidationRule());
    this.addRule(new ContentValidationRule());
    this.addRule(new QualityValidationRule());
    this.addRule(new AccessValidationRule());
    this.addRule(new StructureValidationRule());
  }

  private initializeCustomRules(): void {
    if (!this.config.custom?.enabled || !this.config.custom.rules) {
      return;
    }

    // 清除现有自定义规则
    for (const ruleId of this.rules.keys()) {
      if (ruleId.startsWith('custom_')) {
        this.rules.delete(ruleId);
      }
    }

    // 添加新的自定义规则
    for (const rule of this.config.custom.rules) {
      const customRule = new CustomValidationRule(
        `custom_${rule.id}`,
        rule.name,
        rule
      );
      this.addRule(customRule);
    }
  }
}