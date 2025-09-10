import { unstable_setRequestLocale } from 'next-intl/server';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Image from 'next/image';
import { Locale } from '@/i18n';
import type { Metadata } from 'next';

// Add noindex metadata for test pages
export const metadata: Metadata = {
  title: 'Test Image Quality - PeriodHub',
  description: 'Test page for image quality optimization',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestImageQualityPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8">图片质量测试 / Image Quality Test</h1>
      
      {/* 原始Next.js Image组件 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">原始 Next.js Image 组件 (默认质量75)</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <Image
            src="/images/tools/assessment-illustration.jpg"
            alt="Original Next.js Image - Default Quality"
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg shadow-lg mx-auto"
            priority={true}
          />
          <p className="text-sm text-gray-600 mt-2 text-center">默认质量设置 (75)</p>
        </div>
      </section>

      {/* 高质量OptimizedImage组件 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">OptimizedImage 组件 (质量95)</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <OptimizedImage
            src="/images/tools/assessment-illustration.jpg"
            alt="OptimizedImage - High Quality 95"
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg shadow-lg mx-auto"
            quality={95}
            priority={true}
          />
          <p className="text-sm text-blue-600 mt-2 text-center">高质量设置 (95)</p>
        </div>
      </section>

      {/* 中等质量对比 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">中等质量对比 (质量80)</h2>
        <div className="bg-green-50 p-6 rounded-lg">
          <OptimizedImage
            src="/images/tools/assessment-illustration.jpg"
            alt="OptimizedImage - Medium Quality 80"
            width={400}
            height={300}
            className="w-full max-w-md rounded-lg shadow-lg mx-auto"
            quality={80}
            priority={true}
          />
          <p className="text-sm text-green-600 mt-2 text-center">中等质量设置 (80)</p>
        </div>
      </section>

      {/* 响应式尺寸测试 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">响应式尺寸测试</h2>
        <div className="bg-purple-50 p-6 rounded-lg">
          <OptimizedImage
            src="/images/tools/assessment-illustration.jpg"
            alt="Responsive Image Test"
            width={400}
            height={300}
            className="w-full rounded-lg shadow-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw"
            quality={95}
            priority={true}
          />
          <p className="text-sm text-purple-600 mt-2 text-center">响应式尺寸 - 在不同屏幕尺寸下调整大小</p>
        </div>
      </section>

      {/* 图片信息 */}
      <section className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">图片信息</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>原始尺寸:</strong> 400x300 像素</li>
          <li><strong>文件大小:</strong> 29KB</li>
          <li><strong>格式:</strong> JPEG</li>
          <li><strong>Next.js优化:</strong> 启用 (WebP/AVIF 格式转换)</li>
          <li><strong>设备支持:</strong> 1x, 2x, 3x DPI</li>
        </ul>
      </section>
    </div>
  );
}
