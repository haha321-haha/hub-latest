/**
 * Period Hub Enterprise Resource Manager
 * 企业级资源管理器主入口文件
 */

// 核心类型
export * from './types';

// 核心类
export { ResourceManager } from './core/ResourceManager';
export { CacheManager } from './cache/CacheManager';
export { ResourceValidator } from './validation/ResourceValidator';
export { AnalyticsEngine } from './analytics/AnalyticsEngine';

// 配置
export { defaultConfig, developmentConfig, productionConfig } from './config/default';

// 实用工具
export { createResourceManager } from './utils/factory';

// 版本信息
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString(); 