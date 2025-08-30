import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'culturalCharmsPage' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CulturalCharmsPage() {
  // Get translations for the cultural charms page
  const t = useTranslations('culturalCharmsPage');
  const locale = useLocale();
  
  return (
    <div className="space-y-10">
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
      <section className="bg-gradient-to-br from-accent-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <p className="text-neutral-700 leading-relaxed">
            {t('introduction')}
          </p>
          <p className="text-neutral-700 leading-relaxed mt-4">
            Throughout history and across diverse cultures, people have turned to symbols, objects, and traditional practices for comfort, protection, and support during times of vulnerability, including during menstruation. These practices are deeply rooted in cultural belief systems and folklore.
          </p>
          <p className="text-neutral-700 leading-relaxed mt-4">
            It is important to understand that the concepts discussed here are part of <strong>cultural heritage and traditional beliefs</strong>. They are explored from an anthropological and cultural perspective and are <strong>not presented as medical treatments or scientific remedies</strong> for menstrual pain or any health condition.
          </p>
        </div>
      </section>

      {/* Visuals of Cultural Comforts Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {t('multimediaTitle')}
        </h2>
        <p className="text-neutral-600 mb-6">
          {t('contentSection1Description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Images/Media */}
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="card aspect-video flex items-center justify-center bg-neutral-100 border-2 border-dashed border-neutral-300"
            >
              <p className="text-neutral-500">{t('imagePlaceholder')} {item}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* AI Image Prompts Section - For internal reference, can be removed or hidden in production */}
      <section className="bg-neutral-100 p-6 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-neutral-700 mb-2">AI Image Prompt Ideas (for internal use):</h3>
        <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
          <li>Abstract illustration blending cultural symbols of comfort and protection from various global traditions (e.g., celtic knots, tribal patterns, asian motifs). Focus on a sense of gentle strength and historical depth. Use warm, earthy tones with hints of metallic gold or silver. Aspect ratio 16:9.</li>
          <li>A stylized image depicting hands gently holding a collection of small, symbolic objects like smoothed stones, dried herbs, or intricate beads, representing traditional comforts or charms. The background should be soft and respectful, maybe a textile pattern. Aspect ratio 16:9.</li>
          <li>Visual representation of ancient wisdom and feminine energy related to cycles and wellness. Could involve abstract shapes resembling celestial bodies, ancient texts, or flowing water, combined with subtle human forms or symbols. Use deep blues, purples, and warm yellows. Aspect ratio 16:9.</li>
        </ul>
      </section>

      {/* Important Disclaimer Section */}
      <section className="mt-12">
        <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-800 p-6 rounded-r-lg shadow-md" role="alert">
          <h3 className="text-xl font-bold mb-2">
            {t('disclaimerTitle')}
          </h3>
          <p className="text-sm leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </section>

      {/* Back to Home Link */}
      <div className="text-center mt-10">
        <Link href={`/${locale}`} className="btn-outline">
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
