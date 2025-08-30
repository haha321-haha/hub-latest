/**
 * PDF下载中心相关类型定义
 * Period Hub PDF Download Center Type Definitions
 */

export type PDFCategory =
  | 'management-tools'
  | 'health-management'
  | 'communication-guidance'
  | 'educational-resources';

export interface PDFResource {
  /** 唯一标识符 */
  id: string;
  /** 显示图标 */
  icon: string;
  /** 文件名（不含语言后缀） */
  filename: string;
  /** 标题翻译键 */
  titleKey: string;
  /** 描述翻译键 */
  descriptionKey: string;
  /** 分类 */
  category: PDFCategory;
  /** 是否为特色资源 */
  featured?: boolean;
  /** 文件大小（KB） */
  fileSize?: number;
  /** 创建日期 */
  createdAt?: string;
  /** 更新日期 */
  updatedAt?: string;
}

export interface PDFCategoryInfo {
  /** 分类ID */
  id: PDFCategory;
  /** 分类标题翻译键 */
  titleKey: string;
  /** 分类描述翻译键 */
  descriptionKey: string;
  /** 分类图标 */
  icon: string;
  /** 排序权重 */
  order: number;
}

export interface PDFStats {
  /** PDF总数 */
  totalPDFs: number;
  /** 分类数量 */
  totalCategories: number;
  /** 各分类PDF数量 */
  categoryStats: Record<PDFCategory, number>;
  /** 特色PDF数量 */
  featuredCount: number;
}

export interface LocalizedPDFResource extends PDFResource {
  /** 本地化标题 */
  title: string;
  /** 本地化描述 */
  description: string;
  /** 本地化文件名 */
  localizedFilename: string;
  /** 替代语言文件名 */
  alternateFilename: string;
  /** 下载URL */
  downloadUrl: string;
}

export interface PDFDownloadEvent {
  /** PDF资源ID */
  resourceId: string;
  /** 用户语言 */
  locale: string;
  /** 下载时间 */
  timestamp: Date;
  /** 用户代理 */
  userAgent?: string;
}

export type Locale = 'zh' | 'en';

export interface PDFComponentProps {
  /** 当前语言 */
  locale: Locale;
  /** 是否显示分类标题 */
  showCategoryTitles?: boolean;
  /** 是否显示统计信息 */
  showStats?: boolean;
  /** 自定义CSS类名 */
  className?: string;
}

export interface PDFCardProps {
  /** PDF资源 */
  resource: LocalizedPDFResource;
  /** 当前语言 */
  locale: Locale;
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 点击回调 */
  onClick?: (resource: LocalizedPDFResource) => void;
}
