'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Question, 
  AssessmentAnswer, 
  AssessmentSession, 
  AssessmentResult,
  Recommendation 
} from '../types';
import { assessmentQuestions } from '../data/assessmentQuestions';
import { saveToStorage, loadFromStorage, createStorageKey } from '../utils';

interface UseSymptomAssessmentReturn {
  // Current session
  currentSession: AssessmentSession | null;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  isComplete: boolean;

  // Progress
  progress: number;
  totalQuestions: number;

  // Actions
  startAssessment: (locale: string) => void;
  answerQuestion: (answer: AssessmentAnswer) => void;
  goToQuestion: (index: number) => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  completeAssessment: (t?: any) => AssessmentResult | null;
  resetAssessment: () => void;

  // Results
  result: AssessmentResult | null;

  // State
  isLoading: boolean;
  error: string | null;
}

export const useSymptomAssessment = (userId?: string): UseSymptomAssessmentReturn => {
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = createStorageKey(userId || 'anonymous', 'assessment_session');

  // Load saved session on mount
  useEffect(() => {
    const savedSession = loadFromStorage<AssessmentSession>(storageKey);
    if (savedSession && !savedSession.completedAt) {
      setCurrentSession(savedSession);
      setCurrentQuestionIndex(savedSession.answers.length);
    }
  }, [storageKey]);

  // Save session whenever it changes
  useEffect(() => {
    if (currentSession) {
      saveToStorage(storageKey, currentSession);
    }
  }, [currentSession, storageKey]);

  const questions = currentSession ? assessmentQuestions[currentSession.locale] || assessmentQuestions.en : [];
  const currentQuestion = questions[currentQuestionIndex] || null;
  const isComplete = currentQuestionIndex >= questions.length;
  const progress = questions.length > 0 ? Math.min((currentQuestionIndex / questions.length) * 100, 100) : 0;

  const startAssessment = useCallback((locale: string) => {
    const sessionId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: AssessmentSession = {
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

  const answerQuestion = useCallback((answer: AssessmentAnswer) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return prev;
      
      // Remove any existing answer for this question
      const filteredAnswers = prev.answers.filter(a => a.questionId !== answer.questionId);
      
      // Add the new answer
      const updatedAnswers = [...filteredAnswers, answer];
      
      return {
        ...prev,
        answers: updatedAnswers
      };
    });
  }, [currentSession]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index <= questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const calculateScore = useCallback((answers: AssessmentAnswer[], questions: Question[]): number => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return;

      maxPossibleScore += question.weight * 10; // Assuming max weight per question is 10

      if (question.type === 'scale') {
        totalScore += (answer.value as number) * question.weight;
      } else if (question.type === 'single') {
        const option = question.options?.find(opt => opt.value === answer.value);
        if (option && option.weight !== undefined) {
          totalScore += option.weight * question.weight;
        }
      } else if (question.type === 'multiple') {
        const selectedValues = answer.value as string[];
        selectedValues.forEach(value => {
          const option = question.options?.find(opt => opt.value === value);
          if (option && option.weight !== undefined) {
            totalScore += option.weight * question.weight;
          }
        });
      }
    });

    return Math.min(totalScore, maxPossibleScore);
  }, []);

  const generateRecommendations = useCallback((score: number, percentage: number, answers: AssessmentAnswer[], t?: any, locale?: string): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const isEnglish = locale === 'en';

    // Emergency recommendations
    if (percentage >= 80) {
      const titleRaw = t ? t('recommendations.emergencyMedical.title') : (isEnglish ? 'Seek Immediate Medical Care' : '建议立即就医');
      const descriptionRaw = t ? t('recommendations.emergencyMedical.description') : (isEnglish ? 'Your symptoms may require professional medical evaluation and treatment' : '您的症状可能需要专业医疗评估和治疗');
      const timeframeRaw = t ? t('recommendations.emergencyMedical.timeframe') : (isEnglish ? 'Immediately' : '立即');
      const actionStepsRaw = t ? t('recommendations.emergencyMedical.actionSteps') : (isEnglish ? [
        'Contact your gynecologist',
        'If pain is severe, consider emergency care',
        'Keep a detailed symptom diary'
      ] : [
        '联系您的妇科医生',
        '如果疼痛剧烈，考虑急诊就医',
        '记录详细的症状日志'
      ]);

      // Use fallback if translation returns the key itself (indicating translation failed)
      const title = (titleRaw && !titleRaw.includes('recommendations.')) ? titleRaw : (isEnglish ? 'Seek Immediate Medical Care' : '建议立即就医');
      const description = (descriptionRaw && !descriptionRaw.includes('recommendations.')) ? descriptionRaw : (isEnglish ? 'Your symptoms may require professional medical evaluation and treatment' : '您的症状可能需要专业医疗评估和治疗');
      const timeframe = (timeframeRaw && !timeframeRaw.includes('recommendations.')) ? timeframeRaw : (isEnglish ? 'Immediately' : '立即');
      const actionSteps = (Array.isArray(actionStepsRaw) && actionStepsRaw.length > 0 && !actionStepsRaw[0]?.includes?.('recommendations.'))
        ? actionStepsRaw
        : (isEnglish ? [
            'Contact your gynecologist',
            'If pain is severe, consider emergency care',
            'Keep a detailed symptom diary'
          ] : [
            '联系您的妇科医生',
            '如果疼痛剧烈，考虑急诊就医',
            '记录详细的症状日志'
          ]);



      recommendations.push({
        id: 'emergency_medical',
        category: 'medical',
        title: title,
        description: description,
        priority: 'high',
        timeframe: timeframe,
        actionSteps: Array.isArray(actionSteps) ? actionSteps : [actionSteps]
      });
    }

    // Pain management recommendations
    if (percentage >= 40) {
      const titleRaw = t ? t('recommendations.painManagement.title') : (isEnglish ? 'Pain Management Strategies' : '疼痛管理策略');
      const descriptionRaw = t ? t('recommendations.painManagement.description') : (isEnglish ? 'Multiple methods can help relieve menstrual pain' : '多种方法可以帮助缓解经期疼痛');
      const timeframeRaw = t ? t('recommendations.painManagement.timeframe') : (isEnglish ? 'Immediately available' : '立即可用');
      const actionStepsRaw = t ? t('recommendations.painManagement.actionSteps') : (isEnglish ? [
        'Use heating pads or hot water bottles',
        'Try light exercise like walking',
        'Consider over-the-counter pain relievers (follow instructions)'
      ] : [
        '使用热敷垫或热水袋',
        '尝试轻度运动如散步',
        '考虑非处方止痛药（按说明使用）'
      ]);

      // Use fallback if translation returns the key itself
      const title = (titleRaw && !titleRaw.includes('recommendations.')) ? titleRaw : (isEnglish ? 'Pain Management Strategies' : '疼痛管理策略');
      const description = (descriptionRaw && !descriptionRaw.includes('recommendations.')) ? descriptionRaw : (isEnglish ? 'Multiple methods can help relieve menstrual pain' : '多种方法可以帮助缓解经期疼痛');
      const timeframe = (timeframeRaw && !timeframeRaw.includes('recommendations.')) ? timeframeRaw : (isEnglish ? 'Immediately available' : '立即可用');
      const actionSteps = (Array.isArray(actionStepsRaw) && actionStepsRaw.length > 0 && !actionStepsRaw[0]?.includes?.('recommendations.'))
        ? actionStepsRaw
        : (isEnglish ? [
            'Use heating pads or hot water bottles',
            'Try light exercise like walking',
            'Consider over-the-counter pain relievers (follow instructions)'
          ] : [
            '使用热敷垫或热水袋',
            '尝试轻度运动如散步',
            '考虑非处方止痛药（按说明使用）'
          ]);



      recommendations.push({
        id: 'pain_management',
        category: 'immediate',
        title: title,
        description: description,
        priority: 'high',
        timeframe: timeframe,
        actionSteps: Array.isArray(actionSteps) ? actionSteps : [actionSteps]
      });
    }

    // Lifestyle recommendations
    const lifestyleTitleRaw = t ? t('recommendations.lifestyleChanges.title') : (isEnglish ? 'Lifestyle Adjustments' : '生活方式调整');
    const lifestyleDescriptionRaw = t ? t('recommendations.lifestyleChanges.description') : (isEnglish ? 'Long-term lifestyle changes can significantly improve symptoms' : '长期的生活方式改变可以显著改善症状');
    const lifestyleTimeframeRaw = t ? t('recommendations.lifestyleChanges.timeframe') : (isEnglish ? '2-3 months to see effects' : '2-3个月见效');
    const lifestyleActionStepsRaw = t ? t('recommendations.lifestyleChanges.actionSteps') : (isEnglish ? [
      'Maintain regular exercise habits',
      'Ensure adequate sleep',
      'Learn stress management techniques',
      'Maintain a balanced diet'
    ] : [
      '保持规律的运动习惯',
      '确保充足的睡眠',
      '学习压力管理技巧',
      '保持均衡饮食'
    ]);

    // Use fallback if translation returns the key itself
    const lifestyleTitle = (lifestyleTitleRaw && !lifestyleTitleRaw.includes('recommendations.')) ? lifestyleTitleRaw : (isEnglish ? 'Lifestyle Adjustments' : '生活方式调整');
    const lifestyleDescription = (lifestyleDescriptionRaw && !lifestyleDescriptionRaw.includes('recommendations.')) ? lifestyleDescriptionRaw : (isEnglish ? 'Long-term lifestyle changes can significantly improve symptoms' : '长期的生活方式改变可以显著改善症状');
    const lifestyleTimeframe = (lifestyleTimeframeRaw && !lifestyleTimeframeRaw.includes('recommendations.')) ? lifestyleTimeframeRaw : (isEnglish ? '2-3 months to see effects' : '2-3个月见效');
    const lifestyleActionSteps = (Array.isArray(lifestyleActionStepsRaw) && lifestyleActionStepsRaw.length > 0 && !lifestyleActionStepsRaw[0]?.includes?.('recommendations.'))
      ? lifestyleActionStepsRaw
      : (isEnglish ? [
          'Maintain regular exercise habits',
          'Ensure adequate sleep',
          'Learn stress management techniques',
          'Maintain a balanced diet'
        ] : [
          '保持规律的运动习惯',
          '确保充足的睡眠',
          '学习压力管理技巧',
          '保持均衡饮食'
        ]);



    recommendations.push({
      id: 'lifestyle_changes',
      category: 'lifestyle',
      title: lifestyleTitle,
      description: lifestyleDescription,
      priority: 'medium',
      timeframe: lifestyleTimeframe,
      actionSteps: Array.isArray(lifestyleActionSteps) ? lifestyleActionSteps : [lifestyleActionSteps]
    });

    // Self-care recommendations
    const selfcareTitleRaw = t ? t('recommendations.selfcarePractices.title') : (isEnglish ? 'Self-Care Practices' : '自我护理实践');
    const selfcareDescriptionRaw = t ? t('recommendations.selfcarePractices.description') : (isEnglish ? 'Daily self-care can help you better manage symptoms' : '日常的自我护理可以帮助您更好地管理症状');
    const selfcareTimeframeRaw = t ? t('recommendations.selfcarePractices.timeframe') : (isEnglish ? 'Ongoing' : '持续进行');
    const selfcareActionStepsRaw = t ? t('recommendations.selfcarePractices.actionSteps') : (isEnglish ? [
      'Practice deep breathing and meditation',
      'Use pain tracker to record symptoms',
      'Build a support network',
      'Learn relaxation techniques'
    ] : [
      '练习深呼吸和冥想',
      '使用疼痛追踪器记录症状',
      '建立支持网络',
      '学习放松技巧'
    ]);

    // Use fallback if translation returns the key itself
    const selfcareTitle = (selfcareTitleRaw && !selfcareTitleRaw.includes('recommendations.')) ? selfcareTitleRaw : (isEnglish ? 'Self-Care Practices' : '自我护理实践');
    const selfcareDescription = (selfcareDescriptionRaw && !selfcareDescriptionRaw.includes('recommendations.')) ? selfcareDescriptionRaw : (isEnglish ? 'Daily self-care can help you better manage symptoms' : '日常的自我护理可以帮助您更好地管理症状');
    const selfcareTimeframe = (selfcareTimeframeRaw && !selfcareTimeframeRaw.includes('recommendations.')) ? selfcareTimeframeRaw : (isEnglish ? 'Ongoing' : '持续进行');
    const selfcareActionSteps = (Array.isArray(selfcareActionStepsRaw) && selfcareActionStepsRaw.length > 0 && !selfcareActionStepsRaw[0]?.includes?.('recommendations.'))
      ? selfcareActionStepsRaw
      : (isEnglish ? [
          'Practice deep breathing and meditation',
          'Use pain tracker to record symptoms',
          'Build a support network',
          'Learn relaxation techniques'
        ] : [
          '练习深呼吸和冥想',
          '使用疼痛追踪器记录症状',
          '建立支持网络',
          '学习放松技巧'
        ]);



    recommendations.push({
      id: 'selfcare_practices',
      category: 'selfcare',
      title: selfcareTitle,
      description: selfcareDescription,
      priority: 'medium',
      timeframe: selfcareTimeframe,
      actionSteps: Array.isArray(selfcareActionSteps) ? selfcareActionSteps : [selfcareActionSteps]
    });

    return recommendations;
  }, []);

  const completeAssessment = useCallback((t?: any, currentLocale?: string): AssessmentResult | null => {
    console.log('completeAssessment called:', {
      currentSession: !!currentSession,
      answersCount: currentSession?.answers.length,
      questionsCount: questions.length,
      currentLocale
    });

    if (!currentSession) {
      console.error('No current session');
      return null;
    }

    setIsLoading(true);

    try {
      const score = calculateScore(currentSession.answers, questions);
      const maxScore = questions.reduce((sum, q) => sum + (q.weight * 10), 0);
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      // Use the current locale parameter if provided, otherwise fall back to session locale
      const effectiveLocale = currentLocale || currentSession.locale;
      const isEnglish = effectiveLocale === 'en';

      console.log('Assessment calculation:', {
        score,
        maxScore,
        percentage,
        answersCount: currentSession.answers.length,
        locale: currentSession.locale
      });

      let severity: 'mild' | 'moderate' | 'severe' | 'emergency';
      let type: 'normal' | 'mild' | 'moderate' | 'severe' | 'emergency';
      let message: string;
      let summary: string;

      if (percentage >= 80) {
        severity = 'emergency';
        type = 'emergency';
        message = t ? t('resultMessages.emergency') : (isEnglish ? 'Your symptoms are quite severe. We recommend consulting a healthcare professional as soon as possible.' : '您的症状较为严重，建议尽快咨询医疗专业人士。');
        summary = t ? t('resultMessages.emergencySummary') : (isEnglish ? 'Assessment indicates you may need professional medical attention.' : '评估显示您可能需要专业医疗关注。');
      } else if (percentage >= 60) {
        severity = 'severe';
        type = 'severe';
        message = t ? t('resultMessages.severe') : (isEnglish ? 'Your symptoms are quite serious. We recommend adopting comprehensive management strategies.' : '您的症状比较严重，建议采取综合管理策略。');
        summary = t ? t('resultMessages.severeSummary') : (isEnglish ? 'Your symptoms require active management and possible medical intervention.' : '您的症状需要积极的管理和可能的医疗干预。');
      } else if (percentage >= 40) {
        severity = 'moderate';
        type = 'moderate';
        message = t ? t('resultMessages.moderate') : (isEnglish ? 'You have moderate symptoms that can be managed through various methods.' : '您有中等程度的症状，可以通过多种方法进行管理。');
        summary = t ? t('resultMessages.moderateSummary') : (isEnglish ? 'Your symptoms are manageable with recommended relief strategies.' : '您的症状是可以管理的，建议采用多种缓解策略。');
      } else {
        severity = 'mild';
        type = 'mild';
        message = t ? t('resultMessages.mild') : (isEnglish ? 'Your symptoms are relatively mild and can be well managed through simple self-care.' : '您的症状相对较轻，通过简单的自我护理就能很好地管理。');
        summary = t ? t('resultMessages.mildSummary') : (isEnglish ? 'Your symptoms are mild and can be improved through lifestyle adjustments.' : '您的症状较轻，可以通过生活方式调整来改善。');
      }

      const recommendations = generateRecommendations(score, percentage, currentSession.answers, t, effectiveLocale);

      const assessmentResult: AssessmentResult = {
        sessionId: currentSession.id,
        type,
        severity,
        score,
        maxScore,
        percentage,
        recommendations,
        emergency: percentage >= 80,
        message,
        summary,
        relatedArticles: [
          '/articles/menstrual-pain-management',
          '/articles/lifestyle-tips-for-period-health',
          '/articles/when-to-see-a-doctor'
        ],
        nextSteps: t ? [
          t('result.nextSteps.trackSymptoms') || (isEnglish ? 'Use pain tracker to record symptoms' : '使用疼痛追踪器记录症状'),
          t('result.nextSteps.tryRecommendations') || (isEnglish ? 'Try recommended relief methods' : '尝试推荐的缓解方法'),
          t('result.nextSteps.consultDoctor') || (isEnglish ? 'Consult a doctor if symptoms persist or worsen' : '如果症状持续或恶化，请咨询医生')
        ] : (isEnglish ? [
          'Use pain tracker to record symptoms',
          'Try recommended relief methods',
          'Consult a doctor if symptoms persist or worsen'
        ] : [
          '使用疼痛追踪器记录症状',
          '尝试推荐的缓解方法',
          '如果症状持续或恶化，请咨询医生'
        ]),
        createdAt: new Date().toISOString()
      };

      // Update session with completion time and result
      const completedSession = {
        ...currentSession,
        result: assessmentResult,
        completedAt: new Date().toISOString()
      };

      console.log('Setting completed session and result:', {
        completedSession,
        assessmentResult
      });

      setCurrentSession(completedSession);
      setResult(assessmentResult);

      console.log('Result state should be updated');

      return assessmentResult;
    } catch (err) {
      console.error('Failed to complete assessment:', err);
      const effectiveLocale = currentLocale || currentSession?.locale;
      const isEnglish = effectiveLocale === 'en';
      setError(t ? t('messages.assessmentFailed') : (isEnglish ? 'An error occurred while completing the assessment. Please try again.' : '评估完成时出现错误，请重试。'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, calculateScore, generateRecommendations, questions]);

  const resetAssessment = useCallback(() => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
    // Clear saved session
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    // Current session
    currentSession,
    currentQuestionIndex,
    currentQuestion,
    isComplete,
    
    // Progress
    progress,
    totalQuestions: questions.length,
    
    // Actions
    startAssessment,
    answerQuestion,
    goToQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    completeAssessment,
    resetAssessment,
    
    // Results
    result,
    
    // State
    isLoading,
    error
  };
};
