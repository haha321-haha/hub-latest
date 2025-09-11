import { NextRequest, NextResponse } from 'next/server';

// IndexNow API endpoint for notifying search engines about URL updates
export async function POST(request: NextRequest) {
  try {
    const { urls, key } = await request.json();
    
    // Validate the key
    if (key !== 'a3f202e9872f45238294db525b233bf5') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }
    
    // Validate URLs
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
    }
    
    // Validate that all URLs are from our domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
    const invalidUrls = urls.filter(url => !url.startsWith(baseUrl));
    
    if (invalidUrls.length > 0) {
      return NextResponse.json({ 
        error: 'All URLs must be from the authorized domain',
        invalidUrls 
      }, { status: 400 });
    }
    
    // Notify search engines
    const searchEngines = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ];
    
    const results = [];
    
    for (const searchEngine of searchEngines) {
      try {
        const response = await fetch(searchEngine, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            host: 'periodhub.health',
            key: 'a3f202e9872f45238294db525b233bf5',
            urlList: urls
          })
        });
        
        results.push({
          searchEngine,
          status: response.status,
          success: response.ok
        });
      } catch (error) {
        results.push({
          searchEngine,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }
    
    return NextResponse.json({
      message: 'IndexNow notifications sent',
      results,
      totalUrls: urls.length
    });
    
  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow API is working',
    key: 'a3f202e9872f45238294db525b233bf5',
    endpoints: [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow'
    ]
  });
}
