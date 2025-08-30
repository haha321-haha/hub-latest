'use client';

import React, { useEffect, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from './ToastSystem';
import { ModalManager } from './ModalSystem';
import { useAppStore } from '@/lib/stores/appStore';
import { performanceMonitor } from '@/lib/performance/monitor';

interface AppProviderProps {
  children: ReactNode;
}

// 应用级别的Provider组件
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const preferences = useAppStore(state => state.preferences);
  const recordPageLoadTime = useAppStore(state => state.recordPageLoadTime);

  // 初始化应用
  useEffect(() => {
    // 记录页面加载时间
    const loadTime = performance.now();
    recordPageLoadTime(loadTime);

    // 应用主题
    applyTheme(preferences.theme);

    // 应用字体大小
    applyFontSize(preferences.fontSize);

    // 应用可访问性设置
    applyAccessibilitySettings(preferences.accessibility);

    // 启用性能监控
    if (preferences.privacy.analytics) {
      performanceMonitor.setEnabled(true);
    }

    // 清理函数
    return () => {
      performanceMonitor.cleanup();
    };
  }, []);

  // 监听偏好设置变化
  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    applyFontSize(preferences.fontSize);
  }, [preferences.fontSize]);

  useEffect(() => {
    applyAccessibilitySettings(preferences.accessibility);
  }, [preferences.accessibility]);

  useEffect(() => {
    performanceMonitor.setEnabled(preferences.privacy.analytics);
  }, [preferences.privacy.analytics]);

  return (
    <ErrorBoundary level="critical">
      <div className="app-container">
        {children}
        <ToastContainer />
        <ModalManager />
      </div>
    </ErrorBoundary>
  );
};

// 应用主题
function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  // 更新meta标签
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
  }
}

// 应用字体大小
function applyFontSize(fontSize: 'small' | 'medium' | 'large') {
  const root = document.documentElement;
  
  root.classList.remove('text-sm', 'text-base', 'text-lg');
  
  switch (fontSize) {
    case 'small':
      root.classList.add('text-sm');
      break;
    case 'large':
      root.classList.add('text-lg');
      break;
    default:
      root.classList.add('text-base');
  }
}

// 应用可访问性设置
function applyAccessibilitySettings(settings: any) {
  const root = document.documentElement;
  
  // 高对比度
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // 减少动画
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
  
  // 大字体
  if (settings.largeText) {
    root.classList.add('large-text');
  } else {
    root.classList.remove('large-text');
  }
}
