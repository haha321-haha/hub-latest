/**
 * PDF ID映射配置
 * 解决SimplePDFCenter组件中的PDF ID与pdfResources配置不匹配问题
 * 支持30个PDF资源的完整映射
 */

// SimplePDFCenter -> pdfResources 映射表
export const PDF_ID_MAPPING: Record<string, string> = {
  // 即时缓解类PDF映射 (7个)
  'immediate-pdf-1': 'pain-tracking-form',
  'immediate-pdf-2': 'campus-emergency-checklist', 
  'immediate-pdf-3': 'specific-menstrual-pain-management-guide',
  'immediate-pdf-4': 'emergency-pain-relief-card',
  'immediate-pdf-5': '5-minute-relief-checklist',
  'immediate-pdf-6': 'heat-therapy-guide-pdf',
  'immediate-pdf-7': 'workplace-relief-toolkit',
  
  // 计划准备类PDF映射 (7个)
  'preparation-pdf-1': 'healthy-habits-checklist',
  'preparation-pdf-2': 'menstrual-cycle-nutrition-plan',
  'preparation-pdf-3': 'magnesium-gut-health-menstrual-pain-guide',
  'preparation-pdf-4': 'zhan-zhuang-baduanjin-illustrated-guide',
  'preparation-pdf-5': 'monthly-preparation-planner',
  'preparation-pdf-6': 'stress-management-workbook',
  'preparation-pdf-7': 'sleep-quality-improvement-guide',
  
  // 学习理解类PDF映射 (10个)
  'learning-pdf-1': 'natural-therapy-assessment',
  'learning-pdf-2': 'menstrual-pain-complications-management',
  'learning-pdf-3': 'teacher-health-manual',
  'learning-pdf-4': 'teacher-collaboration-handbook',
  'learning-pdf-5': 'parent-communication-guide',
  'learning-pdf-6': 'us-insurance-quick-reference-card',
  'learning-pdf-7': 'menstrual-cycle-education-guide',
  'learning-pdf-8': 'pain-research-summary-2024',
  'learning-pdf-9': 'medical-consultation-preparation',
  'learning-pdf-10': 'global-health-perspectives',
  
  // 长期管理类PDF映射 (6个)
  'management-pdf-1': 'long-term-health-planner',
  'management-pdf-2': 'personal-health-journal',
  'management-pdf-3': 'nutrition-meal-planning-kit',
  'management-pdf-4': 'exercise-routine-builder',
  'management-pdf-5': 'lifestyle-assessment-toolkit',
  'management-pdf-6': 'sustainable-health-strategies',
};

/**
 * 将SimplePDFCenter的PDF ID转换为真实的资源ID
 */
export function mapPDFId(simplePDFId: string): string {
  return PDF_ID_MAPPING[simplePDFId] || simplePDFId;
}

/**
 * 检查PDF ID是否存在映射
 */
export function hasPDFMapping(simplePDFId: string): boolean {
  return simplePDFId in PDF_ID_MAPPING;
}

/**
 * 获取所有映射的PDF ID
 */
export function getAllMappedIds(): string[] {
  return Object.keys(PDF_ID_MAPPING);
}

/**
 * 反向映射：从真实ID找到SimplePDF ID
 */
export function getSimplePDFId(realId: string): string | undefined {
  for (const [simpleId, realId_] of Object.entries(PDF_ID_MAPPING)) {
    if (realId_ === realId) {
      return simpleId;
    }
  }
  return undefined;
} 