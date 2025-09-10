import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales } from '@/i18n';
import { getPDFResourceById } from '@/config/pdfResources';
import { getPreviewContentById } from '@/config/previewContent';
import { mapPDFId, hasPDFMapping, getAllMappedIds } from '@/components/pdf-id-mapping';
import PDFPreviewPage from './PDFPreviewPage';

interface PreviewPageProps {
  params: Promise<{ 
    locale: Locale;
    id: string;
  }>;
}

// 新增PDF资源的基本信息映射
const NEW_PDF_INFO: Record<string, { title: { zh: string; en: string }; description: { zh: string; en: string } }> = {
  'emergency-pain-relief-card': {
    title: { zh: '紧急疼痛缓解卡片', en: 'Emergency Pain Relief Card' },
    description: { zh: '便携式紧急疼痛缓解方法速查卡', en: 'Portable quick reference card for emergency pain relief methods' }
  },
  '5-minute-relief-checklist': {
    title: { zh: '5分钟快速缓解检查清单', en: '5-Minute Quick Relief Checklist' },
    description: { zh: '即时可用的5分钟快速缓解步骤清单', en: 'Instant-use 5-minute quick relief step checklist' }
  },
  'heat-therapy-guide-pdf': {
    title: { zh: '热疗完整指南PDF版', en: 'Complete Heat Therapy Guide PDF' },
    description: { zh: '详细的热疗使用方法和注意事项指南', en: 'Detailed guide on heat therapy methods and precautions' }
  },
  'workplace-relief-toolkit': {
    title: { zh: '职场疼痛缓解工具包', en: 'Workplace Pain Relief Toolkit' },
    description: { zh: '办公环境下的疼痛管理和缓解方案', en: 'Pain management and relief solutions for office environments' }
  },
  'monthly-preparation-planner': {
    title: { zh: '月度准备计划表', en: 'Monthly Preparation Planner' },
    description: { zh: '提前规划经期健康管理的月度计划工具', en: 'Monthly planning tool for advance menstrual health management' }
  },
  'stress-management-workbook': {
    title: { zh: '压力管理工作册', en: 'Stress Management Workbook' },
    description: { zh: '经期压力管理的实用练习册和指导手册', en: 'Practical workbook and guide for menstrual stress management' }
  },
  'sleep-quality-improvement-guide': {
    title: { zh: '睡眠质量改善指南', en: 'Sleep Quality Improvement Guide' },
    description: { zh: '经期睡眠优化的详细指导和实用技巧', en: 'Detailed guidance and practical tips for menstrual sleep optimization' }
  },
  'menstrual-cycle-education-guide': {
    title: { zh: '月经周期教育指南', en: 'Menstrual Cycle Education Guide' },
    description: { zh: '全面的月经周期科学教育和健康知识材料', en: 'Comprehensive scientific education material about menstrual cycle and health' }
  },
  'pain-research-summary-2024': {
    title: { zh: '2024痛经研究摘要', en: '2024 Pain Research Summary' },
    description: { zh: '2024年最新痛经研究成果和科学进展汇总', en: '2024 latest menstrual pain research findings and scientific progress summary' }
  },
  'medical-consultation-preparation': {
    title: { zh: '就医咨询准备指南', en: 'Medical Consultation Preparation Guide' },
    description: { zh: '就医前的准备工作和问题清单指导', en: 'Guidance for preparation and question checklist before medical appointments' }
  },
  'global-health-perspectives': {
    title: { zh: '全球健康视角报告', en: 'Global Health Perspectives Report' },
    description: { zh: '不同文化背景下经期健康管理方法的比较研究', en: 'Comparative study of menstrual health management across different cultural backgrounds' }
  },
  'long-term-health-planner': {
    title: { zh: '长期健康规划师', en: 'Long-term Health Planner' },
    description: { zh: '年度健康管理和目标设定的专业工具', en: 'Professional tool for annual health management and goal setting' }
  },
  'personal-health-journal': {
    title: { zh: '个人健康日记模板', en: 'Personal Health Journal Template' },
    description: { zh: '长期健康追踪和记录的日记模板工具', en: 'Journal template tool for long-term health tracking and recording' }
  },
  'nutrition-meal-planning-kit': {
    title: { zh: '营养膳食规划工具包', en: 'Nutrition Meal Planning Kit' },
    description: { zh: '长期营养管理和膳食规划的实用工具包', en: 'Practical toolkit for long-term nutrition management and meal planning' }
  },
  'exercise-routine-builder': {
    title: { zh: '运动计划构建器', en: 'Exercise Routine Builder' },
    description: { zh: '个性化运动计划制定和执行的指导工具', en: 'Guidance tool for creating and implementing personalized exercise routines' }
  },
  'lifestyle-assessment-toolkit': {
    title: { zh: '生活方式评估工具包', en: 'Lifestyle Assessment Toolkit' },
    description: { zh: '全面的生活方式健康评估和优化工具', en: 'Comprehensive lifestyle health assessment and optimization tool' }
  },
  'sustainable-health-strategies': {
    title: { zh: '可持续健康策略指南', en: 'Sustainable Health Strategies Guide' },
    description: { zh: '长期可持续健康管理策略的指导手册', en: 'Guidance manual for long-term sustainable health management strategies' }
  }
};

