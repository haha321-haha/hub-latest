import type { Metadata } from 'next';

// Add noindex metadata for test pages
export const metadata: Metadata = {
  title: 'Test Route - PeriodHub',
  description: 'Test page for route functionality',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestRoutePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          ✅ 测试路由成功！
        </h1>
        <p className="text-green-600">
          Test Route Working!
        </p>
      </div>
    </div>
  );
}
