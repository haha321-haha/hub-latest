import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'medicationGuide' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      '痛经安全用药', '布洛芬使用指南', '萘普生剂量', 'NSAID药物', '经期疼痛药物',
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

export default function MedicationGuidePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('medicationGuide');
  const commonT = useTranslations('common');
  
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
