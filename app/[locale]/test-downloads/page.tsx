import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/i18n';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'downloadsPage' });

  return {
    title: t('title'),
    description: t('description'),
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
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'downloadsPage' });

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-gray-600">{t('stats.totalResources')}</div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-4xl font-bold text-pink-600 mb-2">4</div>
            <div className="text-gray-600">{t('stats.categories')}</div>
          </div>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
            <div className="text-gray-600">{t('stats.languages')}</div>
          </div>
        </div>

        {/* Temporary content */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {locale === 'zh' ? 'PDF下载中心正在开发中' : 'PDF Download Center Under Development'}
            </h2>
            <p className="text-gray-600 mb-8">
              {locale === 'zh'
                ? '我们正在准备专业的PDF资源，包括健康指南、追踪表格和管理工具。敬请期待！'
                : 'We are preparing professional PDF resources including health guides, tracking forms, and management tools. Stay tuned!'
              }
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-semibold text-purple-800 mb-2">
                  {locale === 'zh' ? '管理工具' : 'Management Tools'}
                </h3>
                <p className="text-purple-600 text-sm">
                  {locale === 'zh' ? '痛经追踪表、健康习惯清单等' : 'Pain tracking forms, health habit checklists, etc.'}
                </p>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl">
                <h3 className="font-semibold text-pink-800 mb-2">
                  {locale === 'zh' ? '健康指南' : 'Health Guides'}
                </h3>
                <p className="text-pink-600 text-sm">
                  {locale === 'zh' ? '营养计划、运动指导、医疗建议' : 'Nutrition plans, exercise guidance, medical advice'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Articles */}
        <div className="mt-16 text-center">
          <Link
            href={`/${locale}/articles`}
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            {t('backToArticles')}
          </Link>
        </div>
      </div>
    </div>
  );
}
