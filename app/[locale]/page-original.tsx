import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Hero from '@/components/layout/Hero';
import UserSuccessStories from '@/components/UserSuccessStories';
import NavigationTabs from '@/components/NavigationTabs';

// 页面级别的metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homePageContent' });

  return {
    title: t('seo.title'),
    description: t('seo.description'),
    keywords: t('seo.keywords').split(','),
    openGraph: {
      title: t('seo.ogTitle'),
      description: t('seo.ogDescription'),
      url: `https://www.periodhub.health/${locale}`,
      siteName: 'PeriodHub',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.ogTitle'),
      description: t('seo.ogDescription'),
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh',
        'en-US': 'https://www.periodhub.health/en',
        'x-default': 'https://www.periodhub.health',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 增强的结构化数据 - 针对健康平台优化
const getStructuredData = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: '' });
  
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `https://www.periodhub.health/${locale}#application`,
      "name": "PeriodHub",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "inLanguage": locale === 'zh' ? "zh-CN" : "en-US",
      "description": t('metadata.home.structuredData.description'),
      "url": `https://www.periodhub.health/${locale}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        t('metadata.home.structuredData.featureList.painTracking'),
        t('metadata.home.structuredData.featureList.cyclePrediction'),
        t('metadata.home.structuredData.featureList.constitutionAssessment'),
        t('metadata.home.structuredData.featureList.healthGuides'),
        t('metadata.home.structuredData.featureList.scenarioSolutions')
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5"
      },
      "publisher": {
        "@id": `https://www.periodhub.health/${locale}#organization`
      }
    },
    {
      "@type": "Organization",
      "@id": `https://www.periodhub.health/${locale}#organization`,
      "name": "PeriodHub",
      "url": "https://www.periodhub.health",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.periodhub.health/icon-512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.periodhub.health/zh",
        "https://www.periodhub.health/en"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `https://www.periodhub.health/${locale}#website`,
      "url": "https://www.periodhub.health",
      "name": "PeriodHub",
      "description": t('organization.description'),
      "publisher": {
        "@id": `https://www.periodhub.health/${locale}#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `https://www.periodhub.health/${locale}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "@id": `https://www.periodhub.health/${locale}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": t('faq.q1.question'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq.q1.answer')
          }
        },
        {
          "@type": "Question",
          "name": t('faq.q2.question'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq.q2.answer')
          }
        },
        {
          "@type": "Question",
          "name": t('faq.q3.question'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('faq.q3.answer')
          }
        }
      ]
    }
  ]
  };
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations('');
  const isZh = typeof locale === 'string' && (locale === 'zh' || locale.startsWith('zh'));
  const structuredData = await getStructuredData(locale);

  return (
    <>
      {/* 增强的结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        {/* 高级Hero - 主要内容区域 */}
        <main>
          <Hero />

          {/* Features Section */}
          <section className="py-20" aria-labelledby="features-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-16">
                <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t('home.features.title')}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {t('home.features.subtitle')}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Link href={`/${locale}/interactive-tools/cycle-tracker`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">{t('home.features.tracking.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('home.features.tracking.description')}</p>
                    <div className="mt-4 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('home.features.learnMore')}
                    </div>
                  </article>
                </Link>

                <Link href={`/${locale}/interactive-tools/symptom-assessment`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{t('home.features.assessment.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('home.features.assessment.description')}</p>
                    <div className="mt-4 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('home.features.learnMore')}
                    </div>
                  </article>
                </Link>

                <Link href={`/${locale}/downloads`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{t('home.features.resources.title')}</h3>
                    <p className="text-gray-600 leading-relaxed">{t('home.features.resources.description')}</p>
                    <div className="mt-4 text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('home.features.learnMore')}
                    </div>
                  </article>
                </Link>

                <Link href={`/${locale}/immediate-relief`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                      {t('home.features.immediateRelief.title')}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('home.features.immediateRelief.description')}
                    </p>
                    <div className="mt-4 text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('home.features.immediateRelief.cta')}
                    </div>
                  </article>
                </Link>
              </div>
            </div>
          </section>

          {/* 导航分段 */}
          <div className="py-10">
            <NavigationTabs locale={locale} />
          </div>

          {/* 统计模块：替换为 SVG 信息图 */}
          <section id="articles-section" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm p-4 sm:p-6">
                <img
                  src="/images/infographics/stats-infographic.svg"
                  alt={isZh ? '月经健康统计数据信息图' : 'Period Health Statistics Infographic'}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <p className="mt-2 text-center text-sm text-neutral-500">
                  {t('healthStatistics.dataSource')}
                </p>
              </div>
            </div>
          </section>

          {/* 信任指标 */}
          <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.trusted.title')}</h2>
                <p className="text-xl text-gray-600">{t('home.trusted.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                  <div className="text-gray-600">{t('home.trusted.metrics.activeUsers')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-pink-600 mb-2">43</div>
                  <div className="text-gray-600">{t('home.trusted.metrics.articles')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">13</div>
                  <div className="text-gray-600">{t('home.trusted.metrics.resources')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">{t('home.trusted.metrics.satisfaction')}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 痛经治疗专题链接区域 - 基于关键词数据优化 */}
          <section className="py-16 bg-white" aria-labelledby="pain-management-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-12">
                <h2 id="pain-management-heading" className="text-3xl font-bold text-gray-900 mb-4">
                  {t('home.treatmentGuide.title')}
                </h2>
                <p className="text-xl text-gray-600">
                  {t('home.treatmentGuide.subtitle')}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 痛经用药指南 */}
                <Link href={`/${locale}/downloads/medication-guide`} className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {t('home.treatmentGuide.medicationGuide.title')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {t('home.treatmentGuide.medicationGuide.description')}
                  </p>
                  <div className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.treatmentGuide.medicationGuide.cta')}
                  </div>
                </Link>

                {/* 热敷疗法指导 */}
                <Link href={`/${locale}/articles/heat-therapy-complete-guide`} className="group bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">
                      {t('home.treatmentGuide.heatTherapy.title')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {t('home.treatmentGuide.heatTherapy.description')}
                  </p>
                  <div className="text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.treatmentGuide.heatTherapy.cta')}
                  </div>
                </Link>

                {/* 原发性痛经诊断 */}
                <Link href={`/${locale}/health-guide/understanding-pain`} className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                      {t('home.treatmentGuide.diagnosis.title')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {t('home.treatmentGuide.diagnosis.description')}
                  </p>
                  <div className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.treatmentGuide.diagnosis.cta')}
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* 用户成功案例 */}
          <UserSuccessStories />

          {/* FAQ Section - SEO优化 */}
          <section className="py-20 bg-white" aria-labelledby="faq-heading">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-16">
                <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('faq.title')}</h2>
                <p className="text-xl text-gray-600">{t('faq.subtitle')}</p>
              </header>

              <div className="space-y-6">
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q1.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q1.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q2.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q2.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q3.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q3.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q4.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q4.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q5.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q5.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q6.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q6.answer')}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q7.question')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.q7.answer')}
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="py-20 bg-gradient-to-r from-purple-100/50 to-pink-100/50" aria-labelledby="quick-links-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-12">
                <h2 id="quick-links-heading" className="text-3xl font-bold text-gray-900 mb-4">
                  {t('home.quickLinks.title')}
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href={`/${locale}/health-guide`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2 group-hover:text-purple-700">{t('home.quickLinks.healthGuide')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('home.quickLinks.healthGuideDesc')}</p>
                  <div className="mt-3 text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.quickLinks.viewNow')}
                  </div>
                </Link>

                <Link href={`/${locale}/interactive-tools/symptom-assessment`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-pink-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-pink-600 mb-2 group-hover:text-pink-700">
                    {t('home.quickLinks.assessment.title')}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('home.quickLinks.assessment.description')}
                  </p>
                  <div className="mt-3 text-pink-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.quickLinks.assessment.cta')}
                  </div>
                </Link>

                <Link href={`/${locale}/downloads`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700">{t('home.quickLinks.resources')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('home.quickLinks.resourcesDesc')}</p>
                  <div className="mt-3 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.quickLinks.downloads.cta')}
                  </div>
                </Link>

                <Link href={`/${locale}/scenario-solutions`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2 group-hover:text-green-700">{t('home.quickLinks.solutions')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('home.quickLinks.solutionsDesc')}</p>
                  <div className="mt-3 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.quickLinks.scenarios.cta')}
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}