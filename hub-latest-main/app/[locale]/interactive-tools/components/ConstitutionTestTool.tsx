'use client';

import React, { useState } from 'react';
import { useInteractiveToolTranslations } from '../shared/hooks/useAppTranslations';
import {
  Play,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Heart,
  Leaf,
  Clock,
  MapPin,
  Utensils,
  Activity,
  AlertCircle,
  Lightbulb,
  BookOpen,
  FileText,
  MessageCircle,
  Copy,
  Users,
  Package
} from 'lucide-react';
import { useConstitutionTest } from '../shared/hooks/useConstitutionTest';
import { useNotifications } from '../shared/hooks/useNotifications';
import NotificationContainer from '../shared/components/NotificationContainer';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import { ConstitutionAnswer, ConstitutionType } from '../shared/types/constitution';
import { constitutionTypeInfo } from '../shared/data/constitutionTypes';
import {
  menstrualPainAcupoints,
  menstrualPainLifestyleTips,
  getRecommendedArticles,
  communicationTemplates,
  scenarioBasedAdvice,
  emergencyKitRecommendations
} from '../shared/data/menstrualPainRecommendations';

interface ConstitutionTestToolProps {
  locale: string;
}

export default function ConstitutionTestTool({ locale }: ConstitutionTestToolProps) {
  const { t } = useInteractiveToolTranslations('constitutionTest');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});

  const {
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isComplete,
    result,
    isLoading,
    error,
    startTest,
    answerQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeTest,
    resetTest
  } = useConstitutionTest();

  const {
    notifications,
    removeNotification,
    addSuccessNotification,
    addErrorNotification
  } = useNotifications();

  const handleStartTest = () => {
    startTest(locale);
    setSelectedAnswers({});
  };

  // 处理单选答案
  const handleAnswerSelect = (questionId: string, value: string | number) => {
    const stringValue = String(value);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: stringValue
    }));

    const answer: ConstitutionAnswer = {
      questionId,
      selectedValues: [stringValue],
      timestamp: new Date().toISOString()
    };

    answerQuestion(answer);
  };

  // 处理多选答案
  const handleMultipleAnswerSelect = (questionId: string, value: string) => {
    const currentValues = Array.isArray(selectedAnswers[questionId])
      ? selectedAnswers[questionId] as string[]
      : selectedAnswers[questionId]
        ? [selectedAnswers[questionId] as string]
        : [];

    let newValues: string[];

    // 处理"以上都没有"选项的逻辑
    const isNoneOption = value === 'none';
    const hasNoneSelected = currentValues.includes('none');

    if (isNoneOption) {
      // 如果选择"以上都没有"，清除其他所有选择
      newValues = currentValues.includes('none') ? [] : ['none'];
    } else {
      // 如果选择其他选项，先移除"以上都没有"选项
      const filteredValues = currentValues.filter(v => v !== 'none');
      newValues = filteredValues.includes(value)
        ? filteredValues.filter(v => v !== value)
        : [...filteredValues, value];
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: newValues
    }));

    const answer: ConstitutionAnswer = {
      questionId,
      selectedValues: newValues,
      timestamp: new Date().toISOString()
    };

    answerQuestion(answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      // 完成测试
      const testResult = completeTest();
      if (testResult) {
        addSuccessNotification(
          t('messages.testComplete'),
          t('messages.testCompleteDesc')
        );
      } else {
        addErrorNotification(
          t('messages.testFailed'),
          t('messages.testFailedDesc')
        );
      }
    } else {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  const getCurrentAnswer = () => {
    return currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  };

  // 渐变滑块样式工具
  const getRangeStyle = (value: number, min: number, max: number) => {
    const safeMin = Number(min ?? 0);
    const safeMax = Number(max ?? 10);
    const val = Number(value ?? safeMin);
    const percent = safeMax > safeMin ? ((val - safeMin) / (safeMax - safeMin)) * 100 : 0;
    return {
      backgroundImage:
        'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444), linear-gradient(90deg, #e5e7eb 0 0)',
      backgroundSize: `${percent}% 100%, 100% 100%`,
      backgroundRepeat: 'no-repeat'
    } as React.CSSProperties;
  };

  const canProceed = () => {
    if (!currentQuestion) return false;

    const answer = getCurrentAnswer();

    // 对于多选题，检查是否有选择（可以为空数组，因为有些多选题不是必填的）
    if (currentQuestion.type === 'multiple') {
      return true; // 多选题允许不选择任何选项
    }

    // 对于单选题和滑块题，必须有选择
    return answer !== undefined && answer !== null && answer !== '';
  };

  // 检查是否有痛经症状
  const hasMenstrualPainSymptoms = (answers: ConstitutionAnswer[]): boolean => {
    return answers.some(answer =>
      answer.questionId === 'menstrual_pain_severity' &&
      answer.selectedValues.some(value => value !== 'no_pain')
    );
  };

  // 获取痛经穴位建议
  const getMenstrualPainAcupoints = (constitutionType: ConstitutionType, locale: string): any[] => {
    const localeData = (menstrualPainAcupoints as any)[locale] || menstrualPainAcupoints.zh;
    return localeData[constitutionType] || [];
  };

  // 获取痛经生活方式建议
  const getMenstrualPainLifestyleTips = (constitutionType: ConstitutionType, locale: string): any[] => {
    const localeData = (menstrualPainLifestyleTips as any)[locale] || menstrualPainLifestyleTips.zh;
    return localeData[constitutionType] || [];
  };

  // 如果没有开始测试，显示介绍页面
  if (!currentSession) {
    return (
      <div className="max-w-4xl mx-auto">
        <NotificationContainer 
          notifications={notifications}
          onRemove={removeNotification}
        />
        
        {/* 介绍页面 - 紫色主题 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 测试特点 - 紫色主题卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {t('features.quick.title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('features.quick.description')}
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {t('features.professional.title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('features.professional.description')}
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {t('features.personalized.title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('features.personalized.description')}
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {t('features.practical.title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('features.practical.description')}
            </p>
          </div>
        </div>

        {/* 测试说明 - 紫色主题 */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {t('instructions.title')}
          </h3>
          <ul className="text-purple-700 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {t('instructions.item1')}
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {t('instructions.item2')}
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {t('instructions.item3')}
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {t('instructions.item4')}
            </li>
          </ul>
        </div>

        {/* 开始按钮 - 紫色渐变 */}
        <div className="text-center">
          <button
            onClick={handleStartTest}
            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
          >
            <Play className="w-6 h-6 mr-3 flex-shrink-0" />
            <span>{t('navigation.startTest')}</span>
          </button>
        </div>
      </div>
    );
  }

  // 如果测试完成，显示结果
  if (result) {
    const typeInfo = constitutionTypeInfo[locale]?.[result.primaryType] || constitutionTypeInfo.zh[result.primaryType];
    
    return (
      <div className="max-w-6xl mx-auto">
        <NotificationContainer 
          notifications={notifications}
          onRemove={removeNotification}
        />
        
        {/* 结果标题 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            {t('result.title')}
          </h2>
          <p className="text-lg text-neutral-600">
            {t('result.subtitle')}
          </p>
        </div>

        {/* 体质类型结果 */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {typeInfo.name}
            </h2>
            <p className="text-lg text-neutral-700 mb-4">
              {typeInfo.description}
            </p>
            <div className="inline-flex items-center bg-white px-4 py-2 rounded-full">
              <span className="text-sm text-neutral-600 mr-2">
                {t('result.match')}
              </span>
              <span className="font-semibold text-green-600">{result.confidence}%</span>
            </div>
          </div>

          {/* 体质特征 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                {t('result.constitutionFeatures')}
              </h3>
              <ul className="space-y-1">
                {typeInfo.characteristics.map((char, index) => (
                  <li key={index} className="text-sm text-neutral-700">• {char}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                {t('result.commonSymptoms')}
              </h3>
              <ul className="space-y-1">
                {typeInfo.commonSymptoms.map((symptom, index) => (
                  <li key={index} className="text-sm text-neutral-700">• {symptom}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                {t('result.menstrualFeatures')}
              </h3>
              <ul className="space-y-1">
                {typeInfo.menstrualFeatures.map((feature, index) => (
                  <li key={index} className="text-sm text-neutral-700">• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 个性化建议 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* 穴位建议 */}
          <div className="card">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-green-600" />
              {t('recommendations.acupoints.title')}
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-neutral-700 mb-3">
                {t('recommendations.acupoints.primaryAcupoints')}
              </h4>
              <div className="space-y-3">
                {result.recommendations.acupoints.primaryPoints.map((point, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-medium text-green-800">{point.name}</h5>
                    <p className="text-sm text-green-700 mb-1">
                      {t('recommendations.acupoints.location')}{point.location}
                    </p>
                    <p className="text-sm text-green-700 mb-1">
                      {t('recommendations.acupoints.function')}{point.function}
                    </p>
                    <p className="text-sm text-green-600">
                      {t('recommendations.acupoints.method')}{point.method}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-medium text-neutral-700 mb-2">
                {t('recommendations.acupoints.guidelines')}
              </h4>
              <p className="text-sm text-neutral-600 mb-1">
                <strong>{t('recommendations.acupoints.technique')}</strong>
                {result.recommendations.acupoints.massageTechnique}
              </p>
              <p className="text-sm text-neutral-600 mb-1">
                <strong>{t('recommendations.acupoints.frequency')}</strong>
                {result.recommendations.acupoints.frequency}
              </p>
              <p className="text-sm text-neutral-600">
                <strong>{t('recommendations.acupoints.duration')}</strong>
                {result.recommendations.acupoints.duration}
              </p>
            </div>
          </div>

          {/* 饮食建议 */}
          <div className="card">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <Utensils className="w-6 h-6 mr-2 text-orange-600" />
              {t('recommendations.dietary.title')}
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">
                  {t('recommendations.dietary.beneficialFoods')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.diet.beneficial.map((food, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-red-700 mb-2">
                  {t('recommendations.dietary.foodsToAvoid')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.diet.avoid.map((food, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-neutral-700 mb-2">
                  {t('recommendations.dietary.dietaryPrinciples')}
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.diet.principles.map((principle, index) => (
                    <li key={index} className="text-sm text-neutral-600">• {principle}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 场景化生活建议 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl mb-8">
          <h3 className="text-2xl font-semibold text-emerald-800 mb-6 flex items-center">
            <MapPin className="w-7 h-7 mr-3 text-green-600" />
            {t('recommendations.lifestyle.title')}
          </h3>

          <p className="text-emerald-700 mb-6">
            {t('recommendations.lifestyle.description')}
          </p>

          <div className="grid lg:grid-cols-3 gap-6">
            {scenarioBasedAdvice[locale]?.[result.primaryType]?.map((scenario, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
                <h4 className="font-semibold text-emerald-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">{scenario.icon}</span>
                  {scenario.scenario}
                </h4>

                <ul className="space-y-3">
                  {scenario.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-emerald-700 flex items-start">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )) || []}
          </div>

          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{t('recommendations.lifestyle.reminder')}</strong>
              {t('recommendations.lifestyle.reminderText')}
            </p>
          </div>
        </div>

        {/* 痛经专项建议 */}
        {hasMenstrualPainSymptoms(currentSession?.answers || []) && (
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center">
              <Heart className="w-7 h-7 mr-3 text-pink-600" />
              {t('recommendations.menstrualPain.title')}
            </h3>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 基于体质的痛经建议 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-purple-700 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('recommendations.menstrualPain.acupointTherapy')}
                </h4>
                {getMenstrualPainAcupoints(result.primaryType, locale).map((point: any, index: number) => (
                  <div key={index} className="mb-3 p-3 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800">{point.name}</h5>
                    <p className="text-sm text-purple-700">{point.description}</p>
                  </div>
                ))}
              </div>

              {/* 生活方式建议 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-purple-700 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {t('recommendations.menstrualPain.lifestyleAdjustments')}
                </h4>
                <ul className="space-y-2">
                  {getMenstrualPainLifestyleTips(result.primaryType, locale).map((tip: any, index: number) => (
                    <li key={index} className="text-sm text-purple-700 flex items-start">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 个性化应急包推荐 */}
        {hasMenstrualPainSymptoms(currentSession?.answers || []) && (
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-orange-800 mb-6 flex items-center">
              <Package className="w-7 h-7 mr-3 text-orange-600" />
              {t('emergencyKit.title')}
            </h3>

            <p className="text-orange-700 mb-6">
              {t('emergencyKit.description')}
            </p>

            <div className="space-y-6">
              {emergencyKitRecommendations[locale]?.[result.primaryType]?.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                    {category.category}
                  </h4>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`p-4 rounded-lg border-2 ${
                        item.priority === 'high' ? 'border-red-200 bg-red-50' :
                        item.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-orange-800">{item.name}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.priority === 'high' ? 'bg-red-100 text-red-700' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.priority === 'high' ? t('emergencyKit.priority.high') :
                             item.priority === 'medium' ? t('emergencyKit.priority.medium') :
                             t('emergencyKit.priority.low')}
                          </span>
                        </div>

                        <p className="text-sm text-orange-600">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )) || []}
            </div>

            <div className="mt-6 p-4 bg-orange-100 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>{t('emergencyKit.packingTips')}</strong>
                {t('emergencyKit.packingAdvice')}
              </p>
            </div>
          </div>
        )}

        {/* 相关文章推荐 */}
        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <h3 className="text-2xl font-semibold text-neutral-800 mb-6 flex items-center">
            <BookOpen className="w-7 h-7 mr-3 text-blue-600" />
            {t('articles.title')}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecommendedArticles(result.primaryType, currentSession?.answers || [], locale).map((article, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-3">
                  {article.description}
                </p>
                <a
                  href={article.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {t('articles.readMore')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 社交沟通模板 */}
        {hasMenstrualPainSymptoms(currentSession?.answers || []) && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center">
              <MessageCircle className="w-7 h-7 mr-3 text-blue-600" />
              {t('communication.title')}
            </h3>

            <p className="text-indigo-700 mb-6">
              {t('communication.description')}
            </p>

            <div className="grid lg:grid-cols-3 gap-6">
              {communicationTemplates[locale]?.map((scenario, scenarioIndex) => (
                <div key={scenarioIndex} className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-indigo-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {scenario.scenario}
                  </h4>

                  <div className="space-y-4">
                    {scenario.templates.map((template, templateIndex) => (
                      <div key={templateIndex} className="border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-indigo-700">{template.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.tone === 'intimate' ? 'bg-pink-100 text-pink-700' :
                            template.tone === 'casual' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {template.tone === 'intimate' ? t('communication.styles.intimate') :
                             template.tone === 'casual' ? t('communication.styles.casual') :
                             t('communication.styles.formal')}
                          </span>
                        </div>

                        <p className="text-sm text-indigo-600 mb-3 leading-relaxed">
                          &ldquo;{template.content}&rdquo;
                        </p>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(template.content);
                            // 可以添加复制成功的提示
                          }}
                          className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {t('communication.copyText')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )) || []}
            </div>

            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{t('communication.usageTips')}</strong>
                {t('communication.usageAdvice')}
              </p>
            </div>
          </div>
        )}

        {/* 重新测试按钮 */}
        <div className="text-center">
          <button
            onClick={resetTest}
            className="btn-secondary"
          >
            {t('navigation.retakeTest')}
          </button>
        </div>
      </div>
    );
  }

  // 显示问题
  return (
    <div className="max-w-4xl mx-auto">
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      {isLoading && <LoadingSpinner />}
      
      {/* 进度条 - 紫色主题 */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-purple-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700 bg-purple-50 px-3 py-1 rounded-full">
            {locale === 'zh'
              ? `第 ${currentQuestionIndex + 1} 题，共 ${totalQuestions} 题`
              : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`
            }
          </span>
          <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            {Math.round(progress)}% {locale === 'zh' ? '完成' : 'Complete'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentQuestion && (
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8 animate-fade-in">
          {/* 问题标题 - 紫色主题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* 选项 */}
          <div className="mb-8">
            {currentQuestion.type === 'scale' ? (
              // 滑块类型问题
              <div className="space-y-6">
                <div className="px-4 pain-scale-container">
                  <input
                    type="range"
                    min={currentQuestion.validation?.min || 0}
                    max={currentQuestion.validation?.max || 10}
                    value={selectedAnswers[currentQuestion.id] || 0}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    className="w-full pain-scale cursor-pointer outline-none rounded-lg"
                    style={getRangeStyle(
                      Number(selectedAnswers[currentQuestion.id] || 0),
                      Number(currentQuestion.validation?.min || 0),
                      Number(currentQuestion.validation?.max || 10)
                    )}
                  />
                  <div className="flex justify-between text-sm text-neutral-600 mt-2">
                    <span className="text-xs sm:text-sm">{t('painScale.levels.none')}</span>
                    <span className="text-xs sm:text-sm">{t('painScale.levels.mild')}</span>
                    <span className="text-xs sm:text-sm">{t('painScale.levels.moderate')}</span>
                    <span className="text-xs sm:text-sm">{t('painScale.levels.severe')}</span>
                    <span className="text-xs sm:text-sm">{t('painScale.levels.extreme')}</span>
                  </div>
                </div>

                {/* 当前选择的值显示 - 增强紫色主题 */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-gradient-to-r from-purple-100 via-purple-50 to-pink-100 px-8 py-4 rounded-2xl shadow-lg border border-purple-200">
                    <Heart className="w-6 h-6 text-purple-600 mr-3" />
                    <span className="text-xl font-bold text-purple-800">
                      {t('painScale.title')}
                      <span className="text-3xl font-extrabold text-purple-600 mx-2">{selectedAnswers[currentQuestion.id] || 0}</span>
                      <span className="text-base font-medium text-purple-700 ml-2">
                        ({currentQuestion.options.find(opt => opt.value == (selectedAnswers[currentQuestion.id] || 0))?.label})
                      </span>
                    </span>
                  </div>
                </div>

                {/* 疼痛程度说明 - 紫色主题 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl overflow-hidden border border-purple-200 shadow-sm">
                  <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {t('painScale.reference')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-purple-700">
                    <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>0-2:</strong> {t('painScale.descriptions.0-2')}</span>
                    </div>
                    <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>3-4:</strong> {t('painScale.descriptions.3-4')}</span>
                    </div>
                    <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>5-7:</strong> {t('painScale.descriptions.5-7')}</span>
                    </div>
                    <div className="flex items-start break-words bg-white p-3 rounded-lg shadow-sm">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>8-10:</strong> {t('painScale.descriptions.8-10')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentQuestion.type === 'multiple' ? (
              // 多选问题 - 紫色主题
              <div className="space-y-4">
                {currentQuestion.options.map((option) => {
                  const currentValues = Array.isArray(selectedAnswers[currentQuestion.id])
                    ? selectedAnswers[currentQuestion.id] as string[]
                    : selectedAnswers[currentQuestion.id]
                      ? [selectedAnswers[currentQuestion.id] as string]
                      : [];
                  const isSelected = currentValues.includes(String(option.value));

                  return (
                    <label
                      key={option.value}
                      className={`block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMultipleAnswerSelect(currentQuestion.id, String(option.value))}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-gray-800 font-medium">{option.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              // 普通单选问题 - 紫色主题
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedAnswers[currentQuestion.id] === option.value
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.value}
                      checked={selectedAnswers[currentQuestion.id] === option.value}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === option.value
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-800 font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 导航按钮 - 紫色主题 */}
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('navigation.previous')}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
            >
              {currentQuestionIndex >= totalQuestions - 1
                ? t('navigation.completeTest')
                : t('navigation.next')
              }
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
