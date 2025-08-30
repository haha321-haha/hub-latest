import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
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
  seo_title?: string;
  seo_title_zh?: string;
  seo_description?: string;
  seo_description_zh?: string;
  canonical_url?: string;
  schema_type?: string;
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export function getAllArticles(locale: string = 'en'): Article[] {
  try {
    const articlesPath = locale === 'zh'
      ? path.join(articlesDirectory, 'zh')
      : path.join(articlesDirectory, 'en');

    if (!fs.existsSync(articlesPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(articlesPath);
    const articles = fileNames
      .filter(name => name.endsWith('.md'))
      .map(name => {
        const slug = name.replace(/\.md$/, '');
        return getArticleBySlug(slug, locale);
      })
      .filter(article => article !== null) as Article[];

    // Sort articles by date (newest first)
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

export function getArticleBySlug(slug: string, locale: string = 'en'): Article | null {
  try {
    const articlesPath = locale === 'zh'
      ? path.join(articlesDirectory, 'zh')
      : path.join(articlesDirectory, 'en');

    const fullPath = path.join(articlesPath, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      title_zh: data.title_zh,
      date: data.date || data.publishDate || '',
      summary: data.summary || '',
      summary_zh: data.summary_zh,
      tags: data.tags || [],
      tags_zh: data.tags_zh,
      category: data.category || '',
      category_zh: data.category_zh,
      author: data.author || '',
      featured_image: data.featured_image || '',
      reading_time: data.reading_time || '',
      reading_time_zh: data.reading_time_zh,
      content,
      seo_title: data.seo_title,
      seo_title_zh: data.seo_title_zh,
      seo_description: data.seo_description,
      seo_description_zh: data.seo_description_zh,
      canonical_url: data.canonical_url,
      schema_type: data.schema_type,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export function getArticlesByCategory(category: string, locale: string = 'en'): Article[] {
  const articles = getAllArticles(locale);
  const categoryKey = locale === 'zh' ? 'category_zh' : 'category';
  
  return articles.filter(article => {
    const articleCategory = locale === 'zh' ? article.category_zh : article.category;
    return articleCategory === category;
  });
}

export function getArticlesByTag(tag: string, locale: string = 'en'): Article[] {
  const articles = getAllArticles(locale);
  const tagsKey = locale === 'zh' ? 'tags_zh' : 'tags';
  
  return articles.filter(article => {
    const articleTags = locale === 'zh' ? article.tags_zh : article.tags;
    return articleTags?.includes(tag);
  });
}

export function getFeaturedArticles(locale: string = 'en', limit: number = 3): Article[] {
  const articles = getAllArticles(locale);
  return articles.slice(0, limit);
}

export function getRelatedArticles(currentSlug: string, locale: string = 'en', limit: number = 3): Article[] {
  const currentArticle = getArticleBySlug(currentSlug, locale);
  if (!currentArticle) return [];

  const allArticles = getAllArticles(locale);
  const otherArticles = allArticles.filter(article => article.slug !== currentSlug);

  // Score articles based on shared tags and category
  const scoredArticles = otherArticles.map(article => {
    let score = 0;
    
    // Same category gets higher score
    const currentCategory = locale === 'zh' ? currentArticle.category_zh : currentArticle.category;
    const articleCategory = locale === 'zh' ? article.category_zh : article.category;
    if (currentCategory === articleCategory) {
      score += 3;
    }

    // Shared tags get points
    const currentTags = locale === 'zh' ? currentArticle.tags_zh : currentArticle.tags;
    const articleTags = locale === 'zh' ? article.tags_zh : article.tags;
    const sharedTags = currentTags?.filter(tag => articleTags?.includes(tag)) || [];
    score += sharedTags.length;

    return { article, score };
  });

  // Sort by score and return top articles
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

export function getAllCategories(locale: string = 'en'): string[] {
  const articles = getAllArticles(locale);
  const categoryKey = locale === 'zh' ? 'category_zh' : 'category';
  
  const categories = articles.map(article => {
    return locale === 'zh' ? article.category_zh : article.category;
  }).filter(Boolean) as string[];

  return [...new Set(categories)];
}

export function getAllTags(locale: string = 'en'): string[] {
  const articles = getAllArticles(locale);
  const tagsKey = locale === 'zh' ? 'tags_zh' : 'tags';
  
  const allTags = articles.flatMap(article => {
    return locale === 'zh' ? article.tags_zh : article.tags;
  }).filter(Boolean) as string[];

  return [...new Set(allTags)];
}
