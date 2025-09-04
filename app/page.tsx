import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PeriodHub - 专业痛经缓解方法和月经健康管理平台',
    description: 'PeriodHub｜专业痛经缓解方案与经期健康管理平台。基于42篇医学指南和24个自测工具，三甲医院合作机构已帮助60万+女性科学应对痛经困扰。',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootPage() {
  // 301永久重定向到中文首页
  redirect('/zh');
}