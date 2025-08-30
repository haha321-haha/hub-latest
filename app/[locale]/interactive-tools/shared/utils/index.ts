import { PainEntry, PainStatistics, ValidationError, StorageData } from '../types';

// SSR-safe runtime flags
const isServer = typeof window === 'undefined';
const isBrowser = !isServer;

// 日期工具函数
export const formatDate = (date: string | Date, locale: string = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'zh') {
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // 使用本地时间而不是UTC时间，避免时区问题
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && Boolean(dateString.match(/^\d{4}-\d{2}-\d{2}$/));
};

export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: formatDateShort(start),
    end: formatDateShort(end)
  };
};

// 数据验证函数
export const validatePainEntry = (entry: Partial<PainEntry>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!entry.date) {
    errors.push({
      field: 'date',
      message: 'Date is required',
      code: 'REQUIRED'
    });
  } else if (!isValidDate(entry.date)) {
    errors.push({
      field: 'date',
      message: 'Invalid date format',
      code: 'INVALID_FORMAT'
    });
  }
  
  if (entry.painLevel === undefined || entry.painLevel === null) {
    errors.push({
      field: 'painLevel',
      message: 'Pain level is required',
      code: 'REQUIRED'
    });
  } else if (entry.painLevel < 1 || entry.painLevel > 10) {
    errors.push({
      field: 'painLevel',
      message: 'Pain level must be between 1 and 10',
      code: 'OUT_OF_RANGE'
    });
  }
  
  if (entry.duration !== undefined && (entry.duration < 0 || entry.duration > 1440)) {
    errors.push({
      field: 'duration',
      message: 'Duration must be between 0 and 1440 minutes',
      code: 'OUT_OF_RANGE'
    });
  }
  
  if (entry.effectiveness !== undefined && (entry.effectiveness < 1 || entry.effectiveness > 5)) {
    errors.push({
      field: 'effectiveness',
      message: 'Effectiveness must be between 1 and 5',
      code: 'OUT_OF_RANGE'
    });
  }
  
  return errors;
};

// 统计计算函数
export const calculateStatistics = (entries: PainEntry[]): PainStatistics => {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      averagePain: 0,
      maxPain: 0,
      minPain: 0,
      mostCommonSymptoms: [],
      mostEffectiveRemedies: [],
      painFrequency: {},
      trendDirection: 'stable'
    };
  }
  
  const painLevels = entries.map(e => e.painLevel);
  const averagePain = painLevels.reduce((sum, level) => sum + level, 0) / painLevels.length;
  
  // 计算最常见症状
  const symptomCounts: Record<string, number> = {};
  entries.forEach(entry => {
    entry.symptoms.forEach(symptom => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });
  });
  
  const mostCommonSymptoms = Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([symptom]) => symptom);
  
  // 计算最有效的缓解方法
  const remedyEffectiveness: Record<string, { total: number; count: number }> = {};
  entries.forEach(entry => {
    if (entry.effectiveness && entry.remedies.length > 0) {
      entry.remedies.forEach(remedy => {
        if (!remedyEffectiveness[remedy]) {
          remedyEffectiveness[remedy] = { total: 0, count: 0 };
        }
        remedyEffectiveness[remedy].total += entry.effectiveness!;
        remedyEffectiveness[remedy].count += 1;
      });
    }
  });
  
  const mostEffectiveRemedies = Object.entries(remedyEffectiveness)
    .map(([remedy, data]) => ({
      remedy,
      avgEffectiveness: data.total / data.count
    }))
    .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
    .slice(0, 5)
    .map(item => item.remedy);
  
  // 计算疼痛频率
  const painFrequency: Record<string, number> = {};
  painLevels.forEach(level => {
    const range = getPainRange(level);
    painFrequency[range] = (painFrequency[range] || 0) + 1;
  });
  
  // 计算趋势
  const trendDirection = calculateTrend(entries);
  
  return {
    totalEntries: entries.length,
    averagePain: Math.round(averagePain * 10) / 10,
    maxPain: Math.max(...painLevels),
    minPain: Math.min(...painLevels),
    mostCommonSymptoms,
    mostEffectiveRemedies,
    painFrequency,
    trendDirection
  };
};

const getPainRange = (level: number): string => {
  if (level <= 3) return 'Mild (1-3)';
  if (level <= 6) return 'Moderate (4-6)';
  return 'Severe (7-10)';
};

const calculateTrend = (entries: PainEntry[]): 'improving' | 'worsening' | 'stable' => {
  if (entries.length < 4) return 'stable';
  
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2));
  const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, e) => sum + e.painLevel, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.painLevel, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 0.5) return 'worsening';
  if (difference < -0.5) return 'improving';
  return 'stable';
};

// 本地存储工具函数
export const createStorageKey = (userId: string, dataType: string): string => {
  return `periodhub_${dataType}_${userId || 'anonymous'}`;
};

export const saveToStorage = <T>(key: string, data: T): boolean => {
  if (!isBrowser) return false;
  try {
    const storageData: StorageData<T> = {
      data,
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
    window.localStorage?.setItem(key, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  if (!isBrowser) return null;
  try {
    const item = window.localStorage?.getItem(key);
    if (!item) return null;
    const storageData: StorageData<T> = JSON.parse(item);
    return storageData.data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearStorage = (key: string): boolean => {
  if (!isBrowser) return false;
  try {
    window.localStorage?.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

// 数据导出函数
export const exportToCSV = (entries: PainEntry[]): string => {
  const headers = [
    'Date',
    'Pain Level',
    'Duration (min)',
    'Location',
    'Menstrual Status',
    'Symptoms',
    'Remedies',
    'Effectiveness',
    'Notes'
  ];
  
  const rows = entries.map(entry => [
    entry.date,
    entry.painLevel.toString(),
    entry.duration?.toString() || '',
    entry.location.join('; '),
    entry.menstrualStatus,
    entry.symptoms.join('; '),
    entry.remedies.join('; '),
    entry.effectiveness?.toString() || '',
    entry.notes || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  return csvContent;
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  if (!isBrowser) return;
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to trigger download:', error);
  }
};

// 颜色工具函数
export const getPainLevelColor = (level: number): string => {
  if (level <= 3) return '#10b981'; // green
  if (level <= 6) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    period: '#ec4899',
    pre: '#f97316',
    post: '#06b6d4',
    ovulation: '#8b5cf6',
    other: '#6b7280'
  };
  return colors[status] || '#6b7280';
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
