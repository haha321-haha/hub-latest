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
