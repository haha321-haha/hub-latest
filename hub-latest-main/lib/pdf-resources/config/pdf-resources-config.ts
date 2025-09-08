// config/resources/pdf-resources.config.ts

import { PDFResource, ResourceCategory, SupportedLanguage } from '../types/resource-types';
import { PDFResourceConfig } from '../types/config-types';

/**
 * PDF资源管理系统配置
 */
export const PDF_RESOURCE_CONFIG: PDFResourceConfig = {
  // 基础信息
  version: '2.0.0',
  environment: (process.env.NODE_ENV as any) || 'development',
  lastUpdated: '2024-12-20T00:00:00Z',
  
  // 存储配置
  storage: {
    provider: (process.env.PDF_STORAGE_PROVIDER as any) || 'local',
    basePath: process.env.PDF_BASE_PATH || '/public/pdfs',
    publicPath: process.env.PDF_PUBLIC_PATH || '/pdfs',
    cdnUrl: process.env.PDF_CDN_URL,
    
    local: {
      uploadPath: 'public/pdfs',
      staticPath: '/pdfs',
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedFormats: ['pdf']
    },
    
    cdn: {
      enabled: process.env.NODE_ENV === 'production',
      baseUrl: process.env.CDN_BASE_URL || '',
      cacheTtl: 86400 // 24小时
    }
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    strategy: 'lru',
    ttl: 3600, // 1小时
    maxSize: 100,
    maxMemory: 100 * 1024 * 1024, // 100MB
    
    resourceTtl: {
      resource: 3600,    // 1小时
      search: 1800,      // 30分钟
      stats: 300,        // 5分钟
      validation: 7200   // 2小时
    },
    
    memory: {
      checkPeriod: 600,        // 10分钟
      useClones: false,
      errorOnMissing: false
    },
    
    warmup: {
      enabled: true,
      resources: [
        'immediate-pain-relief-guide-v2',
        'heat-therapy-comprehensive-guide',
        'menstrual-cycle-nutrition-plan'
      ],
      categories: ['immediate-relief'],
      priority: 'high'
    }
  },
  
  // 验证配置
  validation: {
    enabled: true,
    mode: 'strict',
    
    file: {
      maxFileSize: 50 * 1024 * 1024,
      minFileSize: 1024,
      allowedFormats: ['pdf'],
      requireChecksum: false,
      virusScan: false
    },
    
    content: {
      requireTitle: true,
      requireDescription: true,
      minTitleLength: 5,
      maxTitleLength: 200,
      minDescriptionLength: 20,
      maxDescriptionLength: 1000,
      requireKeywords: true,
      minKeywords: 1,
      maxKeywords: 20,
      bannedWords: []
    },
    
    quality: {
      minOverallScore: 5.0,
      requireAllScores: true,
      autoCalculateOverall: true,
      scoreWeights: {
        content: 0.3,
        design: 0.2,
        accuracy: 0.3,
        usefulness: 0.2
      }
    },
    
    access: {
      requireAccessLevel: true,
      allowedLevels: ['public', 'protected'],
      requireRegions: false,
      defaultRegions: ['all']
    }
  },
  
  // 国际化配置
  i18n: {
    defaultLanguage: 'zh',
    supportedLanguages: ['zh', 'en'],
    fallbackLanguage: 'en',
    
    resources: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: true
    },
    
    interpolation: {
      escapeValue: false
    },
    
    pluralSeparator: '_',
    contextSeparator: '_',
    defaultNS: 'common',
    ns: ['common', 'pdf-resources', 'errors']
  },
  
  // 安全配置
  security: {
    upload: {
      allowedMimeTypes: ['application/pdf'],
      maxFileSize: 50 * 1024 * 1024,
      scanVirus: false,
      quarantineOnThreat: false,
      allowExecutables: false
    },
    
    access: {
      enableRateLimiting: true,
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15分钟
        maxRequests: 100,
        skipSuccessfulRequests: false
      },
      
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : true,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
        exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
      },
      
      csp: {
        enabled: process.env.NODE_ENV === 'production',
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'https:'],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"]
        }
      }
    },
    
    dataProtection: {
      encryptSensitiveData: false,
      hashPasswords: true,
      saltRounds: 12,
      anonymizeIPs: true,
      gdprCompliant: true
    },
    
    api: {
      requireApiKey: false,
      apiKeyHeader: 'X-API-Key',
      enableJWT: false,
      jwtExpiresIn: '1d'
    }
  },
  
  // 监控配置
  monitoring: {
    enabled: true,
    
    performance: {
      enabled: true,
      sampleRate: 1.0,
      trackPageLoads: true,
      trackAPIRequests: true,
      slowQueryThreshold: 1000
    },
    
    errorTracking: {
      enabled: true,
      service: 'custom',
      environment: (process.env.NODE_ENV as any) || 'development',
      sampleRate: 1.0
    },
    
    logging: {
      enabled: true,
      level: (process.env.LOG_LEVEL as any) || 'info',
      format: 'json',
      destination: 'console'
    },
    
    healthCheck: {
      enabled: true,
      endpoint: '/api/health',
      interval: 30,
      timeout: 5000,
      checks: [
        {
          name: 'storage',
          type: 'storage',
          timeout: 3000,
          retries: 2
        },
        {
          name: 'cache',
          type: 'cache',
          timeout: 1000,
          retries: 1
        }
      ]
    },
    
    metrics: {
      enabled: true,
      service: 'custom',
      pushInterval: 60,
      customMetrics: [
        'pdf_downloads',
        'pdf_previews',
        'search_queries',
        'validation_errors'
      ]
    }
  },
  
  // 功能开关
  features: {
    preview: true,
    download: true,
    search: true,
    analytics: true,
    comments: false,
    ratings: true,
    recommendations: false,
    collections: false,
    versioning: true,
    sharing: false
  },
  
  // 限制设置
  limits: {
    maxResources: 1000,
    maxFileSize: 50 * 1024 * 1024,
    maxPreviewPages: 5,
    maxSearchResults: 100,
    maxDownloadsPerDay: 50,
    maxAPIRequestsPerMinute: 60
  },
  
  // 默认值
  defaults: {
    language: 'zh',
    category: 'learning',
    accessLevel: 'public',
    cacheTime: 3600,
    pageSize: 20
  }
};

