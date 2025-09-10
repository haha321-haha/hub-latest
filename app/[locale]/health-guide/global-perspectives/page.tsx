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
  const title = locale === 'zh' ? '全球视角 - 痛经健康指南' : 'Global Perspectives - Health Guide';
  const description = locale === 'zh' 
    ? '探索世界各地的传统疗法和文化观点，了解不同文化如何处理经期健康。'
    : 'Explore traditional therapies and cultural perspectives from around the world, understand how different cultures approach menstrual health.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function GlobalPerspectivesPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const globalPractices = [
    {
      region: locale === 'zh' ? '中国传统医学' : 'Traditional Chinese Medicine',
      flag: '🇨🇳',
      practices: [
        {
          name: locale === 'zh' ? '中药调理' : 'Herbal Medicine',
          description: locale === 'zh' ? '使用当归、川芎、白芍等中药材调理气血' : 'Using herbs like Angelica, Ligusticum, and Paeonia to regulate qi and blood'
        },
        {
          name: locale === 'zh' ? '针灸治疗' : 'Acupuncture',
          description: locale === 'zh' ? '通过刺激特定穴位来缓解疼痛' : 'Relieving pain by stimulating specific acupoints'
        },
        {
          name: locale === 'zh' ? '八段锦' : 'Baduanjin Qigong',
          description: locale === 'zh' ? '传统气功练习，改善血液循环' : 'Traditional qigong practice to improve blood circulation'
        }
      ]
    },
    {
      region: locale === 'zh' ? '印度阿育吠陀' : 'Indian Ayurveda',
      flag: '🇮🇳',
      practices: [
        {
          name: locale === 'zh' ? '草药疗法' : 'Herbal Remedies',
          description: locale === 'zh' ? '使用姜黄、芦荟、阿育吠陀草药' : 'Using turmeric, aloe vera, and Ayurvedic herbs'
        },
        {
          name: locale === 'zh' ? '瑜伽练习' : 'Yoga Practice',
          description: locale === 'zh' ? '特定的瑜伽体式缓解经期不适' : 'Specific yoga poses to relieve menstrual discomfort'
        },
        {
          name: locale === 'zh' ? '油按摩' : 'Oil Massage',
          description: locale === 'zh' ? '使用温热的草药油进行腹部按摩' : 'Abdominal massage with warm herbal oils'
        }
      ]
    },
    {
      region: locale === 'zh' ? '欧洲传统' : 'European Traditions',
      flag: '🇪🇺',
      practices: [
        {
          name: locale === 'zh' ? '草药茶' : 'Herbal Teas',
          description: locale === 'zh' ? '洋甘菊、薄荷、覆盆子叶茶' : 'Chamomile, peppermint, and raspberry leaf teas'
        },
        {
          name: locale === 'zh' ? '温泉疗法' : 'Spa Therapy',
          description: locale === 'zh' ? '温泉浴和泥浴缓解疼痛' : 'Hot spring baths and mud baths for pain relief'
        },
        {
          name: locale === 'zh' ? '芳香疗法' : 'Aromatherapy',
          description: locale === 'zh' ? '薰衣草、玫瑰等精油的使用' : 'Use of lavender, rose, and other essential oils'
        }
      ]
    },
    {
      region: locale === 'zh' ? '非洲传统' : 'African Traditions',
      flag: '🌍',
      practices: [
        {
          name: locale === 'zh' ? '传统草药' : 'Traditional Herbs',
          description: locale === 'zh' ? '当地植物如芦荟、生姜的应用' : 'Local plants like aloe vera and ginger applications'
        },
        {
          name: locale === 'zh' ? '热敷疗法' : 'Heat Therapy',
          description: locale === 'zh' ? '使用加热的石头或布料热敷' : 'Using heated stones or cloths for heat application'
        },
        {
          name: locale === 'zh' ? '社区支持' : 'Community Support',
          description: locale === 'zh' ? '女性群体的相互支持和知识分享' : 'Mutual support and knowledge sharing among women'
        }
      ]
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
              {locale === 'zh' ? '全球视角' : 'Global Perspectives'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '全球视角：传统疗法与文化智慧' : 'Global Perspectives: Traditional Therapies & Cultural Wisdom'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '探索世界各地的传统疗法和文化观点，了解不同文化如何处理经期健康，从中汲取智慧。'
            : 'Explore traditional therapies and cultural perspectives from around the world, understand how different cultures approach menstrual health, and draw wisdom from them.'
          }
        </p>
      </header>

      {/* Introduction */}
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '传统智慧的价值' : 'Value of Traditional Wisdom'}
        </h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          {locale === 'zh'
            ? '几千年来，世界各地的文化都发展出了独特的方法来处理经期健康。虽然现代医学提供了科学的解释和治疗方法，但传统疗法中的许多做法已经得到了现代研究的验证。'
            : 'For thousands of years, cultures around the world have developed unique approaches to menstrual health. While modern medicine provides scientific explanations and treatments, many practices from traditional therapies have been validated by modern research.'
          }
        </p>
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-2">
            {locale === 'zh' ? '整合的好处：' : 'Benefits of Integration:'}
          </h3>
          <ul className="grid md:grid-cols-2 gap-2 text-neutral-600 text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '更多治疗选择' : 'More treatment options'}
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '整体健康方法' : 'Holistic health approach'}
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '文化敏感性' : 'Cultural sensitivity'}
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              {locale === 'zh' ? '个性化治疗' : 'Personalized treatment'}
            </li>
          </ul>
        </div>
      </section>

      {/* Global Practices */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-8 text-center">
          {locale === 'zh' ? '世界各地的传统做法' : 'Traditional Practices Around the World'}
        </h2>
        
        <div className="space-y-8">
          {globalPractices.map((region, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{region.flag}</span>
                <h3 className="text-2xl font-semibold text-neutral-800">
                  {region.region}
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {region.practices.map((practice, practiceIndex) => (
                  <div key={practiceIndex} className="bg-neutral-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-600 mb-2">
                      {practice.name}
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      {practice.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scientific Validation */}
      <section className="bg-gradient-to-br from-green-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '科学验证的传统方法' : 'Scientifically Validated Traditional Methods'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              {locale === 'zh' ? '已验证的方法' : 'Validated Methods'}
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '热敷疗法' : 'Heat Therapy'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '研究证实热敷可以有效缓解子宫痉挛' : 'Research confirms heat therapy effectively relieves uterine cramps'}
                </p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '瑜伽和冥想' : 'Yoga and Meditation'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '多项研究显示瑜伽可以减轻痛经症状' : 'Multiple studies show yoga can reduce dysmenorrhea symptoms'}
                </p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '草药疗法' : 'Herbal Medicine'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '某些草药的抗炎和镇痛效果得到科学证实' : 'Anti-inflammatory and analgesic effects of certain herbs scientifically proven'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-600 mb-4">
              {locale === 'zh' ? '需要谨慎的方法' : 'Methods Requiring Caution'}
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '未经验证的草药' : 'Unvalidated Herbs'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '某些传统草药可能与现代药物相互作用' : 'Some traditional herbs may interact with modern medications'}
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '极端饮食限制' : 'Extreme Dietary Restrictions'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '过度的饮食限制可能导致营养不良' : 'Excessive dietary restrictions may lead to malnutrition'}
                </p>
              </div>
              
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '迷信做法' : 'Superstitious Practices'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '避免基于迷信而非科学的做法' : 'Avoid practices based on superstition rather than science'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Integration */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '现代整合医学方法' : 'Modern Integrative Medicine Approach'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '循证整合' : 'Evidence-Based Integration'}
            </h3>
            <p className="text-neutral-600 text-sm">
              {locale === 'zh'
                ? '结合传统智慧和现代科学，选择有证据支持的方法。'
                : 'Combine traditional wisdom with modern science, choosing evidence-supported methods.'
              }
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '个性化治疗' : 'Personalized Treatment'}
            </h3>
            <p className="text-neutral-600 text-sm">
              {locale === 'zh'
                ? '根据个人文化背景和偏好，定制最适合的治疗方案。'
                : 'Customize the most suitable treatment plan based on personal cultural background and preferences.'
              }
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '持续学习' : 'Continuous Learning'}
            </h3>
            <p className="text-neutral-600 text-sm">
              {locale === 'zh'
                ? '保持开放心态，不断学习新的研究和传统知识。'
                : 'Maintain an open mind, continuously learning new research and traditional knowledge.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Practical Application */}
      <section className="bg-accent-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '实际应用建议' : 'Practical Application Recommendations'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-accent-600 mb-4">
              {locale === 'zh' ? '如何安全尝试' : 'How to Try Safely'}
            </h3>
            <ol className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">1.</span>
                {locale === 'zh' ? '研究方法的科学依据' : 'Research the scientific basis of methods'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">2.</span>
                {locale === 'zh' ? '咨询医疗专业人士' : 'Consult healthcare professionals'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">3.</span>
                {locale === 'zh' ? '从温和的方法开始' : 'Start with gentle methods'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">4.</span>
                {locale === 'zh' ? '监测身体反应' : 'Monitor body responses'}
              </li>
              <li className="flex items-start">
                <span className="text-accent-500 mr-2 mt-1 font-semibold">5.</span>
                {locale === 'zh' ? '记录效果和副作用' : 'Record effects and side effects'}
              </li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">
              {locale === 'zh' ? '推荐的起始方法' : 'Recommended Starting Methods'}
            </h3>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '温和的瑜伽练习' : 'Gentle yoga practice'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '草药茶（洋甘菊、生姜）' : 'Herbal teas (chamomile, ginger)'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '温热敷料' : 'Warm compresses'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '深呼吸和冥想' : 'Deep breathing and meditation'}
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2 mt-1">•</span>
                {locale === 'zh' ? '温水浴' : 'Warm baths'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cultural Sensitivity Note */}
      <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="font-semibold text-blue-800 mb-3">
          {locale === 'zh' ? '文化敏感性提醒' : 'Cultural Sensitivity Reminder'}
        </h3>
        <p className="text-blue-700 text-sm mb-3">
          {locale === 'zh'
            ? '在探索不同文化的传统疗法时，重要的是要以尊重和开放的态度对待这些知识。避免文化挪用，而是要理解和欣赏这些传统的深层含义。'
            : 'When exploring traditional therapies from different cultures, it\'s important to approach this knowledge with respect and openness. Avoid cultural appropriation and instead understand and appreciate the deeper meanings of these traditions.'
          }
        </p>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• {locale === 'zh' ? '尊重传统知识的来源' : 'Respect the sources of traditional knowledge'}</li>
          <li>• {locale === 'zh' ? '理解文化背景和含义' : 'Understand cultural context and meanings'}</li>
          <li>• {locale === 'zh' ? '避免简化复杂的传统体系' : 'Avoid oversimplifying complex traditional systems'}</li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide/myths-facts`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '上一章：误区与事实' : 'Previous: Myths vs Facts'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '返回指南首页' : 'Back to Guide Home'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </section>
        </div>
      </div>
    </div>
  );
}
