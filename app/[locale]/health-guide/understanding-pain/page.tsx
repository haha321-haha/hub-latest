import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/i18n';

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? '理解痛经 - 痛经健康指南' : 'Understanding Menstrual Pain - Health Guide';
  const description = locale === 'zh' 
    ? '深入了解痛经的原因、类型和生理机制，掌握科学的痛经知识基础。'
    : 'Deep dive into the causes, types, and physiological mechanisms of menstrual pain, master the scientific foundation of menstrual pain knowledge.';
  
  return {
    title,
    description,
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function UnderstandingPainPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const commonT = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {locale === 'zh' ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">›</span>
            <Link href={`/${locale}/health-guide`} className="hover:text-primary-600">
              {locale === 'zh' ? '痛经健康指南' : 'Health Guide'}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">
              {locale === 'zh' ? '理解痛经' : 'Understanding Pain'}
            </span>
          </nav>

      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          {locale === 'zh' ? '理解痛经' : 'Understanding Menstrual Pain'}
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          {locale === 'zh'
            ? '深入了解痛经的原因、类型和生理机制，为有效管理奠定科学基础。'
            : 'Deep dive into the causes, types, and physiological mechanisms of menstrual pain to lay a scientific foundation for effective management.'
          }
        </p>
      </header>

      {/* What is Menstrual Pain */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '什么是痛经？' : 'What is Menstrual Pain?'}
        </h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          {locale === 'zh'
            ? '痛经（Dysmenorrhea）是指在月经期间或月经前后出现的下腹部疼痛、痉挛或不适感。这是女性最常见的妇科症状之一，影响着全球约80%的育龄女性。'
            : 'Dysmenorrhea refers to lower abdominal pain, cramping, or discomfort that occurs during or around menstruation. It is one of the most common gynecological symptoms, affecting approximately 80% of women of reproductive age worldwide.'
          }
        </p>
        <p className="text-neutral-700 leading-relaxed">
          {locale === 'zh'
            ? '痛经的严重程度因人而异，从轻微的不适到严重影响日常生活的剧烈疼痛都有可能。了解痛经的本质是制定有效管理策略的第一步。'
            : 'The severity of menstrual pain varies from person to person, ranging from mild discomfort to severe pain that significantly impacts daily life. Understanding the nature of menstrual pain is the first step in developing effective management strategies.'
          }
        </p>
      </section>

      {/* Types of Menstrual Pain */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '痛经的类型' : 'Types of Menstrual Pain'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-primary-600 mb-3">
              {locale === 'zh' ? '原发性痛经' : 'Primary Dysmenorrhea'}
            </h3>
            <p className="text-neutral-600 mb-4">
              {locale === 'zh'
                ? '原发性痛经是最常见的类型，通常在青春期开始后不久出现。这种疼痛是由子宫收缩引起的，没有潜在的病理原因。'
                : 'Primary dysmenorrhea is the most common type, usually appearing shortly after the onset of puberty. This pain is caused by uterine contractions and has no underlying pathological cause.'
              }
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-1">
              <li>{locale === 'zh' ? '通常在月经开始前1-2天出现' : 'Usually appears 1-2 days before menstruation begins'}</li>
              <li>{locale === 'zh' ? '疼痛集中在下腹部和腰部' : 'Pain concentrated in lower abdomen and lower back'}</li>
              <li>{locale === 'zh' ? '可能伴有恶心、呕吐、腹泻' : 'May be accompanied by nausea, vomiting, diarrhea'}</li>
              <li>{locale === 'zh' ? '疼痛持续1-3天' : 'Pain lasts 1-3 days'}</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-600 mb-3">
              {locale === 'zh' ? '继发性痛经' : 'Secondary Dysmenorrhea'}
            </h3>
            <p className="text-neutral-600 mb-4">
              {locale === 'zh'
                ? '继发性痛经是由潜在的妇科疾病引起的，通常在成年后出现或原有痛经突然加重。需要医疗评估和治疗。'
                : 'Secondary dysmenorrhea is caused by underlying gynecological conditions, usually appearing in adulthood or when existing pain suddenly worsens. Requires medical evaluation and treatment.'
              }
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-1">
              <li>{locale === 'zh' ? '可能由子宫内膜异位症引起' : 'May be caused by endometriosis'}</li>
              <li>{locale === 'zh' ? '子宫肌瘤或腺肌症' : 'Uterine fibroids or adenomyosis'}</li>
              <li>{locale === 'zh' ? '盆腔炎性疾病' : 'Pelvic inflammatory disease'}</li>
              <li>{locale === 'zh' ? '需要专业医疗诊断' : 'Requires professional medical diagnosis'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Physiological Mechanisms */}
      <section className="bg-secondary-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '生理机制' : 'Physiological Mechanisms'}
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '前列腺素的作用' : 'Role of Prostaglandins'}
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              {locale === 'zh'
                ? '前列腺素是引起痛经的主要生化因子。在月经期间，子宫内膜释放大量前列腺素，特别是PGF2α和PGE2，这些物质会导致子宫肌肉强烈收缩，压迫血管，减少血流，从而产生疼痛。'
                : 'Prostaglandins are the primary biochemical factors causing menstrual pain. During menstruation, the endometrium releases large amounts of prostaglandins, particularly PGF2α and PGE2, which cause strong uterine muscle contractions, compress blood vessels, reduce blood flow, and thus generate pain.'
              }
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              {locale === 'zh' ? '疼痛传导路径' : 'Pain Transmission Pathways'}
            </h3>
            <p className="text-neutral-700 leading-relaxed">
              {locale === 'zh'
                ? '痛经的疼痛信号通过交感神经系统传导到脊髓，然后传递到大脑。这个过程涉及多个神经递质和受体，包括内啡肽、血清素等，这也解释了为什么某些治疗方法（如运动、冥想）能够有效缓解疼痛。'
                : 'Menstrual pain signals are transmitted through the sympathetic nervous system to the spinal cord and then to the brain. This process involves multiple neurotransmitters and receptors, including endorphins and serotonin, which explains why certain treatments (such as exercise and meditation) can effectively relieve pain.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Traditional Chinese Medicine Perspective */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '中医证型分析' : 'Traditional Chinese Medicine Analysis'}
        </h2>

        <p className="text-neutral-700 leading-relaxed mb-6">
          {locale === 'zh'
            ? '根据症状特点，中医将痛经细分为几种主要证型，每种证型都有其独特的病理机制和治疗方法：'
            : 'Based on symptom characteristics, Traditional Chinese Medicine categorizes menstrual pain into several main syndrome types, each with unique pathological mechanisms and treatment approaches:'
          }
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
              🌪️ {locale === 'zh' ? '气滞血瘀型' : 'Qi Stagnation and Blood Stasis'}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{locale === 'zh' ? '主要症状：' : 'Main Symptoms:'}</strong> {locale === 'zh' ? '胀痛、刺痛，经血色暗有块' : 'Distending pain, stabbing pain, dark menstrual blood with clots'}</p>
              <p><strong>{locale === 'zh' ? '疼痛特点：' : 'Pain Characteristics:'}</strong> {locale === 'zh' ? '固定不移，拒按' : 'Fixed location, worse with pressure'}</p>
              <p><strong>{locale === 'zh' ? '治疗原则：' : 'Treatment Principle:'}</strong> {locale === 'zh' ? '疏肝理气、活血化瘀' : 'Soothe liver qi, activate blood circulation'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              ❄️ {locale === 'zh' ? '寒凝血瘀型' : 'Cold Coagulation and Blood Stasis'}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{locale === 'zh' ? '主要症状：' : 'Main Symptoms:'}</strong> {locale === 'zh' ? '冷痛、绞痛，得热则舒' : 'Cold pain, cramping pain, relieved by warmth'}</p>
              <p><strong>{locale === 'zh' ? '疼痛特点：' : 'Pain Characteristics:'}</strong> {locale === 'zh' ? '遇寒加剧' : 'Worsened by cold'}</p>
              <p><strong>{locale === 'zh' ? '治疗原则：' : 'Treatment Principle:'}</strong> {locale === 'zh' ? '温经散寒、活血通络' : 'Warm meridians, dispel cold, activate blood'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              💧 {locale === 'zh' ? '气血虚弱型' : 'Qi and Blood Deficiency'}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{locale === 'zh' ? '主要症状：' : 'Main Symptoms:'}</strong> {locale === 'zh' ? '隐痛、坠痛，喜按' : 'Dull pain, bearing-down pain, likes pressure'}</p>
              <p><strong>{locale === 'zh' ? '疼痛特点：' : 'Pain Characteristics:'}</strong> {locale === 'zh' ? '绵绵不休' : 'Continuous and lingering'}</p>
              <p><strong>{locale === 'zh' ? '治疗原则：' : 'Treatment Principle:'}</strong> {locale === 'zh' ? '益气补血、养血止痛' : 'Tonify qi and blood, nourish blood to stop pain'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
              🌙 {locale === 'zh' ? '肝肾亏虚型' : 'Liver and Kidney Deficiency'}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{locale === 'zh' ? '主要症状：' : 'Main Symptoms:'}</strong> {locale === 'zh' ? '隐痛，腰膝酸软' : 'Dull pain, soreness in lower back and knees'}</p>
              <p><strong>{locale === 'zh' ? '疼痛特点：' : 'Pain Characteristics:'}</strong> {locale === 'zh' ? '伴空坠感' : 'With empty falling sensation'}</p>
              <p><strong>{locale === 'zh' ? '治疗原则：' : 'Treatment Principle:'}</strong> {locale === 'zh' ? '滋补肝肾、调补冲任' : 'Nourish liver and kidney, regulate Chong and Ren meridians'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-100 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2">
            {locale === 'zh' ? '中西医结合的优势' : 'Advantages of Integrative Medicine'}
          </h4>
          <p className="text-amber-700 text-sm leading-relaxed">
            {locale === 'zh'
              ? '现代医学的前列腺素理论与中医的气血理论可以相互补充。西医的快速止痛结合中医的整体调理，能够实现标本兼治，既缓解急性疼痛，又改善体质，减少痛经复发。'
              : 'Modern medicine\'s prostaglandin theory and TCM\'s qi-blood theory complement each other. Western medicine\'s rapid pain relief combined with TCM\'s holistic regulation can achieve both symptomatic and root treatment, relieving acute pain while improving constitution and reducing recurrence.'
            }
          </p>
        </div>
      </section>

      {/* Medical Treatment and Professional Intervention */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '医学治疗与专业干预' : 'Medical Treatment and Professional Intervention'}
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              {locale === 'zh' ? '药物治疗选择' : 'Medication Options'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {locale === 'zh' ? 'NSAIDs（非甾体抗炎药）' : 'NSAIDs (Non-Steroidal Anti-Inflammatory Drugs)'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '布洛芬、萘普生等' : 'Ibuprofen, Naproxen, etc.'}</li>
                  <li>• {locale === 'zh' ? '抑制前列腺素合成' : 'Inhibit prostaglandin synthesis'}</li>
                  <li>• {locale === 'zh' ? '快速缓解疼痛和炎症' : 'Rapid pain and inflammation relief'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {locale === 'zh' ? '激素疗法' : 'Hormonal Therapy'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '口服避孕药' : 'Oral contraceptives'}</li>
                  <li>• {locale === 'zh' ? '调节激素水平' : 'Regulate hormone levels'}</li>
                  <li>• {locale === 'zh' ? '减少子宫内膜厚度' : 'Reduce endometrial thickness'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              {locale === 'zh' ? '何时寻求医疗帮助' : 'When to Seek Medical Help'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  {locale === 'zh' ? '紧急就医指征' : 'Emergency Medical Signs'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '突发剧烈腹痛伴恶心呕吐' : 'Sudden severe abdominal pain with nausea/vomiting'}</li>
                  <li>• {locale === 'zh' ? '疼痛伴发热（>38.5°C）' : 'Pain with fever (>38.5°C)'}</li>
                  <li>• {locale === 'zh' ? '大量阴道出血' : 'Heavy vaginal bleeding'}</li>
                  <li>• {locale === 'zh' ? '疼痛伴晕厥或休克症状' : 'Pain with fainting or shock symptoms'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">
                  {locale === 'zh' ? '择期就医指征' : 'Elective Medical Consultation'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '痛经新近出现或性质改变' : 'New onset or changed pattern of pain'}</li>
                  <li>• {locale === 'zh' ? '疼痛进行性加重' : 'Progressive worsening of pain'}</li>
                  <li>• {locale === 'zh' ? '常规止痛药无效' : 'Regular painkillers ineffective'}</li>
                  <li>• {locale === 'zh' ? '严重影响日常生活和工作' : 'Severely affecting daily life and work'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              {locale === 'zh' ? '专业检查项目' : 'Professional Examination Items'}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {locale === 'zh' ? '基础检查' : 'Basic Examinations'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '详细病史询问' : 'Detailed medical history'}</li>
                  <li>• {locale === 'zh' ? '妇科体检' : 'Gynecological examination'}</li>
                  <li>• {locale === 'zh' ? '盆腔超声检查' : 'Pelvic ultrasound'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {locale === 'zh' ? '进一步检查' : 'Further Examinations'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '血常规、炎症指标' : 'Blood tests, inflammation markers'}</li>
                  <li>• {locale === 'zh' ? '肿瘤标志物检测' : 'Tumor marker testing'}</li>
                  <li>• {locale === 'zh' ? 'MRI盆腔检查' : 'Pelvic MRI examination'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {locale === 'zh' ? '特殊检查' : 'Special Examinations'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '宫腔镜检查' : 'Hysteroscopy'}</li>
                  <li>• {locale === 'zh' ? '腹腔镜检查' : 'Laparoscopy'}</li>
                  <li>• {locale === 'zh' ? '组织病理检查' : 'Histopathological examination'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Factors */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '风险因素' : 'Risk Factors'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '生理因素' : 'Physiological Factors'}
            </h3>
            <ul className="list-disc list-inside text-neutral-600 space-y-1 text-sm">
              <li>{locale === 'zh' ? '年龄小于30岁' : 'Age under 30'}</li>
              <li>{locale === 'zh' ? '月经初潮年龄较早' : 'Early menarche'}</li>
              <li>{locale === 'zh' ? '月经周期较短' : 'Shorter menstrual cycles'}</li>
              <li>{locale === 'zh' ? '月经量较多' : 'Heavy menstrual flow'}</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '生活方式因素' : 'Lifestyle Factors'}
            </h3>
            <ul className="list-disc list-inside text-neutral-600 space-y-1 text-sm">
              <li>{locale === 'zh' ? '缺乏运动' : 'Lack of exercise'}</li>
              <li>{locale === 'zh' ? '高压力水平' : 'High stress levels'}</li>
              <li>{locale === 'zh' ? '不良饮食习惯' : 'Poor dietary habits'}</li>
              <li>{locale === 'zh' ? '吸烟' : 'Smoking'}</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold text-neutral-800 mb-3">
              {locale === 'zh' ? '遗传因素' : 'Genetic Factors'}
            </h3>
            <ul className="list-disc list-inside text-neutral-600 space-y-1 text-sm">
              <li>{locale === 'zh' ? '家族痛经史' : 'Family history of dysmenorrhea'}</li>
              <li>{locale === 'zh' ? '遗传易感性' : 'Genetic susceptibility'}</li>
              <li>{locale === 'zh' ? '激素敏感性' : 'Hormone sensitivity'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison and Analysis */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
          {locale === 'zh' ? '痛经对比与鉴别分析' : 'Menstrual Pain Comparison and Differential Analysis'}
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              {locale === 'zh' ? '痛经 vs 其他腹部疼痛' : 'Menstrual Pain vs Other Abdominal Pain'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="p-3 text-left">{locale === 'zh' ? '疼痛类型' : 'Pain Type'}</th>
                    <th className="p-3 text-left">{locale === 'zh' ? '疼痛特点' : 'Pain Characteristics'}</th>
                    <th className="p-3 text-left">{locale === 'zh' ? '发生时间' : 'Timing'}</th>
                    <th className="p-3 text-left">{locale === 'zh' ? '伴随症状' : 'Associated Symptoms'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr>
                    <td className="p-3 font-semibold text-purple-700">{locale === 'zh' ? '痛经' : 'Menstrual Pain'}</td>
                    <td className="p-3">{locale === 'zh' ? '周期性痉挛痛，下腹部为主' : 'Cyclical cramping pain, mainly lower abdomen'}</td>
                    <td className="p-3">{locale === 'zh' ? '月经前或月经期' : 'Before or during menstruation'}</td>
                    <td className="p-3">{locale === 'zh' ? '恶心、头痛、乏力' : 'Nausea, headache, fatigue'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-orange-700">{locale === 'zh' ? '妊娠痉挛' : 'Pregnancy Cramps'}</td>
                    <td className="p-3">{locale === 'zh' ? '轻微痉挛，通常较温和' : 'Mild cramping, usually gentle'}</td>
                    <td className="p-3">{locale === 'zh' ? '妊娠早期' : 'Early pregnancy'}</td>
                    <td className="p-3">{locale === 'zh' ? '恶心、乳房胀痛、疲劳' : 'Nausea, breast tenderness, fatigue'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-red-700">{locale === 'zh' ? '分娩宫缩' : 'Labor Contractions'}</td>
                    <td className="p-3">{locale === 'zh' ? '强烈、规律性痉挛' : 'Intense, regular cramping'}</td>
                    <td className="p-3">{locale === 'zh' ? '妊娠晚期' : 'Late pregnancy'}</td>
                    <td className="p-3">{locale === 'zh' ? '背痛、压迫感、见红' : 'Back pain, pressure, bloody show'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-pink-200">
            <h3 className="text-lg font-semibold text-pink-800 mb-4">
              {locale === 'zh' ? '不同痛经疗法对比' : 'Comparison of Different Menstrual Pain Therapies'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-neutral-800 mb-3">
                  {locale === 'zh' ? '药物疗法' : 'Pharmaceutical Therapy'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '起效速度：' : 'Onset Speed:'}</span>
                    <span className="text-green-600">{locale === 'zh' ? '快速（30-60分钟）' : 'Fast (30-60 min)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '效果强度：' : 'Effect Intensity:'}</span>
                    <span className="text-green-600">{locale === 'zh' ? '强' : 'Strong'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '副作用：' : 'Side Effects:'}</span>
                    <span className="text-orange-600">{locale === 'zh' ? '可能有胃肠道反应' : 'Possible GI reactions'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '适用性：' : 'Applicability:'}</span>
                    <span className="text-blue-600">{locale === 'zh' ? '中重度痛经' : 'Moderate to severe pain'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-800 mb-3">
                  {locale === 'zh' ? '非药物疗法' : 'Non-Pharmaceutical Therapy'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '起效速度：' : 'Onset Speed:'}</span>
                    <span className="text-orange-600">{locale === 'zh' ? '较慢（需持续练习）' : 'Slower (requires practice)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '效果强度：' : 'Effect Intensity:'}</span>
                    <span className="text-blue-600">{locale === 'zh' ? '中等到强' : 'Moderate to strong'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '副作用：' : 'Side Effects:'}</span>
                    <span className="text-green-600">{locale === 'zh' ? '几乎无' : 'Almost none'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'zh' ? '适用性：' : 'Applicability:'}</span>
                    <span className="text-green-600">{locale === 'zh' ? '所有程度痛经' : 'All levels of pain'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              {locale === 'zh' ? '东西方痛经缓解智慧对比' : 'East vs West: Menstrual Pain Relief Wisdom'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-orange-700 mb-2">
                  {locale === 'zh' ? '东方传统医学' : 'Eastern Traditional Medicine'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '整体调理，标本兼治' : 'Holistic regulation, treating both symptoms and root causes'}</li>
                  <li>• {locale === 'zh' ? '个体化辨证论治' : 'Individualized syndrome differentiation'}</li>
                  <li>• {locale === 'zh' ? '针灸、中药、食疗' : 'Acupuncture, herbal medicine, dietary therapy'}</li>
                  <li>• {locale === 'zh' ? '预防为主，调养为重' : 'Prevention-focused, emphasizing conditioning'}</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-blue-700 mb-2">
                  {locale === 'zh' ? '西方现代医学' : 'Western Modern Medicine'}
                </h4>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li>• {locale === 'zh' ? '循证医学，精准治疗' : 'Evidence-based medicine, precision treatment'}</li>
                  <li>• {locale === 'zh' ? '快速止痛，效果明确' : 'Rapid pain relief, clear effects'}</li>
                  <li>• {locale === 'zh' ? '药物治疗、物理疗法' : 'Pharmaceutical and physical therapy'}</li>
                  <li>• {locale === 'zh' ? '标准化治疗方案' : 'Standardized treatment protocols'}</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg">
              <p className="text-sm text-neutral-700 text-center">
                {locale === 'zh'
                  ? '💡 最佳实践：结合东西方智慧，西医快速缓解急性疼痛，中医长期调理改善体质，实现个性化的综合治疗方案。'
                  : '💡 Best Practice: Combine Eastern and Western wisdom - Western medicine for rapid acute pain relief, Traditional Chinese Medicine for long-term conditioning to improve constitution, achieving personalized comprehensive treatment plans.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-semibold text-red-800 mb-2">
          {locale === 'zh' ? '何时寻求医疗帮助' : 'When to Seek Medical Help'}
        </h3>
        <p className="text-red-700 mb-2">
          {locale === 'zh'
            ? '如果您出现以下情况，请及时咨询医疗专业人士：'
            : 'Please consult a healthcare professional promptly if you experience:'
          }
        </p>
        <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
          <li>{locale === 'zh' ? '疼痛严重影响日常生活和工作' : 'Pain severely affects daily life and work'}</li>
          <li>{locale === 'zh' ? '疼痛模式突然改变或加重' : 'Pain pattern suddenly changes or worsens'}</li>
          <li>{locale === 'zh' ? '伴有异常出血或分泌物' : 'Accompanied by abnormal bleeding or discharge'}</li>
          <li>{locale === 'zh' ? '非处方药物无法缓解疼痛' : 'Over-the-counter medications cannot relieve pain'}</li>
        </ul>
      </section>

      {/* Navigation */}
      <section className="flex justify-between items-center pt-8 border-t border-neutral-200">
        <Link 
          href={`/${locale}/health-guide`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {locale === 'zh' ? '返回指南首页' : 'Back to Guide Home'}
        </Link>
        
          <Link
            href={`/${locale}/health-guide/relief-methods`}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            {locale === 'zh' ? '下一章：A-Z缓解方法' : 'Next: A-Z Relief Methods'}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
        </div>
      </div>
    </div>
  );
}
