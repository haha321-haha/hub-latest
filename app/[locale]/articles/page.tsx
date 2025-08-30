import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';

export default async function ArticlesPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  // 简洁的302重定向到downloads页面
  redirect(`/${locale}/downloads`);
}