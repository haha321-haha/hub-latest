import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import OptimizedImage from '@/components/ui/OptimizedImage';
import BreathingExercise from '@/components/BreathingExercise';
// import Breadcrumb from '@/components/Breadcrumb';
import { BarChart3, Calendar, ClipboardCheck, Lightbulb, Search, User } from 'lucide-react'; // Icons for cards
import { Locale, locales } from '@/i18n';
import StructuredData from '@/components/StructuredData';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'interactiveToolsPage' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: locale === 'zh' 
      ? '经期健康管理,症状评估,疼痛追踪,痛经管理,健康工具,个性化建议,数据分析'
      : 'menstrual health management,symptom assessment,pain tracking,period pain management,health tools,personalized recommendations,data analytics',
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/interactive-tools',
        'en-US': 'https://www.periodhub.health/en/interactive-tools',
        'x-default': 'https://www.periodhub.health/zh/interactive-tools',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function InteractiveToolsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'interactiveToolsPage' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  const tools = [
    {
      title: t('symptomAssessment.title'),
      description: t('symptomAssessment.description'),
      href: `/${locale}/interactive-tools/symptom-assessment`,
      iconType: 'ClipboardCheck',
      iconColor: 'text-primary-600',
      cta: t('symptomAssessment.startButton'),
    },
    {
      title: t('periodPainAssessment.title'),
      description: t('periodPainAssessment.description'),
      href: `/${locale}/interactive-tools/period-pain-assessment`,
      iconType: 'Search',
      iconColor: 'text-pink-600',
      cta: t('periodPainAssessment.cta'),
    },
    {
      title: t('cycleTracker.title'),
      description: t('cycleTracker.description'),
      href: `/${locale}/interactive-tools/cycle-tracker`,
      iconType: 'Calendar',
      iconColor: 'text-purple-600',
      cta: t('cycleTracker.cta'),
    },
    {
      title: t('painTracker.title'),
      description: t('painTracker.description'),
      href: `/${locale}/interactive-tools/pain-tracker`,
      iconType: 'BarChart3',
      iconColor: 'text-secondary-600',
      cta: t('painTracker.startButton'),
    },
    {
      title: t('constitutionTest.title'),
      description: t('constitutionTest.description'),
      href: `/${locale}/interactive-tools/constitution-test`,
      iconType: 'User',
      iconColor: 'text-green-600',
      cta: t('constitutionTest.cta'),
    },
    {
      title: t('personalizedInsights.title'),
      description: t('personalizedInsights.description'),
      href: "#", // No link yet
      iconType: 'Lightbulb',
      iconColor: 'text-accent-600',
      cta: commonT('comingSoon'),
    }
  ];

  // Helper function to render icons
  const renderIcon = (iconType: string, iconColor: string) => {
    const iconProps = { className: `w-8 h-8 ${iconColor}` };
    switch (iconType) {
      case 'ClipboardCheck':
        return <ClipboardCheck {...iconProps} />;
      case 'Search':
        return <Search {...iconProps} />;
      case 'Calendar':
        return <Calendar {...iconProps} />;
      case 'BarChart3':
        return <BarChart3 {...iconProps} />;
      case 'User':
        return <User {...iconProps} />;
      case 'Lightbulb':
        return <Lightbulb {...iconProps} />;
      default:
        return <ClipboardCheck {...iconProps} />;
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  const pageUrl = `${baseUrl}/${locale}/interactive-tools`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* SEO结构化数据 */}
      <StructuredData
        type="healthTopicPage"
        title={locale === 'zh' ? t('title') : 'Interactive Health Tools - Period Hub'}
        description={locale === 'zh' ? t('description') : 'Interactive health assessment tools for menstrual health management'}
        url={pageUrl}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8 sm:space-y-12 mobile-safe-area">
          {/* Breadcrumb Navigation - Temporarily disabled */}
          {/* <Breadcrumb 
            items={[
              { 
                label: locale === 'zh' ? '互动工具' : 'Interactive Tools'
              }
            ]} 
          /> */}
          
          {/* Page Header - 移动端优化 */}
          <header className="text-center px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4 leading-tight">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </header>

          {/* Tools Introduction Section - 移动端优化 */}
          <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl mx-4 sm:mx-0">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {t('toolsIntroduction')}
                  </p>
                </div>
                <div className="flex justify-center order-first md:order-last">
                  <OptimizedImage
                    src="/images/tools/assessment-illustration.jpg"
                    alt="Woman using digital health assessment tool on tablet in comfortable home setting"
                    width={400}
                    height={300}
                    className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 480px, 600px"
                    priority={true}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Tools Grid - 移动端优化 */}
          <section className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {tools.map((tool) => (
                <div key={tool.title} className="card flex flex-col items-center text-center h-full p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-neutral-100 mb-4 sm:mb-6">
                    {renderIcon(tool.iconType, tool.iconColor)}
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 leading-tight">
                    {tool.title}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>
                  {tool.href === "#" ? (
                    <span className="btn-disabled w-full mobile-touch-target text-sm sm:text-base px-4 py-3">{tool.cta}</span>
                  ) : (
                    <Link href={tool.href} className="w-full mobile-touch-target text-sm sm:text-base px-4 py-3 text-center btn-primary">
                      {tool.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Breathing Exercise Section - 移动端优化 */}
          <section id="breathing-exercise" className="container-custom">
            <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🫁</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-3 sm:mb-4 leading-tight">
                  {t('breathingExercise.title')}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                  {t('breathingExercise.description')}
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <BreathingExercise locale={locale} />
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  {t('breathingExercise.usageTips.title')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('breathingExercise.usageTips.bestTiming.title')}
                    </h4>
                    <ul className="space-y-1">
                      {t.raw('breathingExercise.usageTips.bestTiming.items').map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      {t('breathingExercise.usageTips.precautions.title')}
                    </h4>
                    <ul className="space-y-1">
                      {t.raw('breathingExercise.usageTips.precautions.items').map((item: string, index: number) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to action / Note */}
          <section className="text-center py-8">
            <p className="text-neutral-700">
              {t('developmentNote')}
            </p>
          </section>

          {/* Medical Disclaimer */}
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 my-8 rounded-r-lg" role="alert">
            <p className="font-bold">{commonT('importantNote')}</p>
            <p className="text-sm">
              {commonT('medicalDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
