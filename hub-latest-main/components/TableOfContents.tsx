'use client';

import { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TableOfContentsProps {
  locale: 'zh' | 'en';
  className?: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ locale, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 获取所有标题元素
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingList: Heading[] = [];

    headingElements.forEach((heading, index) => {
      // 为没有 id 的标题添加 id
      if (!heading.id) {
        const text = heading.textContent || '';
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')}`;
        heading.id = id;
      }

      headingList.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      });
    });

    setHeadings(headingList);
  }, []);

  useEffect(() => {
    // 监听滚动，高亮当前章节
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 考虑固定头部的高度
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false); // 移动端点击后关闭目录
  };

  const t = {
    zh: {
      tableOfContents: '文章目录',
      toggleToc: '切换目录显示'
    },
    en: {
      tableOfContents: 'Table of Contents',
      toggleToc: 'Toggle table of contents'
    }
  };

  const text = t[locale];

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* 移动端可折叠标题 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 lg:hidden"
        aria-expanded={isOpen}
        aria-label={text.toggleToc}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5" />
          {text.tableOfContents}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {/* 桌面端固定标题 */}
      <div className="hidden lg:block p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <List className="w-5 h-5" />
          {text.tableOfContents}
        </div>
      </div>

      {/* 目录内容 */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <nav className="p-4 space-y-1 max-h-96 overflow-y-auto">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left py-2 px-3 rounded text-sm transition-colors ${
                activeId === heading.id
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
              style={{
                paddingLeft: `${(heading.level - 1) * 12 + 12}px`
              }}
            >
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
