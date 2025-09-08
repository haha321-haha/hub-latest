// config/site.config.ts
// 网站核心配置文件

export const SITE_CONFIG = {
  // 网站基本信息
  name: 'Period Hub',
  title: 'Professional Menstrual Health Management Platform',
  description: 'Scientific guidance and caring support to help every woman navigate their menstrual cycle with confidence and health',
  
  // 统计数据 - 从硬编码中提取
  statistics: {
    articles: 42,
    pdfResources: 24,
    interactiveTools: 5,
    supportHours: 24
  },
  
  // 域名和URL配置
  domain: 'periodhub.health',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://periodhub.health' 
    : 'http://localhost:3000',
  
  // 社交媒体和联系信息
  social: {
    email: 'support@periodhub.health',
    twitter: '@periodhub',
    facebook: 'periodhub.health'
  },
  
  // SEO配置
  seo: {
    defaultTitle: 'Period Hub - Professional Menstrual Health Platform',
    titleTemplate: '%s | Period Hub',
    defaultDescription: 'Professional menstrual health management platform with evidence-based guidance',
    keywords: [
      'menstrual health',
      'period pain relief',
      'women health',
      'dysmenorrhea',
      'period management'
    ]
  },
  
  // 功能开关
  features: {
    multiLanguage: true,
    pdfDownloads: true,
    interactiveTools: true,
    userProfiles: false,
    analytics: true
  }
} as const;

export type SiteConfig = typeof SITE_CONFIG;