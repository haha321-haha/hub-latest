// lib/pdf-resources/utils/id-mapper.ts

import { ResourceCategory, SupportedLanguage } from '../types/resource-types';
// import { LEGACY_ID_MAPPING } from '../../../config/resources/pdf-resources.config';

// 临时定义，直到配置文件创建
const LEGACY_ID_MAPPING: Record<string, string> = {};

/**
 * ID映射规则接口
 */
interface IDMappingRule {
  id: string;
  name: string;
  pattern: RegExp;
  transform: (match: RegExpMatchArray) => string;
  description: string;
  examples: Array<{ input: string; output: string }>;
}

/**
 * ID生成选项
 */
interface IDGenerationOptions {
  category?: ResourceCategory;
  language?: SupportedLanguage;
  version?: string;
  suffix?: string;
  prefix?: string;
  maxLength?: number;
  includeTimestamp?: boolean;
  includeHash?: boolean;
}

/**
 * ID验证结果
 */
interface IDValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  normalizedId?: string;
}

/**
 * ID映射统计
 */
interface IDMappingStats {
  totalMappings: number;
  legacyMappings: number;
  brokenMappings: number;
  duplicateMappings: number;
  unusedMappings: number;
  mappingsByType: Record<string, number>;
}

/**
 * ID映射工具类
 */
export class IDMapper {
  private static instance: IDMapper;
  private mappingRules: Map<string, IDMappingRule> = new Map();
  private reverseMappings: Map<string, string[]> = new Map();
  private cache: Map<string, string> = new Map();

  constructor() {
    this.initializeDefaultRules();
    this.buildReverseMappings();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): IDMapper {
    if (!IDMapper.instance) {
      IDMapper.instance = new IDMapper();
    }
    return IDMapper.instance;
  }

  /**
   * 映射ID (Legacy ID -> Modern ID)
   */
  mapId(legacyId: string): string | null {
    // 1. 检查缓存
    if (this.cache.has(legacyId)) {
      return this.cache.get(legacyId)!;
    }

    // 2. 检查直接映射
    const directMapping = LEGACY_ID_MAPPING[legacyId as keyof typeof LEGACY_ID_MAPPING];
    if (directMapping) {
      this.cache.set(legacyId, directMapping);
      return directMapping;
    }

    // 3. 应用映射规则
    for (const rule of this.mappingRules.values()) {
      const match = legacyId.match(rule.pattern);
      if (match) {
        const modernId = rule.transform(match);
        this.cache.set(legacyId, modernId);
        return modernId;
      }
    }

    // 4. 如果是有效的现代ID，直接返回
    if (this.isValidModernId(legacyId)) {
      this.cache.set(legacyId, legacyId);
      return legacyId;
    }

    return null;
  }

  /**
   * 反向映射 (Modern ID -> Legacy IDs)
   */
  reverseMapId(modernId: string): string[] {
    const legacyIds: string[] = [];

    // 1. 检查反向映射缓存
    if (this.reverseMappings.has(modernId)) {
      legacyIds.push(...this.reverseMappings.get(modernId)!);
    }

    // 2. 检查直接映射的反向
    for (const [legacyId, mappedId] of Object.entries(LEGACY_ID_MAPPING)) {
      if (mappedId === modernId && !legacyIds.includes(legacyId)) {
        legacyIds.push(legacyId);
      }
    }

    return legacyIds;
  }

  /**
   * 生成新的现代ID
   */
  generateId(
    baseName: string,
    options: IDGenerationOptions = {}
  ): string {
    // 1. 标准化基础名称
    let normalizedBase = this.normalizeBaseName(baseName);

    // 2. 添加前缀
    if (options.prefix) {
      normalizedBase = `${options.prefix}-${normalizedBase}`;
    }

    // 3. 添加类别前缀
    if (options.category) {
      const categoryPrefix = this.getCategoryPrefix(options.category);
      normalizedBase = `${categoryPrefix}-${normalizedBase}`;
    }

    // 4. 添加语言后缀
    if (options.language && options.language !== 'zh') {
      normalizedBase = `${normalizedBase}-${options.language}`;
    }

    // 5. 添加版本号
    if (options.version) {
      normalizedBase = `${normalizedBase}-v${options.version.replace(/\./g, '-')}`;
    }

    // 6. 添加时间戳
    if (options.includeTimestamp) {
      const timestamp = new Date().toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      normalizedBase = `${normalizedBase}-${timestamp}`;
    }

    // 7. 添加哈希
    if (options.includeHash) {
      const hash = this.generateShortHash(normalizedBase);
      normalizedBase = `${normalizedBase}-${hash}`;
    }

    // 8. 添加自定义后缀
    if (options.suffix) {
      normalizedBase = `${normalizedBase}-${options.suffix}`;
    }

    // 9. 确保长度限制
    const maxLength = options.maxLength || 100;
    if (normalizedBase.length > maxLength) {
      normalizedBase = this.truncateId(normalizedBase, maxLength);
    }

    // 10. 确保唯一性
    return this.ensureUniqueness(normalizedBase);
  }

