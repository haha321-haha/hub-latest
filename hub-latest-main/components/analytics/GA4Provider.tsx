'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import GA4Tracker, { GA4_CONFIG } from '@/lib/analytics/ga4-config';

interface GA4ProviderProps {
  children: React.ReactNode;
}

function GA4ProviderInner({ children }: GA4ProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 初始化GA4
    const tracker = GA4Tracker.getInstance();
    tracker.init();
  }, []);

  useEffect(() => {
    // 页面变化时追踪
    if (GA4_CONFIG.ENABLED && typeof window !== 'undefined') {
      const tracker = GA4Tracker.getInstance();
      tracker.trackPageView(document.title, window.location.href);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

export default function GA4Provider({ children }: GA4ProviderProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <GA4ProviderInner>{children}</GA4ProviderInner>
    </Suspense>
  );
}