import { getTranslations } from 'next-intl/server';
import SymptomAssessmentClient from './symptom-assessment-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'interactiveTools' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '症状评估工具 - PeriodHub | 智能经期症状分析'
        : 'Symptom Assessment Tool - PeriodHub | Smart Menstrual Symptom Analysis'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? 'PeriodHub症状评估工具：科学分析经期症状，提供个性化健康建议。专业的症状评估系统，帮助您更好地了解和管理经期健康。'
        : 'PeriodHub Symptom Assessment Tool: Scientifically analyze menstrual symptoms and provide personalized health recommendations. Professional symptom assessment system to help you better understand and manage menstrual health.'
    }),
    keywords: locale === 'zh' ? [
      '症状评估工具', '经期症状分析', '痛经评估', '健康检查工具', '智能评估', '经期健康'
    ] : [
      'symptom assessment tool', 'menstrual symptom analysis', 'period pain assessment', 'health check tool', 'smart assessment', 'menstrual health'
    ],
    
    openGraph: {
      title: t('meta.ogTitle', { 
        default: locale === 'zh' ? '症状评估工具 - PeriodHub' : 'Symptom Assessment Tool - PeriodHub'
      }),
      description: t('meta.ogDescription', { 
        default: locale === 'zh' 
          ? '智能经期症状分析工具'
          : 'Smart menstrual symptom analysis tool'
      }),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'PeriodHub',
      url: `https://www.periodhub.health/${locale}/interactive-tools/symptom-assessment`,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitterTitle', { 
        default: locale === 'zh' ? '症状评估工具 - PeriodHub' : 'Symptom Assessment Tool - PeriodHub'
      }),
      description: t('meta.twitterDescription', { 
        default: locale === 'zh' 
          ? '专业的经期健康评估工具'
          : 'Professional menstrual health assessment tool'
      }),
    },

    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/symptom-assessment`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/interactive-tools/symptom-assessment',
        'en-US': 'https://www.periodhub.health/en/interactive-tools/symptom-assessment',
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

export default async function SymptomAssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SymptomAssessmentClient params={{ locale }} />;
}