  /**
   * 批量映射ID
   */
  batchMapIds(legacyIds: string[]): Record<string, string | null> {
    const results: Record<string, string | null> = {};
    
    for (const legacyId of legacyIds) {
      results[legacyId] = this.mapId(legacyId);
    }

    return results;
  }

  /**
   * 验证ID格式
   */
  validateId(id: string): IDValidationResult {
    const result: IDValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // 1. 基础格式检查
    if (!id || id.trim().length === 0) {
      result.isValid = false;
      result.errors.push('ID不能为空');
      return result;
    }

    // 2. 长度检查
    if (id.length < 3) {
      result.isValid = false;
      result.errors.push('ID长度不能少于3个字符');
    }

    if (id.length > 100) {
      result.isValid = false;
      result.errors.push('ID长度不能超过100个字符');
    }

    // 3. 字符检查
    if (!/^[a-z0-9\-]+$/.test(id)) {
      result.isValid = false;
      result.errors.push('ID只能包含小写字母、数字和连字符');
      result.suggestions.push('使用normalizeId()方法标准化ID');
    }

    // 4. 格式规范检查
    if (id.startsWith('-') || id.endsWith('-')) {
      result.isValid = false;
      result.errors.push('ID不能以连字符开头或结尾');
    }

    if (id.includes('--')) {
      result.warnings.push('ID包含连续连字符，建议避免');
      result.suggestions.push('移除多余的连字符');
    }

    // 5. 语义检查
    if (id.split('-').length > 8) {
      result.warnings.push('ID分段过多，建议简化');
      result.suggestions.push('减少连字符分段，保持简洁');
    }

    // 6. 生成规范化建议
    if (!result.isValid || result.warnings.length > 0) {
      result.normalizedId = this.normalizeId(id);
    }

    return result;
  }

