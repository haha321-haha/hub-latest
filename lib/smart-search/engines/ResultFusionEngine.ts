/**
 * 结果融合引擎
 * 融合多个搜索引擎的结果并进行排序
 */

import { 
  SearchResult, 
  SearchOptions, 
  UnifiedSearchConfig,
  SearchWeights
} from '../types';

export class ResultFusionEngine {
  private config: UnifiedSearchConfig;

  constructor(config: UnifiedSearchConfig) {
    this.config = config;
  }

  /**
   * 融合多个搜索结果
   */
  async fuseResults(
    searchResults: {
      keyword: SearchResult[];
      fuzzy: SearchResult[];
      semantic: SearchResult[];
    },
    options: SearchOptions,
    weights: SearchWeights
  ): Promise<SearchResult[]> {
    const { keyword, fuzzy, semantic } = searchResults;
    
    // 创建结果映射，按ID去重并合并分数
    const resultMap = new Map<string, SearchResult>();
    
    // 处理关键词搜索结果
    this.mergeResults(resultMap, keyword, weights.exact, 'keyword');
    
    // 处理模糊搜索结果
    this.mergeResults(resultMap, fuzzy, weights.fuzzy, 'fuzzy');
    
    // 处理语义搜索结果
    this.mergeResults(resultMap, semantic, weights.semantic, 'semantic');
    
    // 转换为数组并按分数排序
    const fusedResults = Array.from(resultMap.values());
    
    return fusedResults.sort((a, b) => b.score - a.score);
  }

  /**
   * 合并搜索结果
   */
  private mergeResults(
    resultMap: Map<string, SearchResult>,
    results: SearchResult[],
    weight: number,
    source: string
  ): void {
    for (const result of results) {
      const existing = resultMap.get(result.id);
      
      if (existing) {
        // 如果结果已存在，合并分数
        existing.score = Math.max(existing.score, result.score * weight);
        existing.matchedFields = Array.from(new Set([...existing.matchedFields, ...result.matchedFields]));
        existing.highlights = [...existing.highlights, ...result.highlights];
      } else {
        // 新结果，添加到映射中
        resultMap.set(result.id, {
          ...result,
          score: result.score * weight
        });
      }
    }
  }
} 