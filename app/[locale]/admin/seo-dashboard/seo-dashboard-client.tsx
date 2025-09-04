'use client';

import { useState, useEffect } from 'react';
import { PeriodHubSEOAnalyzer } from '@/lib/seo/keyword-analyzer';
import type { KeywordAnalysis } from '@/lib/seo/keyword-analyzer';

interface SEOStats {
  totalKeywords: number;
  avgSearchVolume: number;
  avgDifficulty: number;
  avgCPC: number;
  topKeywords: KeywordAnalysis[];
  recentChanges: Array<{
    keyword: string;
    change: number;
    type: 'volume' | 'difficulty' | 'cpc';
  }>;
}

export default function SEODashboardClient() {
  const [seoStats, setSeoStats] = useState<SEOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSEOData = async () => {
      try {
        setLoading(true);
        
        // 使用真实的SEO分析器
        const analysis = PeriodHubSEOAnalyzer.analyzePeriodHealthKeywords();
        
        setSeoStats({
          totalKeywords: analysis.length,
          avgSearchVolume: analysis.reduce((sum, kw) => sum + kw.searchVolume, 0) / analysis.length,
          avgDifficulty: analysis.reduce((sum, kw) => sum + kw.difficulty, 0) / analysis.length,
          avgCPC: analysis.reduce((sum, kw) => sum + kw.cpc, 0) / analysis.length,
          topKeywords: analysis.slice(0, 10),
          recentChanges: analysis.slice(0, 5).map(kw => ({
            keyword: kw.keyword,
            change: Math.random() * 20 - 10, // Mock change data
            type: ['volume', 'difficulty', 'cpc'][Math.floor(Math.random() * 3)] as 'volume' | 'difficulty' | 'cpc'
          }))
        });
      } catch (err) {
        setError('Failed to load SEO data');
        console.error('SEO data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSEOData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!seoStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No SEO data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="mt-2 text-gray-600">PeriodHub SEO Analytics and Keyword Management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">KW</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Keywords</p>
                <p className="text-2xl font-semibold text-gray-900">{seoStats.totalKeywords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">SV</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Search Volume</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(seoStats.avgSearchVolume).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">DF</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Difficulty</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {seoStats.avgDifficulty.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">$</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg CPC</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${seoStats.avgCPC.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Keywords Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Keywords</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Search Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seoStats.topKeywords.map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.difficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${keyword.cpc.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Changes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Changes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {seoStats.recentChanges.map((change, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {change.keyword}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({change.type})
                    </span>
                  </div>
                  <div className={`flex items-center text-sm ${
                    change.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change.change > 0 ? '↗' : '↘'} {Math.abs(change.change).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
