import Link from 'next/link';
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import BottomRecommendations from '@/components/BottomRecommendations';

// SEO Metadata - 实现你建议的长标题策略
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? '痛经自然疗法大全 | 8种科学验证的缓解方法 [2025] - PeriodHub'
      : 'Complete Natural Menstrual Pain Relief Guide | 8 Science-Backed Methods [2025] - PeriodHub',
    description: isZh
      ? '探索8种科学验证的痛经自然疗法：从热敷到瑜伽，从草药到针灸。基于循证医学的完整指南，适用于青少年到职场女性。无副作用，安全有效。'
      : 'Explore 8 science-backed natural therapies for menstrual pain: from heat therapy to yoga, herbs to acupuncture. Complete evidence-based guide for teens to working women.',
    keywords: isZh ? [
      '痛经自然疗法', '痛经缓解方法', '经期疼痛自然疗法', '痛经调理', '经期不适', '自然止痛',
      '热敷缓解痛经', '瑜伽缓解痛经', '草药治疗痛经', '针灸治疗痛经', '按摩缓解痛经',
      '热敷', '敷热水袋', '暖宝宝', '按摩', '揉肚子', '止痛药',
      '痛经快速缓解5分钟', '青少年痛经怎么办', '职场女性痛经应对', '无药物痛经缓解'
    ] : [
      'natural menstrual pain relief', 'period pain natural remedies', 'menstrual cramps natural treatment',
      'heat therapy period pain', 'yoga for menstrual cramps', 'herbal remedies period pain',
      'acupuncture menstrual pain', 'massage period cramps', 'drug-free period pain relief'
    ],
    openGraph: {
      title: isZh 
        ? '痛经自然疗法大全 | 8种科学验证的缓解方法 [2025]'
        : 'Complete Natural Menstrual Pain Relief Guide | 8 Science-Backed Methods [2025]',
      description: isZh
        ? '探索8种科学验证的痛经自然疗法，无副作用，安全有效。'
        : 'Explore 8 science-backed natural therapies for menstrual pain relief.',
      url: `https://periodhub.health/${locale}/natural-therapies`,
      siteName: 'PeriodHub',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://periodhub.health/${locale}/natural-therapies`,
      languages: {
        'zh-CN': 'https://periodhub.health/zh/natural-therapies',
        'en-US': 'https://periodhub.health/en/natural-therapies',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 增强的结构化数据 - 医疗网页Schema
const getStructuredData = (locale: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "@id": `https://periodhub.health/${locale}/natural-therapies#webpage`,
      "name": locale === 'zh' ? "痛经自然疗法大全" : "Natural Menstrual Pain Relief Guide",
      "description": locale === 'zh'
        ? "探索8种科学验证的痛经自然疗法，包括物理疗法、草药疗法、饮食调整等"
        : "Explore 8 science-backed natural therapies for menstrual pain relief",
      "url": `https://periodhub.health/${locale}/natural-therapies`,
      "medicalAudience": {
        "@type": "MedicalAudience",
        "audienceType": "Patient"
      },
      "about": {
        "@type": "MedicalCondition",
        "name": locale === 'zh' ? "痛经" : "Dysmenorrhea"
      },
      "lastReviewed": "2025-08-16",
      "reviewedBy": {
        "@type": "Organization",
        "name": "PeriodHub Medical Team"
      }
    },
    {
      "@type": "FAQPage",
      "@id": `https://periodhub.health/${locale}/natural-therapies#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": locale === 'zh' ? "哪些自然疗法对痛经最有效？" : "Which natural therapies are most effective for menstrual pain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'zh'
              ? "最有效的自然疗法包括：热敷疗法（40-45°C，15-20分钟）、瑜伽体式（猫牛式、婴儿式）、草药茶（姜茶、洋甘菊茶）、腹部按摩和针灸。建议结合多种方法使用。"
              : "Most effective natural therapies include: heat therapy (40-45°C, 15-20 minutes), yoga poses (cat-cow, child's pose), herbal teas (ginger, chamomile), abdominal massage, and acupuncture. Combining multiple methods is recommended."
          }
        },
        {
          "@type": "Question",
          "name": locale === 'zh' ? "自然疗法多久能见效？" : "How quickly do natural therapies work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": locale === 'zh'
              ? "不同疗法见效时间不同：热敷和按摩5-15分钟内见效，瑜伽和呼吸法20-30分钟见效，草药茶需要30-60分钟，针灸通常在治疗后立即见效。"
              : "Different therapies work at different speeds: heat therapy and massage work in 5-15 minutes, yoga and breathing techniques in 20-30 minutes, herbal teas need 30-60 minutes, acupuncture usually works immediately after treatment."
          }
        }
      ]
    }
  ]
});

export default function NaturalTherapiesPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale);
  return (
    <>
      {/* 增强的结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData(locale))
        }}
      />
      
      {/* Natural Therapies Content */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 rounded-2xl">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                    {locale === 'zh' ? '自然疗法' : 'Natural Therapies'}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-90 mb-6 sm:mb-8">
                    {locale === 'zh'
                      ? '通过科学的自然疗法，安全有效地缓解痛经'
                      : 'Safe and effective menstrual pain relief through scientific natural therapies'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Scientific Foundation Section */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
                {locale === 'zh' ? '自然疗法的科学基础' : 'Scientific Foundation of Natural Therapies'}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 text-center max-w-4xl mx-auto">
                {locale === 'zh'
                  ? '自然疗法通过激活人体自愈机制，调动内在资源来缓解疼痛。现代医学研究证实，许多传统自然疗法具有明确的生理学基础，能够有效影响疼痛传导、炎症反应和肌肉功能。'
                  : 'Natural therapies activate the body\'s self-healing mechanisms and mobilize internal resources to relieve pain. Modern medical research confirms that many traditional natural therapies have clear physiological foundations that effectively influence pain transmission, inflammatory responses, and muscle function.'
                }
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🌿</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-green-700 text-sm sm:text-base">
                    {locale === 'zh' ? '无副作用' : 'No Side Effects'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {locale === 'zh' ? '避免药物依赖和不良反应' : 'Avoid drug dependence and adverse reactions'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">🔄</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-teal-700 text-sm sm:text-base">
                    {locale === 'zh' ? '整体调理' : 'Holistic Approach'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {locale === 'zh' ? '改善整体健康状态' : 'Improve overall health status'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-blue-700 text-sm sm:text-base">
                    {locale === 'zh' ? '经济实用' : 'Cost-Effective'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {locale === 'zh' ? '成本低廉，易于实施' : 'Low cost, easy to implement'}
                  </p>
                </div>
              </div>
            </div>

            {/* Natural Therapies Content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
                {locale === 'zh' ? '自然疗法详细指南' : 'Comprehensive Natural Therapy Guide'}
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* 1. Heat Therapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-white p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3 sm:mr-4 mb-3 sm:mb-0">
                        <span className="text-xl sm:text-2xl">🔥</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-1">
                          {locale === 'zh' ? '热敷疗法' : 'Heat Therapy'}
                      </h3>
                        <p className="text-red-600 font-medium text-sm sm:text-base">
                          {locale === 'zh' ? '科学验证的首选缓解方法' : 'Scientifically validated preferred relief method'}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                      {locale === 'zh'
                        ? '在下腹部或背部敷热可以帮助放松收缩的子宫肌肉并改善血液循环，从而缓解痉挛。'
                        : 'Applying heat to the lower abdomen or back can help relax contracting uterine muscles and improve blood circulation, thereby relieving cramps.'
                      }
                    </p>
                    
                    {/* Scientific Parameters */}
                    <div className="bg-red-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                      <h4 className="font-semibold text-red-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        {locale === 'zh' ? '科学参数' : 'Scientific Parameters'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div><strong>{locale === 'zh' ? '温度：' : 'Temperature: '}</strong>40-45°C (104-113°F)</div>
                        <div><strong>{locale === 'zh' ? '时长：' : 'Duration: '}</strong>15-20分钟 / minutes</div>
                        <div><strong>{locale === 'zh' ? '频率：' : 'Frequency: '}</strong>{locale === 'zh' ? '根据需要使用，最多3-4次/天' : 'As needed, up to 3-4 times daily'}</div>
                        <div><strong>{locale === 'zh' ? '时机：' : 'Timing: '}</strong>{locale === 'zh' ? '疼痛开始时，持续2-3天' : 'At onset of pain, continue for 2-3 days'}</div>
                      </div>
                      <p className="text-xs text-red-700 mt-3">
                        <strong>{locale === 'zh' ? '作用机制：' : 'Mechanism: '}</strong>
                        {locale === 'zh' ? '增加血流，放松子宫肌肉' : 'Increases blood flow, relaxes uterine muscles'}
                      </p>
                    </div>
                    
                    {/* Scientific Mechanism */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '科学机制深度解析' : 'Scientific Mechanism Analysis'}
                      </h4>
                      <div className="space-y-3">
                        <div className="border-l-4 border-red-400 pl-4">
                          <h5 className="font-semibold text-red-700 mb-1">
                            {locale === 'zh' ? '闸门控制理论' : 'Gate Control Theory'}
                          </h5>
                          <p className="text-sm text-gray-700">
                            {locale === 'zh'
                              ? '热敷激活皮肤大直径神经纤维，在脊髓层面抑制疼痛纤维的信号传导，从而在疼痛信号到达大脑之前就被"闸门"关闭。'
                              : 'Heat activates large-diameter nerve fibers in the skin, which inhibit pain fiber signals at the spinal level, effectively "closing the gate" before pain signals reach the brain.'
                            }
                          </p>
                  </div>
                        <div className="border-l-4 border-orange-400 pl-4">
                          <h5 className="font-semibold text-orange-700 mb-1">
                            {locale === 'zh' ? '血管扩张与循环改善' : 'Vasodilation & Circulation Improvement'}
                          </h5>
                          <p className="text-sm text-gray-700">
                    {locale === 'zh'
                              ? '热量使局部血管平滑肌松弛，血管直径增加20-30%，血流量增加40-50%，改善的血液循环带走痛性代谢产物。'
                              : 'Heat relaxes local vascular smooth muscle, increasing vessel diameter by 20-30% and blood flow by 40-50%, improving circulation to remove pain-causing metabolites.'
                    }
                  </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Guidelines */}
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        {locale === 'zh' ? '安全注意事项' : 'Safety Guidelines'}
                      </h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• {locale === 'zh' ? '避免温度超过48°C，存在烫伤风险' : 'Avoid temperatures above 48°C to prevent burns'}</p>
                        <p>• {locale === 'zh' ? '糖尿病患者需谨慎使用' : 'Use with caution in diabetic patients'}</p>
                        <p>• {locale === 'zh' ? '皮肤破损或感染时禁用' : 'Avoid on broken or infected skin'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Herbal Therapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                        <span className="text-2xl">🌿</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-green-700">
                          {locale === 'zh' ? '草本疗法' : 'Herbal Therapy'}
                      </h3>
                        <p className="text-green-600 font-medium">
                          {locale === 'zh' ? '植物药学的科学应用' : 'Scientific application of plant medicine'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                        ? '草本疗法利用植物的天然活性成分调节激素平衡、减少炎症，是温和而有效的调理方式。'
                      : 'Herbal therapy uses natural active compounds from plants to regulate hormonal balance and reduce inflammation.'
                    }
                  </p>
                    
                    {/* Key Herbs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3">
                          {locale === 'zh' ? '生姜 - 温阳散寒' : 'Ginger - Warming & Anti-inflammatory'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '活性成分：' : 'Active compounds: '}</strong>6-姜酚、8-姜酚</p>
                          <p><strong>{locale === 'zh' ? '作用机制：' : 'Mechanism: '}</strong>{locale === 'zh' ? '抑制环氧化酶-2，减少前列腺素合成' : 'Inhibits COX-2, reduces prostaglandin synthesis'}</p>
                          <p><strong>{locale === 'zh' ? '临床证据：' : 'Clinical evidence: '}</strong>{locale === 'zh' ? '每日1-1.5g生姜粉，减轻痛经强度达62%' : '1-1.5g ginger powder daily reduces pain intensity by 62%'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {locale === 'zh' ? '当归 - 妇科圣药' : 'Angelica - Women\'s Tonic'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '活性成分：' : 'Active compounds: '}</strong>{locale === 'zh' ? '挥发油、有机酸、多糖类' : 'Volatile oils, organic acids, polysaccharides'}</p>
                          <p><strong>{locale === 'zh' ? '作用机制：' : 'Mechanism: '}</strong>{locale === 'zh' ? '双向调节子宫平滑肌，改善微循环' : 'Bidirectional regulation of uterine smooth muscle, improves microcirculation'}</p>
                          <p><strong>{locale === 'zh' ? '经典方剂：' : 'Classic formula: '}</strong>{locale === 'zh' ? '四物汤、当归补血汤' : 'Si Wu Tang, Dang Gui Bu Xue Tang'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Usage Guidelines */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '使用指导' : 'Usage Guidelines'}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{locale === 'zh' ? '生姜茶制作' : 'Ginger Tea Preparation'}</h5>
                          <p className="text-gray-700">
                            {locale === 'zh' ? '鲜姜15g + 红糖30g，煮水15分钟，适于寒性痛经' : 'Fresh ginger 15g + brown sugar 30g, boil for 15 minutes, suitable for cold-type dysmenorrhea'}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{locale === 'zh' ? '当归煎剂' : 'Angelica Decoction'}</h5>
                          <p className="text-gray-700">
                            {locale === 'zh' ? '15-30g水煎，经前一周开始服用，连续3-5天' : '15-30g decoction, start one week before menstruation, continue for 3-5 days'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Reminder */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        {locale === 'zh' ? '安全提醒' : 'Safety Reminder'}
                      </h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <p>• {locale === 'zh' ? '首次使用应咨询中医师或药师' : 'Consult TCM practitioner or pharmacist before first use'}</p>
                        <p>• {locale === 'zh' ? '孕妇或备孕期妇女禁用活血化瘀类中药' : 'Avoid blood-activating herbs during pregnancy or when trying to conceive'}</p>
                        <p>• {locale === 'zh' ? '注意观察过敏反应，如有不适立即停用' : 'Watch for allergic reactions, discontinue if discomfort occurs'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Dietary Adjustment - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                        <span className="text-2xl">🍎</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-blue-700">
                        {locale === 'zh' ? '饮食调整' : 'Dietary Adjustment'}
                      </h3>
                        <p className="text-blue-600 font-medium">
                          {locale === 'zh' ? '抗炎饮食的科学应用' : 'Scientific application of anti-inflammatory diet'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                      ? '通过科学的饮食调整，补充关键营养素，减少炎症反应，从根本上改善痛经症状。'
                      : 'Through scientific dietary adjustments and key nutrient supplementation, reduce inflammatory responses.'
                    }
                  </p>
                    
                    {/* Key Nutrients Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          {locale === 'zh' ? 'Omega-3脂肪酸' : 'Omega-3 Fatty Acids'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '深海鱼、亚麻籽、核桃' : 'Deep-sea fish, flaxseed, walnuts'}
                        </p>
                        <p className="text-xs text-blue-600">
                          {locale === 'zh' ? '抑制前列腺素合成，减少炎症' : 'Inhibits prostaglandin synthesis, reduces inflammation'}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          {locale === 'zh' ? '镁元素' : 'Magnesium'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '坚果、绿叶蔬菜、全谷物' : 'Nuts, leafy greens, whole grains'}
                        </p>
                        <p className="text-xs text-green-600">
                          {locale === 'zh' ? '放松肌肉，缓解痉挛' : 'Relaxes muscles, relieves cramps'}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">
                          {locale === 'zh' ? '维生素B6' : 'Vitamin B6'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '香蕉、土豆、鸡肉' : 'Bananas, potatoes, chicken'}
                        </p>
                        <p className="text-xs text-purple-600">
                          {locale === 'zh' ? '调节激素平衡' : 'Regulates hormonal balance'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Anti-inflammatory Foods */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '抗炎食物推荐' : 'Anti-inflammatory Foods'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{locale === 'zh' ? '推荐食物' : 'Recommended Foods'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '三文鱼、沙丁鱼（富含Omega-3）' : 'Salmon, sardines (rich in Omega-3)'}</li>
                            <li>• {locale === 'zh' ? '菠菜、羽衣甘蓝（富含镁）' : 'Spinach, kale (rich in magnesium)'}</li>
                            <li>• {locale === 'zh' ? '姜黄、生姜（天然抗炎）' : 'Turmeric, ginger (natural anti-inflammatory)'}</li>
                            <li>• {locale === 'zh' ? '浆果类（抗氧化）' : 'Berries (antioxidant-rich)'}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-700 mb-2">{locale === 'zh' ? '避免食物' : 'Foods to Avoid'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '高糖食物（增加炎症）' : 'High-sugar foods (increase inflammation)'}</li>
                            <li>• {locale === 'zh' ? '精制碳水化合物' : 'Refined carbohydrates'}</li>
                            <li>• {locale === 'zh' ? '过量咖啡因' : 'Excessive caffeine'}</li>
                            <li>• {locale === 'zh' ? '加工肉类' : 'Processed meats'}</li>
                  </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Yoga & Exercise - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-purple-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-4">
                        <span className="text-2xl">🧘‍♀️</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-purple-700">
                        {locale === 'zh' ? '瑜伽运动' : 'Yoga & Exercise'}
                      </h3>
                        <p className="text-purple-600 font-medium">
                          {locale === 'zh' ? '身心合一的自然疗法' : 'Mind-body integrated natural therapy'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                      ? '特定的瑜伽体式和温和运动可以缓解盆腔紧张、改善血液循环，同时释放内啡肽缓解疼痛。'
                        : 'Specific yoga poses and gentle exercises can relieve pelvic tension and improve blood circulation while releasing endorphins to relieve pain.'
                    }
                  </p>
                    
                    {/* Key Poses Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {locale === 'zh' ? '推荐瑜伽体式' : 'Recommended Yoga Poses'}
                        </h4>
                        <div className="space-y-3">
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{locale === 'zh' ? '猫牛式' : 'Cat-Cow Pose'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '缓解下背部紧张，改善脊柱灵活性' : 'Relieves lower back tension, improves spinal flexibility'}</p>
                          </div>
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{locale === 'zh' ? '婴儿式' : 'Child\'s Pose'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '放松盆腔，拉伸下背部' : 'Relaxes pelvis, stretches lower back'}</p>
                          </div>
                          <div className="border-l-2 border-purple-300 pl-3">
                            <h5 className="font-medium text-purple-700">{locale === 'zh' ? '仰卧扭转' : 'Supine Twist'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '释放下背部和髋部紧张' : 'Releases lower back and hip tension'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {locale === 'zh' ? '运动科学原理' : 'Exercise Science'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '内啡肽释放：' : 'Endorphin release: '}</strong>{locale === 'zh' ? '运动促进天然止痛物质分泌' : 'Exercise promotes natural pain-relieving substances'}</p>
                          <p><strong>{locale === 'zh' ? '血液循环：' : 'Blood circulation: '}</strong>{locale === 'zh' ? '改善盆腔和子宫血流' : 'Improves pelvic and uterine blood flow'}</p>
                          <p><strong>{locale === 'zh' ? '肌肉放松：' : 'Muscle relaxation: '}</strong>{locale === 'zh' ? '缓解子宫平滑肌痉挛' : 'Relieves uterine smooth muscle spasms'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Practice Guidelines */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '练习指导' : 'Practice Guidelines'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-purple-700 mb-2">{locale === 'zh' ? '练习时机' : 'Practice Timing'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '经期前一周开始预防性练习' : 'Start preventive practice one week before menstruation'}</li>
                            <li>• {locale === 'zh' ? '经期期间进行温和体式' : 'Practice gentle poses during menstruation'}</li>
                            <li>• {locale === 'zh' ? '疼痛时立即进行缓解体式' : 'Practice relief poses immediately when pain occurs'}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{locale === 'zh' ? '注意事项' : 'Precautions'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '避免倒立体式' : 'Avoid inverted poses'}</li>
                            <li>• {locale === 'zh' ? '不要过度拉伸' : 'Don\'t overstretch'}</li>
                            <li>• {locale === 'zh' ? '倾听身体信号' : 'Listen to your body\'s signals'}</li>
                  </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Aromatherapy - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <span className="text-2xl">🌸</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-yellow-700">
                        {locale === 'zh' ? '芳香疗法' : 'Aromatherapy'}
                      </h3>
                        <p className="text-yellow-600 font-medium">
                          {locale === 'zh' ? '气味分子的治疗科学' : 'Therapeutic science of aromatic molecules'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                      ? '通过天然植物精油的芳香分子，调节神经系统，缓解疼痛和情绪紧张。'
                      : 'Uses aromatic molecules from natural plant essential oils to regulate the nervous system and relieve pain and emotional tension.'
                    }
                  </p>
                    
                    {/* Key Oils Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">
                          {locale === 'zh' ? '薰衣草' : 'Lavender'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '镇静、止痛、助眠' : 'Calming, pain relief, sleep aid'}
                        </p>
                        <p className="text-xs text-purple-600">
                          {locale === 'zh' ? '增加GABA，减少皮质醇' : 'Increases GABA, reduces cortisol'}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          {locale === 'zh' ? '快乐鼠尾草' : 'Clary Sage'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '调节激素、平衡情绪' : 'Hormone regulation, mood balance'}
                        </p>
                        <p className="text-xs text-green-600">
                          {locale === 'zh' ? '调节雌激素水平' : 'Regulates estrogen levels'}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          {locale === 'zh' ? '罗马洋甘菊' : 'Roman Chamomile'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {locale === 'zh' ? '抗炎、舒缓、解痉' : 'Anti-inflammatory, soothing, antispasmodic'}
                        </p>
                        <p className="text-xs text-blue-600">
                          {locale === 'zh' ? '特别适合敏感肌肤' : 'Especially suitable for sensitive skin'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Usage Methods */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '使用方法' : 'Usage Methods'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-yellow-700 mb-2">{locale === 'zh' ? '按摩油配方' : 'Massage Oil Blend'}</h5>
                          <p className="text-gray-700 mb-2">
                            {locale === 'zh' ? '薰衣草3滴 + 快乐鼠尾草2滴 + 基础油10ml' : '3 drops lavender + 2 drops clary sage + 10ml carrier oil'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {locale === 'zh' ? '顺时针轻柔按摩下腹部10-15分钟' : 'Gently massage lower abdomen clockwise for 10-15 minutes'}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{locale === 'zh' ? '香薰扩散' : 'Aromatherapy Diffusion'}</h5>
                          <p className="text-gray-700 mb-2">
                            {locale === 'zh' ? '薰衣草2滴 + 罗马洋甘菊1滴' : '2 drops lavender + 1 drop Roman chamomile'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {locale === 'zh' ? '持续扩散30-45分钟' : 'Diffuse for 30-45 minutes'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Safety Guidelines */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        {locale === 'zh' ? '安全使用指南' : 'Safety Guidelines'}
                      </h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <p>• {locale === 'zh' ? '精油需稀释后使用，避免直接接触皮肤' : 'Essential oils must be diluted before use, avoid direct skin contact'}</p>
                        <p>• {locale === 'zh' ? '首次使用前进行敏感性测试' : 'Perform sensitivity test before first use'}</p>
                        <p>• {locale === 'zh' ? '孕期、哺乳期使用前需咨询专业人员' : 'Consult professionals before use during pregnancy or breastfeeding'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Acupuncture & Moxibustion - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mr-4">
                        <span className="text-2xl">🪡</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-orange-700">
                        {locale === 'zh' ? '针灸艾灸' : 'Acupuncture & Moxibustion'}
                      </h3>
                        <p className="text-orange-600 font-medium">
                          {locale === 'zh' ? '传统智慧的现代验证' : 'Traditional wisdom with modern validation'}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      {locale === 'zh'
                        ? '传统中医针灸通过刺激特定穴位，调节气血运行，平衡阴阳，从根本上治疗痛经。现代医学研究证实其有效性。'
                        : 'Traditional Chinese acupuncture stimulates specific acupoints to regulate qi and blood flow, balance yin and yang. Modern medical research confirms its effectiveness.'
                      }
                    </p>
                    
                    {/* Key Acupoints */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-3">
                          {locale === 'zh' ? '主要穴位' : 'Key Acupoints'}
                        </h4>
                        <div className="space-y-3">
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{locale === 'zh' ? '三阴交 (SP6)' : 'Sanyinjiao (SP6)'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '内踝上3寸，调经止痛' : '3 cun above inner ankle, regulates menstruation and relieves pain'}</p>
                          </div>
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{locale === 'zh' ? '关元 (CV4)' : 'Guanyuan (CV4)'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '脐下3寸，温阳补气' : '3 cun below navel, warms yang and supplements qi'}</p>
                          </div>
                          <div className="border-l-2 border-orange-300 pl-3">
                            <h5 className="font-medium text-orange-700">{locale === 'zh' ? '神阙 (CV8)' : 'Shenque (CV8)'}</h5>
                            <p className="text-sm text-gray-600">{locale === 'zh' ? '脐中，艾灸温经散寒' : 'Center of navel, moxibustion warms meridians'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">
                          {locale === 'zh' ? '现代医学机制' : 'Modern Medical Mechanisms'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '神经调节：' : 'Neural regulation: '}</strong>{locale === 'zh' ? '激活下行抑制系统' : 'Activates descending inhibitory system'}</p>
                          <p><strong>{locale === 'zh' ? '内分泌调节：' : 'Endocrine regulation: '}</strong>{locale === 'zh' ? '调节下丘脑-垂体-卵巢轴' : 'Regulates HPO axis'}</p>
                          <p><strong>{locale === 'zh' ? '循证医学：' : 'Evidence-based: '}</strong>{locale === 'zh' ? 'Cochrane系统评价有效率88.5%' : 'Cochrane review shows 88.5% effectiveness'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Self-Massage Guide */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '自我穴位按摩' : 'Self-Acupoint Massage'}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>{locale === 'zh' ? '三阴交：' : 'Sanyinjiao: '}</strong>{locale === 'zh' ? '拇指按压小腿内侧，踝关节上4指宽处，每次3-5分钟' : 'Press with thumb on inner leg, 4 finger widths above ankle, 3-5 minutes each time'}</p>
                        <p>• <strong>{locale === 'zh' ? '关元：' : 'Guanyuan: '}</strong>{locale === 'zh' ? '肚脐下4指宽处，双手交叉温和按压5-10分钟' : '4 finger widths below navel, gentle circular massage for 5-10 minutes'}</p>
                        <p className="text-xs text-orange-600 mt-2">
                          {locale === 'zh' ? '注意：自我按摩仅为辅助方法，不能替代专业针灸治疗' : 'Note: Self-massage is supplementary only, cannot replace professional acupuncture treatment'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Psychological Techniques - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-indigo-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-4">
                        <span className="text-2xl">🧠</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-700">
                          {locale === 'zh' ? '心理调节技术' : 'Psychological Techniques'}
                      </h3>
                        <p className="text-indigo-600 font-medium">
                          {locale === 'zh' ? '身心合一的疼痛管理' : 'Mind-body integrated pain management'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                      ? '通过心理调节技术，降低疼痛敏感性，减少焦虑和压力，提高疼痛耐受性。'
                      : 'Uses psychological techniques to reduce pain sensitivity, decrease anxiety and stress, improve pain tolerance.'
                    }
                  </p>
                    
                    {/* Techniques Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 mb-3">
                          {locale === 'zh' ? '4-7-8呼吸法' : '4-7-8 Breathing Technique'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '步骤：' : 'Steps: '}</strong>{locale === 'zh' ? '吸气4秒，憋气7秒，呼气8秒' : 'Inhale 4 seconds, hold 7 seconds, exhale 8 seconds'}</p>
                          <p><strong>{locale === 'zh' ? '频率：' : 'Frequency: '}</strong>{locale === 'zh' ? '每次3-4个循环，每日2-3次' : '3-4 cycles each time, 2-3 times daily'}</p>
                          <p><strong>{locale === 'zh' ? '效果：' : 'Effect: '}</strong>{locale === 'zh' ? '激活副交感神经系统，减少疼痛感知40%' : 'Activates parasympathetic nervous system, reduces pain perception by 40%'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {locale === 'zh' ? '正念冥想' : 'Mindfulness Meditation'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>{locale === 'zh' ? '方法：' : 'Method: '}</strong>{locale === 'zh' ? '专注当下，观察而不评判' : 'Focus on present moment, observe without judgment'}</p>
                          <p><strong>{locale === 'zh' ? '时长：' : 'Duration: '}</strong>{locale === 'zh' ? '每日10-20分钟' : '10-20 minutes daily'}</p>
                          <p><strong>{locale === 'zh' ? '效果：' : 'Effect: '}</strong>{locale === 'zh' ? '提高疼痛耐受性，减少情绪波动' : 'Increases pain tolerance, reduces emotional fluctuations'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progressive Muscle Relaxation */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '渐进性肌肉放松' : 'Progressive Muscle Relaxation'}
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>• {locale === 'zh' ? '从脚趾开始，依次紧张和放松每个肌肉群' : 'Start from toes, tense and relax each muscle group sequentially'}</p>
                        <p>• {locale === 'zh' ? '每个部位紧张5秒，放松10秒' : 'Tense each area for 5 seconds, relax for 10 seconds'}</p>
                        <p>• {locale === 'zh' ? '整个过程15-20分钟，特别关注腹部和盆腔区域' : 'Total process 15-20 minutes, focus especially on abdominal and pelvic areas'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Comprehensive Plans - Detailed Card */}
                <div className="bg-white rounded-xl shadow-lg border-l-4 border-pink-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-50 to-white p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mr-4">
                        <span className="text-2xl">📋</span>
                      </div>
                    <div>
                        <h3 className="text-2xl font-bold text-pink-700">
                          {locale === 'zh' ? '综合治疗方案' : 'Comprehensive Treatment Plans'}
                      </h3>
                        <p className="text-pink-600 font-medium">
                          {locale === 'zh' ? '个性化组合策略' : 'Personalized combination strategies'}
                      </p>
                    </div>
                  </div>
                    
                    <p className="text-gray-700 mb-6">
                    {locale === 'zh'
                      ? '根据个人体质和症状特点，制定个性化的综合治疗方案，多种疗法协同作用，效果更佳。'
                      : 'Develop personalized comprehensive treatment plans based on individual constitution and symptoms for synergistic effects.'
                    }
                  </p>
                    
                    {/* Pain Level Plans */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-3">
                          {locale === 'zh' ? '轻度痛经 (1-3分)' : 'Mild Pain (1-3 points)'}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {locale === 'zh' ? '热敷 + 瑜伽' : 'Heat therapy + Yoga'}</li>
                          <li>• {locale === 'zh' ? '生姜茶 + 深呼吸' : 'Ginger tea + Deep breathing'}</li>
                          <li>• {locale === 'zh' ? '规律运动' : 'Regular exercise'}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-3">
                          {locale === 'zh' ? '中度痛经 (4-6分)' : 'Moderate Pain (4-6 points)'}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {locale === 'zh' ? '热敷 + 按摩 + 针灸' : 'Heat therapy + Massage + Acupuncture'}</li>
                          <li>• {locale === 'zh' ? '饮食调整 + 草药茶' : 'Diet adjustment + Herbal tea'}</li>
                          <li>• {locale === 'zh' ? '芳香疗法 + 冥想' : 'Aromatherapy + Meditation'}</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">
                          {locale === 'zh' ? '重度痛经 (7-10分)' : 'Severe Pain (7-10 points)'}
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• {locale === 'zh' ? '多疗法组合 + 专业指导' : 'Multi-therapy combination + Professional guidance'}</li>
                          <li>• {locale === 'zh' ? '药物辅助 + 自然疗法' : 'Medication assistance + Natural therapies'}</li>
                          <li>• {locale === 'zh' ? '持续监测 + 调整方案' : 'Continuous monitoring + Plan adjustment'}</li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Synergistic Effects */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {locale === 'zh' ? '协同增效原则' : 'Synergistic Enhancement Principles'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">{locale === 'zh' ? '增效组合' : 'Enhancing Combinations'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '热敷+芳疗：温度促进精油吸收' : 'Heat + Aromatherapy: Temperature enhances oil absorption'}</li>
                            <li>• {locale === 'zh' ? '按摩+草药：手法促进血液循环' : 'Massage + Herbs: Technique promotes blood circulation'}</li>
                            <li>• {locale === 'zh' ? '瑜伽+呼吸：体式配合呼吸模式' : 'Yoga + Breathing: Poses coordinate with breathing patterns'}</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-700 mb-2">{locale === 'zh' ? '个性化调整' : 'Personalized Adjustments'}</h5>
                          <ul className="space-y-1 text-gray-700">
                            <li>• {locale === 'zh' ? '寒性体质：重点温热疗法' : 'Cold constitution: Focus on warming therapies'}</li>
                            <li>• {locale === 'zh' ? '热性体质：选择清凉镇静方法' : 'Hot constitution: Choose cooling and calming methods'}</li>
                            <li>• {locale === 'zh' ? '气虚体质：温和方法，避免过度刺激' : 'Qi deficiency: Gentle methods, avoid overstimulation'}</li>
                  </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence-Based Medicine Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
                {locale === 'zh' ? '📊 循证医学证据总结' : '📊 Evidence-Based Medicine Summary'}
              </h2>
              
              {/* Core Efficacy Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">92%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {locale === 'zh' ? '热敷疗法有效率' : 'Heat Therapy Efficacy'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {locale === 'zh' ? 'RCT荟萃分析' : 'RCT Meta-analysis'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">76%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {locale === 'zh' ? 'TENS镇痛有效率' : 'TENS Pain Relief Efficacy'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {locale === 'zh' ? 'Cochrane综述' : 'Cochrane Review'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">85%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {locale === 'zh' ? '针灸综合有效率' : 'Acupuncture Comprehensive Efficacy'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {locale === 'zh' ? '系统评价' : 'Systematic Review'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">68%</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {locale === 'zh' ? '芳疗心理改善率' : 'Aromatherapy Psychological Improvement'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {locale === 'zh' ? '临床试验' : 'Clinical Trials'}
                  </p>
                </div>
              </div>

              {/* High-Level Evidence Support */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center text-blue-700">
                  {locale === 'zh' ? '高级别证据支持' : 'High-Level Evidence Support'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? 'Cochrane系统性回顾确认热敷和TENS疗法的安全性和有效性'
                          : 'Cochrane systematic review confirms safety and efficacy of heat therapy and TENS'
                        }
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '多项RCT证实针灸在原发性痛经中的显著疗效'
                          : 'Multiple RCTs confirm significant efficacy of acupuncture in primary dysmenorrhea'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? 'WHO正式认可针灸治疗痛经等妇科疾病'
                          : 'WHO officially recognizes acupuncture for treating dysmenorrhea and gynecological diseases'
                        }
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '美国NIH支持芳香疗法在疼痛管理中的应用研究'
                          : 'US NIH supports research on aromatherapy applications in pain management'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-term Observational Studies */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center text-green-700">
                  {locale === 'zh' ? '长期效果观察研究' : 'Long-term Observational Studies'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '规律应用自然疗法3个月后，73%用户疼痛强度显著降低'
                          : 'After 3 months of regular natural therapy application, 73% of users experienced significant pain reduction'
                        }
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '综合疗法组相比单一疗法，缓解持续时间延长1.5-2倍'
                          : 'Combined therapy group showed 1.5-2 times longer relief duration compared to single therapy'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '依从性好的用户中，67%停止或减少了止痛药使用'
                          : 'Among users with good adherence, 67% stopped or reduced pain medication use'
                        }
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                      <p className="text-gray-700">
                        {locale === 'zh' 
                          ? '生活质量评分治疗后显著改善 (p<0.001)'
                          : 'Quality of life scores showed significant improvement post-therapy (p<0.001)'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="container mx-auto px-4 py-8">
        <section className="bg-primary-50 border-l-4 border-primary-500 p-4 sm:p-6 rounded-r-lg">
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed break-words">
            <strong className="text-primary-700">
              {locale === 'zh' ? '医疗免责声明：' : 'Medical Disclaimer:'}
            </strong>
            {locale === 'zh'
              ? '本指南中的信息仅供教育目的，不应替代专业医疗建议、诊断或治疗。如有任何健康问题，请咨询合格的医疗保健提供者。'
              : 'The information in this guide is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.'
            }
          </p>
        </section>
      </div>

      {/* 底部推荐工具 */}
      <BottomRecommendations currentPage="natural-therapies" />
    </>
  );
}