import { setRequestLocale  } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, User, ChevronRight } from 'lucide-react';

type Locale = 'en' | 'zh';

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: locale === 'zh' ? '疼痛管理专题 - 经期健康管理平台' : 'Pain Management Topics - Period Health Management Platform',
    description: locale === 'zh' 
      ? '深入了解经期疼痛管理的专业知识，包括痛经原理、缓解方法、预防策略等专业内容。'
      : 'In-depth understanding of professional knowledge in menstrual pain management, including dysmenorrhea principles, relief methods, prevention strategies, and more.',
  };
}

export default async function PainManagementPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  const articles = [
    {
      id: 'understanding-dysmenorrhea',
      title: locale === 'zh' ? '深度解析：痛经的生理机制与类型' : 'In-depth Analysis: Physiological Mechanisms and Types of Dysmenorrhea',
      excerpt: locale === 'zh' 
        ? '从医学角度深入解析痛经的生理机制，帮助您科学理解疼痛产生的原因，为选择合适的缓解方法提供理论基础。'
        : 'In-depth analysis of the physiological mechanisms of dysmenorrhea from a medical perspective, helping you scientifically understand the causes of pain and providing a theoretical basis for choosing appropriate relief methods.',
      readTime: locale === 'zh' ? '8分钟阅读' : '8 min read',
      category: locale === 'zh' ? '基础知识' : 'Fundamentals',
      available: true
    },
    {
      id: 'natural-pain-relief',
      title: locale === 'zh' ? '天然缓解方案：草本疗法与营养调理' : 'Natural Relief Solutions: Herbal Therapy and Nutritional Care',
      excerpt: locale === 'zh'
        ? '探索安全有效的天然缓解方法，包括中草药配方、营养补充、饮食调理等，为您提供温和而持久的疼痛管理方案。'
        : 'Explore safe and effective natural relief methods, including herbal formulas, nutritional supplements, dietary adjustments, providing gentle and lasting pain management solutions.',
      readTime: locale === 'zh' ? '12分钟阅读' : '12 min read',
      category: locale === 'zh' ? '自然疗法' : 'Natural Therapy',
      available: false
    },
    {
      id: 'exercise-therapy',
      title: locale === 'zh' ? '运动疗法：科学运动缓解经期不适' : 'Exercise Therapy: Scientific Exercise for Menstrual Discomfort Relief',
      excerpt: locale === 'zh'
        ? '详细介绍适合经期的运动类型、强度控制、注意事项，以及如何通过规律运动改善长期的经期健康状况。'
        : 'Detailed introduction to exercise types suitable for menstruation, intensity control, precautions, and how to improve long-term menstrual health through regular exercise.',
      readTime: locale === 'zh' ? '10分钟阅读' : '10 min read',
      category: locale === 'zh' ? '运动健康' : 'Exercise Health',
      available: false
    },
    {
      id: 'psychological-management',
      title: locale === 'zh' ? '心理调适：情绪管理与压力缓解' : 'Psychological Adjustment: Emotional Management and Stress Relief',
      excerpt: locale === 'zh'
        ? '经期情绪波动的科学解释，以及有效的心理调适技巧，帮助您在经期保持良好的心理状态和生活质量。'
        : 'Scientific explanation of menstrual mood swings and effective psychological adjustment techniques to help you maintain good mental state and quality of life during menstruation.',
      readTime: locale === 'zh' ? '9分钟阅读' : '9 min read',
      category: locale === 'zh' ? '心理健康' : 'Mental Health',
      available: false
    },
    {
      id: 'medical-intervention',
      title: locale === 'zh' ? '医学干预：何时需要寻求专业帮助' : 'Medical Intervention: When to Seek Professional Help',
      excerpt: locale === 'zh'
        ? '识别需要医疗干预的症状，了解现代医学的治疗选择，以及如何与医生有效沟通您的症状和需求。'
        : 'Identify symptoms requiring medical intervention, understand modern medical treatment options, and learn how to effectively communicate your symptoms and needs with doctors.',
      readTime: locale === 'zh' ? '11分钟阅读' : '11 min read',
      category: locale === 'zh' ? '医学指导' : 'Medical Guidance',
      available: false
    },
    {
      id: 'lifestyle-optimization',
      title: locale === 'zh' ? '生活方式优化：日常习惯的调整策略' : 'Lifestyle Optimization: Daily Habit Adjustment Strategies',
      excerpt: locale === 'zh'
        ? '从睡眠、饮食、工作节奏等多个维度，提供全面的生活方式调整建议，帮助您建立经期友好的生活模式。'
        : 'Comprehensive lifestyle adjustment recommendations from multiple dimensions including sleep, diet, work rhythm, helping you establish a menstruation-friendly lifestyle.',
      readTime: locale === 'zh' ? '13分钟阅读' : '13 min read',
      category: locale === 'zh' ? '生活指导' : 'Lifestyle Guidance',
      available: false
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" data-page="pain-management">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/articles`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '文章中心' : 'Articles'}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">
          {locale === 'zh' ? '疼痛管理' : 'Pain Management'}
        </span>
      </nav>

      {/* Page Header */}
      <header className="text-center py-8">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '疼痛管理专题' : 'Pain Management Topics'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh' 
            ? '深入了解经期疼痛管理的专业知识，从生理机制到实用技巧，为您提供全面的疼痛管理指导。'
            : 'In-depth understanding of professional knowledge in menstrual pain management, from physiological mechanisms to practical techniques, providing comprehensive pain management guidance.'
          }
        </p>
      </header>

      {/* Articles Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ${
              article.available ? 'hover:border-primary-200' : 'opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                article.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {article.category}
              </span>
              {!article.available && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {locale === 'zh' ? '即将推出' : 'Coming Soon'}
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-neutral-800 mb-3 line-clamp-2">
              {article.title}
            </h3>

            <p className="text-neutral-600 mb-4 text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-neutral-500">
                <Clock className="w-3 h-3 mr-1" />
                {article.readTime}
              </div>
              
              {article.available ? (
                <Link
                  href={`/${locale}/articles/pain-management/${article.id}`}
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm"
                >
                  {locale === 'zh' ? '阅读文章' : 'Read Article'}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">
                  {locale === 'zh' ? '敬请期待' : 'Stay Tuned'}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Related Resources */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
          {locale === 'zh' ? '相关资源推荐' : 'Related Resources'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href={`/${locale}/immediate-relief`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '即时缓解方案' : 'Immediate Relief Solutions'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '快速有效的疼痛缓解方法' : 'Quick and effective pain relief methods'}
            </p>
          </Link>
          
          <Link
            href={`/${locale}/natural-therapies`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '自然疗法指南' : 'Natural Therapy Guide'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '天然安全的调理方法' : 'Natural and safe conditioning methods'}
            </p>
          </Link>
          
          <Link
            href={`/${locale}/scenario-solutions`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '场景化解决方案' : 'Scenario-based Solutions'}
            </h3>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '针对不同场景的专业建议' : 'Professional advice for different scenarios'}
            </p>
          </Link>
        </div>
      </section>

      {/* Back to Articles */}
      <div className="text-center">
        <Link 
          href={`/${locale}/articles`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回文章中心' : 'Back to Articles'}
        </Link>
      </div>
    </div>
  );
}