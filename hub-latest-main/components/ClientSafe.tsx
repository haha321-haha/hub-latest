'use client';

import { useState, useEffect } from 'react';

interface ClientSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 客户端安全渲染组件
 * 防止SSR和CSR不匹配导致的水合错误
 */
export default function ClientSafe({ children, fallback }: ClientSafeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || null;
  }

  return <>{children}</>;
}