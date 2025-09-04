'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

interface AssessmentData {
  painIntensity: number;
  dailyImpact: string;
  painTiming: string;
  painDuration: string;
  painCharacteristics: string[];
  painLocation: string[];
  ageGroup: string;
  cycleRegularity: string;
}

export default function AssessmentClient() {
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    painIntensity: 5,
    dailyImpact: '',
    painTiming: '',
    painDuration: '',
    painCharacteristics: [],
    painLocation: [],
    ageGroup: '',
    cycleRegularity: ''
  });
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAssessmentData = (field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetAssessment = () => {
    setCurrentStep(1);
    setAssessmentData({
      painIntensity: 5,
      dailyImpact: '',
      painTiming: '',
      painDuration: '',
      painCharacteristics: [],
      painLocation: [],
      ageGroup: '',
      cycleRegularity: ''
    });
    setShowResults(false);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛强度评估' : 'Pain Intensity Assessment'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh' 
                ? '请根据您最近一次经期的疼痛程度，选择最符合的选项：'
                : 'Please select the option that best describes your pain level during your last period:'
              }
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <label key={level} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="painIntensity"
                    value={level}
                    checked={assessmentData.painIntensity === level}
                    onChange={(e) => updateAssessmentData('painIntensity', parseInt(e.target.value))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-lg">
                    {level} - {locale === 'zh' 
                      ? level <= 3 ? '轻微疼痛' : level <= 6 ? '中度疼痛' : level <= 8 ? '严重疼痛' : '极度疼痛'
                      : level <= 3 ? 'Mild' : level <= 6 ? 'Moderate' : level <= 8 ? 'Severe' : 'Extreme'
                    }
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '日常影响评估' : 'Daily Impact Assessment'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh' 
                ? '经期疼痛对您的日常生活有多大影响？'
                : 'How much does menstrual pain affect your daily life?'
              }
            </p>
            <div className="space-y-4">
              {[
                { value: 'none', label: locale === 'zh' ? '没有影响' : 'No impact' },
                { value: 'mild', label: locale === 'zh' ? '轻微影响' : 'Mild impact' },
                { value: 'moderate', label: locale === 'zh' ? '中度影响' : 'Moderate impact' },
                { value: 'severe', label: locale === 'zh' ? '严重影响' : 'Severe impact' },
                { value: 'extreme', label: locale === 'zh' ? '极度影响' : 'Extreme impact' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dailyImpact"
                    value={option.value}
                    checked={assessmentData.dailyImpact === option.value}
                    onChange={(e) => updateAssessmentData('dailyImpact', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛时间模式' : 'Pain Timing Pattern'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh' 
                ? '疼痛通常在什么时候开始？'
                : 'When does the pain typically start?'
              }
            </p>
            <div className="space-y-4">
              {[
                { value: 'before', label: locale === 'zh' ? '经期前1-2天' : '1-2 days before period' },
                { value: 'start', label: locale === 'zh' ? '经期开始时' : 'At the start of period' },
                { value: 'during', label: locale === 'zh' ? '经期期间' : 'During period' },
                { value: 'after', label: locale === 'zh' ? '经期结束后' : 'After period ends' },
                { value: 'irregular', label: locale === 'zh' ? '不规律' : 'Irregular pattern' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="painTiming"
                    value={option.value}
                    checked={assessmentData.painTiming === option.value}
                    onChange={(e) => updateAssessmentData('painTiming', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛持续时间' : 'Pain Duration'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh' 
                ? '疼痛通常持续多长时间？'
                : 'How long does the pain typically last?'
              }
            </p>
            <div className="space-y-4">
              {[
                { value: 'few-hours', label: locale === 'zh' ? '几小时' : 'A few hours' },
                { value: '1-day', label: locale === 'zh' ? '1天' : '1 day' },
                { value: '2-3-days', label: locale === 'zh' ? '2-3天' : '2-3 days' },
                { value: '4-5-days', label: locale === 'zh' ? '4-5天' : '4-5 days' },
                { value: 'longer', label: locale === 'zh' ? '更长' : 'Longer' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="painDuration"
                    value={option.value}
                    checked={assessmentData.painDuration === option.value}
                    onChange={(e) => updateAssessmentData('painDuration', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛特征' : 'Pain Characteristics'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh' 
                ? '请选择所有符合您疼痛特征的选项：'
                : 'Please select all options that describe your pain:'
              }
            </p>
            <div className="space-y-4">
              {[
                { value: 'cramping', label: locale === 'zh' ? '痉挛性疼痛' : 'Cramping' },
                { value: 'sharp', label: locale === 'zh' ? '尖锐疼痛' : 'Sharp pain' },
                { value: 'dull', label: locale === 'zh' ? '钝痛' : 'Dull ache' },
                { value: 'throbbing', label: locale === 'zh' ? '搏动性疼痛' : 'Throbbing' },
                { value: 'burning', label: locale === 'zh' ? '烧灼感' : 'Burning sensation' },
                { value: 'pressure', label: locale === 'zh' ? '压迫感' : 'Pressure' }
              ].map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assessmentData.painCharacteristics.includes(option.value)}
                    onChange={(e) => {
                      const newCharacteristics = e.target.checked
                        ? [...assessmentData.painCharacteristics, option.value]
                        : assessmentData.painCharacteristics.filter(c => c !== option.value);
                      updateAssessmentData('painCharacteristics', newCharacteristics);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {locale === 'zh' ? '个人信息' : 'Personal Information'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '年龄组' : 'Age Group'}
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'teen', label: locale === 'zh' ? '青少年 (13-19岁)' : 'Teen (13-19)' },
                    { value: 'young-adult', label: locale === 'zh' ? '青年 (20-29岁)' : 'Young Adult (20-29)' },
                    { value: 'adult', label: locale === 'zh' ? '成年 (30-39岁)' : 'Adult (30-39)' },
                    { value: 'mature', label: locale === 'zh' ? '成熟期 (40+岁)' : 'Mature (40+)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="ageGroup"
                        value={option.value}
                        checked={assessmentData.ageGroup === option.value}
                        onChange={(e) => updateAssessmentData('ageGroup', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-lg">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '月经周期规律性' : 'Menstrual Cycle Regularity'}
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'regular', label: locale === 'zh' ? '非常规律' : 'Very regular' },
                    { value: 'mostly-regular', label: locale === 'zh' ? '基本规律' : 'Mostly regular' },
                    { value: 'irregular', label: locale === 'zh' ? '不规律' : 'Irregular' },
                    { value: 'very-irregular', label: locale === 'zh' ? '非常不规律' : 'Very irregular' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="cycleRegularity"
                        value={option.value}
                        checked={assessmentData.cycleRegularity === option.value}
                        onChange={(e) => updateAssessmentData('cycleRegularity', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-lg">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getResults = () => {
    const { painIntensity, dailyImpact, painTiming, painDuration, painCharacteristics, ageGroup, cycleRegularity } = assessmentData;
    
    let riskLevel = 'low';
    let recommendations: string[] = [];
    
    if (painIntensity >= 8 || dailyImpact === 'extreme') {
      riskLevel = 'high';
      recommendations = locale === 'zh' 
        ? ['建议立即咨询妇科医生', '考虑进行详细检查', '记录详细症状日记']
        : ['Consider immediate consultation with a gynecologist', 'Consider detailed medical examination', 'Keep detailed symptom diary'];
    } else if (painIntensity >= 6 || dailyImpact === 'severe') {
      riskLevel = 'moderate';
      recommendations = locale === 'zh'
        ? ['建议咨询医生', '尝试热敷和轻度运动', '考虑非处方止痛药']
        : ['Consider consulting a doctor', 'Try heat therapy and light exercise', 'Consider over-the-counter pain relief'];
    } else {
      riskLevel = 'low';
      recommendations = locale === 'zh'
        ? ['保持良好的生活习惯', '尝试放松技巧', '记录症状变化']
        : ['Maintain good lifestyle habits', 'Try relaxation techniques', 'Monitor symptom changes'];
    }

    return { riskLevel, recommendations };
  };

  if (showResults) {
    const { riskLevel, recommendations } = getResults();
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {locale === 'zh' ? '评估结果' : 'Assessment Results'}
          </h2>
          
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
              riskLevel === 'high' ? 'bg-red-100 text-red-800' :
              riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {riskLevel === 'high' ? (locale === 'zh' ? '高风险' : 'High Risk') :
               riskLevel === 'moderate' ? (locale === 'zh' ? '中等风险' : 'Moderate Risk') :
               (locale === 'zh' ? '低风险' : 'Low Risk')}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {locale === 'zh' ? '建议措施' : 'Recommendations'}
              </h3>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
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
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={resetAssessment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {locale === 'zh' ? '重新评估' : 'Retake Assessment'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {locale === 'zh' ? '经期健康评估' : 'Menstrual Health Assessment'}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {locale === 'zh' 
              ? '通过科学评估了解您的经期健康状况，获取个性化建议'
              : 'Understand your menstrual health through scientific assessment and get personalized recommendations'
            }
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-center text-sm text-gray-500">
            {locale === 'zh' 
              ? `步骤 ${currentStep} / ${totalSteps}`
              : `Step ${currentStep} / ${totalSteps}`
            }
          </p>
        </div>

        <div className="min-h-[400px]">
          {getStepContent()}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {locale === 'zh' ? '上一步' : 'Previous'}
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === totalSteps 
              ? (locale === 'zh' ? '查看结果' : 'View Results')
              : (locale === 'zh' ? '下一步' : 'Next')
            }
          </button>
        </div>
      </div>
    </div>
  );
}
