import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Dumbbell, 
  Mountain, 
  Waves, 
  Heart,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Shield,
  Thermometer
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
    title: `${t('scenarios.exercise.title')} - ${t('title')}`,
    description: t('scenarios.exercise.description'),
  };
}

export default async function ExerciseScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  const hikingGuide = {
    preparation: [
      {
        category: locale === 'zh' ? '三层防护体系' : 'Three-Layer Protection System',
        items: [
          locale === 'zh' ? '基础层：速干抗菌内裤（推荐Knix品牌）' : 'Base layer: Quick-dry antibacterial underwear (Knix brand recommended)',
          locale === 'zh' ? '保暖层：石墨烯发热护腰（持续6小时恒温）' : 'Insulation layer: Graphene heating waist support (6-hour constant temperature)',
          locale === 'zh' ? '外层：带暗袋的登山裤（内置卫生用品隔层）' : 'Outer layer: Hiking pants with hidden pockets (built-in sanitary product compartment)'
        ]
      },
      {
        category: locale === 'zh' ? '装备清单' : 'Equipment List',
        items: [
          locale === 'zh' ? '透气性好的速干内衣' : 'Breathable quick-dry underwear',
          locale === 'zh' ? '宽松舒适的徒步裤' : 'Loose comfortable hiking pants',
          locale === 'zh' ? '防滑性好的徒步鞋' : 'Non-slip hiking shoes',
          locale === 'zh' ? '登山杖减轻腹部压力' : 'Hiking poles to reduce abdominal pressure'
        ]
      }
    ],
    duringHike: [
      locale === 'zh' ? '选择中低强度路线，避免高海拔或极端天气' : 'Choose low-medium intensity routes, avoid high altitude or extreme weather',
      locale === 'zh' ? '每30分钟休息5分钟，补充温热饮品' : 'Rest 5 minutes every 30 minutes, replenish with warm drinks',
      locale === 'zh' ? '密切关注身体信号，出现不适立即停止' : 'Monitor body signals closely, stop immediately if discomfort occurs',
      locale === 'zh' ? '保持与队友适当距离，相互照应' : 'Maintain appropriate distance with teammates, look out for each other'
    ]
  };

  const poolSafety = {
    requirements: [
      {
        indicator: locale === 'zh' ? '水温检查' : 'Water Temperature Check',
        standard: locale === 'zh' ? '水温>28℃（低温易致痉挛）' : 'Water temp >28℃ (low temp causes cramps)',
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        indicator: locale === 'zh' ? '氯浓度' : 'Chlorine Concentration',
        standard: locale === 'zh' ? '0.5-1.0ppm（过高损伤黏膜）' : '0.5-1.0ppm (too high damages mucosa)',
        icon: <Waves className="w-5 h-5" />
      },
      {
        indicator: locale === 'zh' ? '卫生标准' : 'Hygiene Standards',
        standard: locale === 'zh' ? '选择正规泳池，避免人流量大的场所' : 'Choose regulated pools, avoid crowded venues',
        icon: <Shield className="w-5 h-5" />
      }
    ],
    products: [
      locale === 'zh' ? '月经杯优于卫生棉条（防水性更好）' : 'Menstrual cup preferred over tampons (better waterproof)',
      locale === 'zh' ? '防水型卫生棉条（具有良好防水性能）' : 'Waterproof tampons (with good waterproof performance)',
      locale === 'zh' ? '蔓越莓浓缩胶囊（预防尿路感染）' : 'Cranberry concentrate capsules (prevent UTI)'
    ],
    protocol: [
      locale === 'zh' ? '游泳前彻底淋浴清洁身体' : 'Thoroughly shower before swimming',
      locale === 'zh' ? '选择经期中后期，流量较少时游泳' : 'Swim during mid-late period when flow is lighter',
      locale === 'zh' ? '游泳后立即冲洗并更换干净内衣' : 'Rinse immediately after swimming and change to clean underwear',
      locale === 'zh' ? '避免在公共按摩浴缸中浸泡' : 'Avoid soaking in public hot tubs'
    ]
  };

  const yogaPoses = [
    {
      name: locale === 'zh' ? '猫牛式' : 'Cat-Cow Pose',
      sanskrit: 'Marjaryasana-Bitilasana',
      duration: locale === 'zh' ? '5-10次动态练习' : '5-10 dynamic repetitions',
      benefits: locale === 'zh' ? '动态活化骨盆，缓解腰背压力' : 'Dynamically activates pelvis, relieves back pressure',
      steps: [
        locale === 'zh' ? '双手双膝着地，保持脊柱中立' : 'Hands and knees on ground, maintain neutral spine',
        locale === 'zh' ? '吸气时下沉腹部，抬头向上（牛式）' : 'Inhale: sink belly, lift head up (Cow)',
        locale === 'zh' ? '呼气时拱起脊背，低头看腹部（猫式）' : 'Exhale: arch spine, look toward belly (Cat)'
      ]
    },
    {
      name: locale === 'zh' ? '婴儿式' : 'Child\'s Pose',
      sanskrit: 'Balasana',
      duration: locale === 'zh' ? '保持1-3分钟' : 'Hold for 1-3 minutes',
      benefits: locale === 'zh' ? '缓解腰背压力，放松身心' : 'Relieves back pressure, relaxes body and mind',
      steps: [
        locale === 'zh' ? '跪坐，臀部坐在脚跟上' : 'Kneel, sit back on heels',
        locale === 'zh' ? '上身前倾，额头贴地' : 'Lean forward, forehead to ground',
        locale === 'zh' ? '双手放在身体两侧或向前伸展' : 'Arms at sides or extended forward'
      ]
    },
    {
      name: locale === 'zh' ? '仰卧束角式' : 'Reclined Bound Angle Pose',
      sanskrit: 'Supta Baddha Konasana',
      duration: locale === 'zh' ? '保持5-15分钟' : 'Hold for 5-15 minutes',
      benefits: locale === 'zh' ? '改善血液循环，缓解骨盆充血' : 'Improves circulation, relieves pelvic congestion',
      steps: [
        locale === 'zh' ? '仰卧，双脚脚掌相对' : 'Lie down, soles of feet together',
        locale === 'zh' ? '膝盖向两侧打开' : 'Knees fall to sides',
        locale === 'zh' ? '双手放在身体两侧，深呼吸' : 'Arms at sides, breathe deeply'
      ]
    },
    {
      name: locale === 'zh' ? '双腿靠墙式' : 'Legs Up the Wall',
      sanskrit: 'Viparita Karani',
      duration: locale === 'zh' ? '保持5-15分钟' : 'Hold for 5-15 minutes',
      benefits: locale === 'zh' ? '促进血液回流，缓解腿部疲劳' : 'Promotes blood return, relieves leg fatigue',
      steps: [
        locale === 'zh' ? '坐在墙边，双腿伸直靠墙' : 'Sit by wall, legs straight up wall',
        locale === 'zh' ? '身体与墙呈90度角' : 'Body at 90-degree angle to wall',
        locale === 'zh' ? '双臂自然放松，闭眼休息' : 'Arms relaxed, close eyes and rest'
      ]
    }
  ];

  const avoidPoses = [
    locale === 'zh' ? '倒立类体式（头倒立、肩倒立）' : 'Inversion poses (headstand, shoulderstand)',
    locale === 'zh' ? '深度后弯体式（轮式、骆驼式）' : 'Deep backbends (wheel pose, camel pose)',
    locale === 'zh' ? '强烈扭转体式' : 'Intense twisting poses',
    locale === 'zh' ? '腹部强力收缩的体式' : 'Poses with strong abdominal contractions'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12" data-page="scenario-exercise">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/scenario-solutions`} className="hover:text-primary-600 transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">{t('scenarios.exercise.title')}</span>
      </nav>

      {/* Page Header */}
      <header className="text-center">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('scenarios.exercise.title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('scenarios.exercise.description')}
        </p>
      </header>

      {/* Hiking Guide Section */}
      <section className="bg-gradient-to-br from-orange-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <Mountain className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '经期徒步三层防护体系' : 'Period Hiking Three-Layer Protection System'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {hikingGuide.preparation.map((prep, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                {prep.category}
              </h3>
              <ul className="space-y-3">
                {prep.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-orange-100 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">
            {locale === 'zh' ? '徒步过程中注意事项' : 'Precautions During Hiking'}
          </h4>
          <ul className="space-y-2">
            {hikingGuide.duringHike.map((note, index) => (
              <li key={index} className="flex items-start text-sm text-orange-700">
                <span className="w-5 h-5 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pool Safety Section */}
      <section>
        <div className="flex items-center mb-6">
          <Waves className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '泳池卫生风险防控' : 'Pool Hygiene Risk Prevention'}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {poolSafety.requirements.map((req, index) => (
            <div key={index} className="card text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {req.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {req.indicator}
              </h3>
              <p className="text-sm text-neutral-600">
                {req.standard}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-4">
              {locale === 'zh' ? '推荐产品' : 'Recommended Products'}
            </h4>
            <ul className="space-y-3">
              {poolSafety.products.map((product, index) => (
                <li key={index} className="flex items-start text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  {product}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-4">
              {locale === 'zh' ? '卫生协议' : 'Hygiene Protocol'}
            </h4>
            <ul className="space-y-3">
              {poolSafety.protocol.map((step, index) => (
                <li key={index} className="flex items-start text-sm text-green-700">
                  <span className="w-5 h-5 bg-green-200 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Yoga Poses Section */}
      <section>
        <div className="flex items-center mb-6">
          <Heart className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '经期瑜伽体式库' : 'Period Yoga Pose Library'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {yogaPoses.map((pose, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">
                  {pose.name}
                </h3>
                <span className="text-xs text-neutral-500 italic">
                  {pose.sanskrit}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {pose.duration}
                </span>
              </div>

              <p className="text-neutral-600 mb-4 text-sm">
                <strong>{locale === 'zh' ? '功效：' : 'Benefits: '}</strong>
                {pose.benefits}
              </p>

              <div>
                <h4 className="font-medium text-neutral-800 mb-2">
                  {locale === 'zh' ? '动作要点：' : 'Key Points:'}
                </h4>
                <ol className="space-y-2">
                  {pose.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start text-sm text-neutral-700">
                      <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {locale === 'zh' ? '经期应避免的体式' : 'Poses to Avoid During Period'}
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {avoidPoses.map((pose, index) => (
              <div key={index} className="flex items-center text-sm text-red-700">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                {pose}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="bg-yellow-50 p-6 md:p-8 rounded-xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          {locale === 'zh' ? '运动安全指南' : 'Exercise Safety Guidelines'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-yellow-700">
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '运动强度控制' : 'Exercise Intensity Control'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '避免剧烈运动，选择中低强度活动' : 'Avoid intense exercise, choose low-medium intensity activities'}</li>
              <li>• {locale === 'zh' ? '根据身体状况随时调整运动计划' : 'Adjust exercise plan according to body condition'}</li>
              <li>• {locale === 'zh' ? '出现严重不适立即停止运动' : 'Stop immediately if severe discomfort occurs'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '补水与营养' : 'Hydration & Nutrition'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '运动前后充分补水，选择温热饮品' : 'Hydrate well before/after exercise, choose warm drinks'}</li>
              <li>• {locale === 'zh' ? '携带能量食物，如坚果、香蕉等' : 'Carry energy foods like nuts, bananas'}</li>
              <li>• {locale === 'zh' ? '避免空腹运动，防止低血糖' : 'Avoid exercising on empty stomach, prevent hypoglycemia'}</li>
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
