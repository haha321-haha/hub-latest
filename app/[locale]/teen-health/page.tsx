import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  Heart,
  School,
  Brain,
  MessageCircle,
  Users,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';
import EmbeddedPainAssessment from '@/components/EmbeddedPainAssessment';

type Locale = 'en' | 'zh';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'teenHealth' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: locale === 'zh' 
      ? '青少年经期健康,青春期教育,经期管理,校园健康,心理健康,成长支持,科学教育'
      : 'teen menstrual health,puberty education,period management,school health,mental health,growth support,scientific education',
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/teen-health`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/teen-health',
        'en-US': 'https://www.periodhub.health/en/teen-health',
        'x-default': 'https://www.periodhub.health/zh/teen-health',
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      locale: locale,
    },
  };
}

export default async function TeenHealthPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations('teenHealth');

  const features = [
    {
      id: 'campus-guide',
      title: t('features.campusGuide.title'),
      description: t('features.campusGuide.description'),
      icon: <School className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      href: '/teen-health/campus-guide',
      highlights: t.raw('features.campusGuide.highlights')
    },
    {
      id: 'development-pain',
      title: t('features.developmentPain.title'),
      description: t('features.developmentPain.description'),
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-pink-50 text-pink-600',
      href: '/teen-health/development-pain',
      highlights: t.raw('features.developmentPain.highlights')
    },
    {
      id: 'emotional-support',
      title: t('features.emotionalSupport.title'),
      description: t('features.emotionalSupport.description'),
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      href: '/teen-health/emotional-support',
      highlights: t.raw('features.emotionalSupport.highlights')
    },
    {
      id: 'communication-guide',
      title: t('features.communicationGuide.title'),
      description: t('features.communicationGuide.description'),
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-green-50 text-green-600',
      href: '/teen-health/communication-guide',
      highlights: t.raw('features.communicationGuide.highlights')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl opacity-50"></div>
        <div className="relative z-10 py-16 px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('quickHelp.title')}
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              {t('quickHelp.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/${locale}/teen-health/campus-guide`}
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                {t('quickHelp.campusGuide')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href={`/${locale}/scenario-solutions/emergency-kit`}
                className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-full font-medium border-2 border-red-200 hover:bg-red-50 transition-colors"
              >
                {t('quickHelp.emergencyKit')}
              </Link>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('quickHelp.immediateMethods')}
              </h3>
              <div className="space-y-2">
                {t.raw('quickHelp.methods').map((method: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Assessment Tool Section */}
      <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('painAssessment.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('painAssessment.description')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <EmbeddedPainAssessment locale={locale} />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-4">
            {t('painAssessment.detailedAssessment')}
          </p>
          <Link
            href={`/${locale}/interactive-tools/period-pain-assessment`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('painAssessment.useFullTool')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Main Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          {t('features.title')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('features.description')}
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {feature.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              
              <Link
                href={`/${locale}${feature.href}`}
                className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors"
              >
                <span className="mr-2">{locale === 'zh' ? '了解更多' : 'Learn More'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('resources.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('resources.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {t('resources.readingList.title')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {t('resources.readingList.description')}
            </p>
            <Link
              href={`/${locale}/articles/recommended-reading-list`}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              {t('resources.readingList.action')} →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-pink-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {t('resources.nutritionRecipes.title')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {t('resources.nutritionRecipes.description')}
            </p>
            <Link 
              href={`/${locale}/articles/period-friendly-recipes`}
              className="text-pink-600 text-sm font-medium hover:text-pink-700"
            >
              {t('resources.nutritionRecipes.action')} →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {t('resources.communicationTemplates.title')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {t('resources.communicationTemplates.description')}
            </p>
            <Link 
              href={`/${locale}/teen-health/communication-guide`}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              {t('resources.communicationTemplates.action')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {t('cta.description')}
        </p>
        <Link
          href={`/${locale}/teen-health/campus-guide`}
          className="inline-flex items-center bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors"
        >
          {t('cta.button')}
          <ArrowRight className="w-6 h-6 ml-2" />
        </Link>
      </section>
    </div>
  );
}
