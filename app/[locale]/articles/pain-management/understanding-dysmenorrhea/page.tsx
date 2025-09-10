import { setRequestLocale  } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, BookOpen, AlertCircle, CheckCircle, Info } from 'lucide-react';

type Locale = 'en' | 'zh';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'zh' ? '深度解析：痛经的生理机制与类型 - 痛经管理专题' : 'In-depth Analysis: Physiological Mechanisms and Types of Dysmenorrhea - Dysmenorrhea Management Topics',
    description: locale === 'zh' 
      ? '从医学角度深入解析痛经的生理机制，了解原发性和继发性痛经的区别，为科学缓解疼痛提供理论基础。'
      : 'In-depth analysis of the physiological mechanisms of dysmenorrhea from a medical perspective, understanding the difference between primary and secondary dysmenorrhea, providing theoretical basis for scientific pain relief.',
  };
}

export default async function UnderstandingDysmenorrheaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" data-page="understanding-dysmenorrhea">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-neutral-600">
        <Link href={`/${locale}/articles`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '文章中心' : 'Articles'}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/articles`} className="hover:text-primary-600 transition-colors">
          {locale === 'zh' ? '文章中心' : 'Articles'}
        </Link>
        <span>/</span>
        <span className="text-neutral-800">
          {locale === 'zh' ? '痛经机制解析' : 'Dysmenorrhea Mechanisms'}
        </span>
      </nav>

      {/* Article Header */}
      <header className="py-8 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full mr-4">
            {locale === 'zh' ? '基础知识' : 'Fundamentals'}
          </span>
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="w-4 h-4 mr-1" />
            {locale === 'zh' ? '8分钟阅读' : '8 min read'}
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          {locale === 'zh' ? '深度解析：痛经的生理机制与类型' : 'In-depth Analysis: Physiological Mechanisms and Types of Dysmenorrhea'}
        </h1>
        
        <p className="text-lg text-neutral-600 leading-relaxed">
          {locale === 'zh' 
            ? '从医学角度深入解析痛经的生理机制，帮助您科学理解疼痛产生的原因，为选择合适的缓解方法提供理论基础。'
            : 'In-depth analysis of the physiological mechanisms of dysmenorrhea from a medical perspective, helping you scientifically understand the causes of pain and providing a theoretical basis for choosing appropriate relief methods.'
          }
        </p>

        <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
          <User className="w-5 h-5 text-neutral-400 mr-2" />
          <span className="text-sm text-neutral-600">
            {locale === 'zh' ? '医学编辑团队' : 'Medical Editorial Team'}
          </span>
          <span className="mx-2 text-neutral-300">•</span>
          <span className="text-sm text-neutral-600">
            {locale === 'zh' ? '2024年8月更新' : 'Updated August 2024'}
          </span>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        {/* Introduction */}
        <section className="mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {locale === 'zh' ? '关键要点' : 'Key Points'}
                </h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• {locale === 'zh' ? '痛经影响全球50-90%的育龄女性' : 'Dysmenorrhea affects 50-90% of women of reproductive age globally'}</li>
                  <li>• {locale === 'zh' ? '分为原发性和继发性两大类型' : 'Divided into primary and secondary types'}</li>
                  <li>• {locale === 'zh' ? '前列腺素是主要的疼痛介质' : 'Prostaglandins are the main pain mediators'}</li>
                  <li>• {locale === 'zh' ? '理解机制有助于选择正确的治疗方法' : 'Understanding mechanisms helps choose correct treatment methods'}</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-neutral-700 leading-relaxed mb-4">
            {locale === 'zh' 
              ? '痛经（Dysmenorrhea）是最常见的妇科症状之一，几乎每位女性在生命中的某个阶段都会经历。然而，许多人对痛经的生理机制缺乏深入了解，这往往导致治疗方法的选择不当或延误。本文将从医学角度详细解析痛经的发生机制、分类标准以及不同类型的特征，为您提供科学的理论基础。'
              : 'Dysmenorrhea is one of the most common gynecological symptoms, with almost every woman experiencing it at some stage of life. However, many people lack in-depth understanding of the physiological mechanisms of dysmenorrhea, which often leads to inappropriate treatment choices or delays. This article will provide a detailed analysis of the mechanisms, classification standards, and characteristics of different types of dysmenorrhea from a medical perspective, providing you with a scientific theoretical foundation.'
            }
          </p>
        </section>

        {/* Primary vs Secondary Dysmenorrhea */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {locale === 'zh' ? '痛经的分类：原发性与继发性' : 'Classification of Dysmenorrhea: Primary vs Secondary'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-900">
                  {locale === 'zh' ? '原发性痛经' : 'Primary Dysmenorrhea'}
                </h3>
              </div>
              <ul className="text-green-800 space-y-2 text-sm">
                <li>• {locale === 'zh' ? '占痛经病例的90-95%' : 'Accounts for 90-95% of dysmenorrhea cases'}</li>
                <li>• {locale === 'zh' ? '通常在初潮后1-2年开始' : 'Usually begins 1-2 years after menarche'}</li>
                <li>• {locale === 'zh' ? '无器质性病变' : 'No organic pathology'}</li>
                <li>• {locale === 'zh' ? '疼痛持续24-72小时' : 'Pain lasts 24-72 hours'}</li>
                <li>• {locale === 'zh' ? '随年龄增长可能减轻' : 'May decrease with age'}</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-orange-900">
                  {locale === 'zh' ? '继发性痛经' : 'Secondary Dysmenorrhea'}
                </h3>
              </div>
              <ul className="text-orange-800 space-y-2 text-sm">
                <li>• {locale === 'zh' ? '由器质性疾病引起' : 'Caused by organic diseases'}</li>
                <li>• {locale === 'zh' ? '常见于25岁以后' : 'Common after age 25'}</li>
                <li>• {locale === 'zh' ? '疼痛可能逐渐加重' : 'Pain may gradually worsen'}</li>
                <li>• {locale === 'zh' ? '需要针对病因治疗' : 'Requires treatment targeting the cause'}</li>
                <li>• {locale === 'zh' ? '可能伴随其他症状' : 'May be accompanied by other symptoms'}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Physiological Mechanisms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {locale === 'zh' ? '原发性痛经的生理机制' : 'Physiological Mechanisms of Primary Dysmenorrhea'}
          </h2>

          <div className="bg-neutral-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              {locale === 'zh' ? '前列腺素的作用机制' : 'Prostaglandin Action Mechanism'}
            </h3>
            <div className="space-y-4 text-neutral-700">
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">1</span>
                <p>
                  {locale === 'zh' 
                    ? '月经期间，子宫内膜细胞释放大量前列腺素F2α（PGF2α）和前列腺素E2（PGE2）。'
                    : 'During menstruation, endometrial cells release large amounts of prostaglandin F2α (PGF2α) and prostaglandin E2 (PGE2).'
                  }
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">2</span>
                <p>
                  {locale === 'zh' 
                    ? 'PGF2α导致子宫肌肉强烈收缩，压迫血管，造成子宫缺血缺氧。'
                    : 'PGF2α causes strong uterine muscle contractions, compressing blood vessels and causing uterine ischemia and hypoxia.'
                  }
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">3</span>
                <p>
                  {locale === 'zh' 
                    ? '缺血缺氧激活疼痛感受器，产生痉挛性疼痛。'
                    : 'Ischemia and hypoxia activate pain receptors, producing spasmodic pain.'
                  }
                </p>
              </div>
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">4</span>
                <p>
                  {locale === 'zh' 
                    ? '前列腺素还会增加疼痛感受器的敏感性，放大疼痛信号。'
                    : 'Prostaglandins also increase the sensitivity of pain receptors, amplifying pain signals.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-900 mb-2">
              {locale === 'zh' ? '为什么有些女性痛经更严重？' : 'Why do some women experience more severe dysmenorrhea?'}
            </h4>
            <p className="text-yellow-800 text-sm">
              {locale === 'zh' 
                ? '研究表明，痛经严重的女性月经血中前列腺素浓度比无痛经女性高2-7倍。此外，个体对前列腺素的敏感性、子宫收缩力、疼痛阈值等因素都会影响痛经的严重程度。'
                : 'Studies show that women with severe dysmenorrhea have 2-7 times higher prostaglandin concentrations in menstrual blood than women without dysmenorrhea. Additionally, individual sensitivity to prostaglandins, uterine contractility, and pain threshold all affect the severity of dysmenorrhea.'
              }
            </p>
          </div>
        </section>

        {/* Secondary Dysmenorrhea Causes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {locale === 'zh' ? '继发性痛经的常见病因' : 'Common Causes of Secondary Dysmenorrhea'}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                condition: locale === 'zh' ? '子宫内膜异位症' : 'Endometriosis',
                description: locale === 'zh' ? '子宫内膜组织在子宫外生长' : 'Endometrial tissue grows outside the uterus',
                prevalence: '10-15%'
              },
              {
                condition: locale === 'zh' ? '子宫肌瘤' : 'Uterine Fibroids',
                description: locale === 'zh' ? '子宫肌肉层的良性肿瘤' : 'Benign tumors in the uterine muscle layer',
                prevalence: '20-40%'
              },
              {
                condition: locale === 'zh' ? '子宫腺肌症' : 'Adenomyosis',
                description: locale === 'zh' ? '子宫内膜侵入子宫肌层' : 'Endometrium invades the uterine muscle layer',
                prevalence: '5-70%'
              },
              {
                condition: locale === 'zh' ? '盆腔炎性疾病' : 'Pelvic Inflammatory Disease',
                description: locale === 'zh' ? '盆腔器官的感染性疾病' : 'Infectious disease of pelvic organs',
                prevalence: '10-15%'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-neutral-800 mb-2">{item.condition}</h4>
                <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {locale === 'zh' ? '患病率' : 'Prevalence'}: {item.prevalence}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Implications */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {locale === 'zh' ? '临床意义与治疗指导' : 'Clinical Significance and Treatment Guidance'}
          </h2>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              {locale === 'zh' ? '基于机制的治疗策略' : 'Mechanism-based Treatment Strategies'}
            </h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  <strong>{locale === 'zh' ? '抑制前列腺素合成：' : 'Inhibit prostaglandin synthesis: '}</strong>
                  {locale === 'zh' ? '非甾体抗炎药（NSAIDs）如布洛芬、萘普生等' : 'NSAIDs such as ibuprofen, naproxen, etc.'}
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  <strong>{locale === 'zh' ? '减少子宫收缩：' : 'Reduce uterine contractions: '}</strong>
                  {locale === 'zh' ? '热敷、按摩、钙离子通道阻滞剂等' : 'Heat therapy, massage, calcium channel blockers, etc.'}
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  <strong>{locale === 'zh' ? '调节激素水平：' : 'Regulate hormone levels: '}</strong>
                  {locale === 'zh' ? '口服避孕药、孕激素等' : 'Oral contraceptives, progestins, etc.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Seek Medical Help */}
        <section className="mb-8">
          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-3">
                  {locale === 'zh' ? '何时需要就医？' : 'When to Seek Medical Care?'}
                </h3>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• {locale === 'zh' ? '疼痛严重影响日常生活和工作' : 'Pain severely affects daily life and work'}</li>
                  <li>• {locale === 'zh' ? '疼痛程度逐渐加重' : 'Pain intensity gradually worsens'}</li>
                  <li>• {locale === 'zh' ? '伴随异常出血、发热等症状' : 'Accompanied by abnormal bleeding, fever, or other symptoms'}</li>
                  <li>• {locale === 'zh' ? '常规止痛药物无效' : 'Regular pain medications are ineffective'}</li>
                  <li>• {locale === 'zh' ? '25岁后首次出现严重痛经' : 'First occurrence of severe dysmenorrhea after age 25'}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            {locale === 'zh' ? '总结' : 'Conclusion'}
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            {locale === 'zh' 
              ? '理解痛经的生理机制是科学管理疼痛的第一步。通过区分原发性和继发性痛经，我们可以选择更有针对性的治疗方法。对于原发性痛经，重点在于抑制前列腺素的产生和作用；对于继发性痛经，则需要治疗潜在的疾病。记住，严重的痛经不是正常现象，及时就医可以获得更好的治疗效果。'
              : 'Understanding the physiological mechanisms of dysmenorrhea is the first step in scientific pain management. By distinguishing between primary and secondary dysmenorrhea, we can choose more targeted treatment methods. For primary dysmenorrhea, the focus is on inhibiting prostaglandin production and action; for secondary dysmenorrhea, underlying diseases need to be treated. Remember, severe dysmenorrhea is not normal, and timely medical consultation can achieve better treatment outcomes.'
            }
          </p>
        </section>
      </article>

      {/* Related Articles */}
      <section className="bg-neutral-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">
          {locale === 'zh' ? '相关文章推荐' : 'Related Articles'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/immediate-relief`}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-neutral-800 mb-2">
              {locale === 'zh' ? '即时缓解方案' : 'Immediate Relief Solutions'}
            </h4>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '基于前列腺素机制的快速缓解方法' : 'Quick relief methods based on prostaglandin mechanisms'}
            </p>
          </Link>
          
          <Link
            href={`/${locale}/natural-therapies`}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-neutral-800 mb-2">
              {locale === 'zh' ? '自然疗法指南' : 'Natural Therapy Guide'}
            </h4>
            <p className="text-sm text-neutral-600">
              {locale === 'zh' ? '天然方法调节前列腺素水平' : 'Natural methods to regulate prostaglandin levels'}
            </p>
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link 
          href={`/${locale}/articles`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '返回痛经管理专题' : 'Back to Dysmenorrhea Management Topics'}
        </Link>
        
        <div className="text-sm text-neutral-500">
          {locale === 'zh' ? '1 / 6 篇文章' : '1 of 6 articles'}
        </div>
      </div>
    </div>
  );
}