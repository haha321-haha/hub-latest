'use client';

import { useTranslations, useLocale } from 'next-intl';

/**
 * 统一的翻译Hook，提供翻译函数和语言相关工具
 */
export const useAppTranslations = (namespace?: string) => {
  const t = useTranslations(namespace);
  const locale = useLocale();
  
  return {
    t,
    locale,
    isZh: locale === 'zh',
    isEn: locale === 'en'
  };
};

/**
 * 专门用于交互工具的翻译Hook
 */
export const useInteractiveToolTranslations = (toolName?: string) => {
  const namespace = toolName ? `interactiveTools` : 'interactiveTools';
  const t = useTranslations(namespace);
  const locale = useLocale();

  return {
    t: toolName ? (key: string) => t(`${toolName}.${key}`) : t,
    locale,
    isZh: locale === 'zh',
    isEn: locale === 'en'
  };
};

/**
 * 获取多语言选项的工具函数
 */
export const useTranslatedOptions = (namespace: string, optionsKey: string) => {
  const { t } = useAppTranslations(namespace);
  
  return (options: string[]) => {
    return options.map(option => ({
      value: option,
      label: t(`${optionsKey}.${option}`)
    }));
  };
};
