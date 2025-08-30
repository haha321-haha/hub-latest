
import { Metadata } from 'next';

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: any;
}

export function generateAdvancedMeta({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/og-default.jpg',
  noindex = false,
  structuredData
}: SEOMetaProps): Metadata {
  const fullTitle = title.includes('PeriodHub') ? title : `${title} | PeriodHub`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    
    // 基础元数据
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: 'PeriodHub',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@periodhub',
    },
    
    // 高级元数据
    alternates: {
      canonical,
      languages: {
        'zh-CN': canonical,
        'en-US': canonical?.replace('/zh/', '/en/'),
      },
    },
    
    // 其他重要元数据
    other: {
      'theme-color': '#ff6b9d',
      'msapplication-TileColor': '#ff6b9d',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
    },
  };
}

// 页面特定的SEO配置
export const pageConfigs = {
  home: {
    title: '经期健康管理专家',
    description: '科学的经期追踪、健康建议和个性化护理方案，让每个女性都能轻松管理自己的生理周期',
    keywords: ['经期追踪', '生理周期', '女性健康', '经期管理', '健康应用'],
  },
  
  tracker: {
    title: '智能经期追踪器',
    description: '精准预测下次经期，记录症状变化，提供个性化健康建议',
    keywords: ['经期预测', '症状记录', '周期分析', '健康追踪'],
  },
  
  health: {
    title: '女性健康知识库',
    description: '专业的女性健康知识，经期护理技巧，营养建议和运动指导',
    keywords: ['女性健康', '经期护理', '营养建议', '健康知识'],
  }
};
