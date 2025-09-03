'use client';

// AnalyticsDemo - Demo component to showcase analytics functionality
// Provides a simple interface to test analytics engine and chart components

import React, { useState, useEffect } from 'react';
import { AnalyticsEngine } from '../AnalyticsEngine';
import { PainTrendChart } from './PainTrendChart';
import { PainDistributionChart } from './PainDistributionChart';
import { PainTypeChart } from './PainTypeChart';
import { CyclePatternChart } from './CyclePatternChart';
import { PainRecord, PainAnalytics, PainType, MenstrualStatus, Symptom } from '../../../../types/pain-tracker';

// Sample data for demonstration
const sampleRecords: PainRecord[] = [
  {
    id: '1',
    date: '2024-01-01',
    time: '10:00',
    painLevel: 8,
    painTypes: ['cramping', 'aching'] as PainType[],
    locations: ['lower_abdomen'],
    symptoms: ['nausea', 'fatigue'] as Symptom[],
    menstrualStatus: 'day_1' as MenstrualStatus,
    medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 7,
    lifestyleFactors: [],
    notes: 'Severe cramping in the morning',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  },
  {
    id: '2',
    date: '2024-01-02',
    time: '14:30',
    painLevel: 6,
    painTypes: ['cramping'] as PainType[],
    locations: ['lower_abdomen', 'lower_back'],
    symptoms: ['bloating'] as Symptom[],
    menstrualStatus: 'day_2_3' as MenstrualStatus,
    medications: [{ name: 'ibuprofen', dosage: '400mg', timing: 'during pain' }],
    effectiveness: 8,
    lifestyleFactors: [],
    notes: 'Better than yesterday',
    createdAt: new Date('2024-01-02T14:30:00Z'),
    updatedAt: new Date('2024-01-02T14:30:00Z')
  },
  {
    id: '3',
    date: '2024-01-03',
    time: '09:15',
    painLevel: 4,
    painTypes: ['aching'] as PainType[],
    locations: ['lower_back'],
    symptoms: ['fatigue'] as Symptom[],
    menstrualStatus: 'day_2_3' as MenstrualStatus,
    medications: [{ name: 'acetaminophen', dosage: '500mg', timing: 'during pain' }],
    effectiveness: 6,
    lifestyleFactors: [],
    notes: 'Mild discomfort',
    createdAt: new Date('2024-01-03T09:15:00Z'),
    updatedAt: new Date('2024-01-03T09:15:00Z')
  },
  {
    id: '4',
    date: '2024-01-15',
    time: '16:00',
    painLevel: 3,
    painTypes: ['pressure'] as PainType[],
    locations: ['lower_abdomen'],
    symptoms: ['mood_changes'] as Symptom[],
    menstrualStatus: 'mid_cycle' as MenstrualStatus,
    medications: [],
    effectiveness: 0,
    lifestyleFactors: [],
    notes: 'Ovulation pain',
    createdAt: new Date('2024-01-15T16:00:00Z'),
    updatedAt: new Date('2024-01-15T16:00:00Z')
  },
  {
    id: '5',
    date: '2024-01-28',
    time: '11:30',
    painLevel: 7,
    painTypes: ['cramping', 'sharp'] as PainType[],
    locations: ['lower_abdomen', 'pelvis'],
    symptoms: ['nausea', 'headache'] as Symptom[],
    menstrualStatus: 'before_period' as MenstrualStatus,
    medications: [{ name: 'ibuprofen', dosage: '600mg', timing: 'preventive' }],
    effectiveness: 9,
    lifestyleFactors: [],
    notes: 'Pre-menstrual pain',
    createdAt: new Date('2024-01-28T11:30:00Z'),
    updatedAt: new Date('2024-01-28T11:30:00Z')
  }
];

export const AnalyticsDemo: React.FC = () => {
  const [analytics, setAnalytics] = useState<PainAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const analyticsEngine = new AnalyticsEngine();
      const calculatedAnalytics = analyticsEngine.calculateAnalytics(sampleRecords);
      setAnalytics(calculatedAnalytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Pain Tracker Analytics Demo</h2>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Total Records</h3>
            <p className="text-2xl font-bold text-blue-900">{analytics.totalRecords}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Average Pain</h3>
            <p className="text-2xl font-bold text-green-900">{analytics.averagePainLevel}/10</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Pain Types</h3>
            <p className="text-2xl font-bold text-purple-900">{analytics.commonPainTypes.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800">Treatments</h3>
            <p className="text-2xl font-bold text-orange-900">{analytics.effectiveTreatments.length}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pain Trend Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Pain Trend Over Time</h3>
            <PainTrendChart 
              trendData={analytics.trendData}
              height={300}
              onError={(err) => console.error('Trend chart error:', err)}
            />
          </div>

          {/* Pain Distribution Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Pain Level Distribution</h3>
            <PainDistributionChart 
              records={sampleRecords}
              height={300}
              onError={(err) => console.error('Distribution chart error:', err)}
            />
          </div>

          {/* Pain Type Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Pain Type Distribution</h3>
            <PainTypeChart 
              painTypes={analytics.commonPainTypes}
              height={300}
              onError={(err) => console.error('Pain type chart error:', err)}
            />
          </div>

          {/* Cycle Pattern Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Menstrual Cycle Patterns</h3>
            <CyclePatternChart 
              cyclePatterns={analytics.cyclePatterns}
              height={300}
              onError={(err) => console.error('Cycle pattern chart error:', err)}
            />
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Generated Insights</h3>
          <div className="space-y-2">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <p className="text-blue-800 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Effectiveness */}
        {analytics.effectiveTreatments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Treatment Effectiveness</h3>
            <div className="space-y-2">
              {analytics.effectiveTreatments.map((treatment, index) => (
                <div key={index} className="flex justify-between items-center bg-green-50 p-3 rounded">
                  <span className="font-medium text-green-800">{treatment.treatment}</span>
                  <div className="text-right">
                    <div className="text-green-900 font-bold">{treatment.successRate.toFixed(1)}% success</div>
                    <div className="text-green-700 text-sm">{treatment.usageCount} uses</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDemo;