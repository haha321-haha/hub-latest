/**
 * Date validation utilities for Period Hub
 */

export function validateDate(dateString: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return false;
  
  // Check if date is not in the future
  return date <= today;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateString: string, locale: string = 'zh'): string {
  const date = new Date(dateString);
  
  if (locale === 'en') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end;
}
