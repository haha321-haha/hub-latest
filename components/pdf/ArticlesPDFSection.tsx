/**
 * 文章页面PDF下载中心组件
 * Articles Page PDF Download Center Component
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types/pdf';
import { getAllPDFResources, getResourceStats } from '@/config/pdfResources';
import { localizeResource } from '@/utils/pdfHelpers';
import PDFCard from './PDFCard';

interface ArticlesPDFSectionProps {
  locale: Locale;
  className?: string;
}

export default function ArticlesPDFSection({ locale, className = '' }: ArticlesPDFSectionProps) {
  const t = useTranslations('articlesPdfSection');
  const tDownloads = useTranslations('downloadsPage.resources');

  // 获取所有PDF资源并本地化
  const allResources = getAllPDFResources();
  const localizedResources = allResources.map(resource =>
    localizeResource(resource, locale, tDownloads)
  );
  
  // 获取统计信息
  const stats = getResourceStats();
  
  // 获取特色资源（显示在顶部）
  const featuredResources = localizedResources.filter(resource => resource.featured);
  
  // 获取其他资源
  const otherResources = localizedResources.filter(resource => !resource.featured);

  return (
    <div className={`mt-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl ${className}`}>
      {/* 标题区域 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
        </div>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
        
        {/* 统计信息 */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalPDFs}</div>
            <div className="text-sm text-gray-500">
              {t('resources')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-1">{stats.totalCategories}</div>
            <div className="text-sm text-gray-500">
              {t('categories')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.featuredCount}</div>
            <div className="text-sm text-gray-500">
              {t('featured')}
            </div>
          </div>
        </div>
      </div>

      {/* 特色资源 */}
      {featuredResources.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⭐</span>
            <h3 className="text-xl font-bold text-gray-800">
              {t('featuredResources')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map(resource => (
              <PDFCard
                key={resource.id}
                resource={resource}
                locale={locale}
                showDetails={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* 所有资源 */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📚</span>
          <h3 className="text-xl font-bold text-gray-800">
            {t('allResources')}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherResources.map(resource => (
            <PDFCard
              key={resource.id}
              resource={resource}
              locale={locale}
              showDetails={false}
              className="p-4"
            />
          ))}
        </div>
      </div>

      {/* 底部链接 */}
      <div className="text-center mt-12 pt-8 border-t border-white/30">
        <a
          href={`/${locale}/downloads`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>{t('viewAllResources')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
