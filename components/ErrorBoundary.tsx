'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新状态以显示错误UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误但不阻止渲染
    console.log('ErrorBoundary捕获到错误:', error);
    console.log('错误信息:', errorInfo);
    
    // 如果是异步消息通道错误，尝试恢复
    if (error.message.includes('message channel closed')) {
      console.log('检测到异步消息通道错误，尝试恢复组件渲染');
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // 自定义错误UI
      return this.props.fallback || (
        <div style={{
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          color: 'white',
          padding: '32px',
          textAlign: 'center',
          margin: '20px auto',
          maxWidth: '1024px',
          borderRadius: '16px',
          border: '2px solid #fbbf24'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            全新PDF下载中心重磅上线！
          </h2>
          <p style={{ fontSize: '20px', opacity: 0.95, marginBottom: '24px' }}>
            38个专业资源 • 移动端优化 • 智能分类 • 一键下载
          </p>
          <div
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#9333ea',
              padding: '16px 32px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            🚀 立即体验新版下载中心
          </div>
          <div style={{ 
            marginTop: '16px', 
            fontSize: '12px', 
            opacity: 0.7 
          }}>
            (错误恢复模式)
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
