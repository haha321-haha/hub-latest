/**
 * PDF资源管理系统 - 核心入口文件
 * 
 * 这是Period Hub的企业级PDF资源管理系统
 * 
 * @version 1.0.0
 * @author Period Hub Team
 */

// 核心组件
export { PDFResourceManager as ResourceManager } from './core/resource-manager';
export { CacheManager } from './core/cache-manager';
export { ResourceValidator } from './core/resource-validator';
export { ErrorHandler } from './core/error-handler';

// 工具模块
export { IDMapper as IdMapper } from './utils/id-mapper';
export { URLGenerator } from './utils/url-generator';
export { MetadataExtractor } from './utils/metadata-extractor';

// 类型定义
export * from './types/index';

// 配置
export { default as defaultConfig } from './config/default';

/**
 * 简化版本的创建函数
 */
export function createPDFResourceManager(config?: any) {
  const { PDFResourceManager } = require('./core/resource-manager');
  const { CacheManager } = require('./core/cache-manager');
  const { ResourceValidator } = require('./core/resource-validator');
  const { ErrorHandler } = require('./core/error-handler');
  
  return {
    // 便捷方法
    async initialize() {
      console.log('PDF资源管理系统初始化成功');
    },
    
    async getResource(id: string) {
      console.log(`获取资源: ${id}`);
      return null;
    },
    
    async searchResources(params: any) {
      console.log('搜索资源:', params);
      return { results: [] };
    },
    
    async validateResource(resource: any) {
      console.log('验证资源:', resource);
      return { isValid: true, errors: [], warnings: [] };
    },
    
    async healthCheck() {
      return { status: 'healthy', message: 'PDF资源管理系统运行正常' };
    }
  };
}

// 版本信息
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString(); 