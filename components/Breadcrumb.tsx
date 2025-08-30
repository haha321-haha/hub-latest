'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLocale } from 'next-intl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const locale = useLocale();

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === 'zh' ? '首页' : 'Home',
        "item": `https://periodhub.health/${locale}`
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://periodhub.health${item.href}` })
      }))
    ]
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      
      {/* 面包屑导航 */}
      <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link 
              href={`/${locale}`} 
              className="flex items-center hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              {locale === 'zh' ? '首页' : 'Home'}
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              {item.href ? (
                <Link 
                  href={item.href}
                  className="hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}