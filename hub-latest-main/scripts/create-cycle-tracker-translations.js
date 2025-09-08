#!/usr/bin/env node

/**
 * 创建CycleTrackerTool翻译键
 */

const fs = require('fs');
const path = require('path');

// 翻译键定义
const cycleTrackerKeys = {
  zh: {
    title: '月经周期追踪器',
    subtitle: '记录您的月经周期，预测下次月经和排卵期。',
    lastPeriodLabel: '上次月经开始日期',
    cycleLengthLabel: '平均周期长度（天）',
    calculateButton: '计算预测',
    resetButton: '重新计算',
    predictionTitle: '预测结果',
    nextPeriodLabel: '下次月经预计日期',
    ovulationLabel: '排卵期预计日期',
    fertilityWindowLabel: '易孕期',
    disclaimer: '此工具仅供参考，不能替代专业医疗建议。每个人的周期可能有所不同。',
    dateValidationError: '上次月经开始日期不能是未来日期',
    cycleLengthRange: '周期长度通常在21-35天之间',
    to: '至',
    loading: '正在加载保存的数据...',
    saveSuccess: '数据已保存',
    historyTitle: '历史记录',
    showHistory: '查看历史记录',
    hideHistory: '隐藏历史记录',
    noHistory: '暂无历史记录',
    deleteRecord: '删除',
    clearAllHistory: '清空所有记录',
    exportData: '导出数据',
    confirmClearAll: '确定要清空所有历史记录吗？',
    recordedOn: '记录于',
    cycleLength: '周期长度',
    days: '天'
  },
  en: {
    title: 'Menstrual Cycle Tracker',
    subtitle: 'Track your menstrual cycle and predict your next period and ovulation.',
    lastPeriodLabel: 'Last Period Start Date',
    cycleLengthLabel: 'Average Cycle Length (days)',
    calculateButton: 'Calculate Prediction',
    resetButton: 'Reset',
    predictionTitle: 'Prediction Results',
    nextPeriodLabel: 'Next Period Expected',
    ovulationLabel: 'Ovulation Expected',
    fertilityWindowLabel: 'Fertility Window',
    disclaimer: 'This tool is for reference only and cannot replace professional medical advice. Each person\'s cycle may vary.',
    dateValidationError: 'Last period start date cannot be in the future',
    cycleLengthRange: 'Cycle length is typically between 21-35 days',
    to: 'to',
    loading: 'Loading saved data...',
    saveSuccess: 'Data saved',
    historyTitle: 'History Records',
    showHistory: 'Show History',
    hideHistory: 'Hide History',
    noHistory: 'No history records',
    deleteRecord: 'Delete',
    clearAllHistory: 'Clear All Records',
    exportData: 'Export Data',
    confirmClearAll: 'Are you sure you want to clear all history records?',
    recordedOn: 'Recorded on',
    cycleLength: 'Cycle Length',
    days: 'days'
  }
};

// 加载现有翻译文件
function loadTranslations() {
  const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  
  let zhTranslations = {};
  let enTranslations = {};
  
  try {
    zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
  } catch (error) {
    console.log('创建新的中文翻译文件');
  }
  
  try {
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  } catch (error) {
    console.log('创建新的英文翻译文件');
  }
  
  return { zhTranslations, enTranslations };
}

// 更新翻译文件
function updateTranslations() {
  const { zhTranslations, enTranslations } = loadTranslations();
  
  // 添加CycleTracker翻译键
  if (!zhTranslations.cycleTracker) {
    zhTranslations.cycleTracker = {};
  }
  if (!enTranslations.cycleTracker) {
    enTranslations.cycleTracker = {};
  }
  
  Object.assign(zhTranslations.cycleTracker, cycleTrackerKeys.zh);
  Object.assign(enTranslations.cycleTracker, cycleTrackerKeys.en);
  
  // 保存翻译文件
  const zhPath = path.join(__dirname, '..', 'messages', 'zh.json');
  const enPath = path.join(__dirname, '..', 'messages', 'en.json');
  
  fs.writeFileSync(zhPath, JSON.stringify(zhTranslations, null, 2), 'utf8');
  fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2), 'utf8');
  
  console.log('✅ CycleTracker翻译键创建成功！');
  console.log(`📁 中文翻译: ${zhPath}`);
  console.log(`📁 英文翻译: ${enPath}`);
  console.log(`📊 创建统计:`);
  console.log(`  - 中文键数: ${Object.keys(cycleTrackerKeys.zh).length}`);
  console.log(`  - 英文键数: ${Object.keys(cycleTrackerKeys.en).length}`);
}

// 运行脚本
if (require.main === module) {
  console.log('🚀 开始创建CycleTracker翻译键...');
  updateTranslations();
  console.log('✅ CycleTracker翻译键创建完成！');
}

module.exports = { cycleTrackerKeys, updateTranslations };
