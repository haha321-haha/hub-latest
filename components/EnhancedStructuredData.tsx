interface EnhancedStructuredDataProps {
  type: 'website' | 'article' | 'faq' | 'howto' | 'medicalwebpage';
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  steps?: Array<{
    name: string;
    text: string;
  }>;
}

export default function EnhancedStructuredData({
  type,
  title,
  description,
  url,
  image,
  author,
  datePublished,
  dateModified,
  faqItems,
  steps
}: EnhancedStructuredDataProps) {
  const baseData = {
    "@context": "https://schema.org",
    "name": title,
    "description": description,
    "url": url,
    ...(image && { "image": image })
  };

  let structuredData;

  switch (type) {
    case 'website':
      structuredData = {
        ...baseData,
        "@type": "WebSite",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${url}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case 'article':
      structuredData = {
        ...baseData,
        "@type": "Article",
        "headline": title,
        "author": {
          "@type": "Organization",
          "name": author || "PeriodHub Health Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "PeriodHub",
          "logo": {
            "@type": "ImageObject",
            "url": "https://periodhub.health/icon-512.png"
          }
        },
        ...(datePublished && { "datePublished": datePublished }),
        ...(dateModified && { "dateModified": dateModified })
      };
      break;

    case 'faq':
      structuredData = {
        ...baseData,
        "@type": "FAQPage",
        "mainEntity": faqItems?.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
      break;

    case 'howto':
      structuredData = {
        ...baseData,
        "@type": "HowTo",
        "step": steps?.map((step, index) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.name,
          "text": step.text
        }))
      };
      break;

    case 'medicalwebpage':
      structuredData = {
        ...baseData,
        "@type": "MedicalWebPage",
        "medicalAudience": {
          "@type": "MedicalAudience",
          "audienceType": "Patient"
        },
        "about": {
          "@type": "MedicalCondition",
          "name": "Menstrual Health"
        }
      };
      break;

    default:
      structuredData = baseData;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}