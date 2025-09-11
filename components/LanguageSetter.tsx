'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function LanguageSetter() {
  const locale = useLocale();

  useEffect(() => {
    // 动态设置HTML的lang属性
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const newLang = locale === 'zh' ? 'zh-CN' : 'en-US';
      
      if (htmlElement.getAttribute('lang') !== newLang) {
        htmlElement.setAttribute('lang', newLang);
      }
    }
  }, [locale]);

  return null; // 这个组件不渲染任何内容
}
