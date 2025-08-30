'use client';

import { useState } from 'react';

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

  const questions: Question[] = locale === 'zh' ? [
    {
      id: 'energy',
      question: '您平时的精力状态如何？',
      options: [
        { value: 'high', label: '精力充沛，很少感到疲劳', score: 3 },
        { value: 'medium', label: '精力一般，偶尔感到疲劳', score: 2 },
        { value: 'low', label: '经常感到疲劳，精力不足', score: 1 }
      ]
    },
    {
      id: 'cold_tolerance',
      question: '您对寒冷的耐受性如何？',
      options: [
        { value: 'good', label: '不怕冷，手脚温暖', score: 3 },
        { value: 'normal', label: '一般，季节变化时会感到冷', score: 2 },
        { value: 'poor', label: '很怕冷，手脚经常冰凉', score: 1 }
      ]
    },
    {
      id: 'digestion',
      question: '您的消化功能如何？',
      options: [
        { value: 'good', label: '消化良好，很少胃肠不适', score: 3 },
        { value: 'normal', label: '消化一般，偶有不适', score: 2 },
        { value: 'poor', label: '消化不良，经常胃肠不适', score: 1 }
      ]
    }
  ] : [
    {
      id: 'energy',
      question: 'How is your usual energy level?',
      options: [
        { value: 'high', label: 'Energetic, rarely feel tired', score: 3 },
        { value: 'medium', label: 'Average energy, occasionally tired', score: 2 },
        { value: 'low', label: 'Often tired, low energy', score: 1 }
      ]
    },
    {
      id: 'cold_tolerance',
      question: 'How is your tolerance to cold?',
      options: [
        { value: 'good', label: 'Not afraid of cold, warm hands and feet', score: 3 },
        { value: 'normal', label: 'Normal, feel cold during season changes', score: 2 },
        { value: 'poor', label: 'Very afraid of cold, hands and feet often cold', score: 1 }
      ]
    },
    {
      id: 'digestion',
      question: 'How is your digestive function?',
      options: [
        { value: 'good', label: 'Good digestion, rarely stomach discomfort', score: 3 },
        { value: 'normal', label: 'Average digestion, occasional discomfort', score: 2 },
        { value: 'poor', label: 'Poor digestion, frequent stomach discomfort', score: 1 }
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
      return locale === 'zh' 
        ? { type: '阳性体质', description: '体质较好，精力充沛，抗寒能力强' }
        : { type: 'Yang Constitution', description: 'Good constitution, energetic, strong cold resistance' };
    } else if (percentage >= 60) {
      return locale === 'zh'
        ? { type: '平和体质', description: '体质平衡，需要适当调理' }
        : { type: 'Balanced Constitution', description: 'Balanced constitution, needs moderate care' };
    } else {
      return locale === 'zh'
        ? { type: '阴性体质', description: '体质偏弱，需要温补调理' }
        : { type: 'Yin Constitution', description: 'Weak constitution, needs warming care' };
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
          {locale === 'zh' ? '测试结果' : 'Test Result'}
        </h3>
        <div className="mb-4">
          <div className="text-lg font-semibold text-green-600">{result.type}</div>
          <div className="text-gray-700 mt-2">{result.description}</div>
        </div>
        <button
          onClick={resetTest}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          {locale === 'zh' ? '重新测试' : 'Retake Test'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 rounded-xl p-6">
      <div className="mb-4">
        <div className="text-sm text-purple-600 mb-2">
          {locale === 'zh' ? `问题 ${currentQuestion + 1} / ${questions.length}` : `Question ${currentQuestion + 1} / ${questions.length}`}
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
