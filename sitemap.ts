import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  
  // 静态页面
  const staticPages = [
    // 主要入口（稳定首页）
    '/zh/interactive-tools',
    '/en/interactive-tools',
    '/zh/immediate-relief',
    '/en/immediate-relief',
    '/zh/natural-therapies',
    '/en/natural-therapies',
    '/zh/interactive-tools',
    '/en/interactive-tools',
    '/zh/interactive-tools/symptom-assessment',
    '/en/interactive-tools/symptom-assessment',
    '/zh/interactive-tools/pain-tracker',
    '/en/interactive-tools/pain-tracker',
    '/zh/downloads',
    '/en/downloads',
    '/zh/articles',
    '/en/articles',
    '/zh/articles/pain-management',
    '/en/articles/pain-management',
    '/zh/articles/pain-management/understanding-dysmenorrhea',
    '/en/articles/pain-management/understanding-dysmenorrhea',
    '/zh/health-guide',
    '/en/health-guide',
    '/zh/teen-health',
    '/en/teen-health',
    '/zh/scenario-solutions',
    '/en/scenario-solutions',
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

  // 生成静态页面的 sitemap 条目
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date('2025-08-15'),
    changeFrequency: 'weekly' as const,
    priority: page.includes('/interactive-tools') ? 1 : 0.8,
  }));



  // PDF 资源文件 - 只包含有语言后缀的文件（用户实际需要的）
  const pdfFiles = [
    // 中文版PDF
    'parent-communication-guide-zh.pdf',
    'zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
    'teacher-collaboration-handbook-zh.pdf',
    'healthy-habits-checklist-zh.pdf',
    'specific-menstrual-pain-management-guide-zh.pdf',
    'natural-therapy-assessment-zh.pdf',
    'menstrual-cycle-nutrition-plan-zh.pdf',
    'campus-emergency-checklist-zh.pdf',
    'menstrual-pain-complications-management-zh.pdf',
    'magnesium-gut-health-menstrual-pain-guide-zh.pdf',
    'pain-tracking-form-zh.pdf',
    'teacher-health-manual-zh.pdf',
    // 英文版PDF
    'parent-communication-guide-en.pdf',
    'zhan-zhuang-baduanjin-illustrated-guide-en.pdf',
    'teacher-collaboration-handbook-en.pdf',
    'healthy-habits-checklist-en.pdf',
    'specific-menstrual-pain-management-guide-en.pdf',
    'natural-therapy-assessment-en.pdf',
    'menstrual-cycle-nutrition-plan-en.pdf',
    'campus-emergency-checklist-en.pdf',
    'menstrual-pain-complications-management-en.pdf',
    'magnesium-gut-health-menstrual-pain-guide-en.pdf',
    'pain-tracking-form-en.pdf',
    'teacher-health-manual-en.pdf',
  ];

  const pdfEntries: MetadataRoute.Sitemap = pdfFiles.map((filename) => ({
    url: `${baseUrl}/pdf-files/${filename}`,
    lastModified: new Date('2025-08-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 实际存在的文章页面
  const articleEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/zh/articles/pain-management/understanding-dysmenorrhea`,
      lastModified: new Date('2025-08-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/articles/pain-management/understanding-dysmenorrhea`,
      lastModified: new Date('2025-08-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...pdfEntries, ...articleEntries];
}