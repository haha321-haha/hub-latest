'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface EmbeddedPainAssessmentProps {
  locale?: string;
  className?: string;
}

const EmbeddedPainAssessment: React.FC<EmbeddedPainAssessmentProps> = ({
  locale = 'zh',
  className = ''
}) => {
  const [intensity, setIntensity] = useState<string>('');
  const [showQuickResult, setShowQuickResult] = useState(false);

  // Direct translations to avoid i18n issues
  const translations = {
    title: locale === 'zh' ? '💡 痛经快速自测' : '💡 Quick Pain Assessment',
    subtitle: locale === 'zh' ? '1分钟了解您的痛经程度，获得初步建议' : 'Understand your pain level in 1 minute and get initial recommendations',
    question: locale === 'zh' ? '您的痛经强度如何？' : 'How intense is your menstrual pain?',
    selectIntensityFirst: locale === 'zh' ? '请先选择痛经强度' : 'Please select pain intensity first',
    options: {
      mild: locale === 'zh' ? '轻微（可以忍受，不影响日常活动）' : 'Mild (tolerable, doesn\'t affect daily activities)',
      moderate: locale === 'zh' ? '中度（影响部分活动，但能坚持）' : 'Moderate (affects some activities, but manageable)',
      severe: locale === 'zh' ? '重度（完全影响日常活动，需要休息）' : 'Severe (completely affects daily activities, need rest)'
    },
    buttons: {
      getAdvice: locale === 'zh' ? '获取建议' : 'Get Advice',
      detailedAssessment: locale === 'zh' ? '详细评估' : 'Detailed Assessment',
      testAgain: locale === 'zh' ? '重新测试' : 'Test Again',
      fullAssessment: locale === 'zh' ? '完整评估' : 'Full Assessment'
    },
    resultTitle: locale === 'zh' ? '评估结果' : 'Assessment Result',
    results: {
      mild: locale === 'zh' ? '您的痛经程度较轻，可以尝试热敷、轻度运动等自然缓解方法。' : 'Your menstrual pain is mild. You can try natural relief methods like heat therapy and light exercise.',
      moderate: locale === 'zh' ? '您的痛经程度中等，建议结合多种缓解方法，如有需要可考虑非处方止痛药。' : 'Your menstrual pain is moderate. Consider combining multiple relief methods, and over-the-counter pain medication if needed.',
      severe: locale === 'zh' ? '您的痛经程度较重，建议咨询医生获得专业评估和治疗建议。' : 'Your menstrual pain is severe. We recommend consulting a doctor for professional assessment and treatment advice.'
    },
    disclaimer: locale === 'zh' ? '⚠️ 此工具仅供参考，不能替代专业医疗建议' : '⚠️ This tool is for reference only and cannot replace professional medical advice'
  };

  const getQuickAssessment = () => {
    if (!intensity) {
      alert(translations.selectIntensityFirst);
      return;
    }

    setShowQuickResult(true);
  };

  const getResultMessage = () => {
    if (intensity === 'mild') {
      return translations.results.mild;
    } else if (intensity === 'moderate') {
      return translations.results.moderate;
    } else {
      return translations.results.severe;
    }
  };

  const getResultColor = () => {
    if (intensity === 'mild') return 'border-green-500 bg-green-50 text-green-700';
    if (intensity === 'moderate') return 'border-yellow-500 bg-yellow-50 text-yellow-700';
    return 'border-red-500 bg-red-50 text-red-700';
  };

  return (
    <div className={`bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-700 mb-2">
          {translations.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {translations.subtitle}
        </p>
      </div>

      {!showQuickResult ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 text-gray-800">
              {translations.question}
            </h4>
            <div className="space-y-2">
              {[
                {
                  value: 'mild',
                  label: translations.options.mild,
                  emoji: '😊'
                },
                {
                  value: 'moderate',
                  label: translations.options.moderate,
                  emoji: '😐'
                },
                {
                  value: 'severe',
                  label: translations.options.severe,
                  emoji: '😰'
                }
              ].map((option) => (
                <label 
                  key={option.value} 
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="intensity"
                    value={option.value}
                    checked={intensity === option.value}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={getQuickAssessment}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold"
            >
              {translations.buttons.getAdvice}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold text-center"
            >
              {translations.buttons.detailedAssessment}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-l-4 ${getResultColor()}`}>
            <h4 className="font-medium mb-2">
              {translations.resultTitle}
            </h4>
            <p className="text-sm leading-relaxed">
              {getResultMessage()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setShowQuickResult(false);
                setIntensity('');
              }}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold"
            >
              {translations.buttons.testAgain}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold text-center"
            >
              {translations.buttons.fullAssessment}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {translations.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default EmbeddedPainAssessment;
