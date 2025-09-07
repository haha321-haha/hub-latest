'use client';

import { useState } from 'react';
import { Download, ExternalLink, Copy, Check, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LocalizedPDFResource, Locale } from '@/types/pdf';
import { 
  formatFileSize, 
  formatDate, 
  getCategoryColor, 
  getCategoryBgColor,
  downloadPDF,
  copyToClipboard,
  createDownloadEvent
} from '@/utils/helpers';

interface PDFCardProps {
  resource: LocalizedPDFResource;
  locale: Locale;
  showDetails?: boolean;
  onDownload?: (resource: LocalizedPDFResource) => void;
}

export default function PDFCard({ 
  resource, 
  locale, 
  showDetails = true,
  onDownload 
}: PDFCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations('pdfCard');

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // 记录下载事件
      const downloadEvent = createDownloadEvent(resource.id, locale);
      console.log('Download event:', downloadEvent);
      
      // 触发下载
      downloadPDF(resource.downloadUrl, resource.localizedFilename);
      
      // 调用回调
      onDownload?.(resource);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleCopyLink = async () => {
    const fullUrl = `${window.location.origin}${resource.downloadUrl}`;
    const success = await copyToClipboard(fullUrl);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categoryColorClass = getCategoryColor(resource.category);
  const categoryBgClass = getCategoryBgColor(resource.category);

  return (
    <div className={`
      group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 
      hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden
      ${resource.featured ? 'ring-2 ring-purple-200' : ''}
    `}>
      {/* 特色标签 */}
      {resource.featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {t('featured')}
          </div>
        </div>
      )}

      {/* 分类标签 */}
      <div className={`absolute top-3 left-3 z-10 ${categoryBgClass} px-2 py-1 rounded-lg text-xs font-medium`}>
        <span className="mr-1">{resource.icon}</span>
        <span className="text-gray-700">
          {t('category')}
        </span>
      </div>

      <div className="p-6 pt-12">
        {/* 图标和标题 */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`
            w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColorClass} 
            flex items-center justify-center text-white text-xl font-bold shadow-lg
          `}>
            {resource.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {resource.title}
            </h3>
            
            {showDetails && (
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {resource.description}
              </p>
            )}
          </div>
        </div>

        {/* 文件信息 */}
        {showDetails && (
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            {resource.fileSize && (
              <span className="flex items-center gap-1">
                📄 {formatFileSize(resource.fileSize)}
              </span>
            )}
            
            {resource.updatedAt && (
              <span className="flex items-center gap-1">
                🕒 {formatDate(resource.updatedAt, locale)}
              </span>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 主下载按钮 */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              bg-gradient-to-r ${categoryColorClass} text-white font-semibold rounded-lg
              hover:shadow-lg hover:scale-[1.02] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('downloadPdf')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('downloadPdf')}</span>
              </>
            )}
          </button>

          {/* HTML预览按钮 */}
          <button
            onClick={() => window.open(`/${locale}/resources/${resource.id}`, '_blank')}
            className="p-2.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors group/preview"
            title={t('htmlPreview')}
          >
            <Eye className="w-4 h-4 text-blue-600 group-hover/preview:text-blue-800" />
          </button>

          {/* 复制链接按钮 */}
          <button
            onClick={handleCopyLink}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group/copy"
            title={t('copyLink')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600 group-hover/copy:text-gray-800" />
            )}
          </button>

          {/* 新窗口打开按钮 */}
          <button
            onClick={() => window.open(resource.downloadUrl, '_blank')}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group/external"
            title={t('openInNewTab')}
          >
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover/external:text-gray-800" />
          </button>
        </div>
      </div>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
}
