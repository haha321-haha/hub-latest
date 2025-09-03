'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

type Locale = 'en' | 'zh';

interface RecordTabProps {
  locale: Locale;
}

export default function RecordTab({ locale }: RecordTabProps) {
  const t = useTranslations('interactiveTools');
  const [painLevel, setPainLevel] = useState(5);
  const [painLocation, setPainLocation] = useState('');
  const [painType, setPainType] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    severity: 'mild' | 'moderate' | 'severe' | 'emergency';
    summary: string;
    locationLabel: string;
    typeLabel: string;
    recommendations: Array<{ id: string; title: string; description: string; timeframe: string; priority: 'high' | 'medium' | 'low'; actionSteps: string[] }>
  }>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const percent = ((painLevel - 1) / 9) * 100;
  const gradientFill = 'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)';
  const trackBase = 'linear-gradient(90deg, #e5e7eb 0 0)';

  const handleRecordPain = async () => {
    if (!painLocation || !painType) {
      alert(locale === 'zh' ? '请填写完整的疼痛信息' : 'Please fill in complete pain information');
      return;
    }

    setIsRecording(true);
    
    // 模拟记录过程
    setTimeout(() => {
      setIsRecording(false);
      
      // 将存储值映射为已翻译的标签
      const locationLabel = locations.find(l => l.value === painLocation)?.label || painLocation;
      const typeLabel = painTypes.find(ti => ti.value === painType)?.label || painType;

      // 计算严重程度
      const severity: 'mild' | 'moderate' | 'severe' | 'emergency' =
        painLevel >= 9 ? 'emergency' : painLevel >= 7 ? 'severe' : painLevel >= 4 ? 'moderate' : 'mild';

      const summaryZh =
        severity === 'emergency'
          ? '您的疼痛较为严重，建议尽快就医评估并接受规范治疗。'
          : severity === 'severe'
          ? '您的疼痛比较严重，建议采取综合管理策略，必要时咨询医生。'
          : severity === 'moderate'
          ? '您有中等程度的疼痛，建议结合热疗、拉伸与放松训练，持续观察。'
          : '您的疼痛较轻，建议继续记录并通过生活方式调整进行管理。';
      const summaryEn =
        severity === 'emergency'
          ? 'Your pain is severe. Please seek medical evaluation promptly.'
          : severity === 'severe'
          ? 'Your pain is relatively severe. Consider combined management and medical consultation.'
          : severity === 'moderate'
          ? 'Moderate pain. Combine heat, stretching and relaxation; continue monitoring.'
          : 'Mild pain. Keep logging and adjust lifestyle.';

      const recs = (
        severity === 'emergency'
          ? [
              { id: 'seek-care', title: locale === 'zh' ? '建议立即就医' : 'Seek medical care now', description: locale === 'zh' ? '若出现发热、昏厥、异常出血或持续剧痛，请尽快就医。' : 'If fever, fainting, abnormal bleeding or persistent severe pain, seek care immediately.', timeframe: locale === 'zh' ? '立即' : 'Immediate', priority: 'high' as const, actionSteps: (locale === 'zh' ? ['联系妇科医生或急诊', '准备近期疼痛记录', '必要时前往急诊'] : ['Contact OB-GYN/Urgent care', 'Prepare recent pain logs', 'Go to ER if needed']) as string[] },
            ]
          : severity === 'severe'
          ? [
              { id: 'combined', title: locale === 'zh' ? '综合管理' : 'Combined management', description: locale === 'zh' ? '在医生指导下使用止痛药，配合热疗与轻量运动。' : 'Use analgesics as directed, plus heat therapy and light exercise.', timeframe: locale === 'zh' ? '本周内开始' : 'Start this week', priority: 'high' as const, actionSteps: (locale === 'zh' ? ['按说明使用NSAIDs', '热敷20分钟/次', '每天步行15-20分钟'] : ['Use NSAIDs as directed', 'Heat 20 min/session', 'Walk 15-20m daily']) as string[] },
            ]
          : severity === 'moderate'
          ? [
              { id: 'pain-mgmt', title: locale === 'zh' ? '疼痛管理' : 'Pain management', description: locale === 'zh' ? '热敷+拉伸+呼吸放松，2周后复评。' : 'Heat + stretching + breathing; reassess in 2 weeks.', timeframe: locale === 'zh' ? '1-2周见效' : '1-2 weeks', priority: 'medium' as const, actionSteps: (locale === 'zh' ? ['热敷腹部/腰背', '轻瑜伽或拉伸15-20分钟', '4-7-8呼吸练习'] : ['Heat abdomen/back', 'Light yoga/stretch 15-20m', '4-7-8 breathing']) as string[] },
            ]
          : [
              { id: 'lifestyle', title: locale === 'zh' ? '生活方式调整' : 'Lifestyle adjustments', description: locale === 'zh' ? '规律作息、均衡饮食、适度运动，有助于减少疼痛频率。' : 'Regular sleep, balanced diet, moderate exercise to reduce pain frequency.', timeframe: locale === 'zh' ? '持续进行' : 'Ongoing', priority: 'low' as const, actionSteps: (locale === 'zh' ? ['保证7-8小时睡眠', '减少高糖高脂摄入', '保持每周3次轻运动'] : ['Sleep 7-8h', 'Reduce sugar/fat', '3x/week light exercise']) as string[] },
            ]
      ) as any[];

      setResult({
        score: painLevel,
        severity,
        summary: locale === 'zh' ? summaryZh : summaryEn,
        locationLabel,
        typeLabel,
        recommendations: recs,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 1500);
  };

  // 将locations和painTypes数组移到组件内部，这样可以使用t()函数
  const locations = [
    { value: 'lower_abdomen', label: t('painTracker.lowerAbdomen') },
    { value: 'lower_back', label: t('painTracker.lowerBack') },
    { value: 'thighs', label: t('painTracker.thighs') },
    { value: 'other', label: t('painTracker.other') }
  ];

  const painTypes = [
    { value: 'cramping', label: t('painTracker.cramping') },
    { value: 'dull_pain', label: t('painTracker.dullPain') },
    { value: 'sharp_pain', label: t('painTracker.sharpPain') },
    { value: 'other', label: t('painTracker.other') }
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Pain Tracker UI */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('painTracker.toolTitle')}
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              {t('painTracker.toolDescription')}
            </p>
          </div>

          {/* Interactive Pain Recording Form */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('painTracker.painLevel')}
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

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('painTracker.painLocation')}
              </label>
              <select 
                value={painLocation}
                onChange={(e) => setPainLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('painTracker.painLocationPlaceholder')}</option>
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('painTracker.painType')}
              </label>
              <select 
                value={painType}
                onChange={(e) => setPainType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t('painTracker.painTypePlaceholder')}</option>
                {painTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleRecordPain}
              disabled={isRecording || !painLocation || !painType}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isRecording || !painLocation || !painType
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white`}
            >
              {isRecording ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('painTracker.recording')}
                </div>
              ) : (
                t('painTracker.recordPain')
              )}
            </button>

            {(painLocation || painType) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  {locale === 'zh' 
                    ? `已选择：疼痛程度 ${painLevel}/10${painLocation ? `，位置：${locations.find(l => l.value === painLocation)?.label}` : ''}${painType ? `，类型：${painTypes.find(t => t.value === painType)?.label}` : ''}`
                    : `Selected: Pain level ${painLevel}/10${painLocation ? `, Location: ${locations.find(l => l.value === painLocation)?.label}` : ''}${painType ? `, Type: ${painTypes.find(t => t.value === painType)?.label}` : ''}`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">{locale === 'zh' ? '记录结果' : 'Record Result'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '今天的评分' : "Today's Score"}</h3>
                <p className="text-3xl font-extrabold text-primary-700">{result.score}/10</p>
              </div>
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '疼痛位置' : 'Location'}</h3>
                <p className="text-xl font-bold text-neutral-900">{result.locationLabel}</p>
              </div>
              <div className="card text-center">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{locale === 'zh' ? '疼痛类型' : 'Type'}</h3>
                <p className="text-xl font-bold text-neutral-900">{result.typeLabel}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{locale === 'zh' ? '结果摘要' : 'Summary'}</h3>
              <div className="card">
                <p className="text-neutral-700 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{locale === 'zh' ? '建议方案' : 'Recommendations'}</h3>
              <div className="space-y-4">
                {result.recommendations.map((rec) => (
                  <div key={rec.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-neutral-900">{rec.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setResult(null)} className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                {locale === 'zh' ? '继续记录' : 'Record Another'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
