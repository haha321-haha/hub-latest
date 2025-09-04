'use client';

import { useState } from 'react';
import React from 'react';

const DataDashboardClient = () => {
  const [metrics] = useState({
    dailyActiveUsers: 1248,
    userRetentionRate: 76.3,
    platformEngagement: 8.7,
    newUserAcquisition: 89,
    userLifetimeValue: 234.50
  });

  const [trends] = useState([
    { month: '1月', users: 820, engagement: 7.2 },
    { month: '2月', users: 950, engagement: 7.8 },
    { month: '3月', users: 1120, engagement: 8.1 },
    { month: '4月', users: 1248, engagement: 8.7 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">数据仪表板</h1>
          <p className="mt-2 text-gray-600">平台使用数据和用户活跃度分析</p>
        </div>

        {/* 关键指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">DAU</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">日活跃用户</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.dailyActiveUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">%</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">用户留存率</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.userRetentionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">★</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">平台参与度</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.platformEngagement}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">+</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">新用户获取</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.newUserAcquisition}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 趋势图表区域 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">用户增长趋势</h2>
          <div className="h-64 flex items-end space-x-4">
            {trends.map((trend, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-blue-500 rounded-t w-full mb-2"
                  style={{ height: `${(trend.users / 1300) * 200}px` }}
                ></div>
                <span className="text-sm text-gray-600">{trend.month}</span>
                <span className="text-xs text-gray-500">{trend.users}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDashboardClient;
