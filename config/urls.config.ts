// config/urls.config.ts
// URL和路径配置文件

export const URLS_CONFIG = {
  // 内部路由
  routes: {
    home: '/',
    articles: '/articles',
    pdfDownloads: '/pdf-downloads',
    interactiveTools: '/interactive-tools',
    about: '/about',
    contact: '/contact',
    search: '/search'
  },
  
  // API端点
  api: {
    base: '/api',
    articles: '/api/articles',
    pdfs: '/api/pdfs',
    search: '/api/search',
    analytics: '/api/analytics'
  },
  
  // 外部链接
  external: {
    documentation: 'https://docs.periodhub.health',
    support: 'https://support.periodhub.health',
    blog: 'https://blog.periodhub.health'
  },
  
  // 资源路径
  assets: {
    images: '/images',
    pdfs: '/pdfs',
    icons: '/icons',
    uploads: '/uploads'
  },
  
  // CDN配置
  cdn: {
    enabled: process.env.NODE_ENV === 'production',
    baseUrl: 'https://cdn.periodhub.health',
    images: 'https://cdn.periodhub.health/images',
    pdfs: 'https://cdn.periodhub.health/pdfs'
  }
} as const;

export type UrlsConfig = typeof URLS_CONFIG;