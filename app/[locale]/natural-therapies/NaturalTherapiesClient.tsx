'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NaturalTherapiesClientProps {
  locale: string;
}

export default function NaturalTherapiesClient({ locale }: NaturalTherapiesClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 rounded-2xl">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {locale === 'zh' ? '自然疗法' : 'Natural Therapies'}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8">
                  {locale === 'zh'
                    ? '通过科学的自然疗法，安全有效地缓解痛经'
                    : 'Safe and effective menstrual pain relief through scientific natural therapies'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? '自然疗法概述' : 'Natural Therapy Overview'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'zh'
                ? '自然疗法是通过非药物手段缓解痛经症状的方法，包括物理疗法、草药疗法、饮食调整和运动等。'
                : 'Natural therapies are non-pharmacological methods to relieve menstrual pain symptoms, including physical therapy, herbal remedies, dietary adjustments, and exercise.'
              }
            </p>         
   
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* 1. Physical Therapy */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🔥</span>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">
                      {locale === 'zh' ? '物理疗法' : 'Physical Therapy'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '热敷、按摩、TENS等' : 'Heat therapy, massage, TENS, etc.'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '物理疗法通过外部物理手段改善血液循环、缓解肌肉紧张，是最直接有效的痛经缓解方法。'
                    : 'Physical therapy improves blood circulation and relieves muscle tension through external physical means.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '热敷垫 (40-45°C, 15-20分钟)' : 'Heat pad (40-45°C, 15-20 minutes)'}</li>
                  <li>• {locale === 'zh' ? '腹部按摩 (顺时针轻柔)' : 'Abdominal massage (clockwise, gentle)'}</li>
                  <li>• {locale === 'zh' ? 'TENS电疗 (经皮神经电刺激)' : 'TENS therapy (transcutaneous electrical nerve stimulation)'}</li>
                </ul>
              </div>

              {/* 2. Herbal Therapy */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🌿</span>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">
                      {locale === 'zh' ? '草药疗法' : 'Herbal Therapy'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '姜茶、当归、洋甘菊' : 'Ginger tea, Angelica, Chamomile'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '草药疗法利用植物的天然活性成分调节激素平衡、减少炎症，是温和而有效的调理方式。'
                    : 'Herbal therapy uses natural active compounds from plants to regulate hormonal balance and reduce inflammation.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '生姜茶 (抗炎、暖宫)' : 'Ginger tea (anti-inflammatory, warming)'}</li>
                  <li>• {locale === 'zh' ? '当归 (补血调经)' : 'Angelica (blood nourishing, menstrual regulation)'}</li>
                  <li>• {locale === 'zh' ? '洋甘菊茶 (镇静、解痉)' : 'Chamomile tea (calming, antispasmodic)'}</li>
                </ul>
              </div>

              {/* 3. Dietary Adjustment */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🍎</span>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">
                      {locale === 'zh' ? '饮食调整' : 'Dietary Adjustment'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '抗炎饮食、Omega-3' : 'Anti-inflammatory diet, Omega-3'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '通过科学的饮食调整，补充关键营养素，减少炎症反应，从根本上改善痛经症状。'
                    : 'Through scientific dietary adjustments and key nutrient supplementation, reduce inflammatory responses.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? 'Omega-3脂肪酸 (深海鱼、亚麻籽)' : 'Omega-3 fatty acids (fish, flaxseed)'}</li>
                  <li>• {locale === 'zh' ? '镁元素 (坚果、绿叶蔬菜)' : 'Magnesium (nuts, leafy greens)'}</li>
                  <li>• {locale === 'zh' ? '减少咖啡因和糖分摄入' : 'Reduce caffeine and sugar intake'}</li>
                </ul>
              </div>

              {/* 4. Yoga & Exercise */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🧘‍♀️</span>
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">
                      {locale === 'zh' ? '瑜伽运动' : 'Yoga & Exercise'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '体式、温和运动' : 'Poses, gentle exercise'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '特定的瑜伽体式和温和运动可以缓解盆腔紧张、改善血液循环，同时释放内啡肽缓解疼痛。'
                    : 'Specific yoga poses and gentle exercises can relieve pelvic tension and improve blood circulation.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '猫牛式 (缓解下背部紧张)' : 'Cat-cow pose (relieves lower back tension)'}</li>
                  <li>• {locale === 'zh' ? '婴儿式 (放松盆腔)' : 'Child\'s pose (relaxes pelvis)'}</li>
                  <li>• {locale === 'zh' ? '温和散步 (促进血液循环)' : 'Gentle walking (promotes circulation)'}</li>
                </ul>
              </div>

              {/* 5. Aromatherapy */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🌸</span>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800">
                      {locale === 'zh' ? '芳香疗法' : 'Aromatherapy'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '精油、香薰' : 'Essential oils, aromatherapy'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '通过天然植物精油的芳香分子，调节神经系统，缓解疼痛和情绪紧张。'
                    : 'Uses aromatic molecules from natural plant essential oils to regulate the nervous system and relieve pain and emotional tension.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '薰衣草精油 (镇静、止痛)' : 'Lavender oil (calming, pain relief)'}</li>
                  <li>• {locale === 'zh' ? '快乐鼠尾草 (调节激素)' : 'Clary sage (hormone regulation)'}</li>
                  <li>• {locale === 'zh' ? '罗马洋甘菊 (抗炎、舒缓)' : 'Roman chamomile (anti-inflammatory, soothing)'}</li>
                </ul>
              </div>

              {/* 6. Acupuncture & Moxibustion */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🪡</span>
                  <div>
                    <h3 className="text-lg font-bold text-orange-800">
                      {locale === 'zh' ? '针灸艾灸' : 'Acupuncture & Moxibustion'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '传统中医疗法' : 'Traditional Chinese Medicine'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '传统中医针灸通过刺激特定穴位，调节气血运行，平衡阴阳，从根本上治疗痛经。'
                    : 'Traditional Chinese acupuncture stimulates specific acupoints to regulate qi and blood flow, balance yin and yang.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '三阴交穴 (调经止痛)' : 'Sanyinjiao point (menstrual regulation, pain relief)'}</li>
                  <li>• {locale === 'zh' ? '关元穴 (温阳补气)' : 'Guanyuan point (warming yang, qi supplementation)'}</li>
                  <li>• {locale === 'zh' ? '艾灸神阙穴 (温经散寒)' : 'Moxibustion at Shenque (warming meridians)'}</li>
                </ul>
              </div>

              {/* 7. Psychological Techniques */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🧠</span>
                  <div>
                    <h3 className="text-lg font-bold text-indigo-800">
                      {locale === 'zh' ? '心理调节' : 'Psychological Techniques'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '冥想、呼吸法' : 'Meditation, breathing techniques'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '通过心理调节技术，降低疼痛敏感性，减少焦虑和压力，提高疼痛耐受性。'
                    : 'Uses psychological techniques to reduce pain sensitivity, decrease anxiety and stress, improve pain tolerance.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '深呼吸冥想 (4-7-8呼吸法)' : 'Deep breathing meditation (4-7-8 technique)'}</li>
                  <li>• {locale === 'zh' ? '正念冥想 (专注当下)' : 'Mindfulness meditation (present moment awareness)'}</li>
                  <li>• {locale === 'zh' ? '渐进性肌肉放松' : 'Progressive muscle relaxation'}</li>
                </ul>
              </div>

              {/* 8. Comprehensive Plans */}
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📋</span>
                  <div>
                    <h3 className="text-lg font-bold text-pink-800">
                      {locale === 'zh' ? '综合方案' : 'Comprehensive Plans'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'zh' ? '个性化组合' : 'Personalized combinations'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  {locale === 'zh'
                    ? '根据个人体质和症状特点，制定个性化的综合治疗方案，多种疗法协同作用，效果更佳。'
                    : 'Develop personalized comprehensive treatment plans based on individual constitution and symptoms for synergistic effects.'
                  }
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {locale === 'zh' ? '轻度痛经：热敷+瑜伽+草药茶' : 'Mild pain: Heat therapy + Yoga + Herbal tea'}</li>
                  <li>• {locale === 'zh' ? '中度痛经：按摩+针灸+饮食调整' : 'Moderate pain: Massage + Acupuncture + Diet'}</li>
                  <li>• {locale === 'zh' ? '重度痛经：多疗法组合+专业指导' : 'Severe pain: Multi-therapy + Professional guidance'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'zh' ? '相关资源' : 'Related Resources'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href={`/${locale}/interactive-tools/period-pain-assessment`}
                className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-800">
                  {locale === 'zh' ? '痛经评估工具' : 'Pain Assessment Tool'}
                </h3>
                <p className="text-sm text-blue-600">
                  {locale === 'zh' ? '评估痛经程度' : 'Assess pain level'}
                </p>
              </Link>
              <Link
                href={`/${locale}/scenario-solutions`}
                className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h3 className="font-semibold text-green-800">
                  {locale === 'zh' ? '场景解决方案' : 'Scenario Solutions'}
                </h3>
                <p className="text-sm text-green-600">
                  {locale === 'zh' ? '针对性解决方案' : 'Targeted solutions'}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}