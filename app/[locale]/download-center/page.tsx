import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Locale, locales } from '@/i18n';
import OptimizedMobilePDFCenter from '@/components/OptimizedMobilePDFCenter';
import { SITE_CONFIG } from '@/config/site.config';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'downloadsPage' });
  
  return {
    title: t('seo.title'),
    description: t('seo.description'),
    keywords: t('seo.keywords'),
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DownloadCenterPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* 返回导航 */}
      <div className="container mx-auto px-4 pt-8">
        <Link 
          href={`/${locale}/articles`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group mb-6"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回文章</span>
        </Link>
      </div>

      {/* 页面标题区域 */}
      <header className="container mx-auto px-4 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <Download className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📚 文章PDF下载中心
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            {SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources}个精选资源，基于紧急程度智能分类。从立即缓解到长期管理，为您的经期健康提供全方位支持。
          </p>
          
          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{SITE_CONFIG.statistics.articles}</div>
              <div className="text-sm text-gray-500">专业文章</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{SITE_CONFIG.statistics.pdfResources}</div>
              <div className="text-sm text-gray-500">实用PDF</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">2</div>
              <div className="text-sm text-gray-500">语言版本</div>
            </div>
          </div>
        </div>
      </header>

      {/* 优化版移动端PDF中心组件 */}
      <OptimizedMobilePDFCenter locale={locale} />
    </div>
  );
}
