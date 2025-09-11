import './globals.css';
import { Metadata, Viewport } from 'next';
import { Noto_Sans_SC } from 'next/font/google';
// import ClientSafe from '@/components/ClientSafe';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});
import { WebVitalsReporter } from '@/components/WebVitalsReporter';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// 🚀 Core Web Vitals 优化的根布局
export const metadata: Metadata = {
  metadataBase: new URL('https://www.periodhub.health'),
  title: {
    default: 'PeriodHub - 专业痛经缓解方法和月经健康管理平台',
    template: '%s | PeriodHub'
  },
  description: '提供42篇专业文章、24个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。',
  keywords: [
    // 高搜索量核心词
    '痛经怎么缓解最快方法', '痛经吃什么药最有效', '月经推迟几天算正常', '月经量少是什么原因',
    // 品牌核心词
    '痛经缓解', '月经疼痛', '经期健康', '女性健康', '月经健康管理', '经期疼痛怎么办', '中医调理',
    // 英文关键词
    'menstrual cramps relief', 'period pain remedies', 'how to stop period pain', 'natural period pain relief'
  ],
  authors: [{ name: 'PeriodHub Team' }],
  creator: 'PeriodHub',
  publisher: 'PeriodHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.periodhub.health',
    siteName: 'PeriodHub',
    title: 'PeriodHub - 专业女性健康管理平台',
    description: '专业的女性月经健康管理平台，提供中西医结合的痛经解决方案。',
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'PeriodHub - 专业女性健康管理平台',
    description: '专业的女性月经健康管理平台，提供中西医结合的痛经解决方案。',
  },
  // 移动端优化 - 已移至单独的 viewport 导出
  // 性能优化
  other: {
    'theme-color': '#9333ea',
    'color-scheme': 'light',
  },
};

// 🚀 移动端优化 - Next.js 推荐的 viewport 配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// 根级别layout - 必须包含html和body标签
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-scroll-behavior="smooth">
      <head>
        {/* 🚀 性能优化 - DNS 预解析 */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.clarity.ms" />
        
        {/* 🚀 性能优化 - 预连接关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 📱 移动端优化 - 防止缩放闪烁 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 🔍 搜索引擎优化 */}
        <meta name="google-site-verification" content="1cZ9WUBHeRB2lMoPes66cXWCTkycozosPw4_PnNMoGk" />
        <meta name="msvalidate.01" content="12D5EA89A249696AACD3F155B64C5E56" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* 🎨 主题和图标 */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 📊 Google Analytics 4 - 异步加载优化 */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-YOUR_GA_ID', {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* 📊 Microsoft Clarity - 延迟加载 */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "ssdsoc827u");
              `,
            }}
          />
        )}
        
        {/* 💰 Google AdSense - 延迟加载 */}
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5773162579508714"
            crossOrigin="anonymous"
          />
        )}
        
        {/* 🚀 性能优化 - 关键CSS内联 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 关键CSS - 防止布局偏移 */
            html { scroll-behavior: smooth; }
            body { 
              margin: 0; 
              font-family: "Noto Sans SC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }
            * { box-sizing: border-box; }
            img, video { max-width: 100%; height: auto; }
          `
        }} />
      </head>
      <body className={notoSansSC.className}>
        {children}
        
        {/* 🚀 SEO优化 - Core Web Vitals监控 */}
        <WebVitalsReporter />
        
        {/* 🚀 SEO优化 - 性能监控 */}
        <PerformanceMonitor />
        
      </body>
    </html>
  );
}
