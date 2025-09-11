/**
 * 统一Canonical URL配置
 * 解决Google Search Console重复网页问题
 */

// 统一的基础URL - 使用www版本
export const CANONICAL_BASE_URL = 'https://www.periodhub.health';

// 生成canonical URL的函数
export function getCanonicalUrl(locale: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanLocale = locale === 'zh' ? 'zh' : 'en';
  
  // 对于根路径，直接返回语言版本
  if (path === '' || path === '/') {
    return `${CANONICAL_BASE_URL}/${cleanLocale}`;
  }
  
  return `${CANONICAL_BASE_URL}/${cleanLocale}${cleanPath}`;
}

// 生成hreflang URLs的函数
export function getHreflangUrls(path: string = '') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return {
    'zh-CN': `${CANONICAL_BASE_URL}/zh${cleanPath}`,
    'en-US': `${CANONICAL_BASE_URL}/en${cleanPath}`,
    'x-default': `${CANONICAL_BASE_URL}/zh${cleanPath}`, // 默认中文版本
  };
}

// 验证URL是否规范
export function isCanonicalUrl(url: string): boolean {
  return url.startsWith(CANONICAL_BASE_URL);
}

// 获取页面的规范URL（用于重复内容检测）
export function getPageCanonicalUrl(locale: string, path: string): string {
  // 特殊页面的规范URL映射
  const canonicalMappings: Record<string, string> = {
    // 交互工具页面
    '/interactive-tools/symptom-tracker': '/interactive-tools/symptom-tracker',
    '/interactive-tools': '/interactive-tools',
    '/interactive-tools/pain-tracker': '/interactive-tools/pain-tracker',
    '/interactive-tools/symptom-assessment': '/interactive-tools/symptom-assessment',
    '/interactive-tools/constitution-test': '/interactive-tools/constitution-test',
    '/interactive-tools/cycle-tracker': '/interactive-tools/cycle-tracker',
    '/interactive-tools/period-pain-assessment': '/interactive-tools/period-pain-assessment',
    
    // 青少年健康页面
    '/teen-health': '/teen-health',
    
    // 隐私政策页面
    '/privacy-policy': '/privacy-policy',
    
    // PDF文件页面 - 这些应该被排除在索引之外
    '/pdf-files': '/pdf-files',
  };
  
  const mappedPath = canonicalMappings[path] || path;
  return getCanonicalUrl(locale, mappedPath);
}
