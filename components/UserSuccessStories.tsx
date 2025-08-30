'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function UserSuccessStories() {
  const t = useTranslations('userSuccessStories');
  const locale = useLocale();

  const stories = [
    {
      id: 1,
      name: t('stories.story1.name'),
      role: t('stories.story1.role'),
      initial: t('stories.story1.initial'),
      testimonial: t('stories.story1.testimonial'),
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-600'
    },
    {
      id: 2,
      name: t('stories.story2.name'),
      role: t('stories.story2.role'),
      initial: t('stories.story2.initial'),
      testimonial: t('stories.story2.testimonial'),
      bgColor: 'bg-secondary-100',
      textColor: 'text-secondary-600'
    },
    {
      id: 3,
      name: t('stories.story3.name'),
      role: t('stories.story3.role'),
      initial: t('stories.story3.initial'),
      testimonial: t('stories.story3.testimonial'),
      bgColor: 'bg-accent-100',
      textColor: 'text-accent-600'
    }
  ];

  return (
    <section className="py-12">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-10 text-center">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="card">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${story.bgColor} flex items-center justify-center text-lg font-bold ${story.textColor} mr-4`}>
                  {story.initial}
                </div>
                <div>
                  <h3 className="font-semibold">{story.name}</h3>
                  <p className="text-sm text-neutral-500">{story.role}</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {story.testimonial}
              </p>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-neutral-700">
            {t('statistic')}
          </p>
          <Link href={`/${locale}/interactive-tools`} className="btn-primary mt-4 mobile-touch-target">
            {t('ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}
