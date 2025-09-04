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
  };
}

export default function MedicationGuidePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('medicationGuide');
  const commonT = useTranslations('common');
  
  return (
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
          <p className="text-neutral-700 leading-relaxed">
            {t('introText')}
          </p>
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
          {commonT('backToArticles')}
        </Link>
      </div>
    </div>
  );
}
