'use client';

import { useTranslations, useLocale } from 'next-intl';

/**
 * 安全的翻译Hook
 * 提供fallback机制，避免显示翻译键
 */
export function useSafeTranslations(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale();

  const safeT = (key: string, params?: Record<string, any>, fallback?: string): string => {
    try {
      const result = t(key, params);
      
      // 检查是否返回了翻译键本身（表示翻译失败）
      const fullKey = namespace ? `${namespace}.${key}` : key;
      if (result === fullKey || result === key || result.includes(fullKey)) {
        // 在开发环境中警告
        if (process.env.NODE_ENV === 'development') {
          console.warn(`🌐 Translation missing: ${fullKey}`);
        }
        
        // 返回fallback或友好的默认值
        if (fallback) {
          return fallback;
        }
        
        // 生成友好的默认值
        return generateFriendlyDefault(key, locale);
      }
      
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`🌐 Translation error: ${namespace ? `${namespace}.` : ''}${key}`, error);
      }
      
      return fallback || generateFriendlyDefault(key, locale);
    }
  };

  return {
    t: safeT,
    locale,
    isZh: locale === 'zh',
    isEn: locale === 'en'
  };
}

/**
 * 生成友好的默认翻译值
 */
function generateFriendlyDefault(key: string, locale: string): string {
  // 常见翻译的默认值映射
  const defaults: Record<string, Record<string, string>> = {
    zh: {
      'title': '标题',
      'description': '描述',
      'submit': '提交',
      'cancel': '取消',
      'save': '保存',
      'delete': '删除',
      'edit': '编辑',
      'add': '添加',
      'loading': '加载中...',
      'error': '错误',
      'success': '成功',
      'warning': '警告',
      'info': '信息',
      'close': '关闭',
      'open': '打开',
      'start': '开始',
      'stop': '停止',
      'next': '下一步',
      'previous': '上一步',
      'finish': '完成',
      'retry': '重试'
    },
    en: {
      'title': 'Title',
      'description': 'Description',
      'submit': 'Submit',
      'cancel': 'Cancel',
      'save': 'Save',
      'delete': 'Delete',
      'edit': 'Edit',
      'add': 'Add',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'info': 'Information',
      'close': 'Close',
      'open': 'Open',
      'start': 'Start',
      'stop': 'Stop',
      'next': 'Next',
      'previous': 'Previous',
      'finish': 'Finish',
      'retry': 'Retry'
    }
  };

  // 尝试从默认值中找到匹配
  const localeDefaults = defaults[locale] || defaults.en;
  const lastKeyPart = key.split('.').pop()?.toLowerCase() || '';
  
  if (localeDefaults[lastKeyPart]) {
    return localeDefaults[lastKeyPart];
  }

  // 如果没有找到，返回格式化的键名
  const friendlyKey = lastKeyPart
    .replace(/([A-Z])/g, ' $1') // 驼峰转空格
    .replace(/[_-]/g, ' ') // 下划线和连字符转空格
    .replace(/\b\w/g, l => l.toUpperCase()) // 首字母大写
    .trim();

  return friendlyKey || (locale === 'zh' ? '未知' : 'Unknown');
}

/**
 * 专门用于交互工具的翻译Hook
 */
export function useInteractiveToolTranslations(toolName?: string) {
  const namespace = toolName ? `interactiveTools.${toolName}` : 'interactiveTools';
  return useSafeTranslations(namespace);
}

/**
 * 翻译数组的工具函数
 */
export function translateArray(
  t: (key: string, params?: any, fallback?: string) => string,
  keys: string[],
  fallbacks?: string[]
): string[] {
  return keys.map((key, index) => {
    const fallback = fallbacks?.[index];
    return t(key, undefined, fallback);
  });
}

/**
 * 翻译对象的工具函数
 */
export function translateObject<T extends Record<string, string>>(
  t: (key: string, params?: any, fallback?: string) => string,
  keyMap: T,
  fallbacks?: Partial<T>
): Record<keyof T, string> {
  const result: Record<keyof T, string> = {} as Record<keyof T, string>;
  
  for (const [objectKey, translationKey] of Object.entries(keyMap)) {
    const fallback = fallbacks?.[objectKey as keyof T];
    result[objectKey as keyof T] = t(translationKey, undefined, fallback);
  }
  
  return result;
}
