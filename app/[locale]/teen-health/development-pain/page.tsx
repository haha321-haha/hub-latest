import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Heart,
  Clock,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Thermometer,
  Pill,
  Utensils,
  Moon,
  MessageCircle,
  Stethoscope
} from 'lucide-react';
import type { Metadata } from 'next';
import EmbeddedPainAssessment from '@/components/EmbeddedPainAssessment';

type Locale = 'en' | 'zh';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'teenHealth' });
  
  return {
    title: locale === 'zh' ? '发育期疼痛管理 - 青少年经期健康专区' : 'Developmental Pain Management - Teen Menstrual Health Zone',
    description: locale === 'zh' 
      ? '12-16岁专属疼痛管理建议，了解青春期痛经特点，掌握科学缓解方法。'
      : 'Specialized pain management advice for ages 12-16, understanding adolescent period pain characteristics.',
  };
}

export default async function DevelopmentPainPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  unstable_setRequestLocale(locale);

  const painCharacteristics = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: locale === 'zh' ? '常见时间' : 'Common Timing',
      description: locale === 'zh' ? '疼痛通常在月经来潮前几小时或来潮后不久开始，持续1-3天' : 'Pain usually starts a few hours before or shortly after menstruation begins, lasting 1-3 days'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: locale === 'zh' ? '疼痛部位' : 'Pain Location',
      description: locale === 'zh' ? '主要在小腹部，有时会放射到腰部、大腿内侧' : 'Mainly in the lower abdomen, sometimes radiating to the lower back and inner thighs'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: locale === 'zh' ? '疼痛感觉' : 'Pain Sensation',
      description: locale === 'zh' ? '可能是阵发性的绞痛，也可能是持续的坠胀感' : 'May be intermittent cramping or continuous aching sensation'
    }
  ];

  const managementMethods = [
    {
      category: locale === 'zh' ? '健康生活方式' : 'Healthy Lifestyle',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-pink-50 text-pink-600',
      methods: [
        {
          icon: <Utensils className="w-5 h-5" />,
          title: locale === 'zh' ? '均衡饮食' : 'Balanced Diet',
          description: locale === 'zh' ? '多吃富含维生素、矿物质的食物，少吃油腻、辛辣、生冷刺激的食物' : 'Eat foods rich in vitamins and minerals, avoid oily, spicy, and cold foods'
        },
        {
          icon: <Moon className="w-5 h-5" />,
          title: locale === 'zh' ? '充足睡眠' : 'Adequate Sleep',
          description: locale === 'zh' ? '保证每天至少8小时的睡眠，睡前可以听听舒缓的音乐' : 'Ensure at least 8 hours of sleep daily, listen to soothing music before bed'
        },
        {
          icon: <Activity className="w-5 h-5" />,
          title: locale === 'zh' ? '适度运动' : 'Moderate Exercise',
          description: locale === 'zh' ? '散步、拉伸、瑜伽等低强度运动有助于改善血液循环' : 'Low-intensity exercises like walking, stretching, yoga help improve circulation'
        }
      ]
    },
    {
      category: locale === 'zh' ? '非药物缓解' : 'Non-Drug Relief',
      icon: <Thermometer className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      methods: [
        {
          icon: <Thermometer className="w-5 h-5" />,
          title: locale === 'zh' ? '热敷' : 'Heat Therapy',
          description: locale === 'zh' ? '用热水袋或暖宝宝敷在小腹或腰部，温暖能放松肌肉，减轻痉挛感' : 'Apply hot water bottle or heat pad to abdomen or lower back to relax muscles'
        },
        {
          icon: <Heart className="w-5 h-5" />,
          title: locale === 'zh' ? '轻柔按摩' : 'Gentle Massage',
          description: locale === 'zh' ? '用手掌轻轻按摩小腹部，顺时针或逆时针都可以' : 'Gently massage lower abdomen with palms, clockwise or counterclockwise'
        },
        {
          icon: <Moon className="w-5 h-5" />,
          title: locale === 'zh' ? '休息和放松' : 'Rest and Relaxation',
          description: locale === 'zh' ? '找个舒服的地方坐下或躺下，听音乐、看书，分散对疼痛的注意力' : 'Find a comfortable place to sit or lie down, listen to music, read to distract from pain'
        }
      ]
    }
  ];

  const warningSignals = [
    locale === 'zh' ? '疼痛突然变得非常剧烈，甚至影响到站立或行走' : 'Pain suddenly becomes very severe, affecting standing or walking',
    locale === 'zh' ? '伴随发烧、剧烈呕吐、腹泻不止、头晕、心慌' : 'Accompanied by fever, severe vomiting, persistent diarrhea, dizziness, palpitations',
    locale === 'zh' ? '非经期也出现腹痛或出血' : 'Abdominal pain or bleeding outside of menstrual period',
    locale === 'zh' ? '服用常规剂量的止痛药后，疼痛没有任何缓解' : 'No pain relief after taking regular doses of pain medication'
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600">
        <Link href={`/${locale}/teen-health`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '青少年专区' : 'Teen Zone'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{locale === 'zh' ? '发育期疼痛管理' : 'Developmental Pain Management'}</span>
      </nav>

      {/* Header */}
      <header className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 rounded-full p-4">
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {locale === 'zh' ? '🌱 发育期疼痛管理' : '🌱 Developmental Pain Management'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '欢迎来到青春期！对于12-16岁的你来说，了解这个阶段经期疼痛的特点，更有助于你科学地管理它。'
            : 'Welcome to adolescence! For you at ages 12-16, understanding the characteristics of period pain at this stage will help you manage it scientifically.'
          }
        </p>
      </header>

      {/* User Story */}
      <section className="bg-pink-50 rounded-2xl p-8 border border-pink-100">
        <div className="flex items-start">
          <div className="bg-pink-100 rounded-full p-2 mr-4 flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'zh' ? '甜甜同学的经历：' : 'Tian Tian\'s Experience:'}
            </h3>
            <p className="text-gray-700 italic">
              {locale === 'zh'
                ? '"我第一次来月经的时候，肚子痛得我都哭了。我妈妈说这是正常的，但我真的很担心是不是生病了。"'
                : '"When I got my first period, the stomach pain made me cry. My mom said it was normal, but I was really worried if I was sick."'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Pain Characteristics */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '青春期经期疼痛的"不太一样"' : 'What Makes Adolescent Period Pain "Different"'}
        </h2>
        
        <div className="bg-blue-50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {locale === 'zh' ? '为什么会痛？' : 'Why Does It Hurt?'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {locale === 'zh'
              ? '简单来说，就是子宫在努力工作，排出经血。这个过程中产生的"指挥官"——前列腺素，会引起子宫肌肉收缩，收缩得越厉害，有些人就越痛。青春期体内激素水平变化比较大，前列腺素水平也可能偏高一些，所以痛感会比较明显。'
              : 'Simply put, the uterus is working hard to expel menstrual blood. During this process, "commanders" called prostaglandins cause uterine muscle contractions. The stronger the contractions, the more pain some people feel. During adolescence, hormone levels fluctuate greatly, and prostaglandin levels may be higher, making pain more noticeable.'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {painCharacteristics.map((characteristic, index) => (
            <div key={index} className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-pink-600">
                  {characteristic.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {characteristic.title}
              </h3>
              <p className="text-gray-600">
                {characteristic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Assessment Tool */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '🎯 评估你的痛经程度' : '🎯 Assess Your Pain Level'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'zh'
              ? '通过简单的自测，了解你的痛经是否在正常范围内，以及是否需要寻求进一步的帮助。'
              : 'Through simple self-assessment, understand if your period pain is within normal range and whether you need to seek further help.'
            }
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <EmbeddedPainAssessment locale={locale} />
        </div>
      </section>

      {/* Management Methods */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '12-16岁专属疼痛管理建议' : 'Specialized Pain Management for Ages 12-16'}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {locale === 'zh' ? '在这个成长关键期，建立健康的经期管理习惯非常重要' : 'During this critical growth period, establishing healthy period management habits is very important'}
        </p>
        
        <div className="space-y-8">
          {managementMethods.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${category.color} mr-4`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {category.category}
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {category.methods.map((method, methodIndex) => (
                  <div key={methodIndex} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${category.color} mr-3`}>
                        {method.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {method.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medication Guidelines */}
      <section className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
        <div className="flex items-center mb-6">
          <Pill className="w-8 h-8 text-yellow-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'zh' ? '药物使用需谨慎' : 'Careful Medication Use'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {locale === 'zh' ? '非处方止痛药：' : 'Over-the-Counter Pain Medication:'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{locale === 'zh' ? '常见药物' : 'Common Medications'}</span>
                  <p className="text-sm text-gray-600">{locale === 'zh' ? '布洛芬（Ibuprofen）或对乙酰氨基酚（Acetaminophen）' : 'Ibuprofen or Acetaminophen'}</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{locale === 'zh' ? '使用原则' : 'Usage Principles'}</span>
                  <p className="text-sm text-gray-600">{locale === 'zh' ? '一定要在家长指导下，严格按照药品说明书的剂量和时间服用' : 'Must be used under parental guidance, strictly following dosage and timing on medication labels'}</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {locale === 'zh' ? '重要提醒：' : 'Important Reminders:'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{locale === 'zh' ? '何时服用' : 'When to Take'}</span>
                  <p className="text-sm text-gray-600">{locale === 'zh' ? '最好在感觉疼痛刚开始时就服用，效果会更好' : 'Best taken when pain first begins for better effectiveness'}</p>
                </div>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{locale === 'zh' ? '不要长期依赖' : 'Don\'t Rely Long-term'}</span>
                  <p className="text-sm text-gray-600">{locale === 'zh' ? '止痛药是缓解症状的手段，不能长期或大剂量使用' : 'Pain medication is for symptom relief, not for long-term or high-dose use'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Warning Signals */}
      <section className="bg-red-50 rounded-2xl p-8 border border-red-200">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'zh' ? '关注身体的"报警信号"' : 'Watch for Body\'s "Warning Signals"'}
          </h2>
        </div>
        
        <p className="text-gray-700 mb-6">
          {locale === 'zh'
            ? '如果出现以下任何一种情况，请务必及时告诉家长，并尽快去看医生！'
            : 'If any of the following situations occur, be sure to tell your parents immediately and see a doctor as soon as possible!'
          }
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {warningSignals.map((signal, index) => (
            <div key={index} className="flex items-start bg-white rounded-lg p-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{signal}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-white rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Stethoscope className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="font-semibold text-gray-900">
              {locale === 'zh' ? '记住：' : 'Remember:'}
            </h3>
          </div>
          <p className="text-gray-700">
            {locale === 'zh'
              ? '发育期的疼痛绝大多数是正常的，但排除潜在的健康问题非常重要。医生会根据你的具体情况给出专业的诊断和建议。'
              : 'Most developmental pain is normal, but it\'s very important to rule out potential health issues. Doctors will provide professional diagnosis and advice based on your specific situation.'
            }
          </p>
        </div>
      </section>

      {/* Encouragement */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {locale === 'zh' ? '💪 你并不孤单' : '💪 You\'re Not Alone'}
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          {locale === 'zh'
            ? '了解自己的身体，关注疼痛的变化，积极采取应对措施，并在需要时大胆寻求帮助，你就能更好地度过青春期的经期。记住，这是成长的一部分，你正在变得更加强大！'
            : 'Understanding your body, monitoring pain changes, actively taking coping measures, and boldly seeking help when needed will help you better navigate adolescent periods. Remember, this is part of growing up - you\'re becoming stronger!'
          }
        </p>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link
          href={`/${locale}/teen-health/campus-guide`}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '上一篇：校园应急指南' : 'Previous: Campus Emergency Guide'}
        </Link>
        
        <Link
          href={`/${locale}/teen-health/emotional-support`}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          {locale === 'zh' ? '下一篇：情绪支持与心理健康' : 'Next: Emotional Support & Mental Health'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
