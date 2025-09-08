/**
 * Period Hub Resource Manager Factory
 * 资源管理器工厂函数
 */

import { ResourceManager } from '../core/ResourceManager';
import { ResourceManagerConfig } from '../types';
import { defaultConfig, developmentConfig, productionConfig } from '../config/default';

/**
 * 创建资源管理器实例
 */
export function createResourceManager(
  environment: 'development' | 'production' | 'custom' = 'development',
  customConfig?: Partial<ResourceManagerConfig>
): ResourceManager {
  let config: ResourceManagerConfig;

  switch (environment) {
    case 'development':
      config = developmentConfig;
      break;
    case 'production':
      config = productionConfig;
      break;
    case 'custom':
      config = customConfig ? { ...defaultConfig, ...customConfig } : defaultConfig;
      break;
    default:
      config = defaultConfig;
  }

  return new ResourceManager(config);
}

/**
 * 快速创建开发环境资源管理器
 */
export function createDevelopmentResourceManager(): ResourceManager {
  return createResourceManager('development');
}

/**
 * 快速创建生产环境资源管理器
 */
export function createProductionResourceManager(): ResourceManager {
  return createResourceManager('production');
}

/**
 * 创建自定义配置的资源管理器
 */
export function createCustomResourceManager(
  config: Partial<ResourceManagerConfig>
): ResourceManager {
  return createResourceManager('custom', config);
} 