// SEO优化配置文件
export const seoConfig = {
  // 网站基本信息
  siteName: 'PeriodHub',
  siteUrl: 'https://www.periodhub.health',
  siteDescription: '专业的女性月经健康管理平台，提供基于循证医学的痛经解决方案',
  
  // 关键词配置
  keywords: {
    zh: [
      '痛经怎么缓解最快方法',
      '痛经吃什么药最有效',
      '月经推迟几天算正常',
      '月经量少是什么原因',
      '痛经缓解',
      '月经疼痛',
      '经期健康',
      '女性健康',
      '月经健康管理',
      '经期疼痛怎么办',
      '中医调理',
      '痛经自然疗法',
      '经期注意事项',
      '痛经饮食调理',
      '经期运动建议'
    ],
    en: [
      'menstrual cramps relief',
      'period pain remedies',
      'how to stop period pain',
      'natural period pain relief',
      'menstrual pain management',
      'dysmenorrhea treatment',
      'period health tips',
      'women health solutions',
      'menstrual cycle tracking',
      'period pain natural remedies',
      'TCM for period pain',
      'menstrual wellness',
      'period care tips',
      'painful periods help'
    ]
  },

  // 结构化数据模板
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PeriodHub',
      url: 'https://www.periodhub.health',
      logo: 'https://www.periodhub.health/logo.png',
      description: '专业的女性月经健康管理平台',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['zh-CN', 'en-US']
      },
      sameAs: [
        'https://twitter.com/periodhub',
        'https://facebook.com/periodhub',
        'https://instagram.com/periodhub'
      ]
    },
    
    medicalWebPage: {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: '痛经管理与缓解 - PeriodHub',
      description: '基于循证医学的痛经管理方案，提供中西医结合的治疗建议',
      medicalSpecialty: {
        '@type': 'MedicalSpecialty',
        name: '妇科学'
      },
      about: {
        '@type': 'MedicalCondition',
        name: '痛经',
        alternateName: ['月经疼痛', '经期疼痛', 'Dysmenorrhea'],
        description: '月经期间或前后出现的下腹部疼痛症状'
      }
    }
  },

  // Open Graph配置
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.periodhub.health',
    siteName: 'PeriodHub',
    images: [
      {
        url: 'https://www.periodhub.health/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PeriodHub - 专业女性健康管理平台'
      }
    ]
  },

  // Twitter Card配置
  twitter: {
    card: 'summary_large_image',
    site: '@periodhub',
    creator: '@periodhub',
    images: ['https://www.periodhub.health/twitter-image.jpg']
  },

  // 图片优化配置
  images: {
    sizes: {
      hero: { width: 1200, height: 630 },
      article: { width: 800, height: 450 },
      thumbnail: { width: 400, height: 300 },
      icon: { width: 200, height: 200 }
    },
    formats: ['webp', 'avif'],
    quality: 85,
    altText: {
      hero: 'PeriodHub - 专业女性健康管理平台',
      article: '女性健康文章配图',
      tools: '健康评估工具界面',
      scenarios: '场景化痛经解决方案'
    }
  },

  // 内部链接优化
  internalLinks: {
    priorityPages: [
      '/interactive-tools/symptom-assessment',
      '/interactive-tools/pain-tracker',
      '/health-guide',
      '/articles',
      '/teen-health'
    ],
    
    contextualLinks: [
      { from: '/articles/menstrual-pain-medical-guide', to: '/interactive-tools/symptom-assessment' },
      { from: '/articles/natural-remedies', to: '/natural-therapies' },
      { from: '/articles/emergency-tips', to: '/scenario-solutions/emergency-kit' },
      { from: '/teen-health', to: '/articles/teen-menstrual-health' },
      { from: '/interactive-tools/constitution-test', to: '/articles/tcm-constitution-guide' }
    ]
  },

  // 页面性能配置
  performance: {
    criticalCSS: true,
    lazyLoadImages: true,
    preloadFonts: true,
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com'
    ],
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
  }
};