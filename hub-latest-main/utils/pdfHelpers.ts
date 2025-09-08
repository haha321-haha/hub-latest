/**
 * PDF下载中心工具函数
 * Period Hub PDF Download Center Utility Functions
 */

import { PDFResource, LocalizedPDFResource, Locale, PDFCategory, PDFStats } from '@/types/pdf';

/**
 * 获取本地化的PDF文件名
 * @param filename 基础文件名
 * @param locale 语言代码
 * @returns 本地化文件名
 */
export function getLocalizedFilename(filename: string, locale: Locale): string {
  const baseName = filename.replace('.pdf', '');
  return locale === 'zh' ? `${baseName}.pdf` : `${baseName}-en.pdf`;
}

/**
 * 获取替代语言的PDF文件名
 * @param filename 基础文件名
 * @param locale 当前语言代码
 * @returns 替代语言文件名
 */
export function getAlternateFilename(filename: string, locale: Locale): string {
  const baseName = filename.replace('.pdf', '');
  return locale === 'zh' ? `${baseName}-en.pdf` : `${baseName}.pdf`;
}

/**
 * 获取PDF下载URL
 * @param filename 文件名
 * @returns 完整下载URL
 */
export function getPDFDownloadUrl(filename: string): string {
  return `/pdf-files/${filename}`;
}

/**
 * 获取替代语言标签文本
 * @param locale 当前语言
 * @returns 替代语言标签
 */
export function getAlternateLanguageLabel(locale: Locale): string {
  return locale === 'zh' ? 'English' : '中文版';
}

/**
 * 将PDF资源转换为本地化资源
 * @param resource PDF资源
 * @param locale 语言代码
 * @param t 翻译函数
 * @returns 本地化PDF资源
 */
export function localizeResource(
  resource: PDFResource,
  locale: Locale,
  t: (key: string) => string
): LocalizedPDFResource {
  const localizedFilename = getLocalizedFilename(resource.filename, locale);
  const alternateFilename = getAlternateFilename(resource.filename, locale);
  
  return {
    ...resource,
    title: t(resource.titleKey),
    description: t(resource.descriptionKey),
    localizedFilename,
    alternateFilename,
    downloadUrl: getPDFDownloadUrl(localizedFilename)
  };
}

/**
 * 按分类分组PDF资源
 * @param resources PDF资源数组
 * @returns 按分类分组的资源
 */
export function groupResourcesByCategory(
  resources: LocalizedPDFResource[]
): Record<PDFCategory, LocalizedPDFResource[]> {
  return resources.reduce((groups, resource) => {
    const category = resource.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(resource);
    return groups;
  }, {} as Record<PDFCategory, LocalizedPDFResource[]>);
}

/**
 * 获取PDF统计信息
 * @param resources PDF资源数组
 * @returns 统计信息
 */
export function calculatePDFStats(resources: PDFResource[]): PDFStats {
  const categoryStats: Record<PDFCategory, number> = {
    'management-tools': 0,
    'health-management': 0,
    'communication-guidance': 0,
    'educational-resources': 0
  };

  let featuredCount = 0;

  resources.forEach(resource => {
    categoryStats[resource.category]++;
    if (resource.featured) {
      featuredCount++;
    }
  });

  return {
    totalPDFs: resources.length,
    totalCategories: Object.keys(categoryStats).length,
    categoryStats,
    featuredCount
  };
}

/**
 * 验证PDF资源配置
 * @param resource PDF资源
 * @returns 验证结果
 */
export function validatePDFResource(resource: PDFResource): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!resource.id) {
    errors.push('Resource ID is required');
  }

  if (!resource.filename) {
    errors.push('Filename is required');
  } else if (!resource.filename.endsWith('.pdf')) {
    errors.push('Filename must end with .pdf');
  }

  if (!resource.titleKey) {
    errors.push('Title key is required');
  }

  if (!resource.descriptionKey) {
    errors.push('Description key is required');
  }

  if (!resource.category) {
    errors.push('Category is required');
  }

  if (!resource.icon) {
    errors.push('Icon is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 记录PDF下载事件（用于分析）
 * @param resourceId 资源ID
 * @param locale 语言代码
 */
export function trackPDFDownload(resourceId: string, locale: Locale): void {
  // 这里可以集成分析工具，如Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'pdf_download', {
      resource_id: resourceId,
      locale: locale,
      timestamp: new Date().toISOString()
    });
  }

  // 也可以发送到自定义分析端点
  console.log(`PDF Download: ${resourceId} (${locale})`);
}

/**
 * 格式化文件大小
 * @param sizeInKB 文件大小（KB）
 * @returns 格式化的文件大小字符串
 */
export function formatFileSize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return `${sizeInKB} KB`;
  } else {
    const sizeInMB = (sizeInKB / 1024).toFixed(1);
    return `${sizeInMB} MB`;
  }
}

/**
 * 检查PDF文件是否存在
 * @param filename 文件名
 * @returns Promise<boolean>
 */
export async function checkPDFExists(filename: string): Promise<boolean> {
  try {
    const response = await fetch(getPDFDownloadUrl(filename), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
