'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Grid, List } from 'lucide-react';
import { PDFCategoryInfo, Locale } from '@/types/pdf';

interface SearchAndFilterProps {
  locale: Locale;
  categories: PDFCategoryInfo[];
  searchQuery: string;
  selectedCategory: string;
  viewMode: 'grid' | 'list';
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
  t: (key: string) => string;
}

export default function SearchAndFilter({
  locale,
  categories,
  searchQuery,
  selectedCategory,
  viewMode,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  totalResults,
  t
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    onSearchChange('');
    onCategoryChange('all');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
      {/* 搜索栏 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder={t('pdfCenter.search.placeholder')}
            className="w-full pl-10 pr-10 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          {localSearchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* 筛选按钮 */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
            ${isFilterOpen || hasActiveFilters
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }
          `}
        >
          <Filter className="w-5 h-5" />
          <span>{t('pdfCenter.filter.title')}</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>

        {/* 视图模式切换 */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 rounded-lg transition-all
              ${viewMode === 'grid'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
            title={t('pdfCenter.viewMode.grid')}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 rounded-lg transition-all
              ${viewMode === 'list'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
            title={t('pdfCenter.viewMode.list')}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {isFilterOpen && (
        <div className="border-t border-gray-200 pt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              {t('pdfCenter.filter.categories')}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('pdfCenter.filter.clearAll')}
              </button>
            )}
          </div>

          {/* 分类筛选 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 全部分类 */}
            <button
              onClick={() => onCategoryChange('all')}
              className={`
                flex items-center gap-2 p-3 rounded-xl border transition-all text-left
                ${selectedCategory === 'all'
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-lg">📋</span>
              <div>
                <div className="font-medium text-sm">
                  {t('pdfCenter.filter.allCategories')}
                </div>
                <div className="text-xs text-gray-500">
                  {totalResults} {t('pdfCenter.filter.items')}
                </div>
              </div>
            </button>

            {/* 各个分类 */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border transition-all text-left
                  ${selectedCategory === category.id
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <div>
                  <div className="font-medium text-sm">
                    {t(category.titleKey)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {/* 这里可以显示每个分类的数量 */}
                    {t('pdfCenter.filter.category')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
        <div>
          {searchQuery ? (
            <span>
              {t('pdfCenter.search.resultsFor')} "<strong>{searchQuery}</strong>": {totalResults} {t('pdfCenter.search.results')}
            </span>
          ) : (
            <span>
              {t('pdfCenter.search.showing')} {totalResults} {t('pdfCenter.search.resources')}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs">{t('pdfCenter.filter.activeFilters')}:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {searchQuery}
                <button onClick={handleClearSearch}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {t(`pdfCenter.categories.${selectedCategory}.title`)}
                <button onClick={() => onCategoryChange('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
