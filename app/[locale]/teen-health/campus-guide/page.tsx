import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import {
  School,
  Clock,
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Thermometer,
  Pill,
  Coffee,
  Candy,
  Home,
  Activity,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import type { Metadata } from 'next';

type Locale = 'en' | 'zh';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'teenHealth' });
  
  return {
    title: locale === 'zh' ? '校园应急指南 - 青少年经期健康专区' : 'Campus Emergency Guide - Teen Menstrual Health Zone',
    description: locale === 'zh' 
      ? '在学校突然痛起来怎么办？课堂应急、宿舍管理、体育课应对，全方位校园生存指南。'
      : 'What to do when pain strikes at school? Classroom emergencies, dorm management, PE class strategies.',
  };
}

export default async function CampusGuidePage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const emergencySteps = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: locale === 'zh' ? '快速评估' : 'Quick Assessment',
      description: locale === 'zh' ? '感觉有点不舒服？还是已经很痛了？' : 'Feeling a bit uncomfortable? Or already in significant pain?'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: locale === 'zh' ? '悄悄自救' : 'Discreet Self-Help',
      description: locale === 'zh' ? '调整坐姿、深呼吸、轻柔按摩' : 'Adjust posture, deep breathing, gentle massage'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: locale === 'zh' ? '寻求帮助' : 'Seek Help',
      description: locale === 'zh' ? '示意老师或找同学帮忙' : 'Signal teacher or ask classmate for help'
    }
  ];

  const emergencyKit = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      item: locale === 'zh' ? '迷你热敷贴/暖宝宝' : 'Mini heat patches/warmers',
      usage: locale === 'zh' ? '贴在小腹或腰部，随时随地提供温暖' : 'Apply to abdomen or lower back for instant warmth'
    },
    {
      icon: <Pill className="w-5 h-5" />,
      item: locale === 'zh' ? '止痛药' : 'Pain medication',
      usage: locale === 'zh' ? '在家长同意和指导下，随身携带适量的安全止痛药' : 'Carry safe pain medication with parental consent and guidance'
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      item: locale === 'zh' ? '热水杯' : 'Hot water bottle',
      usage: locale === 'zh' ? '和学校沟通，看看能不能允许经期特别不舒服时使用' : 'Communicate with school about using during particularly difficult periods'
    },
    {
      icon: <Candy className="w-5 h-5" />,
      item: locale === 'zh' ? '小零食' : 'Small snacks',
      usage: locale === 'zh' ? '一块巧克力或少量糖果，有时候能帮你分散注意力' : 'A piece of chocolate or small candy can help distract and provide energy'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600">
        <Link href={`/${locale}/teen-health`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '青少年专区' : 'Teen Zone'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide'}</span>
      </nav>

      {/* Header */}
      <header className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <School className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {locale === 'zh' ? '🏫 校园应急指南' : '🏫 Campus Emergency Guide'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '学校是每天大部分时间待的地方，如果在课堂上、宿舍里，甚至体育课上痛起来，那可真是太难熬了！别慌，我们为你准备了这份"校园生存指南"。'
            : 'School is where you spend most of your day. If pain strikes in class, dorm, or even during PE, it can be really tough! Don\'t panic - we\'ve prepared this "campus survival guide" for you.'
          }
        </p>
      </header>

      {/* User Story */}
      <section className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'zh' ? '小郁同学的经历：' : 'Xiao Yu\'s Experience:'}
            </h3>
            <p className="text-gray-700 italic">
              {locale === 'zh'
                ? '"有一次上数学课，突然痛得浑身出汗，根本没法集中精神。又不敢举手说，只能硬撑着，感觉时间过得好慢好慢。"'
                : '"Once during math class, I suddenly felt such intense pain that I broke out in a cold sweat and couldn\'t concentrate at all. I didn\'t dare raise my hand to say anything, so I just had to endure it. Time felt like it was crawling by."'
              }
            </p>
            <p className="text-blue-600 font-medium mt-2">
              {locale === 'zh' ? '这就是很多同学在学校的真实写照，我们懂！' : 'This is the reality for many students at school - we understand!'}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Steps */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '课堂应急三步法' : 'Classroom Emergency 3-Step Method'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {emergencySteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600">
                  {step.icon}
                </div>
              </div>
              <div className="bg-blue-50 rounded-full px-4 py-1 text-blue-600 text-sm font-medium mb-3 inline-block">
                {locale === 'zh' ? `第${index + 1}步` : `Step ${index + 1}`}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Strategies */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {locale === 'zh' ? '详细应对策略' : 'Detailed Coping Strategies'}
        </h2>

        {/* Classroom Strategies */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <School className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-900">
              {locale === 'zh' ? '课堂应急指南' : 'Classroom Emergency Guide'}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '悄悄自救技巧：' : 'Discreet Self-Help Techniques:'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '调整坐姿' : 'Adjust Posture'}</span>
                    <p className="text-sm text-gray-600">{locale === 'zh' ? '尝试把身体微微前倾，或轻柔地按摩下腹部' : 'Try leaning slightly forward or gently massage your lower abdomen'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '深呼吸' : 'Deep Breathing'}</span>
                    <p className="text-sm text-gray-600">{locale === 'zh' ? '缓慢、深长地吸气，再慢慢呼出，有助于放松紧张的肌肉' : 'Slow, deep breaths help relax tense muscles'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '意念转移' : 'Mental Distraction'}</span>
                    <p className="text-sm text-gray-600">{locale === 'zh' ? '试着把注意力集中在老师讲课的内容上' : 'Try to focus your attention on the teacher\'s lesson'}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '寻求帮助：' : 'Seeking Help:'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '示意老师' : 'Signal Teacher'}</span>
                    <p className="text-sm text-gray-600">{locale === 'zh' ? '如果实在太痛，可以悄悄示意老师，说明需要去医务室' : 'If pain is severe, quietly signal the teacher that you need to go to the nurse\'s office'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{locale === 'zh' ? '找同学帮忙' : 'Ask Classmate for Help'}</span>
                    <p className="text-sm text-gray-600">{locale === 'zh' ? '和坐在身边的好朋友简单说明情况，请她帮忙告诉老师' : 'Briefly explain the situation to a close friend nearby and ask her to help inform the teacher'}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dorm Management */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <Home className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-900">
              {locale === 'zh' ? '宿舍疼痛管理' : 'Dorm Pain Management'}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-purple-600 mb-3">
                {locale === 'zh' ? '热敷方法' : 'Heat Therapy'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• {locale === 'zh' ? '热水袋：最经典有效的方法' : 'Hot water bottle: Classic and effective'}</li>
                <li>• {locale === 'zh' ? '热毛巾：用热水浸湿毛巾拧干敷肚子' : 'Hot towel: Soak towel in hot water and apply'}</li>
                <li>• {locale === 'zh' ? '电热毯：短时间使用，注意安全' : 'Electric blanket: Use briefly, ensure safety'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-600 mb-3">
                {locale === 'zh' ? '舒适姿势' : 'Comfortable Positions'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• {locale === 'zh' ? '蜷缩侧卧：像个虾米轻轻抱着肚子' : 'Curled side position: Like a shrimp, gently hugging abdomen'}</li>
                <li>• {locale === 'zh' ? '膝盖抬高：仰卧，膝盖弯曲抬到胸部' : 'Knees up: Lie back, bend knees to chest'}</li>
                <li>• {locale === 'zh' ? '使用枕头：垫在肚子或膝下找舒服姿势' : 'Use pillows: Place under abdomen or knees'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-600 mb-3">
                {locale === 'zh' ? '室友互助' : 'Roommate Support'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• {locale === 'zh' ? '分享经验：互相照顾，一起泡红糖水' : 'Share experiences: Care for each other, make brown sugar water together'}</li>
                <li>• {locale === 'zh' ? '互相提醒：按揉穴位的方法' : 'Remind each other: Acupressure techniques'}</li>
                <li>• {locale === 'zh' ? '情感支持：理解和陪伴很重要' : 'Emotional support: Understanding and companionship matter'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PE Class Strategies */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <Activity className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-900">
              {locale === 'zh' ? '体育课/运动会应对' : 'PE Class/Sports Event Strategies'}
            </h3>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium mb-1">
                  {locale === 'zh' ? '老师视角：' : 'Teacher\'s Perspective:'}
                </p>
                <p className="text-yellow-700 text-sm">
                  {locale === 'zh'
                    ? '"作为老师，我们希望了解学生的需求，但有些同学不好意思说。如果你们能告诉我身体不舒服，我会更理解和支持你们。"'
                    : '"As teachers, we want to understand students\' needs, but some students are too shy to speak up. If you can tell me you\'re not feeling well, I\'ll be more understanding and supportive."'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                {locale === 'zh' ? '沟通策略：' : 'Communication Strategies:'}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-sm">{locale === 'zh' ? '提前沟通：如果经期疼痛严重，提前告知体育老师' : 'Communicate early: If period pain is severe, inform PE teacher in advance'}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-sm">{locale === 'zh' ? '简单说明："今天身体不太舒服，可能不太适合剧烈运动"' : 'Simple explanation: "I\'m not feeling well today and may not be suitable for intense exercise"'}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                {locale === 'zh' ? '运动选择：' : 'Exercise Options:'}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-sm">{locale === 'zh' ? '低强度运动：散步、慢跑、瑜伽、拉伸反而有助缓解' : 'Low-intensity exercise: Walking, light jogging, yoga, stretching can actually help'}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-sm">{locale === 'zh' ? '避免剧烈运动：高强度运动可能会加重疼痛' : 'Avoid intense exercise: High-intensity activities may worsen pain'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exam Coping Strategies */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
            <h3 className="text-2xl font-semibold text-gray-900">
              {locale === 'zh' ? '考试应对策略' : 'Exam Coping Strategies'}
            </h3>
          </div>

          {/* Special highlight box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-800 font-medium mb-1">
                  {locale === 'zh' ? '当"大考"撞上"大姨妈"' : 'When "Big Exam" Meets "Aunt Flo"'}
                </p>
                <p className="text-orange-700 text-sm">
                  {locale === 'zh'
                    ? '这种情况比你想象的更常见！提前准备和冷静应对是关键。'
                    : 'This situation is more common than you think! Advance preparation and calm response are key.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">
                {locale === 'zh' ? '考前准备' : 'Pre-exam Preparation'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '未雨绸缪' : 'Plan Ahead'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '预测到考试可能撞上经期时，提前与家长、班主任沟通学校应对政策' : 'When predicting exam might coincide with period, communicate with parents and teachers about school policies'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '精心准备' : 'Careful Preparation'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '保证充足睡眠和均衡营养，避免熬夜和刺激性食物，考前适当热敷放松' : 'Ensure adequate sleep and balanced nutrition, avoid staying up late and irritating foods, apply heat therapy before exam'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '药物准备' : 'Medication Preparation'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '如医生开过止痛药，务必遵医嘱提前试用，确保无副作用' : 'If doctor prescribed pain medication, follow instructions and test in advance to ensure no side effects'}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-3">
                {locale === 'zh' ? '考试中应对' : 'During Exam Response'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '保持冷静' : 'Stay Calm'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '突发不适时不要慌张，立即举手向监考老师报告' : 'Don\'t panic when sudden discomfort occurs, immediately raise hand to report to invigilator'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '清楚沟通' : 'Clear Communication'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '小声说明不适情况，询问是否可以短暂休息或去卫生间' : 'Quietly explain discomfort, ask if you can take a brief break or go to restroom'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '寻求帮助' : 'Seek Help'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '询问是否有其他应急处理措施，大多数学校都会给予人道关怀' : 'Ask about other emergency measures, most schools will provide humanitarian care'}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-3">
                {locale === 'zh' ? '校园资源' : 'Campus Resources'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '提前了解' : 'Know in Advance'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '开学初了解校医室位置、上班时间和心理辅导室信息' : 'Learn about nurse\'s office location, hours, and counseling room info at start of term'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '勇敢求助' : 'Seek Help Bravely'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '身体不适或情绪低落时，主动向老师申请去校医室或心理辅导室' : 'When feeling unwell or emotionally down, actively ask teacher to go to nurse\'s office or counseling room'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium text-sm">{locale === 'zh' ? '专业支持' : 'Professional Support'}</span>
                    <p className="text-xs text-gray-600">{locale === 'zh' ? '校医和心理老师都是专业的，会保护隐私并提供有效支持' : 'School nurses and counselors are professional, will protect privacy and provide effective support'}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional tip box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Heart className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium mb-1">
                  {locale === 'zh' ? '校园"秘密补给站"和"情绪加油站"' : 'Campus "Secret Supply Station" and "Emotional Refueling Station"'}
                </p>
                <p className="text-blue-700 text-sm">
                  {locale === 'zh'
                    ? '校医室可提供临时休息场所和基本疼痛缓解建议；心理辅导室可帮助疏导负面情绪，教授放松和应对技巧。'
                    : 'Nurse\'s office provides temporary rest space and basic pain relief advice; counseling room helps process negative emotions and teaches relaxation and coping skills.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Kit */}
      <section className="bg-red-50 rounded-2xl p-8 border border-red-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '随身"应急包"' : 'Personal "Emergency Kit"'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {locale === 'zh' ? '备好这些小东西，关键时刻能派上大用场' : 'Keep these small items ready - they can be lifesavers in critical moments'}
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {emergencyKit.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <div className="text-red-600">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {item.item}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.usage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
        <div className="flex items-start">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'zh' ? '重要提醒' : 'Important Reminder'}
            </h3>
            <p className="text-gray-700 mb-4">
              {locale === 'zh'
                ? '每个人的身体状况不同，对疼痛的忍受度和应对方法也不同。以上建议仅供参考，最佳方案需要你自己去摸索。'
                : 'Everyone\'s body is different, and pain tolerance and coping methods vary. The above suggestions are for reference only - the best approach needs to be discovered by yourself.'
              }
            </p>
            <p className="text-gray-700">
              {locale === 'zh'
                ? '如果你的疼痛非常剧烈，影响正常学习生活，或者伴有其他异常症状，一定要及时告诉家长和老师，寻求医生的专业帮助。'
                : 'If your pain is very severe, affects normal study and life, or is accompanied by other abnormal symptoms, be sure to tell your parents and teachers promptly and seek professional medical help.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link
          href={`/${locale}/teen-health`}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '返回专区首页' : 'Back to Teen Zone'}
        </Link>
        
        <Link
          href={`/${locale}/teen-health/development-pain`}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          {locale === 'zh' ? '下一篇：发育期疼痛管理' : 'Next: Developmental Pain Management'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
