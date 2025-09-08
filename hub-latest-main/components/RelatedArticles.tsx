'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Article {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  readingTime: number;
}

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  locale: string;
  maxResults?: number;
}

export default function RelatedArticles({ 
  currentArticle, 
  allArticles, 
  locale, 
  maxResults = 3 
}: RelatedArticlesProps) {
  const t = useTranslations('article');
  
  // 计算相关文章
  const getRelatedArticles = () => {
    const related = allArticles
      .filter(article => article.slug !== currentArticle.slug)
      .map(article => {
        // 计算相关性分数
        let score = 0;
        
        // 标签匹配
        const commonTags = article.tags.filter(tag => 
          currentArticle.tags.includes(tag)
        );
        score += commonTags.length * 3;
        
        // 标题关键词匹配
        const titleWords = currentArticle.title.toLowerCase().split(' ');
        const articleTitleWords = article.title.toLowerCase().split(' ');
        const commonWords = titleWords.filter(word => 
          articleTitleWords.includes(word) && word.length > 3
        );
        score += commonWords.length * 2;
        
        return { ...article, score };
      })
      .filter(article => article.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    
    return related;
  };

  const relatedArticles = getRelatedArticles();

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">🔗</span>
        {t('relatedArticles')}
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/articles/${article.slug}`}
            className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {article.coverImage && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
              {article.title}
            </h4>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{article.readingTime} {t('minutesRead')}</span>
              <span className="text-purple-600 group-hover:text-purple-700">
                {t('readMore')} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}