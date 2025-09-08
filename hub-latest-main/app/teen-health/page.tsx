import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Teen Health - PeriodHub',
    description: 'Specialized menstrual health education for ages 10-19, including first period guidance, school emergency handling, and psychological adjustment support.',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TeenHealthRootPage() {
  // 301永久重定向到中文青少年健康页面
  redirect('/zh/teen-health');
}
