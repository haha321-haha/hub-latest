import { redirect } from 'next/navigation';

export default function RootPage() {
  // 301永久重定向到中文首页
  redirect('/zh', 'replace');
}