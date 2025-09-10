import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

// Static imports for interactive tools (temporary fix)
import PainTrackerTool from '../components/PainTrackerTool';
import SymptomAssessmentTool from '../components/SymptomAssessmentTool';
import ConstitutionTestTool from '../components/ConstitutionTestTool';
import PeriodPainAssessmentTool from '../components/PeriodPainAssessmentTool';
import CycleTrackerTool from '../components/CycleTrackerTool';
import SymptomTrackerTool from '../components/SymptomTrackerTool';

// Types
type Locale = 'en' | 'zh';

interface Tool {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
  };
  content: string;
  locale: Locale;
}

// Mock function to get tool data - replace with actual data fetching
const getToolBySlug = async (slug: string, locale: Locale): Promise<Tool | null> => {
  const sampleTools: Tool[] = [
    {
      slug: 'symptom-assessment',
      frontmatter: {
        title: locale === 'zh' ? '症状评估工具' : 'Symptom Assessment Tool',
        description: locale === 'zh'
          ? '通过专业问卷快速识别疼痛类型，为您提供精准的个性化建议。'
          : 'Quickly identify pain types through professional questionnaires and receive precise personalized recommendations.',
        category: locale === 'zh' ? '评估工具' : 'Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '5-10分钟' : '5-10 minutes',
      },
      content: locale === 'zh' ? `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">开始评估前</h3>
          <p class="text-blue-700">请确保您在一个安静、私密的环境中，可以专心回答问题。这个评估将帮助您更好地了解自己的症状模式。</p>
        </div>
        
        <h2>症状评估问卷</h2>
        <p>请根据您最近3个月的经期体验回答以下问题：</p>
        
        <div class="space-y-6 mt-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">1. 疼痛强度</h3>
            <p class="text-gray-600 mb-3">请评估您经期疼痛的平均强度（1-10分，10分为最痛）：</p>
            <div class="grid grid-cols-5 gap-2">
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">1-2分<br><span class="text-xs text-gray-500">轻微</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">3-4分<br><span class="text-xs text-gray-500">轻度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">5-6分<br><span class="text-xs text-gray-500">中度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">7-8分<br><span class="text-xs text-gray-500">重度</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">9-10分<br><span class="text-xs text-gray-500">极重</span></button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">2. 疼痛类型</h3>
            <p class="text-gray-600 mb-3">您的疼痛主要表现为：</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 痉挛性疼痛（抽筋样）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 胀痛（腹部胀满）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 刺痛（针扎样）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 钝痛（持续性隐痛）
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 放射痛（向腰背部扩散）
              </label>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">3. 伴随症状</h3>
            <p class="text-gray-600 mb-3">除了腹痛，您还有以下症状吗？</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 头痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 恶心呕吐
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 腰痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 乳房胀痛
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 情绪波动
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 疲劳乏力
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 失眠
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> 食欲改变
              </label>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">4. 疼痛时间</h3>
            <p class="text-gray-600 mb-3">疼痛通常在什么时候开始？</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经前1-2天
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经第一天
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 月经期间持续
              </label>
              <label class="flex items-center">
                <input type="radio" name="pain-timing" class="mr-3"> 排卵期也有疼痛
              </label>
            </div>
          </div>
          
          <div class="text-center">
            <button class="btn-primary px-8 py-3">
              提交评估
            </button>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">重要提醒</h3>
          <p class="text-yellow-700">此评估仅供参考，不能替代专业医疗诊断。如果您的症状严重或持续恶化，请及时就医。</p>
        </div>
      ` : `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">Before Starting</h3>
          <p class="text-blue-700">Please ensure you're in a quiet, private environment where you can focus on answering the questions. This assessment will help you better understand your symptom patterns.</p>
        </div>
        
        <h2>Symptom Assessment Questionnaire</h2>
        <p>Please answer the following questions based on your menstrual experience over the past 3 months:</p>
        
        <div class="space-y-6 mt-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">1. Pain Intensity</h3>
            <p class="text-gray-600 mb-3">Please rate the average intensity of your menstrual pain (1-10 scale, 10 being the worst):</p>
            <div class="grid grid-cols-5 gap-2">
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">1-2<br><span class="text-xs text-gray-500">Minimal</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">3-4<br><span class="text-xs text-gray-500">Mild</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">5-6<br><span class="text-xs text-gray-500">Moderate</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">7-8<br><span class="text-xs text-gray-500">Severe</span></button>
              <button class="p-3 border rounded hover:bg-primary-50 transition-colors">9-10<br><span class="text-xs text-gray-500">Extreme</span></button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">2. Pain Type</h3>
            <p class="text-gray-600 mb-3">Your pain is mainly characterized as:</p>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Cramping (spasm-like)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Bloating (abdominal fullness)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Sharp pain (stabbing)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Dull ache (continuous)
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3"> Radiating pain (to back/legs)
              </label>
            </div>
          </div>
          
          <div class="text-center">
            <button class="btn-primary px-8 py-3">
              Submit Assessment
            </button>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
          <p class="text-yellow-700">This assessment is for reference only and cannot replace professional medical diagnosis. If your symptoms are severe or worsening, please seek medical attention promptly.</p>
        </div>
      `,
      locale,
    },
    {
      slug: 'pain-tracker',
      frontmatter: {
        title: locale === 'zh' ? '疼痛追踪器' : 'Pain Tracker',
        description: locale === 'zh' 
          ? '记录疼痛模式，分析趋势变化，优化治疗效果。'
          : 'Track pain patterns, analyze trends, and optimize treatment effectiveness.',
        category: locale === 'zh' ? '追踪工具' : 'Tracking',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日2-3分钟' : '2-3 minutes daily',
      },
      content: locale === 'zh' ? `
        <h2>疼痛追踪工具</h2>
        <p>通过每日记录，帮助您识别疼痛模式，为医生提供准确的症状信息。</p>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-green-800 mb-2">使用建议</h3>
          <p class="text-green-700">建议每天在固定时间记录，持续至少3个月经周期，以获得更准确的模式分析。</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">今日记录</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">疼痛强度 (0-10)</label>
                <input type="range" min="0" max="10" class="w-full">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>无痛</span>
                  <span>极痛</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">月经状态</label>
                <select class="w-full p-2 border rounded">
                  <option>请选择</option>
                  <option>月经期</option>
                  <option>月经前期</option>
                  <option>月经后期</option>
                  <option>排卵期</option>
                  <option>其他时期</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">使用的缓解方法</label>
                <div class="space-y-1">
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 热敷
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 药物
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 运动
                  </label>
                  <label class="flex items-center text-sm">
                    <input type="checkbox" class="mr-2"> 休息
                  </label>
                </div>
              </div>
              
              <button class="w-full btn-primary">保存今日记录</button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">趋势分析</h3>
            <div class="space-y-4">
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">本月平均疼痛强度</h4>
                <div class="text-2xl font-bold text-primary-600">6.2/10</div>
                <p class="text-sm text-gray-600">比上月下降 0.8 分</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">疼痛天数</h4>
                <div class="text-2xl font-bold text-secondary-600">4天</div>
                <p class="text-sm text-gray-600">本周期疼痛持续时间</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">最有效缓解方法</h4>
                <div class="text-lg font-semibold text-accent-600">热敷 + 休息</div>
                <p class="text-sm text-gray-600">基于您的记录分析</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 bg-purple-50 border-l-4 border-purple-500 p-6">
          <h3 class="text-lg font-semibold text-purple-800 mb-2">数据导出</h3>
          <p class="text-purple-700 mb-4">您可以导出疼痛记录，在就医时提供给医生参考。</p>
          <button class="btn-outline">导出PDF报告</button>
        </div>
      ` : `
        <h2>Pain Tracking Tool</h2>
        <p>Track your daily pain to identify patterns and provide accurate symptom information to your healthcare provider.</p>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Usage Tips</h3>
          <p class="text-green-700">We recommend recording at the same time each day for at least 3 menstrual cycles to get more accurate pattern analysis.</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">Today's Record</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Pain Intensity (0-10)</label>
                <input type="range" min="0" max="10" class="w-full">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No Pain</span>
                  <span>Extreme</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Menstrual Status</label>
                <select class="w-full p-2 border rounded">
                  <option>Please select</option>
                  <option>Menstrual period</option>
                  <option>Pre-menstrual</option>
                  <option>Post-menstrual</option>
                  <option>Ovulation</option>
                  <option>Other</option>
                </select>
              </div>
              
              <button class="w-full btn-primary">Save Today's Record</button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <h3 class="font-semibold mb-4">Trend Analysis</h3>
            <div class="space-y-4">
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">Average Pain This Month</h4>
                <div class="text-2xl font-bold text-primary-600">6.2/10</div>
                <p class="text-sm text-gray-600">Decreased by 0.8 from last month</p>
              </div>
              
              <div class="bg-gray-100 p-4 rounded">
                <h4 class="font-medium mb-2">Pain Days</h4>
                <div class="text-2xl font-bold text-secondary-600">4 days</div>
                <p class="text-sm text-gray-600">Duration this cycle</p>
              </div>
            </div>
          </div>
        </div>
      `,
      locale,
    },
    {
      slug: 'constitution-test',
      frontmatter: {
        title: locale === 'zh' ? '中医体质测试' : 'TCM Constitution Test',
        description: locale === 'zh'
          ? '通过8个问题了解您的中医体质类型，获得个性化的穴位、饮食和生活方式建议。'
          : 'Discover your TCM constitution type through 8 questions and get personalized acupoint, diet, and lifestyle recommendations.',
        category: locale === 'zh' ? '体质评估' : 'Constitution Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '5-8分钟' : '5-8 minutes',
      },
      content: '', // Content will be handled by the ConstitutionTestTool component
      locale,
    },
    {
      slug: 'period-pain-assessment',
      frontmatter: {
        title: locale === 'zh' ? '痛经速测小工具' : 'Period Pain Assessment Tool',
        description: locale === 'zh'
          ? '回答几个简单问题，初步了解你的痛经类型和严重程度，获得个性化的健康建议。'
          : 'Answer a few simple questions to understand your period pain type and severity, and get personalized health recommendations.',
        category: locale === 'zh' ? '健康评估' : 'Health Assessment',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '3-5分钟' : '3-5 minutes',
      },
      content: '', // Content will be handled by the PeriodPainAssessmentTool component
      locale,
    },
    {
      slug: 'cycle-tracker',
      frontmatter: {
        title: locale === 'zh' ? '智能周期追踪器' : 'Smart Cycle Tracker',
        description: locale === 'zh'
          ? '智能追踪月经周期，预测下次月经时间，记录症状变化，帮助您更好地了解身体规律。'
          : 'Intelligently track your menstrual cycle, predict next period, record symptom changes, and help you better understand your body patterns.',
        category: locale === 'zh' ? '追踪工具' : 'Tracking Tool',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日1-2分钟' : '1-2 minutes daily',
      },
      content: '', // Content will be handled by the CycleTrackerTool component
      locale,
    },
    {
      slug: 'symptom-tracker',
      frontmatter: {
        title: locale === 'zh' ? '症状记录器' : 'Symptom Tracker',
        description: locale === 'zh'
          ? '详细记录经期症状，包括疼痛强度、情绪变化、身体反应等，为健康管理提供数据支持。'
          : 'Detailed recording of menstrual symptoms including pain intensity, mood changes, physical reactions, providing data support for health management.',
        category: locale === 'zh' ? '记录工具' : 'Recording Tool',
        difficulty: locale === 'zh' ? '简单' : 'Easy',
        estimatedTime: locale === 'zh' ? '每日3-5分钟' : '3-5 minutes daily',
      },
      content: '', // Content will be handled by the SymptomTrackerTool component
      locale,
    }
  ];

  const tool = sampleTools.find(t => t.slug === slug && t.locale === locale);
  return tool || null;
};

