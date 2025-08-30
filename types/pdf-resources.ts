// Period Hub PDF资源优化类型定义
// 38个资源分类系统

export type PDFCategory = 'emergency' | 'daily' | 'learning' | 'professional';
export type PDFPriority = 'highest' | 'high' | 'medium' | 'low';
export type PDFDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type PDFType = 'guide' | 'checklist' | 'worksheet' | 'reference' | 'template';

export interface PDFResource {
  id: string;
  title: string;
  titleEn: string;
  category: PDFCategory;
  priority: PDFPriority;
  difficulty: PDFDifficulty;
  type: PDFType;
  tags: string[];
  estimatedReadTime: number; // 分钟
  fileSize: string; // 如 "2.5MB"
  description: string;
  descriptionEn: string;
  downloadUrl: string;
  previewUrl?: string;
  lastUpdated: string;
  downloadCount?: number;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  relatedResources?: string[]; // 相关资源ID
  seoKeywords: string[];
  targetAudience: string[];
}

export interface PDFCategoryInfo {
  id: PDFCategory;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  resourceCount: number;
  order: number;
}

export interface PDFFilterOptions {
  category?: PDFCategory;
  priority?: PDFPriority;
  difficulty?: PDFDifficulty;
  type?: PDFType;
  tags?: string[];
  searchQuery?: string;
}

export interface PDFSearchResult {
  resources: PDFResource[];
  totalCount: number;
  categories: Record<PDFCategory, number>;
  suggestions?: string[];
}

// 用户交互数据
export interface PDFUserInteraction {
  resourceId: string;
  action: 'view' | 'download' | 'preview' | 'share';
  timestamp: Date;
  userAgent?: string;
  source?: string;
}

// 分析数据
export interface PDFAnalytics {
  resourceId: string;
  views: number;
  downloads: number;
  averageRating: number;
  popularityScore: number;
  lastAnalyzed: Date;
}
