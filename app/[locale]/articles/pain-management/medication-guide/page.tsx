import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: isZh
      ? '药物指南 - PeriodHub | 痛经用药专业指导'
      : 'Medication Guide - PeriodHub | Professional Period Pain Medication Guidance',
    description: isZh
      ? 'PeriodHub药物指南：专业的痛经用药指导，包括NSAIDs使用、剂量建议、安全用药等医学知识。'
      : 'PeriodHub Medication Guide: Professional period pain medication guidance including NSAIDs usage, dosage recommendations, and safe medication practices.',
    keywords: isZh ? [
      '痛经用药', '药物指南', 'NSAIDs', '布洛芬', '萘普生', '安全用药', '剂量指导'
    ] : [
      'period pain medication', 'medication guide', 'NSAIDs', 'ibuprofen', 'naproxen', 'safe medication', 'dosage guidance'
    ],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RedirectPage() {
  redirect('/downloads/medication-guide');
}