'use client';

import { useState, useEffect } from 'react';

export default function SimpleSEODashboard() {
  const [loading, setLoading] = useState(true);
  const [keywords] = useState([
    { keyword: '痛经缓解', searchVolume: 22200, competition: 0.42, cpc: 3.20 },
    { keyword: '经期健康管理', searchVolume: 8100, competition: 0.35, cpc: 2.80 },
    { keyword: '痛经治疗', searchVolume: 18100, competition: 0.55, cpc: 4.10 },
    { keyword: '自然疗法', searchVolume: 12400, competition: 0.38, cpc: 2.90 },
    { keyword: '经期肚子疼怎么缓解', searchVolume: 2900, competition: 0.25, cpc: 1.50 },
    { keyword: '痛经吃什么食物好', searchVolume: 4400, competition: 0.32, cpc: 2.10 },
    { keyword: '月经期间注意事项', searchVolume: 6600, competition: 0.41, cpc: 2.70 },
    { keyword: '经期健康', searchVolume: 5400, competition: 0.33, cpc: 2.20 },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getCompetitionColor = (competition: number) => {
    if (competition < 0.3) return 'text-green-600';
    if (competition < 0.6) return 'text-yellow-600';
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO分析仪表板</h1>
          <p className="text-gray-600">PeriodHub经期健康项目SEO优化分析（简化版）</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">总关键词数</h3>
            <p className="text-2xl font-bold text-gray-900">{keywords.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">平均搜索量</h3>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(keywords.reduce((sum, k) => sum + k.searchVolume, 0) / keywords.length).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">高价值关键词</h3>
            <p className="text-2xl font-bold text-blue-600">
              {keywords.filter(k => k.searchVolume > 10000).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">低竞争关键词</h3>
            <p className="text-2xl font-bold text-green-600">
              {keywords.filter(k => k.competition < 0.3).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">经期健康关键词分析</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键词</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">搜索量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">竞争度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优化建议</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywords.map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getVolumeColor(keyword.searchVolume)}`}>{keyword.searchVolume.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCompetitionColor(keyword.competition)}`}>{(keyword.competition * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{keyword.cpc.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyword.searchVolume > 10000 && keyword.competition < 0.5 ? (
                        <span className="text-green-600">✅ 优先优化</span>
                      ) : keyword.competition < 0.3 ? (
                        <span className="text-blue-600">🔍 机会关键词</span>
                      ) : (
                        <span className="text-orange-600">⚠️ 长期优化</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO优化建议</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-700 flex items-start">
                <span className="text-green-500 mr-2">•</span>
                重点优化"痛经缓解"（22,200搜索量）
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                创建"经期肚子疼怎么缓解"专题内容
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                增加长尾关键词覆盖
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                优化页面加载速度
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">竞争对手分析</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-700">
                <strong>主要竞争对手：</strong>39.net, 120ask.com, baidu.com
              </li>
              <li className="text-sm text-gray-700">
                <strong>差异化优势：</strong>专业工具 + 个性化建议
              </li>
              <li className="text-sm text-gray-700">
                <strong>内容空白：</strong>青少年痛经管理
              </li>
              <li className="text-sm text-gray-700">
                <strong>技术优化：</strong>移动优先 + 语音搜索
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-medium mb-2">🚀 DataForSEO集成说明</h3>
          <p className="text-sm opacity-90">
            当前显示模拟数据。配置DataForSEO API后可获得实时关键词排名和竞争对手分析。
          </p>
          <div className="mt-4 text-xs opacity-75">
            <strong>配置步骤：</strong>
            1. 注册DataForSEO → 2. 获取API密钥 → 3. 配置环境变量
          </div>
        </div>
      </div>
    </div>
  );
}