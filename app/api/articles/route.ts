import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // 暂时返回静态文章列表，避免 fs 模块问题
    const articles = [
      {
        slug: '5-minute-period-pain-relief',
        title: '5-Minute Quick Relief for Period Pain',
        title_zh: '5分钟快速缓解痛经技巧',
        summary: 'Immediate relief techniques for sudden menstrual pain',
        summary_zh: '突发痛经的即时缓解技巧，5分钟内见效',
        category: 'immediate',
        category_zh: '即时缓解',
        author: 'Period Hub Team',
        date: '2024-01-15',
        reading_time: '6 minutes',
        reading_time_zh: '6分钟',
      },
      {
        slug: 'heat-therapy-complete-guide',
        title: 'Complete Guide to Heat Therapy for Menstrual Pain',
        title_zh: '热敷疗法完整指南',
        summary: 'Professional physical relief methods using heat therapy',
        summary_zh: '专业物理缓解方法，科学热敷技巧',
        category: 'immediate',
        category_zh: '即时缓解',
        author: 'Period Hub Team',
        date: '2024-01-10',
        reading_time: '8 minutes',
        reading_time_zh: '8分钟',
      }
    ];

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
