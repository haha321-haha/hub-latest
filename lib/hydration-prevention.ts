/**
 * Hydration Prevention Utilities
 * 防止React hydration错误的工具库
 */

import { useState, useEffect } from 'react';

/**
 * 检查当前环境是否为客户端
 */
export function isClient() {
  return typeof window !== 'undefined';
}

/**
 * 检查当前环境是否为服务端
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * 安全的hydration钩子
 * 确保客户端和服务端渲染一致
 */
export function useHydrationSafe() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return { isMounted, isServer: !isMounted };
}

/**
 * 延迟渲染钩子 - 只在客户端渲染
 * 用于避免hydration不匹配
 */
export function useDelayedRender(delay = 0) {
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return shouldRender;
}

/**
 * 客户端渲染包装器
 * 确保内容只在客户端渲染
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return fallback;
  }
  
  return children;
}

/**
 * 服务端渲染包装器
 * 确保内容只在服务端渲染
 */
export function ServerOnly({ children }: { children: React.ReactNode }) {
  if (isClient()) {
    return null;
  }
  
  return children;
}

/**
 * 安全的环境检查
 */
export const safeEnv = {
  isClient,
  isServer,
  window: isClient() ? window : undefined,
  document: isClient() ? document : undefined,
  navigator: isClient() ? navigator : undefined,
};