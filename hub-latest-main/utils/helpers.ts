import { PDFResource, LocalizedPDFResource, Locale } from '@/types/pdf';

/**
 * 格式化文件大小
 */
export function formatFileSize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return `${sizeInKB} KB`;
  }
  const sizeInMB = sizeInKB / 1024;
  return `${sizeInMB.toFixed(1)} MB`;
}

/**
 * 生成PDF下载URL
 */
export function generatePDFUrl(filename: string, locale: Locale): string {
  const localizedFilename = `${filename}-${locale}.pdf`;
  return `/pdf-files/${localizedFilename}`;
}

/**
 * 生成替代语言PDF URL
 */
export function generateAlternatePDFUrl(filename: string, locale: Locale): string {
  const alternateLocale = locale === 'zh' ? 'en' : 'zh';
  return generatePDFUrl(filename, alternateLocale);
}

/**
 * 本地化PDF资源
 */
export function localizePDFResource(
  resource: PDFResource,
  locale: Locale,
  t: (key: string) => string
): LocalizedPDFResource {
  return {
    ...resource,
    title: t(resource.titleKey),
    description: t(resource.descriptionKey),
    localizedFilename: `${resource.filename}-${locale}.pdf`,
    alternateFilename: `${resource.filename}-${locale === 'zh' ? 'en' : 'zh'}.pdf`,
    downloadUrl: generatePDFUrl(resource.filename, locale),
  };
}

/**
 * 搜索PDF资源
 */
export function searchPDFs(
  resources: LocalizedPDFResource[],
  query: string
): LocalizedPDFResource[] {
  if (!query.trim()) {
    return resources;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm) ||
    resource.description.toLowerCase().includes(searchTerm) ||
    resource.id.toLowerCase().includes(searchTerm)
  );
}

/**
 * 按分类过滤PDF资源
 */
export function filterPDFsByCategory(
  resources: LocalizedPDFResource[],
  category: string
): LocalizedPDFResource[] {
  if (category === 'all') {
    return resources;
  }
  
  return resources.filter(resource => resource.category === category);
}

/**
 * 排序PDF资源
 */
export function sortPDFs(
  resources: LocalizedPDFResource[],
  sortBy: 'title' | 'category' | 'featured' | 'updated' = 'featured'
): LocalizedPDFResource[] {
  return [...resources].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      
      case 'category':
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      
      case 'featured':
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      
      case 'updated':
        const dateA = new Date(a.updatedAt || a.createdAt || '');
        const dateB = new Date(b.updatedAt || b.createdAt || '');
        return dateB.getTime() - dateA.getTime();
      
      default:
        return 0;
    }
  });
}

/**
 * 获取分类颜色
 */
export function getCategoryColor(category: string): string {
  const colors = {
    'management-tools': 'from-blue-500 to-blue-600',
    'health-management': 'from-green-500 to-green-600',
    'communication-guidance': 'from-purple-500 to-purple-600',
    'educational-resources': 'from-orange-500 to-orange-600',
  };
  
  return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
}

/**
 * 获取分类背景色
 */
export function getCategoryBgColor(category: string): string {
  const colors = {
    'management-tools': 'bg-blue-50 border-blue-200',
    'health-management': 'bg-green-50 border-green-200',
    'communication-guidance': 'bg-purple-50 border-purple-200',
    'educational-resources': 'bg-orange-50 border-orange-200',
  };
  
  return colors[category as keyof typeof colors] || 'bg-gray-50 border-gray-200';
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  
  // 使用UTC时间避免时区差异导致的hydration mismatch
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  if (locale === 'zh') {
    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    return `${year}年${months[month]}${day}日`;
  }
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[month]} ${day}, ${year}`;
}

/**
 * 生成下载事件数据
 */
export function createDownloadEvent(resourceId: string, locale: Locale) {
  return {
    resourceId,
    locale,
    timestamp: new Date().toISOString(), // 使用ISO格式保持一致
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
  };
}

/**
 * 检查PDF文件是否存在
 */
export async function checkPDFExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 下载PDF文件
 */
export function downloadPDF(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 复制链接到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch {
    return false;
  }
}
