/**
 * Period Hub Resource Validator
 * 资源验证器
 */

import { 
  EnterpriseResource, 
  ResourceValidationError, 
  ResourceManagerConfig,
  ResourceType,
  ResourceStatus,
  DifficultyLevel,
  TargetAudience
} from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ResourceValidationError[];
  warnings: ResourceValidationError[];
}

export class ResourceValidator {
  private config: ResourceManagerConfig;

  constructor(config: ResourceManagerConfig) {
    this.config = config;
  }

  /**
   * 初始化验证器
   */
  async initialize(): Promise<void> {
    // 初始化验证规则
  }

  /**
   * 验证资源
   */
  async validateResource(resource: EnterpriseResource): Promise<ValidationResult> {
    const errors: ResourceValidationError[] = [];
    const warnings: ResourceValidationError[] = [];

    // 验证必填字段
    this.validateRequiredFields(resource, errors);
    
    // 验证ID格式
    this.validateId(resource.id, errors);
    
    // 验证类型
    this.validateType(resource.type, errors);
    
    // 验证状态
    this.validateStatus(resource.status, errors);
    
    // 验证标题
    this.validateTitle(resource.title, errors);
    
    // 验证描述
    this.validateDescription(resource.description, errors);
    
    // 验证难度级别
    this.validateDifficulty(resource.difficulty, errors);
    
    // 验证目标用户
    this.validateTargetAudience(resource.targetAudience, errors);
    
    // 验证关键词
    this.validateKeywords(resource.keywords, warnings);
    
    // 验证文件
    this.validateFiles(resource.files, errors);
    
    // 验证日期
    this.validateDates(resource, errors);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证必填字段
   */
  private validateRequiredFields(resource: EnterpriseResource, errors: ResourceValidationError[]): void {
    const requiredFields = ['id', 'type', 'status', 'title', 'description', 'categoryId'];
    
    for (const field of requiredFields) {
      if (!resource[field as keyof EnterpriseResource]) {
        errors.push({
          field,
          message: `${field} is required`,
          code: 'REQUIRED_FIELD_MISSING',
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证ID格式
   */
  private validateId(id: string, errors: ResourceValidationError[]): void {
    if (!id) return;
    
    const idRegex = /^[a-zA-Z0-9-_]+$/;
    if (!idRegex.test(id)) {
      errors.push({
        field: 'id',
        message: 'ID must contain only letters, numbers, hyphens, and underscores',
        code: 'INVALID_ID_FORMAT',
        severity: 'error'
      });
    }
    
    if (id.length > 100) {
      errors.push({
        field: 'id',
        message: 'ID must be less than 100 characters',
        code: 'ID_TOO_LONG',
        severity: 'error'
      });
    }
  }

  /**
   * 验证类型
   */
  private validateType(type: ResourceType, errors: ResourceValidationError[]): void {
    if (!Object.values(ResourceType).includes(type)) {
      errors.push({
        field: 'type',
        message: 'Invalid resource type',
        code: 'INVALID_TYPE',
        severity: 'error'
      });
    }
  }

  /**
   * 验证状态
   */
  private validateStatus(status: ResourceStatus, errors: ResourceValidationError[]): void {
    if (!Object.values(ResourceStatus).includes(status)) {
      errors.push({
        field: 'status',
        message: 'Invalid resource status',
        code: 'INVALID_STATUS',
        severity: 'error'
      });
    }
  }

  /**
   * 验证标题
   */
  private validateTitle(title: Record<string, string>, errors: ResourceValidationError[]): void {
    if (!title || typeof title !== 'object') {
      errors.push({
        field: 'title',
        message: 'Title must be an object with language keys',
        code: 'INVALID_TITLE_FORMAT',
        severity: 'error'
      });
      return;
    }

    for (const locale of this.config.supportedLanguages) {
      const titleText = title[locale];
      if (!titleText || typeof titleText !== 'string') {
        errors.push({
          field: 'title',
          message: `Title for locale ${locale} is required`,
          code: 'MISSING_TITLE_LOCALE',
          severity: 'error'
        });
        continue;
      }

      if (titleText.length > 200) {
        errors.push({
          field: 'title',
          message: `Title for locale ${locale} is too long (max 200 characters)`,
          code: 'TITLE_TOO_LONG',
          severity: 'error'
        });
      }

      if (titleText.length < 5) {
        errors.push({
          field: 'title',
          message: `Title for locale ${locale} is too short (min 5 characters)`,
          code: 'TITLE_TOO_SHORT',
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证描述
   */
  private validateDescription(description: Record<string, string>, errors: ResourceValidationError[]): void {
    if (!description || typeof description !== 'object') {
      errors.push({
        field: 'description',
        message: 'Description must be an object with language keys',
        code: 'INVALID_DESCRIPTION_FORMAT',
        severity: 'error'
      });
      return;
    }

    for (const locale of this.config.supportedLanguages) {
      const descText = description[locale];
      if (!descText || typeof descText !== 'string') {
        errors.push({
          field: 'description',
          message: `Description for locale ${locale} is required`,
          code: 'MISSING_DESCRIPTION_LOCALE',
          severity: 'error'
        });
        continue;
      }

      if (descText.length > 1000) {
        errors.push({
          field: 'description',
          message: `Description for locale ${locale} is too long (max 1000 characters)`,
          code: 'DESCRIPTION_TOO_LONG',
          severity: 'error'
        });
      }

      if (descText.length < 10) {
        errors.push({
          field: 'description',
          message: `Description for locale ${locale} is too short (min 10 characters)`,
          code: 'DESCRIPTION_TOO_SHORT',
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证难度级别
   */
  private validateDifficulty(difficulty: DifficultyLevel, errors: ResourceValidationError[]): void {
    if (!Object.values(DifficultyLevel).includes(difficulty)) {
      errors.push({
        field: 'difficulty',
        message: 'Invalid difficulty level',
        code: 'INVALID_DIFFICULTY',
        severity: 'error'
      });
    }
  }

  /**
   * 验证目标用户
   */
  private validateTargetAudience(targetAudience: TargetAudience[], errors: ResourceValidationError[]): void {
    if (!Array.isArray(targetAudience)) {
      errors.push({
        field: 'targetAudience',
        message: 'Target audience must be an array',
        code: 'INVALID_TARGET_AUDIENCE_FORMAT',
        severity: 'error'
      });
      return;
    }

    if (targetAudience.length === 0) {
      errors.push({
        field: 'targetAudience',
        message: 'At least one target audience is required',
        code: 'EMPTY_TARGET_AUDIENCE',
        severity: 'error'
      });
    }

    for (const audience of targetAudience) {
      if (!Object.values(TargetAudience).includes(audience)) {
        errors.push({
          field: 'targetAudience',
          message: `Invalid target audience: ${audience}`,
          code: 'INVALID_TARGET_AUDIENCE',
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证关键词
   */
  private validateKeywords(keywords: Record<string, string[]>, warnings: ResourceValidationError[]): void {
    if (!keywords || typeof keywords !== 'object') {
      warnings.push({
        field: 'keywords',
        message: 'Keywords should be provided for better searchability',
        code: 'MISSING_KEYWORDS',
        severity: 'warning'
      });
      return;
    }

    for (const locale of this.config.supportedLanguages) {
      const keywordList = keywords[locale];
      if (!keywordList || !Array.isArray(keywordList)) {
        warnings.push({
          field: 'keywords',
          message: `Keywords for locale ${locale} should be an array`,
          code: 'INVALID_KEYWORDS_FORMAT',
          severity: 'warning'
        });
        continue;
      }

      if (keywordList.length === 0) {
        warnings.push({
          field: 'keywords',
          message: `Keywords for locale ${locale} are empty`,
          code: 'EMPTY_KEYWORDS',
          severity: 'warning'
        });
      }

      if (keywordList.length > 20) {
        warnings.push({
          field: 'keywords',
          message: `Too many keywords for locale ${locale} (max 20)`,
          code: 'TOO_MANY_KEYWORDS',
          severity: 'warning'
        });
      }
    }
  }

  /**
   * 验证文件
   */
  private validateFiles(files: Record<string, any>, errors: ResourceValidationError[]): void {
    if (!files || typeof files !== 'object') {
      return; // 文件是可选的
    }

    for (const [fileKey, fileInfo] of Object.entries(files)) {
      if (!fileInfo.url || typeof fileInfo.url !== 'string') {
        errors.push({
          field: 'files',
          message: `File ${fileKey} must have a valid URL`,
          code: 'INVALID_FILE_URL',
          severity: 'error'
        });
      }

      if (!fileInfo.mimeType || typeof fileInfo.mimeType !== 'string') {
        errors.push({
          field: 'files',
          message: `File ${fileKey} must have a valid MIME type`,
          code: 'INVALID_FILE_MIME_TYPE',
          severity: 'error'
        });
      }

      if (fileInfo.size && fileInfo.size > this.config.maxFileSize) {
        errors.push({
          field: 'files',
          message: `File ${fileKey} exceeds maximum size limit`,
          code: 'FILE_TOO_LARGE',
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证日期
   */
  private validateDates(resource: EnterpriseResource, errors: ResourceValidationError[]): void {
    const now = new Date();
    
    if (resource.publishDate && resource.publishDate > now) {
      errors.push({
        field: 'publishDate',
        message: 'Publish date cannot be in the future',
        code: 'INVALID_PUBLISH_DATE',
        severity: 'error'
      });
    }

    if (resource.expiryDate && resource.expiryDate < now) {
      errors.push({
        field: 'expiryDate',
        message: 'Expiry date cannot be in the past',
        code: 'INVALID_EXPIRY_DATE',
        severity: 'error'
      });
    }

    if (resource.publishDate && resource.expiryDate && resource.publishDate > resource.expiryDate) {
      errors.push({
        field: 'expiryDate',
        message: 'Expiry date must be after publish date',
        code: 'INVALID_DATE_ORDER',
        severity: 'error'
      });
    }
  }
} 