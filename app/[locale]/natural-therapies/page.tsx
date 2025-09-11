import Link from 'next/link';
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import BottomRecommendations from '@/components/BottomRecommendations';

// SEO Metadata - 实现你建议的长标题策略
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'naturalTherapiesPage' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords').split(','),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://www.periodhub.health/${locale}/natural-therapies`,
      siteName: 'PeriodHub',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/natural-therapies`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/natural-therapies',
        'en-US': 'https://www.periodhub.health/en/natural-therapies',
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

// 增强的结构化数据 - 医疗网页Schema
const getStructuredData = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: 'naturalTherapiesPage' });
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `https://www.periodhub.health/${locale}/natural-therapies#webpage`,
        "name": t('meta.title'),
        "description": t('meta.description'),
        "url": `https://www.periodhub.health/${locale}/natural-therapies`,
        "medicalAudience": {
          "@type": "MedicalAudience",
          "audienceType": "Patient"
        },
        "about": {
          "@type": "MedicalCondition",
          "name": t('faq.dysmenorrhea')
        },
        "lastReviewed": "2025-08-16",
        "reviewedBy": {
          "@type": "Organization",
          "name": "PeriodHub Medical Team"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.periodhub.health/${locale}/natural-therapies#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": t('faq.effectiveTherapies'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('faq.effectiveTherapiesAnswer')
            }
          },
          {
            "@type": "Question",
            "name": t('faq.timeToEffect'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('faq.timeToEffectAnswer')
            }
          }
        ]
      }
    ]
  };
};

