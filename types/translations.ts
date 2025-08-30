/**
 * 翻译系统类型定义
 * 确保翻译键的类型安全
 */

export interface Messages {
  site: {
    name: string;
    title: string;
    description: string;
  };
  
  navigation: {
    home: string;
    articles: string;
    therapies: string;
    instantRelief: string;
    naturalTherapies: string;
    culturalCharms: string;
    scenarioSolutions: string;
    downloads: string;
    interactiveTools: string;
    symptomAssessment: string;
    painTracker: string;
    healthGuide: string;
  };

  painTracker: {
    assessment: {
      title: string;
      subtitle: string;
      start: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        startButton: string;
        disclaimer: string;
      };
      progress: {
        questionOf: string;
      };
      navigation: {
        previous: string;
        next: string;
        skip: string;
        finish: string;
      };
      result: {
        title: string;
        yourScore: string;
        severity: string;
        riskLevel: string;
        summary: string;
        recommendations: string;
        timeframe: string;
        actionSteps: string;
        retakeAssessment: string;
        saveResults: string;
        nextSteps: {
          trackSymptoms: string;
          tryRecommendations: string;
          consultDoctor: string;
        };
      };
      severity: {
        mild: string;
        moderate: string;
        severe: string;
        emergency: string;
      };
      priority: {
        high: string;
        medium: string;
        low: string;
      };
      messages: {
        assessmentComplete: string;
        assessmentCompleteDesc: string;
        assessmentFailed: string;
        assessmentFailedDesc: string;
        resultsSaved: string;
        resultsSavedDesc: string;
      };
      resultMessages: {
        emergency: string;
        emergencySummary: string;
        severe: string;
        severeSummary: string;
        moderate: string;
        moderateSummary: string;
        mild: string;
        mildSummary: string;
      };
      recommendations: {
        emergencyMedical: {
          title: string;
          description: string;
          timeframe: string;
          actionSteps: string[];
        };
        painManagement: {
          title: string;
          description: string;
          timeframe: string;
          actionSteps: string[];
        };
        lifestyleChanges: {
          title: string;
          description: string;
          timeframe: string;
          actionSteps: string[];
        };
        selfcarePractices: {
          title: string;
          description: string;
          timeframe: string;
          actionSteps: string[];
        };
      };
    };
  };
}

// 翻译键路径类型
export type TranslationKey = 
  | 'site.name'
  | 'site.title'
  | 'site.description'
  | 'navigation.home'
  | 'navigation.articles'
  | 'painTracker.assessment.title'
  | 'painTracker.assessment.result.title'
  | 'painTracker.assessment.resultMessages.mild'
  // ... 更多键路径

// 翻译函数类型
export type TranslationFunction = (key: TranslationKey, params?: Record<string, any>) => string;

// 翻译Hook返回类型
export interface UseTranslationsReturn {
  t: TranslationFunction;
  locale: string;
  isZh: boolean;
  isEn: boolean;
}
