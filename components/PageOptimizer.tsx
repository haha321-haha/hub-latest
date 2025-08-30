'use client';

import { useEffect } from 'react';

interface PageOptimizerProps {
  title?: string;
  preloadImages?: string[];
}

export default function PageOptimizer({ title, preloadImages = [] }: PageOptimizerProps) {
  useEffect(() => {
    // 预加载关键图片
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // 优化字体加载
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = 'https://fonts.gstatic.com/s/notosanssc/v38/k3kXo84MPvpLmixcA63oeALhLIiP-Q-87KaAaH7rzeAODp22mF0qmF4CSjmPC6A0Rg5g1igg1w.woff2';
    document.head.appendChild(fontLink);

    // 设置页面标题
    if (title) {
      document.title = title;
    }

    // 清理函数
    return () => {
      // 清理预加载的资源（如果需要）
    };
  }, [title, preloadImages]);

  return null;
}