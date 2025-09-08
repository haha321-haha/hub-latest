'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface NavigationTabsProps {
  locale: string;
}

export default function NavigationTabs({ locale }: NavigationTabsProps) {
  const t = useTranslations('navigationTabs');

  return (
    <section className="flex justify-center">
      <div className="bg-neutral-100 p-1 rounded-lg inline-flex">
        <Link
          href={`/${locale}/downloads`}
          className="px-6 py-2 rounded-md text-neutral-700 hover:bg-white hover:shadow-sm transition-all"
        >
          {locale === 'en' ? '📚 Articles' : '📚 专业文章'}
        </Link>
        <Link
          href={`/${locale}/downloads`}
          className="px-6 py-2 rounded-md text-neutral-700 hover:bg-white hover:shadow-sm transition-all"
        >
          {locale === 'en' ? '📥 PDF Downloads' : '📥 PDF下载'}
        </Link>
      </div>
    </section>
  );
}
