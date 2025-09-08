'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

// 定义 Article 接口，避免导入 lib/articles
interface Article {
  slug: string;
  title: string;
  title_zh?: string;
  date: string;
  summary: string;
  summary_zh?: string;
  tags: string[];
  tags_zh?: string[];
  category: string;
  category_zh?: string;
  author: string;
  featured_image: string;
  reading_time: string;
  reading_time_zh?: string;
  content: string;
}

interface SearchBoxProps {
  articles: Article[];
  locale: string;
  placeholder?: string;
  className?: string;
}

interface SearchResult extends Article {
  matchType: 'title' | 'summary' | 'tag' | 'content';
  matchText: string;
}

export default function SearchBox({ articles, locale, placeholder, className = '' }: SearchBoxProps) {
  const t = useTranslations('searchBox');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索函数
  const searchArticles = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    articles.forEach(article => {
      const title = article.title.toLowerCase();
      const summary = article.summary.toLowerCase();
      const tags = article.tags.map(tag => tag.toLowerCase());
      const content = article.content.toLowerCase();

      // 标题匹配（最高优先级）
      if (title.includes(query)) {
        searchResults.push({
          ...article,
          matchType: 'title',
          matchText: article.title
        });
        return;
      }

      // 摘要匹配
      if (summary.includes(query)) {
        const matchIndex = summary.indexOf(query);
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(summary.length, matchIndex + query.length + 50);
        const matchText = '...' + article.summary.substring(start, end) + '...';
        
        searchResults.push({
          ...article,
          matchType: 'summary',
          matchText
        });
        return;
      }

      // 标签匹配
      const matchingTag = tags.find(tag => tag.includes(query));
      if (matchingTag) {
        searchResults.push({
          ...article,
          matchType: 'tag',
          matchText: article.tags.find(tag => tag.toLowerCase() === matchingTag) || ''
        });
        return;
      }

      // 内容匹配（最低优先级）
      if (content.includes(query)) {
        const matchIndex = content.indexOf(query);
        const start = Math.max(0, matchIndex - 100);
        const end = Math.min(content.length, matchIndex + query.length + 100);
        const matchText = '...' + article.content.substring(start, end).replace(/[#*]/g, '') + '...';
        
        searchResults.push({
          ...article,
          matchType: 'content',
          matchText
        });
      }
    });

    // 按匹配类型排序：title > summary > tag > content
    const priorityOrder = { title: 4, summary: 3, tag: 2, content: 1 };
    return searchResults
      .sort((a, b) => priorityOrder[b.matchType] - priorityOrder[a.matchType])
      .slice(0, 8); // 限制结果数量
  };

  // 处理搜索
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchArticles(query);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, articles]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/${locale}/articles/${results[selectedIndex].slug}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清除搜索
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 获取匹配类型的显示文本
  const getMatchTypeLabel = (matchType: string) => {
    const labels = {
      title: locale === 'en' ? 'Title' : '标题',
      summary: locale === 'en' ? 'Summary' : '摘要',
      tag: locale === 'en' ? 'Tag' : '标签',
      content: locale === 'en' ? 'Content' : '内容'
    };
    return labels[matchType as keyof typeof labels] || '';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder || (locale === 'en' ? 'Search articles...' : '搜索文章...')}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <Link
              key={`${result.slug}-${result.matchType}`}
              href={`/${locale}/articles/${result.slug}`}
              className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-pink-50' : ''
              }`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {result.matchText}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      result.matchType === 'title' ? 'bg-pink-100 text-pink-800' :
                      result.matchType === 'summary' ? 'bg-blue-100 text-blue-800' :
                      result.matchType === 'tag' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getMatchTypeLabel(result.matchType)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {result.reading_time}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            {locale === 'en' ? 'No articles found' : '未找到相关文章'}
          </p>
        </div>
      )}
    </div>
  );
}
