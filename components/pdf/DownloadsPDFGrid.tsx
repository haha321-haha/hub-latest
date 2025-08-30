/**
 * 下载页面PDF网格组件
 * Downloads Page PDF Grid Component
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types/pdf';
import { getAllPDFResources, getAllCategories, getCategoryInfo } from '@/config/pdfResources';
import { localizeResource, groupResourcesByCategory } from '@/utils/pdfHelpers';
import PDFCard from './PDFCard';

interface DownloadsPDFGridProps {
  locale: Locale;
  className?: string;
}

export default function DownloadsPDFGrid({ locale, className = '' }: DownloadsPDFGridProps) {
  const tPage = useTranslations('downloadsPage');
  const tPDF = useTranslations('downloadsPage.resources');

  // 获取所有PDF资源并本地化
  const allResources = getAllPDFResources();
  const localizedResources = allResources.map(resource =>
    localizeResource(resource, locale, tPDF)
  );
  
  // 按分类分组
  const groupedResources = groupResourcesByCategory(localizedResources);
  
  // 获取分类信息
  const categories = getAllCategories();

  return (
    <div className={`space-y-12 ${className}`}>
      {categories.map(categoryId => {
        const categoryInfo = getCategoryInfo(categoryId);
        const categoryResources = groupedResources[categoryId] || [];
        
        if (categoryResources.length === 0) {
          return null;
        }

        return (
          <div key={categoryId} className="space-y-6">
            {/* 分类标题 */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {tPage(categoryInfo.titleKey)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {tPage(categoryInfo.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>

            {/* PDF卡片网格 - 2列布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryResources.map(resource => (
                <PDFCard
                  key={resource.id}
                  resource={resource}
                  locale={locale}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
