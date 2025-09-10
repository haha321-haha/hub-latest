import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/i18n';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? 'A-Z缓解方法 - 痛经健康指南' : 'A-Z Relief Methods - Health Guide';
  const description = locale === 'zh' 
    ? '从A到Z的全面缓解方法，包括即时和长期策略，帮助您找到最适合的痛经管理方案。'
    : 'Comprehensive relief methods from A to Z, including immediate and long-term strategies to help you find the most suitable menstrual pain management plan.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ReliefMethodsPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;

  const reliefMethods = [
    {
      letter: 'A',
      methods: [
        {
          name: locale === 'zh' ? '穴位按摩 (Acupressure)' : 'Acupressure',
          description: locale === 'zh' ? '通过按压特定穴位来缓解疼痛' : 'Relieve pain by pressing specific acupoints'
        },
        {
          name: locale === 'zh' ? '芳香疗法 (Aromatherapy)' : 'Aromatherapy',
          description: locale === 'zh' ? '使用精油进行放松和疼痛缓解' : 'Use essential oils for relaxation and pain relief'
        }
      ]
    },
    {
      letter: 'B',
      methods: [
        {
          name: locale === 'zh' ? '呼吸练习 (Breathing Exercises)' : 'Breathing Exercises',
          description: locale === 'zh' ? '深呼吸技巧帮助放松和减轻疼痛' : 'Deep breathing techniques help relax and reduce pain'
        },
        {
          name: locale === 'zh' ? '八段锦 (Baduanjin)' : 'Baduanjin',
          description: locale === 'zh' ? '传统中医气功练习' : 'Traditional Chinese qigong practice'
        }
      ]
    },
    {
      letter: 'C',
      methods: [
        {
          name: locale === 'zh' ? '冷敷 (Cold Therapy)' : 'Cold Therapy',
          description: locale === 'zh' ? '适用于炎症性疼痛' : 'Suitable for inflammatory pain'
        },
        {
          name: locale === 'zh' ? '认知行为疗法 (CBT)' : 'Cognitive Behavioral Therapy',
          description: locale === 'zh' ? '改变对疼痛的认知和反应' : 'Change cognition and response to pain'
        }
      ]
    },
    {
      letter: 'D',
      methods: [
        {
          name: locale === 'zh' ? '饮食调整 (Diet Modification)' : 'Diet Modification',
          description: locale === 'zh' ? '抗炎饮食和营养补充' : 'Anti-inflammatory diet and nutritional supplements'
        },
        {
          name: locale === 'zh' ? '舞蹈疗法 (Dance Therapy)' : 'Dance Therapy',
          description: locale === 'zh' ? '通过舞蹈运动缓解疼痛' : 'Relieve pain through dance movement'
        }
      ]
    },
    {
      letter: 'E',
      methods: [
        {
          name: locale === 'zh' ? '运动 (Exercise)' : 'Exercise',
          description: locale === 'zh' ? '适度运动促进血液循环' : 'Moderate exercise promotes blood circulation'
        },
        {
          name: locale === 'zh' ? '精油按摩 (Essential Oil Massage)' : 'Essential Oil Massage',
          description: locale === 'zh' ? '结合按摩和芳香疗法' : 'Combine massage and aromatherapy'
        }
      ]
    },
    {
      letter: 'F',
      methods: [
        {
          name: locale === 'zh' ? '足部反射疗法 (Foot Reflexology)' : 'Foot Reflexology',
          description: locale === 'zh' ? '通过足部按摩缓解全身疼痛' : 'Relieve whole body pain through foot massage'
        },
        {
          name: locale === 'zh' ? '纤维补充 (Fiber Supplements)' : 'Fiber Supplements',
          description: locale === 'zh' ? '改善肠道健康，减少炎症' : 'Improve gut health and reduce inflammation'
        }
      ]
    },
    {
      letter: 'G',
      methods: [
        {
          name: locale === 'zh' ? '生姜疗法 (Ginger Therapy)' : 'Ginger Therapy',
          description: locale === 'zh' ? '天然抗炎和止痛效果' : 'Natural anti-inflammatory and pain relief effects'
        },
        {
          name: locale === 'zh' ? '引导冥想 (Guided Meditation)' : 'Guided Meditation',
          description: locale === 'zh' ? '通过冥想减轻疼痛感知' : 'Reduce pain perception through meditation'
        }
      ]
    },
    {
      letter: 'H',
      methods: [
        {
          name: locale === 'zh' ? '热疗 (Heat Therapy)' : 'Heat Therapy',
          description: locale === 'zh' ? '使用热敷缓解肌肉紧张' : 'Use heat to relieve muscle tension'
        },
        {
          name: locale === 'zh' ? '草药茶 (Herbal Tea)' : 'Herbal Tea',
          description: locale === 'zh' ? '洋甘菊、薄荷等舒缓茶饮' : 'Soothing teas like chamomile and mint'
        }
      ]
    },
    {
      letter: 'I',
      methods: [
        {
          name: locale === 'zh' ? '冰敷疗法 (Ice Therapy)' : 'Ice Therapy',
          description: locale === 'zh' ? '减少炎症和麻痹疼痛' : 'Reduce inflammation and numb pain'
        },
        {
          name: locale === 'zh' ? '意象疗法 (Imagery Therapy)' : 'Imagery Therapy',
          description: locale === 'zh' ? '通过想象缓解疼痛' : 'Relieve pain through visualization'
        }
      ]
    },
    {
      letter: 'J',
      methods: [
        {
          name: locale === 'zh' ? '日记记录 (Journaling)' : 'Journaling',
          description: locale === 'zh' ? '记录疼痛模式和触发因素' : 'Track pain patterns and triggers'
        },
        {
          name: locale === 'zh' ? '慢跑 (Jogging)' : 'Jogging',
          description: locale === 'zh' ? '轻度有氧运动促进血液循环' : 'Light aerobic exercise promotes circulation'
        }
      ]
    },
    {
      letter: 'K',
      methods: [
        {
          name: locale === 'zh' ? '膝胸位 (Knee-to-Chest Position)' : 'Knee-to-Chest Position',
          description: locale === 'zh' ? '缓解下腹部疼痛的体位' : 'Position to relieve lower abdominal pain'
        },
        {
          name: locale === 'zh' ? '昆达里尼瑜伽 (Kundalini Yoga)' : 'Kundalini Yoga',
          description: locale === 'zh' ? '特殊的瑜伽练习形式' : 'Special form of yoga practice'
        }
      ]
    },
    {
      letter: 'L',
      methods: [
        {
          name: locale === 'zh' ? '薰衣草精油 (Lavender Oil)' : 'Lavender Oil',
          description: locale === 'zh' ? '放松和镇静效果' : 'Relaxing and calming effects'
        },
        {
          name: locale === 'zh' ? '生活方式调整 (Lifestyle Changes)' : 'Lifestyle Changes',
          description: locale === 'zh' ? '改善整体健康状况' : 'Improve overall health condition'
        }
      ]
    },
    {
      letter: 'M',
      methods: [
        {
          name: locale === 'zh' ? '按摩疗法 (Massage Therapy)' : 'Massage Therapy',
          description: locale === 'zh' ? '专业按摩缓解肌肉紧张' : 'Professional massage to relieve muscle tension'
        },
        {
          name: locale === 'zh' ? '正念冥想 (Mindfulness Meditation)' : 'Mindfulness Meditation',
          description: locale === 'zh' ? '专注当下，减轻疼痛感知' : 'Focus on present moment, reduce pain perception'
        }
      ]
    },
    {
      letter: 'N',
      methods: [
        {
          name: locale === 'zh' ? '营养补充 (Nutritional Supplements)' : 'Nutritional Supplements',
          description: locale === 'zh' ? '镁、维生素B等营养素' : 'Nutrients like magnesium and vitamin B'
        },
        {
          name: locale === 'zh' ? '自然疗法 (Natural Remedies)' : 'Natural Remedies',
          description: locale === 'zh' ? '草药和天然治疗方法' : 'Herbal and natural treatment methods'
        }
      ]
    },
    {
      letter: 'O',
      methods: [
        {
          name: locale === 'zh' ? 'Omega-3脂肪酸 (Omega-3 Fatty Acids)' : 'Omega-3 Fatty Acids',
          description: locale === 'zh' ? '抗炎和疼痛缓解效果' : 'Anti-inflammatory and pain relief effects'
        },
        {
          name: locale === 'zh' ? '有机食品 (Organic Foods)' : 'Organic Foods',
          description: locale === 'zh' ? '减少化学物质摄入' : 'Reduce chemical intake'
        }
      ]
    },
    {
      letter: 'P',
      methods: [
        {
          name: locale === 'zh' ? '渐进性肌肉放松 (Progressive Muscle Relaxation)' : 'Progressive Muscle Relaxation',
          description: locale === 'zh' ? '系统性放松肌肉群' : 'Systematically relax muscle groups'
        },
        {
          name: locale === 'zh' ? '普拉提 (Pilates)' : 'Pilates',
          description: locale === 'zh' ? '核心力量和柔韧性训练' : 'Core strength and flexibility training'
        }
      ]
    },
    {
      letter: 'Q',
      methods: [
        {
          name: locale === 'zh' ? '气功 (Qigong)' : 'Qigong',
          description: locale === 'zh' ? '中医传统运动疗法' : 'Traditional Chinese movement therapy'
        },
        {
          name: locale === 'zh' ? '安静休息 (Quiet Rest)' : 'Quiet Rest',
          description: locale === 'zh' ? '在安静环境中休息恢复' : 'Rest and recover in quiet environment'
        }
      ]
    },
    {
      letter: 'R',
      methods: [
        {
          name: locale === 'zh' ? '放松技巧 (Relaxation Techniques)' : 'Relaxation Techniques',
          description: locale === 'zh' ? '各种放松身心的方法' : 'Various methods to relax body and mind'
        },
        {
          name: locale === 'zh' ? '反射疗法 (Reflexology)' : 'Reflexology',
          description: locale === 'zh' ? '通过反射点缓解疼痛' : 'Relieve pain through reflex points'
        }
      ]
    },
    {
      letter: 'S',
      methods: [
        {
          name: locale === 'zh' ? '拉伸运动 (Stretching)' : 'Stretching',
          description: locale === 'zh' ? '温和的拉伸缓解肌肉紧张' : 'Gentle stretching to relieve muscle tension'
        },
        {
          name: locale === 'zh' ? '睡眠优化 (Sleep Optimization)' : 'Sleep Optimization',
          description: locale === 'zh' ? '改善睡眠质量促进恢复' : 'Improve sleep quality to promote recovery'
        }
      ]
    },
    {
      letter: 'T',
      methods: [
        {
          name: locale === 'zh' ? '太极 (Tai Chi)' : 'Tai Chi',
          description: locale === 'zh' ? '缓慢流畅的运动练习' : 'Slow and flowing movement practice'
        },
        {
          name: locale === 'zh' ? '茶疗 (Tea Therapy)' : 'Tea Therapy',
          description: locale === 'zh' ? '药用茶饮缓解症状' : 'Medicinal teas to relieve symptoms'
        }
      ]
    },
    {
      letter: 'U',
      methods: [
        {
          name: locale === 'zh' ? '超声波疗法 (Ultrasound Therapy)' : 'Ultrasound Therapy',
          description: locale === 'zh' ? '深层组织加热治疗' : 'Deep tissue heating treatment'
        },
        {
          name: locale === 'zh' ? '理解教育 (Understanding Education)' : 'Understanding Education',
          description: locale === 'zh' ? '了解痛经机制减少焦虑' : 'Understanding pain mechanisms reduces anxiety'
        }
      ]
    },
    {
      letter: 'V',
      methods: [
        {
          name: locale === 'zh' ? '可视化技巧 (Visualization)' : 'Visualization',
          description: locale === 'zh' ? '心理意象缓解疼痛' : 'Mental imagery for pain relief'
        },
        {
          name: locale === 'zh' ? '维生素疗法 (Vitamin Therapy)' : 'Vitamin Therapy',
          description: locale === 'zh' ? '补充必需维生素' : 'Supplement essential vitamins'
        }
      ]
    },
    {
      letter: 'W',
      methods: [
        {
          name: locale === 'zh' ? '温水浴 (Warm Bath)' : 'Warm Bath',
          description: locale === 'zh' ? '温水浸泡放松肌肉' : 'Warm water soaking to relax muscles'
        },
        {
          name: locale === 'zh' ? '步行 (Walking)' : 'Walking',
          description: locale === 'zh' ? '轻度运动促进血液循环' : 'Light exercise to promote circulation'
        }
      ]
    },
    {
      letter: 'X',
      methods: [
        {
          name: locale === 'zh' ? 'X光检查 (X-ray Examination)' : 'X-ray Examination',
          description: locale === 'zh' ? '排除器质性病变' : 'Rule out organic lesions'
        },
        {
          name: locale === 'zh' ? '木糖醇 (Xylitol)' : 'Xylitol',
          description: locale === 'zh' ? '天然甜味剂，减少炎症' : 'Natural sweetener, reduce inflammation'
        }
      ]
    },
    {
      letter: 'Y',
      methods: [
        {
          name: locale === 'zh' ? '瑜伽 (Yoga)' : 'Yoga',
          description: locale === 'zh' ? '身心结合的练习方法' : 'Mind-body integrated practice'
        },
        {
          name: locale === 'zh' ? '阴瑜伽 (Yin Yoga)' : 'Yin Yoga',
          description: locale === 'zh' ? '深度放松的瑜伽形式' : 'Deep relaxation form of yoga'
        }
      ]
    },
    {
      letter: 'Z',
      methods: [
        {
          name: locale === 'zh' ? '锌补充 (Zinc Supplements)' : 'Zinc Supplements',
          description: locale === 'zh' ? '支持免疫系统和愈合' : 'Support immune system and healing'
        },
        {
          name: locale === 'zh' ? '禅修 (Zen Meditation)' : 'Zen Meditation',
          description: locale === 'zh' ? '深度冥想练习' : 'Deep meditation practice'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {locale === 'zh' ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">›</span>
            <Link href={`/${locale}/health-guide`} className="hover:text-primary-600">
              {locale === 'zh' ? '痛经健康指南' : 'Health Guide'}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">
              {locale === 'zh' ? 'A-Z缓解方法' : 'A-Z Relief Methods'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? 'A-Z缓解方法' : 'A-Z Relief Methods'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '从A到Z的全面缓解方法，包括即时和长期策略，帮助您找到最适合的痛经管理方案。'
            : 'Comprehensive relief methods from A to Z, including immediate and long-term strategies to help you find the most suitable menstrual pain management plan.'
          }
        </p>
      </header>

      {/* Introduction */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '如何使用这个指南' : 'How to Use This Guide'}
        </h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          {locale === 'zh'
            ? '这个A-Z指南包含了各种经过验证的痛经缓解方法。每个人的身体反应不同，建议您尝试多种方法，找到最适合自己的组合。记住，持续性和耐心是成功的关键。'
            : 'This A-Z guide contains various proven menstrual pain relief methods. Since everyone\'s body responds differently, we recommend trying multiple approaches to find the combination that works best for you. Remember, consistency and patience are key to success.'
          }
        </p>
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-2">
            {locale === 'zh' ? '使用建议：' : 'Usage Tips:'}
          </h3>
          <ul className="list-disc list-inside text-neutral-600 space-y-1 text-sm">
            <li>{locale === 'zh' ? '从简单易行的方法开始' : 'Start with simple and easy methods'}</li>
            <li>{locale === 'zh' ? '记录哪些方法对您有效' : 'Record which methods work for you'}</li>
            <li>{locale === 'zh' ? '结合多种方法以获得最佳效果' : 'Combine multiple methods for best results'}</li>
            <li>{locale === 'zh' ? '如有疑问，请咨询医疗专业人士' : 'Consult healthcare professionals if in doubt'}</li>
          </ul>
        </div>
      </section>

      {/* A-Z Methods */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-8 text-center">
          {locale === 'zh' ? '缓解方法大全' : 'Complete Relief Methods'}
        </h2>
        
        <div className="space-y-8">
          {reliefMethods.map((section) => (
            <div key={section.letter} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  {section.letter}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800">
                  {locale === 'zh' ? `${section.letter} 开头的方法` : `Methods Starting with ${section.letter}`}
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {section.methods.map((method, index) => (
                  <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-600 mb-2">
                      {method.name}
                    </h4>
                    <p className="text-neutral-600 text-sm">
                      {method.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Reference */}
      <section className="bg-secondary-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '快速参考' : 'Quick Reference'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-green-600 mb-2">
              {locale === 'zh' ? '即时缓解' : 'Immediate Relief'}
            </h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '热敷' : 'Heat therapy'}</li>
              <li>• {locale === 'zh' ? '深呼吸' : 'Deep breathing'}</li>
              <li>• {locale === 'zh' ? '穴位按摩' : 'Acupressure'}</li>
              <li>• {locale === 'zh' ? '温水浴' : 'Warm bath'}</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">
              {locale === 'zh' ? '中期管理' : 'Medium-term Management'}
            </h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '规律运动' : 'Regular exercise'}</li>
              <li>• {locale === 'zh' ? '瑜伽练习' : 'Yoga practice'}</li>
              <li>• {locale === 'zh' ? '饮食调整' : 'Diet modification'}</li>
              <li>• {locale === 'zh' ? '压力管理' : 'Stress management'}</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-purple-600 mb-2">
              {locale === 'zh' ? '长期预防' : 'Long-term Prevention'}
            </h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• {locale === 'zh' ? '生活方式改变' : 'Lifestyle changes'}</li>
              <li>• {locale === 'zh' ? '营养补充' : 'Nutritional supplements'}</li>
              <li>• {locale === 'zh' ? '中医调理' : 'TCM conditioning'}</li>
              <li>• {locale === 'zh' ? '定期检查' : 'Regular check-ups'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="bg-accent-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '相关资源' : 'Related Resources'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/${locale}/scenario-solutions`} className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-primary-600 mb-2">
              {locale === 'zh' ? '情景解决方案' : 'Scenario Solutions'}
            </h3>
            <p className="text-neutral-600 text-sm">
              {locale === 'zh' ? '针对特定情况的专业解决方案' : 'Professional solutions for specific situations'}
            </p>
          </Link>
          
          <Link href={`/${locale}/interactive-tools`} className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-primary-600 mb-2">
              {locale === 'zh' ? '互动工具' : 'Interactive Tools'}
            </h3>
            <p className="text-neutral-600 text-sm">
              {locale === 'zh' ? '个性化评估和追踪工具' : 'Personalized assessment and tracking tools'}
            </p>
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide/understanding-pain`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '上一章：理解痛经' : 'Previous: Understanding Pain'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide/lifestyle`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '下一章：生活方式管理' : 'Next: Lifestyle Management'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
        </div>
      </div>
    </div>
  );
}
