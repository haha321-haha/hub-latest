export const dynamic = 'force-dynamic';

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">页面未找到 / Page Not Found</h1>
      <p className="text-neutral-600">您访问的页面不存在或已被移动。The page you are looking for does not exist.</p>
      <div className="flex gap-3">
        <a href="/zh" className="px-4 py-2 rounded-lg text-white" style={{ background: '#7c3aed' }}>
          返回首页
        </a>
        <a href="/en" className="px-4 py-2 rounded-lg text-white" style={{ background: '#111827' }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}

// 移除重复默认导出，避免冲突