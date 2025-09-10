import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  BookOpen,
  Baby,
  Flower,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  Download,
  ExternalLink
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
    title: `${t('scenarios.lifeStages.title')} - ${t('title')}`,
    description: t('scenarios.lifeStages.description'),
  };
}

export default async function LifeStagesScenarioPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('scenarioSolutionsPage');
  const commonT = await getTranslations('common');

  const lifeStages = [
    {
      stage: locale === 'zh' ? '青春期专项方案' : 'Adolescence Program',
      ageRange: locale === 'zh' ? '12-18岁' : '12-18 years',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
      description: locale === 'zh' ? '初潮教育与校园应对策略' : 'Menarche education and campus coping strategies',
      keyFeatures: [
        {
          title: locale === 'zh' ? '基础科普与心理疏导' : 'Basic Education & Psychological Guidance',
          details: [
            locale === 'zh' ? '全面的痛经知识科普，消除恐惧和羞耻感' : 'Comprehensive menstrual pain education, eliminate fear and shame',
            locale === 'zh' ? '正确的健康观念和应对疼痛的信心' : 'Correct health concepts and confidence in pain management',
            locale === 'zh' ? '学校健康教育课程和讲座' : 'School health education courses and lectures'
          ]
        },
        {
          title: locale === 'zh' ? '生活方式调整指导' : 'Lifestyle Adjustment Guidance',
          details: [
            locale === 'zh' ? '规律作息，保证8-9小时睡眠' : 'Regular schedule, ensure 8-9 hours of sleep',
            locale === 'zh' ? '合理饮食，增加铁、蛋白质、维生素摄入' : 'Balanced diet, increase iron, protein, vitamin intake',
            locale === 'zh' ? '适当运动，每周3-5次有氧运动' : 'Appropriate exercise, 3-5 times aerobic exercise per week'
          ]
        },
        {
          title: locale === 'zh' ? '校园应急支持措施' : 'Campus Emergency Support Measures',
          details: [
            locale === 'zh' ? '宿舍和教室配备卫生用品和应急药品' : 'Dormitories and classrooms equipped with sanitary products and emergency medicines',
            locale === 'zh' ? '健康咨询室和心理辅导室' : 'Health consultation room and psychological counseling room',
            locale === 'zh' ? '专业校医和心理咨询师服务' : 'Professional school doctor and psychological counselor services'
          ]
        }
      ],
      emergencyKit: [
        locale === 'zh' ? '防漏警报内裤' : 'Leak-proof alarm underwear',
        locale === 'zh' ? '无声暖贴' : 'Silent warming patches',
        locale === 'zh' ? '经期知识漫画手册' : 'Menstrual knowledge comic handbook',
        locale === 'zh' ? '舒缓运动视频课程' : 'Soothing exercise video courses'
      ]
    },
    {
      stage: locale === 'zh' ? '备孕期专项方案' : 'Pre-pregnancy Program',
      ageRange: locale === 'zh' ? '25-35岁' : '25-35 years',
      icon: <Baby className="w-8 h-8" />,
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200',
      description: locale === 'zh' ? '自然疗法与生育健康优化' : 'Natural therapy and reproductive health optimization',
      keyFeatures: [
        {
          title: locale === 'zh' ? '自然疗法与饮食调理' : 'Natural Therapy & Dietary Adjustment',
          details: [
            locale === 'zh' ? '热敷、按摩、瑜伽等天然缓解方法' : 'Natural relief methods like heat therapy, massage, yoga',
            locale === 'zh' ? '富含维生素B6、钙、镁、欧米茄-3的食物' : 'Foods rich in vitamin B6, calcium, magnesium, omega-3',
            locale === 'zh' ? '规律饮食习惯，避免过度节食或暴饮暴食' : 'Regular eating habits, avoid excessive dieting or overeating'
          ]
        },
        {
          title: locale === 'zh' ? '医生咨询与药物管理' : 'Medical Consultation & Medication Management',
          details: [
            locale === 'zh' ? '孕前全面身体检查，特别是生殖系统检查' : 'Comprehensive pre-pregnancy physical examination, especially reproductive system',
            locale === 'zh' ? '排除继发性痛经可能（子宫内膜异位症等）' : 'Rule out secondary dysmenorrhea (endometriosis, etc.)',
            locale === 'zh' ? '在医生指导下合理使用药物治疗' : 'Rational use of medication under doctor\'s guidance'
          ]
        },
        {
          title: locale === 'zh' ? '生活方式与习惯调整' : 'Lifestyle & Habit Adjustment',
          details: [
            locale === 'zh' ? '戒烟戒酒，避免熬夜，减少咖啡因摄入' : 'Quit smoking and drinking, avoid staying up late, reduce caffeine intake',
            locale === 'zh' ? '每周3-4次中等强度有氧运动和力量训练' : '3-4 times moderate-intensity aerobic exercise and strength training per week',
            locale === 'zh' ? '保持良好心理状态，缓解备孕心理负担' : 'Maintain good mental state, relieve psychological burden of pregnancy preparation'
          ]
        }
      ],
      emergencyKit: [
        locale === 'zh' ? '基础体温智能分析系统' : 'Basal body temperature intelligent analysis system',
        locale === 'zh' ? '子宫内膜血流检测食谱' : 'Endometrial blood flow detection recipes',
        locale === 'zh' ? '黄体期专属瑜伽序列' : 'Luteal phase exclusive yoga sequence',
        locale === 'zh' ? '备孕营养补充指南' : 'Pre-pregnancy nutrition supplement guide'
      ]
    },
    {
      stage: locale === 'zh' ? '围绝经期专项方案' : 'Perimenopause Program',
      ageRange: locale === 'zh' ? '45-55岁' : '45-55 years',
      icon: <Flower className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
      description: locale === 'zh' ? '荷尔蒙疗法与综合管理' : 'Hormone therapy and comprehensive management',
      keyFeatures: [
        {
          title: locale === 'zh' ? '荷尔蒙疗法与医生指导' : 'Hormone Therapy & Medical Guidance',
          details: [
            locale === 'zh' ? '在医生评估下考虑荷尔蒙疗法缓解症状' : 'Consider hormone therapy under doctor\'s evaluation to relieve symptoms',
            locale === 'zh' ? '调节内分泌平衡，减轻痛经和月经不调' : 'Regulate endocrine balance, reduce dysmenorrhea and menstrual irregularities',
            locale === 'zh' ? '定期身体检查和监测，注意风险和副作用' : 'Regular physical examination and monitoring, pay attention to risks and side effects'
          ]
        },
        {
          title: locale === 'zh' ? '生活方式调整与自我保健' : 'Lifestyle Adjustment & Self-care',
          details: [
            locale === 'zh' ? '增加富含植物雌激素的食物（大豆制品、亚麻籽）' : 'Increase foods rich in phytoestrogens (soy products, flaxseed)',
            locale === 'zh' ? '保证7-8小时睡眠，适当增加午休时间' : 'Ensure 7-8 hours of sleep, appropriately increase nap time',
            locale === 'zh' ? '散步、太极拳、瑜伽等舒缓运动项目' : 'Gentle exercise programs like walking, tai chi, yoga'
          ]
        },
        {
          title: locale === 'zh' ? '心理支持与社交活动' : 'Psychological Support & Social Activities',
          details: [
            locale === 'zh' ? '参加心理辅导课程和围绝经期女性支持小组' : 'Participate in psychological counseling courses and perimenopause women support groups',
            locale === 'zh' ? '积极参加文化活动、旅游、志愿者服务' : 'Actively participate in cultural activities, travel, volunteer services',
            locale === 'zh' ? '保持积极乐观心态，增强自信心和生活乐趣' : 'Maintain positive and optimistic attitude, enhance confidence and life enjoyment'
          ]
        }
      ],
      emergencyKit: [
        locale === 'zh' ? '潮热预警手环' : 'Hot flash warning bracelet',
        locale === 'zh' ? '骨骼密度保护食谱' : 'Bone density protection recipes',
        locale === 'zh' ? '情绪管理音频课程' : 'Emotional management audio courses',
        locale === 'zh' ? '围绝经期症状追踪表' : 'Perimenopause symptom tracking chart'
      ]
    }
  ];

  const commonChallenges = [
    {
      challenge: locale === 'zh' ? '心理压力管理' : 'Psychological Stress Management',
      solutions: [
        locale === 'zh' ? '建立正确的健康观念，消除对痛经的恐惧' : 'Establish correct health concepts, eliminate fear of dysmenorrhea',
        locale === 'zh' ? '寻求专业心理咨询和家庭支持' : 'Seek professional psychological counseling and family support',
        locale === 'zh' ? '参加同龄人支持小组，分享经验' : 'Join peer support groups, share experiences'
      ]
    },
    {
      challenge: locale === 'zh' ? '生活方式调整' : 'Lifestyle Adjustment',
      solutions: [
        locale === 'zh' ? '制定个性化的作息时间表' : 'Create personalized schedule',
        locale === 'zh' ? '选择适合年龄段的运动方式' : 'Choose age-appropriate exercise methods',
        locale === 'zh' ? '建立健康的饮食习惯和营养搭配' : 'Establish healthy eating habits and nutritional combinations'
      ]
    },
    {
      challenge: locale === 'zh' ? '医疗资源获取' : 'Medical Resource Access',
      solutions: [
        locale === 'zh' ? '定期进行专业医疗检查和咨询' : 'Regular professional medical examinations and consultations',
        locale === 'zh' ? '了解不同生理阶段的特殊需求' : 'Understand special needs of different physiological stages',
        locale === 'zh' ? '建立与医疗专业人士的长期关系' : 'Establish long-term relationships with medical professionals'
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-12" data-page="scenario-lifestages">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/scenario-solutions`} className="hover:text-primary-600 transition-colors">
          {t('title')}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">{t('scenarios.lifeStages.title')}</span>
      </nav>

      {/* Page Header */}
      <header className="text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {t('scenarios.lifeStages.title')}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {t('scenarios.lifeStages.description')}
        </p>
      </header>

      {/* Life Stages Section */}
      <section className="space-y-12">
        {lifeStages.map((stage, index) => (
          <div key={index} className={`border-2 rounded-xl p-6 md:p-8 ${stage.borderColor}`}>
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${stage.color} mr-4`}>
                {stage.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                  {stage.stage}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium">
                    {stage.ageRange}
                  </span>
                  <p className="text-neutral-600">
                    {stage.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {stage.keyFeatures.map((feature, featureIndex) => (
                <div key={featureIndex} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={`${stage.color.replace('text-', 'bg-').replace('-600', '-100')} p-4 rounded-lg`}>
              <h4 className={`font-semibold mb-3 ${stage.color.replace('bg-', 'text-').replace('-50', '-800')}`}>
                {locale === 'zh' ? '专项工具包：' : 'Specialized Toolkit:'}
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {stage.emergencyKit.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white p-3 rounded text-center">
                    <span className="text-sm text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Resources for Adolescence Program */}
            {index === 0 && (
              <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-4 text-blue-800 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  {locale === 'zh' ? '相关PDF资源下载' : 'Related PDF Resources'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    href={`/${locale}/downloads/preview/campus-emergency-checklist`}
                    className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100 hover:border-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">
                        {locale === 'zh' ? '校园应急清单' : 'Campus Emergency Checklist'}
                      </div>
                      <div className="text-xs text-blue-600">
                        {locale === 'zh' ? '校园经期应急处理指南' : 'Campus menstrual emergency guide'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/downloads/preview/parent-communication-guide`}
                    className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100 hover:border-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">
                        {locale === 'zh' ? '家长沟通指导手册' : 'Parent Communication Guide'}
                      </div>
                      <div className="text-xs text-blue-600">
                        {locale === 'zh' ? '帮助家长与青春期女儿沟通' : 'Help parents communicate with teenage daughters'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/downloads/preview/teacher-health-manual`}
                    className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100 hover:border-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">
                        {locale === 'zh' ? '教师健康管理手册' : 'Teacher Health Manual'}
                      </div>
                      <div className="text-xs text-blue-600">
                        {locale === 'zh' ? '教师和学校卫生人员指南' : 'Guide for teachers and school health personnel'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/${locale}/downloads/preview/teacher-collaboration-handbook`}
                    className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100 hover:border-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 text-sm">
                        {locale === 'zh' ? '教师协作手册' : 'Teacher Collaboration Handbook'}
                      </div>
                      <div className="text-xs text-blue-600">
                        {locale === 'zh' ? '理解与支持经期不适的青少年学生' : 'Understanding and supporting adolescent students with menstrual discomfort'}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Common Challenges Section */}
      <section>
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-red-600 mr-3" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {locale === 'zh' ? '跨阶段共同挑战' : 'Cross-Stage Common Challenges'}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {commonChallenges.map((item, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                {item.challenge}
              </h3>
              <ul className="space-y-3">
                {item.solutions.map((solution, solutionIndex) => (
                  <li key={solutionIndex} className="flex items-start">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {solutionIndex + 1}
                    </span>
                    <span className="text-sm text-neutral-700">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Support */}
      <section className="bg-yellow-50 p-6 md:p-8 rounded-xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          {locale === 'zh' ? '专业支持网络' : 'Professional Support Network'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-yellow-700">
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '医疗专业人士' : 'Medical Professionals'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '妇产科医生：专业诊断和治疗建议' : 'Gynecologists: Professional diagnosis and treatment advice'}</li>
              <li>• {locale === 'zh' ? '内分泌科医生：激素水平调节' : 'Endocrinologists: Hormone level regulation'}</li>
              <li>• {locale === 'zh' ? '营养师：个性化饮食指导' : 'Nutritionists: Personalized dietary guidance'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{locale === 'zh' ? '心理健康支持' : 'Mental Health Support'}</h4>
            <ul className="space-y-1">
              <li>• {locale === 'zh' ? '心理咨询师：情绪管理和压力缓解' : 'Psychologists: Emotional management and stress relief'}</li>
              <li>• {locale === 'zh' ? '同龄人支持小组：经验分享和互助' : 'Peer support groups: Experience sharing and mutual aid'}</li>
              <li>• {locale === 'zh' ? '家庭支持系统：理解和关爱' : 'Family support system: Understanding and care'}</li>
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
