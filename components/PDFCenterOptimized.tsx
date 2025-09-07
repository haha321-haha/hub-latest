'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Star, Clock, Tag, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
// import { PDFResource, PDFCategory } from '../types/pdf';
// import { PDF_CATEGORIES, PDF_RESOURCES } from '../config/pdfResources';

// 临时类型定义，避免构建错误
type PDFCategory = 'management-tools' | 'health-management' | 'communication-guidance' | 'educational-resources';
interface PDFResource {
  id: string;
  title: string;
  description: string;
  category: PDFCategory;
  tags: string[];
  priority: string;
  downloadUrl: string;
}

// 临时空数据，避免构建错误
const PDF_CATEGORIES: any[] = [];
const PDF_RESOURCES: PDFResource[] = [];

interface PDFCenterOptimizedProps {
  locale: 'zh' | 'en';
  initialCategory?: PDFCategory;
  showSearch?: boolean;
  showFilters?: boolean;
  maxResults?: number;
}

interface PDFFilterOptions {
  priority?: string;
  difficulty?: string;
  type?: string;
}

export default function PDFCenterOptimized({
  locale = 'zh',
  initialCategory,
  showSearch = true,
  showFilters = true,
  maxResults = 20
}: PDFCenterOptimizedProps) {
  const t = useTranslations('pdfCenterOptimized');
  const [selectedCategory, setSelectedCategory] = useState<PDFCategory | 'all'>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PDFFilterOptions>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // 筛选和搜索逻辑
  const filteredResources = useMemo(() => {
    let resources = PDF_RESOURCES;

    // 分类筛选
    if (selectedCategory !== 'all') {
      resources = resources.filter(r => r.category === selectedCategory);
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resources = resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 优先级排序
    resources.sort((a, b) => {
      const priorityOrder: Record<string, number> = { 'highest': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
    });

    return resources.slice(0, maxResults);
  }, [selectedCategory, searchQuery, filters, maxResults]);

  // 获取分类信息
  const getCategoryInfo = (categoryId: PDFCategory) => {
    return PDF_CATEGORIES.find(cat => cat.id === categoryId);
  };

  // 优先级标签颜色
  const getPriorityColor = (priority: string) => {
    const colors = {
      'highest': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  // 处理下载
  const handleDownload = (resource: PDFResource) => {
    // 这里可以添加下载统计逻辑
    console.log(`Downloading: ${resource.title}`);
    // 实际下载逻辑
    window.open(resource.downloadUrl, '_blank');
  };

  return (
    <div className="pdf-center-optimized max-w-7xl mx-auto p-4 space-y-6">
      {/* 头部搜索区域 */}
      {showSearch && (
        <div className="search-section bg-white rounded-xl shadow-sm border p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {t('filter')}
            </button>
          )}
        </div>
      )}

      {/* 分类导航 */}
      <div className="category-navigation">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('all')} ({PDF_RESOURCES.length})
          </button>
          
          {PDF_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? `${category.bgColor} ${category.color} border ${category.borderColor} shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{locale === 'zh' ? category.name : category.nameEn}</span>
              <span className="text-sm opacity-75">
                ({PDF_RESOURCES.filter(r => r.category === category.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 资源列表 */}
      <div className="resources-grid">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('noMatchingResources')}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => {
              const categoryInfo = getCategoryInfo(resource.category);
              
              return (
                <div
                  key={resource.id}
                  className="resource-card bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 p-6"
                >
                  {/* 卡片头部 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{categoryInfo?.icon}</span>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(resource.priority)}`}>
                          {resource.priority.toUpperCase()}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* 标题和描述 */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* 元信息 */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>5分钟</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 下载按钮 */}
                  <button
                    onClick={() => handleDownload(resource)}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {t('downloadNow')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 加载更多按钮 */}
      {filteredResources.length === maxResults && (
        <div className="text-center">
          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
