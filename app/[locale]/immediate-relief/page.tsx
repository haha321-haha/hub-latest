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
  const t = await getTranslations({ locale, namespace: 'immediateReliefPage' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ImmediateReliefPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Get translations for the immediate relief page
  const t = useTranslations('immediateReliefPage');
  const commonT = useTranslations('common');
  

  
  return (
    <div className="space-y-10">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Heat Therapy */}
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {t('heatTherapy')}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('heatTherapyDescription')}
            </p>
            
            {/* 科学参数显示 */}
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-primary-800 mb-2">
                {t('parameters.scientificParameters')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
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
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {t('gentleMovement')}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('gentleMovementDescription')}
            </p>
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
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {t('breathingExerciseTitle')}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('breathingExerciseDescription')}
            </p>
            
            {/* 呼吸练习科学参数 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {t('parameters.breathing.title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
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
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {t('acupressure')}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('acupressureDescription')}
            </p>
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
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">
                {t('otcOptions')}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {t('otcOptionsDescription')}
            </p>
            
            {/* NSAID科学参数 */}
            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-neutral-800 mb-2">
                {t('parameters.nsaid.title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
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
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card group block">
            <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700 mb-2">
              {t('workTipsTitle')}
            </h3>
            <p className="text-neutral-600 mb-4">
              {t('workTipsDescription')}
            </p>
            <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
              {commonT('readMore')} →
            </span>
          </div>

          <div className="card group block">
            <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700 mb-2">
              {t('meditationTitle')}
            </h3>
            <p className="text-neutral-600 mb-4">
              {t('meditationDescription')}
            </p>
            <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
              {commonT('readMore')} →
            </span>
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
  );
}
