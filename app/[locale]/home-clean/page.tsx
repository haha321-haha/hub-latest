import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homeClean' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${baseUrl}/${locale}/home-clean`,
      languages: {
        zh: `${baseUrl}/zh/home-clean`,
        en: `${baseUrl}/en/home-clean`,
        'x-default': `${baseUrl}/zh/home-clean`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${baseUrl}/${locale}/home-clean`,
      siteName: t('meta.title'),
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  };
}

function StructuredDataScript({ locale, baseUrl }: { locale: string; baseUrl: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'zh' ? '经期健康管理平台' : 'Period Health Management Platform',
    description:
      locale === 'zh'
        ? '提供专业的体质测试、症状评估和疼痛追踪工具，帮助女性更好地了解和管理自己的健康状况'
        : 'Professional constitution testing, symptom assessment and pain tracking tools to help women better understand and manage their health',
    url: `${baseUrl}/${locale}/home-clean`,
    sameAs: [`${baseUrl}/${locale}/interactive-tools`],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function HomeCleanPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homeClean' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  return (
    <div className="min-h-screen bg-gray-50">
      <StructuredDataScript locale={locale} baseUrl={baseUrl} />

      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">{t('hero.title')}</h1>
          <p className="text-lg md:text-2xl mb-6 md:mb-8 opacity-90">{t('hero.subtitle')}</p>
          <Link
            href={`/${locale}/interactive-tools`}
            className="inline-block bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {["assessment", "tracking", "constitution"].map((key) => (
              <div key={key} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{t(`features.${key}.icon`)}</div>
                <h3 className="text-xl font-semibold mb-2">{t(`features.${key}.title`)}</h3>
                <p className="text-gray-600 mb-4">{t(`features.${key}.description`)}</p>
                <Link
                  href={`/${locale}/interactive-tools/${key === 'assessment' ? 'symptom-assessment' : key === 'tracking' ? 'pain-tracker' : 'constitution-test'}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t(`features.${key}.cta`)} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('trusted.title')}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["activeUsers", "articles", "resources", "satisfaction"].map((m) => (
              <div key={m} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{t(`trusted.metrics.${m}.number`)}</div>
                <div className="text-gray-700">{t(`trusted.metrics.${m}.label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{t('faq.title')}</h2>
          <p className="text-center text-gray-600 mb-10">{t('faq.subtitle')}</p>
          <div className="space-y-4">
            {["q1", "q2", "q3"].map((k) => (
              <details key={k} className="bg-white rounded-lg p-6 shadow-sm group">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t(`faq.${k}.question`)}</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 text-gray-600 leading-relaxed">{t(`faq.${k}.answer`)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t('quickNav.title')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/interactive-tools/constitution-test`} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('quickNav.constitutionTest')}
            </Link>
            <Link href={`/${locale}/interactive-tools/symptom-assessment`} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              {t('quickNav.symptomAssessment')}
            </Link>
            <Link href={`/${locale}/interactive-tools/pain-tracker`} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              {t('quickNav.painTracker')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


