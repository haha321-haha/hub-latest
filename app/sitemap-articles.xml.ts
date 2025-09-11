import { MetadataRoute } from 'next';

// 文章页面sitemap
export default function sitemapArticles(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  const currentDate = new Date();

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

  const articlePages = [];
  for (const slug of articleSlugs) {
    articlePages.push(`/zh/articles/${slug}`);
    articlePages.push(`/en/articles/${slug}`);
  }

  return articlePages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}
