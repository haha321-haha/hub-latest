/**
 * DataForSEO API配置
 * 专为PeriodHub经期健康项目定制的SEO分析系统
 */

export interface DataForSEOConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export const SEO_CONFIG = {
  // 核心关键词 - 经期健康领域
  primaryKeywords: [
    '痛经缓解',
    '经期健康管理',
    '痛经治疗',
    '经期疼痛',
    '女性健康',
    '痛经自然疗法',
    '经期调理',
    '痛经症状',
    '经期健康指南',
    '痛经预防'
  ],
  
  // 长尾关键词
  longTailKeywords: [
    '痛经快速缓解方法',
    '经期疼痛怎么办',
    '痛经吃什么药',
    '痛经自然疗法有效吗',
    '经期健康食谱',
    '痛经期间注意事项',
    '青少年痛经指导',
    '职场女性痛经应对',
    '痛经与情绪管理',
    '经期睡眠质量提升'
  ],
  
  // 竞争对手域名监控
  competitors: [
    'baidu.com',
    '39.net',
    'familydoctor.com.cn',
    'health.sina.com.cn',
    'xywy.com'
  ],
  
  // 目标市场
  targetMarkets: [
    { country: 'CN', language: 'zh' },
    { country: 'US', language: 'zh' },
    { country: 'CA', language: 'zh' }
  ]
};

export const getDataForSEOConfig = (): DataForSEOConfig => ({
  apiKey: process.env.DATAFORSEO_API_KEY || '',
  baseUrl: 'https://api.dataforseo.com/v3',
  timeout: 30000,
  retryAttempts: 3
});