  /**
   * 标准化ID
   */
  normalizeId(id: string): string {
    return id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-\s]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格转连字符
      .replace(/-+/g, '-') // 多个连字符合并
      .replace(/^-+|-+$/g, ''); // 移除首尾连字符
  }

  /**
   * 查找相似ID
   */
  findSimilarIds(targetId: string, threshold: number = 0.7): Array<{
    id: string;
    similarity: number;
    type: 'legacy' | 'modern';
  }> {
    const similar: Array<{ id: string; similarity: number; type: 'legacy' | 'modern' }> = [];

    // 搜索Legacy映射
    for (const legacyId of Object.keys(LEGACY_ID_MAPPING)) {
      const similarity = this.calculateSimilarity(targetId, legacyId);
      if (similarity >= threshold) {
        similar.push({ id: legacyId, similarity, type: 'legacy' });
      }
    }

    // 搜索现代ID
    for (const modernId of Object.values(LEGACY_ID_MAPPING)) {
      const similarity = this.calculateSimilarity(targetId, modernId);
      if (similarity >= threshold) {
        similar.push({ id: modernId, similarity, type: 'modern' });
      }
    }

    // 按相似度排序
    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * 获取映射统计信息
   */
  getMappingStats(): IDMappingStats {
    const stats: IDMappingStats = {
      totalMappings: 0,
      legacyMappings: 0,
      brokenMappings: 0,
      duplicateMappings: 0,
      unusedMappings: 0,
      mappingsByType: {}
    };

    // 统计Legacy映射
    stats.legacyMappings = Object.keys(LEGACY_ID_MAPPING).length;
    stats.totalMappings = stats.legacyMappings;

    // 统计映射类型
    for (const [legacyId, modernId] of Object.entries(LEGACY_ID_MAPPING)) {
      const type = this.inferMappingType(legacyId, modernId);
      stats.mappingsByType[type] = (stats.mappingsByType[type] || 0) + 1;
    }

    return stats;
  }

  /**
   * 添加自定义映射规则
   */
  addMappingRule(rule: IDMappingRule): void {
    this.mappingRules.set(rule.id, rule);
    this.clearCache();
  }

  /**
   * 移除映射规则
   */
  removeMappingRule(ruleId: string): boolean {
    const removed = this.mappingRules.delete(ruleId);
    if (removed) {
      this.clearCache();
    }
    return removed;
  }

  /**
   * 获取所有映射规则
   */
  getMappingRules(): IDMappingRule[] {
    return Array.from(this.mappingRules.values());
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 导出映射配置
   */
  exportMappings(): {
    legacyMappings: Record<string, string>;
    rules: IDMappingRule[];
    metadata: {
      exportDate: string;
      totalMappings: number;
      version: string;
    };
  } {
    return {
      legacyMappings: { ...LEGACY_ID_MAPPING },
      rules: this.getMappingRules(),
      metadata: {
        exportDate: new Date().toISOString(),
        totalMappings: Object.keys(LEGACY_ID_MAPPING).length,
        version: '1.0.0'
      }
    };
  }

  private initializeDefaultRules(): void {
    // PDF编号格式映射规则
    this.addMappingRule({
      id: 'pdf_numbered_pattern',
      name: 'PDF编号格式映射',
      pattern: /^(immediate|preparation|learning|management)-pdf-(\d+)$/,
      transform: (match) => {
        const [, category, number] = match;
        const categoryMap: Record<string, string> = {
          'immediate': 'immediate-relief',
          'preparation': 'preparation',
          'learning': 'learning',
          'management': 'management'
        };
        return `${categoryMap[category]}-guide-${number}`;
      },
      description: '将旧的PDF编号格式转换为新的命名格式',
      examples: [
        { input: 'immediate-pdf-1', output: 'immediate-relief-guide-1' },
        { input: 'learning-pdf-3', output: 'learning-guide-3' }
      ]
    });

    // 类别缩写映射规则
    this.addMappingRule({
      id: 'category_abbreviation',
      name: '类别缩写映射',
      pattern: /^(imm|prep|learn|mgmt)-(.+)$/,
      transform: (match) => {
        const [, abbrev, rest] = match;
        const abbreviationMap: Record<string, string> = {
          'imm': 'immediate-relief',
          'prep': 'preparation',
          'learn': 'learning',
          'mgmt': 'management'
        };
        return `${abbreviationMap[abbrev]}-${rest}`;
      },
      description: '将类别缩写扩展为完整名称',
      examples: [
        { input: 'imm-pain-relief', output: 'immediate-relief-pain-relief' },
        { input: 'prep-nutrition', output: 'preparation-nutrition' }
      ]
    });

    // 版本号标准化规则
    this.addMappingRule({
      id: 'version_normalization',
      name: '版本号标准化',
      pattern: /^(.+)[-_]v?(\d+)\.?(\d*)\.?(\d*)$/,
      transform: (match) => {
        const [, base, major, minor = '0', patch = '0'] = match;
        const normalizedBase = this.normalizeBaseName(base);
        return `${normalizedBase}-v${major}-${minor}-${patch}`;
      },
      description: '标准化版本号格式',
      examples: [
        { input: 'guide_v2.1', output: 'guide-v2-1-0' },
        { input: 'manual-v1', output: 'manual-v1-0-0' }
      ]
    });
  }

  private buildReverseMappings(): void {
    this.reverseMappings.clear();
    
    for (const [legacyId, modernId] of Object.entries(LEGACY_ID_MAPPING)) {
      if (!this.reverseMappings.has(modernId)) {
        this.reverseMappings.set(modernId, []);
      }
      this.reverseMappings.get(modernId)!.push(legacyId);
    }
  }

  private isValidModernId(id: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) && 
           id.length >= 3 && 
           id.length <= 100;
  }

  private normalizeBaseName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s\-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getCategoryPrefix(category: ResourceCategory): string {
    const prefixMap: Record<ResourceCategory, string> = {
      'immediate-relief': 'immediate',
      'preparation': 'prep',
      'learning': 'learn',
      'management': 'mgmt',
      'assessment': 'assess',
      'template': 'template'
    };
    return prefixMap[category] || category;
  }

  private generateShortHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  }

  private truncateId(id: string, maxLength: number): string {
    if (id.length <= maxLength) return id;

    // 尝试在连字符处截断
    const parts = id.split('-');
    let truncated = '';
    
    for (const part of parts) {
      if ((truncated + '-' + part).length <= maxLength) {
        truncated = truncated ? `${truncated}-${part}` : part;
      } else {
        break;
      }
    }

    // 如果截断后太短，直接截取
    if (truncated.length < maxLength * 0.7) {
      truncated = id.substring(0, maxLength - 3) + '...';
    }

    return truncated;
  }

  private ensureUniqueness(baseId: string): string {
    // 这里应该检查现有资源，为简化直接返回
    // 在实际应用中，应该查询数据库确保唯一性
    return baseId;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // 使用Levenshtein距离计算相似度
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLength = Math.max(len1, len2);
    return (maxLength - matrix[len2][len1]) / maxLength;
  }

  private inferMappingType(legacyId: string, modernId: string): string {
    if (legacyId.includes('pdf')) return 'pdf-mapping';
    if (legacyId.includes('-1') || legacyId.includes('-2')) return 'numbered-mapping';
    if (legacyId.length < modernId.length) return 'expansion-mapping';
    return 'standard-mapping';
  }
}

/**
 * ID映射工具函数
 */
export const idMapper = IDMapper.getInstance();

/**
 * 快捷映射函数
 */
export function mapLegacyId(legacyId: string): string | null {
  return idMapper.mapId(legacyId);
}

/**
 * 快捷ID生成函数
 */
export function generateResourceId(
  baseName: string,
  category?: ResourceCategory,
  options?: Omit<IDGenerationOptions, 'category'>
): string {
  return idMapper.generateId(baseName, { ...options, category });
}

/**
 * 快捷ID验证函数
 */
export function validateResourceId(id: string): IDValidationResult {
  return idMapper.validateId(id);
}

/**
 * 快捷ID标准化函数
 */
export function normalizeResourceId(id: string): string {
  return idMapper.normalizeId(id);
}