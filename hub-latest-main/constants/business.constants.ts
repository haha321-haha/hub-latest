// constants/business.constants.ts
// 业务逻辑常量配置

export const BUSINESS_CONSTANTS = {
  // 质量评估阈值
  quality: {
    minContentScore: 6.0,
    minDesignScore: 5.0,
    minAccuracyScore: 7.0,
    minUsefulnessScore: 6.0,
    minOverallScore: 6.5,
    
    // 语言检测置信度
    minLanguageConfidence: 0.5,
    
    // 自动分类置信度
    minCategorizationConfidence: 0.6,
    
    // 内容分析阈值
    minWordCount: 100,
    maxTextLength: 10000
  },
  
  // 文件处理限制
  files: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    minFileSize: 1024, // 1KB
    allowedTypes: ['application/pdf'],
    maxBatchSize: 10,
    
    // 页数估算
    estimatedBytesPerPage: 100000 // 100KB per page
  },
  
  // 内容分析参数
  content: {
    readingSpeed: 200, // words per minute
    complexityThresholds: {
      beginner: 15, // avg words per sentence
      intermediate: 25
    },
    
    // 关键词提取
    maxKeywords: 20,
    minKeywordLength: 2,
    maxKeywordLength: 50
  },
  
  // 搜索配置
  search: {
    maxResults: 50,
    minQueryLength: 2,
    maxQueryLength: 100,
    
    // 搜索权重
    weights: {
      title: 3.0,
      description: 2.0,
      content: 1.0,
      keywords: 2.5
    }
  },
  
  // 缓存配置
  cache: {
    defaultTtl: 3600, // 1 hour in seconds
    searchTtl: 1800,  // 30 minutes
    metadataTtl: 7200, // 2 hours
    maxCacheSize: 1000
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
    minPageSize: 6
  },
  
  // 评分系统
  scoring: {
    baseScore: 5.0,
    maxScore: 10.0,
    minScore: 0.0,
    
    // 质量因子权重
    qualityWeights: {
      content: 0.4,
      design: 0.2,
      file: 0.2,
      usefulness: 0.2
    }
  }
} as const;

export type BusinessConstants = typeof BUSINESS_CONSTANTS;