import { getTranslations } from 'next-intl/server';
import AssessmentClient from './assessment-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'assessment' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '智能症状评估 - PeriodHub | 专业经期健康评估工具'
        : 'Smart Symptom Assessment - PeriodHub | Professional Menstrual Health Assessment Tool'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? 'PeriodHub智能症状评估：科学评估经期症状，获取个性化建议和治疗方案。专业的经期健康评估工具，帮助您了解身体状况。'
        : 'PeriodHub Smart Symptom Assessment: Scientifically evaluate menstrual symptoms and get personalized recommendations and treatment plans. Professional menstrual health assessment tool to help you understand your physical condition.'
    }),
    keywords: locale === 'zh' ? [
      '症状评估', '经期健康评估', '痛经评估', '健康检查', '智能评估', '经期症状',
      '月经健康', '女性健康', '生理期评估', '痛经管理', '经期疼痛'
    ] : [
      'symptom assessment', 'menstrual health assessment', 'period pain assessment', 'health check', 'smart assessment', 'menstrual symptoms',
      'menstrual health', 'women health', 'periodic assessment', 'pain management', 'menstrual pain'
    ],
    
    openGraph: {
      title: t('meta.ogTitle', { 
        default: locale === 'zh' ? '智能症状评估 - PeriodHub' : 'Smart Symptom Assessment - PeriodHub'
      }),
      description: t('meta.ogDescription', { 
        default: locale === 'zh' 
          ? '专业经期健康评估工具，科学分析症状，提供个性化建议'
          : 'Professional menstrual health assessment tool with scientific symptom analysis and personalized recommendations'
      }),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'PeriodHub',
      url: `https://www.periodhub.health/${locale}/assessment`,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitterTitle', { 
        default: locale === 'zh' ? '智能症状评估 - PeriodHub' : 'Smart Symptom Assessment - PeriodHub'
      }),
      description: t('meta.twitterDescription', { 
        default: locale === 'zh' 
          ? '专业的经期健康评估工具'
          : 'Professional menstrual health assessment tool'
      }),
    },

    alternates: {
      canonical: `https://www.periodhub.health/${locale}/assessment`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/assessment',
        'en-US': 'https://www.periodhub.health/en/assessment',
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function AssessmentPage() {
  return <AssessmentClient />;
}