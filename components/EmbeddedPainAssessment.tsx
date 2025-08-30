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
  const t = useTranslations('embeddedPainAssessment');
  const [intensity, setIntensity] = useState<string>('');
  const [showQuickResult, setShowQuickResult] = useState(false);

  const getQuickAssessment = () => {
    if (!intensity) {
      alert(locale === 'en' ? 'Please select pain intensity first' : '请先选择痛经强度');
      return;
    }

    setShowQuickResult(true);
  };

  const getResultMessage = () => {
    if (intensity === 'mild') {
      return locale === 'en'
        ? 'Your menstrual pain is mild. You can try natural relief methods like heat therapy and light exercise.'
        : '您的痛经程度较轻，可以尝试热敷、轻度运动等自然缓解方法。';
    } else if (intensity === 'moderate') {
      return locale === 'en'
        ? 'Your menstrual pain is moderate. Consider combining multiple relief methods, and over-the-counter pain medication if needed.'
        : '您的痛经程度中等，建议结合多种缓解方法，如有需要可考虑非处方止痛药。';
    } else {
      return locale === 'en'
        ? 'Your menstrual pain is severe. We recommend consulting a doctor for professional assessment and treatment advice.'
        : '您的痛经程度较重，建议咨询医生获得专业评估和治疗建议。';
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
          {locale === 'en' ? '💡 Quick Pain Assessment' : '💡 痛经快速自测'}
        </h3>
        <p className="text-gray-600 text-sm">
          {locale === 'en'
            ? 'Understand your pain level in 1 minute and get initial recommendations'
            : '1分钟了解您的痛经程度，获得初步建议'
          }
        </p>
      </div>

      {!showQuickResult ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 text-gray-800">
              {locale === 'en' ? 'How intense is your menstrual pain?' : '您的痛经强度如何？'}
            </h4>
            <div className="space-y-2">
              {[
                {
                  value: 'mild',
                  label: locale === 'en' ? 'Mild (tolerable, doesn\'t affect daily activities)' : '轻微（可以忍受，不影响日常活动）',
                  emoji: '😊'
                },
                {
                  value: 'moderate',
                  label: locale === 'en' ? 'Moderate (affects some activities, but manageable)' : '中度（影响部分活动，但能坚持）',
                  emoji: '😐'
                },
                {
                  value: 'severe',
                  label: locale === 'en' ? 'Severe (completely affects daily activities, need rest)' : '重度（完全影响日常活动，需要休息）',
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
              {locale === 'en' ? 'Get Advice' : '获取建议'}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold text-center"
            >
              {locale === 'en' ? 'Detailed Assessment' : '详细评估'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-l-4 ${getResultColor()}`}>
            <h4 className="font-medium mb-2">
              {locale === 'en' ? 'Assessment Result' : '评估结果'}
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
              {locale === 'en' ? 'Test Again' : '重新测试'}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold text-center"
            >
              {locale === 'en' ? 'Full Assessment' : '完整评估'}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {locale === 'en'
            ? '⚠️ This tool is for reference only and cannot replace professional medical advice'
            : '⚠️ 此工具仅供参考，不能替代专业医疗建议'
          }
        </p>
      </div>
    </div>
  );
};

export default EmbeddedPainAssessment;
