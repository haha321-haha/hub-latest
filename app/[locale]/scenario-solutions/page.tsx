import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import Image from 'next/image';
import {
  Briefcase,
  Car,
  Dumbbell,
  Moon,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
  Package,
  Star
} from 'lucide-react';

// Types
type Locale = 'en' | 'zh';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'scenarioSolutionsPage' });
  
  return {
    title: t('title'),
    description: t('description'),
        keywords: locale === 'zh'
      ? '经期可以运动吗,场景化痛经解决方案,职场痛经管理,运动痛经应对,社交痛经礼仪,痛经应急包,痛经缓解技巧,热敷,敷热水袋,暖宝宝,按摩,揉肚子,止痛药'
      : 'scenario-based period pain solutions,workplace period management,exercise period pain relief,social period etiquette,period emergency kit,period pain relief tips',
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/scenario-solutions`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/scenario-solutions',
        'en-US': 'https://www.periodhub.health/en/scenario-solutions',
        'x-default': 'https://www.periodhub.health/zh/scenario-solutions',
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

export default async function ScenarioSolutionsPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  // 场景图片映射
  const scenarioImages: Record<string, { filename: string; alt: string }> = {
    office: {
      filename: 'scenario-office.jpg',
      alt: 'Professional woman managing menstrual discomfort at office workspace'
    },
    commute: {
      filename: 'scenario-commuting.jpg',
      alt: 'Woman managing period pain during daily commute on public transport'
    },
    exercise: {
      filename: 'scenario-exercise.jpg',
      alt: 'Woman adapting exercise routine during menstruation in gym setting'
    },
    sleep: {
      filename: 'scenario-sleeping.jpg',
      alt: 'Woman using comfort techniques for better sleep during menstruation'
    },
    social: {
      filename: 'scenario-dating.jpg',
      alt: 'Woman confidently managing period during social gathering or date'
    },
    lifeStages: {
      filename: 'scenario-family.jpg',
      alt: 'Women of different life stages sharing menstrual health experiences'
    }
  };

  const scenarios = [
    {
      id: 'office',
      title: t('scenarios.office.title'),
      description: t('scenarios.office.description'),
      features: t.raw('scenarios.office.features') as string[],
      icon: <Briefcase className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'commute',
      title: t('scenarios.commute.title'),
      description: t('scenarios.commute.description'),
      features: t.raw('scenarios.commute.features') as string[],
      icon: <Car className="w-8 h-8" />,
      color: 'bg-green-50 text-green-600',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'exercise',
      title: t('scenarios.exercise.title'),
      description: t('scenarios.exercise.description'),
      features: t.raw('scenarios.exercise.features') as string[],
      icon: <Dumbbell className="w-8 h-8" />,
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'sleep',
      title: t('scenarios.sleep.title'),
      description: t('scenarios.sleep.description'),
      features: t.raw('scenarios.sleep.features') as string[],
      icon: <Moon className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'social',
      title: t('scenarios.social.title'),
      description: t('scenarios.social.description'),
      features: t.raw('scenarios.social.features') as string[],
      icon: <Users className="w-8 h-8" />,
      color: 'bg-pink-50 text-pink-600',
      hoverColor: 'hover:bg-pink-100'
    },
    {
      id: 'lifeStages',
      title: t('scenarios.lifeStages.title'),
      description: t('scenarios.lifeStages.description'),
      features: t.raw('scenarios.lifeStages.features') as string[],
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-red-50 text-red-600',
      hoverColor: 'hover:bg-red-100'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12" data-page="scenario-solutions">
      {/* SEO结构化数据 */}
      <StructuredData
        type="healthTopicPage"
        title={t('title')}
        description={t('description')}
        url={`https://www.periodhub.health/${locale}/scenario-solutions`}
      />
      
      {/* Page Header */}
      <header className="text-center py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto px-4">
          {t('description')}
        </p>
      </header>

      {/* 青少年经期健康专区推广区域 */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border border-pink-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-200 rounded-full opacity-20 transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-purple-200 rounded-full opacity-20 transform -translate-x-10 sm:-translate-x-12 translate-y-10 sm:translate-y-12"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
              <div className="bg-pink-100 rounded-full p-2 mr-0 sm:mr-3 mb-2 sm:mb-0">
                <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {locale === 'zh' ? '🌸 青少年经期健康专区 🌸' : '🌸 Teen Menstrual Health Zone 🌸'}
                </h2>
                <p className="text-sm text-pink-600 font-medium">
                  {locale === 'zh' ? '专为12-18岁女孩设计的贴心空间' : 'A caring space designed for girls aged 12-18'}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 md:mb-6 text-base sm:text-lg leading-relaxed">
              {locale === 'zh'
                ? '青春期有太多烦恼，而每个月的"那几天"更是让人担心。疼痛、情绪波动、身体变化……别担心，你不是一个人在战斗。我们为你准备了校园应急指南、发育期疼痛管理、情绪支持和沟通技巧，陪你自信地度过每一个经期。'
                : 'Adolescence brings many worries, and "those days" each month can be especially concerning. Pain, mood swings, body changes... Don\'t worry, you\'re not fighting alone. We\'ve prepared campus emergency guides, developmental pain management, emotional support, and communication skills to help you confidently navigate every period.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={`/${locale}/teen-health`}
                className="inline-flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                {locale === 'zh' ? '进入专区' : 'Enter Zone'}
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Link>
              <Link
                href={`/${locale}/teen-health/campus-guide`}
                className="inline-flex items-center justify-center bg-white text-pink-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium border-2 border-pink-200 hover:bg-pink-50 transition-colors text-sm sm:text-base"
              >
                {locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide'}
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-pink-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                <span className="text-pink-500 mr-2">💝</span>
                {locale === 'zh' ? '我们能帮你什么？' : 'How Can We Help?'}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: '🏫', text: locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide' },
                  { icon: '🌱', text: locale === 'zh' ? '发育期疼痛管理' : 'Developmental Pain Management' },
                  { icon: '💭', text: locale === 'zh' ? '情绪支持与心理健康' : 'Emotional & Mental Support' },
                  { icon: '💬', text: locale === 'zh' ? '与家长老师沟通' : 'Communication with Parents & Teachers' },
                  { icon: '👭', text: locale === 'zh' ? '同龄人经验分享' : 'Peer Experience Sharing' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                    <span className="mr-2 sm:mr-3 text-base sm:text-lg">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-3 sm:mb-4">
            {t('introTitle')}
          </h2>
          <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
            {t('introText')}
          </p>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200 group cursor-pointer"
            >
              {/* Scenario Image */}
              <div className="mb-4 sm:mb-6 relative overflow-hidden rounded-lg">
                <Image
                  src={`/images/scenarios/${scenarioImages[scenario.id].filename}`}
                  alt={scenarioImages[scenario.id].alt}
                  width={600}
                  height={400}
                  className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className={`w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-full ${scenario.color} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {scenario.icon}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors">
                {scenario.title}
              </h3>

              <p className="text-neutral-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                {scenario.description}
              </p>
              
              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                {scenario.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-xs sm:text-sm text-neutral-700">
                    <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link
                href={`/${locale}/scenario-solutions/${scenario.id}`}
                className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors text-sm sm:text-base"
              >
                <span className="mr-2">{commonT('learnMore')}</span>
                <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Kit Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 p-4 sm:p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 gap-4">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <Package className="w-6 sm:w-8 h-6 sm:h-8" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 mr-1" />
                <span className="text-xs sm:text-sm font-medium text-red-700">
                  {locale === 'zh' ? '特别推荐' : 'Special Recommendation'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                {locale === 'zh' ? '多场景应急包清单' : 'Multi-Scenario Emergency Kit List'}
              </h2>
            </div>
          </div>

          <p className="text-neutral-700 text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            {locale === 'zh'
              ? '从办公室到通勤路上，从运动场到社交聚会，详细的应急包准备清单帮助你在任何场景下都能从容应对经期不适。'
              : 'From office to commute, from sports field to social gatherings, detailed emergency kit preparation lists help you handle period discomfort confidently in any scenario.'
            }
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2" />
                <span className="font-medium text-neutral-800 text-sm sm:text-base">
                  {locale === 'zh' ? '办公场景' : 'Office Scenario'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                {locale === 'zh' ? '隐蔽热敷、止痛药、姜茶包...' : 'Discreet heat patches, pain meds, ginger tea...'}
              </p>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <Car className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 mr-2" />
                <span className="font-medium text-neutral-800 text-sm sm:text-base">
                  {locale === 'zh' ? '通勤场景' : 'Commute Scenario'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                {locale === 'zh' ? '便携暖宝宝、耳机、温水...' : 'Portable warmers, headphones, warm water...'}
              </p>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <Users className="w-4 sm:w-5 h-4 sm:h-5 text-pink-600 mr-2" />
                <span className="font-medium text-neutral-800 text-sm sm:text-base">
                  {locale === 'zh' ? '社交场景' : 'Social Scenario'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                {locale === 'zh' ? '迷你暖贴、舒适衣物、围巾...' : 'Mini heat patches, comfortable clothes, scarf...'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/scenario-solutions/emergency-kit`}
              className="inline-flex items-center justify-center bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <Package className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              {locale === 'zh' ? '查看完整应急包清单' : 'View Complete Emergency Kit List'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-neutral-100 p-4 sm:p-6 md:p-8 rounded-xl text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '开始您的个性化痛经管理之旅' : 'Start Your Personalized Pain Management Journey'}
        </h2>
        <p className="text-neutral-700 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          {locale === 'zh'
            ? '结合我们的症状评估工具和疼痛追踪系统，为您量身定制最适合的场景化解决方案。'
            : 'Combine our symptom assessment tools and pain tracking system to create the most suitable scenario-based solutions for you.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href={`/${locale}/interactive-tools/symptom-assessment`}
            className="inline-flex items-center justify-center bg-primary-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            {locale === 'zh' ? '开始症状评估' : 'Start Symptom Assessment'}
          </Link>
          <Link
            href={`/${locale}/interactive-tools/pain-tracker`}
            className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm sm:text-base"
          >
            {locale === 'zh' ? '开始疼痛追踪' : 'Start Pain Tracking'}
          </Link>
        </div>
      </section>
    </div>
  );
}
