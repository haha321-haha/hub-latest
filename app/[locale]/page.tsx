export default function HomePage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
          PeriodHub - 女性健康管理平台
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
          欢迎来到PeriodHub，您的专业月经周期管理助手
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/zh/interactive-tools" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#8B5CF6', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              transition: 'background-color 0.3s'
            }}
          >
            开始使用工具
          </a>
          <a 
            href="/zh/articles" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: 'transparent', 
              color: '#8B5CF6', 
              textDecoration: 'none', 
              border: '2px solid #8B5CF6',
              borderRadius: '8px',
              transition: 'background-color 0.3s'
            }}
          >
            阅读文章
          </a>
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
          最后更新: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}