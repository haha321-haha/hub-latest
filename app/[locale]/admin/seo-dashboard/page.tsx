'use client';

import { useState, useEffect } from 'react';
import { PeriodHubSEOAnalyzer } from '@/lib/seo/keyword-analyzer';
import type { KeywordAnalysis } from '@/lib/seo/keyword-analyzer';
import { webVitalsTracker } from '@/lib/analytics/web-vitals';

interface SEOStats {
  totalKeywords: number;
  avgSearchVolume: number;
  topPerforming: string[];
  contentScore: number;
  webVitalsScore: number;
  webVitalsGrade: string;
}

interface WebVitalsData {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
  grade: string;
  score: number;
}

export default function SEODashboardPage() {
  const [keywords, setKeywords] = useState<KeywordAnalysis[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SEOStats>({
    totalKeywords: 0,
    avgSearchVolume: 0,
    topPerforming: [],
    contentScore: 0,
    webVitalsScore: 0,
    webVitalsGrade: '良好'
  });

  const analyzer = PeriodHubSEOAnalyzer;

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    try {
      setLoading(true);
      
      // 并行加载所有SEO数据
      const [
        keywordData,
        competitorData,
        vitalsData
      ] = await Promise.allSettled([
        analyzer.analyzePeriodHealthKeywords(),
        analyzer.analyzeCompetitors(),
        loadWebVitals()
      ]);

      // 处理关键词数据
      if (keywordData.status === 'fulfilled') {
        setKeywords(keywordData.value);
      }

      // 处理竞争对手数据
      if (competitorData.status === 'fulfilled') {
        setCompetitors(competitorData.value);
      }

      // 处理Web Vitals数据
      if (vitalsData.status === 'fulfilled') {
        // Web Vitals数据处理
      }

      // 分析主要内容页面
      await Promise.all([
        analyzer.analyzeContentSEO('https://periodhub.health/zh/articles'),
        analyzer.analyzeContentSEO('https://periodhub.health/zh/health-guide'),
        analyzer.analyzeContentSEO('https://periodhub.health/zh/interactive-tools')
      ]);

      // 计算统计信息
      const totalKeywords = keywords.length;
      const avgSearchVolume = totalKeywords > 0 ? keywords.reduce((sum, k) => sum + k.searchVolume, 0) / totalKeywords : 0;
      const topPerforming = keywords
        .filter(k => k.searchVolume > 1000)
        .map(k => k.keyword)
        .slice(0, 5);

      // 计算Web Vitals评分
      const vitals = webVitalsTracker.getAverageMetrics();
      const vitalsRating = webVitalsTracker.getPerformanceRating({
        LCP: vitals.LCP || 0,
        FID: vitals.FID || 0,
        CLS: vitals.CLS || 0,
        FCP: vitals.FCP || 0,
        TTFB: vitals.TTFB || 0,
        timestamp: '',
        pathname: '',
        device: { isMobile: false, isDesktop: true }
      });

      setStats({
        totalKeywords,
        avgSearchVolume,
        topPerforming,
        contentScore: 85,
        webVitalsScore: vitalsRating.score,
        webVitalsGrade: vitalsRating.grade
      });

    } catch (error) {
      console.error('SEO数据加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebVitals = async (): Promise<WebVitalsData | null> => {
    const metrics = webVitalsTracker.getAverageMetrics();
    const rating = webVitalsTracker.getPerformanceRating({
      LCP: metrics.LCP || 0,
      FID: metrics.FID || 0,
      CLS: metrics.CLS || 0,
      FCP: metrics.FCP || 0,
      TTFB: metrics.TTFB || 0,
      timestamp: '',
      pathname: '',
      device: { isMobile: false, isDesktop: true }
    });

    return {
      LCP: metrics.LCP || 0,
      FID: metrics.FID || 0,
      CLS: metrics.CLS || 0,
      FCP: metrics.FCP || 0,
      TTFB: metrics.TTFB || 0,
      grade: rating.grade,
      score: rating.score
    };
  };

  const calculateContentScore = (analysis: any[]): number => {
    if (analysis.length === 0) return 0;
    
    const scores = analysis.map(content => {
      let score = 0;
      
      // 标题优化 (25分)
      if ((content.title || '').length >= 30 && (content.title || '').length <= 60) score += 25;
      
      // 描述优化 (25分)
      if ((content.metaDescription || '').length >= 120 && (content.metaDescription || '').length <= 160) score += 25;
      
      // 关键词密度 (25分)
      const densities = Object.values((content as any).keywordDensity || {});
      const avgDensity = densities.length > 0 ? densities.reduce((sum: number, d: any) => sum + Number(d), 0) / densities.length : 0;
      if (avgDensity >= 1 && avgDensity <= 3) score += 25;
      
      // 结构优化 (25分)
      if ((content.h1Tags || []).length > 0) score += 15;
      if ((content.imageAltTexts || []).length > 0) score += 10;
      
      return score;
    });
    
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  };

  const getCompetitionColor = (competition: any) => {
    const level = typeof competition === 'string' ? 
      (competition === 'low' ? 0.2 : competition === 'medium' ? 0.5 : 0.8) : 
      competition;
    
    if (level < 0.3) return 'text-green-600';
    if (level < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVolumeColor = (volume: number) => {
    if (volume > 10000) return 'text-purple-600';
    if (volume > 1000) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">正在加载SEO分析数据...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO分析仪表板</h1>
          <p className="text-gray-600">PeriodHub经期健康项目SEO优化分析</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">总关键词数</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalKeywords}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">平均搜索量</h3>
            <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avgSearchVolume).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">内容优化得分</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.contentScore}/100</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">竞争对手数</h3>
            <p className="text-2xl font-bold text-red-600">{competitors.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">关键词分析</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键词</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">搜索量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">竞争度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建议</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.slice(0, 10).map((keyword) => (
                  <tr key={keyword.keyword}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getVolumeColor(keyword.searchVolume)}`}>{keyword.searchVolume.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCompetitionColor(keyword.competition)}`}>
                      {(() => {
                        const level = typeof keyword.competition === 'string' ? 
                          (keyword.competition === 'low' ? 0.2 : keyword.competition === 'medium' ? 0.5 : 0.8) : 
                          keyword.competition;
                        return `${(level * 100).toFixed(1)}%`;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{typeof keyword.cpc === 'number' ? keyword.cpc.toFixed(2) : '2.50'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const competitionLevel = typeof keyword.competition === 'string' ? 
                          (keyword.competition === 'low' ? 0.2 : keyword.competition === 'medium' ? 0.5 : 0.8) : 
                          keyword.competition;
                        
                        return keyword.searchVolume > 1000 && competitionLevel < 0.5 ? (
                          <span className="text-green-600">✅ 优先优化</span>
                        ) : competitionLevel < 0.3 ? (
                          <span className="text-blue-600">🔍 机会关键词</span>
                        ) : (
                          <span className="text-orange-600">⚠️ 长期优化</span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">内容优化建议</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">高优先级关键词</h3>
                <ul className="space-y-2">
                  {stats.topPerforming.map(keyword => (
                    <li key={keyword} className="text-sm text-gray-700">
                      • {keyword}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">优化建议</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700">• 增加目标关键词密度到1-3%</li>
                  <li className="text-sm text-gray-700">• 优化元描述长度(120-160字符)</li>
                  <li className="text-sm text-gray-700">• 添加更多长尾关键词内容</li>
                  <li className="text-sm text-gray-700">• 提高图片alt属性覆盖率</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">竞争对手分析</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitors.map((competitor) => (
                <div key={competitor.domain} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{competitor.domain}</h4>
                  <p className="text-sm text-gray-600">
                    预估流量: {competitor.traffic.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    主要关键词: {competitor.topKeywords.slice(0, 3).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}