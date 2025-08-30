import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Heart,
  School,
  Brain,
  MessageCircle,
  Users,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles
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
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function TeenHealthPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('teenHealth');

  const features = [
    {
      id: 'campus-guide',
      title: locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide',
      description: locale === 'zh' 
        ? '在学校突然痛起来怎么办？课堂应急、宿舍管理、体育课应对，全方位校园生存指南。'
        : 'What to do when pain strikes at school? Classroom emergencies, dorm management, PE class strategies - comprehensive campus survival guide.',
      icon: <School className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      href: '/teen-health/campus-guide',
      highlights: [
        locale === 'zh' ? '课堂悄悄自救技巧' : 'Classroom self-help techniques',
        locale === 'zh' ? '宿舍疼痛管理' : 'Dorm pain management',
        locale === 'zh' ? '体育课应对策略' : 'PE class strategies'
      ]
    },
    {
      id: 'development-pain',
      title: locale === 'zh' ? '发育期疼痛管理' : 'Developmental Pain Management',
      description: locale === 'zh'
        ? '12-16岁专属疼痛管理建议，了解青春期痛经特点，掌握科学缓解方法。'
        : 'Specialized pain management advice for ages 12-16, understanding adolescent period pain characteristics and scientific relief methods.',
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-pink-50 text-pink-600',
      href: '/teen-health/development-pain',
      highlights: [
        locale === 'zh' ? '青春期痛经特点' : 'Adolescent period pain characteristics',
        locale === 'zh' ? '科学缓解方法' : 'Scientific relief methods',
        locale === 'zh' ? '何时需要就医' : 'When to seek medical help'
      ]
    },
    {
      id: 'emotional-support',
      title: locale === 'zh' ? '情绪支持与心理健康' : 'Emotional Support & Mental Health',
      description: locale === 'zh'
        ? '经期焦虑、情绪低落如何应对？放松技巧、同龄人经验分享，陪你度过情绪"过山车"。'
        : 'How to cope with period anxiety and mood swings? Relaxation techniques, peer experience sharing to help you through emotional "roller coasters".',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      href: '/teen-health/emotional-support',
      highlights: [
        locale === 'zh' ? '情绪调节技巧' : 'Emotional regulation techniques',
        locale === 'zh' ? '焦虑缓解方法' : 'Anxiety relief methods',
        locale === 'zh' ? '同龄人经验分享' : 'Peer experience sharing'
      ]
    },
    {
      id: 'communication-guide',
      title: locale === 'zh' ? '沟通指导' : 'Communication Guide',
      description: locale === 'zh'
        ? '如何与家长、老师、医生有效沟通？提供对话模板和沟通技巧，让你勇敢表达需求。'
        : 'How to effectively communicate with parents, teachers, and doctors? Conversation templates and communication skills to help you express your needs confidently.',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'bg-green-50 text-green-600',
      href: '/teen-health/communication-guide',
      highlights: [
        locale === 'zh' ? '家长沟通模板' : 'Parent communication templates',
        locale === 'zh' ? '老师协作指南' : 'Teacher collaboration guide',
        locale === 'zh' ? '医生沟通技巧' : 'Doctor communication skills'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl opacity-50"></div>
        <div className="relative z-10 py-16 px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {locale === 'zh' ? '🌸 青少年经期健康专区 🌸' : '🌸 Teen Menstrual Health Zone 🌸'}
          </h1>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            {locale === 'zh' 
              ? '专为12-18岁的你打造的私密空间'
              : 'A private space designed especially for you, ages 12-18'
            }
          </p>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {locale === 'zh'
              ? '青春期有太多烦恼，而每个月的"那几天"更是让人担心。疼痛、情绪波动、身体变化……别担心，你不是一个人在战斗。在这里，你会找到科学、贴心、好懂的经期知识和应对方法。无论你在学校、在家，还是感觉焦虑不安，我们都会陪你一起度过。'
              : 'Adolescence brings many worries, and "those days" each month can be especially concerning. Pain, mood swings, body changes... Don\'t worry, you\'re not fighting alone. Here, you\'ll find scientific, caring, and easy-to-understand period knowledge and coping methods. Whether you\'re at school, at home, or feeling anxious, we\'ll be with you through it all.'
            }
          </p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'zh' ? '🚨 现在就需要帮助？' : '🚨 Need Help Right Now?'}
              </h2>
            </div>
            <p className="text-gray-700 mb-6">
              {locale === 'zh'
                ? '如果你现在正在经历疼痛或感到困扰，这里有一些立即可以尝试的方法。'
                : 'If you\'re experiencing pain or distress right now, here are some immediate methods you can try.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/${locale}/teen-health/campus-guide`}
                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                {locale === 'zh' ? '校园应急指南' : 'Campus Emergency Guide'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href={`/${locale}/scenario-solutions/emergency-kit`}
                className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-full font-medium border-2 border-red-200 hover:bg-red-50 transition-colors"
              >
                {locale === 'zh' ? '应急包清单' : 'Emergency Kit List'}
              </Link>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '立即可用的方法' : 'Immediate Methods'}
              </h3>
              <div className="space-y-2">
                {[
                  locale === 'zh' ? '热敷小腹或腰部' : 'Apply heat to abdomen or lower back',
                  locale === 'zh' ? '深呼吸放松练习' : 'Deep breathing relaxation',
                  locale === 'zh' ? '轻柔按摩腹部' : 'Gentle abdominal massage',
                  locale === 'zh' ? '寻求老师或朋友帮助' : 'Seek help from teachers or friends'
                ].map((method, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Assessment Tool Section */}
      <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '🎯 痛经快速自测' : '🎯 Quick Pain Assessment'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'zh'
              ? '不确定自己的痛经程度？通过简单的问题，快速了解你的情况并获得个性化建议。'
              : 'Not sure about your pain level? Through simple questions, quickly understand your situation and get personalized advice.'
            }
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <EmbeddedPainAssessment locale={locale} />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-4">
            {locale === 'zh'
              ? '想要更详细的评估？'
              : 'Want a more detailed assessment?'
            }
          </p>
          <Link
            href={`/${locale}/interactive-tools/period-pain-assessment`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            {locale === 'zh' ? '使用完整版评估工具' : 'Use Full Assessment Tool'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Main Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          {locale === 'zh' ? '我们能帮你什么？' : 'How Can We Help You?'}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {locale === 'zh'
            ? '从校园应急到情绪支持，从疼痛管理到沟通技巧，全方位陪伴你的青春期经期健康之旅。'
            : 'From campus emergencies to emotional support, from pain management to communication skills - comprehensive support for your adolescent period health journey.'
          }
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {feature.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              
              <Link
                href={`/${locale}${feature.href}`}
                className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors"
              >
                <span className="mr-2">{locale === 'zh' ? '了解更多' : 'Learn More'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '📚 专属资源库' : '📚 Exclusive Resource Library'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'zh'
              ? '我们为你准备了丰富的学习资源，包括推荐书单、营养食谱、沟通模板等，帮助你成为自己的经期健康专家。'
              : 'We\'ve prepared rich learning resources for you, including recommended reading lists, nutrition recipes, communication templates, and more to help you become your own period health expert.'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '推荐书单' : 'Reading List'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'zh' ? '精选适合青少年的经期健康书籍' : 'Curated period health books for teens'}
            </p>
            <Link
              href={`/${locale}/articles/recommended-reading-list`}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              {locale === 'zh' ? '查看书单' : 'View List'} →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-pink-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '营养食谱' : 'Nutrition Recipes'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'zh' ? '经期友好的营养搭配和食谱' : 'Period-friendly nutrition and recipes'}
            </p>
            <Link 
              href={`/${locale}/articles/period-friendly-recipes`}
              className="text-pink-600 text-sm font-medium hover:text-pink-700"
            >
              {locale === 'zh' ? '查看食谱' : 'View Recipes'} →
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '沟通模板' : 'Communication Templates'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {locale === 'zh' ? '与家长、老师沟通的实用模板' : 'Practical templates for talking with parents and teachers'}
            </p>
            <Link 
              href={`/${locale}/teen-health/communication-guide`}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              {locale === 'zh' ? '获取模板' : 'Get Templates'} →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          {locale === 'zh' ? '开始你的健康之旅' : 'Start Your Health Journey'}
        </h2>
        <p className="text-xl mb-8 opacity-90">
          {locale === 'zh'
            ? '让我们一起学习，自信地面对经期，不再让疼痛和烦恼影响你的生活！'
            : 'Let\'s learn together and face your period with confidence, no longer letting pain and worries affect your life!'
          }
        </p>
        <Link
          href={`/${locale}/teen-health/campus-guide`}
          className="inline-flex items-center bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors"
        >
          {locale === 'zh' ? '开始探索' : 'Start Exploring'}
          <ArrowRight className="w-6 h-6 ml-2" />
        </Link>
      </section>
    </div>
  );
}
