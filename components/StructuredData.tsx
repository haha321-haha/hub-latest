interface StructuredDataData {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  // 允许扩展字段（如 locale、keywords 等），避免构建时的“多余属性”报错
  [key: string]: any;
}

type StructuredDataType =
  | 'Article'
  | 'WebPage'
  | 'Organization'
  | 'Person'
  | 'Product'
  | 'medicalWebPage'
  | 'healthTopicPage';

// 兼容两种调用方式：
// 1) <StructuredData type="..." title="..." description="..." url="..." />
// 2) <StructuredData type="..." data={{ title, description, url, ... }} />
type StructuredDataProps =
  | ({ type: StructuredDataType } & StructuredDataData)
  | ({ type: StructuredDataType; data: StructuredDataData });

export default function StructuredData(props: StructuredDataProps) {
  const normalized: { type: StructuredDataType } & StructuredDataData =
    'data' in props ? { type: props.type, ...props.data } : props;

  const data = generateStructuredData(normalized);
  return <StructuredDataScript data={data} />;
}

export function generateStructuredData(
  props: { type: StructuredDataType } & StructuredDataData
) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': props.type,
    name: props.title,
    description: props.description,
    url: props.url,
    image: props.image,
  };

  // 根据类型添加特定字段
  switch (props.type) {
    case 'Article':
      return {
        ...baseData,
        author: {
          '@type': 'Person',
          name: props.author || 'PeriodHub Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'PeriodHub',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png'
          }
        },
        datePublished: props.datePublished,
        dateModified: props.dateModified || props.datePublished,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': props.url
        }
      };
      
    case 'Organization':
      return {
        ...baseData,
        '@type': 'Organization',
        logo: '/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-555-0123',
          contactType: 'customer service'
        },
        sameAs: [
          'https://twitter.com/periodhub',
          'https://facebook.com/periodhub'
        ]
      };
      
    case 'medicalWebPage':
      return {
        ...baseData,
        '@type': 'MedicalWebPage',
        medicalAudience: 'Patient',
        about: {
          '@type': 'MedicalCondition',
          name: props.title
        }
      };
    
    case 'healthTopicPage':
      return {
        ...baseData,
        '@type': 'MedicalWebPage',
        medicalAudience: 'Patient',
        about: {
          '@type': 'MedicalTopic',
          name: props.title,
          description: props.description
        }
      };
      
    default:
      return baseData;
  }
}

export function StructuredDataScript({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
}
