import { MetadataRoute } from 'next';

// PDF文件sitemap
export default function sitemapPdfs(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  const currentDate = new Date();

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

  return pdfFiles.map((pdf) => ({
    url: `${baseUrl}${pdf}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}
