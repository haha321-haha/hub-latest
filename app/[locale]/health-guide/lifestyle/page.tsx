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
  const title = locale === 'zh' ? '生活方式管理 - 痛经健康指南' : 'Lifestyle Management - Health Guide';
  const description = locale === 'zh' 
    ? '通过饮食、运动和日常习惯改善经期健康，建立长期有效的痛经管理策略。'
    : 'Improve menstrual health through diet, exercise, and daily habits, establishing long-term effective menstrual pain management strategies.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LifestylePage({
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
              {locale === 'zh' ? '生活方式管理' : 'Lifestyle Management'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '生活方式管理' : 'Lifestyle Management'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '通过科学的饮食、运动和日常习惯改善经期健康，建立长期有效的痛经管理策略。'
            : 'Improve menstrual health through scientific diet, exercise, and daily habits, establishing long-term effective menstrual pain management strategies.'
          }
        </p>
      </header>

      {/* Nutrition Section */}
      <section className="bg-gradient-to-br from-green-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '营养与饮食' : 'Nutrition and Diet'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              {locale === 'zh' ? '推荐食物' : 'Recommended Foods'}
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '抗炎食物' : 'Anti-inflammatory Foods'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '深海鱼类、坚果、橄榄油、绿叶蔬菜' : 'Deep-sea fish, nuts, olive oil, leafy greens'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '富含镁的食物' : 'Magnesium-rich Foods'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '黑巧克力、香蕉、菠菜、杏仁' : 'Dark chocolate, bananas, spinach, almonds'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '富含铁的食物' : 'Iron-rich Foods'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '瘦肉、豆类、深绿色蔬菜' : 'Lean meat, legumes, dark green vegetables'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              {locale === 'zh' ? '避免食物' : 'Foods to Avoid'}
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '高糖食物' : 'High-sugar Foods'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '糖果、甜饮料、精制糖' : 'Candy, sweet drinks, refined sugar'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '高盐食物' : 'High-sodium Foods'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '加工食品、腌制食品' : 'Processed foods, pickled foods'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800 mb-1">
                  {locale === 'zh' ? '咖啡因' : 'Caffeine'}
                </h4>
                <p className="text-sm text-neutral-600">
                  {locale === 'zh' ? '过量咖啡、浓茶' : 'Excessive coffee, strong tea'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '运动与锻炼' : 'Exercise and Physical Activity'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '有氧运动' : 'Aerobic Exercise'}
            </h3>
            <p className="text-neutral-600 mb-4 text-sm">
              {locale === 'zh'
                ? '促进血液循环，释放内啡肽，自然缓解疼痛。'
                : 'Promotes blood circulation, releases endorphins, naturally relieves pain.'
              }
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '快走 20-30分钟' : 'Brisk walking 20-30 minutes'}</li>
              <li>• {locale === 'zh' ? '游泳' : 'Swimming'}</li>
              <li>• {locale === 'zh' ? '骑自行车' : 'Cycling'}</li>
              <li>• {locale === 'zh' ? '舞蹈' : 'Dancing'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '瑜伽与伸展' : 'Yoga and Stretching'}
            </h3>
            <p className="text-neutral-600 mb-4 text-sm">
              {locale === 'zh'
                ? '放松肌肉，减轻压力，改善柔韧性。'
                : 'Relaxes muscles, reduces stress, improves flexibility.'
              }
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '猫牛式' : 'Cat-Cow pose'}</li>
              <li>• {locale === 'zh' ? '儿童式' : 'Child\'s pose'}</li>
              <li>• {locale === 'zh' ? '扭转式' : 'Twisting poses'}</li>
              <li>• {locale === 'zh' ? '腿部伸展' : 'Leg stretches'}</li>
            </ul>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '正念练习' : 'Mindfulness Practice'}
            </h3>
            <p className="text-neutral-600 mb-4 text-sm">
              {locale === 'zh'
                ? '减轻压力，改善疼痛感知，提高整体健康。'
                : 'Reduces stress, improves pain perception, enhances overall well-being.'
              }
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '冥想 10-15分钟' : 'Meditation 10-15 minutes'}</li>
              <li>• {locale === 'zh' ? '深呼吸练习' : 'Deep breathing exercises'}</li>
              <li>• {locale === 'zh' ? '渐进性肌肉放松' : 'Progressive muscle relaxation'}</li>
              <li>• {locale === 'zh' ? '正念行走' : 'Mindful walking'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sleep and Stress Management */}
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '睡眠与压力管理' : 'Sleep and Stress Management'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              {locale === 'zh' ? '优质睡眠' : 'Quality Sleep'}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {locale === 'zh' ? '保持规律的睡眠时间（7-9小时）' : 'Maintain regular sleep schedule (7-9 hours)'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {locale === 'zh' ? '创造舒适的睡眠环境' : 'Create comfortable sleep environment'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {locale === 'zh' ? '睡前避免电子设备' : 'Avoid electronic devices before bed'}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {locale === 'zh' ? '建立睡前放松仪式' : 'Establish bedtime relaxation routine'}
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">
              {locale === 'zh' ? '压力管理' : 'Stress Management'}
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {locale === 'zh' ? '识别和避免压力源' : 'Identify and avoid stress triggers'}
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {locale === 'zh' ? '学习放松技巧' : 'Learn relaxation techniques'}
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {locale === 'zh' ? '保持社交联系' : 'Maintain social connections'}
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {locale === 'zh' ? '寻求专业帮助（如需要）' : 'Seek professional help (if needed)'}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Daily Habits */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '日常习惯建议' : 'Daily Habit Recommendations'}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '晨间例行' : 'Morning Routine'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '温水、轻度伸展、营养早餐' : 'Warm water, light stretching, nutritious breakfast'}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '水分补充' : 'Hydration'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '每天8-10杯水，草药茶' : '8-10 glasses of water daily, herbal teas'}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '规律作息' : 'Regular Schedule'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '固定用餐、运动、睡眠时间' : 'Fixed meal, exercise, and sleep times'}
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '自我关爱' : 'Self-care'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '记录症状、奖励进步' : 'Track symptoms, reward progress'}
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Tips */}
      <section className="bg-accent-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '实施建议' : 'Implementation Tips'}
        </h2>
        <div className="bg-white p-6 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-3">
            {locale === 'zh' ? '循序渐进的改变' : 'Gradual Changes'}
          </h3>
          <p className="text-neutral-700 mb-4">
            {locale === 'zh'
              ? '不要试图一次性改变所有习惯。选择1-2个最容易实施的改变开始，建立信心后再逐步添加其他习惯。'
              : 'Don\'t try to change all habits at once. Start with 1-2 easiest changes to implement, build confidence, then gradually add other habits.'
            }
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary-600 mb-1">
                {locale === 'zh' ? '第1-2周' : 'Week 1-2'}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '建立一个新习惯' : 'Establish one new habit'}
              </p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-secondary-600 mb-1">
                {locale === 'zh' ? '第3-4周' : 'Week 3-4'}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '巩固并添加第二个' : 'Consolidate and add second'}
              </p>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent-600 mb-1">
                {locale === 'zh' ? '第5周+' : 'Week 5+'}
              </div>
              <p className="text-neutral-600">
                {locale === 'zh' ? '继续扩展' : 'Continue expanding'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide/relief-methods`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '上一章：A-Z缓解方法' : 'Previous: A-Z Relief Methods'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide/medical-care`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '下一章：何时寻求帮助' : 'Next: When to Seek Help'}
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
