'use client';

import React from 'react';
import { useHealthDataStore } from '../stores/healthDataStore';
import { useInteractiveToolTranslations } from '../hooks/useAppTranslations';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Activity,
  Download,
  Upload,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface HealthDataDashboardProps {
  locale: string;
}

export default function HealthDataDashboard({ locale }: HealthDataDashboardProps) {
  const { t } = useInteractiveToolTranslations();
  
  const {
    painEntries,
    constitutionResults,
    preferences,
    lastSyncTime,
    getAveragePainLevel,
    getMostCommonSymptoms,
    getPainTrends,
    exportData,
    importData,
    clearAllData
  } = useHealthDataStore();

  const averagePainLevel = getAveragePainLevel();
  const mostCommonSymptoms = getMostCommonSymptoms();
  const painTrends = getPainTrends();

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `periodhub-health-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        const success = importData(data);
        if (success) {
          alert(locale === 'zh' ? '数据导入成功！' : 'Data imported successfully!');
        } else {
          alert(locale === 'zh' ? '数据导入失败，请检查文件格式。' : 'Data import failed. Please check file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    const confirmMessage = locale === 'zh' 
      ? '确定要清除所有数据吗？此操作不可撤销。' 
      : 'Are you sure you want to clear all data? This action cannot be undone.';
    
    if (confirm(confirmMessage)) {
      clearAllData();
      alert(locale === 'zh' ? '数据已清除。' : 'Data cleared.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                {locale === 'zh' ? '疼痛记录' : 'Pain Entries'}
              </p>
              <p className="text-2xl font-bold text-blue-700">{painEntries.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                {locale === 'zh' ? '平均疼痛等级' : 'Average Pain Level'}
              </p>
              <p className="text-2xl font-bold text-green-700">{averagePainLevel}/10</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                {locale === 'zh' ? '体质测试' : 'Constitution Tests'}
              </p>
              <p className="text-2xl font-bold text-purple-700">{constitutionResults.length}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                {locale === 'zh' ? '最后同步' : 'Last Sync'}
              </p>
              <p className="text-sm font-medium text-orange-700">
                {lastSyncTime ? new Date(lastSyncTime).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 常见症状 */}
      {mostCommonSymptoms.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            {locale === 'zh' ? '最常见症状' : 'Most Common Symptoms'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {mostCommonSymptoms.map((symptom, index) => (
              <span 
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 疼痛趋势 */}
      {Object.keys(painTrends).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            {locale === 'zh' ? '疼痛趋势' : 'Pain Trends'}
          </h3>
          <div className="space-y-2">
            {Object.entries(painTrends).slice(-7).map(([date, levels]) => {
              const avgLevel = (levels as number[]).reduce((a, b) => a + b, 0) / (levels as number[]).length;
              return (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{date}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(avgLevel / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {avgLevel.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 数据管理 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {locale === 'zh' ? '数据管理' : 'Data Management'}
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '导出数据' : 'Export Data'}
          </button>

          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '导入数据' : 'Import Data'}
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={handleClearData}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '清除数据' : 'Clear Data'}
          </button>
        </div>
      </div>

      {/* 用户偏好 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {locale === 'zh' ? '用户偏好' : 'User Preferences'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">
              {locale === 'zh' ? '语言：' : 'Language: '}
            </span>
            <span className="text-gray-600">{preferences.language}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              {locale === 'zh' ? '主题：' : 'Theme: '}
            </span>
            <span className="text-gray-600">{preferences.theme}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              {locale === 'zh' ? '疼痛提醒：' : 'Pain Reminders: '}
            </span>
            <span className="text-gray-600">
              {preferences.notifications.painReminders ? 
                (locale === 'zh' ? '开启' : 'On') : 
                (locale === 'zh' ? '关闭' : 'Off')
              }
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">
              {locale === 'zh' ? '数据分析：' : 'Analytics: '}
            </span>
            <span className="text-gray-600">
              {preferences.privacy.analytics ? 
                (locale === 'zh' ? '开启' : 'On') : 
                (locale === 'zh' ? '关闭' : 'Off')
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
