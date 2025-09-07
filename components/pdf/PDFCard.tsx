/**
 * PDF卡片组件
 * PDF Card Component
 */

'use client';

import React from 'react';
import { LocalizedPDFResource, Locale } from '@/types/pdf';
import { getAlternateLanguageLabel, trackPDFDownload, formatFileSize } from '@/utils/pdfHelpers';
import DownloadButton from '@/components/DownloadButton';
import { useTranslations } from 'next-intl';

interface PDFCardProps {
  resource: LocalizedPDFResource;
  locale: Locale;
  showDetails?: boolean;
  className?: string;
}

export default function PDFCard({ 
  resource, 
  locale, 
  showDetails = true,
  className = ''
}: PDFCardProps) {
  const t = useTranslations('pdfCardPdf');
  
  const handleDownload = () => {
    trackPDFDownload(resource.id, locale);
  };

  const alternateLanguageLabel = getAlternateLanguageLabel(locale);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 ${className}`}>
      {/* 图标和标题 */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl flex-shrink-0">
          {resource.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
            {resource.title}
          </h3>
          {showDetails && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {resource.description}
            </p>
          )}
        </div>
      </div>

      {/* 文件信息 */}
      {showDetails && resource.fileSize && (
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            PDF
          </span>
          <span>•</span>
          <span>{formatFileSize(resource.fileSize)}</span>
          {resource.featured && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-purple-600 font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                特色
              </span>
            </>
          )}
        </div>
      )}

      {/* 下载按钮区域 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 主下载按钮 */}
        <DownloadButton
          filename={resource.localizedFilename}
          className="flex-1"
        />

        {/* 替代语言按钮 */}
        <DownloadButton
          filename={resource.alternateFilename}
          className="bg-white/50 hover:bg-white/70 text-gray-700 border border-gray-200"
        />
      </div>

      {/* 更新时间 */}
      {showDetails && resource.updatedAt && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {t('updated')}
            {new Date(resource.updatedAt).toLocaleDateString(
              t('locale'),
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }
            )}
          </p>
        </div>
      )}
    </div>
  );
}