export default async function NaturalTherapiesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'naturalTherapiesPage' });
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
      
      {/* Natural Therapies Content */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 rounded-2xl">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                    {t('hero.title')}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-90 mb-6 sm:mb-8">
                    {t('hero.subtitle')}
                  </p>
                </div>
              </div>
            </section>

            {/* Scientific Foundation Section */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
                {t('scientificFoundation.title')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 text-center max-w-4xl mx-auto">
                {t('scientificFoundation.description')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🌿</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-green-700 text-sm sm:text-base">
                    {t('scientificFoundation.benefits.noSideEffects.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t('scientificFoundation.benefits.noSideEffects.description')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🔄</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-teal-700 text-sm sm:text-base">
                    {t('scientificFoundation.benefits.holisticApproach.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t('scientificFoundation.benefits.holisticApproach.description')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-blue-700 text-sm sm:text-base">
                    {t('scientificFoundation.benefits.costEffective.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t('scientificFoundation.benefits.costEffective.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Natural Therapies Content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                {t('therapies.title')}
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* 1. Heat Therapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3 sm:mr-4 mb-3 sm:mb-0">
                        <span className="text-xl sm:text-2xl">🔥</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-1">
                          {t('therapies.heatTherapy.title')}
                      </h3>
                        <p className="text-red-600 font-medium text-sm sm:text-base">
                          {t('therapies.heatTherapy.subtitle')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                      {t('therapies.heatTherapy.description')}
                    </p>
                    
                    {/* Scientific Parameters */}
                    <div className="bg-red-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                      <h4 className="font-semibold text-red-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        {t('therapies.heatTherapy.parameters.title')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div><strong>{t('therapies.heatTherapy.parameters.temperature')}</strong>{t('therapies.heatTherapy.parameters.temperatureValue')}</div>
                        <div><strong>{t('therapies.heatTherapy.parameters.duration')}</strong>{t('therapies.heatTherapy.parameters.durationValue')}</div>
                        <div><strong>{t('therapies.heatTherapy.parameters.frequency')}</strong>{t('therapies.heatTherapy.parameters.frequencyValue')}</div>
                        <div><strong>{t('therapies.heatTherapy.parameters.timing')}</strong>{t('therapies.heatTherapy.parameters.timingValue')}</div>
                      </div>
                      <p className="text-xs text-red-700 mt-3">
                        <strong>{t('therapies.heatTherapy.parameters.mechanism')}</strong>
                        {t('therapies.heatTherapy.parameters.mechanismValue')}
                      </p>
                    </div>
                    
                    {/* Scientific Mechanism */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.heatTherapy.mechanism.title')}
                      </h4>
                      <div className="space-y-3">
                        <div className="border-l-4 border-red-400 pl-4">
                          <h5 className="font-semibold text-red-700 mb-1">
                            {t('therapies.heatTherapy.mechanism.gateControl.title')}
                          </h5>
                          <p className="text-sm text-gray-700">
                            {t('therapies.heatTherapy.mechanism.gateControl.description')}
                          </p>
                  </div>
                        <div className="border-l-4 border-orange-400 pl-4">
                          <h5 className="font-semibold text-orange-700 mb-1">
                            {t('therapies.heatTherapy.mechanism.vasodilation.title')}
                          </h5>
                          <p className="text-sm text-gray-700">
                            {t('therapies.heatTherapy.mechanism.vasodilation.description')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Guidelines */}
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        {t('therapies.heatTherapy.safety.title')}
                      </h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• {t('therapies.heatTherapy.safety.guidelines.0')}</p>
                        <p>• {t('therapies.heatTherapy.safety.guidelines.1')}</p>
                        <p>• {t('therapies.heatTherapy.safety.guidelines.2')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Herbal Therapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <span className="text-2xl">🌿</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-green-700">
                          {t('therapies.herbalTherapy.title')}
                      </h3>
                        <p className="text-green-600 font-medium">
                          {t('therapies.herbalTherapy.subtitle')}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.herbalTherapy.description')}
                    </p>
                    
                    {/* Key Herbs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3">
                          {t('therapies.herbalTherapy.herbs.ginger.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.herbalTherapy.herbs.ginger.activeCompounds')}</strong>{t('therapies.herbalTherapy.herbs.ginger.activeCompoundsValue')}</p>
                          <p><strong>{t('therapies.herbalTherapy.herbs.ginger.mechanism')}</strong>{t('therapies.herbalTherapy.herbs.ginger.mechanismValue')}</p>
                          <p><strong>{t('therapies.herbalTherapy.herbs.ginger.clinicalEvidence')}</strong>{t('therapies.herbalTherapy.herbs.ginger.clinicalEvidenceValue')}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {t('therapies.herbalTherapy.herbs.angelica.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.herbalTherapy.herbs.angelica.activeCompounds')}</strong>{t('therapies.herbalTherapy.herbs.angelica.activeCompoundsValue')}</p>
                          <p><strong>{t('therapies.herbalTherapy.herbs.angelica.mechanism')}</strong>{t('therapies.herbalTherapy.herbs.angelica.mechanismValue')}</p>
                          <p><strong>{t('therapies.herbalTherapy.herbs.angelica.classicFormula')}</strong>{t('therapies.herbalTherapy.herbs.angelica.classicFormulaValue')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Usage Guidelines */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.herbalTherapy.usage.title')}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{t('therapies.herbalTherapy.usage.gingerTea.title')}</h5>
                          <p className="text-gray-700">
                            {t('therapies.herbalTherapy.usage.gingerTea.description')}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{t('therapies.herbalTherapy.usage.angelicaDecoction.title')}</h5>
                          <p className="text-gray-700">
                            {t('therapies.herbalTherapy.usage.angelicaDecoction.description')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Reminder */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        {t('therapies.herbalTherapy.safety.title')}
                      </h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <p>• {t('therapies.herbalTherapy.safety.guidelines.0')}</p>
                        <p>• {t('therapies.herbalTherapy.safety.guidelines.1')}</p>
                        <p>• {t('therapies.herbalTherapy.safety.guidelines.2')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Dietary Adjustment - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                        <span className="text-2xl">🍎</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-blue-700">
                          {t('therapies.dietaryAdjustment.title')}
                      </h3>
                        <p className="text-blue-600 font-medium">
                          {t('therapies.dietaryAdjustment.subtitle')}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.dietaryAdjustment.description')}
                    </p>
                    
                    {/* Key Nutrients Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.omega3.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.omega3.sourcesValue')}
                        </p>
                        <p className="text-xs text-blue-600">
                          {t('therapies.dietaryAdjustment.nutrients.omega3.mechanismValue')}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.magnesium.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.magnesium.sourcesValue')}
                        </p>
                        <p className="text-xs text-green-600">
                          {t('therapies.dietaryAdjustment.nutrients.magnesium.mechanismValue')}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.vitaminB6.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.dietaryAdjustment.nutrients.vitaminB6.sourcesValue')}
                        </p>
                        <p className="text-xs text-purple-600">
                          {t('therapies.dietaryAdjustment.nutrients.vitaminB6.mechanismValue')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Anti-inflammatory Foods */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.dietaryAdjustment.foods.title')}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{t('therapies.dietaryAdjustment.foods.recommended.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.dietaryAdjustment.foods.recommended.list.0')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.recommended.list.1')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.recommended.list.2')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.recommended.list.3')}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-700 mb-2">{t('therapies.dietaryAdjustment.foods.avoid.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.dietaryAdjustment.foods.avoid.list.0')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.avoid.list.1')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.avoid.list.2')}</li>
                            <li>• {t('therapies.dietaryAdjustment.foods.avoid.list.3')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Yoga & Exercise - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-purple-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-4">
                        <span className="text-2xl">🧘‍♀️</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-purple-700">
                          {t('therapies.yogaExercise.title')}
                        </h3>
                        <p className="text-purple-600 font-medium">
                          {t('therapies.yogaExercise.subtitle')}
                        </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.yogaExercise.description')}
                    </p>
                    
                    {/* Key Poses Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {t('therapies.yogaExercise.poses.title')}
                        </h4>
                        <div className="space-y-3">
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{t('therapies.yogaExercise.poses.catCow.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.yogaExercise.poses.catCow.description')}</p>
                          </div>
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{t('therapies.yogaExercise.poses.childPose.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.yogaExercise.poses.childPose.description')}</p>
                          </div>
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{t('therapies.yogaExercise.poses.supineTwist.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.yogaExercise.poses.supineTwist.description')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {t('therapies.yogaExercise.science.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.yogaExercise.science.endorphinRelease')}</strong>{t('therapies.yogaExercise.science.endorphinReleaseValue')}</p>
                          <p><strong>{t('therapies.yogaExercise.science.bloodCirculation')}</strong>{t('therapies.yogaExercise.science.bloodCirculationValue')}</p>
                          <p><strong>{t('therapies.yogaExercise.science.muscleRelaxation')}</strong>{t('therapies.yogaExercise.science.muscleRelaxationValue')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Practice Guidelines */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.yogaExercise.practice.title')}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-purple-700 mb-2">{t('therapies.yogaExercise.practice.timing.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.yogaExercise.practice.timing.1')}</li>
                            <li>• {t('therapies.yogaExercise.practice.timing.2')}</li>
                            <li>• {t('therapies.yogaExercise.practice.timing.3')}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{t('therapies.yogaExercise.practice.precautions.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.yogaExercise.practice.precautions.1')}</li>
                            <li>• {t('therapies.yogaExercise.practice.precautions.2')}</li>
                            <li>• {t('therapies.yogaExercise.practice.precautions.3')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Aromatherapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <span className="text-2xl">🌸</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-yellow-700">
                          {t('therapies.aromatherapy.title')}
                        </h3>
                        <p className="text-yellow-600 font-medium">
                          {t('therapies.aromatherapy.subtitle')}
                        </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.aromatherapy.description')}
                    </p>
                    
                    {/* Key Oils Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">
                          {t('therapies.aromatherapy.oils.lavender.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.aromatherapy.oils.lavender.effects')}
                        </p>
                        <p className="text-xs text-purple-600">
                          {t('therapies.aromatherapy.oils.lavender.mechanism')}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          {t('therapies.aromatherapy.oils.clarySage.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.aromatherapy.oils.clarySage.effects')}
                        </p>
                        <p className="text-xs text-green-600">
                          {t('therapies.aromatherapy.oils.clarySage.mechanism')}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          {t('therapies.aromatherapy.oils.romanChamomile.title')}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {t('therapies.aromatherapy.oils.romanChamomile.effects')}
                        </p>
                        <p className="text-xs text-blue-600">
                          {t('therapies.aromatherapy.oils.romanChamomile.mechanism')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Usage Methods */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.aromatherapy.usage.title')}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-yellow-700 mb-2">{t('therapies.aromatherapy.usage.massageOil.title')}</h5>
                          <p className="text-gray-700 mb-2">
                            {t('therapies.aromatherapy.usage.massageOil.recipe')}
                          </p>
                          <p className="text-xs text-gray-600">
                            {t('therapies.aromatherapy.usage.massageOil.instructions')}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{t('therapies.aromatherapy.usage.diffusion.title')}</h5>
                          <p className="text-gray-700 mb-2">
                            {t('therapies.aromatherapy.usage.diffusion.recipe')}
                          </p>
                          <p className="text-xs text-gray-600">
                            {t('therapies.aromatherapy.usage.diffusion.instructions')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Guidelines */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        {t('therapies.aromatherapy.safety.title')}
                      </h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <p>• {t('therapies.aromatherapy.safety.guidelines.0')}</p>
                        <p>• {t('therapies.aromatherapy.safety.guidelines.1')}</p>
                        <p>• {t('therapies.aromatherapy.safety.guidelines.2')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Acupuncture & Moxibustion - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mr-4">
                        <span className="text-2xl">🪡</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-orange-700">
                          {t('therapies.acupuncture.title')}
                        </h3>
                        <p className="text-orange-600 font-medium">
                          {t('therapies.acupuncture.subtitle')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.acupuncture.description')}
                    </p>
                    
                    {/* Key Acupoints */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-3">
                          {t('therapies.acupuncture.acupoints.title')}
                        </h4>
                        <div className="space-y-3">
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{t('therapies.acupuncture.acupoints.sanyinjiao.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.acupuncture.acupoints.sanyinjiao.description')}</p>
                          </div>
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{t('therapies.acupuncture.acupoints.guanyuan.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.acupuncture.acupoints.guanyuan.description')}</p>
                          </div>
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{t('therapies.acupuncture.acupoints.shenque.title')}</h5>
                            <p className="text-sm text-gray-600">{t('therapies.acupuncture.acupoints.shenque.description')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {t('therapies.acupuncture.mechanisms.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.acupuncture.mechanisms.neuralRegulation')}</strong>{t('therapies.acupuncture.mechanisms.neuralRegulationValue')}</p>
                          <p><strong>{t('therapies.acupuncture.mechanisms.endocrineRegulation')}</strong>{t('therapies.acupuncture.mechanisms.endocrineRegulationValue')}</p>
                          <p><strong>{t('therapies.acupuncture.mechanisms.evidenceBased')}</strong>{t('therapies.acupuncture.mechanisms.evidenceBasedValue')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Self-Massage Guide */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.acupuncture.selfMassage.title')}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>{t('therapies.acupuncture.selfMassage.sanyinjiao.title')}</strong>{t('therapies.acupuncture.selfMassage.sanyinjiao.instructions')}</p>
                        <p>• <strong>{t('therapies.acupuncture.selfMassage.guanyuan.title')}</strong>{t('therapies.acupuncture.selfMassage.guanyuan.instructions')}</p>
                        <p className="text-xs text-orange-600 mt-2">
                          {t('therapies.acupuncture.selfMassage.note')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Psychological Techniques - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-indigo-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-700">
                          {t('therapies.psychological.title')}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                          {t('therapies.psychological.subtitle')}
                        </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.psychological.description')}
                    </p>
                    
                    {/* Techniques Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 mb-3">
                          {t('therapies.psychological.breathing.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.psychological.breathing.steps')}</strong>{t('therapies.psychological.breathing.stepsValue')}</p>
                          <p><strong>{t('therapies.psychological.breathing.frequency')}</strong>{t('therapies.psychological.breathing.frequencyValue')}</p>
                          <p><strong>{t('therapies.psychological.breathing.effect')}</strong>{t('therapies.psychological.breathing.effectValue')}</p>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {t('therapies.psychological.mindfulness.title')}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{t('therapies.psychological.mindfulness.method')}</strong>{t('therapies.psychological.mindfulness.methodValue')}</p>
                          <p><strong>{t('therapies.psychological.mindfulness.duration')}</strong>{t('therapies.psychological.mindfulness.durationValue')}</p>
                          <p><strong>{t('therapies.psychological.mindfulness.effect')}</strong>{t('therapies.psychological.mindfulness.effectValue')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progressive Muscle Relaxation */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.psychological.muscleRelaxation.title')}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>• {t('therapies.psychological.muscleRelaxation.step1')}</p>
                        <p>• {t('therapies.psychological.muscleRelaxation.step2')}</p>
                        <p>• {t('therapies.psychological.muscleRelaxation.step3')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Comprehensive Plans - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-pink-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mr-4">
                        <span className="text-2xl">📋</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-pink-700">
                          {t('therapies.comprehensive.title')}
                      </h3>
                        <p className="text-pink-600 font-medium">
                          {t('therapies.comprehensive.subtitle')}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                      {t('therapies.comprehensive.description')}
                    </p>
                    
                    {/* Pain Level Plans */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-3">
                          {t('therapies.comprehensive.painLevels.mild.title')}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {t('therapies.comprehensive.painLevels.mild.plan1')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.mild.plan2')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.mild.plan3')}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-3">
                          {t('therapies.comprehensive.painLevels.moderate.title')}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {t('therapies.comprehensive.painLevels.moderate.plan1')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.moderate.plan2')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.moderate.plan3')}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {t('therapies.comprehensive.painLevels.severe.title')}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {t('therapies.comprehensive.painLevels.severe.plan1')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.severe.plan2')}</li>
                          <li>• {t('therapies.comprehensive.painLevels.severe.plan3')}</li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Synergistic Effects */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t('therapies.comprehensive.synergistic.title')}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{t('therapies.comprehensive.synergistic.enhancing.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.comprehensive.synergistic.enhancing.combination1')}</li>
                            <li>• {t('therapies.comprehensive.synergistic.enhancing.combination2')}</li>
                            <li>• {t('therapies.comprehensive.synergistic.enhancing.combination3')}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{t('therapies.comprehensive.synergistic.personalized.title')}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {t('therapies.comprehensive.synergistic.personalized.coldConstitution')}</li>
                            <li>• {t('therapies.comprehensive.synergistic.personalized.hotConstitution')}</li>
                            <li>• {t('therapies.comprehensive.synergistic.personalized.qiDeficiency')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence-Based Medicine Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
                {t('evidenceBased.title')}
              </h2>
              
              {/* Core Efficacy Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">92%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {t('evidenceBased.coreEfficacy.heatTherapy.title')}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t('evidenceBased.coreEfficacy.heatTherapy.source')}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">76%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {t('evidenceBased.coreEfficacy.tens.title')}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t('evidenceBased.coreEfficacy.tens.source')}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">85%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {t('evidenceBased.coreEfficacy.acupuncture.title')}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t('evidenceBased.coreEfficacy.acupuncture.source')}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">68%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {t('evidenceBased.coreEfficacy.aromatherapy.title')}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {t('evidenceBased.coreEfficacy.aromatherapy.source')}
                  </p>
                </div>
              </div>

              {/* High-Level Evidence Support */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center text-blue-700">
                  {t('evidenceBased.highLevelEvidence.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.highLevelEvidence.cochrane')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.highLevelEvidence.rct')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.highLevelEvidence.who')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.highLevelEvidence.nih')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-term Observational Studies */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center text-green-700">
                  {t('evidenceBased.longTermStudies.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.longTermStudies.study1')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.longTermStudies.study2')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.longTermStudies.study3')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                      <p className="text-gray-700">
                        {t('evidenceBased.longTermStudies.study4')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="container mx-auto px-4 py-8">
        <section className="bg-primary-50 border-l-4 border-primary-500 p-4 sm:p-6 rounded-r-lg">
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed break-words">
            <strong className="text-primary-700">
              {t('medicalDisclaimer.title')}
            </strong>
            {t('medicalDisclaimer.content')}
          </p>
        </section>
      </div>

      {/* 底部推荐工具 */}
      <BottomRecommendations currentPage="natural-therapies" />
    </>
  );
}