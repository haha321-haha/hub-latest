'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type Locale = 'en' | 'zh';

interface Props {
  params: { locale: Locale };
}

export default function SymptomAssessmentPage({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [isAssessing, setIsAssessing] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<null | {
    symptom: string;
    level: number;
    assessment: string;
    recommendations: string[];
    severity: 'mild' | 'moderate' | 'severe';
  }>(null);

  const symptoms = [
    { value: 'cramps', label: locale === 'zh' ? '痉挛性疼痛' : 'Cramping pain' },
    { value: 'bloating', label: locale === 'zh' ? '腹胀' : 'Bloating' },
    { value: 'headache', label: locale === 'zh' ? '头痛' : 'Headache' },
    { value: 'fatigue', label: locale === 'zh' ? '疲劳' : 'Fatigue' },
    { value: 'mood-changes', label: locale === 'zh' ? '情绪变化' : 'Mood changes' },
    { value: 'breast-tenderness', label: locale === 'zh' ? '乳房胀痛' : 'Breast tenderness' },
    { value: 'back-pain', label: locale === 'zh' ? '背痛' : 'Back pain' },
    { value: 'nausea', label: locale === 'zh' ? '恶心' : 'Nausea' }
  ];

  const handleStartAssessment = () => {
    if (!selectedSymptom) return;
    setIsAssessing(true);
    setResult(null);
    
    // 模拟评估过程
    setTimeout(() => {
      const assessment = getAssessment(selectedSymptom, painLevel);
      setResult(assessment);
      setIsAssessing(false);
      
      // 滚动到结果区域
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const getAssessment = (symptom: string, level: number) => {
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    let assessment = '';
    let recommendations: string[] = [];

    if (level >= 8) {
      severity = 'severe';
      assessment = locale === 'zh' 
        ? '症状严重，建议立即咨询医生'
        : 'Severe symptoms, consider immediate medical consultation';
      recommendations = locale === 'zh' 
        ? ['立即就医', '记录详细症状', '避免剧烈活动']
        : ['Seek immediate medical attention', 'Keep detailed symptom records', 'Avoid strenuous activities'];
    } else if (level >= 5) {
      severity = 'moderate';
      assessment = locale === 'zh'
        ? '症状中等，建议采取缓解措施'
        : 'Moderate symptoms, consider relief measures';
      recommendations = locale === 'zh'
        ? ['尝试热敷', '考虑非处方药', '保持休息', '记录症状变化']
        : ['Try heat therapy', 'Consider over-the-counter medication', 'Get adequate rest', 'Monitor symptom changes'];
    } else {
      severity = 'mild';
      assessment = locale === 'zh'
        ? '症状轻微，可以尝试自我缓解'
        : 'Mild symptoms, try self-relief methods';
      recommendations = locale === 'zh'
        ? ['保持充足睡眠', '适度运动', '放松技巧', '均衡饮食']
        : ['Get adequate sleep', 'Moderate exercise', 'Relaxation techniques', 'Balanced diet'];
    }

    return {
      symptom: symptoms.find(s => s.value === symptom)?.label || symptom,
      level,
      assessment,
      recommendations,
      severity
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {locale === 'zh' ? '症状评估工具' : 'Symptom Assessment Tool'}
            </h1>
            <p className="text-gray-600">
              {locale === 'zh' 
                ? '评估您的经期症状，获取个性化建议'
                : 'Assess your menstrual symptoms and get personalized recommendations'
              }
            </p>
          </div>

          {!isAssessing && !result && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '选择主要症状' : 'Select Primary Symptom'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom.value}
                      onClick={() => setSelectedSymptom(symptom.value)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedSymptom === symptom.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {symptom.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedSymptom && (
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    {locale === 'zh' ? '症状强度 (1-10)' : 'Symptom Intensity (1-10)'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">10</span>
                    <span className="text-xl font-bold text-blue-600 w-8 text-center">
                      {painLevel}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartAssessment}
                disabled={!selectedSymptom}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  selectedSymptom
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {locale === 'zh' ? '开始评估' : 'Start Assessment'}
              </button>
            </div>
          )}

          {isAssessing && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {locale === 'zh' ? '正在评估...' : 'Assessing...'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'zh' ? '请稍候，我们正在分析您的症状' : 'Please wait while we analyze your symptoms'}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div ref={resultRef} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {locale === 'zh' ? '评估结果' : 'Assessment Results'}
                </h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'zh' ? '症状信息' : 'Symptom Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      {locale === 'zh' ? '症状' : 'Symptom'}
                    </span>
                    <p className="text-lg font-medium text-gray-800">{result.symptom}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {locale === 'zh' ? '强度' : 'Intensity'}
                    </span>
                    <p className="text-lg font-medium text-gray-800">{result.level}/10</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-6 ${
                result.severity === 'severe' ? 'bg-red-50 border border-red-200' :
                result.severity === 'moderate' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'zh' ? '评估结果' : 'Assessment Result'}
                </h3>
                <p className="text-gray-700 mb-4">{result.assessment}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  result.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {result.severity === 'severe' ? (locale === 'zh' ? '严重' : 'Severe') :
                   result.severity === 'moderate' ? (locale === 'zh' ? '中等' : 'Moderate') :
                   (locale === 'zh' ? '轻微' : 'Mild')}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'zh' ? '建议措施' : 'Recommendations'}
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {locale === 'zh' ? '重要提醒' : 'Important Note'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'zh' 
                    ? '此评估仅供参考，不能替代专业医疗建议。如有严重症状，请及时就医。'
                    : 'This assessment is for reference only and does not replace professional medical advice. Please consult a healthcare provider for serious symptoms.'
                  }
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setSelectedSymptom('');
                    setPainLevel(5);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {locale === 'zh' ? '重新评估' : 'Assess Again'}
                </button>
                <Link
                  href={`/${locale}/interactive-tools`}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {locale === 'zh' ? '返回工具' : 'Back to Tools'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}