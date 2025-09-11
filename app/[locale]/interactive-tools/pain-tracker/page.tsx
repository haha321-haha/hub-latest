import { getTranslations } from 'next-intl/server';
import PainTrackerClient from './pain-tracker-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'interactiveTools' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '疼痛追踪工具 - PeriodHub | 智能经期疼痛记录分析'
        : 'Pain Tracking Tool - PeriodHub | Smart Menstrual Pain Recording Analysis'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? 'PeriodHub疼痛追踪工具：记录经期疼痛模式，分析疼痛趋势，获取个性化管理建议。智能追踪您的疼痛数据，提供专业的健康洞察。'
        : 'PeriodHub Pain Tracking Tool: Record menstrual pain patterns, analyze pain trends, and get personalized management recommendations. Smart tracking of your pain data with professional health insights.'
    }),
    keywords: locale === 'zh' ? [
      '疼痛追踪工具', '经期疼痛记录', '痛经分析', '疼痛管理工具', '健康追踪', '经期健康'
    ] : [
      'pain tracking tool', 'menstrual pain recording', 'period pain analysis', 'pain management tool', 'health tracking', 'menstrual health'
    ],
    
    openGraph: {
      title: t('meta.ogTitle', { 
        default: locale === 'zh' ? '疼痛追踪工具 - PeriodHub' : 'Pain Tracking Tool - PeriodHub'
      }),
      description: t('meta.ogDescription', { 
        default: locale === 'zh' 
          ? '智能经期疼痛记录分析工具'
          : 'Smart menstrual pain recording analysis tool'
      }),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'PeriodHub',
      url: `https://www.periodhub.health/${locale}/interactive-tools/pain-tracker`,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitterTitle', { 
        default: locale === 'zh' ? '疼痛追踪工具 - PeriodHub' : 'Pain Tracking Tool - PeriodHub'
      }),
      description: t('meta.twitterDescription', { 
        default: locale === 'zh' 
          ? '专业的经期健康追踪工具'
          : 'Professional menstrual health tracking tool'
      }),
    },

    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/pain-tracker`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/interactive-tools/pain-tracker',
        'en-US': 'https://www.periodhub.health/en/interactive-tools/pain-tracker',
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

export default async function PainTrackerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PainTrackerClient params={{ locale }} />;
}