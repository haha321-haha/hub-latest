'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SymptomAssessmentTool from '../components/SymptomAssessmentTool';

interface Props {
  params: { locale: string };
}

export default function SymptomAssessmentClient({ params: { locale } }: Props) {
  const t = useTranslations('interactiveTools');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('symptomAssessment.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('symptomAssessment.description')}
            </p>
          </div>

          {/* 面包屑导航 */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href={`/${locale}`} className="hover:text-pink-600">
                {t('breadcrumb.home')}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/interactive-tools`} className="hover:text-pink-600">
                {t('breadcrumb.interactiveTools')}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{t('symptomAssessment.title')}</span>
            </div>
          </nav>

          {/* 症状评估工具 */}
          <SymptomAssessmentTool locale={locale} />
        </div>
      </div>
    </div>
  );
}