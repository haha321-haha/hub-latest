// 生产环境SEO配置
export const seoConfig = {
  domain: 'https://periodhub.com',
  siteName: 'PeriodHub',
  defaultTitle: '经期健康管理专家 | PeriodHub',
  defaultDescription: '科学的经期追踪、健康建议和个性化护理方案，让每个女性都能轻松管理自己的生理周期',
  
  // 社交媒体配置
  social: {
    twitter: '@periodhub',
    facebook: 'periodhub',
    instagram: 'periodhub_official'
  },
  
  // 分析工具配置
  analytics: {
    googleAnalytics: 'GA_MEASUREMENT_ID',
    googleTagManager: 'GTM_CONTAINER_ID',
    microsoftClarity: 'CLARITY_PROJECT_ID',
    baiduAnalytics: 'BAIDU_SITE_ID'
  },
  
  // 搜索引擎验证
  verification: {
    google: 'GOOGLE_SITE_VERIFICATION',
    bing: 'BING_SITE_VERIFICATION',
    baidu: 'BAIDU_SITE_VERIFICATION'
  },
  
  // 性能目标
  performance: {
    LCP: 1200, // ms
    FID: 50,   // ms
    CLS: 0.05, // score
    TTI: 2000  // ms
  }
};

export default seoConfig;