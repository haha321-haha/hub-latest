import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh
      ? 'PDF资源下载中心 - PeriodHub | 专业经期健康指南'
      : 'PDF Resource Download Center - PeriodHub | Professional Menstrual Health Guides',
    description: isZh
      ? 'PeriodHub PDF资源下载中心：下载专业制作的经期健康指南、疼痛追踪表格、营养计划等PDF资源，帮助您科学管理经期健康。'
      : 'PeriodHub PDF Resource Center: Download professionally crafted menstrual health guides, pain tracking forms, nutrition plans and other PDF resources to help you manage your menstrual health scientifically.',
    keywords: isZh ? [
      'PDF下载', '经期健康指南', '痛经管理', '健康资源', '下载中心', '经期护理'
    ] : [
      'PDF download', 'menstrual health guides', 'period pain management', 'health resources', 'download center', 'menstrual care'
    ],
    openGraph: {
      title: isZh
        ? 'PDF资源下载中心 - PeriodHub'
        : 'PDF Resource Download Center - PeriodHub',
      description: isZh
        ? '专业经期健康PDF资源下载中心'
        : 'Professional menstrual health PDF resource download center',
      url: `https://www.periodhub.health/${locale}/resources`,
      siteName: 'PeriodHub',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/resources`,
      languages: {
        'zh-CN': 'https://www.periodhub.health/zh/resources',
        'en-US': 'https://www.periodhub.health/en/resources',
      },
    },
  };
}

export default async function ResourcesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {locale === 'zh' ? 'PDF资源下载中心' : 'PDF Resource Download Center'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'zh'
              ? '下载专业制作的PDF指南、表格和工具，帮助您更好地管理经期健康。'
              : 'Download professionally crafted PDF guides, forms, and tools to help you better manage your menstrual health.'
            }
          </p>
          <div className="mt-8 p-8 bg-white rounded-lg shadow-lg">
            <p className="text-lg text-green-600 font-semibold">
              ✅ 页面加载成功！Page loaded successfully!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              路由: /resources | Route: /resources
            </p>
            <p className="text-sm text-blue-500 mt-2">
              语言: {locale} | Language: {locale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
