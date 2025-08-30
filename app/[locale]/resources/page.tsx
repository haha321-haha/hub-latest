export default function ResourcesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
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
