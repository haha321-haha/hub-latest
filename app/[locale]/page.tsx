import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Hero from '@/components/layout/Hero';
import UserSuccessStories from '@/components/UserSuccessStories';
import NavigationTabs from '@/components/NavigationTabs';

// 页面级别的metadata
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? 'PeriodHub - 专业痛经缓解方法和月经健康管理平台 | 科学指导，贴心陪伴'
      : 'PeriodHub - Professional Menstrual Health Management Platform | Scientific Guidance',
    description: isZh
      ? '专业的女性月经健康管理平台，提供42篇专业文章、24个PDF资源，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。'
      : 'Professional menstrual health management platform providing 42 expert articles and 24 PDF resources to help women scientifically manage menstrual health and quickly relieve period pain.',
    keywords: isZh ? [
      '痛经怎么缓解最快方法', '痛经吃什么药最有效', '月经推迟几天算正常', '月经量少是什么原因',
      '痛经缓解', '月经疼痛', '经期健康', '女性健康', '月经健康管理', '经期疼痛怎么办', '中医调理',
      '月经周期', '经期护理', '生理期', '大姨妈', '例假', '月经不调', '经期症状'
    ] : [
      'menstrual cramps relief', 'period pain remedies', 'how to stop period pain', 'natural period pain relief',
      'menstrual health', 'period tracking', 'women health', 'dysmenorrhea treatment'
    ],
    openGraph: {
      title: isZh 
        ? 'PeriodHub - 专业痛经缓解方法和月经健康管理平台'
        : 'PeriodHub - Professional Menstrual Health Management Platform',
      description: isZh
        ? '专业的女性月经健康管理平台，提供科学的痛经缓解方法和个性化健康建议。'
        : 'Professional menstrual health management platform providing scientific period pain relief methods.',
      url: `https://periodhub.health/${locale}`,
      siteName: 'PeriodHub',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh 
        ? 'PeriodHub - 专业痛经缓解方法和月经健康管理平台'
        : 'PeriodHub - Professional Menstrual Health Management Platform',
      description: isZh
        ? '专业的女性月经健康管理平台，提供科学的痛经缓解方法。'
        : 'Professional menstrual health management platform.',
    },
    alternates: {
      canonical: `https://periodhub.health/${locale}`,
      languages: {
        'zh-CN': 'https://periodhub.health/zh',
        'en-US': 'https://periodhub.health/en',
        'x-default': 'https://periodhub.health',
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
const getStructuredData = (locale: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `https://periodhub.health/${locale}#application`,
      "name": "PeriodHub",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "inLanguage": locale === 'zh' ? "zh-CN" : "en-US",
      "description": locale === 'zh'
        ? "专业的女性月经健康管理平台，提供痛经追踪、周期预测、体质评估等功能"
        : "Professional menstrual health management platform with pain tracking, cycle prediction, and constitution assessment",
      "url": `https://periodhub.health/${locale}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        locale === 'zh' ? "痛经追踪" : "Pain Tracking",
        locale === 'zh' ? "周期预测" : "Cycle Prediction", 
        locale === 'zh' ? "体质评估" : "Constitution Assessment",
        locale === 'zh' ? "健康指南" : "Health Guides",
        locale === 'zh' ? "场景解决方案" : "Scenario Solutions"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5"
      },
      "publisher": {
        "@id": `https://periodhub.health/${locale}#organization`
      }
    },
    {
      "@type": "Organization",
      "@id": `https://periodhub.health/${locale}#organization`,
      "name": "PeriodHub",
      "url": "https://periodhub.health",
      "logo": {
        "@type": "ImageObject",
        "url": "https://periodhub.health/icon-512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://periodhub.health/zh",
        "https://periodhub.health/en"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `https://periodhub.health/${locale}#website`,
      "url": "https://periodhub.health",
      "name": "PeriodHub",
      "description": locale === 'zh'
        ? "专业的女性月经健康管理平台"
        : "Professional menstrual health management platform",
      "publisher": {
        "@id": `https://periodhub.health/${locale}#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `https://periodhub.health/${locale}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "@id": `https://periodhub.health/${locale}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": locale === 'zh' ? "痛经怎么缓解最快方法？" : "What are the fastest ways to relieve menstrual cramps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'zh'
              ? "最快的痛经缓解方法包括：热敷下腹部和腰部、轻柔按摩腹部、适量运动如瑜伽、服用布洛芬等非甾体抗炎药、保持充足休息。建议结合多种方法，效果更佳。"
              : "The fastest menstrual cramp relief methods include: heat therapy on lower abdomen and back, gentle abdominal massage, light exercise like yoga, NSAIDs like ibuprofen, and adequate rest. Combining multiple methods works best."
          }
        },
        {
          "@type": "Question", 
          "name": locale === 'zh' ? "月经周期多少天算正常？" : "What is considered a normal menstrual cycle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'zh'
              ? "正常的月经周期为21-35天，平均28天。月经持续时间通常为3-7天。如果周期长期不规律或有明显变化，建议咨询妇科医生。"
              : "A normal menstrual cycle ranges from 21-35 days, with an average of 28 days. Menstruation typically lasts 3-7 days. Consult a gynecologist if cycles are consistently irregular."
          }
        },
        {
          "@type": "Question",
          "name": locale === 'zh' ? "中医如何调理月经不调？" : "How does Traditional Chinese Medicine treat irregular periods?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'zh'
              ? "中医通过辨证论治调理月经：针灸调节气血、中药方剂如四物汤、食疗调养、生活方式调整。需要专业中医师诊断体质后制定个性化方案。"
              : "TCM treats irregular periods through syndrome differentiation: acupuncture to regulate qi and blood, herbal formulas, dietary therapy, and lifestyle adjustments. Professional TCM diagnosis is needed for personalized treatment."
          }
        }
      ]
    }
  ]
});

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('home');
  const isZh = typeof locale === 'string' && (locale === 'zh' || locale.startsWith('zh'));
  
  return (
    <>
      {/* 增强的结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData(locale))
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
                  {t('features.title')}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {t('features.subtitle')}
                </p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">{t('features.tracking.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('features.tracking.description')}</p>
                  <div className="mt-4 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '了解更多 →' : 'Learn more →'}
                  </div>
                </article>
                
                <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{t('features.assessment.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('features.assessment.description')}</p>
                  <div className="mt-4 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '了解更多 →' : 'Learn more →'}
                  </div>
                </article>
                
                <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{t('features.resources.title')}</h3>
                  <p className="text-gray-600 leading-relaxed">{t('features.resources.description')}</p>
                  <div className="mt-4 text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '了解更多 →' : 'Learn more →'}
                  </div>
                </article>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('trusted.title')}</h2>
                <p className="text-xl text-gray-600">{t('trusted.subtitle')}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                  <div className="text-gray-600">{t('trusted.metrics.activeUsers')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-pink-600 mb-2">42</div>
                  <div className="text-gray-600">{t('trusted.metrics.articles')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                  <div className="text-gray-600">{t('trusted.metrics.resources')}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">{t('trusted.metrics.satisfaction')}</div>
                </div>
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
                    <span>{t('faq.q1')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.a1')}
                  </div>
                </details>
                
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q2')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.a2')}
                  </div>
                </details>
                
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t('faq.q3')}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t('faq.a3')}
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
                  {t('quickLinks.title')}
                </h2>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href={`/${locale}/health-guide`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2 group-hover:text-purple-700">{t('quickLinks.healthGuide')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('quickLinks.healthGuideDesc')}</p>
                  <div className="mt-3 text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '立即查看 →' : 'View now →'}
                  </div>
                </Link>
                
                <Link href={`/${locale}/interactive-tools/period-pain-assessment`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-pink-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-pink-600 mb-2 group-hover:text-pink-700">{t('quickLinks.assessment')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('quickLinks.assessmentDesc')}</p>
                  <div className="mt-3 text-pink-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '开始评估 →' : 'Start assessment →'}
                  </div>
                </Link>
                
                <Link href={`/${locale}/downloads`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700">{t('quickLinks.resources')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('quickLinks.resourcesDesc')}</p>
                  <div className="mt-3 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '下载资源 →' : 'Download resources →'}
                  </div>
                </Link>
                
                <Link href={`/${locale}/scenario-solutions`} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2 group-hover:text-green-700">{t('quickLinks.solutions')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t('quickLinks.solutionsDesc')}</p>
                  <div className="mt-3 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === 'zh' ? '查看方案 →' : 'View solutions →'}
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