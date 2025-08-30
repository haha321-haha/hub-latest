'use client';

import { useState, useMemo } from 'react';
import { LocalizedPDFResource, PDFCategoryInfo, Locale } from '@/types/pdf';
import { searchPDFs, filterPDFsByCategory, sortPDFs } from '@/utils/helpers';
import PDFCard from './PDFCard';
import SearchAndFilter from './SearchAndFilter';

interface PDFGridProps {
  resources: LocalizedPDFResource[];
  categories: PDFCategoryInfo[];
  locale: Locale;
  t: (key: string) => string;
  onDownload?: (resource: LocalizedPDFResource) => void;
}

export default function PDFGrid({ 
  resources, 
  categories, 
  locale, 
  t,
  onDownload 
}: PDFGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 过滤和搜索资源
  const filteredResources = useMemo(() => {
    let filtered = resources;
    
    // 按分类过滤
    filtered = filterPDFsByCategory(filtered, selectedCategory);
    
    // 搜索过滤
    filtered = searchPDFs(filtered, searchQuery);
    
    // 排序（特色优先）
    filtered = sortPDFs(filtered, 'featured');
    
    return filtered;
  }, [resources, selectedCategory, searchQuery]);

  // 按分类分组资源
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<string, LocalizedPDFResource[]> = {};
    
    if (selectedCategory === 'all') {
      // 显示所有分类
      categories.forEach(category => {
        const categoryResources = filteredResources.filter(
          resource => resource.category === category.id
        );
        if (categoryResources.length > 0) {
          grouped[category.id] = categoryResources;
        }
      });
    } else {
      // 只显示选中的分类
      grouped[selectedCategory] = filteredResources;
    }
    
    return grouped;
  }, [filteredResources, selectedCategory, categories]);

  const handleDownload = (resource: LocalizedPDFResource) => {
    console.log('PDF downloaded:', resource.id);
    onDownload?.(resource);
  };

  // 空状态
  if (filteredResources.length === 0) {
    return (
      <div className="space-y-8">
        <SearchAndFilter
          locale={locale}
          categories={categories}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          viewMode={viewMode}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onViewModeChange={setViewMode}
          totalResults={0}
          t={t}
        />
        
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t('pdfCenter.empty.title')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? t('pdfCenter.empty.searchMessage')
              : t('pdfCenter.empty.filterMessage')
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('pdfCenter.empty.resetFilters')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 搜索和筛选 */}
      <SearchAndFilter
        locale={locale}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onViewModeChange={setViewMode}
        totalResults={filteredResources.length}
        t={t}
      />

      {/* PDF网格/列表 */}
      <div className="space-y-12">
        {Object.entries(resourcesByCategory).map(([categoryId, categoryResources]) => {
          const category = categories.find(cat => cat.id === categoryId);
          if (!category) return null;

          return (
            <div key={categoryId} className="space-y-6">
              {/* 分类标题（仅在显示所有分类时显示） */}
              {selectedCategory === 'all' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {t(category.titleKey)}
                      </h2>
                      <p className="text-gray-600">
                        {t(category.descriptionKey)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  <div className="text-sm text-gray-500">
                    {categoryResources.length} {t('pdfCenter.filter.items')}
                  </div>
                </div>
              )}

              {/* PDF卡片网格 */}
              <div className={`
                ${viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr'
                  : 'space-y-4'
                }
              `}>
                {categoryResources.map((resource) => (
                  <PDFCard
                    key={resource.id}
                    resource={resource}
                    locale={locale}
                    showDetails={viewMode === 'grid'}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 加载更多（如果需要分页） */}
      {filteredResources.length > 0 && (
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>📊</span>
            <span>
              {t('pdfCenter.stats.showing')} {filteredResources.length} / {resources.length} {t('pdfCenter.stats.resources')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
