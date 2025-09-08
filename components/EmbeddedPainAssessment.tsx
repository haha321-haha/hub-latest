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
      alert(t('selectIntensityFirst'));
      return;
    }

    setShowQuickResult(true);
  };

  const getResultMessage = () => {
    if (intensity === 'mild') {
      return t('results.mild');
    } else if (intensity === 'moderate') {
      return t('results.moderate');
    } else {
      return t('results.severe');
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
          {t('title')}
        </h3>
        <p className="text-gray-600 text-sm">
          {t('subtitle')}
        </p>
      </div>

      {!showQuickResult ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 text-gray-800">
              {t('question')}
            </h4>
            <div className="space-y-2">
              {[
                {
                  value: 'mild',
                  label: t('options.mild'),
                  emoji: '😊'
                },
                {
                  value: 'moderate',
                  label: t('options.moderate'),
                  emoji: '😐'
                },
                {
                  value: 'severe',
                  label: t('options.severe'),
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
              {t('buttons.getAdvice')}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-outline text-sm py-2 px-4 font-semibold text-center"
            >
              {t('buttons.detailedAssessment')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-l-4 ${getResultColor()}`}>
            <h4 className="font-medium mb-2">
              {t('resultTitle')}
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
              {t('buttons.testAgain')}
            </button>
            <Link
              href={`/${locale}/interactive-tools/period-pain-assessment`}
              className="flex-1 btn-primary text-sm py-2 px-4 font-semibold text-center"
            >
              {t('buttons.fullAssessment')}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default EmbeddedPainAssessment;
