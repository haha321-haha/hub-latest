import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Package,
  Briefcase,
  Car,
  Dumbbell,
  Bed,
  Users,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Info,
  School,
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
    title: `${locale === 'zh' ? '多场景应急包清单' : 'Multi-Scenario Emergency Kit List'} - ${t('title')}`,
    description: locale === 'zh' ? '详细的经期应急包准备清单，涵盖办公、通勤、运动、睡眠、社交等各种场景' : 'Detailed period emergency kit preparation list covering office, commute, exercise, sleep, social and other scenarios',
  };
}

export default async function EmergencyKitPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  const emergencyKitScenarios = [
    {
      scenario: locale === 'zh' ? '青少年/校园' : 'Teen/Campus',
      icon: <School className="w-6 h-6" />,
      color: 'bg-pink-50 text-pink-600',
      description: locale === 'zh' ? '专为12-18岁青少年设计的校园应急包，帮助在学校、宿舍等环境中从容应对经期不适。' : 'Campus emergency kit designed specifically for teens aged 12-18, helping handle period discomfort confidently in school, dorm, and other environments.',
      items: [
        {
          item: locale === 'zh' ? '迷你热敷贴/暖宝宝' : 'Mini Heat Patches/Hand Warmers',
          usage: locale === 'zh' ? '贴在小腹或腰部，随时随地提供温暖。体积小巧，可以隐蔽使用，不会引起同学注意。特别适合在课堂上使用。' : 'Apply to abdomen or lower back for warmth anytime, anywhere. Compact size allows discreet use without attracting classmates\' attention. Especially suitable for classroom use.',
          tip: locale === 'zh' ? '选择可长时间发热且恒温的产品。确保隔着衣物使用，避免低温烫伤。可以在上学前贴好。' : 'Choose products with long-lasting, constant temperature heat. Use over clothing to avoid burns. Can apply before going to school.'
        },
        {
          item: locale === 'zh' ? '止痛药（家长同意下）' : 'Pain Medication (With Parental Consent)',
          usage: locale === 'zh' ? '在家长同意和指导下，随身携带适量的安全止痛药。在身体刚感觉不适时服用，有效快速缓解疼痛。' : 'Carry safe pain medication with parental consent and guidance. Take when body first feels discomfort for effective, quick pain relief.',
          tip: locale === 'zh' ? '务必在家长或医生指导下使用。了解药品的剂量、服用时间。不要与同学分享药物。' : 'Must use under parental or medical guidance. Understand dosage and timing. Do not share medication with classmates.'
        },
        {
          item: locale === 'zh' ? '热水杯/保温杯' : 'Hot Water Bottle/Thermos',
          usage: locale === 'zh' ? '和学校沟通，看看能不能允许经期特别不舒服时使用。随时补充温水，有助于缓解腹胀和肌肉紧张。' : 'Communicate with school about using during particularly difficult periods. Replenish warm water anytime to help relieve bloating and muscle tension.',
          tip: locale === 'zh' ? '选择保温效果好的杯子。可以在课间或午休时使用。如果学校不允许，可以在课间去饮水处喝温水。' : 'Choose cups with good insulation. Can use during breaks or lunch. If school doesn\'t allow, drink warm water at water stations during breaks.'
        },
        {
          item: locale === 'zh' ? '小零食（巧克力/糖果）' : 'Small Snacks (Chocolate/Candy)',
          usage: locale === 'zh' ? '一块巧克力或少量糖果，有时候能帮你分散注意力，提供能量。在感觉疲劳或情绪低落时食用。' : 'A piece of chocolate or small candy can help distract attention and provide energy. Eat when feeling tired or down.',
          tip: locale === 'zh' ? '选择独立包装，方便携带。注意不要在课堂上食用，可以在课间或午休时享用。' : 'Choose individually packaged for easy carrying. Don\'t eat during class, enjoy during breaks or lunch.'
        },
        {
          item: locale === 'zh' ? '舒适的备用衣物' : 'Comfortable Spare Clothing',
          usage: locale === 'zh' ? '准备一件宽松的外套或围巾，在感觉寒冷或需要额外保暖时使用。也可以在腹部不适时提供心理安慰。' : 'Prepare a loose jacket or scarf for when feeling cold or needing extra warmth. Can also provide psychological comfort when abdomen feels uncomfortable.',
          tip: locale === 'zh' ? '选择容易搭配的颜色和款式。可以放在宿舍或储物柜里备用。' : 'Choose colors and styles that are easy to match. Can keep in dorm or locker as backup.'
        },
        {
          item: locale === 'zh' ? '沟通卡片/便条' : 'Communication Cards/Notes',
          usage: locale === 'zh' ? '提前准备好简单的便条，如"我身体不太舒服，可以去医务室吗？"方便在不好意思开口时使用。' : 'Prepare simple notes in advance, like "I\'m not feeling well, may I go to the nurse\'s office?" for use when too shy to speak up.',
          tip: locale === 'zh' ? '可以准备中英文版本。也可以事先和信任的同学或老师沟通，建立理解和支持。' : 'Can prepare Chinese and English versions. Also communicate with trusted classmates or teachers in advance to build understanding and support.'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '办公/职场' : 'Office/Workplace',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      description: locale === 'zh' ? '在办公室面对突然来袭的经期疼痛，需要快速、便捷且不影响工作的方式来缓解。' : 'Facing sudden period pain in the office requires quick, convenient methods that don\'t affect work.',
      items: [
        {
          item: locale === 'zh' ? '迷你热敷贴/暖宝宝' : 'Mini Heat Patches/Hand Warmers',
          usage: locale === 'zh' ? '贴在小腹或腰部。提供持续温暖，放松肌肉，缓解痉挛。体积小巧，方便隐蔽使用。' : 'Apply to abdomen or lower back. Provides continuous warmth, relaxes muscles, relieves cramps. Compact size for discreet use.',
          tip: locale === 'zh' ? '选择可长时间发热且恒温的产品。确保隔着衣物使用，避免低温烫伤。' : 'Choose products with long-lasting, constant temperature heat. Use over clothing to avoid low-temperature burns.'
        },
        {
          item: locale === 'zh' ? '随身止痛药' : 'Portable Pain Medication',
          usage: locale === 'zh' ? '在身体刚感觉不适时服用。有效快速缓解疼痛。务必在医生或药师指导下携带和使用。' : 'Take when body first feels discomfort. Effectively relieves pain quickly. Must carry and use under doctor or pharmacist guidance.',
          tip: locale === 'zh' ? '了解药品的剂量、服用时间和可能的副作用。不要擅自增加剂量。' : 'Understand dosage, timing, and possible side effects. Do not increase dosage without authorization.'
        },
        {
          item: locale === 'zh' ? '红糖姜茶包/速溶温饮' : 'Brown Sugar Ginger Tea/Instant Warm Drinks',
          usage: locale === 'zh' ? '在茶水间用热水冲泡饮用。温热饮品有助于促进血液循环，缓解腹胀和寒凝。' : 'Brew with hot water in tea room. Warm drinks help promote blood circulation, relieve bloating and cold stagnation.',
          tip: locale === 'zh' ? '选择独立包装，方便携带和冲泡。' : 'Choose individually packaged for easy carrying and brewing.'
        },
        {
          item: locale === 'zh' ? '小巧的按摩工具' : 'Compact Massage Tools',
          usage: locale === 'zh' ? '在办公椅上或休息时，轻柔按摩腰部、手部穴位。分散注意力，缓解局部肌肉紧张。' : 'Gently massage waist and hand acupoints while in office chair or resting. Distracts attention, relieves local muscle tension.',
          tip: locale === 'zh' ? '无需大幅度动作，可在衣服下进行。' : 'No large movements needed, can be done under clothing.'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '通勤' : 'Commute',
      icon: <Car className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
      description: locale === 'zh' ? '在路上遭遇经期不适，特别是乘坐公共交通时，需要快速、不引人注意的应急方法。' : 'Encountering period discomfort on the road, especially on public transport, requires quick, discreet emergency methods.',
      items: [
        {
          item: locale === 'zh' ? '迷你暖宝宝' : 'Mini Hand Warmers',
          usage: locale === 'zh' ? '上路前贴好。长时间提供温暖，特别适合长时间站立或坐着的通勤。' : 'Apply before departure. Provides long-term warmth, especially suitable for long periods of standing or sitting during commute.',
          tip: locale === 'zh' ? '确保粘性好不易脱落。' : 'Ensure good adhesion and won\'t fall off easily.'
        },
        {
          item: locale === 'zh' ? '小瓶温水或保温杯' : 'Small Bottle of Warm Water or Thermos',
          usage: locale === 'zh' ? '随时补充水分，小口饮用温水。温水有助于缓解腹胀和肌肉紧张。' : 'Replenish fluids anytime, sip warm water. Warm water helps relieve bloating and muscle tension.',
          tip: locale === 'zh' ? '冬季尤其重要。如果乘坐交通工具不便，可在上车前或下车后及时补充。' : 'Especially important in winter. If inconvenient on transport, replenish before boarding or after alighting.'
        },
        {
          item: locale === 'zh' ? '耳机' : 'Headphones',
          usage: locale === 'zh' ? '听舒缓音乐、白噪音或播客。分散注意力，平静情绪。' : 'Listen to soothing music, white noise, or podcasts. Distracts attention, calms emotions.',
          tip: locale === 'zh' ? '可尝试声波疗法中推荐的舒缓音频。' : 'Try soothing audio recommended in sound therapy.'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '运动/户外' : 'Exercise/Outdoor',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'bg-orange-50 text-orange-600',
      description: locale === 'zh' ? '经期适度运动有益健康，但在运动中或户外环境遭遇疼痛，需要特别的准备和应对。' : 'Moderate exercise during menstruation is beneficial for health, but encountering pain during exercise or outdoor environments requires special preparation and response.',
      items: [
        {
          item: locale === 'zh' ? '轻薄防风外套' : 'Lightweight Windproof Jacket',
          usage: locale === 'zh' ? '运动出汗后及时穿上，避免受凉。特别是在户外环境中。' : 'Put on immediately after sweating from exercise to avoid catching cold. Especially important in outdoor environments.',
          tip: locale === 'zh' ? '受凉可能加重疼痛。选择透气吸湿排汗的专业运动服。' : 'Catching cold may worsen pain. Choose breathable, moisture-wicking professional sportswear.'
        },
        {
          item: locale === 'zh' ? '个人卫生用品（运动专用）' : 'Personal Hygiene Products (Sports-specific)',
          usage: locale === 'zh' ? '如运动型卫生巾/棉条/月经杯。确保运动中的防漏和舒适。' : 'Such as sports sanitary pads/tampons/menstrual cups. Ensure leak protection and comfort during exercise.',
          tip: locale === 'zh' ? '根据运动强度和自身流量选择合适的产品。' : 'Choose appropriate products based on exercise intensity and personal flow.'
        },
        {
          item: locale === 'zh' ? '充足的饮用水/电解质饮料' : 'Adequate Drinking Water/Electrolyte Drinks',
          usage: locale === 'zh' ? '运动中及时补充水分和电解质。避免脱水，有助于身体维持正常功能，部分缓解疲劳和痉挛。' : 'Replenish fluids and electrolytes during exercise. Avoid dehydration, helps body maintain normal function, partially relieves fatigue and cramps.',
          tip: locale === 'zh' ? '温水更佳。避免空腹运动。' : 'Warm water is better. Avoid exercising on an empty stomach.'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '睡眠' : 'Sleep',
      icon: <Bed className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      description: locale === 'zh' ? '夜间的经期疼痛会严重影响睡眠，良好的准备有助于安稳入睡。' : 'Nighttime period pain can seriously affect sleep, good preparation helps ensure restful sleep.',
      items: [
        {
          item: locale === 'zh' ? '热水袋/电热毯/暖宝宝' : 'Hot Water Bottle/Electric Blanket/Hand Warmers',
          usage: locale === 'zh' ? '睡前敷在小腹或腰部。提供持续温暖，放松腹部肌肉，显著缓解痉挛痛感。' : 'Apply to abdomen or lower back before sleep. Provides continuous warmth, relaxes abdominal muscles, significantly relieves cramping pain.',
          tip: locale === 'zh' ? '注意温度，避免烫伤。电热毯/热水袋需注意安全使用。暖宝宝适合整夜使用。' : 'Pay attention to temperature to avoid burns. Electric blankets/hot water bottles require safe use. Hand warmers are suitable for all-night use.'
        },
        {
          item: locale === 'zh' ? '抱枕或靠垫' : 'Body Pillow or Cushion',
          usage: locale === 'zh' ? '睡觉时放在膝下或抱在怀里（配合左侧卧）。帮助身体保持舒适姿势，减轻腹部受压。' : 'Place under knees or hug while sleeping (with left side lying). Helps body maintain comfortable position, reduces abdominal pressure.',
          tip: locale === 'zh' ? '可以尝试在双腿中间夹一个抱枕，或将抱枕放在腹部下方支撑。' : 'Try placing a pillow between legs or under abdomen for support.'
        },
        {
          item: locale === 'zh' ? '睡前助眠音频' : 'Bedtime Sleep Audio',
          usage: locale === 'zh' ? '睡前播放，调节神经，分散对疼痛的注意力，帮助放松入睡。' : 'Play before sleep to regulate nerves, distract from pain, help relax and fall asleep.',
          tip: locale === 'zh' ? '可佩戴舒适的耳机。选择音量适中、内容平静的音频。' : 'Can wear comfortable headphones. Choose moderate volume, calm content audio.'
        }
      ]
    },
    {
      scenario: locale === 'zh' ? '社交' : 'Social',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-pink-50 text-pink-600',
      description: locale === 'zh' ? '参与社交活动（如约会、聚会、外出用餐）时应对经期不适，需要巧妙应对和提前准备。' : 'When participating in social activities (such as dates, parties, dining out) while dealing with period discomfort, requires clever handling and advance preparation.',
      items: [
        {
          item: locale === 'zh' ? '迷你暖宝宝' : 'Mini Hand Warmers',
          usage: locale === 'zh' ? '外出前贴好。提供持续温暖，不易被他人察觉。' : 'Apply before going out. Provides continuous warmth, not easily noticed by others.',
          tip: locale === 'zh' ? '选择体积小巧，贴合性好的产品。' : 'Choose compact products with good adhesion.'
        },
        {
          item: locale === 'zh' ? '舒适且便于行动的衣物' : 'Comfortable and Movement-friendly Clothing',
          usage: locale === 'zh' ? '选择不会勒紧腹部，同时也便于进行一些隐蔽的小调整的衣物。' : 'Choose clothing that doesn\'t constrict the abdomen while allowing for discreet small adjustments.',
          tip: locale === 'zh' ? '美观与舒适兼顾。' : 'Balance beauty and comfort.'
        },
        {
          item: locale === 'zh' ? '一条小巧舒适的围巾或披肩' : 'Small Comfortable Scarf or Shawl',
          usage: locale === 'zh' ? '在空调环境或感到畏寒时使用。保护腹部和腰部。' : 'Use in air-conditioned environments or when feeling cold. Protects abdomen and waist.',
          tip: locale === 'zh' ? '既是配饰，也能提供保暖和安全感。' : 'Serves as both accessory and provides warmth and security.'
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12" data-page="scenario-emergency-kit">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600 py-4">
        <Link href={`/${locale}/scenario-solutions`} className="hover:text-primary-600 transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">
          {locale === 'zh' ? '应急包清单' : 'Emergency Kit List'}
        </span>
      </nav>

      {/* Page Header */}
      <header className="text-center py-8 md:py-12">
        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Package className="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4">
          {locale === 'zh' ? '多场景经期应急包清单' : 'Multi-Scenario Period Emergency Kit List'}
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto px-4">
          {locale === 'zh' ? '从容应对，自在生活：经期不适，你不是一个人在战斗。这份清单为你提供了在各种场景下的应急准备和物品建议，帮助你随时随地都能从容应对，掌控自己的状态。' : 'Handle with confidence, live comfortably: You\'re not fighting period discomfort alone. This list provides emergency preparation and item suggestions for various scenarios, helping you handle any situation with confidence and control your state.'}
        </p>
      </header>

      {/* 青少年专区特别推广 */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-pink-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-200 rounded-full opacity-20 transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-purple-200 rounded-full opacity-20 transform -translate-x-10 sm:-translate-x-12 translate-y-10 sm:translate-y-12"></div>

        <div className="relative z-10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3">
            <div className="bg-pink-100 rounded-full p-2 sm:p-3">
              <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {locale === 'zh' ? '🌸 青少年专区新增！' : '🌸 New Teen Section Added!'}
              </h2>
              <p className="text-xs sm:text-sm text-pink-600 font-medium">
                {locale === 'zh' ? '专为12-18岁女孩设计的校园应急包' : 'Campus emergency kit designed for girls aged 12-18'}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
            {locale === 'zh'
              ? '我们特别为青少年朋友们新增了校园应急包清单！从课堂应急到宿舍管理，从与老师沟通到同学互助，全方位帮助你在校园环境中自信应对经期。'
              : 'We\'ve specially added a campus emergency kit list for our teen friends! From classroom emergencies to dorm management, from communicating with teachers to peer support, comprehensive help for confidently handling periods in campus environments.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href={`/${locale}/teen-health`}
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              {locale === 'zh' ? '探索青少年专区' : 'Explore Teen Zone'}
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
            </Link>
            <Link
              href={`/${locale}/teen-health/campus-guide`}
              className="inline-flex items-center justify-center bg-white text-pink-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium border-2 border-pink-200 hover:bg-pink-50 transition-colors text-sm sm:text-base"
            >
              {locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide'}
            </Link>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-yellow-50 p-4 sm:p-6 md:p-8 rounded-xl border border-yellow-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-0">
          <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600 mr-0 sm:mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
              {locale === 'zh' ? '重要提示' : 'Important Notice'}
            </h3>
            <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed">
              {locale === 'zh' ? '本清单提供的建议为辅助缓解措施，如果你的经期疼痛剧烈或伴有其他异常症状，请务必及时就医。止痛药等药物的使用，应在医生或药师指导下进行。' : 'The suggestions in this list are auxiliary relief measures. If you experience severe period pain or other abnormal symptoms, please seek medical attention promptly. Use of pain medications should be under the guidance of a doctor or pharmacist.'}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Kit Scenarios */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {emergencyKitScenarios.map((scenario, index) => (
            <div key={index} className="bg-gradient-to-br from-neutral-50 to-white p-4 sm:p-6 md:p-8 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center ${scenario.color} mr-0 sm:mr-4`}>
                  {scenario.icon}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                    {locale === 'zh' ? '场景：' : 'Scenario: '}{scenario.scenario}
                  </h2>
                  <p className="text-neutral-600 mt-2 text-sm sm:text-base">
                    {scenario.description}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {scenario.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-2 sm:mb-3">
                      {item.item}
                    </h3>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-1 text-xs sm:text-sm">
                          {locale === 'zh' ? '使用提示/理由：' : 'Usage Tips/Reason:'}
                        </h4>
                        <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                          {item.usage}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-1 text-xs sm:text-sm">
                          {locale === 'zh' ? '相关建议：' : 'Related Suggestions:'}
                        </h4>
                        <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                          {item.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary and Tips */}
      <section className="bg-gradient-to-br from-blue-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <Info className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 mr-0 sm:mr-3" />
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '总结与建议' : 'Summary and Recommendations'}
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4 text-neutral-700">
          <p className="leading-relaxed text-sm sm:text-base">
            {locale === 'zh' ? '这份清单为你提供了一个基础框架，具体的应急包内容和准备方式可以根据你个人的实际情况、疼痛程度、生活习惯以及所处的具体环境进行调整。最重要的是：' : 'This list provides a basic framework. The specific emergency kit contents and preparation methods can be adjusted according to your personal situation, pain level, lifestyle habits, and specific environment. Most importantly:'}
          </p>

          <ul className="space-y-2 sm:space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>{locale === 'zh' ? '了解你的身体：' : 'Know your body: '}</strong>
                {locale === 'zh' ? '关注经期疼痛的规律和特点。' : 'Pay attention to the patterns and characteristics of menstrual pain.'}
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>{locale === 'zh' ? '提前做好准备：' : 'Prepare in advance: '}</strong>
                {locale === 'zh' ? '防患于未然，将应急物品成为你包里的常备项。' : 'Be prepared, make emergency items a regular part of your bag.'}
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>{locale === 'zh' ? '倾听身体的声音：' : 'Listen to your body: '}</strong>
                {locale === 'zh' ? '不要硬撑，如果疼痛严重影响正常生活，及时寻求休息或医疗帮助。' : 'Don\'t push through, if pain seriously affects normal life, seek rest or medical help promptly.'}
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>{locale === 'zh' ? '勇敢寻求帮助：' : 'Seek help bravely: '}</strong>
                {locale === 'zh' ? '在需要时，告诉家人、朋友或信任的人你的不适，获得他们的理解和支持。' : 'When needed, tell family, friends, or trusted people about your discomfort to gain their understanding and support.'}
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">
                <strong>{locale === 'zh' ? '青少年特别提醒：' : 'Special reminder for teens: '}</strong>
                {locale === 'zh' ? '如果你是12-18岁的学生，记得与家长沟通应急包的准备，在学校遇到困难时勇敢向老师或校医求助。' : 'If you\'re a 12-18 year old student, remember to communicate with parents about emergency kit preparation, and bravely seek help from teachers or school nurses when facing difficulties at school.'}
              </span>
            </li>
          </ul>

          <p className="leading-relaxed mt-4 sm:mt-6 text-center font-medium text-blue-800 text-sm sm:text-base">
            {locale === 'zh' ? '希望这份清单能帮助你在经期也能更加自信、舒适地面对各种生活场景！' : 'Hope this list helps you face various life scenarios with more confidence and comfort during your period!'}
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-red-50 p-4 sm:p-6 md:p-8 rounded-xl border border-red-200">
        <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-3 sm:mb-4">
          {locale === 'zh' ? '免责声明' : 'Disclaimer'}
        </h3>
        <p className="text-red-700 text-xs sm:text-sm leading-relaxed">
          {locale === 'zh' ? '本清单提供的建议仅供信息参考，不能替代专业的医疗诊断、治疗或建议。药物使用请务必遵循医生或药师的指导。个体情况差异，请根据自身感受进行调整。如果你的经期疼痛剧烈难忍，或伴随其他异常症状（如发烧、剧烈呕吐、异常出血等），请立即就医。' : 'The suggestions in this list are for informational reference only and cannot replace professional medical diagnosis, treatment, or advice. Please follow doctor or pharmacist guidance for medication use. Individual situations vary, please adjust according to your own feelings. If your menstrual pain is severe and unbearable, or accompanied by other abnormal symptoms (such as fever, severe vomiting, abnormal bleeding, etc.), please seek medical attention immediately.'}
        </p>
      </section>

      {/* Back to Overview */}
      <div className="text-center py-4 sm:py-6">
        <Link
          href={`/${locale}/scenario-solutions`}
          className="inline-flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回场景解决方案总览' : 'Back to Scenario Solutions Overview'}
        </Link>
      </div>
    </div>
  );
}
