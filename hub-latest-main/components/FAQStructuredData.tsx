'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQStructuredData({ faqs, title }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: title || '常见问题',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

// 常用FAQ数据
export const commonFAQs = {
  periodPain: [
    {
      question: '痛经怎么缓解最快？',
      answer: '快速缓解痛经的方法包括：热敷下腹部、适度运动、深呼吸练习、按摩腹部、服用非处方止痛药（如布洛芬）。热敷是最快速有效的方法之一。'
    },
    {
      question: '什么时候应该看医生？',
      answer: '如果痛经严重影响日常生活、疼痛持续时间长、伴有异常出血、发热或其他症状，应及时就医。医生可以帮助诊断是否存在潜在的妇科疾病。'
    },
    {
      question: '自然疗法真的有效吗？',
      answer: '许多自然疗法如热敷、瑜伽、草药茶等都有科学研究支持其有效性。但效果因人而异，建议结合医学治疗使用。'
    }
  ],
  
  menstrualHealth: [
    {
      question: '正常的月经周期是多长？',
      answer: '正常的月经周期通常为21-35天，月经持续3-7天。每个人的周期可能略有不同，关键是保持规律性。'
    },
    {
      question: '如何追踪月经周期？',
      answer: '可以使用月经追踪应用、日历记录或我们的在线工具来追踪周期。记录月经开始日期、持续时间、流量和症状。'
    }
  ]
};