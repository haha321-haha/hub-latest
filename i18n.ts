import {getRequestConfig} from 'next-intl/server';

// Locale configuration for next-intl (v3)
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'zh';
// 强制使用语言前缀，避免重定向循环
export const localePrefix = 'always' as const;

export default getRequestConfig(async ({locale}) => {
  const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;
  const messages = (await import(`./messages/${safeLocale}.json`)).default;
  return {locale: safeLocale, messages};
});
