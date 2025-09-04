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
  // 🔧 SEO优化：使用301永久重定向
  localePrefix: 'as-needed',
});

export default function middleware(request: NextRequest) {
  // 完全依赖next-intl的自动重定向机制
  // next-intl会自动处理 / -> /zh 的重定向，状态码统一为302
  // 🎯 双重保险：主方案依赖next-intl，备用方案在app/page.tsx
  
  // 处理特殊路径的重定向
  const { pathname } = request.nextUrl;
  
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


