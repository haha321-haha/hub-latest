'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ConstitutionTestToolProps {
  locale?: string;
}

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

export default function ConstitutionTestTool({ locale = 'zh' }: ConstitutionTestToolProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const t = useTranslations('constitutionTest');

  const questions: Question[] = [
    {
      id: 'energy',
      question: t('questions.energy.question'),
      options: [
        { value: 'high', label: t('questions.energy.options.high'), score: 3 },
        { value: 'medium', label: t('questions.energy.options.medium'), score: 2 },
        { value: 'low', label: t('questions.energy.options.low'), score: 1 }
      ]
    },
    {
      id: 'cold_tolerance',
      question: t('questions.coldTolerance.question'),
      options: [
        { value: 'good', label: t('questions.coldTolerance.options.good'), score: 3 },
        { value: 'normal', label: t('questions.coldTolerance.options.normal'), score: 2 },
        { value: 'poor', label: t('questions.coldTolerance.options.poor'), score: 1 }
      ]
    },
    {
      id: 'digestion',
      question: t('questions.digestion.question'),
      options: [
        { value: 'good', label: t('questions.digestion.options.good'), score: 3 },
        { value: 'normal', label: t('questions.digestion.options.normal'), score: 2 },
        { value: 'poor', label: t('questions.digestion.options.poor'), score: 1 }
      ]
    }
  ];

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 80) {
      return { type: t('results.yang.type'), description: t('results.yang.description') };
    } else if (percentage >= 60) {
      return { type: t('results.balanced.type'), description: t('results.balanced.description') };
    } else {
      return { type: t('results.yin.type'), description: t('results.yin.description') };
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const result = getResult();
    return (
      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-green-700 mb-4">
          {t('testResult')}
        </h3>
        <div className="mb-4">
          <div className="text-lg font-semibold text-green-600">{result.type}</div>
          <div className="text-gray-700 mt-2">{result.description}</div>
        </div>
        <button
          onClick={resetTest}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          {t('retakeTest')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 rounded-xl p-6">
      <div className="mb-4">
        <div className="text-sm text-purple-600 mb-2">
          {t('progress', { current: currentQuestion + 1, total: questions.length })}
        </div>
        <div className="w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-purple-700 mb-4">
        {questions[currentQuestion].question}
      </h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.score)}
            className="w-full text-left p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
