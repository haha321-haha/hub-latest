/**
 * 智能搜索系统主入口
 * 提供统一的搜索服务API
 */

export * from './types';
export * from './engines/UnifiedSearchEngine';
export * from './engines/KeywordSearchEngine';
export * from './engines/FuzzySearchEngine';
export * from './engines/SemanticSearchEngine';
export * from './engines/ResultFusionEngine';

// 创建默认的搜索引擎实例
import { UnifiedSearchEngine } from './engines/UnifiedSearchEngine';
import { UnifiedSearchConfig } from './types';

// 默认配置
const defaultConfig: Partial<UnifiedSearchConfig> = {
  scope: ['all'],
  mode: 'instant',
  personalization: false, // 初始阶段关闭个性化
  maxResults: 20,
  groupByType: true,
  debounceMs: 300,
  enableCache: true,
  cacheTimeout: 300000 // 5分钟
};

// 全局搜索引擎实例
let globalSearchEngine: UnifiedSearchEngine | null = null;

/**
 * 获取全局搜索引擎实例
 */
export function getSearchEngine(config?: Partial<UnifiedSearchConfig>): UnifiedSearchEngine {
  if (!globalSearchEngine) {
    globalSearchEngine = new UnifiedSearchEngine({
      ...defaultConfig,
      ...config
    });
  }
  return globalSearchEngine;
}

/**
 * 重置搜索引擎实例
 */
export function resetSearchEngine(): void {
  globalSearchEngine = null;
}

/**
 * 便捷的搜索函数
 */
export async function search(query: string, options?: any) {
  const engine = getSearchEngine();
  return await engine.search({
    query,
    ...options
  });
}

/**
 * 便捷的建议函数
 */
export async function suggest(query: string, limit?: number) {
  const engine = getSearchEngine();
  return await engine.suggest(query, limit);
}

/**
 * 便捷的推荐函数
 */
export async function getRecommendations(userId: string, limit?: number) {
  const engine = getSearchEngine();
  return await engine.getRecommendations(userId, limit);
} 