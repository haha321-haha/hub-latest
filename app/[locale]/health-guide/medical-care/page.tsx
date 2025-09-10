import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/i18n';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? '何时寻求帮助 - 痛经健康指南' : 'When to Seek Help - Health Guide';
  const description = locale === 'zh' 
    ? '识别需要医疗关注的症状和情况，了解何时应该寻求专业医疗帮助。'
    : 'Recognize symptoms and situations that require medical attention, understand when to seek professional medical help.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MedicalCarePage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {locale === 'zh' ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">›</span>
            <Link href={`/${locale}/health-guide`} className="hover:text-primary-600">
              {locale === 'zh' ? '痛经健康指南' : 'Health Guide'}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">
              {locale === 'zh' ? '何时寻求帮助' : 'When to Seek Help'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '何时寻求医疗帮助' : 'When to Seek Medical Help'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '识别需要医疗关注的症状和情况，了解何时应该寻求专业医疗帮助，确保您的健康安全。'
            : 'Recognize symptoms and situations that require medical attention, understand when to seek professional medical help to ensure your health and safety.'
          }
        </p>
      </header>

      {/* Emergency Signs */}
      <section className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-xl">
        <h2 className="text-2xl font-semibold text-red-800 mb-6">
          {locale === 'zh' ? '紧急警告信号' : 'Emergency Warning Signs'}
        </h2>
        <p className="text-red-700 mb-6">
          {locale === 'zh'
            ? '如果您出现以下任何症状，请立即寻求紧急医疗帮助：'
            : 'If you experience any of the following symptoms, seek emergency medical help immediately:'
          }
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">
              {locale === 'zh' ? '严重疼痛症状' : 'Severe Pain Symptoms'}
            </h3>
            <ul className="space-y-2 text-red-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '突然出现的剧烈腹痛' : 'Sudden severe abdominal pain'}
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '疼痛伴随高热（38.5°C以上）' : 'Pain with high fever (above 38.5°C)'}
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '无法忍受的疼痛，影响呼吸' : 'Unbearable pain affecting breathing'}
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-3">
              {locale === 'zh' ? '其他紧急症状' : 'Other Emergency Symptoms'}
            </h3>
            <ul className="space-y-2 text-red-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '大量出血（每小时更换超过1片卫生巾）' : 'Heavy bleeding (changing more than 1 pad per hour)'}
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '持续呕吐，无法进食' : 'Persistent vomiting, unable to eat'}
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '晕厥或意识模糊' : 'Fainting or confusion'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* When to See a Doctor */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '何时预约医生' : 'When to Schedule a Doctor Visit'}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '疼痛模式改变' : 'Pain Pattern Changes'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '疼痛突然加重' : 'Pain suddenly worsens'}</li>
              <li>• {locale === 'zh' ? '疼痛持续时间延长' : 'Pain duration increases'}</li>
              <li>• {locale === 'zh' ? '疼痛性质发生变化' : 'Pain character changes'}</li>
              <li>• {locale === 'zh' ? '非月经期也出现疼痛' : 'Pain occurs outside menstruation'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '治疗无效' : 'Treatment Ineffective'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '非处方药物无法缓解' : 'OTC medications don\'t help'}</li>
              <li>• {locale === 'zh' ? '自然疗法效果不佳' : 'Natural therapies ineffective'}</li>
              <li>• {locale === 'zh' ? '疼痛影响日常生活' : 'Pain affects daily life'}</li>
              <li>• {locale === 'zh' ? '需要频繁请假' : 'Frequent absences needed'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '伴随症状' : 'Accompanying Symptoms'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '异常阴道分泌物' : 'Abnormal vaginal discharge'}</li>
              <li>• {locale === 'zh' ? '月经周期不规律' : 'Irregular menstrual cycles'}</li>
              <li>• {locale === 'zh' ? '性交疼痛' : 'Pain during intercourse'}</li>
              <li>• {locale === 'zh' ? '排尿或排便疼痛' : 'Pain during urination/defecation'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Preparing for Your Visit */}
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '就诊准备' : 'Preparing for Your Visit'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              {locale === 'zh' ? '记录症状' : 'Track Your Symptoms'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '疼痛强度（1-10分）' : 'Pain intensity (1-10 scale)'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '疼痛位置和性质' : 'Pain location and character'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '持续时间和频率' : 'Duration and frequency'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '触发因素和缓解因素' : 'Triggers and relief factors'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '月经周期详情' : 'Menstrual cycle details'}
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              {locale === 'zh' ? '准备问题' : 'Prepare Questions'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '我的症状可能的原因是什么？' : 'What could be causing my symptoms?'}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '需要做哪些检查？' : 'What tests do I need?'}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '有哪些治疗选择？' : 'What treatment options are available?'}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '生活方式改变能帮助吗？' : 'Can lifestyle changes help?'}
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '何时需要复诊？' : 'When should I follow up?'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Types of Healthcare Providers */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '医疗专业人士类型' : 'Types of Healthcare Providers'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-primary-600 mb-3">
              {locale === 'zh' ? '全科医生' : 'General Practitioner'}
            </h3>
            <p className="text-neutral-600 mb-3 text-sm">
              {locale === 'zh'
                ? '初步评估和基础治疗，适合轻度到中度症状。'
                : 'Initial assessment and basic treatment, suitable for mild to moderate symptoms.'
              }
            </p>
            <div className="text-xs text-neutral-500">
              {locale === 'zh' ? '适用于：常规检查、初步诊断' : 'Good for: Routine check-ups, initial diagnosis'}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-600 mb-3">
              {locale === 'zh' ? '妇科医生' : 'Gynecologist'}
            </h3>
            <p className="text-neutral-600 mb-3 text-sm">
              {locale === 'zh'
                ? '专门处理女性生殖健康问题，适合复杂或严重症状。'
                : 'Specializes in women\'s reproductive health, suitable for complex or severe symptoms.'
              }
            </p>
            <div className="text-xs text-neutral-500">
              {locale === 'zh' ? '适用于：专业诊断、手术治疗' : 'Good for: Specialized diagnosis, surgical treatment'}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-accent-600 mb-3">
              {locale === 'zh' ? '疼痛专科医生' : 'Pain Specialist'}
            </h3>
            <p className="text-neutral-600 mb-3 text-sm">
              {locale === 'zh'
                ? '专门治疗慢性疼痛，适合难治性痛经。'
                : 'Specializes in chronic pain treatment, suitable for refractory dysmenorrhea.'
              }
            </p>
            <div className="text-xs text-neutral-500">
              {locale === 'zh' ? '适用于：慢性疼痛管理' : 'Good for: Chronic pain management'}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '就诊时的期望' : 'What to Expect During Your Visit'}
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                {locale === 'zh' ? '病史询问' : 'Medical History'}
              </h3>
              <p className="text-neutral-600 text-sm">
                {locale === 'zh'
                  ? '医生会详细询问您的症状、月经史、家族史和既往治疗情况。'
                  : 'The doctor will ask detailed questions about your symptoms, menstrual history, family history, and previous treatments.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-secondary-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                {locale === 'zh' ? '体格检查' : 'Physical Examination'}
              </h3>
              <p className="text-neutral-600 text-sm">
                {locale === 'zh'
                  ? '可能包括腹部检查和盆腔检查（如果需要）。'
                  : 'May include abdominal examination and pelvic examination (if necessary).'
                }
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-accent-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">
                {locale === 'zh' ? '诊断和治疗计划' : 'Diagnosis and Treatment Plan'}
              </h3>
              <p className="text-neutral-600 text-sm">
                {locale === 'zh'
                  ? '医生会解释可能的诊断，讨论治疗选择，并制定个性化治疗计划。'
                  : 'The doctor will explain possible diagnoses, discuss treatment options, and develop a personalized treatment plan.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
        <h3 className="font-semibold text-yellow-800 mb-3">
          {locale === 'zh' ? '重要提醒' : 'Important Reminders'}
        </h3>
        <ul className="space-y-2 text-yellow-700 text-sm">
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2 mt-1">•</span>
            {locale === 'zh' ? '不要因为"这是正常的"而忽视严重疼痛' : 'Don\'t ignore severe pain because "it\'s normal"'}
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2 mt-1">•</span>
            {locale === 'zh' ? '相信自己的身体感受' : 'Trust your body\'s signals'}
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2 mt-1">•</span>
            {locale === 'zh' ? '如果第一位医生没有认真对待您的症状，寻求第二意见' : 'If the first doctor doesn\'t take your symptoms seriously, seek a second opinion'}
          </li>
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2 mt-1">•</span>
            {locale === 'zh' ? '早期诊断和治疗通常效果更好' : 'Early diagnosis and treatment usually work better'}
          </li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide/lifestyle`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '上一章：生活方式管理' : 'Previous: Lifestyle Management'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide/myths-facts`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '下一章：误区与事实' : 'Next: Myths vs Facts'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
        </div>
      </div>
    </div>
  );
}
