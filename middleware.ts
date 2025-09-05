import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  // 🚀 性能优化：自动检测用户语言偏好
  localeDetection: true,
  // 🔧 可选：设置默认行为更精确控制
  alternateLinks: false, // 如果不需要自动生成alternate links
  // 🔧 SEO优化：使用always确保语言前缀始终存在
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🚨 修复IndexNow索引问题 - 处理无语言前缀的文章URL
  const articleRedirects = [
    'personal-health-profile',
    'pain-complications-management', 
    'health-tracking-and-analysis',
    'evidence-based-pain-guidance',
    'sustainable-health-management',
    'anti-inflammatory-diet-guide',
    'long-term-healthy-lifestyle-guide',
    'period-friendly-recipes',
    'iud-comprehensive-guide'
  ];
  
  // 检查是否是文章URL且缺少语言前缀
  for (const articleSlug of articleRedirects) {
    if (pathname === `/articles/${articleSlug}`) {
      const url = request.nextUrl.clone();
      url.pathname = `/zh/articles/${articleSlug}`;
      return Response.redirect(url, 301);
    }
  }
  
  // 🚨 修复重复内容问题 - 将重复URL重定向到主URL
  if (pathname === '/zh/articles/health-tracking-and-analysis') {
    const url = request.nextUrl.clone();
    url.pathname = '/zh/articles/personal-health-profile';
    return Response.redirect(url, 301);
  }
  
  // 特殊路径的301重定向
  if (pathname === '/teen-health') {
    const url = request.nextUrl.clone();
    url.pathname = '/zh/teen-health';
    return Response.redirect(url, 301);
  }
  
  return intlMiddleware(request);
}

// 避免在静态资源与内部路径上运行中间件
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)']
};


