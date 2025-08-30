import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

// Types
type Locale = 'en' | 'zh';

// Generate metadata for the terms of service page
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const title = locale === 'zh' ? '服务条款' : 'Terms of Service';
  const description = locale === 'zh' 
    ? '了解使用periodhub.health的条款和条件，包括用户责任和服务限制。'
    : 'Learn about the terms and conditions for using periodhub.health, including user responsibilities and service limitations.';

  return {
    title: `${title} | periodhub.health`,
    description,
    openGraph: {
      title: `${title} | periodhub.health`,
      description,
      type: 'website',
      url: `https://periodhub.health/${locale}/terms-of-service`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsOfServicePage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  unstable_setRequestLocale(locale);

  const content = locale === 'zh' ? {
    title: '服务条款',
    lastUpdated: '最后更新：2024年4月1日',
    intro: '欢迎使用periodhub.health。通过访问和使用我们的网站，您同意遵守以下服务条款。请仔细阅读这些条款，如果您不同意任何条款，请不要使用我们的服务。',
    sections: [
      {
        title: '1. 服务描述',
        content: `
          <p>periodhub.health是一个提供月经健康信息和教育资源的平台。我们的服务包括：</p>
          <ul>
            <li><strong>教育内容：</strong>关于月经健康、疼痛管理和女性健康的文章和指南</li>
            <li><strong>交互工具：</strong>症状评估工具、疼痛追踪器和个性化建议系统</li>
            <li><strong>资源库：</strong>传统疗法、自然缓解方法和生活方式建议</li>
            <li><strong>社区支持：</strong>安全的信息分享和支持环境</li>
          </ul>
          
          <div class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p class="text-red-800"><strong>重要医疗声明：</strong>我们的服务仅供教育和信息目的，不构成医疗建议、诊断或治疗。我们不是医疗保健专业人员，本网站信息不能替代专业医疗建议。使用本网站不会在您与periodhub.health之间建立医患关系。如遇紧急情况，请立即寻求医疗救助。</p>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p class="text-blue-800"><strong>MVP阶段说明：</strong>periodhub.health目前处于最小可行产品(MVP)阶段，以有限资源运营。内容可能不如大型医疗机构那样全面或频繁更新。</p>
          </div>
        `
      },
      {
        title: '2. 医疗免责声明',
        content: `
          <h3>2.1 非医疗服务</h3>
          <p>periodhub.health不是医疗服务提供者。我们提供的所有信息：</p>
          <ul>
            <li>仅供一般教育和信息目的</li>
            <li>不能替代专业医疗建议、诊断或治疗</li>
            <li>不应用于医疗紧急情况</li>
            <li>可能不适用于您的具体情况</li>
          </ul>
          
          <h3>2.2 寻求专业医疗建议</h3>
          <p>您应该：</p>
          <ul>
            <li>在开始任何治疗前咨询合格的医疗专业人士</li>
            <li>对于严重或持续的症状立即寻求医疗帮助</li>
            <li>不要因为我们网站上的信息而忽视或延迟寻求医疗建议</li>
            <li>在停止或改变现有治疗前咨询您的医生</li>
          </ul>
          
          <h3>2.3 紧急情况</h3>
          <p>如果您遇到医疗紧急情况，请立即拨打当地紧急服务电话或前往最近的急诊科。</p>
        `
      },
      {
        title: '3. 用户责任',
        content: `
          <h3>3.1 适当使用</h3>
          <p>您同意：</p>
          <ul>
            <li>仅将我们的服务用于合法目的</li>
            <li>提供准确、完整的信息</li>
            <li>保护您的账户安全</li>
            <li>尊重其他用户的隐私和权利</li>
          </ul>
          
          <h3>3.2 禁止行为</h3>
          <p>您不得：</p>
          <ul>
            <li>发布虚假、误导或有害信息</li>
            <li>侵犯他人的知识产权</li>
            <li>传播恶意软件或进行网络攻击</li>
            <li>骚扰、威胁或伤害其他用户</li>
            <li>将我们的服务用于商业目的（未经授权）</li>
          </ul>
        `
      },
      {
        title: '4. 知识产权',
        content: `
          <p>periodhub.health的所有内容，包括但不限于：</p>
          <ul>
            <li>文本、图像、视频和音频内容</li>
            <li>网站设计和布局</li>
            <li>软件和代码</li>
            <li>商标和标识</li>
          </ul>
          <p>均受版权法和其他知识产权法保护。未经明确书面许可，您不得复制、分发、修改或创建衍生作品。</p>
        `
      }
    ]
  } : {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: April 1, 2024',
    intro: 'Welcome to periodhub.health. By accessing and using our website, you agree to comply with the following terms of service. Please read these terms carefully. If you do not agree to any terms, please do not use our services.',
    sections: [
      {
        title: '1. Service Description',
        content: `
          <p>periodhub.health is a platform providing menstrual health information and educational resources. Our services include:</p>
          <ul>
            <li><strong>Educational Content:</strong> Articles and guides about menstrual health, pain management, and women's health</li>
            <li><strong>Interactive Tools:</strong> Symptom assessment tools, pain trackers, and personalized recommendation systems</li>
            <li><strong>Resource Library:</strong> Traditional therapies, natural relief methods, and lifestyle recommendations</li>
            <li><strong>Community Support:</strong> Safe environment for information sharing and support</li>
          </ul>
          
          <div class="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p class="text-red-800"><strong>Important Medical Notice:</strong> Our services are for educational and informational purposes only and do not constitute medical advice, diagnosis, or treatment. We are not healthcare professionals, and the information on this website cannot replace professional medical advice. Use of this website does not establish a doctor-patient relationship. In case of emergency, seek immediate medical attention.</p>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p class="text-blue-800"><strong>MVP Phase Notice:</strong> periodhub.health is currently in its Minimum Viable Product (MVP) phase, operating with limited resources. Content may not be as comprehensive or frequently updated as larger medical institutions.</p>
          </div>
        `
      },
      {
        title: '2. Medical Disclaimer',
        content: `
          <h3>2.1 Non-Medical Service</h3>
          <p>periodhub.health is not a medical service provider. All information we provide:</p>
          <ul>
            <li>Is for general educational and informational purposes only</li>
            <li>Cannot replace professional medical advice, diagnosis, or treatment</li>
            <li>Should not be used for medical emergencies</li>
            <li>May not be applicable to your specific situation</li>
          </ul>
          
          <h3>2.2 Seek Professional Medical Advice</h3>
          <p>You should:</p>
          <ul>
            <li>Consult qualified medical professionals before starting any treatment</li>
            <li>Seek immediate medical help for serious or persistent symptoms</li>
            <li>Not ignore or delay seeking medical advice because of information on our website</li>
            <li>Consult your doctor before stopping or changing existing treatments</li>
          </ul>
          
          <h3>2.3 Emergency Situations</h3>
          <p>If you experience a medical emergency, immediately call your local emergency services or go to the nearest emergency room.</p>
        `
      },
      {
        title: '3. User Responsibilities',
        content: `
          <h3>3.1 Appropriate Use</h3>
          <p>You agree to:</p>
          <ul>
            <li>Use our services only for lawful purposes</li>
            <li>Provide accurate and complete information</li>
            <li>Protect your account security</li>
            <li>Respect other users' privacy and rights</li>
          </ul>
          
          <h3>3.2 Prohibited Conduct</h3>
          <p>You may not:</p>
          <ul>
            <li>Post false, misleading, or harmful information</li>
            <li>Infringe on others' intellectual property rights</li>
            <li>Distribute malware or conduct cyber attacks</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Use our services for commercial purposes (without authorization)</li>
          </ul>
        `
      },
      {
        title: '4. Intellectual Property',
        content: `
          <p>All content on periodhub.health, including but not limited to:</p>
          <ul>
            <li>Text, images, videos, and audio content</li>
            <li>Website design and layout</li>
            <li>Software and code</li>
            <li>Trademarks and logos</li>
          </ul>
          <p>Is protected by copyright and other intellectual property laws. You may not copy, distribute, modify, or create derivative works without explicit written permission.</p>
        `
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            {content.title}
          </h1>
          <p className="text-neutral-600 mb-6">
            {content.lastUpdated}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <p className="text-blue-800">
              {content.intro}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-12">
            {content.sections.map((section, index) => (
              <section key={index} className="border-b border-neutral-200 pb-8 last:border-b-0">
                <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
                  {section.title}
                </h2>
                <div 
                  className="prose prose-lg prose-neutral max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Important Notice */}
      <section className="bg-yellow-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                {locale === 'zh' ? '重要提醒' : 'Important Reminder'}
              </h3>
              <p className="text-yellow-700">
                {locale === 'zh' 
                  ? '这些服务条款可能会不时更新。继续使用我们的服务即表示您接受任何修改。'
                  : 'These Terms of Service may be updated from time to time. Continued use of our services indicates your acceptance of any modifications.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              {locale === 'zh' ? '有疑问？' : 'Questions?'}
            </h2>
            <p className="text-neutral-600 mb-6">
              {locale === 'zh' 
                ? '如果您对我们的服务条款有任何疑问，请随时联系我们。'
                : 'If you have any questions about our Terms of Service, please feel free to contact us.'
              }
            </p>
            <a
              href="mailto:tiyibaofu@outlook.com"
              className="btn-primary"
            >
              {locale === 'zh' ? '联系我们' : 'Contact Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
