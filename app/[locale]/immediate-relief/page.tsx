import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'immediateReliefPage' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      '痛经怎么缓解', '痛经剧痛急救指南', '痛经紧急处理', '经期疼痛缓解', '热敷疗法', '穴位按摩',
      '热敷', '敷热水袋', '暖宝宝', '按摩', '揉肚子', '止痛药',
      'period pain emergency relief', 'immediate period pain relief', 'heat therapy for cramps'
    ],
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/immediate-relief`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/immediate-relief',
        'en-US': 'https://www.periodhub.health/en/immediate-relief',
        'x-default': 'https://www.periodhub.health/zh/immediate-relief',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'article',
      publishedTime: new Date().toISOString(),
    },
  };
}

export default async function ImmediateReliefPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  // Get translations for the immediate relief page
  const t = await getTranslations({ locale, namespace: 'immediateReliefPage' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  
  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": t('title'),
    "description": t('description'),
    "medicalAudience": "Patient",
    "about": {
      "@type": "MedicalCondition",
      "name": "Dysmenorrhea"
    },
    "mainEntity": {
      "@type": "HowTo",
      "name": "痛经紧急缓解5步法",
      "description": "医生认证的痛经紧急缓解方法",
      "step": [
        {
          "@type": "HowToStep",
          "name": "热敷疗法",
          "text": "40-45°C热敷下腹部15-20分钟"
        },
        {
          "@type": "HowToStep", 
          "name": "呼吸练习",
          "text": "4-7-8呼吸法，激活副交感神经系统"
        },
        {
          "@type": "HowToStep",
          "name": "穴位按摩",
          "text": "按摩关元穴、三阴交等穴位"
        },
        {
          "@type": "HowToStep",
          "name": "药物使用",
          "text": "按医嘱使用NSAID类药物"
        },
        {
          "@type": "HowToStep",
          "name": "就医指征",
          "text": "疼痛≥7分或出现异常症状时立即就医"
        }
      ]
    }
  };
  
  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="container space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: '即时缓解', href: `/${locale}/immediate-relief` }
          ]}
        />
        
        {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </header>

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {t('introTitle')}
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            {t('introText')}
          </p>
          <p className="text-neutral-700 leading-relaxed mt-4">
            {t('introText2')}
          </p>
        </div>
      </section>

      {/* Types of Relief Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('typesTitle')}
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Heat Therapy */}
          <div className="card border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white min-h-[200px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-700">🔥 {t('heatTherapy')}</h3>
                <p className="text-red-600 font-medium">科学验证的首选缓解方法</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('heatTherapyDescription')}
            </p>
            
            {/* 科学参数显示 */}
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-primary-800 mb-2">
                {t('parameters.scientificParameters')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>{t('labels.temperature')}</strong>{t('parameters.heatTherapy.temperature')}</div>
                <div><strong>{t('labels.duration')}</strong>{t('parameters.heatTherapy.duration')}</div>
                <div><strong>{t('labels.frequency')}</strong>{t('parameters.heatTherapy.frequency')}</div>
                <div><strong>{t('labels.timing')}</strong>{t('parameters.heatTherapy.timing')}</div>
              </div>
              <p className="text-xs text-primary-700 mt-2">
                <strong>{t('labels.mechanism')}</strong>{t('parameters.heatTherapy.mechanism')}
              </p>
            </div>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/heat-therapy-complete-guide`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('actions.learnMore')}
              </Link>
            </div>
          </div>

          {/* Gentle Movement */}
          <div className="card border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white min-h-[200px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-700">🧘‍♀️ {t('gentleMovement')}</h3>
                <p className="text-green-600 font-medium">温和有效的自然缓解方法</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('gentleMovementDescription')}
            </p>
            
            {/* 瑜伽体式详情 */}
            <div className="bg-secondary-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-secondary-800 mb-3">{t('gentleMovementDetails.yogaPoses.title')}</h4>
              <div className="space-y-3">
                {t.raw('gentleMovementDetails.yogaPoses.poses').map((pose: any, index: number) => (
                  <div key={index} className="border-l-2 border-secondary-300 pl-3">
                    <h5 className="font-medium text-secondary-700">{pose.name}</h5>
                    <p className="text-sm text-secondary-600 mb-1">{pose.description}</p>
                    <p className="text-xs text-secondary-500">{pose.benefits}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 呼吸练习详情 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-3">{t('gentleMovementDetails.breathingExercises.title')}</h4>
              <div className="space-y-2">
                {t.raw('gentleMovementDetails.breathingExercises.exercises').map((exercise: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-300 pl-3">
                    <h5 className="font-medium text-blue-700">{exercise.name}</h5>
                    <p className="text-sm text-blue-600 mb-1">{exercise.steps}</p>
                    <p className="text-xs text-blue-500">{exercise.benefits}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 使用时机建议 */}
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <h4 className="font-semibold text-green-800 mb-2">{t('gentleMovementDetails.timing.title')}</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>• {t('gentleMovementDetails.timing.preventive')}</p>
                <p>• {t('gentleMovementDetails.timing.during')}</p>
                <p>• {t('gentleMovementDetails.timing.continuous')}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/5-minute-period-pain-relief`}
                className="text-secondary-600 hover:text-secondary-700 font-medium"
              >
                {commonT('learnMore')} →
              </Link>
            </div>
          </div>

          {/* Breathing Exercise */}
          <div className="card border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white min-h-[200px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700">🫁 {t('breathingExerciseTitle')}</h3>
                <p className="text-blue-600 font-medium">科学验证的神经系统调节方法</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('breathingExerciseDescription')}
            </p>
            
            {/* 呼吸练习科学参数 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {t('parameters.breathing.title')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>{t('labels.technique')}</strong>{t('parameters.breathing.technique')}</div>
                <div><strong>{t('labels.cycles')}</strong>{t('parameters.breathing.cycles')}</div>
                <div><strong>{t('labels.frequency')}</strong>{t('parameters.breathing.frequency')}</div>
                <div><strong>{t('labels.timing')}</strong>{t('parameters.breathing.timing')}</div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                <strong>{t('labels.mechanism')}</strong>{t('parameters.breathing.mechanism')}
              </p>
            </div>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/interactive-tools#breathing-exercise`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
{t('actions.startPractice')}
              </Link>
            </div>
          </div>

          {/* Acupressure */}
          <div className="card border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white min-h-[200px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-700">👐 {t('acupressure')}</h3>
                <p className="text-purple-600 font-medium">中医传统与现代医学认可的方法</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('acupressureDescription')}
            </p>
            
            {/* 穴位详情 */}
            <div className="bg-accent-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-accent-800 mb-3">{t('acupressureDetails.title')}</h4>
              <div className="space-y-3">
                {t.raw('acupressureDetails.acupoints').map((point: any, index: number) => (
                  <div key={index} className="border-l-2 border-accent-300 pl-3">
                    <h5 className="font-medium text-accent-700">{point.name}</h5>
                    <p className="text-sm text-accent-600 mb-1"><strong>位置：</strong>{point.location}</p>
                    <p className="text-sm text-accent-600 mb-1"><strong>方法：</strong>{point.method}</p>
                    <p className="text-xs text-accent-500">{point.benefits}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 按摩手法指导 */}
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-800 mb-3">{t('acupressureDetails.technique.title')}</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <p>• {t('acupressureDetails.technique.pressure')}</p>
                <p>• {t('acupressureDetails.technique.time')}</p>
                <p>• {t('acupressureDetails.technique.frequency')}</p>
                <p className="text-xs text-purple-600 mt-2">{t('acupressureDetails.technique.precautions')}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/global-traditional-menstrual-pain-relief`}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                {t('actions.learnMore')}
              </Link>
            </div>
          </div>

          {/* OTC Options */}
          <div className="card border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white min-h-[200px]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-orange-700">💊 {t('otcOptions')}</h3>
                <p className="text-orange-600 font-medium">安全有效的药物缓解方案</p>
              </div>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('otcOptionsDescription')}
            </p>
            
            {/* NSAID科学参数 */}
            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-neutral-800 mb-2">
                {t('parameters.nsaid.title')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><strong>{t('labels.dosage')}</strong>{t('parameters.nsaid.dosage')}</div>
                <div><strong>{t('labels.timing')}</strong>{t('parameters.nsaid.timing')}</div>
              </div>
              <p className="text-xs text-neutral-700 mt-2">
                <strong>{t('labels.mechanism')}</strong>{t('parameters.nsaid.mechanism')}
              </p>
              <p className="text-xs text-red-600 mt-1">
                <strong>{t('labels.contraindications')}</strong>{t('parameters.nsaid.contraindications')}
              </p>
            </div>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`}
                className="text-neutral-600 hover:text-neutral-700 font-medium"
              >
                {t('actions.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Combination Therapy Section */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {t('combinationTherapy.title')}
        </h2>
        <p className="text-neutral-700 mb-6">
          {t('combinationTherapy.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.raw('combinationTherapy.combinations').map((combination: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                {combination.level}
              </h3>
              <div className="space-y-2 mb-4">
                {combination.methods.map((method: string, methodIndex: number) => (
                  <div key={methodIndex} className="flex items-center text-sm text-purple-600">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    {method}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-600">
                {combination.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Response Section */}
      <section className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-lg">
        <h2 className="text-2xl font-semibold text-red-800 mb-4">
          {t('emergencyResponse.title')}
        </h2>
        <p className="text-red-700 mb-6">
          {t('emergencyResponse.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4">立即行动清单</h3>
            <ul className="space-y-2">
              {t.raw('emergencyResponse.immediateActions').map((action: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-red-600">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Indicators */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4">{t('emergencyResponse.medicalIndicators.title')}</h3>
            <ul className="space-y-2">
              {t.raw('emergencyResponse.medicalIndicators.indicators').map((indicator: string, index: number) => (
                <li key={index} className="flex items-start text-sm text-red-600">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Kit */}
        <div className="mt-6 bg-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-4">{t('emergencyResponse.emergencyKit.title')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {t.raw('emergencyResponse.emergencyKit.items').map((item: string, index: number) => (
              <div key={index} className="flex items-center text-sm text-red-600">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finding What Works Section */}
      <section className="bg-neutral-100 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {t('findingWhatWorksTitle')}
        </h2>
        <p className="text-neutral-700 leading-relaxed">
          {t('findingWhatWorksText')}
        </p>
        <p className="text-neutral-700 leading-relaxed mt-4">
          {t('findingWhatWorksText2')}
        </p>
      </section>

      {/* Related Content Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('contentSectionTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card group block">
            <Link href={`/${locale}/scenario-solutions/emergency-kit`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">📦</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  {t('workTipsTitle')}
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                {t('workTipsDescription')}
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>

          <div className="card group block">
            <Link href={`/${locale}/interactive-tools/symptom-assessment`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">📊</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  {t('meditationTitle')}
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                {t('meditationDescription')}
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>

          {/* 新增：NSAIDs药物指南卡片 */}
          <div className="card group block">
            <Link href={`/${locale}/downloads/medication-guide`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🧮</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  NSAIDs痛经治疗专业指南
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                包含互动式用药计算器，帮您精准计算安全剂量
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>

          {/* 新增：生活场景全覆盖卡片 */}
          <div className="card group block">
            <Link href={`/${locale}/scenario-solutions`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🏠</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  生活场景全覆盖
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                从居家到外出，全方位经期不适解决方案
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>

          {/* 新增：热敷疗法指南卡片 */}
          <div className="card group block">
            <Link href={`/${locale}/articles/heat-therapy-complete-guide`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🔥</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  热敷疗法指南
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                科学热敷方法，快速缓解经期疼痛
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>

          {/* 新增：饮食调理方案卡片 */}
          <div className="card group block">
            <Link href={`/${locale}/articles/period-friendly-recipes`}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🥗</span>
                <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                  饮食调理方案
                </h3>
              </div>
              <p className="text-neutral-600 mb-4">
                经期营养搭配，从内而外缓解不适
              </p>
              <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                {commonT('readMore')} →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
        <p className="text-neutral-700">
          <strong className="text-primary-700">
            {t('disclaimerTitle')}
          </strong>
          {t('disclaimerText')}
        </p>
      </section>
      </div>
    </>
  );
}
