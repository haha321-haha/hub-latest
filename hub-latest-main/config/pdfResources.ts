// PDF资源配置
import type { PDFCategory } from '@/types/pdf';

export interface PDFResource {
  id: string;
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
  filename: string;
  category: PDFCategory;
  size: string;
  downloadUrl: string;
  icon: string;
  featured?: boolean;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const pdfResources: PDFResource[] = [
  {
    id: 'pain-tracker-guide',
    title: '疼痛追踪指南',
    titleKey: 'painTrackerGuide.title',
    description: '详细的疼痛追踪方法和记录技巧',
    descriptionKey: 'painTrackerGuide.description',
    filename: 'pain-tracker-guide.pdf',
    category: 'management-tools',
    size: '2.5MB',
    downloadUrl: '/downloads/pain-tracker-guide.pdf',
    icon: '📊',
    fileSize: 2500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'constitution-guide',
    title: '中医体质养生指南',
    titleKey: 'constitutionGuide.title',
    description: '基于中医体质理论的个性化养生建议',
    descriptionKey: 'constitutionGuide.description',
    filename: 'constitution-guide.pdf',
    category: 'management-tools',
    size: '3.2MB',
    downloadUrl: '/downloads/constitution-guide.pdf',
    icon: '🌿',
    fileSize: 3200,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'campus-emergency-checklist',
    title: '校园应急清单',
    titleKey: 'campusEmergencyChecklist.title',
    description: '学生专用的经期应急处理指南和必备物品清单',
    descriptionKey: 'campusEmergencyChecklist.description',
    filename: 'campus-emergency-checklist.pdf',
    category: 'management-tools',
    size: '1.8MB',
    downloadUrl: '/downloads/campus-emergency-checklist.pdf',
    icon: '🏫',
    fileSize: 1800,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'menstrual-health-handbook',
    title: '月经健康手册',
    titleKey: 'menstrualHealthHandbook.title',
    description: '全面的月经健康知识和护理指南',
    descriptionKey: 'menstrualHealthHandbook.description',
    filename: 'menstrual-health-handbook.pdf',
    category: 'health-management',
    size: '4.1MB',
    downloadUrl: '/downloads/menstrual-health-handbook.pdf',
    icon: '📚',
    fileSize: 4100,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'pain-tracking-form',
    title: '疼痛追踪表',
    titleKey: 'painTrackingForm.title',
    description: '详细的疼痛追踪方法和记录技巧',
    descriptionKey: 'painTrackingForm.description',
    filename: 'pain-tracking-form.pdf',
    category: 'management-tools',
    size: '2.8MB',
    downloadUrl: '/downloads/pain-tracking-form.pdf',
    icon: '📊',
    fileSize: 2800,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'menstrual-cycle-nutrition-plan',
    title: '经期营养计划',
    titleKey: 'menstrualCycleNutritionPlan.title',
    description: '科学的经期营养指导方案',
    descriptionKey: 'menstrualCycleNutritionPlan.description',
    filename: 'menstrual-cycle-nutrition-plan.pdf',
    category: 'health-management',
    size: '3.5MB',
    downloadUrl: '/downloads/menstrual-cycle-nutrition-plan.pdf',
    icon: '🥗',
    fileSize: 3500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'healthy-habits-checklist',
    title: '健康习惯清单',
    titleKey: 'healthyHabitsChecklist.title',
    description: '建立有益于经期健康的日常习惯',
    descriptionKey: 'healthyHabitsChecklist.description',
    filename: 'healthy-habits-checklist.pdf',
    category: 'management-tools',
    size: '2.2MB',
    downloadUrl: '/downloads/healthy-habits-checklist.pdf',
    icon: '✅',
    fileSize: 2200,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'natural-therapy-assessment',
    title: '自然疗法效果评估表',
    titleKey: 'naturalTherapyAssessment.title',
    description: '系统评估不同自然疗法的个人效果',
    descriptionKey: 'naturalTherapyAssessment.description',
    filename: 'natural-therapy-assessment.pdf',
    category: 'educational-resources',
    size: '3.8MB',
    downloadUrl: '/downloads/natural-therapy-assessment.pdf',
    icon: '🌿',
    fileSize: 3800,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'parent-communication-guide',
    title: '家长沟通指导手册',
    titleKey: 'parentCommunicationGuide.title',
    description: '帮助家长理解青春期女儿的生理变化',
    descriptionKey: 'parentCommunicationGuide.description',
    filename: 'parent-communication-guide.pdf',
    category: 'communication-guidance',
    size: '4.2MB',
    downloadUrl: '/downloads/parent-communication-guide.pdf',
    icon: '👨‍👩‍👧',
    fileSize: 4200,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'teacher-health-manual',
    title: '教师健康管理手册',
    titleKey: 'teacherHealthManual.title',
    description: '学校环境下的经期健康管理',
    descriptionKey: 'teacherHealthManual.description',
    filename: 'teacher-health-manual.pdf',
    category: 'educational-resources',
    size: '3.9MB',
    downloadUrl: '/downloads/teacher-health-manual.pdf',
    icon: '👩‍🏫',
    fileSize: 3900,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'teacher-collaboration-handbook',
    title: '教师协作手册',
    titleKey: 'teacherCollaborationHandbook.title',
    description: '多学科教师间的协作机制',
    descriptionKey: 'teacherCollaborationHandbook.description',
    filename: 'teacher-collaboration-handbook.pdf',
    category: 'educational-resources',
    size: '3.6MB',
    downloadUrl: '/downloads/teacher-collaboration-handbook.pdf',
    icon: '🤝',
    fileSize: 3600,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'specific-menstrual-pain-management-guide',
    title: '特定痛经管理指南',
    titleKey: 'specificMenstrualPainManagementGuide.title',
    description: '针对不同类型痛经的个性化方案',
    descriptionKey: 'specificMenstrualPainManagementGuide.description',
    filename: 'specific-menstrual-pain-management-guide.pdf',
    category: 'health-management',
    size: '4.5MB',
    downloadUrl: '/downloads/specific-menstrual-pain-management-guide.pdf',
    icon: '🎯',
    fileSize: 4500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'menstrual-pain-complications-management',
    title: '并发症管理指南',
    titleKey: 'menstrualPainComplicationsManagement.title',
    description: '识别经期并发症的早期征象',
    descriptionKey: 'menstrualPainComplicationsManagement.description',
    filename: 'menstrual-pain-complications-management.pdf',
    category: 'health-management',
    size: '3.7MB',
    downloadUrl: '/downloads/menstrual-pain-complications-management.pdf',
    icon: '⚠️',
    fileSize: 3700,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'magnesium-gut-health-guide',
    title: '镁与肠道健康指南',
    titleKey: 'magnesiumGutHealthGuide.title',
    description: '镁元素对经期健康的重要作用',
    descriptionKey: 'magnesiumGutHealthGuide.description',
    filename: 'magnesium-gut-health-guide.pdf',
    category: 'health-management',
    size: '3.3MB',
    downloadUrl: '/downloads/magnesium-gut-health-guide.pdf',
    icon: '💊',
    fileSize: 3300,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'zhan-zhuang-baduanjin-illustrated-guide',
    title: '站桩八段锦图解指南',
    titleKey: 'zhanZhuangBaduanjinIllustratedGuide.title',
    description: '传统中医养生功法的现代应用',
    descriptionKey: 'zhanZhuangBaduanjinIllustratedGuide.description',
    filename: 'zhan-zhuang-baduanjin-illustrated-guide.pdf',
    category: 'health-management',
    size: '4.8MB',
    downloadUrl: '/downloads/zhan-zhuang-baduanjin-illustrated-guide.pdf',
    icon: '🧘‍♀️',
    fileSize: 4800,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'us-insurance-quick-reference-card',
    title: '美国医疗保险快速参考卡',
    titleKey: 'usInsuranceQuickReferenceCard.title',
    description: '2025年Medicare Part D覆盖缺口期完全取消',
    descriptionKey: 'usInsuranceQuickReferenceCard.description',
    filename: 'us-insurance-quick-reference-card.pdf',
    category: 'educational-resources',
    size: '2.9MB',
    downloadUrl: '/downloads/us-insurance-quick-reference-card.pdf',
    icon: '🏥',
    fileSize: 2900,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

// 导出兼容名称
export const PDF_RESOURCES = pdfResources;

export const getPDFResource = (id: string): PDFResource | undefined => {
  return pdfResources.find(resource => resource.id === id);
};

export const getPDFResourcesByCategory = (category: string): PDFResource[] => {
  return pdfResources.filter(resource => resource.category === category);
};

export const getPDFResourceById = getPDFResource;

// 新增导出函数以满足构建需求
export const getAllPDFResources = (): PDFResource[] => {
  return pdfResources;
};

export const getAllCategories = (): PDFCategory[] => {
  return Array.from(new Set(pdfResources.map(r => r.category))) as PDFCategory[];
};

export const getCategoryInfo = (categoryId: PDFCategory) => {
  const categoryMap: Record<PDFCategory, { id: PDFCategory; titleKey: string; descriptionKey: string; icon: string; order: number }> = {
    'management-tools': {
      id: 'management-tools',
      titleKey: 'categories.managementTools',
      descriptionKey: 'categories.managementToolsDescription',
      icon: '📊',
      order: 1
    },
    'health-management': {
      id: 'health-management',
      titleKey: 'categories.healthManagement',
      descriptionKey: 'categories.healthManagementDescription',
      icon: '💊',
      order: 2
    },
    'communication-guidance': {
      id: 'communication-guidance',
      titleKey: 'categories.communication',
      descriptionKey: 'categories.communicationDescription',
      icon: '💬',
      order: 3
    },
    'educational-resources': {
      id: 'educational-resources',
      titleKey: 'categories.education',
      descriptionKey: 'categories.educationDescription',
      icon: '📚',
      order: 4
    }
  };
  return categoryMap[categoryId];
};

export const getResourceStats = () => {
  return {
    totalPDFs: pdfResources.length,
    totalCategories: Array.from(new Set(pdfResources.map(r => r.category))).length,
    categoryStats: pdfResources.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    featuredCount: pdfResources.filter(r => r.featured).length
  };
};

export default pdfResources;
