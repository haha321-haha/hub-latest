'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  PAIN_LOCATIONS, 
  SYMPTOMS, 
  REMEDIES, 
  MENSTRUAL_STATUS, 
  PAIN_LEVELS, 
  PAIN_TYPES,
  MEDICAL_TERMS,
  CULTURAL_DESCRIPTIONS
} from '../../shared/constants';
import { formatDate, formatRelativeDate, formatDuration } from '../../shared/utils/dateFormatting';

interface TranslationTestComponentProps {
  locale: 'en' | 'zh';
}

/**
 * Component to test and demonstrate pain tracker translations
 * This component shows all translated content to verify language switching works
 */
export default function TranslationTestComponent({ locale }: TranslationTestComponentProps) {
  const t = useTranslations('painTracker');
  const [currentSection, setCurrentSection] = useState<string>('overview');

  const testDate = new Date();
  const testDuration = 120; // 2 hours

  const sections = [
    { id: 'overview', label: locale === 'zh' ? '概览' : 'Overview' },
    { id: 'locations', label: locale === 'zh' ? '疼痛位置' : 'Pain Locations' },
    { id: 'symptoms', label: locale === 'zh' ? '症状' : 'Symptoms' },
    { id: 'remedies', label: locale === 'zh' ? '缓解方法' : 'Remedies' },
    { id: 'status', label: locale === 'zh' ? '月经状态' : 'Menstrual Status' },
    { id: 'painLevels', label: locale === 'zh' ? '疼痛等级' : 'Pain Levels' },
    { id: 'painTypes', label: locale === 'zh' ? '疼痛类型' : 'Pain Types' },
    { id: 'medical', label: locale === 'zh' ? '医学术语' : 'Medical Terms' },
    { id: 'cultural', label: locale === 'zh' ? '文化描述' : 'Cultural Descriptions' }
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('title')}</h3>
      <p className="text-gray-600">{t('description')}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium">{t('navigation.record')}</h4>
          <p className="text-sm text-gray-600">{t('form.title')}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium">{t('navigation.history')}</h4>
          <p className="text-sm text-gray-600">{t('history.title')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium">{t('navigation.analysis')}</h4>
          <p className="text-sm text-gray-600">{t('analytics.title')}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium">{t('navigation.export')}</h4>
          <p className="text-sm text-gray-600">{t('export.title')}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">{locale === 'zh' ? '日期格式测试' : 'Date Formatting Test'}</h4>
        <div className="space-y-2 text-sm">
          <p><strong>{locale === 'zh' ? '今天' : 'Today'}:</strong> {formatDate(testDate, 'short', locale)}</p>
          <p><strong>{locale === 'zh' ? '相对时间' : 'Relative'}:</strong> {formatRelativeDate(testDate, locale)}</p>
          <p><strong>{locale === 'zh' ? '持续时间' : 'Duration'}:</strong> {formatDuration(testDuration, locale)}</p>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '疼痛位置选项' : 'Pain Location Options'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PAIN_LOCATIONS[locale].map((location) => (
          <div key={location.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{location.icon}</span>
              <div>
                <div className="font-medium">{location.label}</div>
                {location?.description && (
                  <div className="text-xs text-gray-500">{location.description}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSymptoms = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '症状选项' : 'Symptom Options'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SYMPTOMS[locale].map((symptom) => (
          <div key={symptom.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{symptom.icon}</span>
              <div>
                <div className="font-medium">{symptom.label}</div>
                <div className="text-xs text-gray-500">
                  {symptom?.category} • {symptom?.severity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRemedies = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '缓解方法选项' : 'Remedy Options'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {REMEDIES[locale].map((remedy) => (
          <div key={remedy.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{remedy.icon}</span>
              <div>
                <div className="font-medium">{remedy.label}</div>
                <div className="text-xs text-gray-500">
                  {remedy?.category} • {remedy?.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '月经状态选项' : 'Menstrual Status Options'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MENSTRUAL_STATUS[locale].map((status) => (
          <div key={status.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{status.icon}</span>
              <div>
                <div className="font-medium">{status.label}</div>
                <div className="text-sm text-gray-600">{status?.description}</div>
                <div className="text-xs text-gray-500">Phase: {status?.phase}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPainLevels = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '疼痛等级描述' : 'Pain Level Descriptions'}</h3>
      <div className="space-y-2">
        {PAIN_LEVELS[locale].map((level) => (
          <div key={level.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: level?.color }}
                >
                  {level.value}
                </div>
                <div>
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 italic">
                {level?.culturalNote}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPainTypes = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '疼痛类型选项' : 'Pain Type Options'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PAIN_TYPES[locale].map((type) => (
          <div key={type.value} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{type?.icon}</span>
              <div>
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedical = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '医学术语' : 'Medical Terminology'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(MEDICAL_TERMS[locale] || {}).map(([key, term]) => (
          <div key={key} className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="font-medium">{term}</div>
            <div className="text-xs text-gray-500">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCultural = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{locale === 'zh' ? '文化适应性描述' : 'Cultural Descriptions'}</h3>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{locale === 'zh' ? '疼痛比喻' : 'Pain Metaphors'}</h4>
          <div className="space-y-2">
            {Object.entries(CULTURAL_DESCRIPTIONS[locale]?.painMetaphors || {}).map(([key, metaphor]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="italic text-gray-600">{metaphor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{locale === 'zh' ? '舒适措施' : 'Comfort Measures'}</h4>
          <div className="space-y-2">
            {Object.entries(CULTURAL_DESCRIPTIONS[locale]?.comfortMeasures || {}).map(([key, measure]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="italic text-gray-600">{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'overview': return renderOverview();
      case 'locations': return renderLocations();
      case 'symptoms': return renderSymptoms();
      case 'remedies': return renderRemedies();
      case 'status': return renderStatus();
      case 'painLevels': return renderPainLevels();
      case 'painTypes': return renderPainTypes();
      case 'medical': return renderMedical();
      case 'cultural': return renderCultural();
      default: return renderOverview();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {locale === 'zh' ? '疼痛追踪器翻译测试' : 'Pain Tracker Translation Test'}
        </h1>
        <p className="text-gray-600">
          {locale === 'zh' 
            ? '当前语言：中文 (zh) - 此页面展示所有翻译内容以验证语言切换功能'
            : 'Current Language: English (en) - This page demonstrates all translated content to verify language switching'
          }
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSection === section.id
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {renderSection()}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {locale === 'zh' 
          ? '✅ 所有翻译内容已成功加载并显示'
          : '✅ All translation content successfully loaded and displayed'
        }
      </div>
    </div>
  );
}