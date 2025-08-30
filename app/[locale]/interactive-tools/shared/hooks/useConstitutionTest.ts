'use client';

import { useState, useCallback } from 'react';
import { 
  ConstitutionQuestion, 
  ConstitutionAnswer, 
  ConstitutionSession, 
  ConstitutionResult,
  ConstitutionType 
} from '../types/constitution';
import { constitutionQuestions } from '../data/constitutionQuestions';
import { constitutionRecommendations } from '../data/constitutionRecommendations';
import { constitutionTypeInfo } from '../data/constitutionTypes';

interface UseConstitutionTestReturn {
  // Current session
  currentSession: ConstitutionSession | null;
  currentQuestionIndex: number;
  currentQuestion: ConstitutionQuestion | null;
  isComplete: boolean;
  
  // Progress
  progress: number;
  totalQuestions: number;
  
  // Actions
  startTest: (locale: string) => void;
  answerQuestion: (answer: ConstitutionAnswer) => void;
  goToQuestion: (index: number) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  completeTest: () => ConstitutionResult | null;
  resetTest: () => void;
  
  // Results
  result: ConstitutionResult | null;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export function useConstitutionTest(): UseConstitutionTestReturn {
  const [currentSession, setCurrentSession] = useState<ConstitutionSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<ConstitutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = currentSession ? constitutionQuestions[currentSession.locale] || constitutionQuestions.zh : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const isComplete = currentQuestionIndex >= questions.length;
  const progress = questions.length > 0 ? Math.min((currentQuestionIndex / questions.length) * 100, 100) : 0;

  const startTest = useCallback((locale: string) => {
    const sessionId = `constitution_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ConstitutionSession = {
      id: sessionId,
      answers: [],
      startedAt: new Date().toISOString(),
      locale
    };
    
    setCurrentSession(newSession);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
  }, []);

  const answerQuestion = useCallback((answer: ConstitutionAnswer) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return prev;
      
      const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === answer.questionId);
      const updatedAnswers = [...prev.answers];
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = answer;
      } else {
        updatedAnswers.push(answer);
      }
      
      return {
        ...prev,
        answers: updatedAnswers
      };
    });
  }, [currentSession]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const calculateConstitutionScores = useCallback((answers: ConstitutionAnswer[]): Record<ConstitutionType, number> => {
    const scores: Record<ConstitutionType, number> = {
      balanced: 0,
      qi_deficiency: 0,
      yang_deficiency: 0,
      yin_deficiency: 0,
      phlegm_dampness: 0,
      damp_heat: 0,
      blood_stasis: 0,
      qi_stagnation: 0,
      special_diathesis: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      answer.selectedValues.forEach(value => {
        const option = question.options.find(opt => opt.value === value);
        if (option) {
          scores[option.constitutionType] += option.weight * question.weight;
        }
      });
    });

    return scores;
  }, [questions]);

  const completeTest = useCallback((): ConstitutionResult | null => {
    if (!currentSession || currentSession.answers.length !== questions.length) {
      const isEnglish = currentSession?.locale === 'en';
      setError(isEnglish ? 'Test incomplete, please answer all questions' : '测试未完成，请回答所有问题');
      return null;
    }

    setIsLoading(true);
    
    try {
      const scores = calculateConstitutionScores(currentSession.answers);
      
      // 找出得分最高的体质类型
      const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
      const primaryType = sortedScores[0][0] as ConstitutionType;
      const secondaryType = sortedScores[1][1] > 0 ? sortedScores[1][0] as ConstitutionType : undefined;
      
      // 计算置信度
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
      const confidence = totalScore > 0 ? Math.round((scores[primaryType] / totalScore) * 100) : 0;
      
      const testResult: ConstitutionResult = {
        primaryType,
        secondaryType,
        scores,
        confidence,
        recommendations: constitutionRecommendations[currentSession.locale]?.[primaryType] || constitutionRecommendations.zh[primaryType],
        sessionId: currentSession.id,
        completedAt: new Date().toISOString()
      };

      // 更新session
      setCurrentSession(prev => prev ? {
        ...prev,
        completedAt: testResult.completedAt
      } : null);

      setResult(testResult);
      setError(null);
      
      return testResult;
    } catch (err) {
      const isEnglish = currentSession?.locale === 'en';
      setError(isEnglish ? 'Error calculating results, please try again' : '计算结果时出错，请重试');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, questions.length, calculateConstitutionScores]);

  const resetTest = useCallback(() => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    currentSession,
    currentQuestionIndex,
    currentQuestion,
    isComplete,
    progress,
    totalQuestions: questions.length,
    startTest,
    answerQuestion,
    goToQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeTest,
    resetTest,
    result,
    isLoading,
    error
  };
}
