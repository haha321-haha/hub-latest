'use client';

import { useState, useEffect } from 'react';

export default function SEODashboardSimplifiedClient() {
  const [loading, setLoading] = useState(true);
  const [keywords] = useState([
    { keyword: '痛经缓解', searchVolume: 22200, competition: 0.42, cpc: 3.20 },
    { keyword: '经期健康管理', searchVolume: 8100, competition: 0.35, cpc: 2.80 },
    { keyword: '痛经治疗', searchVolume: 18100, competition: 0.55, cpc: 4.10 },
    { keyword: '月经疼痛', searchVolume: 15600, competition: 0.48, cpc: 3.50 },
    { keyword: '经期护理', searchVolume: 9200, competition: 0.38, cpc: 2.90 },
    { keyword: '痛经药物', searchVolume: 13400, competition: 0.52, cpc: 3.80 },
    { keyword: '经期症状', searchVolume: 6800, competition: 0.32, cpc: 2.60 },
    { keyword: '月经周期', searchVolume: 18900, competition: 0.45, cpc: 3.30 },
    { keyword: '经期饮食', searchVolume: 5600, competition: 0.28, cpc: 2.40 },
    { keyword: '痛经按摩', searchVolume: 4200, competition: 0.25, cpc: 2.10 }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard - Simplified</h1>
          <p className="mt-2 text-gray-600">PeriodHub SEO Keywords Analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">KW</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Keywords</p>
                <p className="text-2xl font-semibold text-gray-900">{keywords.length}</p>
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
                  {Math.round(keywords.reduce((sum, kw) => sum + kw.searchVolume, 0) / keywords.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">CPC</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg CPC</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${(keywords.reduce((sum, kw) => sum + kw.cpc, 0) / keywords.length).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Keywords Analysis</h2>
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
                    Competition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(keyword.competition * 100).toFixed(0)}%
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
      </div>
    </div>
  );
}
