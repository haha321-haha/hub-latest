import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/i18n';
import type { Metadata } from 'next';

// Add noindex metadata for test pages
export const metadata: Metadata = {
  title: 'Test Banner - PeriodHub',
  description: 'Test page for banner functionality',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestBannerPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <h1 className="text-4xl font-bold text-center mb-8">横幅测试页面</h1>
        
        {/* 测试横幅 1 - 基础版本 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">测试横幅 1 - 基础版本</h2>
          <div className="bg-purple-600 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold">🎉 全新PDF下载中心重磅上线！</h3>
            <p className="mt-4">38个专业资源 • 移动端优化 • 智能分类 • 一键下载</p>
          </div>
        </div>

        {/* 测试横幅 2 - 内联样式版本 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">测试横幅 2 - 内联样式版本</h2>
          <div 
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              color: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '4px solid #fbbf24'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              全新PDF下载中心重磅上线！
            </h3>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>
              38个专业资源 • 移动端优化 • 智能分类 • 一键下载
            </p>
            <button 
              style={{
                background: 'white',
                color: '#9333ea',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '18px',
                border: 'none',
                marginTop: '24px',
                cursor: 'pointer'
              }}
            >
              🚀 立即体验新版下载中心
            </button>
          </div>
        </div>

        {/* 测试横幅 3 - 强制显示版本 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">测试横幅 3 - 强制显示版本</h2>
          <div 
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              color: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '4px solid #fbbf24',
              display: 'block !important' as any,
              visibility: 'visible !important' as any,
              position: 'relative',
              zIndex: 9999
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              全新PDF下载中心重磅上线！
            </h3>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>
              38个专业资源 • 移动端优化 • 智能分类 • 一键下载
            </p>
            <button 
              style={{
                background: 'white',
                color: '#9333ea',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '18px',
                border: 'none',
                marginTop: '24px',
                cursor: 'pointer'
              }}
            >
              🚀 立即体验新版下载中心
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <a 
            href="/zh/articles" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            返回文章页面
          </a>
        </div>

      </div>
    </div>
  );
}
