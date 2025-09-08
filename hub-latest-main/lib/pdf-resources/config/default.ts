/**
 * PDF资源管理系统 - 默认配置
 * 
 * 为Period Hub项目提供优化的默认配置
 */

import { SystemConfig } from '../types/index';

const defaultConfig: SystemConfig = {
  // 缓存配置
  cache: {
    enabled: true,
    ttl: 3600, // 1小时
    maxSize: 100, // 最大缓存100个资源
    cleanupInterval: 300 // 5分钟清理一次
  },
  
  // 验证配置
  validation: {
    enabled: true,
    strictMode: false, // 非严格模式，适合单人项目
    requiredFields: ['id', 'title', 'type', 'status'],
    customValidators: []
  },
  
  // 错误处理配置
  errorHandling: {
    enabled: true,
    logLevel: 'warn',
    retryAttempts: 3,
    timeout: 5000 // 5秒超时
  },
  
  // 环境配置
  environment: {
    production: process.env.NODE_ENV === 'production',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || '/pdf-files',
    debugMode: process.env.NODE_ENV === 'development',
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn'
  }
};

export default defaultConfig; 