// Generate metadata for the page
export async function generateMetadata({
  params
}: PreviewPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  // 🚀 快速修复：映射SimplePDFCenter的ID到真实资源ID
  const realId = mapPDFId(id);
  const resource = getPDFResourceById(realId);
  const previewContent = getPreviewContentById(realId);
  
  // 如果找不到配置，使用新PDF信息
  const pdfInfo = NEW_PDF_INFO[realId];
  
  if (!resource && !previewContent && !pdfInfo) {
    return {
      title: 'Resource Not Found - Period Hub',
      description: 'The requested PDF resource could not be found.'
    };
  }

  const title = pdfInfo 
    ? (locale === 'zh' ? pdfInfo.title.zh : pdfInfo.title.en)
    : previewContent 
    ? (locale === 'zh' ? previewContent.title.zh : previewContent.title.en)
    : (locale === 'zh' ? `${realId} PDF资源` : `${realId} PDF Resource`);
    
  const description = pdfInfo
    ? (locale === 'zh' ? pdfInfo.description.zh : pdfInfo.description.en)
    : locale === 'zh' 
    ? `预览 ${title} - Period Hub 经期健康专业资源`
    : `Preview ${title} - Period Hub Professional Health Resources`;

  return {
    title: `${title} 预览 - Period Hub`,
    description,
    keywords: locale === 'zh' 
      ? `${title},PDF预览,经期健康,Period Hub`
      : `${title},PDF preview,menstrual health,Period Hub`,
  };
}

// Generate static params for all supported locales and preview-enabled resources
export async function generateStaticParams() {
  // 🚀 快速修复：包含原有的真实ID和SimplePDFCenter映射的ID
  const realIds = [
    'pain-tracking-form',
    'campus-emergency-checklist',
    'menstrual-cycle-nutrition-plan',
    'healthy-habits-checklist',
    'natural-therapy-assessment',
    'parent-communication-guide',
    'teacher-health-manual',
    'teacher-collaboration-handbook',
    'specific-menstrual-pain-management-guide',
    'menstrual-pain-complications-management',
    'magnesium-gut-health-guide',
    'zhan-zhuang-baduanjin-illustrated-guide'
  ];
  
  // 添加SimplePDFCenter中使用的映射ID和新增PDF的ID
  const mappedIds = getAllMappedIds();
  const newPdfIds = Object.keys(NEW_PDF_INFO);
  const allPreviewableIds = [...realIds, ...mappedIds, ...newPdfIds];

  const params = [];
  for (const locale of locales) {
    for (const id of allPreviewableIds) {
      params.push({ locale, id });
    }
  }

  return params;
}

export default async function PreviewPage({
  params
}: PreviewPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // 🚀 快速修复：映射SimplePDFCenter的ID到真实资源ID
  const realId = mapPDFId(id);
  
  // Validate resource exists using the real ID
  const resource = getPDFResourceById(realId);
  const previewContent = getPreviewContentById(realId);
  const pdfInfo = NEW_PDF_INFO[realId];
  
  // 如果既不在原有配置中，也不在新PDF信息中，返回404
  if (!resource && !previewContent && !pdfInfo) {
    notFound();
  }

  // 使用真实ID进行预览
  return <PDFPreviewPage locale={locale} resourceId={realId} />;
}