// Generate static params for all tools
export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh'];
  const toolSlugs = [
    'symptom-assessment',
    'pain-tracker',
    'constitution-test',
    'period-pain-assessment',
    'cycle-tracker',
    'symptom-tracker'
  ];

  const params = [];
  for (const locale of locales) {
    for (const tool of toolSlugs) {
      params.push({ locale, tool });
    }
  }

  return params;
}

// Generate metadata for the tool
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; tool: string }>
}): Promise<Metadata> {
  const { locale, tool } = await params;
  const toolData = await getToolBySlug(tool, locale);

  if (!toolData) {
    return {
      title: locale === 'zh' ? '工具未找到' : 'Tool Not Found',
      description: locale === 'zh' ? '抱歉，我们找不到您要查找的工具。' : 'Sorry, we could not find the tool you are looking for.',
    };
  }

  return {
    title: `${toolData.frontmatter.title} | periodhub.health`,
    description: toolData.frontmatter.description,
    openGraph: {
      title: toolData.frontmatter.title,
      description: toolData.frontmatter.description,
      type: 'website',
    },
  };
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ locale: Locale; tool: string }>
}) {
  const { locale, tool } = await params;
  unstable_setRequestLocale(locale);

  const toolData = await getToolBySlug(tool, locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const tTool = await getTranslations({ locale, namespace: 'toolPage' });

  if (!toolData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back to Tools */}
      <div className="container-custom">
        <Link 
          href={`/${locale}/interactive-tools`} 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {tTool('backToTools')}
        </Link>
      </div>

      {/* Tool Header */}
      <header className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600 mb-4">
            <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full">
              {toolData.frontmatter.category}
            </span>
            <span>• {toolData.frontmatter.difficulty}</span>
            <span>• {toolData.frontmatter.estimatedTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            {toolData.frontmatter.title}
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {toolData.frontmatter.description}
          </p>
        </div>
      </header>

      {/* Tool Content */}
      <main className="container-custom">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          }>
            {/* Render interactive tool if available */}
            {tool === 'pain-tracker' ? (
              <PainTrackerTool locale={locale} />
            ) : tool === 'symptom-assessment' ? (
              <SymptomAssessmentTool locale={locale} />
            ) : tool === 'constitution-test' ? (
              <ConstitutionTestTool locale={locale} />
            ) : tool === 'period-pain-assessment' ? (
              <PeriodPainAssessmentTool locale={locale} />
            ) : tool === 'cycle-tracker' ? (
              <CycleTrackerTool locale={locale} />
            ) : tool === 'symptom-tracker' ? (
              <SymptomTrackerTool locale={locale} />
            ) : (
              <div
                className="prose prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700"
                dangerouslySetInnerHTML={{ __html: toolData.content }}
              />
            )}
          </Suspense>
        </div>
      </main>

      {/* Medical Disclaimer */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-lg">
            <p className="font-bold mb-2">
              {tTool('medicalDisclaimer')}
            </p>
            <p className="text-sm">
              {tTool('medicalDisclaimerText')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
