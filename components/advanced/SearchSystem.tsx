'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, Filter, SortAsc, SortDesc, Clock, Bookmark } from 'lucide-react';

// 搜索结果类型
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'tool' | 'therapy' | 'guide';
  category?: string;
  tags?: string[];
  url: string;
  score?: number;
  lastModified?: string;
}

// 搜索过滤器
export interface SearchFilters {
  type?: string[];
  category?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// 排序选项
export type SortOption = 'relevance' | 'date' | 'title' | 'type';
export type SortDirection = 'asc' | 'desc';

// 搜索配置
export interface SearchConfig {
  placeholder?: string;
  showFilters?: boolean;
  showSort?: boolean;
  showHistory?: boolean;
  maxResults?: number;
  debounceMs?: number;
}

// 搜索Hook
export const useSearch = (
  searchFunction: (query: string, filters: SearchFilters) => Promise<SearchResult[]>,
  config: SearchConfig = {}
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { debounceMs = 300 } = config;

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(searchQuery, searchFilters);
        setResults(searchResults);
        
        // 添加到搜索历史
        if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
          setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]); // 保留最近10条
        }
      } catch (err) {
        setError('搜索失败，请重试');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs),
    [searchFunction, debounceMs, searchHistory]
  );

  // 执行搜索
  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  // 排序结果
  const sortedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'relevance':
          comparison = (b.score || 0) - (a.score || 0);
          break;
        case 'date':
          comparison = new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return config.maxResults ? sorted.slice(0, config.maxResults) : sorted;
  }, [results, sortBy, sortDirection, config.maxResults]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    query,
    setQuery,
    results: sortedResults,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    isLoading,
    error,
    searchHistory,
    clearSearch,
    clearHistory,
  };
};

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 搜索框组件
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onClear,
  placeholder = '搜索...',
  isLoading = false,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

// 搜索结果组件
interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick,
  className = '',
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📄';
      case 'tool':
        return '🔧';
      case 'therapy':
        return '🌿';
      case 'guide':
        return '📖';
      default:
        return '📝';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return '文章';
      case 'tool':
        return '工具';
      case 'therapy':
        return '疗法';
      case 'guide':
        return '指南';
      default:
        return '内容';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-full mb-1"></div>
            <div className="bg-gray-200 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-2">❌</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-2">🔍</div>
        <p className="text-gray-500">没有找到相关结果</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {results.map((result) => (
        <div
          key={result.id}
          onClick={() => onResultClick?.(result)}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{getTypeIcon(result.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {result.title}
                </h3>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {getTypeLabel(result.type)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {result.content}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {result.category && (
                  <span>分类: {result.category}</span>
                )}
                {result.lastModified && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(result.lastModified).toLocaleDateString()}</span>
                  </span>
                )}
                {result.score && (
                  <span>相关度: {Math.round(result.score * 100)}%</span>
                )}
              </div>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {result.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{result.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 搜索历史组件
interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelect,
  onClear,
  className = '',
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>搜索历史</span>
        </h4>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          清除
        </button>
      </div>
      
      <div className="space-y-1">
        {history.map((query, index) => (
          <button
            key={index}
            onClick={() => onSelect(query)}
            className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};
