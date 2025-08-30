'use client';

import { useTranslations } from 'next-intl';

export default function NaturalTherapiesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('naturalTherapiesPage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container-custom mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {locale === 'zh' ? '自然疗法' : 'Natural Therapies'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {locale === 'zh'
              ? '通过科学的自然疗法，安全有效地缓解痛经'
              : 'Safe and effective menstrual pain relief through scientific natural therapies'
            }
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              {locale === 'zh' 
                ? '✅ 页面加载成功！基本功能正常运行。' 
                : '✅ Page loaded successfully! Basic functionality is working.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}