/**
 * 完整的PDF资源定义
 */
export const PDF_RESOURCES: PDFResource[] = [
  // ============ 即时缓解类 (Immediate Relief) ============
  {
    id: 'immediate-pain-relief-guide-v2',
    type: 'pdf',
    status: 'active',
    version: {
      version: '2.1.0',
      releaseDate: new Date('2024-01-15'),
      changelog: '更新了最新的疼痛缓解技术和安全注意事项',
      isLatest: true,
      deprecated: false
    },
    filename: 'immediate-pain-relief-guide-v2.pdf',
    fileSize: 2457600, // 2.4MB
    pageCount: 12,
    language: 'zh',
    category: 'immediate-relief',
    tags: ['疼痛缓解', '即时缓解', '紧急处理', '自然疗法'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20'),
    createdBy: 'system',
    updatedBy: 'admin',
    
    metadata: {
      title: {
        zh: '5分钟快速缓解经期疼痛指南',
        en: '5-Minute Quick Period Pain Relief Guide'
      },
      description: {
        zh: '专业医生推荐的快速缓解经期疼痛的实用方法，包括呼吸技巧、按摩手法、热疗法等多种安全有效的自然疗法。',
        en: 'Doctor-recommended practical methods for quick period pain relief, including breathing techniques, massage methods, heat therapy and other safe and effective natural remedies.'
      },
      author: 'Dr. Sarah Chen',
      keywords: ['经期疼痛', '快速缓解', '自然疗法', '呼吸技巧', '按摩'],
      thumbnail: '/images/thumbnails/immediate-relief.jpg',
      featured: true,
      quality: {
        content: 9,
        design: 8,
        accuracy: 10,
        usefulness: 9,
        overall: 9.0
      },
      difficulty: 'beginner',
      estimatedReadTime: 8,
      lastReviewed: new Date('2024-12-15'),
      reviewedBy: 'Dr. Sarah Chen'
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2, 3],
        watermark: 'Period Hub - 预览版本',
        maxPreviewPages: 3
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true,
        fileFormat: 'pdf'
      },
      search: {
        indexed: true,
        searchKeywords: ['疼痛', '缓解', '即时', '经期', '月经', '快速', '5分钟', '自然'],
        searchableContent: {
          sections: [
            {
              title: '呼吸缓解法',
              content: '深呼吸技巧可以有效缓解经期疼痛，通过调节自律神经系统来减轻痉挛。',
              pageNumber: 3
            },
            {
              title: '热疗应用',
              content: '局部热敷是最常用且有效的疼痛缓解方法之一，温度控制在40-45度最佳。',
              pageNumber: 5
            }
          ]
        }
      },
      interactive: {
        hasForm: false,
        hasCalculator: false,
        hasLinks: true
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 13,
      requireAuth: false
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      shareCount: 0,
      rating: 0,
      reviewCount: 0
    },
    
    relatedResources: [
      {
        type: 'follow-up',
        resourceId: 'heat-therapy-comprehensive-guide',
        description: '深入了解热疗法的完整应用'
      },
      {
        type: 'related',
        resourceId: 'natural-physical-therapy-guide',
        description: '更多物理疗法选择'
      }
    ]
  },

  {
    id: 'heat-therapy-comprehensive-guide',
    type: 'pdf',
    status: 'active',
    version: {
      version: '1.5.0',
      releaseDate: new Date('2024-01-10'),
      changelog: '增加了安全使用注意事项和常见问题解答',
      isLatest: true,
      deprecated: false
    },
    filename: 'heat-therapy-guide.pdf',
    fileSize: 1834752, // 1.8MB
    pageCount: 8,
    language: 'zh',
    category: 'immediate-relief',
    tags: ['热疗法', '热敷', '温度疗法', '疼痛缓解'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-11-15'),
    
    metadata: {
      title: {
        zh: '热疗法完整指南',
        en: 'Complete Heat Therapy Guide'
      },
      description: {
        zh: '详细介绍各种热疗方法及其使用技巧，包括热水袋、电热毯、热敷贴等不同热疗工具的正确使用方法。',
        en: 'Detailed introduction to various heat therapy methods and techniques, including proper use of hot water bottles, heating pads, heat patches and other heat therapy tools.'
      },
      author: 'Physical Therapy Team',
      keywords: ['热疗法', '热敷', '温度治疗', '疼痛管理'],
      featured: false,
      quality: {
        content: 8,
        design: 7,
        accuracy: 9,
        usefulness: 8,
        overall: 8.0
      },
      difficulty: 'beginner',
      estimatedReadTime: 6
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2],
        maxPreviewPages: 2
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['热疗', '热敷', '温度', '热水袋', '电热毯', '热敷贴']
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 13
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  },

  {
    id: 'menstrual-pain-assessment-form',
    type: 'pdf',
    status: 'active',
    version: {
      version: '1.0.0',
      releaseDate: new Date('2024-01-20'),
      isLatest: true,
      deprecated: false
    },
    filename: 'menstrual-pain-assessment-form.pdf',
    fileSize: 956432, // 0.9MB
    pageCount: 4,
    language: 'zh',
    category: 'assessment',
    tags: ['评估表', '疼痛评估', '症状记录', '医疗表格'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    
    metadata: {
      title: {
        zh: '经期疼痛评估表',
        en: 'Menstrual Pain Assessment Form'
      },
      description: {
        zh: '标准化的经期疼痛评估表格，帮助用户系统记录疼痛症状，为医疗咨询提供准确信息。',
        en: 'Standardized menstrual pain assessment form to help users systematically record pain symptoms and provide accurate information for medical consultation.'
      },
      author: 'Medical Team',
      keywords: ['评估', '表格', '疼痛记录', '症状跟踪'],
      featured: false,
      quality: {
        content: 8,
        design: 9,
        accuracy: 10,
        usefulness: 9,
        overall: 9.0
      },
      difficulty: 'beginner',
      estimatedReadTime: 3
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1],
        maxPreviewPages: 1
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['评估', '表格', '记录', '症状', '疼痛', '追踪']
      },
      interactive: {
        hasForm: true,
        formFields: ['疼痛强度', '疼痛位置', '持续时间', '伴随症状', '缓解方法'],
        hasCalculator: false,
        hasLinks: false
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 13
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  },

  // ============ 计划准备类 (Preparation) ============
  {
    id: 'menstrual-cycle-nutrition-plan',
    type: 'pdf',
    status: 'active',
    version: {
      version: '2.0.0',
      releaseDate: new Date('2024-02-01'),
      changelog: '新增季节性饮食建议和个性化营养方案',
      isLatest: true,
      deprecated: false
    },
    filename: 'menstrual-cycle-nutrition-plan.pdf',
    fileSize: 3245678, // 3.2MB
    pageCount: 16,
    language: 'zh',
    category: 'preparation',
    tags: ['营养计划', '饮食调理', '经期营养', '健康饮食'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-18'),
    
    metadata: {
      title: {
        zh: '经期营养管理计划',
        en: 'Menstrual Cycle Nutrition Plan'
      },
      description: {
        zh: '根据月经周期不同阶段的生理特点，制定科学的营养补充计划，包含食谱推荐、营养素搭配和饮食禁忌。',
        en: 'Based on the physiological characteristics of different phases of the menstrual cycle, develop a scientific nutrition supplement plan, including recipe recommendations, nutrient combinations and dietary restrictions.'
      },
      author: 'Nutritionist Team',
      keywords: ['营养', '饮食', '经期', '食谱', '健康'],
      thumbnail: '/images/thumbnails/nutrition-plan.jpg',
      featured: true,
      quality: {
        content: 9,
        design: 8,
        accuracy: 9,
        usefulness: 10,
        overall: 9.0
      },
      difficulty: 'intermediate',
      estimatedReadTime: 12
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2, 3],
        maxPreviewPages: 3
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['营养', '饮食', '食谱', '经期', '健康', '计划', '管理']
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 13
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  },

  {
    id: 'magnesium-gut-health-guide',
    type: 'pdf',
    status: 'active',
    version: {
      version: '1.2.0',
      releaseDate: new Date('2024-02-10'),
      isLatest: true,
      deprecated: false
    },
    filename: 'magnesium-gut-health-guide.pdf',
    fileSize: 2156789, // 2.1MB
    pageCount: 10,
    language: 'zh',
    category: 'preparation',
    tags: ['镁元素', '肠道健康', '营养补充', '微量元素'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-10-12'),
    
    metadata: {
      title: {
        zh: '镁与肠道健康综合指南',
        en: 'Magnesium and Gut Health Comprehensive Guide'
      },
      description: {
        zh: '深入解析镁元素对经期健康的重要作用，包括镁的来源、补充方法、与其他营养素的协同作用。',
        en: 'In-depth analysis of the important role of magnesium in menstrual health, including sources of magnesium, supplementation methods, and synergistic effects with other nutrients.'
      },
      author: 'Dr. Lisa Wang',
      keywords: ['镁', '微量元素', '营养补充', '肠道健康'],
      featured: false,
      quality: {
        content: 8,
        design: 7,
        accuracy: 9,
        usefulness: 8,
        overall: 8.0
      },
      difficulty: 'intermediate',
      estimatedReadTime: 8
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2],
        maxPreviewPages: 2
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['镁', '肠道', '健康', '营养', '补充', '微量元素']
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 16
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  },

  // ============ 学习理解类 (Learning) ============
  {
    id: 'comprehensive-medical-guide-to-dysmenorrhea',
    type: 'pdf',
    status: 'active',
    version: {
      version: '3.0.0',
      releaseDate: new Date('2024-03-01'),
      changelog: '更新了最新的医学研究成果和治疗指南',
      isLatest: true,
      deprecated: false
    },
    filename: 'comprehensive-medical-guide-dysmenorrhea.pdf',
    fileSize: 4567890, // 4.5MB
    pageCount: 24,
    language: 'zh',
    category: 'learning',
    tags: ['痛经', '医学指南', '疾病理解', '治疗方法'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-10'),
    
    metadata: {
      title: {
        zh: '痛经综合医学指南',
        en: 'Comprehensive Medical Guide to Dysmenorrhea'
      },
      description: {
        zh: '全面的痛经医学指南，涵盖病因分析、诊断标准、治疗方案和预防措施，基于最新医学研究编写。',
        en: 'Comprehensive medical guide to dysmenorrhea, covering etiology analysis, diagnostic criteria, treatment options and preventive measures, written based on the latest medical research.'
      },
      author: 'Medical Research Team',
      keywords: ['痛经', '医学', '诊断', '治疗', '预防'],
      thumbnail: '/images/thumbnails/medical-guide.jpg',
      featured: true,
      quality: {
        content: 10,
        design: 8,
        accuracy: 10,
        usefulness: 9,
        overall: 9.3
      },
      difficulty: 'advanced',
      estimatedReadTime: 20
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2, 3, 4],
        maxPreviewPages: 4
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['痛经', '医学', '指南', '诊断', '治疗', '病因', '预防']
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 16
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  },

  // ============ 长期管理类 (Management) ============
  {
    id: 'herbal-tea-menstrual-pain-relief',
    type: 'pdf',
    status: 'active',
    version: {
      version: '1.3.0',
      releaseDate: new Date('2024-03-15'),
      isLatest: true,
      deprecated: false
    },
    filename: 'herbal-tea-menstrual-pain-relief.pdf',
    fileSize: 2987654, // 2.9MB
    pageCount: 14,
    language: 'zh',
    category: 'management',
    tags: ['草药茶', '中医疗法', '天然疗法', '长期调理'],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-11-20'),
    
    metadata: {
      title: {
        zh: '草药茶经期疼痛缓解指南',
        en: 'Herbal Tea Guide for Menstrual Pain Relief'
      },
      description: {
        zh: '介绍各种有效的草药茶配方，用于长期调理和缓解经期不适，包含制作方法、服用时机和注意事项。',
        en: 'Introduction to various effective herbal tea formulas for long-term conditioning and relief of menstrual discomfort, including preparation methods, timing of consumption and precautions.'
      },
      author: 'Traditional Medicine Expert',
      keywords: ['草药茶', '中医', '天然疗法', '调理', '配方'],
      featured: false,
      quality: {
        content: 8,
        design: 7,
        accuracy: 9,
        usefulness: 8,
        overall: 8.0
      },
      difficulty: 'intermediate',
      estimatedReadTime: 10
    },
    
    content: {
      preview: {
        enabled: true,
        pages: [1, 2, 3],
        maxPreviewPages: 3
      },
      download: {
        enabled: true,
        requireAuth: false,
        trackDownloads: true
      },
      search: {
        indexed: true,
        searchKeywords: ['草药', '茶', '中医', '天然', '疗法', '配方', '调理']
      }
    },
    
    access: {
      level: 'public',
      public: true,
      regions: ['all'],
      ageRestriction: 16
    },
    
    analytics: {
      downloadCount: 0,
      viewCount: 0,
      rating: 0
    }
  }
];

/**
 * Legacy ID映射 - 用于向后兼容
 */
export const LEGACY_ID_MAPPING = {
  // 即时缓解类
  'immediate-pdf-1': 'immediate-pain-relief-guide-v2',
  'immediate-pdf-2': 'heat-therapy-comprehensive-guide',
  'immediate-pdf-3': 'menstrual-pain-assessment-form',
  
  // 计划准备类
  'preparation-pdf-1': 'healthy-habits-checklist', // 需要创建
  'preparation-pdf-2': 'menstrual-cycle-nutrition-plan',
  'preparation-pdf-3': 'magnesium-gut-health-guide',
  'preparation-pdf-4': 'zhan-zhuang-baduanjin-guide', // 需要创建
  
  // 学习理解类
  'learning-pdf-1': 'natural-therapy-assessment', // 需要创建
  'learning-pdf-2': 'menstrual-pain-complications-management', // 需要创建
  'learning-pdf-3': 'teacher-health-manual', // 需要创建
  'learning-pdf-4': 'teacher-collaboration-handbook', // 需要创建
  'learning-pdf-5': 'parent-communication-guide', // 需要创建
  'learning-pdf-6': 'us-insurance-quick-reference-card', // 需要创建
  
  // 长期管理类
  'management-pdf-1': 'herbal-tea-menstrual-pain-relief',
  'management-pdf-2': 'global-pain-relief-methods', // 需要创建
  'management-pdf-3': 'personal-health-profile-builder', // 需要创建
  
  // 旧版本文章映射
  'immediate-1': 'immediate-pain-relief-guide-v2',
  'immediate-2': 'heat-therapy-comprehensive-guide',
  'immediate-3': 'menstrual-pain-assessment-form',
  'preparation-1': 'menstrual-cycle-nutrition-plan',
  'preparation-6': 'magnesium-gut-health-guide',
  'learning-9': 'comprehensive-medical-guide-to-dysmenorrhea',
  'management-2': 'herbal-tea-menstrual-pain-relief'
} as const;

/**
 * 资源类别配置
 */
export const CATEGORY_CONFIG = {
  'immediate-relief': {
    displayOrder: 1,
    color: '#ef4444', // red-500
    icon: 'zap',
    description: {
      zh: '快速缓解经期疼痛的实用方法',
      en: 'Practical methods for quick period pain relief'
    }
  },
  'preparation': {
    displayOrder: 2,
    color: '#f59e0b', // amber-500
    icon: 'calendar',
    description: {
      zh: '经期前的准备和预防措施',
      en: 'Preparation and preventive measures before menstruation'
    }
  },
  'learning': {
    displayOrder: 3,
    color: '#3b82f6', // blue-500
    icon: 'book-open',
    description: {
      zh: '深入理解经期健康知识',
      en: 'In-depth understanding of menstrual health knowledge'
    }
  },
  'management': {
    displayOrder: 4,
    color: '#10b981', // emerald-500
    icon: 'settings',
    description: {
      zh: '长期的经期健康管理',
      en: 'Long-term menstrual health management'
    }
  },
  'assessment': {
    displayOrder: 5,
    color: '#8b5cf6', // violet-500
    icon: 'clipboard-check',
    description: {
      zh: '症状评估和记录工具',
      en: 'Symptom assessment and recording tools'
    }
  },
  'template': {
    displayOrder: 6,
    color: '#06b6d4', // cyan-500
    icon: 'document-text',
    description: {
      zh: '实用的表格和模板',
      en: 'Practical forms and templates'
    }
  }
} as const;

/**
 * 获取资源统计信息
 */
export function getResourceStats() {
  const stats = {
    totalCount: PDF_RESOURCES.length,
    totalSize: PDF_RESOURCES.reduce((sum, r) => sum + r.fileSize, 0),
    averageQuality: PDF_RESOURCES.reduce((sum, r) => sum + r.metadata.quality.overall, 0) / PDF_RESOURCES.length,
    totalDownloads: PDF_RESOURCES.reduce((sum, r) => sum + r.analytics.downloadCount, 0),
    totalViews: PDF_RESOURCES.reduce((sum, r) => sum + r.analytics.viewCount, 0),
    lastUpdated: Math.max(...PDF_RESOURCES.map(r => r.updatedAt.getTime())),
    
    byCategory: PDF_RESOURCES.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as any),
    
    byLanguage: PDF_RESOURCES.reduce((acc, r) => {
      acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {} as Record<SupportedLanguage, number>),
    
    byStatus: PDF_RESOURCES.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as any),
    
    topResources: {
      mostDownloaded: PDF_RESOURCES
        .sort((a, b) => b.analytics.downloadCount - a.analytics.downloadCount)
        .slice(0, 5)
        .map(r => ({ resourceId: r.id, count: r.analytics.downloadCount })),
      
      highestRated: PDF_RESOURCES
        .sort((a, b) => b.metadata.quality.overall - a.metadata.quality.overall)
        .slice(0, 5)
        .map(r => ({ resourceId: r.id, rating: r.metadata.quality.overall })),
      
      mostRecent: PDF_RESOURCES
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 5)
        .map(r => ({ resourceId: r.id, updatedAt: r.updatedAt })),
      
      trending: [] // 需要基于实际访问数据计算
    }
  };
  
  return stats;
}

/**
 * 根据ID获取资源
 */
export function getPDFResourceById(id: string): PDFResource | null {
  // 首先尝试直接查找
  let resource = PDF_RESOURCES.find(r => r.id === id);
  
  // 如果没找到，尝试Legacy映射
  if (!resource) {
    const mappedId = LEGACY_ID_MAPPING[id as keyof typeof LEGACY_ID_MAPPING];
    if (mappedId) {
      resource = PDF_RESOURCES.find(r => r.id === mappedId);
    }
  }
  
  return resource || null;
}

/**
 * 根据类别获取资源
 */
export function getPDFResourcesByCategory(category: ResourceCategory): PDFResource[] {
  return PDF_RESOURCES.filter(r => r.category === category && r.status === 'active');
}

/**
 * 获取精选资源
 */
export function getFeaturedResources(): PDFResource[] {
  return PDF_RESOURCES.filter(r => r.metadata.featured && r.status === 'active');
}

/**
 * 验证Legacy映射的完整性
 */
export function validateLegacyMappings(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [legacyId, modernId] of Object.entries(LEGACY_ID_MAPPING)) {
    const resource = getPDFResourceById(modernId);
    if (!resource) {
      errors.push(`Legacy mapping ${legacyId} -> ${modernId} points to non-existent resource`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}