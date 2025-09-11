import { MetadataRoute } from 'next';

// 静态页面sitemap
export default function sitemapPages(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  const currentDate = new Date();

  // 主要页面
  const mainPages = [
    '/zh', '/en',
    '/zh/interactive-tools', '/en/interactive-tools',
    '/zh/immediate-relief', '/en/immediate-relief',
    '/zh/natural-therapies', '/en/natural-therapies',
    '/zh/downloads', '/en/downloads',
    '/zh/articles', '/en/articles',
    '/zh/health-guide', '/en/health-guide',
    '/zh/teen-health', '/en/teen-health',
    '/zh/scenario-solutions', '/en/scenario-solutions',
    '/zh/cultural-charms', '/en/cultural-charms',
    '/zh/special-therapies', '/en/special-therapies',
    '/zh/privacy-policy', '/en/privacy-policy',
    '/zh/terms-of-service', '/en/terms-of-service',
  ];

  // 互动工具子页面
  const interactiveTools = [
    '/zh/interactive-tools/symptom-assessment', '/en/interactive-tools/symptom-assessment',
    '/zh/interactive-tools/pain-tracker', '/en/interactive-tools/pain-tracker',
    '/zh/interactive-tools/constitution-test', '/en/interactive-tools/constitution-test',
    '/zh/interactive-tools/cycle-tracker', '/en/interactive-tools/cycle-tracker',
    '/zh/interactive-tools/symptom-tracker', '/en/interactive-tools/symptom-tracker',
    '/zh/interactive-tools/period-pain-assessment', '/en/interactive-tools/period-pain-assessment',
  ];

  // 健康指南子页面
  const healthGuidePages = [
    '/zh/health-guide/global-perspectives', '/en/health-guide/global-perspectives',
    '/zh/health-guide/lifestyle', '/en/health-guide/lifestyle',
    '/zh/health-guide/medical-care', '/en/health-guide/medical-care',
    '/zh/health-guide/myths-facts', '/en/health-guide/myths-facts',
    '/zh/health-guide/relief-methods', '/en/health-guide/relief-methods',
    '/zh/health-guide/understanding-pain', '/en/health-guide/understanding-pain',
  ];

  // 青少年健康子页面
  const teenHealthPages = [
    '/zh/teen-health/campus-guide', '/en/teen-health/campus-guide',
    '/zh/teen-health/communication-guide', '/en/teen-health/communication-guide',
    '/zh/teen-health/development-pain', '/en/teen-health/development-pain',
    '/zh/teen-health/emotional-support', '/en/teen-health/emotional-support',
  ];

  // 场景解决方案子页面
  const scenarioPages = [
    '/zh/scenario-solutions/office', '/en/scenario-solutions/office',
    '/zh/scenario-solutions/commute', '/en/scenario-solutions/commute',
    '/zh/scenario-solutions/exercise', '/en/scenario-solutions/exercise',
    '/zh/scenario-solutions/sleep', '/en/scenario-solutions/sleep',
    '/zh/scenario-solutions/social', '/en/scenario-solutions/social',
    '/zh/scenario-solutions/lifeStages', '/en/scenario-solutions/lifeStages',
    '/zh/scenario-solutions/emergency-kit', '/en/scenario-solutions/emergency-kit',
  ];

  const allPages = [...mainPages, ...interactiveTools, ...healthGuidePages, ...teenHealthPages, ...scenarioPages];

  return allPages.map((page) => {
    let priority = 0.8;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
    
    if (page.includes('/en') && !page.includes('/articles/')) {
      priority = 1.0;
      changeFrequency = 'weekly';
    } else if (page.includes('/zh') && !page.includes('/articles/')) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (page.includes('/interactive-tools')) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (page.includes('/teen-health') || page.includes('/health-guide')) {
      priority = 0.8;
      changeFrequency = 'weekly';
    }
    
    return {
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });
}
