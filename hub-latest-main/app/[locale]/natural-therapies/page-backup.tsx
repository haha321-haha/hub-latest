'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function NaturalTherapiesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = useTranslations('naturalTherapiesPage');
  const commonT = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16 rounded-2xl">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {locale === 'zh' ? '自然疗法' : 'Natural Therapies'}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  {locale === 'zh'
                    ? '通过科学的自然疗法，安全有效地缓解痛经'
                    : 'Safe and effective menstrual pain relief through scientific natural therapies'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Simple Content */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? '页面正在加载...' : 'Page Loading...'}
            </h2>
            <p className="text-gray-600">
              {locale === 'zh'
                ? '如果您看到这个页面，说明基本功能正常。'
                : 'If you see this page, the basic functionality is working.'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}