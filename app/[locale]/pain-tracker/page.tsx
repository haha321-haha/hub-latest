import { getTranslations } from 'next-intl/server';
import PainTrackerClient from './pain-tracker-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'painTracker' });
  
  return {
    title: t('meta.title', { 
      default: locale === 'zh' 
        ? '疼痛追踪器 - PeriodHub | 智能经期疼痛管理工具'
        : 'Pain Tracker - PeriodHub | Smart Menstrual Pain Management Tool'
    }),
    description: t('meta.description', { 
      default: locale === 'zh'
        ? 'PeriodHub疼痛追踪器：记录疼痛模式，识别触发因素，分析治疗效果。专业的经期疼痛管理工具，帮助您科学应对痛经。'
        : 'PeriodHub Pain Tracker: Record pain patterns, identify triggers, analyze treatment effectiveness. Professional menstrual pain management tool to help you cope with period pain scientifically.'
    }),
    keywords: locale === 'zh' ? [
      '疼痛追踪器', '痛经管理', '经期疼痛', '疼痛记录', '健康追踪', '痛经工具'
    ] : [
      'pain tracker', 'period pain management', 'menstrual pain', 'pain logging', 'health tracking', 'period pain tool'
    ],
    
    openGraph: {
      title: t('meta.ogTitle', { 
        default: locale === 'zh' ? '疼痛追踪器 - PeriodHub' : 'Pain Tracker - PeriodHub'
      }),
      description: t('meta.ogDescription', { 
        default: locale === 'zh' 
          ? '智能经期疼痛管理工具'
          : 'Smart menstrual pain management tool'
      }),
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'PeriodHub',
      url: `https://www.periodhub.health/${locale}/pain-tracker`,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: t('meta.twitterTitle', { 
        default: locale === 'zh' ? '疼痛追踪器 - PeriodHub' : 'Pain Tracker - PeriodHub'
      }),
      description: t('meta.twitterDescription', { 
        default: locale === 'zh' 
          ? '专业的经期疼痛管理工具'
          : 'Professional menstrual pain management tool'
      }),
    },

    alternates: {
      canonical: `https://www.periodhub.health/${locale}/pain-tracker`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/pain-tracker',
        'en-US': 'https://www.periodhub.health/en/pain-tracker',
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

export default function PainTrackerPage() {
  return <PainTrackerClient />;
}