export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            PeriodHub - 女性健康管理平台
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            专业的痛经缓解和月经健康管理解决方案
          </p>
          <div className="space-x-4">
            <a href={`/${params.locale}/articles`} 
               className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
              浏览文章
            </a>
            <a href={`/${params.locale}/interactive-tools`}
               className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700">
              互动工具
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}