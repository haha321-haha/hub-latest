'use client';

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">抱歉，发生了错误</h1>
      <p className="text-neutral-600">请重试或返回首页。</p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-lg text-white" style={{ background: '#111827' }}>
          重试
        </button>
        <a href="/zh" className="px-4 py-2 rounded-lg text-white" style={{ background: '#7c3aed' }}>
          返回首页
        </a>
      </div>
    </div>
  );
}