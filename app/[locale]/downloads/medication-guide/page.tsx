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
  const t = await getTranslations({ locale, namespace: 'medicationGuide' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      '痛经吃什么药', '痛经安全用药', '布洛芬使用指南', '萘普生剂量', 'NSAID药物', '经期疼痛药物',
      '止痛药', '热敷', '按摩', '揉肚子', '敷热水袋', '暖宝宝',
      'period pain medication', 'ibuprofen dosage', 'naproxen safety', 'NSAID guidelines'
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'article',
      publishedTime: new Date().toISOString(),
    },
  };
}

export default async function MedicationGuidePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'medicationGuide' });
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
      "@type": "Drug",
      "name": "NSAID Medications",
      "description": "Non-steroidal anti-inflammatory drugs for menstrual pain relief"
    },
    "author": {
      "@type": "Organization",
      "name": "PeriodHub",
      "description": "Board-Certified OB/GYN Reviewed Medical Content"
    },
    "reviewedBy": {
      "@type": "Person",
      "name": "Board-Certified OB/GYN",
      "jobTitle": "Medical Professional"
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: '下载中心', href: `/${locale}/downloads` },
            { label: '用药指南' }
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
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {t('introTitle')}
          </h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            {t('introText')}
          </p>
          
          {/* 权威背书 */}
          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-600">
                  <strong>医学审核：</strong>本指南内容已通过北美认证妇产科医生审核，确保信息准确性和安全性。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NSAID Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('nsaidTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ibuprofen */}
          <div className="card">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              {t('ibuprofen.title')}
            </h3>
            <div className="space-y-3">
              <div>
                <strong className="text-neutral-700">{t('dosage')}:</strong>
                <p className="text-neutral-600">{t('ibuprofen.dosage')}</p>
              </div>
              <div>
                <strong className="text-neutral-700">{t('timing')}:</strong>
                <p className="text-neutral-600">{t('ibuprofen.timing')}</p>
              </div>
              <div>
                <strong className="text-neutral-700">{t('mechanism')}:</strong>
                <p className="text-neutral-600">{t('ibuprofen.mechanism')}</p>
              </div>
            </div>
          </div>

          {/* Naproxen */}
          <div className="card">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              {t('naproxen.title')}
            </h3>
            <div className="space-y-3">
              <div>
                <strong className="text-neutral-700">{t('dosage')}:</strong>
                <p className="text-neutral-600">{t('naproxen.dosage')}</p>
              </div>
              <div>
                <strong className="text-neutral-700">{t('timing')}:</strong>
                <p className="text-neutral-600">{t('naproxen.timing')}</p>
              </div>
              <div>
                <strong className="text-neutral-700">{t('mechanism')}:</strong>
                <p className="text-neutral-600">{t('naproxen.mechanism')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">
          {t('safetyTitle')}
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-yellow-800">{t('contraindications')}:</h3>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>{t('contraindicationsList.asthma')}</li>
              <li>{t('contraindicationsList.ulcer')}</li>
              <li>{t('contraindicationsList.kidney')}</li>
              <li>{t('contraindicationsList.liver')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">{t('sideEffects')}:</h3>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              <li>{t('sideEffectsList.stomach')}</li>
              <li>{t('sideEffectsList.dizziness')}</li>
              <li>{t('sideEffectsList.headache')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Drug Comparison Table */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('comparisonTitle')}
        </h2>
        
        <div className="card mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {t('comparisonTable.headers.feature')}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {t('comparisonTable.headers.ibuprofen')}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {t('comparisonTable.headers.naproxen')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.onset.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.onset.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.onset.naproxen')}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.duration.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.duration.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.duration.naproxen')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.dosage.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.dosage.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.dosage.naproxen')}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.frequency.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.frequency.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.frequency.naproxen')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.bestFor.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.bestFor.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.bestFor.naproxen')}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                    {t('comparisonTable.rows.sideEffects.feature')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.sideEffects.ibuprofen')}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {t('comparisonTable.rows.sideEffects.naproxen')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Selection Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              {t('selectionGuide.ibuprofen.title')}
            </h3>
            <ul className="space-y-2">
              {[
                t('selectionGuide.ibuprofen.points.0'),
                t('selectionGuide.ibuprofen.points.1'),
                t('selectionGuide.ibuprofen.points.2')
              ].map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {t('selectionGuide.naproxen.title')}
            </h3>
            <ul className="space-y-2">
              {[
                t('selectionGuide.naproxen.points.0'),
                t('selectionGuide.naproxen.points.1'),
                t('selectionGuide.naproxen.points.2')
              ].map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Usage Tips */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('usageTipsTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {t('tips.timing.title')}
            </h3>
            <p className="text-neutral-600">
              {t('tips.timing.description')}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {t('tips.food.title')}
            </h3>
            <p className="text-neutral-600">
              {t('tips.food.description')}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {t('tips.duration.title')}
            </h3>
            <p className="text-neutral-600">
              {t('tips.duration.description')}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {t('tips.alternatives.title')}
            </h3>
            <p className="text-neutral-600">
              {t('tips.alternatives.description')}
            </p>
          </div>
        </div>
      </section>

      {/* When to See a Doctor */}
      <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-4">
          {t('seeDoctorTitle')}
        </h2>
        <ul className="list-disc list-inside text-red-700 space-y-2">
          <li>{t('seeDoctorList.severe')}</li>
          <li>{t('seeDoctorList.persistent')}</li>
          <li>{t('seeDoctorList.newSymptoms')}</li>
          <li>{t('seeDoctorList.medication')}</li>
        </ul>
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

      {/* Related Tools */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('relatedToolsTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href={`/${locale}/articles/nsaid-menstrual-pain-professional-guide`}>
            <div className="card group hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 mb-2">
                    {t('relatedTools.nsaidGuide.title')}
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    {t('relatedTools.nsaidGuide.description')}
                  </p>
                  <div className="flex items-center text-sm text-blue-500 group-hover:text-blue-600">
                    <span className="mr-2">🧮</span>
                    <span>{t('relatedTools.nsaidGuide.feature')}</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href={`/${locale}/interactive-tools/symptom-assessment`}>
            <div className="card group hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-600 group-hover:text-green-700 mb-2">
                    {t('relatedTools.symptomAssessment.title')}
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    {t('relatedTools.symptomAssessment.description')}
                  </p>
                  <div className="flex items-center text-sm text-green-500 group-hover:text-green-600">
                    <span className="mr-2">📊</span>
                    <span>{t('relatedTools.symptomAssessment.feature')}</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Back to Articles */}
      <div className="text-center">
        <Link
          href={`/${locale}/articles`}
          className="btn-secondary"
        >
          {commonT('navigation.backToArticles')}
        </Link>
      </div>
      </div>
    </>
  );
}
