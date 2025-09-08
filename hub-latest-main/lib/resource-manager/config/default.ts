/**
 * Period Hub Resource Manager Default Configuration
 * 资源管理器默认配置
 */

import { ResourceManagerConfig } from '../types';

export const defaultConfig: ResourceManagerConfig = {
  cacheEnabled: true,
  cacheTimeout: 3600, // 1小时
  validationEnabled: true,
  statsEnabled: true,
  seoEnabled: true,
  accessControlEnabled: false, // 免费版不需要复杂的权限控制
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'application/pdf',
    'text/html',
    'text/plain',
    'application/json',
    'image/jpeg',
    'image/png',
    'image/svg+xml'
  ],
  defaultLanguage: 'zh' as const,
  supportedLanguages: ['zh', 'en'] as const
};

export const developmentConfig: ResourceManagerConfig = {
  ...defaultConfig,
  cacheEnabled: false, // 开发环境禁用缓存
  validationEnabled: true,
  statsEnabled: false // 开发环境禁用统计
};

export const productionConfig: ResourceManagerConfig = {
  ...defaultConfig,
  cacheEnabled: true,
  cacheTimeout: 7200, // 2小时
  validationEnabled: true,
  statsEnabled: true,
  seoEnabled: true
}; 