import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Locale, locales } from '@/i18n';
import OptimizedMobilePDFCenter from '@/components/OptimizedMobilePDFCenter';
import StructuredData from '@/components/StructuredData';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `文章PDF下载中心 - Period Hub 经期健康专业资源`,
    description: `Period Hub文章PDF下载中心，38个精选经期健康资源，基于紧急程度智能分类，支持中英双语下载`,
    keywords: '经期健康,PDF下载,痛经缓解,文章资源,Period Hub',
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DownloadsNewPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  const pageUrl = `${baseUrl}/${locale}/downloads-new`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* SEO结构化数据 */}
      <StructuredData
        type="healthTopicPage"
        title={locale === 'zh' ? '文章PDF下载中心 - Period Hub 经期健康专业资源' : 'Article PDF Download Center - Period Hub Menstrual Health Resources'}
        description={locale === 'zh' 
          ? 'Period Hub文章PDF下载中心，38个精选经期健康资源，基于紧急程度智能分类，支持中英双语下载'
          : 'Period Hub article PDF download center, 38 curated menstrual health resources, intelligently categorized by urgency, bilingual support'}
        url={pageUrl}
      />
      {/* 新版本标识横幅 */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 text-center text-sm font-medium">
        🎉 全新PDF下载中心 - 38个精选资源，移动端优化体验，基于紧急程度智能分类
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 返回导航 */}
        <div className="mb-8">
          <Link 
            href={`/${locale}/articles`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>返回文章</span>
          </Link>
        </div>

        {/* 页面标题区域 */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Download className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📚 文章PDF下载中心
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            38个精选资源，基于紧急程度智能分类。从立即缓解到长期管理，为您的经期健康提供全方位支持。
          </p>
          
          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">42</div>
              <div className="text-sm text-gray-500">专业文章</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">24</div>
              <div className="text-sm text-gray-500">实用PDF</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">2</div>
              <div className="text-sm text-gray-500">语言版本</div>
            </div>
          </div>
        </header>

        {/* 优化版移动端PDF中心组件 */}
        <OptimizedMobilePDFCenter locale={locale} />

        {/* 用户反馈组件 */}
        <div className="fixed bottom-4 right-4 z-50 max-w-xs">
          <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-500">
            <div className="text-sm font-bold mb-2">💡 体验新版下载中心</div>
            <div className="text-xs mb-3 opacity-90">
              移动端优化 • 智能搜索 • 紧急模式 • 38个精选资源
            </div>
            <button className="bg-white text-blue-600 px-3 py-2 rounded-lg text-xs w-full font-medium hover:bg-gray-50 transition-colors">
              反馈体验效果
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
