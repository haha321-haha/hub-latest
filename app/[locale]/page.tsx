export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          PeriodHub - 女性健康管理平台
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          专业的痛经缓解和月经健康管理解决方案
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <a 
            href="/zh/articles" 
            style={{ 
              display: 'inline-block',
              backgroundColor: '#8b5cf6', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            浏览文章
          </a>
          <a 
            href="/zh/interactive-tools"
            style={{ 
              display: 'inline-block',
              backgroundColor: '#ec4899', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            互动工具
          </a>
        </div>
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#9ca3af',
          marginTop: '2rem'
        }}>
          最后更新: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}