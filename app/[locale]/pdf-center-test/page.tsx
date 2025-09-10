import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PDFCenterOptimized from '../../../components/PDFCenterOptimized';

type Locale = 'en' | 'zh';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return {
    title: `PDF资源中心测试 - ${locale === 'zh' ? 'Period Hub' : 'Period Hub'}`,
    description: '测试新的PDF资源分类和优化系统',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PDFCenterTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('common');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📚 PDF资源中心优化测试
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              测试38个PDF资源的新分类系统、移动端优化界面和智能搜索功能
            </p>
            
            {/* 测试状态指示器 */}
            <div className="mt-6 flex justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">技术架构 ✓</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">数据结构 ✓</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">UI组件 ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF中心组件 */}
      <div className="py-8">
        <PDFCenterOptimized
          locale={locale}
          showSearch={true}
          showFilters={true}
          maxResults={20}
        />
      </div>

      {/* 测试信息面板 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🧪 测试功能说明
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">分类系统</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 紧急缓解 (10个)</li>
                <li>• 日常管理 (10个)</li>
                <li>• 深度学习 (12个)</li>
                <li>• 专业指导 (6个)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">优先级标签</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <span className="text-red-600">HIGHEST</span> - 最紧急</li>
                <li>• <span className="text-orange-600">HIGH</span> - 高优先级</li>
                <li>• <span className="text-yellow-600">MEDIUM</span> - 中等</li>
                <li>• <span className="text-gray-600">LOW</span> - 低优先级</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">搜索功能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 标题搜索</li>
                <li>• 描述搜索</li>
                <li>• 标签搜索</li>
                <li>• 实时筛选</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">移动端优化</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 响应式布局</li>
                <li>• 触摸友好按钮</li>
                <li>• 横向滚动导航</li>
                <li>• 卡片式设计</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ 测试注意事项</h4>
            <p className="text-sm text-yellow-700">
              这是技术架构测试页面。当前显示的是前10个紧急缓解类资源的示例数据。
              完整的38个资源数据将在内容制作完成后逐步添加。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
