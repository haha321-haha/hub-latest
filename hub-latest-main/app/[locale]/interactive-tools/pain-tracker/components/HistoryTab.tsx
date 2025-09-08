'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PerformanceManager } from '../../../../../lib/pain-tracker/performance';
import { PainRecord, PaginationOptions, LazyLoadResult } from '../../../../../types/pain-tracker';

type Locale = 'en' | 'zh';

interface HistoryTabProps {
  locale: Locale;
}

export default function HistoryTab({ locale }: HistoryTabProps) {
  const t = useTranslations('interactiveTools.history');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [filterPainLevel, setFilterPainLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  
  // Performance optimization states
  const [records, setRecords] = useState<PainRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Performance manager instance
  const performanceManager = useMemo(() => new PerformanceManager(), []);
  
  // Load records with lazy loading and performance optimization
  const loadRecords = useCallback(async (page: number = 1, resetData: boolean = false) => {
    setLoading(true);
    
    try {
      // Build filters based on current filter state
      const filters: Record<string, any> = {};
      
      // Date range filter
      if (filterDateRange !== 'all') {
        const now = new Date();
        const startDate = new Date(now);
        
        switch (filterDateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setDate(now.getDate() - 30);
            break;
          case 'quarter':
            startDate.setDate(now.getDate() - 90);
            break;
        }
        
        filters.startDate = startDate.toISOString();
        filters.endDate = now.toISOString();
      }
      
      // Pain level filter
      if (filterPainLevel !== 'all') {
        switch (filterPainLevel) {
          case 'low':
            filters.minPainLevel = 0;
            filters.maxPainLevel = 3;
            break;
          case 'medium':
            filters.minPainLevel = 4;
            filters.maxPainLevel = 6;
            break;
          case 'high':
            filters.minPainLevel = 7;
            filters.maxPainLevel = 10;
            break;
        }
      }
      
      const paginationOptions: PaginationOptions = {
        page,
        pageSize: pagination.pageSize,
        sortBy: 'date',
        sortOrder: 'desc',
        filters,
        preload: true
      };
      
      const result: LazyLoadResult<PainRecord> = await performanceManager.loadRecordsPaginated(paginationOptions);
      
      if (resetData || page === 1) {
        setRecords(result.data);
      } else {
        // Append for infinite scroll
        setRecords(prev => [...prev, ...result.data]);
      }
      
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to load records:', error);
      // Fallback to mock data for demo
      setRecords(getMockRecords());
    } finally {
      setLoading(false);
    }
  }, [filterDateRange, filterPainLevel, pagination.pageSize, performanceManager]);
  
  // Load initial data
  useEffect(() => {
    loadRecords(1, true);
  }, [filterDateRange, filterPainLevel]);
  
  // Mock data fallback for demo
  const getMockRecords = (): PainRecord[] => [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      painLevel: 7,
      painTypes: ['cramping'],
      locations: ['lower_abdomen'],
      symptoms: ['nausea'],
      menstrualStatus: 'day_1',
      medications: [{ name: 'Ibuprofen', timing: 'during pain' }],
      effectiveness: 6,
      lifestyleFactors: [],
      notes: locale === 'zh' ? '经期第一天，疼痛较重' : 'First day of period, severe pain',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '16:00',
      painLevel: 5,
      painTypes: ['aching'],
      locations: ['lower_back'],
      symptoms: ['fatigue'],
      menstrualStatus: 'before_period',
      medications: [{ name: 'Heat pad', timing: 'during pain' }],
      effectiveness: 7,
      lifestyleFactors: [],
      notes: locale === 'zh' ? '经期前症状' : 'Pre-menstrual symptoms',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '10:15',
      painLevel: 3,
      painTypes: ['aching'],
      locations: ['upper_thighs'],
      symptoms: [],
      menstrualStatus: 'before_period',
      medications: [],
      effectiveness: 0,
      lifestyleFactors: [],
      notes: undefined,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13')
    }
  ];
  
  // Handle load more for pagination
  const handleLoadMore = useCallback(() => {
    if (pagination.hasNextPage && !loading) {
      loadRecords(pagination.currentPage + 1, false);
    }
  }, [pagination.hasNextPage, pagination.currentPage, loading, loadRecords]);

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPainLevelLabel = (level: number) => {
    if (level <= 3) return locale === 'zh' ? '轻度' : 'Mild';
    if (level <= 6) return locale === 'zh' ? '中度' : 'Moderate';
    return locale === 'zh' ? '重度' : 'Severe';
  };
  
  const getLocationNameZh = (location: string) => {
    const locationMap: Record<string, string> = {
      'lower_abdomen': '下腹部',
      'lower_back': '下背部',
      'upper_thighs': '大腿上部',
      'pelvis': '骨盆',
      'side': '侧腹',
      'whole_abdomen': '整个腹部'
    };
    return locationMap[location] || location;
  };
  
  const getLocationNameEn = (location: string) => {
    const locationMap: Record<string, string> = {
      'lower_abdomen': 'Lower Abdomen',
      'lower_back': 'Lower Back',
      'upper_thighs': 'Upper Thighs',
      'pelvis': 'Pelvis',
      'side': 'Side',
      'whole_abdomen': 'Whole Abdomen'
    };
    return locationMap[location] || location;
  };
  
  const getPainTypeNameZh = (type: string) => {
    const typeMap: Record<string, string> = {
      'cramping': '痉挛性疼痛',
      'aching': '钝痛',
      'sharp': '尖锐疼痛',
      'throbbing': '跳动性疼痛',
      'burning': '灼烧感',
      'pressure': '压迫感'
    };
    return typeMap[type] || type;
  };
  
  const getPainTypeNameEn = (type: string) => {
    const typeMap: Record<string, string> = {
      'cramping': 'Cramping',
      'aching': 'Aching',
      'sharp': 'Sharp',
      'throbbing': 'Throbbing',
      'burning': 'Burning',
      'pressure': 'Pressure'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '疼痛记录历史' : 'Pain Record History'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          {locale === 'zh' ? '查看和管理您的疼痛记录' : 'View and manage your pain records'}
        </p>
      </header>

      {/* Filters */}
      <section 
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6"
        aria-labelledby="filters-heading"
      >
        <h2 
          id="filters-heading"
          className="text-base sm:text-lg font-medium text-gray-900 mb-4"
        >
          {locale === 'zh' ? '筛选条件' : 'Filters'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Date Range Filter */}
          <div>
            <label 
              htmlFor="date-range-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {locale === 'zh' ? '时间范围' : 'Date Range'}
            </label>
            <select
              id="date-range-filter"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value as any)}
              className="w-full px-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              aria-describedby="date-range-help"
            >
              <option value="all">{locale === 'zh' ? '全部' : 'All'}</option>
              <option value="week">{locale === 'zh' ? '最近7天' : 'Last 7 days'}</option>
              <option value="month">{locale === 'zh' ? '最近30天' : 'Last 30 days'}</option>
              <option value="quarter">{locale === 'zh' ? '最近90天' : 'Last 90 days'}</option>
            </select>
            <p id="date-range-help" className="text-xs text-gray-500 mt-1">
              {locale === 'zh' ? '选择要查看的时间范围' : 'Select the time range to view'}
            </p>
          </div>

          {/* Pain Level Filter */}
          <div>
            <label 
              htmlFor="pain-level-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {locale === 'zh' ? '疼痛程度' : 'Pain Level'}
            </label>
            <select
              id="pain-level-filter"
              value={filterPainLevel}
              onChange={(e) => setFilterPainLevel(e.target.value as any)}
              className="w-full px-3 py-2 sm:py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              aria-describedby="pain-level-help"
            >
              <option value="all">{locale === 'zh' ? '全部' : 'All'}</option>
              <option value="low">{locale === 'zh' ? '轻度 (1-3)' : 'Mild (1-3)'}</option>
              <option value="medium">{locale === 'zh' ? '中度 (4-6)' : 'Moderate (4-6)'}</option>
              <option value="high">{locale === 'zh' ? '重度 (7-10)' : 'Severe (7-10)'}</option>
            </select>
            <p id="pain-level-help" className="text-xs text-gray-500 mt-1">
              {locale === 'zh' ? '按疼痛程度筛选记录' : 'Filter records by pain intensity'}
            </p>
          </div>
        </div>
      </section>

      {/* Records List */}
      <section 
        className="bg-white rounded-lg shadow-sm"
        aria-labelledby="records-heading"
        aria-live="polite"
        aria-atomic="false"
      >
        <h2 id="records-heading" className="sr-only">
          {locale === 'zh' ? '疼痛记录列表' : 'Pain Records List'}
        </h2>
        
        {records.length === 0 && !loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              {locale === 'zh' ? '暂无记录' : 'No Records Found'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              {locale === 'zh' 
                ? '没有找到符合筛选条件的疼痛记录。请尝试调整筛选条件或添加新的记录。'
                : 'No pain records found matching your filters. Try adjusting your filters or add new records.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="sr-only" aria-live="polite">
              {locale === 'zh' 
                ? `找到 ${pagination.totalItems} 条记录`
                : `Found ${pagination.totalItems} records`
              }
            </div>
            {records.map((record, index) => (
              <article 
                key={record.id} 
                className="p-4 sm:p-6 hover:bg-gray-50 focus-within:bg-gray-50 transition-colors"
                aria-labelledby={`record-${record.id}-title`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <h3 
                        id={`record-${record.id}-title`}
                        className="text-sm sm:text-base font-medium text-gray-900"
                      >
                        {new Date(record.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPainLevelColor(record.painLevel)}`}>
                        <span className="sr-only">
                          {locale === 'zh' ? '疼痛程度：' : 'Pain level: '}
                        </span>
                        {getPainLevelLabel(record.painLevel)} ({record.painLevel}/10)
                      </div>
                    </div>
                    
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-600">
                      <div>
                        <dt className="font-medium inline">
                          {locale === 'zh' ? '位置：' : 'Location: '}
                        </dt>
                        <dd className="inline">
                          {record.locations.map(loc => 
                            locale === 'zh' ? getLocationNameZh(loc) : getLocationNameEn(loc)
                          ).join(', ')}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium inline">
                          {locale === 'zh' ? '类型：' : 'Type: '}
                        </dt>
                        <dd className="inline">
                          {record.painTypes.map(type => 
                            locale === 'zh' ? getPainTypeNameZh(type) : getPainTypeNameEn(type)
                          ).join(', ')}
                        </dd>
                      </div>
                    </dl>
                    
                    {record.notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <dt className="font-medium inline">
                          {locale === 'zh' ? '备注：' : 'Notes: '}
                        </dt>
                        <dd className="inline">{record.notes}</dd>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      aria-label={`${locale === 'zh' ? '编辑记录' : 'Edit record'} ${new Date(record.date).toLocaleDateString()}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-600 focus:text-red-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`${locale === 'zh' ? '删除记录' : 'Delete record'} ${new Date(record.date).toLocaleDateString()}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="p-6 text-center">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  <span className="text-sm text-gray-600">
                    {locale === 'zh' ? '加载中...' : 'Loading...'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Load more button */}
            {pagination.hasNextPage && !loading && (
              <div className="p-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                >
                  {locale === 'zh' ? '加载更多' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Summary Stats */}
      {records.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'zh' ? '统计摘要' : 'Summary Statistics'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {pagination.totalItems}
              </div>
              <div className="text-sm text-gray-600">
                {locale === 'zh' ? '总记录数' : 'Total Records'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {records.length > 0 ? (records.reduce((sum, record) => sum + record.painLevel, 0) / records.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-gray-600">
                {locale === 'zh' ? '平均疼痛程度' : 'Average Pain Level'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {records.length > 0 ? Math.max(...records.map(r => r.painLevel)) : '0'}
              </div>
              <div className="text-sm text-gray-600">
                {locale === 'zh' ? '最高疼痛程度' : 'Highest Pain Level'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}