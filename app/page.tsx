import { redirect } from 'next/navigation';

export default function RootPage() {
  // 重定向到中文首页
  redirect('/zh');
}