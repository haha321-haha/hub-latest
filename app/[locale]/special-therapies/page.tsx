import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'SpecialTherapiesPage' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function SpecialTherapiesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Get translations for the special therapies page
  const t = useTranslations('SpecialTherapiesPage');
  const commonT = useTranslations('common');
  
  // Sample therapy cards data - in a real app, this might come from an API or CMS
  const therapyCards = [
    {
      id: 1,
      title: 'Acupressure Techniques',
      description: 'Traditional pressure point techniques to relieve menstrual discomfort.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'Herbal Compresses',
      description: 'Warm herbal compresses using traditional medicinal plants.',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Meridian Massage',
      description: 'Specialized massage techniques focusing on energy meridians.',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </header>

      {/* Introduction Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <p className="text-neutral-700 leading-relaxed">
            {t('introduction')}
          </p>
        </div>
      </section>

      {/* Featured Therapy Cards */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            {t('therapyCards.title')}
          </h2>
          <Link
            href={`/${locale}/natural-therapies`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {t('therapyCards.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapyCards.map(card => (
            <div key={card.id} className="card group overflow-hidden">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback for image loading errors
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=Therapy+Image';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                {card.title}
              </h3>
              <p className="text-neutral-600 mb-4">
                {card.description}
              </p>
              <Link
                href={`/${locale}/natural-therapies`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {commonT('learnMore')} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Video Demonstrations Section */}
      <section className="bg-neutral-100 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {t('videoSection.title')}
        </h2>
        <p className="text-neutral-600 mb-6">
          {t('videoSection.description')}
        </p>

        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
          {/* Placeholder video - replace with actual video content */}
          <iframe
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Therapy demonstration video"
            className="w-full h-full"
            onError={(e) => {
              // Fallback for video loading errors
              const target = e.target as HTMLIFrameElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="flex items-center justify-center h-full bg-neutral-200 text-neutral-600">Video unavailable</div>';
              }
            }}
          ></iframe>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
        <p className="text-neutral-700">
          <strong className="text-primary-700">Disclaimer:</strong> {t('disclaimer')}
        </p>
      </section>
    </div>
  );
}
