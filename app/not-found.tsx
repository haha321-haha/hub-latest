import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">页面未找到</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
        </p>
        <div className="space-y-4">
          <Link
            href="/zh"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            返回首页
          </Link>
          <div className="text-sm text-gray-500">
            <Link href="/zh/articles" className="text-primary-600 hover:underline mr-4">
              文章中心
            </Link>
            <Link href="/zh/interactive-tools" className="text-primary-600 hover:underline mr-4">
              互动工具
            </Link>
            <Link href="/zh/immediate-relief" className="text-primary-600 hover:underline">
              即时缓解
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
