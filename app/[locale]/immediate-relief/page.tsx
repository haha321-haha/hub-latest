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
            {locale === 'zh'
              ? '我们理解快速缓解对于度过一天是至关重要的。这里建议的方法专注于容易获得的技巧和疗法，可以提供临时但急需的舒适感。'
              : 'We understand that finding quick relief is essential for getting through your day. The approaches suggested here focus on readily available techniques and remedies that can provide temporary but much-needed comfort.'
            }
          </p>
        </div>
      </section>

      {/* Types of Relief Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {t('typesTitle')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
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
              {locale === 'zh'
                ? '在下腹部或背部敷热可以帮助放松收缩的子宫肌肉并改善血液循环，从而缓解痉挛。'
                : 'Applying heat to the lower abdomen or back can help relax contracting uterine muscles and improve blood circulation, which may alleviate cramps.'
              }
            </p>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/heat-therapy-complete-guide`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {commonT('learnMore')} →
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
              {locale === 'zh'
                ? '轻度拉伸、散步或特定的瑜伽姿势有时可以通过改善血液循环和肌肉放松来缓解痉挛。深呼吸技巧也有助于管理疼痛。'
                : 'Light stretching, walking, or specific yoga poses can sometimes ease cramps by improving circulation and muscle relaxation. Deep breathing techniques can also help manage pain.'
              }
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
                {locale === 'zh' ? '深呼吸练习' : 'Deep Breathing Exercise'}
              </h3>
            </div>
            <p className="text-neutral-600 mb-4">
              {locale === 'zh'
                ? '通过4-7-8呼吸法激活副交感神经系统，自然降低疼痛敏感度。科学研究显示可减少40%的疼痛感知。'
                : 'Activate the parasympathetic nervous system through 4-7-8 breathing technique to naturally reduce pain sensitivity. Research shows it can reduce pain perception by 40%.'
              }
            </p>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/interactive-tools#breathing-exercise`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {locale === 'zh' ? '开始练习 →' : 'Start Practice →'}
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
              {locale === 'zh'
                ? '对身体特定穴位施压可能有助于减少疼痛信号并缓解经期痉挛。'
                : 'Applying pressure to specific points on the body may help reduce pain signals and provide relief from menstrual cramps.'
              }
            </p>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/global-traditional-menstrual-pain-relief`}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                {commonT('learnMore')} →
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
              {locale === 'zh'
                ? '了解常见的非处方药选项及其基本机制可能会有所帮助，尽管专业医疗建议对于安全有效使用至关重要。'
                : 'Understanding common non-prescription options and their basic mechanisms can be helpful, although professional medical advice is crucial for safe and effective use.'
              }
            </p>
            <div className="flex justify-end">
              <Link
                href={`/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`}
                className="text-neutral-600 hover:text-neutral-700 font-medium"
              >
                {commonT('learnMore')} →
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
          {locale === 'zh'
            ? '请记住，这些方法是为了在当下管理症状。对于持续、严重或异常的疼痛，请务必咨询医疗专业人士。'
            : 'Remember, these methods are for managing symptoms in the moment. For persistent, severe, or unusual pain, always consult a healthcare professional.'
          }
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
              {locale === 'zh' ? '工作中管理痉挛的快速技巧' : 'Quick Tips for Managing Cramps at Work'}
            </h3>
            <p className="text-neutral-600 mb-4">
              {locale === 'zh'
                ? '当经期疼痛来袭时，在工作日寻找缓解的实用策略。'
                : 'Practical strategies for finding relief during your workday when period pain strikes.'
              }
            </p>
            <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
              {commonT('readMore')} →
            </span>
          </div>

          <div className="card group block">
            <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700 mb-2">
              {locale === 'zh' ? '5分钟疼痛缓解冥想' : '5-Minute Meditation for Pain Relief'}
            </h3>
            <p className="text-neutral-600 mb-4">
              {locale === 'zh'
                ? '专门设计用于帮助管理经期疼痛的快速引导冥想练习。'
                : 'A quick guided meditation practice designed specifically to help manage menstrual pain.'
              }
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
            {locale === 'zh' ? '免责声明：' : 'Disclaimer:'}
          </strong>
          {locale === 'zh'
            ? '本页面提供的信息仅供教育目的，不旨在替代专业医疗建议、诊断或治疗。如有任何医疗问题，请务必咨询您的医生或其他合格的医疗保健提供者。'
            : 'The information provided on this page is for educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.'
          }
        </p>
      </section>
    </div>
  );
}
