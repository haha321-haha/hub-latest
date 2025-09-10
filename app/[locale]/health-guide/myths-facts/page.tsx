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
  const title = locale === 'zh' ? '误区与事实 - 痛经健康指南' : 'Myths vs Facts - Health Guide';
  const description = locale === 'zh' 
    ? '澄清关于经期健康的常见误解，用科学事实替代错误观念。'
    : 'Clarify common misconceptions about menstrual health, replace false beliefs with scientific facts.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function MythsFactsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const mythsFacts = [
    {
      myth: locale === 'zh' 
        ? '痛经是正常的，女性必须忍受'
        : 'Period pain is normal and women must endure it',
      fact: locale === 'zh'
        ? '虽然轻微的不适是常见的，但严重的痛经不是正常的，有很多有效的治疗方法可以缓解疼痛。'
        : 'While mild discomfort is common, severe period pain is not normal, and there are many effective treatments available to relieve pain.',
      category: locale === 'zh' ? '疼痛认知' : 'Pain Perception'
    },
    {
      myth: locale === 'zh'
        ? '运动会加重痛经'
        : 'Exercise makes period pain worse',
      fact: locale === 'zh'
        ? '适度的运动实际上可以缓解痛经，因为它促进血液循环并释放天然的止痛物质内啡肽。'
        : 'Moderate exercise can actually relieve period pain by promoting blood circulation and releasing natural pain-relieving endorphins.',
      category: locale === 'zh' ? '运动与健康' : 'Exercise & Health'
    },
    {
      myth: locale === 'zh'
        ? '热敷没有科学依据'
        : 'Heat therapy has no scientific basis',
      fact: locale === 'zh'
        ? '研究表明，热敷可以放松子宫肌肉，减少痉挛，其效果与某些止痛药相当。'
        : 'Studies show that heat therapy can relax uterine muscles and reduce cramping, with effects comparable to some pain medications.',
      category: locale === 'zh' ? '治疗方法' : 'Treatment Methods'
    },
    {
      myth: locale === 'zh'
        ? '痛经会随着年龄自然消失'
        : 'Period pain naturally disappears with age',
      fact: locale === 'zh'
        ? '虽然有些女性的痛经可能会随年龄减轻，但这并不适用于所有人。继发性痛经可能随年龄加重。'
        : 'While some women may experience less pain with age, this doesn\'t apply to everyone. Secondary dysmenorrhea may worsen with age.',
      category: locale === 'zh' ? '年龄因素' : 'Age Factors'
    },
    {
      myth: locale === 'zh'
        ? '只有药物才能有效缓解痛经'
        : 'Only medications can effectively relieve period pain',
      fact: locale === 'zh'
        ? '许多非药物方法如瑜伽、按摩、饮食调整、草药茶等都有科学证据支持其缓解痛经的效果。'
        : 'Many non-medication approaches like yoga, massage, dietary changes, and herbal teas have scientific evidence supporting their effectiveness in relieving period pain.',
      category: locale === 'zh' ? '治疗选择' : 'Treatment Options'
    },
    {
      myth: locale === 'zh'
        ? '痛经是心理作用'
        : 'Period pain is psychological',
      fact: locale === 'zh'
        ? '痛经有明确的生理基础，主要由前列腺素引起的子宫收缩导致。这是真实的生理疼痛。'
        : 'Period pain has a clear physiological basis, mainly caused by uterine contractions triggered by prostaglandins. This is real physical pain.',
      category: locale === 'zh' ? '疼痛本质' : 'Nature of Pain'
    }
  ];

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
              {locale === 'zh' ? '误区与事实' : 'Myths vs Facts'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '误区与事实' : 'Myths vs Facts'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '澄清关于经期健康的常见误解，用科学事实替代错误观念，帮助您做出明智的健康决策。'
            : 'Clarify common misconceptions about menstrual health, replace false beliefs with scientific facts to help you make informed health decisions.'
          }
        </p>
      </header>

      {/* Introduction */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '为什么澄清误区很重要？' : 'Why Clarifying Myths Matters'}
        </h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          {locale === 'zh'
            ? '关于经期健康的错误信息可能导致不必要的痛苦、延误治疗，甚至影响女性的生活质量。通过了解科学事实，您可以：'
            : 'Misinformation about menstrual health can lead to unnecessary suffering, delayed treatment, and even impact women\'s quality of life. By understanding scientific facts, you can:'
          }
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '做出更好的健康决策' : 'Make better health decisions'}
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '及时寻求适当的治疗' : 'Seek appropriate treatment promptly'}
            </li>
          </ul>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '避免无效或有害的做法' : 'Avoid ineffective or harmful practices'}
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '提高整体生活质量' : 'Improve overall quality of life'}
            </li>
          </ul>
        </div>
      </section>

      {/* Myths vs Facts */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-8 text-center">
          {locale === 'zh' ? '常见误区澄清' : 'Common Myth Clarifications'}
        </h2>
        
        <div className="space-y-6">
          {mythsFacts.map((item, index) => (
            <div key={index} className="card">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h3 className="font-semibold text-red-800">
                      {locale === 'zh' ? '误区' : 'Myth'}
                    </h3>
                  </div>
                  <p className="text-red-700 text-sm">
                    {item.myth}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-semibold text-green-800">
                      {locale === 'zh' ? '事实' : 'Fact'}
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    {item.fact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Myths */}
      <section className="bg-gradient-to-br from-purple-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '文化相关的误区' : 'Culture-Related Myths'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">
              {locale === 'zh' ? '传统观念' : 'Traditional Beliefs'}
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>{locale === 'zh' ? '误区：' : 'Myth:'}</strong>
                  {locale === 'zh' ? '经期不能洗头、洗澡' : 'Cannot wash hair or bathe during menstruation'}
                </p>
                <p className="text-xs text-neutral-500">
                  {locale === 'zh' ? '事实：保持清洁有助于健康和舒适' : 'Fact: Maintaining cleanliness helps health and comfort'}
                </p>
              </div>
              
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>{locale === 'zh' ? '误区：' : 'Myth:'}</strong>
                  {locale === 'zh' ? '经期不能运动' : 'Cannot exercise during menstruation'}
                </p>
                <p className="text-xs text-neutral-500">
                  {locale === 'zh' ? '事实：适度运动有助于缓解症状' : 'Fact: Moderate exercise helps relieve symptoms'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              {locale === 'zh' ? '现代误解' : 'Modern Misconceptions'}
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>{locale === 'zh' ? '误区：' : 'Myth:'}</strong>
                  {locale === 'zh' ? '止痛药会成瘾' : 'Pain medications are addictive'}
                </p>
                <p className="text-xs text-neutral-500">
                  {locale === 'zh' ? '事实：按医嘱使用非处方止痛药是安全的' : 'Fact: Using OTC pain medications as directed is safe'}
                </p>
              </div>
              
              <div className="border-l-4 border-red-300 pl-4">
                <p className="text-sm text-neutral-600 mb-1">
                  <strong>{locale === 'zh' ? '误区：' : 'Myth:'}</strong>
                  {locale === 'zh' ? '自然疗法没有副作用' : 'Natural remedies have no side effects'}
                </p>
                <p className="text-xs text-neutral-500">
                  {locale === 'zh' ? '事实：任何治疗都可能有副作用，需要谨慎使用' : 'Fact: Any treatment can have side effects, use with caution'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence-Based Information */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '如何识别可靠信息' : 'How to Identify Reliable Information'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '可靠来源' : 'Reliable Sources'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '同行评议的医学期刊' : 'Peer-reviewed medical journals'}</li>
              <li>• {locale === 'zh' ? '权威医疗机构' : 'Authoritative medical institutions'}</li>
              <li>• {locale === 'zh' ? '专业医疗网站' : 'Professional medical websites'}</li>
              <li>• {locale === 'zh' ? '合格的医疗专业人士' : 'Qualified healthcare professionals'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '警惕信号' : 'Warning Signs'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '声称"奇迹治愈"' : 'Claims of "miracle cures"'}</li>
              <li>• {locale === 'zh' ? '缺乏科学证据' : 'Lack of scientific evidence'}</li>
              <li>• {locale === 'zh' ? '个人轶事作为证据' : 'Personal anecdotes as evidence'}</li>
              <li>• {locale === 'zh' ? '推销特定产品' : 'Promoting specific products'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '验证方法' : 'Verification Methods'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li>• {locale === 'zh' ? '查看多个来源' : 'Check multiple sources'}</li>
              <li>• {locale === 'zh' ? '寻找科学研究支持' : 'Look for scientific research support'}</li>
              <li>• {locale === 'zh' ? '咨询医疗专业人士' : 'Consult healthcare professionals'}</li>
              <li>• {locale === 'zh' ? '保持批判性思维' : 'Maintain critical thinking'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Action Steps */}
      <section className="bg-accent-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '行动建议' : 'Action Steps'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-accent-600 mb-4">
              {locale === 'zh' ? '个人行动' : 'Personal Actions'}
            </h3>
            <ol className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">1.</span>
                {locale === 'zh' ? '质疑您听到的关于经期的"常识"' : 'Question "common knowledge" about periods you hear'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">2.</span>
                {locale === 'zh' ? '寻找可靠的医学信息来源' : 'Seek reliable medical information sources'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">3.</span>
                {locale === 'zh' ? '与医疗专业人士讨论您的疑虑' : 'Discuss your concerns with healthcare professionals'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">4.</span>
                {locale === 'zh' ? '分享准确信息，帮助他人' : 'Share accurate information to help others'}
              </li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">
              {locale === 'zh' ? '教育他人' : 'Educating Others'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '与朋友和家人分享科学事实' : 'Share scientific facts with friends and family'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '纠正社交媒体上的错误信息' : 'Correct misinformation on social media'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '支持经期健康教育' : 'Support menstrual health education'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '鼓励开放讨论' : 'Encourage open discussions'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide/medical-care`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '上一章：何时寻求帮助' : 'Previous: When to Seek Help'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide/global-perspectives`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '下一章：全球视角' : 'Next: Global Perspectives'}
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
