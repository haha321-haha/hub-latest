import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/i18n';

// Generate metadata for the page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'healthGuidePage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HealthGuidePage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'healthGuidePage' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  const guideChapters = [
    {
      id: 'understanding-pain',
      title: locale === 'zh' ? '理解痛经' : 'Understanding Menstrual Pain',
      description: locale === 'zh' 
        ? '深入了解痛经的原因、类型和生理机制'
        : 'Deep dive into the causes, types, and physiological mechanisms of menstrual pain',
      href: `/${locale}/health-guide/understanding-pain`,
      icon: '🧠'
    },
    {
      id: 'relief-methods-az',
      title: locale === 'zh' ? 'A-Z缓解方法' : 'A-Z Relief Methods',
      description: locale === 'zh'
        ? '从A到Z的全面缓解方法，包括即时和长期策略'
        : 'Comprehensive relief methods from A to Z, including immediate and long-term strategies',
      href: `/${locale}/health-guide/relief-methods`,
      icon: '📚'
    },
    {
      id: 'lifestyle-management',
      title: locale === 'zh' ? '生活方式管理' : 'Lifestyle Management',
      description: locale === 'zh'
        ? '通过饮食、运动和日常习惯改善经期健康'
        : 'Improve menstrual health through diet, exercise, and daily habits',
      href: `/${locale}/health-guide/lifestyle`,
      icon: '🌱'
    },
    {
      id: 'when-seek-help',
      title: locale === 'zh' ? '何时寻求帮助' : 'When to Seek Help',
      description: locale === 'zh'
        ? '识别需要医疗关注的症状和情况'
        : 'Recognize symptoms and situations that require medical attention',
      href: `/${locale}/health-guide/medical-care`,
      icon: '🏥'
    },
    {
      id: 'myths-facts',
      title: locale === 'zh' ? '误区与事实' : 'Myths vs Facts',
      description: locale === 'zh'
        ? '澄清关于经期健康的常见误解'
        : 'Clarify common misconceptions about menstrual health',
      href: `/${locale}/health-guide/myths-facts`,
      icon: '💡'
    },
    {
      id: 'global-perspectives',
      title: locale === 'zh' ? '全球视角' : 'Global Perspectives',
      description: locale === 'zh'
        ? '探索世界各地的传统疗法和文化观点'
        : 'Explore traditional therapies and cultural perspectives from around the world',
      href: `/${locale}/health-guide/global-perspectives`,
      icon: '🌍'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Page Header */}
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              {locale === 'zh' ? '痛经健康指南' : 'Comprehensive Menstrual Health Guide'}
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              {locale === 'zh'
                ? '您的完整痛经健康资源，从基础知识到高级管理策略，帮助您全面了解和管理经期健康。'
                : 'Your complete menstrual health resource, from basics to advanced management strategies, helping you understand and manage your menstrual health comprehensively.'
              }
            </p>
          </header>

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {locale === 'zh' ? '为什么需要这个指南？' : 'Why This Guide?'}
          </h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            {locale === 'zh'
              ? '痛经影响着全球数百万女性的生活质量。这个综合指南汇集了最新的科学研究、传统智慧和实用策略，为您提供全面的知识体系，帮助您更好地理解、管理和缓解经期不适。'
              : 'Menstrual pain affects the quality of life for millions of women worldwide. This comprehensive guide brings together the latest scientific research, traditional wisdom, and practical strategies to provide you with a complete knowledge system for better understanding, managing, and relieving menstrual discomfort.'
            }
          </p>
          <p className="text-neutral-700 leading-relaxed">
            {locale === 'zh'
              ? '无论您是刚开始经历痛经，还是寻求新的管理方法，这个指南都将成为您可靠的参考资源。'
              : 'Whether you are just starting to experience menstrual pain or looking for new management approaches, this guide will serve as your reliable reference resource.'
            }
          </p>
        </div>
      </section>

      {/* Guide Chapters */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-8 text-center">
          {locale === 'zh' ? '指南章节' : 'Guide Chapters'}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guideChapters.map((chapter) => (
            <Link 
              key={chapter.id}
              href={chapter.href}
              className="card group hover:shadow-lg transition-all duration-300 block"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{chapter.icon}</span>
                <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                  {chapter.title}
                </h3>
              </div>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                {chapter.description}
              </p>
              <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                {locale === 'zh' ? '阅读更多' : 'Read More'}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-secondary-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '快速访问' : 'Quick Access'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '紧急缓解' : 'Emergency Relief'}
            </h3>
            <p className="text-neutral-600 text-sm mb-3">
              {locale === 'zh'
                ? '需要立即缓解？查看我们的快速解决方案。'
                : 'Need immediate relief? Check our quick solutions.'
              }
            </p>
            <Link 
              href={`/${locale}/scenario-solutions`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {locale === 'zh' ? '查看场景解决方案' : 'View Scenario Solutions'} →
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '个性化评估' : 'Personalized Assessment'}
            </h3>
            <p className="text-neutral-600 text-sm mb-3">
              {locale === 'zh'
                ? '了解您的症状模式，获得定制建议。'
                : 'Understand your symptom patterns and get tailored advice.'
              }
            </p>
            <Link 
              href={`/${locale}/interactive-tools`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {locale === 'zh' ? '开始评估' : 'Start Assessment'} →
            </Link>
          </div>
        </div>
      </section>

          {/* Medical Disclaimer */}
          <section className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
            <p className="text-neutral-700">
              <strong className="text-primary-700">
                {locale === 'zh' ? '医疗免责声明：' : 'Medical Disclaimer:'}
              </strong>
              {locale === 'zh'
                ? '本指南中的信息仅供教育目的，不应替代专业医疗建议、诊断或治疗。如有任何健康问题，请咨询合格的医疗保健提供者。'
                : 'The information in this guide is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
