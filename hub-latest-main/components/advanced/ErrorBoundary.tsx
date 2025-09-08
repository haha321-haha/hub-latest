'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useAppStore } from '@/lib/stores/appStore';

interface Props {
  children: ReactNode;
  level?: 'low' | 'medium' | 'high' | 'critical';
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// 错误边界组件
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 记录错误到应用状态
    const { recordError } = useAppStore.getState();
    recordError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'medium',
      timestamp: new Date().toISOString()
    });

    // 记录到控制台
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自定义错误UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div className="error-boundary p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800">
              应用出现错误
            </h2>
          </div>
          
          <p className="text-red-600 mb-4">
            抱歉，应用遇到了一个错误。我们已经记录了这个错误，并将尽快修复。
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              刷新页面
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false })}
              className="ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              重试
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-3 bg-red-100 rounded">
              <summary className="cursor-pointer text-red-700 font-medium">
                错误详情 (开发模式)
              </summary>
              <div className="mt-2 text-sm text-red-600">
                <p><strong>错误信息:</strong> {this.state.error?.message}</p>
                <p><strong>错误堆栈:</strong></p>
                <pre className="whitespace-pre-wrap text-xs bg-red-200 p-2 rounded">
                  {this.state.error?.stack}
                </pre>
                <p><strong>组件堆栈:</strong></p>
                <pre className="whitespace-pre-wrap text-xs bg-red-200 p-2 rounded">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
