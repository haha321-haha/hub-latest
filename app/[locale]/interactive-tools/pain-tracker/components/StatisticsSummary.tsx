'use client';

// StatisticsSummary - Component for displaying key analytics statistics in card format
// Shows summary cards with key metrics and visual indicators

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { PainAnalytics } from '../../../../../types/pain-tracker';

interface StatisticsSummaryProps {
  analytics: PainAnalytics;
  locale: string;
  className?: string;
}

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export default function StatisticsSummary({ 
  analytics, 
  locale, 
  className = '' 
}: StatisticsSummaryProps) {
  const t = useTranslations('painTracker.statistics');

  // Generate statistics cards
  const generateStatCards = (): StatCard[] => {
    const cards: StatCard[] = [];

    // Total Records
    cards.push({
      id: 'total-records',
      title: t('totalRecords'),
      value: analytics.totalRecords,
      subtitle: t('recordsSubtitle'),
      icon: Calendar,
      color: 'blue'
    });

    // Average Pain Level
    const avgPainColor = 
      analytics.averagePainLevel >= 7 ? 'red' :
      analytics.averagePainLevel >= 5 ? 'yellow' :
      analytics.averagePainLevel >= 3 ? 'blue' : 'green';

    cards.push({
      id: 'average-pain',
      title: t('averagePain'),
      value: `${analytics.averagePainLevel.toFixed(1)}/10`,
      subtitle: getPainLevelDescription(analytics.averagePainLevel),
      icon: Activity,
      color: avgPainColor,
      trend: getPainTrend(analytics.trendData),
      trendValue: getTrendValue(analytics.trendData)
    });

    // Most Common Pain Type
    if (analytics.commonPainTypes.length > 0) {
      const mostCommon = analytics.commonPainTypes[0];
      cards.push({
        id: 'common-pain-type',
        title: t('commonPainType'),
        value: formatPainType(mostCommon.type),
        subtitle: `${mostCommon.percentage.toFixed(1)}% ${t('ofRecords')}`,
        icon: Target,
        color: 'purple'
      });
    }

    // Most Effective Treatment
    if (analytics.effectiveTreatments.length > 0) {
      const mostEffective = analytics.effectiveTreatments[0];
      cards.push({
        id: 'effective-treatment',
        title: t('effectiveTreatment'),
        value: mostEffective.treatment,
        subtitle: `${mostEffective.successRate.toFixed(1)}% ${t('successRate')}`,
        icon: Award,
        color: 'green'
      });
    }

    // Cycle Pattern Insight
    if (analytics.cyclePatterns.length > 0) {
      const highestPainPhase = analytics.cyclePatterns.reduce((prev, current) => 
        prev.averagePainLevel > current.averagePainLevel ? prev : current
      );
      
      cards.push({
        id: 'cycle-pattern',
        title: t('highestPainPhase'),
        value: formatMenstrualStatus(highestPainPhase.phase),
        subtitle: `${t('averagePain')}: ${highestPainPhase.averagePainLevel.toFixed(1)}/10`,
        icon: AlertCircle,
        color: 'red'
      });
    }

    // Data Quality Score
    const dataQualityScore = calculateDataQualityScore(analytics);
    cards.push({
      id: 'data-quality',
      title: t('dataQuality'),
      value: `${dataQualityScore}%`,
      subtitle: getDataQualityDescription(dataQualityScore),
      icon: TrendingUp,
      color: dataQualityScore >= 80 ? 'green' : dataQualityScore >= 60 ? 'yellow' : 'red'
    });

    return cards;
  };

  // Helper functions
  function getPainLevelDescription(level: number): string {
    if (level >= 8) return t('painLevels.severe');
    if (level >= 6) return t('painLevels.high');
    if (level >= 4) return t('painLevels.moderate');
    if (level >= 2) return t('painLevels.mild');
    return t('painLevels.minimal');
  }

  function getPainTrend(trendData: any[]): 'up' | 'down' | 'stable' {
    if (trendData.length < 5) return 'stable';
    
    const recent = trendData.slice(-5);
    const older = trendData.slice(-10, -5);
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, point) => sum + point.painLevel, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + point.painLevel, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'up';
    if (difference < -0.5) return 'down';
    return 'stable';
  }

  function getTrendValue(trendData: any[]): string {
    if (trendData.length < 5) return '';
    
    const recent = trendData.slice(-5);
    const older = trendData.slice(-10, -5);
    
    if (older.length === 0) return '';
    
    const recentAvg = recent.reduce((sum, point) => sum + point.painLevel, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + point.painLevel, 0) / older.length;
    
    const difference = Math.abs(recentAvg - olderAvg);
    
    return difference > 0.1 ? `${difference.toFixed(1)}` : '';
  }

  function formatPainType(type: string): string {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function formatMenstrualStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'before_period': t('menstrualPhases.beforePeriod'),
      'day_1': t('menstrualPhases.day1'),
      'day_2_3': t('menstrualPhases.day23'),
      'day_4_plus': t('menstrualPhases.day4Plus'),
      'after_period': t('menstrualPhases.afterPeriod'),
      'mid_cycle': t('menstrualPhases.midCycle'),
      'irregular': t('menstrualPhases.irregular')
    };
    return statusMap[status] || status;
  }

  function calculateDataQualityScore(analytics: PainAnalytics): number {
    let score = 0;
    let maxScore = 0;

    // Records count (0-25 points)
    maxScore += 25;
    if (analytics.totalRecords >= 30) score += 25;
    else if (analytics.totalRecords >= 20) score += 20;
    else if (analytics.totalRecords >= 10) score += 15;
    else if (analytics.totalRecords >= 5) score += 10;
    else score += 5;

    // Pain type diversity (0-20 points)
    maxScore += 20;
    const painTypeCount = analytics.commonPainTypes.length;
    if (painTypeCount >= 4) score += 20;
    else if (painTypeCount >= 3) score += 15;
    else if (painTypeCount >= 2) score += 10;
    else if (painTypeCount >= 1) score += 5;

    // Treatment tracking (0-20 points)
    maxScore += 20;
    const treatmentCount = analytics.effectiveTreatments.length;
    if (treatmentCount >= 3) score += 20;
    else if (treatmentCount >= 2) score += 15;
    else if (treatmentCount >= 1) score += 10;

    // Cycle pattern data (0-20 points)
    maxScore += 20;
    const cyclePatternCount = analytics.cyclePatterns.length;
    if (cyclePatternCount >= 5) score += 20;
    else if (cyclePatternCount >= 4) score += 15;
    else if (cyclePatternCount >= 3) score += 10;
    else if (cyclePatternCount >= 2) score += 5;

    // Trend data consistency (0-15 points)
    maxScore += 15;
    const trendDataCount = analytics.trendData.length;
    if (trendDataCount >= 20) score += 15;
    else if (trendDataCount >= 15) score += 12;
    else if (trendDataCount >= 10) score += 8;
    else if (trendDataCount >= 5) score += 5;

    return Math.round((score / maxScore) * 100);
  }

  function getDataQualityDescription(score: number): string {
    if (score >= 90) return t('dataQualityLevels.excellent');
    if (score >= 80) return t('dataQualityLevels.good');
    if (score >= 70) return t('dataQualityLevels.fair');
    if (score >= 60) return t('dataQualityLevels.poor');
    return t('dataQualityLevels.insufficient');
  }

  const statCards = generateStatCards();

  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-r from-green-100 to-green-200',
      icon: 'text-green-600',
      text: 'text-green-900',
      border: 'border-green-200'
    },
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
      border: 'border-yellow-200'
    },
    red: {
      bg: 'bg-gradient-to-r from-red-100 to-red-200',
      icon: 'text-red-600',
      text: 'text-red-900',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-100 to-purple-200',
      icon: 'text-purple-600',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    indigo: {
      bg: 'bg-gradient-to-r from-indigo-100 to-indigo-200',
      icon: 'text-indigo-600',
      text: 'text-indigo-900',
      border: 'border-indigo-200'
    }
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('summaryTitle')}
        </h3>
        <p className="text-gray-600">
          {t('summaryDescription')}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color];
          
          return (
            <div
              key={card.id}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${colors.icon}`} />
                {card.trend && (
                  <div className="flex items-center space-x-1">
                    {card.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    )}
                    {card.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    {card.trend === 'stable' && (
                      <Minus className="w-4 h-4 text-gray-500" />
                    )}
                    {card.trendValue && (
                      <span className="text-xs text-gray-600">
                        {card.trendValue}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h4 className={`text-sm font-medium ${colors.text} mb-1`}>
                {card.title}
              </h4>

              {/* Value */}
              <p className={`text-2xl sm:text-3xl font-bold ${colors.text} mb-2`}>
                {card.value}
              </p>

              {/* Subtitle */}
              {card.subtitle && (
                <p className={`text-xs ${colors.text} opacity-75`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Date Range Info */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t('dateRange')}:</span>
          <span>
            {analytics.dateRange.start.toLocaleDateString(locale)} - {' '}
            {analytics.dateRange.end.toLocaleDateString(locale)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
          <span>{t('trackingPeriod')}:</span>
          <span>
            {Math.ceil(
              (analytics.dateRange.end.getTime() - analytics.dateRange.start.getTime()) / 
              (1000 * 60 * 60 * 24)
            )} {t('days')}
          </span>
        </div>
      </div>
    </div>
  );
}