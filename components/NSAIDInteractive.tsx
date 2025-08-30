'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface NSAIDInteractiveProps {
  locale: 'en' | 'zh';
}

export default function NSAIDInteractive({ locale }: NSAIDInteractiveProps) {
  useEffect(() => {
    console.log('🔧 NSAIDInteractive component mounted');

    // Load the CSS file dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/nsaid-interactive.css';
    document.head.appendChild(link);

    console.log('✅ CSS file loaded');

    return () => {
      // Cleanup: remove the CSS link when component unmounts
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="beforeInteractive"
        onLoad={() => console.log('✅ Lucide script loaded')}
        onError={(e) => console.error('❌ Lucide script failed:', e)}
      />
      <Script
        src="/scripts/nsaid-interactive.js"
        strategy="afterInteractive"
        onLoad={() => console.log('✅ NSAID interactive script loaded')}
        onError={(e) => console.error('❌ NSAID interactive script failed:', e)}
      />
    </>
  );
}
