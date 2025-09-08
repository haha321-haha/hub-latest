'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Locale = 'en' | 'zh';

interface AnalyticsTabProps {
  locale: Locale;
}

export default function AnalyticsTab({ locale }: AnalyticsTabProps) {
  const t = useTranslations('interactiveTools');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock analytics data - in real implementation, this would come from analytics engine
  const mockAnalytics = {
    averagePainLevel: 5.2,
    totalRecords: 24,
    painTrend: [
      { date: '2024-01-01', level: 4 },
      { date: '2024-01-02', level: 6 },
      { date: '2024-01-03', level: 5 },
      { date: '2024-01-04', level: 7 },
      { date: '2024-01-05', level: 3 },
      { date: '2024-01-06', level: 4 },
      { date: '2024-01-07', level: 5 }
    ],
    painDistribution: {
      mild: 8,
      moderate: 12,
      severe: 4
    },
    commonLocations: [
      { location: locale === 'zh' ? '下腹部' : 'Lower Abdomen', count: 15, percentage: 62.5 },
      { location: locale === 'zh' ? '下背部' : 'Lower Back', count: 6, percentage: 25 },
      { location: locale === 'zh' ? '大腿' : 'Thighs', count: 3, percentage: 12.5 }
    ],
    commonTypes: [
      { type: locale === 'zh' ? '痉挛性疼痛' : 'Cramping', count: 12, percentage: 50 },
      { type: locale === 'zh' ? '钝痛' : 'Dull Pain', count: 8, percentage: 33.3 },
      { type: locale === 'zh' ? '锐痛' : 'Sharp Pain', count: 4, percentage: 16.7 }
    ],
    insights: [
      {
        type: 'pattern',
        title: locale === 'zh' ? '疼痛模式识别' : 'Pain Pattern Recognition',
        description: locale === 'zh' 
          ? '您的疼痛通常在经期前2-3天开始加重，建议提前准备缓解措施。'
          : 'Your pain typically intensifies 2-3 days before menstruation. Consider preparing relief measures in advance.',
        severity: 'medium'
      },
      {
        type: 'recommendation',
        title: locale === 'zh' ? '个性化建议' : 'Personalized Recommendation',
        description: locale === 'zh'
          ? '基于您的数据，热敷和轻度拉伸对缓解疼痛最有效。'
          : 'Based on your data, heat therapy and light stretching are most effective for pain relief.',
        severity: 'low'
      }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return locale === 'zh' ? '高优先级' : 'High Priority';
      case 'medium': return locale === 'zh' ? '中优先级' : 'Medium Priority';
      case 'low': return locale === 'zh' ? '低优先级' : 'Low Priority';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          {locale === 'zh' ? '数据分析' : 'Data Analytics'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          {locale === 'zh' ? '深入了解您的疼痛模式和趋势' : 'Gain insights into your pain patterns and trends'}
        </p>
      </header>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {locale === 'zh' ? '分析周期' : 'Analysis Period'}
          </h3>
          <div className="flex space-x-2">
            {[
              { key: 'week', label: locale === 'zh' ? '周' : 'Week' },
              { key: 'month', label: locale === 'zh' ? '月' : 'Month' },
              { key: 'quarter', label: locale === 'zh' ? '季度' : 'Quarter' },
              { key: 'year', label: locale === 'zh' ? '年' : 'Year' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.averagePainLevel}
          </div>
          <div className="text-sm text-gray-600">
            {locale === 'zh' ? '平均疼痛程度' : 'Average Pain Level'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.totalRecords}
          </div>
          <div className="text-sm text-gray-600">
            {locale === 'zh' ? '总记录数' : 'Total Records'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockAnalytics.painTrend.length}
          </div>
          <div className="text-sm text-gray-600">
            {locale === 'zh' ? '分析天数' : 'Days Analyzed'}
          </div>
        </div>
      </div>

      {/* Pain Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {locale === 'zh' ? '疼痛程度分布' : 'Pain Level Distribution'}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(mockAnalytics.painDistribution).map(([level, count]) => {
            const percentage = (count / mockAnalytics.totalRecords) * 100;
            const levelLabel = level === 'mild' 
              ? (locale === 'zh' ? '轻度' : 'Mild')
              : level === 'moderate'
              ? (locale === 'zh' ? '中度' : 'Moderate')
              : (locale === 'zh' ? '重度' : 'Severe');
            
            const levelColor = level === 'mild' 
              ? 'bg-green-500'
              : level === 'moderate'
              ? 'bg-yellow-500'
              : 'bg-red-500';

            return (
              <div key={level} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {levelLabel}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${levelColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Locations and Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Locations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'zh' ? '常见疼痛位置' : 'Common Pain Locations'}
          </h3>
          
          <div className="space-y-3">
            {mockAnalytics.commonLocations.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.location}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Types */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {locale === 'zh' ? '常见疼痛类型' : 'Common Pain Types'}
          </h3>
          
          <div className="space-y-3">
            {mockAnalytics.commonTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {locale === 'zh' ? '智能洞察' : 'Smart Insights'}
        </h3>
        
        <div className="space-y-4">
          {mockAnalytics.insights.map((insight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                  {getSeverityLabel(insight.severity)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <section 
        className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        aria-labelledby="chart-heading"
      >
        <h2 
          id="chart-heading"
          className="text-base sm:text-lg font-medium text-gray-900 mb-4"
        >
          {locale === 'zh' ? '疼痛趋势图' : 'Pain Trend Chart'}
        </h2>
        
        <div 
          className="h-64 sm:h-80 bg-gray-50 rounded-lg flex items-center justify-center"
          role="img"
          aria-labelledby="chart-description"
        >
          <div className="text-center max-w-sm mx-auto p-4">
            <svg 
              className="w-12 h-12 text-gray-400 mx-auto mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2">
              {locale === 'zh' ? '图表将在此处显示' : 'Chart will be displayed here'}
            </h3>
            <p 
              id="chart-description"
              className="text-xs sm:text-sm text-gray-500"
            >
              {locale === 'zh' 
                ? '当您有足够的疼痛记录数据时，这里将显示您的疼痛趋势图表，帮助您了解疼痛模式的变化。'
                : 'When you have sufficient pain record data, this area will display your pain trend charts to help you understand changes in your pain patterns.'
              }
            </p>
          </div>
        </div>
        
        {/* Alternative text description for screen readers */}
        <div className="sr-only">
          {locale === 'zh' 
            ? '疼痛趋势图表占位符。当有足够数据时，将显示您的疼痛水平随时间变化的图表。'
            : 'Pain trend chart placeholder. When sufficient data is available, this will show a chart of your pain levels over time.'
          }
        </div>
      </section>
    </div>
  );
}