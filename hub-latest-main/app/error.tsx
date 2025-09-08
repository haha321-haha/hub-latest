'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>抱歉，发生了错误</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>An unexpected error occurred.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={reset} style={{ background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: '8px' }}>重试</button>
        <a href="/zh" style={{ background: '#7c3aed', color: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none' }}>返回首页</a>
      </div>
    </div>
  );
}