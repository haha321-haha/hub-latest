import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Moon, 
  Volume2, 
  Bed, 
  Coffee,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Thermometer,
  Heart
} from 'lucide-react';

// Types
type Locale = 'en' | 'zh';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'scenarioSolutionsPage' });
  
  return {
    title: `${t('scenarios.sleep.title')} - ${t('title')}`,
    description: t('scenarios.sleep.description'),
  };
}

export default async function SleepScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  const audioSystems = [
    {
      type: locale === 'zh' ? '白噪音音频' : 'White Noise Audio',
      icon: <Volume2 className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      description: locale === 'zh' ? '雨声、海浪声、风声、鸟鸣声等自然白噪音' : 'Rain, ocean waves, wind, bird sounds and other natural white noise',
      benefits: [
        locale === 'zh' ? '掩盖环境杂音，创造安静睡眠环境' : 'Mask environmental noise, create quiet sleep environment',
        locale === 'zh' ? '稳定频率刺激大脑产生α脑电波' : 'Stable frequency stimulates brain to produce alpha waves',
        locale === 'zh' ? '持续30-60分钟，缓解失眠和焦虑' : 'Play for 30-60 minutes, relieves insomnia and anxiety'
      ]
    },
    {
      type: locale === 'zh' ? '冥想引导音频' : 'Guided Meditation Audio',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      description: locale === 'zh' ? '专业冥想导师引导的睡眠冥想练习' : 'Sleep meditation practices guided by professional meditation instructors',
      benefits: [
        locale === 'zh' ? '引导深呼吸、身体扫描、放松冥想' : 'Guides deep breathing, body scanning, relaxation meditation',
        locale === 'zh' ? '将注意力从疼痛转移到内在平静' : 'Shifts attention from pain to inner peace',
        locale === 'zh' ? '15-20分钟逐步放松身体各部位' : '15-20 minutes gradually relaxing each body part'
      ]
    },
    {
      type: locale === 'zh' ? '生物反馈音乐' : 'Biofeedback Music',
      icon: <Thermometer className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
      description: locale === 'zh' ? '528Hz修复频率，抑制PGF2α合成酶活性' : '528Hz healing frequency, inhibits PGF2α synthase activity',
      benefits: [
        locale === 'zh' ? '科学频率缓解生理疼痛' : 'Scientific frequency relieves physiological pain',
        locale === 'zh' ? '促进细胞修复和再生' : 'Promotes cell repair and regeneration',
        locale === 'zh' ? '降低心率，放松肌肉' : 'Lowers heart rate, relaxes muscles'
      ]
    }
  ];

  const sleepPositions = [
    {
      position: locale === 'zh' ? '左侧卧位' : 'Left Side Position',
      effectiveness: '68%',
      description: locale === 'zh' ? '双腿夹孕妇枕，骨盆倾斜15°' : 'Pregnancy pillow between legs, pelvis tilted 15°',
      benefits: [
        locale === 'zh' ? '减轻子宫对腹主动脉的压迫' : 'Reduces uterine pressure on abdominal aorta',
        locale === 'zh' ? '改善子宫血液供应，减少疼痛' : 'Improves uterine blood supply, reduces pain',
        locale === 'zh' ? '促进经血顺畅排出' : 'Promotes smooth menstrual flow'
      ],
      tools: [locale === 'zh' ? '长条形抱枕' : 'Long body pillow', locale === 'zh' ? '孕妇枕' : 'Pregnancy pillow']
    },
    {
      position: locale === 'zh' ? '半仰卧位' : 'Semi-Supine Position',
      effectiveness: '55%',
      description: locale === 'zh' ? '膝下垫楔形枕，腰部完全悬空' : 'Wedge pillow under knees, lower back completely suspended',
      benefits: [
        locale === 'zh' ? '促进盆腔血液回流' : 'Promotes pelvic blood return',
        locale === 'zh' ? '减轻盆腔充血和肿胀' : 'Reduces pelvic congestion and swelling',
        locale === 'zh' ? '缓解下腹部疼痛' : 'Relieves lower abdominal pain'
      ],
      tools: [locale === 'zh' ? '楔形枕' : 'Wedge pillow', locale === 'zh' ? '腿部抬高垫' : 'Leg elevation pad']
    },
    {
      position: locale === 'zh' ? '蜷卧位（胎儿式）' : 'Fetal Position',
      effectiveness: '62%',
      description: locale === 'zh' ? '双膝间夹枕头，类似子宫内姿势' : 'Pillow between knees, similar to in-utero position',
      benefits: [
        locale === 'zh' ? '带来安全感和舒适感' : 'Provides sense of security and comfort',
        locale === 'zh' ? '缓解身体紧张和疼痛' : 'Relieves body tension and pain',
        locale === 'zh' ? '减轻髋部和腰部压力' : 'Reduces hip and lower back pressure'
      ],
      tools: [locale === 'zh' ? '膝间枕' : 'Knee pillow', locale === 'zh' ? '可微波暖宫枕' : 'Microwaveable warming pillow']
    }
  ];

  const bedtimeFoods = {
    recommended: [
      {
        food: locale === 'zh' ? '温牛奶+蜂蜜' : 'Warm Milk + Honey',
        component: locale === 'zh' ? '色氨酸+天然糖分' : 'Tryptophan + Natural sugars',
        benefit: locale === 'zh' ? '促进褪黑素分泌，帮助快速入睡' : 'Promotes melatonin secretion, helps fall asleep quickly'
      },
      {
        food: locale === 'zh' ? '香蕉+杏仁奶' : 'Banana + Almond Milk',
        component: locale === 'zh' ? '镁+色氨酸' : 'Magnesium + Tryptophan',
        benefit: locale === 'zh' ? '放松肌肉，缓解痉挛' : 'Relaxes muscles, relieves cramps'
      },
      {
        food: locale === 'zh' ? '樱桃汁' : 'Cherry Juice',
        component: locale === 'zh' ? '天然褪黑素' : 'Natural melatonin',
        benefit: locale === 'zh' ? '调节睡眠节律，改善睡眠质量' : 'Regulates sleep rhythm, improves sleep quality'
      },
      {
        food: locale === 'zh' ? '全麦面包+坚果' : 'Whole Grain Bread + Nuts',
        component: locale === 'zh' ? '复合碳水+镁' : 'Complex carbs + Magnesium',
        benefit: locale === 'zh' ? '稳定血糖，持续释放能量' : 'Stabilizes blood sugar, sustained energy release'
      }
    ],
    avoid: [
      {
        item: locale === 'zh' ? '咖啡因饮料' : 'Caffeinated beverages',
        reason: locale === 'zh' ? '睡前6小时内避免，刺激神经系统' : 'Avoid 6 hours before bed, stimulates nervous system'
      },
      {
        item: locale === 'zh' ? '酒精' : 'Alcohol',
        reason: locale === 'zh' ? '影响深度睡眠，可能增加经血流量' : 'Affects deep sleep, may increase menstrual flow'
      },
      {
        item: locale === 'zh' ? '高糖食物' : 'High-sugar foods',
        reason: locale === 'zh' ? '造成血糖波动，影响睡眠稳定性' : 'Causes blood sugar fluctuations, affects sleep stability'
      },
      {
        item: locale === 'zh' ? '辛辣食物' : 'Spicy foods',
        reason: locale === 'zh' ? '刺激肠胃，可能影响睡眠质量' : 'Irritates digestive system, may affect sleep quality'
      }
    ]
  };

  const sleepEnvironment = [
    {
      aspect: locale === 'zh' ? '声波疗法' : 'Sound Therapy',
      details: locale === 'zh' ? '432Hz子宫修复频率音频' : '432Hz uterine healing frequency audio',
      icon: <Volume2 className="w-5 h-5" />
    },
    {
      aspect: locale === 'zh' ? '光环境' : 'Light Environment',
      details: locale === 'zh' ? '琥珀色夜灯（抑制褪黑素干扰）' : 'Amber night light (prevents melatonin interference)',
      icon: <Moon className="w-5 h-5" />
    },
    {
      aspect: locale === 'zh' ? '触觉反馈' : 'Tactile Feedback',
      details: locale === 'zh' ? '重力被（7-9kg压力缓解焦虑）' : 'Weighted blanket (7-9kg pressure relieves anxiety)',
      icon: <Bed className="w-5 h-5" />
    },
    {
      aspect: locale === 'zh' ? '温度控制' : 'Temperature Control',
      details: locale === 'zh' ? '室温18-22℃，湿度50-60%' : 'Room temp 18-22℃, humidity 50-60%',
      icon: <Thermometer className="w-5 h-5" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12" data-page="scenario-sleep">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/scenario-solutions`} className="hover:text-primary-600 transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">{t('scenarios.sleep.title')}</span>
      </nav>

      {/* Page Header */}
      <header className="text-center">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Moon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('scenarios.sleep.title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('scenarios.sleep.description')}
        </p>
      </header>

      {/* Audio Systems Section */}
      <section className="bg-gradient-to-br from-purple-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <Volume2 className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '三维助眠音频系统' : 'Three-Dimensional Sleep Audio System'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {audioSystems.map((audio, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${audio.color} mb-4`}>
                {audio.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                {audio.type}
              </h3>
              <p className="text-neutral-600 mb-4 text-sm">
                {audio.description}
              </p>
              <ul className="space-y-2">
                {audio.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Sleep Positions Section */}
      <section>
        <div className="flex items-center mb-6">
          <Bed className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '科学睡姿矩阵' : 'Scientific Sleep Position Matrix'}
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {sleepPositions.map((position, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">
                  {position.position}
                </h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {locale === 'zh' ? '缓解率' : 'Relief Rate'} {position.effectiveness}
                </span>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">
                <strong>{locale === 'zh' ? '实施要点：' : 'Key Points: '}</strong>
                {position.description}
              </p>

              <div className="mb-4">
                <h4 className="font-medium text-neutral-800 mb-2">
                  {locale === 'zh' ? '功效：' : 'Benefits:'}
                </h4>
                <ul className="space-y-1">
                  {position.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-sm text-neutral-700">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-neutral-800 mb-2">
                  {locale === 'zh' ? '辅助工具：' : 'Support Tools:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {position.tools.map((tool, toolIndex) => (
                    <span key={toolIndex} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bedtime Nutrition Section */}
      <section>
        <div className="flex items-center mb-6">
          <Coffee className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '睡前饮食建议' : 'Bedtime Nutrition Recommendations'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              {locale === 'zh' ? '推荐食物' : 'Recommended Foods'}
            </h3>
            <div className="space-y-4">
              {bedtimeFoods.recommended.map((food, index) => (
                <div key={index} className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-medium text-green-800">{food.food}</h4>
                  <p className="text-sm text-green-600 mb-1">
                    <strong>{locale === 'zh' ? '主要成分：' : 'Key Components: '}</strong>
                    {food.component}
                  </p>
                  <p className="text-sm text-green-700">{food.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-4">
              {locale === 'zh' ? '避免食物' : 'Foods to Avoid'}
            </h3>
            <div className="space-y-4">
              {bedtimeFoods.avoid.map((item, index) => (
                <div key={index} className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-medium text-red-800">{item.item}</h4>
                  <p className="text-sm text-red-700">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Environment Section */}
      <section>
        <div className="flex items-center mb-6">
          <Moon className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '睡眠环境优化' : 'Sleep Environment Optimization'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sleepEnvironment.map((env, index) => (
            <div key={index} className="card text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {env.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {env.aspect}
              </h3>
              <p className="text-sm text-neutral-600">
                {env.details}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sleep Tips */}
      <section className="bg-yellow-50 p-6 md:p-8 rounded-xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '睡眠时间管理' : 'Sleep Time Management'}
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-yellow-700">
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '睡前2小时' : '2 Hours Before Bed'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '停止进食，避免消化负担' : 'Stop eating, avoid digestive burden'}</li>
              <li>• {locale === 'zh' ? '开始播放助眠音频' : 'Start playing sleep audio'}</li>
              <li>• {locale === 'zh' ? '调暗室内灯光' : 'Dim room lighting'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '睡前1小时' : '1 Hour Before Bed'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '温水洗澡，放松身心' : 'Warm bath, relax body and mind'}</li>
              <li>• {locale === 'zh' ? '进行轻柔拉伸运动' : 'Gentle stretching exercises'}</li>
              <li>• {locale === 'zh' ? '避免使用电子设备' : 'Avoid electronic devices'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '睡前30分钟' : '30 Minutes Before Bed'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '调整到最佳睡姿' : 'Adjust to optimal sleep position'}</li>
              <li>• {locale === 'zh' ? '使用暖宫贴或热水袋' : 'Use warming patches or hot water bottle'}</li>
              <li>• {locale === 'zh' ? '进行深呼吸练习' : 'Practice deep breathing'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Back to Overview */}
      <div className="text-center">
        <Link 
          href={`/${locale}/scenario-solutions`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回场景解决方案总览' : 'Back to Scenario Solutions Overview'}
        </Link>
      </div>
    </div>
  );
}
