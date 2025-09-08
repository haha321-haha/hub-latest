import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

// 日期时间格式常量（修复缺失的DATE_TIME_FORMATS）
const DATE_TIME_FORMATS = {
  en: {
    short: 'MMM d, yyyy',
    medium: 'MMM d, yyyy h:mm a',
    long: 'MMMM d, yyyy h:mm:ss a',
    time: 'h:mm a',
    date: 'MMMM d, yyyy',
    monthYear: 'MMMM yyyy',
    relative: {
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: (days: number) => `${days} day${days !== 1 ? 's' : ''} ago`,
      weeksAgo: (weeks: number) => `${weeks} week${weeks !== 1 ? 's' : ''} ago`,
      monthsAgo: (months: number) => `${months} month${months !== 1 ? 's' : ''} ago`
    }
  },
  zh: {
    short: 'yyyy年M月d日',
    medium: 'yyyy年M月d日 HH:mm',
    long: 'yyyy年M月d日 HH:mm:ss',
    time: 'HH:mm',
    date: 'yyyy年M月d日',
    monthYear: 'yyyy年M月',
    relative: {
      today: '今天',
      yesterday: '昨天',
      daysAgo: (days: number) => `${days}天前`,
      weeksAgo: (weeks: number) => `${weeks}周前`,
      monthsAgo: (months: number) => `${months}个月前`
    }
  }
} as const;

// Locale mapping for date-fns
const DATE_FNS_LOCALES = {
  en: enUS,
  zh: zhCN
} as const;

/**
 * Format date according to locale and format type
 */
export function formatDate(
  date: Date | string,
  formatType: keyof typeof DATE_TIME_FORMATS.en,
  locale: 'en' | 'zh' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateFnsLocale = DATE_FNS_LOCALES[locale];
  const formatString = DATE_TIME_FORMATS[locale][formatType] as string;

  try {
    return format(dateObj, formatString, { locale: dateFnsLocale });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
  }
}

/**
 * Format date with relative time (e.g., "2 days ago", "今天")
 */
export function formatRelativeDate(
  date: Date | string,
  locale: 'en' | 'zh' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formats = DATE_TIME_FORMATS[locale].relative;

  if (isToday(dateObj)) {
    return formats.today;
  }

  if (isYesterday(dateObj)) {
    return formats.yesterday;
  }

  const daysDiff = differenceInDays(new Date(), dateObj);
  const weeksDiff = differenceInWeeks(new Date(), dateObj);
  const monthsDiff = differenceInMonths(new Date(), dateObj);

  if (daysDiff < 7) {
    return formats.daysAgo(daysDiff);
  } else if (weeksDiff < 4) {
    return formats.weeksAgo(weeksDiff);
  } else {
    return formats.monthsAgo(monthsDiff);
  }
}

/**
 * Format date for medical reports (professional format)
 */
export function formatMedicalDate(
  date: Date | string,
  locale: 'en' | 'zh' = 'en',
  includeTime: boolean = false
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateFnsLocale = DATE_FNS_LOCALES[locale];

  const formatString = includeTime 
    ? (locale === 'zh' ? 'yyyy年M月d日 HH:mm' : 'MMMM d, yyyy h:mm a')
    : (locale === 'zh' ? 'yyyy年M月d日' : 'MMMM d, yyyy');

  try {
    return format(dateObj, formatString, { locale: dateFnsLocale });
  } catch (error) {
    console.error('Medical date formatting error:', error);
    return dateObj.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
  }
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(
  minutes: number,
  locale: 'en' | 'zh' = 'en'
): string {
  if (minutes < 60) {
    return locale === 'zh' ? `${minutes}分钟` : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return locale === 'zh' ? `${hours}小时` : `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return locale === 'zh' 
    ? `${hours}小时${remainingMinutes}分钟`
    : `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Get localized month names
 */
export function getMonthNames(locale: 'en' | 'zh' = 'en'): string[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(formatDate(date, 'monthYear', locale).split(' ')[0]);
  }
  return months;
}

/**
 * Get localized day names
 */
export function getDayNames(locale: 'en' | 'zh' = 'en'): string[] {
  const days = [];
  const dateFnsLocale = DATE_FNS_LOCALES[locale];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, i + 1); // Start from Sunday
    days.push(format(date, 'EEEE', { locale: dateFnsLocale }));
  }
  return days;
}

/**
 * Parse date string in various formats
 */
export function parseDate(dateString: string, locale: 'en' | 'zh' = 'en'): Date | null {
  try {
    // Try ISO format first
    if (dateString.includes('-') && dateString.length >= 10) {
      return new Date(dateString);
    }

    // Try locale-specific parsing
    if (locale === 'zh') {
      // Handle Chinese date formats like "2024年1月15日"
      const zhMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (zhMatch) {
        const [, year, month, day] = zhMatch;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }

    // Fallback to native Date parsing
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
}

/**
 * Validate date input
 */
export function validateDate(
  dateString: string,
  locale: 'en' | 'zh' = 'en',
  allowFuture: boolean = false
): { isValid: boolean; error?: string } {
  const date = parseDate(dateString, locale);
  
  if (!date) {
    return {
      isValid: false,
      error: locale === 'zh' ? '请输入有效日期' : 'Please enter a valid date'
    };
  }

  if (!allowFuture && date > new Date()) {
    return {
      isValid: false,
      error: locale === 'zh' ? '日期不能是未来时间' : 'Date cannot be in the future'
    };
  }

  // Check if date is too far in the past (more than 10 years)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  
  if (date < tenYearsAgo) {
    return {
      isValid: false,
      error: locale === 'zh' ? '日期不能超过10年前' : 'Date cannot be more than 10 years ago'
    };
  }

  return { isValid: true };
}