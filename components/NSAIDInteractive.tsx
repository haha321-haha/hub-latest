'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface NSAIDInteractiveProps {
  locale: 'en' | 'zh';
}

export default function NSAIDInteractive({ locale }: NSAIDInteractiveProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('🔧 NSAIDInteractive component mounted');
    setIsClient(true);

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

  // Only render scripts on client side to avoid preloading
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="lazyOnload"
        onLoad={() => console.log('✅ Lucide script loaded')}
        onError={(e) => console.error('❌ Lucide script failed:', e)}
      />
      <Script
        src="/scripts/nsaid-interactive.js"
        strategy="lazyOnload"
        onLoad={() => console.log('✅ NSAID interactive script loaded')}
        onError={(e) => console.error('❌ NSAID interactive script failed:', e)}
      />
    </>
  );
}
