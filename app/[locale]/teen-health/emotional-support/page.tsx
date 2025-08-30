import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  Brain, 
  Heart, 
  Moon, 
  Music,
  PenTool,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Headphones,
  BookOpen,
  Smile,
  Frown,
  Zap
} from 'lucide-react';
import type { Metadata } from 'next';

type Locale = 'en' | 'zh';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'teenHealth' });
  
  return {
    title: locale === 'zh' ? '情绪支持与心理健康 - 青少年经期健康专区' : 'Emotional Support & Mental Health - Teen Menstrual Health Zone',
    description: locale === 'zh' 
      ? '经期焦虑、情绪低落如何应对？放松技巧、同龄人经验分享，陪你度过情绪"过山车"。'
      : 'How to cope with period anxiety and mood swings? Relaxation techniques and peer experience sharing.',
  };
}

export default async function EmotionalSupportPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  unstable_setRequestLocale(locale);

  const emotionalSymptoms = [
    {
      icon: <Frown className="w-6 h-6" />,
      title: locale === 'zh' ? '烦躁易怒' : 'Irritability',
      description: locale === 'zh' ? '一点小事就可能点燃你的怒火' : 'Small things might easily trigger your anger'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: locale === 'zh' ? '情绪低落' : 'Low Mood',
      description: locale === 'zh' ? '感觉没精神、提不起劲，甚至有点想哭' : 'Feeling listless, lacking energy, even wanting to cry'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: locale === 'zh' ? '焦虑不安' : 'Anxiety',
      description: locale === 'zh' ? '担心疼痛、担心出血、担心别人发现' : 'Worrying about pain, bleeding, or others noticing'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: locale === 'zh' ? '注意力不集中' : 'Difficulty Concentrating',
      description: locale === 'zh' ? '学习效率下降，难以专注' : 'Decreased study efficiency, hard to focus'
    }
  ];

  const copingStrategies = [
    {
      category: locale === 'zh' ? '放松技巧' : 'Relaxation Techniques',
      icon: <Moon className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      strategies: [
        {
          icon: <Heart className="w-5 h-5" />,
          title: locale === 'zh' ? '深呼吸练习' : 'Deep Breathing',
          description: locale === 'zh' ? '在感觉烦躁或焦虑时，找一个安静的地方，做几次深呼吸' : 'When feeling irritated or anxious, find a quiet place and take several deep breaths'
        },
        {
          icon: <Brain className="w-5 h-5" />,
          title: locale === 'zh' ? '冥想或正念' : 'Meditation or Mindfulness',
          description: locale === 'zh' ? '尝试简单的引导式冥想，帮助平静内心' : 'Try simple guided meditation to help calm your mind'
        },
        {
          icon: <Headphones className="w-5 h-5" />,
          title: locale === 'zh' ? '听音乐/ASMR' : 'Music/ASMR',
          description: locale === 'zh' ? '听一些让你放松或愉悦的音乐，或尝试ASMR音频' : 'Listen to relaxing or pleasant music, or try ASMR audio'
        }
      ]
    },
    {
      category: locale === 'zh' ? '情绪表达' : 'Emotional Expression',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      strategies: [
        {
          icon: <PenTool className="w-5 h-5" />,
          title: locale === 'zh' ? '写日记或画画' : 'Journaling or Drawing',
          description: locale === 'zh' ? '把自己的感受写下来或画出来，是一种很好的情绪宣泄方式' : 'Writing down or drawing your feelings is a great way to release emotions'
        },
        {
          icon: <Smile className="w-5 h-5" />,
          title: locale === 'zh' ? '做喜欢的事' : 'Do What You Love',
          description: locale === 'zh' ? '看电影、听歌、和朋友聊天、做手工，做任何让你感到开心的事情' : 'Watch movies, listen to music, chat with friends, do crafts - anything that makes you happy'
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: locale === 'zh' ? '与人沟通' : 'Communicate with Others',
          description: locale === 'zh' ? '和你信任的朋友、家人或老师聊聊你的感受' : 'Talk about your feelings with trusted friends, family, or teachers'
        }
      ]
    }
  ];

  const peerExperiences = [
    {
      question: locale === 'zh' ? '经期前情绪特别差，看什么都不顺眼，怎么控制自己的脾气不迁怒家人？' : 'My mood is particularly bad before my period, everything annoys me. How can I control my temper and not take it out on family?',
      answer: locale === 'zh' 
        ? '我也是这样！我的方法是，感觉快要发脾气的时候，就深呼吸，然后找个没人的地方呆几分钟，或者出去散步。告诉家人我这几天情绪不太稳定，请他们多担待一下，得到理解会好很多。'
        : 'I\'m the same way! My method is to take deep breaths when I feel like I\'m about to lose my temper, then find a quiet place to stay for a few minutes or go for a walk. I tell my family that my emotions are unstable these days and ask for their understanding - it helps a lot.'
    },
    {
      question: locale === 'zh' ? '每次来月经，我就害怕肚子痛，而且会想好多奇奇怪怪的事情，感觉自己好焦虑，正常吗？' : 'Every time I get my period, I\'m afraid of stomach pain and think about many strange things. I feel so anxious - is this normal?',
      answer: locale === 'zh'
        ? '超级正常！我那时候也是，会过度担心疼痛、学习变差、身材变化之类的。后来我知道这是激素的影响，就没那么害怕了。多了解科普知识，知道身体是怎么回事，能减轻很多焦虑。我还会去做些喜欢的事情分散注意力。'
        : 'Super normal! I was the same way, worrying excessively about pain, declining grades, body changes, etc. Later I learned this was hormonal influence and wasn\'t so scared anymore. Learning more scientific knowledge about how the body works can reduce a lot of anxiety. I also do things I enjoy to distract myself.'
    },
    {
      question: locale === 'zh' ? '我痛经很厉害，有时候会哭，但不敢告诉任何人，觉得很丢脸怎么办？' : 'My period pain is severe and sometimes I cry, but I don\'t dare tell anyone because I feel embarrassed. What should I do?',
      answer: locale === 'zh'
        ? '痛经不是丢脸的事！它是很多女生都会经历的。勇敢地告诉你最信任的人，比如妈妈、好朋友、校医，他们会理解你、帮助你的。寻求帮助不是示弱，是爱自己的表现。'
        : 'Period pain is not embarrassing! It\'s something many girls experience. Bravely tell someone you trust most, like your mom, good friend, or school nurse - they will understand and help you. Seeking help isn\'t weakness, it\'s self-care.'
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
        <span className="text-gray-900">{locale === 'zh' ? '情绪支持与心理健康' : 'Emotional Support & Mental Health'}</span>
      </nav>

      {/* Header */}
      <header className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 rounded-full p-4">
            <Brain className="w-12 h-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {locale === 'zh' ? '💭 情绪支持与心理健康' : '💭 Emotional Support & Mental Health'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '经期不仅仅是身体上的不适，有时候情绪也会跟着"感冒"。烦躁、易怒、感觉低落、甚至有点想哭？别担心，这很正常！'
            : 'Periods aren\'t just physical discomfort - sometimes emotions can "catch a cold" too. Irritable, angry, feeling down, even wanting to cry? Don\'t worry, this is normal!'
          }
        </p>
      </header>

      {/* User Stories */}
      <section className="space-y-6">
        <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-4 flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'zh' ? '小雅同学：' : 'Xiao Ya:'}
              </h3>
              <p className="text-gray-700 italic">
                {locale === 'zh'
                  ? '"来月经前几天，我总是会莫名其妙地烦躁，看什么都不顺眼，特别容易和小伙伴吵架，事后又很后悔。"'
                  : '"A few days before my period, I always get inexplicably irritated, everything annoys me, and I easily argue with friends, then regret it afterwards."'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'zh' ? '小静同学：' : 'Xiao Jing:'}
              </h3>
              <p className="text-gray-700 italic">
                {locale === 'zh'
                  ? '"每次月经快来，我就特别紧张，害怕肚子痛，害怕血量多弄脏裤子，晚上都睡不好。感觉自己好脆弱。"'
                  : '"Every time my period is coming, I get especially nervous, afraid of stomach pain, afraid of heavy bleeding staining my pants, can\'t sleep well at night. I feel so vulnerable."'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Emotions Are Affected */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '为什么经期情绪会受影响？' : 'Why Are Emotions Affected During Periods?'}
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {locale === 'zh'
              ? '主要是因为月经周期中体内激素水平的波动。特别是雌激素和孕激素，它们的变化会影响大脑中一些调节情绪的化学物质，比如血清素。所以，感觉情绪不稳定是很正常的生理反应。'
              : 'This is mainly due to hormonal fluctuations during the menstrual cycle. Especially estrogen and progesterone - their changes affect mood-regulating chemicals in the brain, like serotonin. So feeling emotionally unstable is a very normal physiological response.'
            }
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {emotionalSymptoms.map((symptom, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <div className="text-purple-600">
                    {symptom.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {symptom.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {symptom.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coping Strategies */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '应对经期焦虑和情绪低落' : 'Coping with Period Anxiety and Low Mood'}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {locale === 'zh' ? '理解这些是身体的正常反应，是缓解焦虑的第一步' : 'Understanding these as normal bodily responses is the first step to relieving anxiety'}
        </p>
        
        <div className="space-y-8">
          {copingStrategies.map((category, index) => (
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
                {category.strategies.map((strategy, strategyIndex) => (
                  <div key={strategyIndex} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${category.color} mr-3`}>
                        {strategy.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {strategy.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {strategy.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Healthy Habits */}
      <section className="bg-green-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center mb-6">
          <Heart className="w-8 h-8 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'zh' ? '建立健康的情绪管理习惯' : 'Build Healthy Emotional Management Habits'}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Moon className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '充足的睡眠' : 'Adequate Sleep'}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {locale === 'zh' ? '保证高质量的睡眠对调节情绪非常重要。睡前可以听一些舒缓的音乐或冥想音频。' : 'Quality sleep is crucial for emotional regulation. Listen to soothing music or meditation audio before bed.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '同伴支持' : 'Peer Support'}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {locale === 'zh' ? '知道自己不是一个人经历这些很重要。可以和同龄小伙伴交流，或者看看别人是如何应对的。' : 'Knowing you\'re not alone in experiencing this is important. Talk with peers or see how others cope.'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-3">
              <BookOpen className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'zh' ? '学习了解' : 'Learn and Understand'}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {locale === 'zh' ? '多了解经期相关的科学知识，理解身体变化，能够减少很多不必要的担心和焦虑。' : 'Learning scientific knowledge about periods and understanding body changes can reduce unnecessary worry and anxiety.'}
            </p>
          </div>
        </div>
      </section>

      {/* Peer Q&A */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {locale === 'zh' ? '👭 同龄人经验分享' : '👭 Peer Experience Sharing'}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {locale === 'zh' ? '来自真实用户的匿名问答，你并不孤单' : 'Anonymous Q&A from real users - you\'re not alone'}
        </p>
        
        <div className="space-y-8">
          {peerExperiences.map((experience, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-2">Q:</h3>
                    <p className="text-gray-700">{experience.question}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 mb-2">A:</h3>
                    <p className="text-gray-700 italic">{experience.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'zh' ? '何时寻求专业帮助？' : 'When to Seek Professional Help?'}
          </h2>
        </div>
        
        <p className="text-gray-700 mb-6">
          {locale === 'zh'
            ? '如果你的经期情绪问题（焦虑、抑郁、易怒）非常严重，持续时间长，影响到你的学习、社交和日常生活，或者有自我伤害的想法，请一定要告诉家长或老师，并寻求专业的心理咨询师或医生的帮助。'
            : 'If your period-related emotional issues (anxiety, depression, irritability) are very severe, last a long time, affect your studies, social life, and daily activities, or if you have thoughts of self-harm, please tell your parents or teachers and seek help from professional counselors or doctors.'
          }
        </p>
        
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {locale === 'zh' ? '记住：' : 'Remember:'}
          </h3>
          <p className="text-gray-700">
            {locale === 'zh'
              ? '情绪像天气一样会有阴晴圆缺，特别是经期。了解它，接纳它，并学会与它相处，你会越来越强大。'
              : 'Emotions are like weather - they have ups and downs, especially during periods. Understanding, accepting, and learning to live with them will make you stronger.'
            }
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link
          href={`/${locale}/teen-health/development-pain`}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '上一篇：发育期疼痛管理' : 'Previous: Developmental Pain Management'}
        </Link>
        
        <Link
          href={`/${locale}/teen-health/communication-guide`}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          {locale === 'zh' ? '下一篇：沟通指导' : 'Next: Communication Guide'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
