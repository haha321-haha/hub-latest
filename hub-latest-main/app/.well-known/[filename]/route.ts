import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // 只允许访问IndexNow密钥文件
    if (!filename.match(/^[a-f0-9]{32}\.txt$/)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const filePath = join(process.cwd(), 'public', '.well-known', filename);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Not Found', { status: 404 });
  }
}