'use client';

import React, { useState } from 'react';
import { useSymptomAssessment } from '../[locale]/interactive-tools/shared/hooks/useSymptomAssessment';
import { AssessmentAnswer } from '../[locale]/interactive-tools/shared/types';

export default function TestSymptomAssessment() {
  const {
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    result,
    startAssessment,
    answerQuestion,
    goToNextQuestion,
    completeAssessment
  } = useSymptomAssessment();

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleStart = () => {
    startAssessment('zh');
  };

  const handleAnswer = (value: any) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    const answer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      value,
      timestamp: new Date().toISOString()
    };
    
    answerQuestion(answer);
  };

  const handleNext = () => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      console.log('Completing assessment...');
      const result = completeAssessment();
      console.log('Result:', result);
    } else {
      goToNextQuestion();
    }
  };

  const handleQuickComplete = () => {
    // 快速填写所有答案进行测试
    if (!currentSession) {
      handleStart();
      return;
    }

    // 模拟回答所有问题
    const mockAnswers = [
      { questionId: 'age_range', value: '18-25' },
      { questionId: 'cycle_regularity', value: 'mostly_regular' },
      { questionId: 'pain_severity', value: 7 },
      { questionId: 'pain_duration', value: 'one_day' },
      { questionId: 'pain_location', value: ['lower_abdomen', 'lower_back'] },
      { questionId: 'pain_impact', value: 'moderate_impact' },
      { questionId: 'accompanying_symptoms', value: ['headache', 'fatigue'] },
      { questionId: 'exercise_frequency', value: 'weekly' },
      { questionId: 'stress_level', value: 6 },
      { questionId: 'sleep_quality', value: 'fair' },
      { questionId: 'previous_treatment', value: ['otc_painkillers', 'heat_therapy'] },
      { questionId: 'medical_conditions', value: ['none'] }
    ];

    // 添加所有答案
    mockAnswers.forEach(answer => {
      answerQuestion({
        ...answer,
        timestamp: new Date().toISOString()
      });
    });

    // 完成评估
    setTimeout(() => {
      console.log('Quick completing assessment...');
      const result = completeAssessment();
      console.log('Quick completion result:', result);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">症状评估测试页面</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">状态信息</h2>
        <p>当前会话: {currentSession ? '已开始' : '未开始'}</p>
        <p>当前题目: {currentQuestionIndex + 1} / {totalQuestions}</p>
        <p>当前问题ID: {currentQuestion?.id || '无'}</p>
        <p>是否有结果: {result ? '是' : '否'}</p>
      </div>

      <div className="space-y-4">
        {!currentSession && (
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            开始评估
          </button>
        )}

        {currentSession && !result && (
          <div className="space-y-4">
            <button
              onClick={handleQuickComplete}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              快速完成评估（测试用）
            </button>

            {currentQuestion && (
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">{currentQuestion.title}</h3>
                
                {currentQuestion.type === 'single' && currentQuestion.options && (
                  <div className="space-y-2">
                    {currentQuestion.options.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option.value}
                          checked={answers[currentQuestion.id] === option.value}
                          onChange={(e) => handleAnswer(e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'scale' && (
                  <div>
                    <input
                      type="range"
                      min={currentQuestion.validation?.min || 1}
                      max={currentQuestion.validation?.max || 10}
                      value={answers[currentQuestion.id] || 1}
                      onChange={(e) => handleAnswer(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p>当前值: {answers[currentQuestion.id] || 1}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {currentQuestionIndex >= totalQuestions - 1 ? '完成评估' : '下一题'}
                </button>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="border p-4 rounded bg-green-50">
            <h3 className="font-semibold mb-2">评估结果</h3>
            <p>评分: {result.score} / {result.maxScore} ({Math.round(result.percentage)}%)</p>
            <p>严重程度: {result.severity}</p>
            <p>类型: {result.type}</p>
            <p>消息: {result.message}</p>
            <p>建议数量: {result.recommendations.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
