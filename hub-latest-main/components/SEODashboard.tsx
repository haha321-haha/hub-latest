
'use client';

import { useState, useEffect } from 'react';

interface SEOMetrics {
  score: number;
  issues: string[];
  improvements: string[];
  webVitals: {
    LCP: number;
    FID: number;
    CLS: number;
  };
}

export function SEODashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSEOMetrics();
  }, []);

  const fetchSEOMetrics = async () => {
    try {
      const response = await fetch('/api/seo/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('获取SEO指标失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">加载SEO数据中...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">SEO监控仪表板</h2>
      
      {/* SEO评分 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold">SEO评分</span>
          <span className="text-3xl font-bold text-green-600">
            {metrics?.score || 0}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${metrics?.score || 0}%` }}
          />
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {metrics?.webVitals.LCP.toFixed(1)}s
          </div>
          <div className="text-sm text-gray-600">LCP</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {metrics?.webVitals.FID.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">FID</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {metrics?.webVitals.CLS.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">CLS</div>
        </div>
      </div>

      {/* 改进建议 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">改进建议</h3>
        <ul className="space-y-2">
          {metrics?.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-sm">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 待解决问题 */}
      {metrics?.issues && metrics.issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">待解决问题</h3>
          <ul className="space-y-2">
            {metrics.issues.map((issue, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-sm">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
