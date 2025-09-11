import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { Locale, locales } from '@/i18n';
import OptimizedMobilePDFCenter from '@/components/OptimizedMobilePDFCenter';
import { SITE_CONFIG } from '@/config/site.config';
import { pdfResources } from '@/config/pdfResources';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'zh' 
      ? 'PDF资源下载中心 - Period Hub' 
      : 'PDF Resources Download Center - Period Hub',
    description: locale === 'zh'
      ? `Period Hub文章PDF下载中心，${SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources}个精选经期健康资源，包括${SITE_CONFIG.statistics.articles}篇专业文章和${SITE_CONFIG.statistics.pdfResources}个PDF资源，支持中英双语，移动端优化体验。`
      : `Period Hub Articles PDF Download Center, ${SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources} curated menstrual health resources including ${SITE_CONFIG.statistics.articles} expert articles and ${SITE_CONFIG.statistics.pdfResources} PDF resources, bilingual support, mobile-optimized experience.`,
    keywords: locale === 'zh'
      ? ['经期健康', 'PDF下载', '健康资源', '月经管理', '女性健康', '中英双语', '移动优化']
      : ['menstrual health', 'PDF download', 'health resources', 'period management', 'women health', 'bilingual', 'mobile optimized'],
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/downloads`,
    },
    openGraph: {
      title: locale === 'zh' 
        ? 'PDF资源下载中心 - Period Hub' 
        : 'PDF Resources Download Center - Period Hub',
      description: locale === 'zh'
        ? `Period Hub文章PDF下载中心，${SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources}个精选经期健康资源，包括${SITE_CONFIG.statistics.articles}篇专业文章和${SITE_CONFIG.statistics.pdfResources}个PDF资源，支持中英双语，移动端优化体验。`
        : `Period Hub Articles PDF Download Center, ${SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources} curated menstrual health resources including ${SITE_CONFIG.statistics.articles} expert articles and ${SITE_CONFIG.statistics.pdfResources} PDF resources, bilingual support, mobile-optimized experience.`,
      images: ['/images/downloads-og.jpg'],
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DownloadsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const totalResources = SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources;
  const bannerText = locale === 'zh'
    ? `🎉 全新PDF下载中心 - ${totalResources}个精选资源，移动端优化体验，基于紧急程度智能分类`
    : `🎉 New PDF Download Center - ${totalResources} curated resources, mobile-optimized experience, urgency-based smart categorization`;

  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": locale === 'zh' ? "PDF资源下载中心" : "PDF Resources Download Center",
    "description": locale === 'zh' 
      ? `Period Hub文章PDF下载中心，${totalResources}个精选经期健康资源`
      : `Period Hub Articles PDF Download Center, ${totalResources} curated menstrual health resources`,
    "url": `https://www.periodhub.health/${locale}/downloads`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": pdfResources.length,
      "itemListElement": pdfResources.map((resource, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "DigitalDocument",
          "name": resource.title,
          "description": resource.description,
          "fileSize": `${resource.fileSize}KB`,
          "url": `https://www.periodhub.health${resource.downloadUrl}`,
          "encodingFormat": "application/pdf"
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": locale === 'zh' ? "首页" : "Home",
          "item": `https://www.periodhub.health/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locale === 'zh' ? "PDF下载中心" : "PDF Download Center",
          "item": `https://www.periodhub.health/${locale}/downloads`
        }
      ]
    }
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* 🎉 新版本标识横幅 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 mb-6 rounded-xl animate-pulse-slow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">
              {bannerText}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">


        {/* 页面标题区域 */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Download className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {locale === 'zh' ? '📚 文章PDF下载中心' : '📚 Articles PDF Download Center'}
          </h1>

          <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
            {locale === 'zh'
              ? `${totalResources}个精选资源，基于紧急程度智能分类，让您在需要时快速找到合适的解决方案`
              : `${totalResources} curated resources, intelligently categorized by urgency to help you find the right solution when you need it`
            }
          </p>
          
          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{SITE_CONFIG.statistics.articles}</div>
              <div className="text-sm text-gray-500">{locale === 'zh' ? '专业文章' : 'Expert Articles'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{SITE_CONFIG.statistics.pdfResources}</div>
              <div className="text-sm text-gray-500">{locale === 'zh' ? 'PDF资源' : 'PDF Resources'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">2</div>
              <div className="text-sm text-gray-500">{locale === 'zh' ? '语言版本' : 'Languages'}</div>
            </div>
          </div>
        </header>

        {/* 🚀 优化版移动端PDF中心组件 - 实现"我现在需要什么帮助？"界面 */}
        <OptimizedMobilePDFCenter locale={locale} />

        {/* 💡 用户反馈组件 */}
        <div className="fixed bottom-4 right-4 z-50 max-w-xs">
          <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-500">
            <div className="text-sm font-bold mb-2">
              {locale === 'zh' ? '💡 体验新版下载中心' : '💡 Try New Download Center'}
            </div>
            <div className="text-xs mb-3 opacity-90">
              {locale === 'zh'
                ? `移动端优化 • 智能搜索 • 紧急模式 • ${totalResources}个精选资源`
                : `Mobile Optimized • Smart Search • Emergency Mode • ${totalResources} Curated Resources`
              }
            </div>
            <button className="bg-white text-blue-600 px-3 py-2 rounded-lg text-xs w-full font-medium hover:bg-gray-50 transition-colors">
              {locale === 'zh' ? '反馈体验效果' : 'Share Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
