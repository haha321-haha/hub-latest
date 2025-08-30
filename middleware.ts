import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  // 🚀 性能优化：自动检测用户语言偏好
  localeDetection: true,
  // 🔧 可选：设置默认行为更精确控制
  alternateLinks: false, // 如果不需要自动生成alternate links
});

export default function middleware(request: NextRequest) {
  // 完全依赖next-intl的自动重定向机制
  // next-intl会自动处理 / -> /zh 的重定向，状态码统一为302
  // 🎯 双重保险：主方案依赖next-intl，备用方案在app/page.tsx
  return intlMiddleware(request);
}

// 避免在静态资源与内部路径上运行中间件
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)']
};


