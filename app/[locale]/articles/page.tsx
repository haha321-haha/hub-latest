import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh
      ? '专业文章 - PeriodHub | 经期健康知识库'
      : 'Professional Articles - PeriodHub | Menstrual Health Knowledge Base',
    description: isZh
      ? 'PeriodHub专业文章：基于医学指南的经期健康知识库，涵盖痛经缓解、月经管理、健康建议等专业内容。'
      : 'PeriodHub Professional Articles: Medical guideline-based menstrual health knowledge base covering period pain relief, menstrual management, and health advice.',
    keywords: isZh ? [
      '经期健康文章', '痛经知识', '月经管理', '女性健康', '医学指南', '健康知识库'
    ] : [
      'menstrual health articles', 'period pain knowledge', 'menstrual management', 'women health', 'medical guidelines', 'health knowledge base'
    ],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticlesPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // 301永久重定向到downloads页面
  redirect(`/${locale}/downloads`);
}