'use client';

import { useState, useEffect } from 'react';

interface HydrationSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Hydration安全组件
 * 防止客户端和服务端渲染差异导致的hydration错误
 */
export default function HydrationSafe({ children, fallback }: HydrationSafeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback || null;
  }

  return <>{children}</>;
}