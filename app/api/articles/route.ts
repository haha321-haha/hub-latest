import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // 从文件系统读取实际文章列表
    const articles = await getAllArticles(locale);

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length
    });
  } catch (error) {
    console.error('Error fetching articles:', error);

    // Return empty array instead of error to prevent page crash
    return NextResponse.json({
      success: false,
      articles: [],
      count: 0,
      error: 'Failed to fetch articles'
    });
  }
}
