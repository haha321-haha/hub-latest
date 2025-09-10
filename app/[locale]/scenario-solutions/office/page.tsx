import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  Clock,
  Coffee,
  Users,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Thermometer,
  Utensils,
  Dumbbell,
  MessageCircle,
  Hand,
  Copy
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
    title: `${t('scenarios.office.title')} - ${t('title')}`,
    description: t('scenarios.office.description'),
  };
}

export default async function OfficeScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  const emergencyKitItems = [
    {
      category: locale === 'zh' ? '核心装备' : 'Core Equipment',
      items: [
        locale === 'zh' ? '可粘贴暖宝宝（ThermaCare隐形贴片）' : 'Adhesive heat patches (ThermaCare invisible patches)',
        locale === 'zh' ? '迷你电热护腰（USB充电款）' : 'Mini electric heating pad (USB rechargeable)',
        locale === 'zh' ? '姜茶冲剂条（无糖配方）' : 'Ginger tea sachets (sugar-free formula)',
        locale === 'zh' ? '应急能量胶（含镁+维生素B6）' : 'Emergency energy gel (with magnesium + vitamin B6)'
      ]
    },
    {
      category: locale === 'zh' ? '疼痛缓解' : 'Pain Relief',
      items: [
        locale === 'zh' ? '布洛芬/对乙酰氨基酚' : 'Ibuprofen/Acetaminophen',
        locale === 'zh' ? '薄荷膏（太阳穴按摩用）' : 'Peppermint balm (for temple massage)',
        locale === 'zh' ? '简易按摩工具' : 'Simple massage tools'
      ]
    },
    {
      category: locale === 'zh' ? '形象管理' : 'Image Management',
      items: [
        locale === 'zh' ? '镜子、唇膏、吸油纸' : 'Mirror, lipstick, oil blotting paper',
        locale === 'zh' ? '干发喷雾、除臭剂' : 'Dry shampoo, deodorant',
        locale === 'zh' ? '应急化妆品' : 'Emergency makeup'
      ]
    }
  ];

  const stretchExercises = [
    {
      name: locale === 'zh' ? '座椅骨盆时钟运动' : 'Chair Pelvic Clock Movement',
      description: locale === 'zh' ? '缓解骶髂关节压力，改善下背部血液循环' : 'Relieves sacroiliac joint pressure, improves lower back circulation',
      duration: locale === 'zh' ? '每次30秒，重复3-5次' : '30 seconds each, repeat 3-5 times',
      steps: [
        locale === 'zh' ? '坐在椅子边缘，双脚平放地面' : 'Sit on edge of chair, feet flat on floor',
        locale === 'zh' ? '想象骨盆是时钟，缓慢画圆' : 'Imagine pelvis as clock, slowly draw circles',
        locale === 'zh' ? '顺时针和逆时针各做一组' : 'Do one set clockwise and counterclockwise'
      ]
    },
    {
      name: locale === 'zh' ? '隐藏式足底按摩' : 'Hidden Foot Massage',
      description: locale === 'zh' ? '利用桌下筋膜球，促进下肢血液回流' : 'Use under-desk fascia ball to promote lower limb blood return',
      duration: locale === 'zh' ? '随时进行，每次2-3分钟' : 'Anytime, 2-3 minutes each',
      steps: [
        locale === 'zh' ? '在桌下放置小型按摩球' : 'Place small massage ball under desk',
        locale === 'zh' ? '脱掉鞋子，用脚底滚动按摩球' : 'Remove shoes, roll ball with sole of foot',
        locale === 'zh' ? '重点按压足弓和脚跟部位' : 'Focus on arch and heel areas'
      ]
    },
    {
      name: locale === 'zh' ? '饮水机旁侧腰拉伸' : 'Side Waist Stretch by Water Cooler',
      description: locale === 'zh' ? '自然站立姿势，缓解腰部紧张' : 'Natural standing position, relieves waist tension',
      duration: locale === 'zh' ? '每侧保持15-30秒' : 'Hold 15-30 seconds each side',
      steps: [
        locale === 'zh' ? '站在饮水机旁，双脚与肩同宽' : 'Stand by water cooler, feet shoulder-width apart',
        locale === 'zh' ? '一手扶腰，另一手向上伸展' : 'One hand on waist, other arm stretch up',
        locale === 'zh' ? '身体向一侧弯曲，感受侧腰拉伸' : 'Bend body to one side, feel side waist stretch'
      ]
    }
  ];

  const nutritionPlan = [
    {
      time: locale === 'zh' ? '早餐 (7:00-8:00)' : 'Breakfast (7:00-8:00)',
      foods: locale === 'zh' ? '燕麦粥+坚果+香蕉' : 'Oatmeal + nuts + banana',
      benefits: locale === 'zh' ? '提供持续能量，稳定血糖' : 'Provides sustained energy, stabilizes blood sugar'
    },
    {
      time: locale === 'zh' ? '上午茶 (10:00)' : 'Morning Tea (10:00)',
      foods: locale === 'zh' ? '红枣茶或玫瑰花茶' : 'Red date tea or rose tea',
      benefits: locale === 'zh' ? '温暖子宫，缓解痉挛' : 'Warms uterus, relieves cramps'
    },
    {
      time: locale === 'zh' ? '午餐 (12:00-13:00)' : 'Lunch (12:00-13:00)',
      foods: locale === 'zh' ? '瘦肉+深绿色蔬菜+糙米' : 'Lean meat + dark green vegetables + brown rice',
      benefits: locale === 'zh' ? '补铁补纤维，预防贫血' : 'Iron and fiber supplement, prevents anemia'
    },
    {
      time: locale === 'zh' ? '下午茶 (15:00)' : 'Afternoon Tea (15:00)',
      foods: locale === 'zh' ? '黑巧克力+温牛奶' : 'Dark chocolate + warm milk',
      benefits: locale === 'zh' ? '缓解情绪波动，补充镁元素' : 'Relieves mood swings, supplements magnesium'
    }
  ];

  // 沟通模板数据
  const communicationTemplates = [
    {
      scenario: locale === 'zh' ? '与伴侣沟通' : 'Communicating with Partner',
      icon: '💕',
      templates: [
        {
          situation: locale === 'zh' ? '通知告知' : 'Notification',
          tone: locale === 'zh' ? '亲密' : 'Intimate',
          template: locale === 'zh' ? '"亲爱的，我今天身体不太舒服，可能需要多休息一下。如果我看起来有点不舒服，请不要担心。"' : '"Honey, I\'m not feeling well today and might need more rest. If I seem uncomfortable, please don\'t worry."',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        },
        {
          situation: locale === 'zh' ? '寻求理解' : 'Seeking Understanding',
          tone: locale === 'zh' ? '亲密' : 'Intimate',
          template: locale === 'zh' ? '"我现在有些疼痛，可能情绪会有些波动。你能理解并给我一些时间和空间吗？我会尽快恢复的。"' : '"I\'m experiencing some pain and my emotions might fluctuate. Can you understand and give me some time and space? I\'ll recover soon."',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '与朋友沟通' : 'Communicating with Friends',
      icon: '👭',
      templates: [
        {
          situation: locale === 'zh' ? '约会改期' : 'Rescheduling Date',
          tone: locale === 'zh' ? '随意' : 'Casual',
          template: locale === 'zh' ? '"不好意思，我今天身体有点不太舒服，可能没法保持最佳状态。我们能改到下次吗？我会补偿你的！"' : '"Sorry, I\'m not feeling well today and might not be at my best. Can we reschedule? I\'ll make it up to you!"',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        },
        {
          situation: locale === 'zh' ? '聚会参与' : 'Party Participation',
          tone: locale === 'zh' ? '随意' : 'Casual',
          template: locale === 'zh' ? '"我可能会来聚会，但可能需要早点离开。如果我看起来有点累，你们理解就好。"' : '"I might come to the party but may need to leave early. If I look tired, please understand."',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '与同事沟通' : 'Communicating with Colleagues',
      icon: '👔',
      templates: [
        {
          situation: locale === 'zh' ? '请假申请' : 'Leave Request',
          tone: locale === 'zh' ? '正式' : 'Formal',
          template: locale === 'zh' ? '"您好，我今天身体不太舒服，可能需要请半天假去处理身体问题。我会尽快处理完其他事务的。"' : '"Hello, I\'m not feeling well today and may need to take half a day off to address health issues. I\'ll handle other matters as soon as possible."',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        },
        {
          situation: locale === 'zh' ? '工作调整' : 'Work Adjustment',
          tone: locale === 'zh' ? '正式' : 'Formal',
          template: locale === 'zh' ? '"不好意思，我今天身体有些不适，可能工作效率会有所影响。如果有急事请优先安排，其他事务我会尽快完成。"' : '"Sorry, I\'m feeling unwell today and my work efficiency might be affected. Please prioritize urgent matters, and I\'ll complete other tasks as soon as possible."',
          copyText: locale === 'zh' ? '复制文本' : 'Copy Text'
        }
      ]
    }
  ];

  // 穴位按压技巧
  const acupressurePoints = [
    {
      name: locale === 'zh' ? '合谷穴' : 'Hegu Point',
      location: locale === 'zh' ? '虎口处，拇指和食指之间' : 'Tiger mouth area, between thumb and index finger',
      benefits: locale === 'zh' ? '疏肝理气、活血化瘀，缓解全身疼痛' : 'Soothes liver qi, promotes blood circulation, relieves general pain',
      technique: locale === 'zh' ? '用拇指指腹按压，力度适中，每次30秒' : 'Press with thumb pad, moderate pressure, 30 seconds each time',
      officeUse: locale === 'zh' ? '可在开会时隐蔽进行，不引人注意' : 'Can be done discreetly during meetings without drawing attention'
    },
    {
      name: locale === 'zh' ? '三阴交穴' : 'Sanyinjiao Point',
      location: locale === 'zh' ? '小腿内侧，踝关节上三寸' : 'Inner side of lower leg, three fingers above ankle',
      benefits: locale === 'zh' ? '调理气血，专门缓解妇科疼痛' : 'Regulates qi and blood, specifically relieves gynecological pain',
      technique: locale === 'zh' ? '用拇指按压，配合深呼吸，每次1-2分钟' : 'Press with thumb, coordinate with deep breathing, 1-2 minutes each time',
      officeUse: locale === 'zh' ? '可在桌下进行，脱掉鞋子按压效果更好' : 'Can be done under desk, better effect when shoes are removed'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12" data-page="scenario-office">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/scenario-solutions`} className="hover:text-primary-600 transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">{t('scenarios.office.title')}</span>
      </nav>

      {/* Page Header */}
      <header className="text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('scenarios.office.title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('scenarios.office.description')}
        </p>
      </header>

      {/* Emergency Kit Section */}
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '会议应急包' : 'Meeting Emergency Kit'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {emergencyKitItems.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            {locale === 'zh' ? '隐蔽使用指南' : 'Discreet Usage Guide'}
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {locale === 'zh' ? '热敷贴启动借口："正在用暖宝宝缓解肩颈酸痛"' : 'Heat patch excuse: "Using heat pad for neck and shoulder pain"'}</li>
            <li>• {locale === 'zh' ? '突发疼痛离场话术："需要紧急处理客户邮件"' : 'Emergency exit phrase: "Need to handle urgent client email"'}</li>
          </ul>
        </div>
      </section>

      {/* Stretching Exercises Section */}
      <section>
        <div className="flex items-center mb-6">
          <Dumbbell className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '办公椅拉伸系统' : 'Office Chair Stretching System'}
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {stretchExercises.map((exercise, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                {exercise.name}
              </h3>
              <p className="text-neutral-600 mb-4">
                {exercise.description}
              </p>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.duration}
                </span>
              </div>
              <ol className="space-y-2">
                {exercise.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start text-sm text-neutral-700">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition Plan Section */}
      <section>
        <div className="flex items-center mb-6">
          <Utensils className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '职场饮食管理' : 'Workplace Nutrition Management'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {nutritionPlan.map((meal, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-3">
                <Coffee className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  {meal.time}
                </h3>
              </div>
              <p className="text-neutral-700 mb-2 font-medium">
                {meal.foods}
              </p>
              <p className="text-sm text-neutral-600">
                {meal.benefits}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-6 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3">
            {locale === 'zh' ? '避免食物清单' : 'Foods to Avoid'}
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-red-700">
            <div>
              <strong>{locale === 'zh' ? '冰饮类：' : 'Cold drinks:'}</strong>
              <p>{locale === 'zh' ? '冰咖啡、冷饮、冰水' : 'Iced coffee, cold drinks, ice water'}</p>
            </div>
            <div>
              <strong>{locale === 'zh' ? '高盐零食：' : 'High-salt snacks:'}</strong>
              <p>{locale === 'zh' ? '薯片、腌制食品' : 'Chips, pickled foods'}</p>
            </div>
            <div>
              <strong>{locale === 'zh' ? '过量咖啡因：' : 'Excessive caffeine:'}</strong>
              <p>{locale === 'zh' ? '浓咖啡、能量饮料' : 'Strong coffee, energy drinks'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Communication Templates Section */}
      <section>
        <div className="flex items-center mb-6">
          <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '沟通模板助手' : 'Communication Template Assistant'}
          </h2>
        </div>
        <p className="text-neutral-600 mb-8">
          {locale === 'zh' ? '经期不适时，与身边的人进行有效沟通。这些模板可以帮助你更好地表达需求和寻求理解。' : 'Effective communication with people around you during menstrual discomfort. These templates help you better express needs and seek understanding.'}
        </p>

        <div className="space-y-8">
          {communicationTemplates.map((category, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-neutral-50 p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">{category.icon}</span>
                <h3 className="text-xl font-semibold text-neutral-800">
                  {category.scenario}
                </h3>
              </div>

              <div className="grid md:grid-cols-1 gap-4">
                {category.templates.map((template, templateIndex) => (
                  <div key={templateIndex} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-neutral-800">{template.situation}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {template.tone}
                      </span>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-blue-800 leading-relaxed">
                        {template.template}
                      </p>
                    </div>

                    <div className="inline-flex items-center text-blue-600 text-sm font-medium">
                      <Copy className="w-4 h-4 mr-1" />
                      <span className="text-xs text-neutral-500">
                        {locale === 'zh' ? '可复制使用' : 'Copy to use'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Acupressure Points Section */}
      <section>
        <div className="flex items-center mb-6">
          <Hand className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '办公室穴位按压' : 'Office Acupressure Points'}
          </h2>
        </div>
        <p className="text-neutral-600 mb-8">
          {locale === 'zh' ? '简单易学的穴位按压技巧，可以在办公室隐蔽进行，快速缓解疼痛不适。' : 'Simple acupressure techniques that can be done discreetly in the office to quickly relieve pain and discomfort.'}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {acupressurePoints.map((point, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                {point.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '位置：' : 'Location:'}
                  </h4>
                  <p className="text-neutral-600 text-sm">{point.location}</p>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '功效：' : 'Benefits:'}
                  </h4>
                  <p className="text-neutral-600 text-sm">{point.benefits}</p>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-700 mb-2">
                    {locale === 'zh' ? '按压方法：' : 'Technique:'}
                  </h4>
                  <p className="text-neutral-600 text-sm">{point.technique}</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1 text-sm">
                    {locale === 'zh' ? '办公室应用：' : 'Office Application:'}
                  </h4>
                  <p className="text-blue-700 text-sm">{point.officeUse}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">
            {locale === 'zh' ? '科学依据' : 'Scientific Basis'}
          </h4>
          <p className="text-yellow-700 text-sm">
            {locale === 'zh' ? '穴位按压通过刺激特定神经点，促进内啡肽释放，这是人体天然的止痛物质。现代研究表明，适当的穴位刺激可以调节神经传导，缓解疼痛感知。' : 'Acupressure works by stimulating specific nerve points, promoting endorphin release, which are the body\'s natural painkillers. Modern research shows that appropriate acupoint stimulation can regulate nerve conduction and relieve pain perception.'}
          </p>
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
