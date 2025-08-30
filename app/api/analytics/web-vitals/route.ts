import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    
    // 这里可以发送到你的分析服务
    console.log('Web Vitals Metric:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      timestamp: new Date().toISOString(),
      url: request.headers.get('referer') || 'unknown'
    });
    
    // 可以存储到数据库或发送到第三方服务
    // await saveMetricToDatabase(metric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vitals:', error);
    return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 });
  }
}