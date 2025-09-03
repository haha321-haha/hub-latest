'use client';

// PatternInsights - Component for displaying automated pattern analysis and recommendations
// Shows AI-generated insights based on pain tracking data patterns

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from 'lucide-react';
import { 
  PainRecord, 
  PainAnalytics, 
  Pattern, 
  PainTrackerError 
} from '../../../../../types/pain-tracker';
import { AnalyticsEngine } from '../../../../../lib/pain-tracker/analytics/AnalyticsEngine';

interface PatternInsightsProps {
  analytics: PainAnalytics;
  records: PainRecord[];
  locale: string;
  onError?: (error: Error) => void;
}

interface InsightCard {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  recommendations: string[];
  confidence?: number;
  isExpanded?: boolean;
}

export default function PatternInsights({ 
  analytics, 
  records, 
  locale,
  onError 
}: PatternInsightsProps) {
  const t = useTranslations('painTracker.insights');
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Initialize analytics engine
  const analyticsEngine = useMemo(() => new AnalyticsEngine(), []);

  // Generate patterns and insights
  useEffect(() => {
    const generateInsights = async () => {
      if (!records || records.length < 3) {
        setInsights([]);
        setPatterns([]);
        return;
      }

      setIsLoading(true);

      try {
        // Identify patterns
        const identifiedPatterns = analyticsEngine.identifyPatterns(records);
        setPatterns(identifiedPatterns);

        // Convert analytics insights and patterns to insight cards
        const insightCards: InsightCard[] = [];

        // Add general insights from analytics
        analytics.insights.forEach((insight, index) => {
          insightCards.push({
            id: `general-${index}`,
            type: getInsightType(insight),
            icon: getInsightIcon(insight),
            title: getInsightTitle(insight),
            description: insight,
            recommendations: getGeneralRecommendations(insight),
            isExpanded: false
          });
        });

        // Add pattern-based insights
        identifiedPatterns.forEach((pattern, index) => {
          insightCards.push({
            id: `pattern-${index}`,
            type: getPatternType(pattern),
            icon: getPatternIcon(pattern.type),
            title: getPatternTitle(pattern.type),
            description: pattern.description,
            recommendations: pattern.recommendations,
            confidence: pattern.confidence,
            isExpanded: false
          });
        });

        // Add data-driven recommendations
        const dataRecommendations = generateDataRecommendations(analytics, records);
        dataRecommendations.forEach((rec, index) => {
          insightCards.push({
            id: `recommendation-${index}`,
            type: 'info',
            icon: Lightbulb,
            title: rec.title,
            description: rec.description,
            recommendations: rec.actions,
            isExpanded: false
          });
        });

        setInsights(insightCards);
      } catch (error) {
        const errorMessage = error instanceof PainTrackerError 
          ? error.message 
          : 'Failed to generate insights';
        
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    generateInsights();
  }, [analytics, records, analyticsEngine, onError]);

  // Toggle card expansion
  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  // Helper functions
  function getInsightType(insight: string): 'success' | 'warning' | 'info' | 'danger' {
    if (insight.includes('high') || insight.includes('concerning') || insight.includes('worsening')) {
      return 'danger';
    }
    if (insight.includes('low') || insight.includes('improving') || insight.includes('working well')) {
      return 'success';
    }
    if (insight.includes('consider') || insight.includes('may help')) {
      return 'warning';
    }
    return 'info';
  }

  function getInsightIcon(insight: string) {
    if (insight.includes('trend')) return TrendingUp;
    if (insight.includes('treatment') || insight.includes('medication')) return Pill;
    if (insight.includes('cycle') || insight.includes('phase')) return Calendar;
    if (insight.includes('high') || insight.includes('concerning')) return AlertTriangle;
    if (insight.includes('working well') || insight.includes('effective')) return CheckCircle;
    return Info;
  }

  function getInsightTitle(insight: string): string {
    if (insight.includes('average pain level')) return t('titles.painLevel');
    if (insight.includes('most common pain type')) return t('titles.painType');
    if (insight.includes('effectiveness')) return t('titles.treatment');
    if (insight.includes('trend')) return t('titles.trend');
    if (insight.includes('cycle') || insight.includes('phase')) return t('titles.cycle');
    return t('titles.general');
  }

  function getPatternType(pattern: Pattern): 'success' | 'warning' | 'info' | 'danger' {
    if (pattern.confidence > 0.8) return 'success';
    if (pattern.confidence > 0.6) return 'info';
    if (pattern.confidence > 0.4) return 'warning';
    return 'danger';
  }

  function getPatternIcon(patternType: string) {
    switch (patternType) {
      case 'menstrual_cycle': return Calendar;
      case 'treatment_response': return Pill;
      case 'seasonal_pattern': return TrendingUp;
      case 'trigger_identification': return AlertTriangle;
      default: return Brain;
    }
  }

  function getPatternTitle(patternType: string): string {
    switch (patternType) {
      case 'menstrual_cycle': return t('patterns.menstrual');
      case 'treatment_response': return t('patterns.treatment');
      case 'seasonal_pattern': return t('patterns.seasonal');
      case 'trigger_identification': return t('patterns.triggers');
      default: return t('patterns.general');
    }
  }

  function getGeneralRecommendations(insight: string): string[] {
    const recommendations: string[] = [];
    
    if (insight.includes('high')) {
      recommendations.push(t('recommendations.consultDoctor'));
      recommendations.push(t('recommendations.trackTriggers'));
    }
    if (insight.includes('effective')) {
      recommendations.push(t('recommendations.continueApproach'));
      recommendations.push(t('recommendations.noteEffective'));
    }
    if (insight.includes('trend')) {
      recommendations.push(t('recommendations.monitorTrend'));
      recommendations.push(t('recommendations.shareWithDoctor'));
    }
    
    return recommendations.length > 0 ? recommendations : [t('recommendations.keepTracking')];
  }

  function generateDataRecommendations(analytics: PainAnalytics, records: PainRecord[]) {
    const recommendations: Array<{
      title: string;
      description: string;
      actions: string[];
    }> = [];

    // Tracking consistency recommendation
    const daysBetweenRecords = calculateAverageGapBetweenRecords(records);
    if (daysBetweenRecords > 7) {
      recommendations.push({
        title: t('dataRecommendations.consistency.title'),
        description: t('dataRecommendations.consistency.description', { days: Math.round(daysBetweenRecords) }),
        actions: [
          t('dataRecommendations.consistency.actions.setReminders'),
          t('dataRecommendations.consistency.actions.trackDaily'),
          t('dataRecommendations.consistency.actions.useApp')
        ]
      });
    }

    // Treatment tracking recommendation
    const recordsWithTreatments = records.filter(r => r.medications.length > 0);
    if (recordsWithTreatments.length < records.length * 0.5) {
      recommendations.push({
        title: t('dataRecommendations.treatments.title'),
        description: t('dataRecommendations.treatments.description'),
        actions: [
          t('dataRecommendations.treatments.actions.recordAll'),
          t('dataRecommendations.treatments.actions.trackEffectiveness'),
          t('dataRecommendations.treatments.actions.noteTimings')
        ]
      });
    }

    // Symptom tracking recommendation
    const recordsWithSymptoms = records.filter(r => r.symptoms.length > 0);
    if (recordsWithSymptoms.length < records.length * 0.7) {
      recommendations.push({
        title: t('dataRecommendations.symptoms.title'),
        description: t('dataRecommendations.symptoms.description'),
        actions: [
          t('dataRecommendations.symptoms.actions.trackAll'),
          t('dataRecommendations.symptoms.actions.notePatterns'),
          t('dataRecommendations.symptoms.actions.correlateWithPain')
        ]
      });
    }

    return recommendations;
  }

  function calculateAverageGapBetweenRecords(records: PainRecord[]): number {
    if (records.length < 2) return 0;

    const sortedRecords = records.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let totalGap = 0;
    for (let i = 1; i < sortedRecords.length; i++) {
      const gap = new Date(sortedRecords[i].date).getTime() - 
                   new Date(sortedRecords[i - 1].date).getTime();
      totalGap += gap;
    }

    return totalGap / (sortedRecords.length - 1) / (1000 * 60 * 60 * 24); // Convert to days
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('empty.title')}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {t('empty.description')}
        </p>
      </div>
    );
  }

  // Render insights
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('title')}
        </h3>
        <p className="text-gray-600">
          {t('subtitle', { count: insights.length })}
        </p>
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const isExpanded = expandedCards.has(insight.id);
          const Icon = insight.icon;
          
          const cardColors = {
            success: 'bg-green-50 border-green-200 text-green-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800',
            danger: 'bg-red-50 border-red-200 text-red-800'
          };

          const iconColors = {
            success: 'text-green-600',
            warning: 'text-yellow-600',
            info: 'text-blue-600',
            danger: 'text-red-600'
          };

          return (
            <div
              key={insight.id}
              className={`border rounded-lg p-6 transition-all duration-200 ${cardColors[insight.type]}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-6 h-6 ${iconColors[insight.type]}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {insight.title}
                    </h4>
                    {insight.confidence && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600 mr-2">
                          {t('confidence')}:
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              insight.confidence > 0.8 ? 'bg-green-500' :
                              insight.confidence > 0.6 ? 'bg-blue-500' :
                              insight.confidence > 0.4 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${insight.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 ml-2">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleCard(insight.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isExpanded ? t('collapse') : t('expand')}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">
                {insight.description}
              </p>

              {/* Recommendations (expandable) */}
              {isExpanded && insight.recommendations.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    {t('recommendationsTitle')}
                  </h5>
                  <ul className="space-y-2">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick preview of recommendations when collapsed */}
              {!isExpanded && insight.recommendations.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{t('recommendations')}:</span>
                  <span className="ml-1">
                    {insight.recommendations.length} {t('suggestionsAvailable')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h4 className="font-medium text-gray-900 mb-4">
          {t('summary.title')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {patterns.length}
            </div>
            <div className="text-sm text-gray-600">
              {t('summary.patternsFound')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {insights.filter(i => i.type === 'success').length}
            </div>
            <div className="text-sm text-gray-600">
              {t('summary.positiveInsights')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {insights.reduce((sum, i) => sum + i.recommendations.length, 0)}
            </div>
            <div className="text-sm text-gray-600">
              {t('summary.totalRecommendations')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}