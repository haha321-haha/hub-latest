/**
 * URL配置中心 - 统一管理所有URL
 * 防止硬编码URL的产生
 */

// 环境变量配置
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';

// URL配置对象
export const URL_CONFIG = {
  // 基础URL
  baseUrl: BASE_URL,
  
  // 主要页面URL
  pages: {
    home: BASE_URL,
    zh: `${BASE_URL}/zh`,
    en: `${BASE_URL}/en`,
    articles: `${BASE_URL}/articles`,
    interactiveTools: `${BASE_URL}/interactive-tools`,
    healthGuide: `${BASE_URL}/health-guide`,
    teenHealth: `${BASE_URL}/teen-health`,
    scenarioSolutions: `${BASE_URL}/scenario-solutions`,
    naturalTherapies: `${BASE_URL}/natural-therapies`,
    specialTherapies: `${BASE_URL}/special-therapies`,
    culturalCharms: `${BASE_URL}/cultural-charms`,
    immediateRelief: `${BASE_URL}/immediate-relief`,
    downloads: `${BASE_URL}/downloads`,
    privacyPolicy: `${BASE_URL}/privacy-policy`,
    termsOfService: `${BASE_URL}/terms-of-service`,
    medicalDisclaimer: `${BASE_URL}/medical-disclaimer`,
  },
  
  // 资源URL
  assets: {
    logo: `${BASE_URL}/logo.png`,
    ogImage: `${BASE_URL}/og-image.jpg`,
    twitterImage: `${BASE_URL}/twitter-image.jpg`,
    favicon: `${BASE_URL}/favicon.ico`,
    icon512: `${BASE_URL}/icon-512.png`,
  },
  
  // API端点
  api: {
    indexnow: `${BASE_URL}/api/indexnow`,
    sitemap: `${BASE_URL}/sitemap.xml`,
    robots: `${BASE_URL}/robots.txt`,
  },
  
  // 工具函数
  getUrl: (path: string) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
  getCanonicalUrl: (path: string) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
  getPageUrl: (locale: string, path: string) => `${BASE_URL}/${locale}${path.startsWith('/') ? path : `/${path}`}`,
};

// 验证URL格式的函数
export const validateUrl = (url: string): boolean => {
  return url.startsWith(BASE_URL);
};

// 检查是否包含硬编码URL的函数
export const checkHardcodedUrl = (content: string): string[] => {
  const hardcodedPatterns = [
    /https:\/\/periodhub\.health/g,
    /https:\/\/www\.periodhub\.health/g,
  ];
  
  const matches: string[] = [];
  hardcodedPatterns.forEach(pattern => {
    const found = content.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });
  
  return matches;
};

export default URL_CONFIG;
