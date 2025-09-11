import { MetadataRoute } from 'next';

// Sitemap generator for periodhub.health - Environment variable with fallback
export default function sitemap(): MetadataRoute.Sitemap {
  // Environment variable with production fallback
  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  };
  
  const baseUrl = getBaseUrl();
  
  // Debug: Log environment variable (will be visible in build logs)
  console.log('Sitemap baseUrl:', baseUrl);
  console.log('NEXT_PUBLIC_BASE_URL env var:', process.env.NEXT_PUBLIC_BASE_URL);
  console.log('Environment check - NODE_ENV:', process.env.NODE_ENV);
  
  const currentDate = new Date();
  
  // 主要页面
  const mainPages = [
    // 首页
    '/zh',
    '/en',
    // 核心功能页面
    '/zh/interactive-tools',
    '/en/interactive-tools',
    '/zh/immediate-relief',
    '/en/immediate-relief',
    '/zh/natural-therapies',
    '/en/natural-therapies',
    '/zh/downloads',
    '/en/downloads',
    '/zh/articles',
    '/en/articles',
    '/zh/health-guide',
    '/en/health-guide',
    '/zh/teen-health',
    '/en/teen-health',
    '/zh/scenario-solutions',
    '/en/scenario-solutions',
    '/zh/cultural-charms',
    '/en/cultural-charms',
    '/zh/special-therapies',
    '/en/special-therapies',
    '/zh/privacy-policy',
    '/en/privacy-policy',
    '/zh/terms-of-service',
    '/en/terms-of-service',
  ];

  // 互动工具子页面
  const interactiveTools = [
    '/zh/interactive-tools/symptom-assessment',
    '/en/interactive-tools/symptom-assessment',
    '/zh/interactive-tools/pain-tracker',
    '/en/interactive-tools/pain-tracker',
    '/zh/interactive-tools/constitution-test',
    '/en/interactive-tools/constitution-test',
    '/zh/interactive-tools/cycle-tracker',
    '/en/interactive-tools/cycle-tracker',
    '/zh/interactive-tools/symptom-tracker',
    '/en/interactive-tools/symptom-tracker',
    '/zh/interactive-tools/period-pain-assessment',
    '/en/interactive-tools/period-pain-assessment',
  ];

  // 健康指南子页面
  const healthGuidePages = [
    '/zh/health-guide/global-perspectives',
    '/en/health-guide/global-perspectives',
    '/zh/health-guide/lifestyle',
    '/en/health-guide/lifestyle',
    '/zh/health-guide/medical-care',
    '/en/health-guide/medical-care',
    '/zh/health-guide/myths-facts',
    '/en/health-guide/myths-facts',
    '/zh/health-guide/relief-methods',
    '/en/health-guide/relief-methods',
    '/zh/health-guide/understanding-pain',
    '/en/health-guide/understanding-pain',
  ];

  // 青少年健康子页面
  const teenHealthPages = [
    '/zh/teen-health/campus-guide',
    '/en/teen-health/campus-guide',
    '/zh/teen-health/communication-guide',
    '/en/teen-health/communication-guide',
    '/zh/teen-health/development-pain',
    '/en/teen-health/development-pain',
    '/zh/teen-health/emotional-support',
    '/en/teen-health/emotional-support',
  ];

  // 场景解决方案子页面
  const scenarioPages = [
    '/zh/scenario-solutions/office',
    '/en/scenario-solutions/office',
    '/zh/scenario-solutions/commute',
    '/en/scenario-solutions/commute',
    '/zh/scenario-solutions/exercise',
    '/en/scenario-solutions/exercise',
    '/zh/scenario-solutions/sleep',
    '/en/scenario-solutions/sleep',
    '/zh/scenario-solutions/social',
    '/en/scenario-solutions/social',
    '/zh/scenario-solutions/lifeStages',
    '/en/scenario-solutions/lifeStages',
    '/zh/scenario-solutions/emergency-kit',
    '/en/scenario-solutions/emergency-kit',
  ];

  // 所有静态页面
  const staticPages = [
    ...mainPages,
    ...interactiveTools,
    ...healthGuidePages,
    ...teenHealthPages,
    ...scenarioPages,
  ];

  // 文章页面
  const articleSlugs = [
    '5-minute-period-pain-relief',
    'anti-inflammatory-diet-period-pain',
    'comprehensive-iud-guide',
    'comprehensive-medical-guide-to-dysmenorrhea',
    'essential-oils-aromatherapy-menstrual-pain-guide',
    'global-traditional-menstrual-pain-relief',
    'heat-therapy-complete-guide',
    'herbal-tea-menstrual-pain-relief',
    'hidden-culprits-of-menstrual-pain',
    'home-natural-menstrual-pain-relief',
    'magnesium-gut-health-comprehensive-guide',
    'menstrual-nausea-relief-guide',
    'menstrual-pain-accompanying-symptoms-guide',
    'menstrual-pain-complications-management',
    'menstrual-pain-faq-expert-answers',
    'menstrual-pain-medical-guide',
    'menstrual-pain-vs-other-abdominal-pain-guide',
    'natural-physical-therapy-comprehensive-guide',
    'nsaid-menstrual-pain-professional-guide',
    'period-friendly-recipes',
    'personal-menstrual-health-profile',
    'recommended-reading-list',
    'specific-menstrual-pain-management-guide',
    'comprehensive-menstrual-sleep-quality-guide',
    'menstrual-pain-research-progress-2024',
    'menstrual-preventive-care-complete-plan',
    'menstrual-stress-management-complete-guide',
    'understanding-your-cycle',
    'us-menstrual-pain-insurance-coverage-guide',
    'when-to-see-doctor-period-pain',
    'when-to-seek-medical-care-comprehensive-guide',
    'womens-lifecycle-menstrual-pain-analysis',
    'zhan-zhuang-baduanjin-for-menstrual-pain-relief',
    'ginger-menstrual-pain-relief-guide',
    'comprehensive-report-non-medical-factors-menstrual-pain',
    'period-pain-simulator-accuracy-analysis',
    'medication-vs-natural-remedies-menstrual-pain'
  ];

  // 生成文章页面
  const articlePages = [];
  for (const slug of articleSlugs) {
    articlePages.push(`/zh/articles/${slug}`);
    articlePages.push(`/en/articles/${slug}`);
  }
  
  // 添加缺失的文章页面（修复404错误）
  const missingArticleSlugs = [
    'ginger-menstrual-pain-relief-guide',
    'comprehensive-report-non-medical-factors-menstrual-pain',
    'period-pain-simulator-accuracy-analysis',
    'medication-vs-natural-remedies-menstrual-pain'
  ];
  
  for (const slug of missingArticleSlugs) {
    articlePages.push(`/zh/articles/${slug}`);
    articlePages.push(`/en/articles/${slug}`);
  }

  // 所有页面
  const allPages = [...staticPages, ...articlePages];

  // 生成静态页面的 sitemap 条目
  const staticEntries: MetadataRoute.Sitemap = allPages.map((page) => {
    let priority = 0.8;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
    
    // 设置优先级和更新频率
    if (page.includes('/en') && !page.includes('/articles/')) {
      priority = 1.0; // 英文首页和主要页面（主要市场 - 北美）
      changeFrequency = 'weekly';
    } else if (page.includes('/zh') && !page.includes('/articles/')) {
      priority = 0.9; // 中文首页和主要页面（次要市场 - 中国大陆）
      changeFrequency = 'weekly';
    } else if (page.includes('/interactive-tools')) {
      priority = 0.9; // 互动工具页面
      changeFrequency = 'weekly';
    } else if (page.includes('/articles/')) {
      priority = 0.7; // 文章页面
      changeFrequency = 'monthly';
    } else if (page.includes('/teen-health') || page.includes('/health-guide')) {
      priority = 0.8; // 健康相关页面
      changeFrequency = 'weekly';
    }
    
    return {
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  // PDF 资源文件 - 包含在sitemap中供Bing发现
  const pdfFiles = [
    // 中文PDF文件
    '/pdf-files/parent-communication-guide-zh.pdf',
    '/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
    '/pdf-files/teacher-collaboration-handbook-zh.pdf',
    '/pdf-files/healthy-habits-checklist-zh.pdf',
    '/pdf-files/specific-menstrual-pain-management-guide-zh.pdf',
    '/pdf-files/natural-therapy-assessment-zh.pdf',
    '/pdf-files/menstrual-cycle-nutrition-plan-zh.pdf',
    '/pdf-files/campus-emergency-checklist-zh.pdf',
    '/pdf-files/menstrual-pain-complications-management-zh.pdf',
    '/pdf-files/magnesium-gut-health-menstrual-pain-guide-zh.pdf',
    '/pdf-files/pain-tracking-form-zh.pdf',
    '/pdf-files/teacher-health-manual-zh.pdf',
    // 英文PDF文件
    '/pdf-files/parent-communication-guide-en.pdf',
    '/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-en.pdf',
    '/pdf-files/teacher-collaboration-handbook-en.pdf',
    '/pdf-files/healthy-habits-checklist-en.pdf',
    '/pdf-files/specific-menstrual-pain-management-guide-en.pdf',
    '/pdf-files/natural-therapy-assessment-en.pdf',
    '/pdf-files/menstrual-cycle-nutrition-plan-en.pdf',
    '/pdf-files/campus-emergency-checklist-en.pdf',
    '/pdf-files/menstrual-pain-complications-management-en.pdf',
    '/pdf-files/magnesium-gut-health-menstrual-pain-guide-en.pdf',
    '/pdf-files/pain-tracking-form-en.pdf',
    '/pdf-files/teacher-health-manual-en.pdf',
  ];

  // 生成PDF文件的sitemap条目
  const pdfEntries: MetadataRoute.Sitemap = pdfFiles.map((pdf) => ({
    url: `${baseUrl}${pdf}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6, // PDF文件优先级较低
  }));

  // 合并所有条目
  const allEntries = [...staticEntries, ...pdfEntries];

  return allEntries;
}