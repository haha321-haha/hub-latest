'use client';

import { useTranslations } from 'next-intl';

export default function HealthStatistics() {
  const t = useTranslations('healthStatistics');

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {t('title')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          
          {/* SVG 统计图表 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <svg
              viewBox="0 0 800 520"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 背景渐变 */}
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdf2f8" />
                  <stop offset="50%" stopColor="#fce7f3" />
                  <stop offset="100%" stopColor="#f3e8ff" />
                </linearGradient>
                
                {/* 卡片渐变 */}
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                
                <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              
              {/* 背景 */}
              <rect width="800" height="520" fill="url(#bgGradient)" rx="20" />
              
              {/* 标题 */}
              <text x="400" y="50" textAnchor="middle" className="fill-gray-800 text-2xl font-bold">
                {t('chartTitle')}
              </text>
              <text x="400" y="75" textAnchor="middle" className="fill-gray-600 text-sm">
                {t('chartSubtitle')}
              </text>
              
              {/* 第一行统计卡片 */}
              {/* 85% 女性经历痛经 */}
              <rect x="50" y="120" width="160" height="120" fill="url(#purpleGradient)" rx="15" />
              <text x="130" y="160" textAnchor="middle" className="fill-white text-4xl font-bold">85%</text>
              <text x="130" y="185" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.experiencePain.label')}
              </text>
              <text x="130" y="200" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.experiencePain.sublabel')}
              </text>
              <text x="130" y="220" textAnchor="middle" className="fill-purple-200 text-xs">
                {t('stats.experiencePain.source')}
              </text>
              
              {/* 73% 影响工作学习 */}
              <rect x="230" y="120" width="160" height="120" fill="url(#pinkGradient)" rx="15" />
              <text x="310" y="160" textAnchor="middle" className="fill-white text-4xl font-bold">73%</text>
              <text x="310" y="185" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.affectsWork.label')}
              </text>
              <text x="310" y="200" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.affectsWork.sublabel')}
              </text>
              <text x="310" y="220" textAnchor="middle" className="fill-pink-200 text-xs">
                {t('stats.affectsWork.source')}
              </text>
              
              {/* 42% 寻求医疗帮助 */}
              <rect x="410" y="120" width="160" height="120" fill="url(#orangeGradient)" rx="15" />
              <text x="490" y="160" textAnchor="middle" className="fill-white text-4xl font-bold">42%</text>
              <text x="490" y="185" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.seekHelp.label')}
              </text>
              <text x="490" y="200" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.seekHelp.sublabel')}
              </text>
              <text x="490" y="220" textAnchor="middle" className="fill-orange-200 text-xs">
                {t('stats.seekHelp.source')}
              </text>
              
              {/* 91% 使用止痛药 */}
              <rect x="590" y="120" width="160" height="120" fill="url(#purpleGradient)" rx="15" />
              <text x="670" y="160" textAnchor="middle" className="fill-white text-4xl font-bold">91%</text>
              <text x="670" y="185" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.usePainkillers.label')}
              </text>
              <text x="670" y="200" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.usePainkillers.sublabel')}
              </text>
              <text x="670" y="220" textAnchor="middle" className="fill-purple-200 text-xs">
                {t('stats.usePainkillers.source')}
              </text>
              
              {/* 第二行统计卡片 */}
              {/* 2.3天 平均疼痛持续时间 */}
              <rect x="140" y="280" width="160" height="120" fill="url(#pinkGradient)" rx="15" />
              <text x="185" y="325" textAnchor="middle" className="fill-white text-4xl font-bold">2.3</text>
              <text x="245" y="325" textAnchor="middle" className="fill-white text-sm font-medium">{t('stats.avgDuration.unit')}</text>
              <text x="220" y="350" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.avgDuration.label')}
              </text>
              <text x="220" y="365" textAnchor="middle" className="fill-white text-xs">
                {t('stats.avgDuration.sublabel')}
              </text>
              <text x="220" y="385" textAnchor="middle" className="fill-pink-200 text-xs">
                {t('stats.avgDuration.source')}
              </text>
              
              {/* 6.2/10 平均疼痛程度 */}
              <rect x="320" y="280" width="160" height="120" fill="url(#orangeGradient)" rx="15" />
              <text x="400" y="320" textAnchor="middle" className="fill-white text-4xl font-bold">6.2/10</text>
              <text x="400" y="350" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.avgPainLevel.label')}
              </text>
              <text x="400" y="365" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.avgPainLevel.sublabel')}
              </text>
              <text x="400" y="380" textAnchor="middle" className="fill-orange-200 text-xs">
                {t('stats.avgPainLevel.source')}
              </text>
              
              {/* 15-45岁 主要影响年龄段 */}
              <rect x="500" y="280" width="160" height="120" fill="url(#purpleGradient)" rx="15" />
              <text x="545" y="325" textAnchor="middle" className="fill-white text-3xl font-bold">15-45</text>
              <text x="615" y="325" textAnchor="middle" className="fill-white text-sm font-medium">{t('stats.primaryAge.unit')}</text>
              <text x="580" y="350" textAnchor="middle" className="fill-white text-sm font-medium">
                {t('stats.primaryAge.label')}
              </text>
              <text x="580" y="365" textAnchor="middle" className="fill-white text-xs">
                {t('stats.primaryAge.sublabel')}
              </text>
              <text x="580" y="385" textAnchor="middle" className="fill-purple-200 text-xs">
                {t('stats.primaryAge.source')}
              </text>
              
              {/* 装饰性圆点 */}
              <circle cx="750" cy="150" r="8" fill="#ec4899" opacity="0.6" />
              <circle cx="720" cy="180" r="6" fill="#9333ea" opacity="0.4" />
              <circle cx="780" cy="200" r="4" fill="#f59e0b" opacity="0.5" />
              
              <circle cx="50" cy="350" r="6" fill="#ec4899" opacity="0.4" />
              <circle cx="30" cy="380" r="8" fill="#9333ea" opacity="0.6" />
              <circle cx="70" cy="400" r="4" fill="#f59e0b" opacity="0.5" />
              
              {/* 数据来源 */}
              <text x="400" y="450" textAnchor="middle" className="fill-gray-600 text-sm">
                {t('dataSource')}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
