'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type Locale = 'en' | 'zh';

interface Props {
  params: { locale: Locale };
}

export default function PainTrackerPage({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');
  const [painLevel, setPainLevel] = useState(5);
  const [painLocation, setPainLocation] = useState('');
  const [painType, setPainType] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<null | {
    level: number;
    location: string;
    type: string;
    timestamp: string;
    recommendations: string[];
  }>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setResult(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setResult({
      level: painLevel,
      location: painLocation,
      type: painType,
      timestamp: new Date().toLocaleString(),
      recommendations: getRecommendations(painLevel, painLocation, painType)
    });
  };

  const getRecommendations = (level: number, location: string, type: string): string[] => {
    const recommendations: string[] = [];
    
    if (level >= 7) {
      recommendations.push(locale === 'zh' ? '建议咨询医生' : 'Consider consulting a doctor');
    }
    
    if (level >= 5) {
      recommendations.push(locale === 'zh' ? '尝试热敷疗法' : 'Try heat therapy');
      recommendations.push(locale === 'zh' ? '考虑非处方止痛药' : 'Consider over-the-counter pain relief');
    }
    
    if (level >= 3) {
      recommendations.push(locale === 'zh' ? '进行轻度运动' : 'Try light exercise');
      recommendations.push(locale === 'zh' ? '保持充足休息' : 'Get adequate rest');
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {locale === 'zh' ? '疼痛追踪工具' : 'Pain Tracking Tool'}
            </h1>
            <p className="text-gray-600">
              {locale === 'zh' 
                ? '记录您的疼痛情况，获取个性化建议'
                : 'Record your pain levels and get personalized recommendations'
              }
            </p>
          </div>

          {!isRecording && !result && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '疼痛强度 (1-10)' : 'Pain Level (1-10)'}
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
                  <span className="text-xl font-bold text-purple-600 w-8 text-center">
                    {painLevel}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '疼痛位置' : 'Pain Location'}
                </label>
                <select
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">
                    {locale === 'zh' ? '选择疼痛位置' : 'Select pain location'}
                  </option>
                  <option value="lower-abdomen">
                    {locale === 'zh' ? '下腹部' : 'Lower abdomen'}
                  </option>
                  <option value="back">
                    {locale === 'zh' ? '背部' : 'Back'}
                  </option>
                  <option value="thighs">
                    {locale === 'zh' ? '大腿' : 'Thighs'}
                  </option>
                  <option value="other">
                    {locale === 'zh' ? '其他' : 'Other'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {locale === 'zh' ? '疼痛类型' : 'Pain Type'}
                </label>
                <select
                  value={painType}
                  onChange={(e) => setPainType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">
                    {locale === 'zh' ? '选择疼痛类型' : 'Select pain type'}
                  </option>
                  <option value="cramping">
                    {locale === 'zh' ? '痉挛性疼痛' : 'Cramping'}
                  </option>
                  <option value="sharp">
                    {locale === 'zh' ? '尖锐疼痛' : 'Sharp pain'}
                  </option>
                  <option value="dull">
                    {locale === 'zh' ? '钝痛' : 'Dull ache'}
                  </option>
                  <option value="throbbing">
                    {locale === 'zh' ? '搏动性疼痛' : 'Throbbing'}
                  </option>
                </select>
              </div>

              <button
                onClick={handleStartRecording}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {locale === 'zh' ? '开始记录' : 'Start Recording'}
              </button>
            </div>
          )}

          {isRecording && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {locale === 'zh' ? '正在记录...' : 'Recording...'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'zh' ? '当前疼痛强度' : 'Current pain level'}: {painLevel}
                </p>
              </div>
              
              <button
                onClick={handleStopRecording}
                className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {locale === 'zh' ? '停止记录' : 'Stop Recording'}
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {locale === 'zh' ? '记录完成' : 'Recording Complete'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'zh' ? '记录时间' : 'Recorded at'}: {result.timestamp}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'zh' ? '记录详情' : 'Record Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      {locale === 'zh' ? '疼痛强度' : 'Pain Level'}
                    </span>
                    <p className="text-xl font-bold text-purple-600">{result.level}/10</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {locale === 'zh' ? '位置' : 'Location'}
                    </span>
                    <p className="text-lg font-medium text-gray-800">{result.location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {locale === 'zh' ? '类型' : 'Type'}
                    </span>
                    <p className="text-lg font-medium text-gray-800">{result.type}</p>
                  </div>
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

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setPainLevel(5);
                    setPainLocation('');
                    setPainType('');
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {locale === 'zh' ? '重新记录' : 'Record Again'}
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