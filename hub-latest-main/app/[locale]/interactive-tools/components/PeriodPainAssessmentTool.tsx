'use client';

import React, { useState } from 'react';

interface PeriodPainAssessmentToolProps {
  locale: string;
}

export default function PeriodPainAssessmentTool({ locale }: PeriodPainAssessmentToolProps) {
  const [intensity, setIntensity] = useState('');
  const [onset, setOnset] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 翻译文本
  const texts = {
    zh: {
      title: '痛经速测小工具',
      subtitle: '回答几个简单问题，初步了解你的痛经类型和严重程度。',
      intensityTitle: '你的痛经强度如何？',
      intensityOptions: {
        mild: '轻微疼痛（可以正常活动）',
        moderate: '中等疼痛（影响日常活动）',
        severe: '严重疼痛（无法正常活动）'
      },
      onsetTitle: '痛经通常什么时候开始？',
      onsetOptions: {
        recent: '月经前1-2天开始',
        later: '月经开始后才疼痛'
      },
      symptomsTitle: '是否伴有以下严重症状？（可多选）',
      symptomsOptions: {
        fever: '发热',
        vomiting: '严重呕吐',
        dizziness: '头晕或昏厥',
        bleeding: '异常出血',
        nonMenstrual: '非月经期也疼痛'
      },
      assessButton: '开始评估',
      resetButton: '重新测试',
      moreInfoButton: '了解更多',
      resultTitle: '评估结果',
      consultAdvice: '建议咨询医生获得专业建议',
      disclaimer: '此工具仅供参考，不能替代专业医疗建议。如有疑虑请咨询医生。'
    },
    en: {
      title: 'Period Pain Assessment Tool',
      subtitle: 'Answer a few simple questions to understand your menstrual pain type and severity.',
      intensityTitle: 'How intense is your menstrual pain?',
      intensityOptions: {
        mild: 'Mild pain (can continue normal activities)',
        moderate: 'Moderate pain (affects daily activities)',
        severe: 'Severe pain (unable to perform normal activities)'
      },
      onsetTitle: 'When does your menstrual pain usually start?',
      onsetOptions: {
        recent: 'Starts 1-2 days before menstruation',
        later: 'Starts after menstruation begins'
      },
      symptomsTitle: 'Do you experience any of these severe symptoms? (Multiple choice)',
      symptomsOptions: {
        fever: 'Fever',
        vomiting: 'Severe vomiting',
        dizziness: 'Dizziness or fainting',
        bleeding: 'Abnormal bleeding',
        nonMenstrual: 'Pain outside menstrual period'
      },
      assessButton: 'Start Assessment',
      resetButton: 'Reset Test',
      moreInfoButton: 'Learn More',
      resultTitle: 'Assessment Result',
      consultAdvice: 'We recommend consulting a doctor for professional advice',
      disclaimer: 'This tool is for reference only and cannot replace professional medical advice. Please consult a doctor if you have concerns.'
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.zh;

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms([...symptoms, symptom]);
    } else {
      setSymptoms(symptoms.filter(s => s !== symptom));
    }
  };

  const evaluateAssessment = () => {
    let severity = 'low';
    let advice = '';
    let needConsult = false;

    // 评估逻辑
    if (symptoms.length > 0) {
      severity = 'high';
      needConsult = true;
      advice = locale === 'zh' 
        ? '您的症状较为严重，建议尽快咨询妇科医生进行详细检查。'
        : 'Your symptoms are quite severe. We recommend consulting a gynecologist for detailed examination as soon as possible.';
    } else if (intensity === 'severe') {
      severity = 'high';
      needConsult = true;
      advice = locale === 'zh'
        ? '严重痛经可能影响生活质量，建议咨询医生了解治疗方案。'
        : 'Severe menstrual pain may affect quality of life. We recommend consulting a doctor to understand treatment options.';
    } else if (intensity === 'moderate') {
      severity = 'medium';
      advice = locale === 'zh'
        ? '中等程度痛经较为常见，可以尝试热敷、适量运动等缓解方法。如持续困扰建议就医。'
        : 'Moderate menstrual pain is common. You can try heat therapy, moderate exercise, and other relief methods. If it continues to bother you, consider seeing a doctor.';
    } else {
      severity = 'low';
      advice = locale === 'zh'
        ? '您的痛经程度较轻，属于正常范围。保持良好的生活习惯即可。'
        : 'Your menstrual pain is mild and within the normal range. Maintaining good lifestyle habits should be sufficient.';
    }

    setResult({ severity, advice, needConsult });
  };

  const resetAssessment = () => {
    setIntensity('');
    setOnset('');
    setSymptoms([]);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.title}</h1>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      {!result ? (
        <div className="space-y-8">
          {/* 痛经强度 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{t.intensityTitle}</h3>
            <div className="space-y-3">
              {Object.entries(t.intensityOptions).map(([value, label]) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="intensity"
                    value={value}
                    checked={intensity === value}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 text-left">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 痛经开始时间 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{t.onsetTitle}</h3>
            <div className="space-y-3">
              {Object.entries(t.onsetOptions).map(([value, label]) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="onset"
                    value={value}
                    checked={onset === value}
                    onChange={(e) => setOnset(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 text-left">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 严重症状 */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{t.symptomsTitle}</h3>
            <div className="space-y-3">
              {Object.entries(t.symptomsOptions).map(([value, label]) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    value={value}
                    checked={symptoms.includes(value)}
                    onChange={(e) => handleSymptomChange(value, e.target.checked)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 text-left">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={evaluateAssessment}
              disabled={!intensity || !onset}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t.assessButton}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border-l-4 ${
            result.severity === 'high' ? 'border-red-500 bg-red-50' :
            result.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${
              result.severity === 'high' ? 'text-red-700' :
              result.severity === 'medium' ? 'text-yellow-700' :
              'text-green-700'
            }`}>
              {t.resultTitle}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {result.advice}
            </p>
          </div>

          {result.needConsult && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-medium">
                {t.consultAdvice}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetAssessment}
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              {t.resetButton}
            </button>
            <a
              href={`/${locale}/teen-health`}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-pink-600 hover:to-pink-700 transition-all"
            >
              {t.moreInfoButton}
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
}
