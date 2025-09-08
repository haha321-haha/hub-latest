import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Simple Route - PeriodHub',
  description: 'Simple test route page',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestSimpleRoutePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
          简单测试路由
        </h1>
        <div className="text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ 路由工作正常！
            </h2>
            <p className="text-gray-600">
              这是一个简单的测试路由页面
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
