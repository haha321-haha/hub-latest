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
    score: number;
    maxScore: number;
    percentage: number;
    severity: 'mild' | 'moderate' | 'severe' | 'emergency';
    summary: string;
    recommendations: Array<{
      id: string;
      title: string;
      description: string;
      timeframe: string;
      priority: 'high' | 'medium' | 'low';
      actionSteps: string[];
    }>;
  }>(null);
  const percent = ((painLevel - 1) / 9) * 100;
  const gradientFill = 'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)';
  const trackBase = 'linear-gradient(90deg, #e5e7eb 0 0)';

  const handleStartAssessment = () => {
    if (!selectedSymptom) {
      alert(locale === 'zh' ? '请先选择症状' : 'Please select a symptom first');
      return;
    }

    setIsAssessing(true);
    
    // 模拟评估过程
    setTimeout(() => {
      setIsAssessing(false);

      // 计算严重程度
      const severity: 'mild' | 'moderate' | 'severe' | 'emergency' =
        painLevel >= 9 ? 'emergency' : painLevel >= 7 ? 'severe' : painLevel >= 4 ? 'moderate' : 'mild';

      // 结果摘要
      const summaryZh =
        severity === 'emergency'
          ? '您的症状较为严重，建议尽快咨询医疗专业人士。'
          : severity === 'severe'
          ? '您的症状比较严重，建议采取综合管理策略，并考虑就医评估。'
          : severity === 'moderate'
          ? '您有中等程度的症状，可以通过多种方法进行管理。'
          : '您的症状较轻，可通过生活方式调整改善。';
      const summaryEn =
        severity === 'emergency'
          ? 'Your symptoms may be severe. Please seek medical attention promptly.'
          : severity === 'severe'
          ? 'Your symptoms are relatively severe. Consider a combined management strategy and medical evaluation.'
          : severity === 'moderate'
          ? 'You have moderate symptoms that can be managed through multiple approaches.'
          : 'Your symptoms are mild and can be improved through lifestyle adjustments.';

      // 推荐项
      const recs = (
        severity === 'emergency'
          ? [
              {
                id: 'emergency-care',
                title: locale === 'zh' ? '建议立即就医' : 'Seek medical care now',
                description:
                  locale === 'zh'
                    ? '如有发热、剧烈呕吐、昏厥或异常出血等情况，请尽快就医。'
                    : 'If you have fever, severe vomiting, fainting, or abnormal bleeding, seek medical care immediately.',
                timeframe: locale === 'zh' ? '立即' : 'Immediate',
                priority: 'high' as const,
                actionSteps: (
                  locale === 'zh'
                    ? ['联系妇科医生或急诊', '准备近期症状记录', '必要时考虑急诊就医']
                    : ['Contact OB-GYN or urgent care', 'Prepare symptom logs', 'Consider ER if necessary']
                ) as string[],
              },
            ]
          : severity === 'severe'
          ? [
              {
                id: 'multi-strategy',
                title: locale === 'zh' ? '综合管理策略' : 'Combined management',
                description:
                  locale === 'zh'
                    ? '在医生指导下结合药物、热疗与轻量运动等方法。'
                    : 'Combine medication, heat therapy and light exercise under medical guidance.',
                timeframe: locale === 'zh' ? '本周内开始' : 'Start this week',
                priority: 'high' as const,
                actionSteps: (
                  locale === 'zh'
                    ? ['按说明使用止痛药', '每日热敷20分钟', '记录症状变化']
                    : ['Use OTC analgesics as directed', 'Heat therapy 20 min daily', 'Track symptoms']
                ) as string[],
              },
            ]
          : severity === 'moderate'
          ? [
              {
                id: 'pain-management',
                title: locale === 'zh' ? '疼痛管理' : 'Pain management',
                description:
                  locale === 'zh' ? '结合热敷、拉伸与放松训练，改善不适。' : 'Combine heat, stretching and relaxation practice.',
                timeframe: locale === 'zh' ? '1-2周见效' : '1-2 weeks',
                priority: 'medium' as const,
                actionSteps: (
                  locale === 'zh'
                    ? ['热敷腹部/腰背', '步行或轻度瑜伽15-20分钟', '4-7-8呼吸练习']
                    : ['Heat abdomen/back', 'Walk or light yoga 15-20m', '4-7-8 breathing']
                ) as string[],
              },
            ]
          : [
              {
                id: 'lifestyle',
                title: locale === 'zh' ? '生活方式调整' : 'Lifestyle adjustments',
                description:
                  locale === 'zh' ? '规律作息、均衡饮食与适度运动可缓解症状。' : 'Regular sleep, balanced diet and moderate exercise help.',
                timeframe: locale === 'zh' ? '持续进行' : 'Ongoing',
                priority: 'low' as const,
                actionSteps: (
                  locale === 'zh'
                    ? ['保证7-8小时睡眠', '减少高糖高脂饮食', '每周至少3次轻运动']
                    : ['Sleep 7-8h', 'Reduce sugary/fatty foods', 'Light exercise 3x/week']
                ) as string[],
              },
            ]
      ) as any[];

      setResult({
        score: painLevel,
        maxScore: 10,
        percentage: Math.round((painLevel / 10) * 100),
        severity,
        summary: locale === 'zh' ? summaryZh : summaryEn,
        recommendations: recs,
      });

      // 平滑滚动到结果区域
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/interactive-tools`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '互动工具' : 'Interactive Tools'}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">
          {locale === 'zh' ? '症状评估' : 'Symptom Assessment'}
        </span>
      </nav>

      {/* Page Header */}
      <header className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('symptomAssessment.title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          {t('symptomAssessment.description')}
        </p>
      </header>

      {/* Interactive Symptom Assessment UI */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('symptomAssessment.toolTitle')}
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              {t('symptomAssessment.toolDescription')}
            </p>
          </div>

          {/* Assessment Form */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('symptomAssessment.selectSymptom')}
              </label>
              <select 
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('symptomAssessment.selectSymptomPlaceholder')}</option>
                <option value="menstrual_pain">{t('symptomAssessment.menstrualPain')}</option>
                <option value="irregular_periods">{t('symptomAssessment.irregularPeriods')}</option>
                <option value="abnormal_flow">{t('symptomAssessment.abnormalFlow')}</option>
                <option value="other">{t('symptomAssessment.otherSymptoms')}</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('symptomAssessment.severity')}
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full pain-scale cursor-pointer outline-none rounded-lg"
                style={{
                  backgroundImage: `${gradientFill}, ${trackBase}`,
                  backgroundSize: `${percent}% 100%, 100% 100%`,
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-semibold text-primary-600">{painLevel}</span>
              </div>
            </div>

            <button 
              onClick={handleStartAssessment}
              disabled={isAssessing || !selectedSymptom}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isAssessing || !selectedSymptom
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white`}
            >
              {isAssessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('symptomAssessment.assessing')}
                </div>
              ) : (
                t('symptomAssessment.startAssessment')
              )}
            </button>

            {selectedSymptom && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  {locale === 'zh' 
                    ? `已选择症状：${selectedSymptom === 'menstrual_pain' ? '经期疼痛' : selectedSymptom === 'irregular_periods' ? '经期不规律' : selectedSymptom === 'abnormal_flow' ? '经期量异常' : '其他症状'}，严重程度：${painLevel}/10`
                    : `Selected symptom: ${selectedSymptom === 'menstrual_pain' ? 'Menstrual pain' : selectedSymptom === 'irregular_periods' ? 'Irregular periods' : selectedSymptom === 'abnormal_flow' ? 'Abnormal flow' : 'Other symptoms'}, Severity: ${painLevel}/10`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results - 卡片化，与体质测试一致风格 */}
      {result && (
        <div ref={resultRef} className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">{locale === 'zh' ? '评估结果' : 'Assessment Results'}</h2>
            </div>

            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '您的得分' : 'Your Score'}</h3>
                <p className="text-3xl font-extrabold text-primary-700">{result.score}/{result.maxScore}</p>
                <p className="text-xs text-neutral-500 mt-1">{result.percentage}%</p>
              </div>
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '严重程度' : 'Severity'}</h3>
                <p className="text-xl font-bold text-neutral-900">
                  {locale === 'zh'
                    ? result.severity === 'emergency' ? '紧急' : result.severity === 'severe' ? '重度' : result.severity === 'moderate' ? '中度' : '轻度'
                    : result.severity}
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '风险等级' : 'Risk Level'}</h3>
                <p className="text-xl font-bold text-neutral-900">
                  {locale === 'zh'
                    ? result.severity === 'emergency' ? '紧急' : result.severity === 'severe' ? '重度' : result.severity === 'moderate' ? '中度' : '轻度'
                    : result.severity}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{locale === 'zh' ? '结果摘要' : 'Summary'}</h3>
              <div className="card">
                <p className="text-neutral-700 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{locale === 'zh' ? '建议方案' : 'Recommendations'}</h3>
              <div className="space-y-4">
                {result.recommendations.map((rec) => (
                  <div key={rec.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-neutral-900">{rec.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {locale === 'zh' ? (rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级') : rec.priority}
                      </span>
                    </div>
                    <p className="text-neutral-700 mb-3 leading-relaxed">{rec.description}</p>
                    <p className="text-sm text-neutral-500 mb-3"><strong>{locale === 'zh' ? '时间框架：' : 'Timeframe: '}</strong>{rec.timeframe}</p>
                    <h5 className="font-medium text-neutral-900 mb-2">{locale === 'zh' ? '行动步骤' : 'Action Steps'}</h5>
                    <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                      {rec.actionSteps.map((s, i) => (<li key={i}>{s}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => { setResult(null); setSelectedSymptom(''); setPainLevel(5); }}
                className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                {locale === 'zh' ? '重新评估' : 'Retake Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}