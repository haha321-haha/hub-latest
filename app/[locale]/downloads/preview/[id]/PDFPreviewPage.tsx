'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2, FileText, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Locale } from '@/i18n';
import { getPDFResourceById } from '@/config/pdfResources';
import { getPreviewContentById } from '@/config/previewContent';

interface PDFPreviewPageProps {
  locale: Locale;
  resourceId: string;
}

// 新增PDF资源的基本信息映射（与page.tsx保持一致）
const NEW_PDF_INFO: Record<string, { title: { zh: string; en: string }; filename: string }> = {
  'emergency-pain-relief-card': {
    title: { zh: '紧急疼痛缓解卡片', en: 'Emergency Pain Relief Card' },
    filename: 'emergency-pain-relief-card.pdf'
  },
  '5-minute-relief-checklist': {
    title: { zh: '5分钟快速缓解检查清单', en: '5-Minute Quick Relief Checklist' },
    filename: '5-minute-relief-checklist.pdf'
  },
  'heat-therapy-guide-pdf': {
    title: { zh: '热疗完整指南PDF版', en: 'Complete Heat Therapy Guide PDF' },
    filename: 'heat-therapy-guide-pdf.pdf'
  },
  'workplace-relief-toolkit': {
    title: { zh: '职场疼痛缓解工具包', en: 'Workplace Pain Relief Toolkit' },
    filename: 'workplace-relief-toolkit.pdf'
  },
  'monthly-preparation-planner': {
    title: { zh: '月度准备计划表', en: 'Monthly Preparation Planner' },
    filename: 'monthly-preparation-planner.pdf'
  },
  'stress-management-workbook': {
    title: { zh: '压力管理工作册', en: 'Stress Management Workbook' },
    filename: 'stress-management-workbook.pdf'
  },
  'sleep-quality-improvement-guide': {
    title: { zh: '睡眠质量改善指南', en: 'Sleep Quality Improvement Guide' },
    filename: 'sleep-quality-improvement-guide.pdf'
  },
  'menstrual-cycle-education-guide': {
    title: { zh: '月经周期教育指南', en: 'Menstrual Cycle Education Guide' },
    filename: 'menstrual-cycle-education-guide.pdf'
  },
  'pain-research-summary-2024': {
    title: { zh: '2024痛经研究摘要', en: '2024 Pain Research Summary' },
    filename: 'pain-research-summary-2024.pdf'
  },
  'medical-consultation-preparation': {
    title: { zh: '就医咨询准备指南', en: 'Medical Consultation Preparation Guide' },
    filename: 'medical-consultation-preparation.pdf'
  },
  'global-health-perspectives': {
    title: { zh: '全球健康视角报告', en: 'Global Health Perspectives Report' },
    filename: 'global-health-perspectives.pdf'
  },
  'long-term-health-planner': {
    title: { zh: '长期健康规划师', en: 'Long-term Health Planner' },
    filename: 'long-term-health-planner.pdf'
  },
  'personal-health-journal': {
    title: { zh: '个人健康日记模板', en: 'Personal Health Journal Template' },
    filename: 'personal-health-journal.pdf'
  },
  'nutrition-meal-planning-kit': {
    title: { zh: '营养膳食规划工具包', en: 'Nutrition Meal Planning Kit' },
    filename: 'nutrition-meal-planning-kit.pdf'
  },
  'exercise-routine-builder': {
    title: { zh: '运动计划构建器', en: 'Exercise Routine Builder' },
    filename: 'exercise-routine-builder.pdf'
  },
  'lifestyle-assessment-toolkit': {
    title: { zh: '生活方式评估工具包', en: 'Lifestyle Assessment Toolkit' },
    filename: 'lifestyle-assessment-toolkit.pdf'
  },
  'sustainable-health-strategies': {
    title: { zh: '可持续健康策略指南', en: 'Sustainable Health Strategies Guide' },
    filename: 'sustainable-health-strategies.pdf'
  }
};

export default function PDFPreviewPage({ locale, resourceId }: PDFPreviewPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const resource = getPDFResourceById(resourceId);
  const previewContent = getPreviewContentById(resourceId);
  const newPdfInfo = NEW_PDF_INFO[resourceId];
  const t = useTranslations('downloadsPage.resources');

  // 获取资源标题
  const getResourceTitle = () => {
    if (resource) {
      return t(resource.titleKey);
    } else if (newPdfInfo) {
      return locale === 'zh' ? newPdfInfo.title.zh : newPdfInfo.title.en;
    }
    return resourceId;
  };

  // 获取文件名
  const getFileName = () => {
    if (resource) {
      return resource.filename;
    } else if (newPdfInfo) {
      return newPdfInfo.filename;
    }
    return `${resourceId}.pdf`;
  };

  useEffect(() => {
    console.log('=== PDFPreviewPage useEffect 开始 ===');
    console.log('resourceId:', resourceId);
    console.log('locale:', locale);
    console.log('resource:', resource);
    console.log('previewContent:', previewContent);
    console.log('newPdfInfo:', newPdfInfo);
    
    // 检查是否有预览内容配置
    if (previewContent) {
      console.log('✅ 使用预览内容配置');
      setLoading(false);
      return;
    }
    
    // 如果没有预览内容配置，检查是否有HTML文件
    if (!resource && !newPdfInfo) {
      console.log('❌ 资源未找到');
      setError('Resource not found');
      setLoading(false);
      return;
    }

    // 构建HTML文件路径
    const filename = getFileName();
    let htmlFilename = filename.replace('.pdf', '.html');
    console.log('初始 htmlFilename:', htmlFilename);
    
    if (locale === 'en' && !htmlFilename.includes('-en')) {
      htmlFilename = htmlFilename.replace('.html', '-en.html');
      console.log('英文版 htmlFilename:', htmlFilename);
    }
    
    console.log('最终 htmlFilename:', htmlFilename);
    const fetchUrl = `/pdf-files/${htmlFilename}`;
    console.log('fetch URL:', fetchUrl);

    // 加载HTML内容
    console.log('🚀 开始 fetch 请求...');
    fetch(fetchUrl)
      .then(response => {
        console.log('✅ fetch 响应收到');
        console.log('response.ok:', response.ok);
        console.log('response.status:', response.status);
        console.log('response.statusText:', response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText} - File not found: ${htmlFilename}`);
        }
        return response.text();
      })
      .then(html => {
        console.log('✅ HTML 内容加载成功');
        console.log('HTML 长度:', html.length);
        console.log('HTML 开头:', html.substring(0, 100));
        
        // setHtmlContent(html); // 不再需要，使用预览内容配置
        setLoading(false);
        console.log('✅ 状态更新完成，loading = false');
      })
      .catch(err => {
        console.error('❌ fetch 失败:', err);
        console.error('错误详情:', {
          message: err.message,
          stack: err.stack,
          fetchUrl: fetchUrl,
          htmlFilename: htmlFilename,
          resourceId: resourceId,
          locale: locale
        });
        setError(`Failed to load preview content: ${err.message}`);
        setLoading(false);
      });
  }, [resource, previewContent, newPdfInfo, locale]);

  const handleDownload = () => {
    if (!resource && !newPdfInfo && !previewContent) return;

    // 获取文件名并转换为HTML格式
    const filename = getFileName();
    let htmlFilename = filename.replace('.pdf', '.html');
    
    // 根据语言添加语言后缀
    if (locale === 'en' && !htmlFilename.includes('-en')) {
      htmlFilename = htmlFilename.replace('.html', '-en.html');
    }
    
    // 构建HTML文件下载URL
    const downloadUrl = `/downloads/${htmlFilename}`;

    // 创建临时链接进行下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = htmlFilename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`下载HTML文件: ${htmlFilename} from ${downloadUrl}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const resourceTitle = getResourceTitle();
    const shareData = {
      title: `Period Hub - ${resourceTitle}`,
      text: locale === 'zh' ? '推荐这个有用的经期健康资源' : 'Recommended period health resource',
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(locale === 'zh' ? '链接已复制到剪贴板！' : 'Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/downloads`);
  };

  if (!resource && !newPdfInfo && !previewContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '资源未找到' : 'Resource Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'zh'
              ? '抱歉，您请求的资源不存在。'
              : 'Sorry, the requested resource does not exist.'}
          </p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {locale === 'zh' ? '返回下载中心' : 'Back to Downloads'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {locale === 'zh' ? '正在加载预览内容...' : 'Loading preview content...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '预览不可用' : 'Preview Unavailable'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'zh'
              ? '抱歉，此资源暂不支持在线预览，请直接下载PDF文件。'
              : 'Sorry, online preview is not available for this resource. Please download the PDF directly.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {locale === 'zh' ? '返回列表' : 'Back to List'}
            </button>
            <button
              onClick={handleDownload}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              {locale === 'zh' ? '下载PDF' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果有预览内容配置，显示预览内容
  if (previewContent) {
    const currentLocale = locale === 'zh' ? 'zh' : 'en';
    const title = previewContent.title[currentLocale];
    const keyPoints = previewContent.keyPoints[currentLocale];
    const useCase = previewContent.useCase[currentLocale];
    const estimatedTime = previewContent.estimatedTime[currentLocale];
    const previewSections = previewContent.previewSections[currentLocale];
    const fullVersionIncludes = previewContent.fullVersionIncludes[currentLocale];

    return (
      <div className="min-h-screen bg-white">
        {/* 固定顶部工具栏 */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  {locale === 'zh' ? '返回列表' : 'Back to List'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  title={locale === 'zh' ? '打印或保存为PDF' : 'Print or Save as PDF'}
                >
                  <Printer className="w-5 h-5 mr-1" />
                  <span className="text-sm hidden sm:inline">
                    {locale === 'zh' ? '打印' : 'Print'}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  title={locale === 'zh' ? '分享' : 'Share'}
                >
                  <Share2 className="w-5 h-5 mr-1" />
                  <span className="text-sm hidden sm:inline">
                    {locale === 'zh' ? '分享' : 'Share'}
                  </span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">
                    {locale === 'zh' ? '下载PDF' : 'Download PDF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 预览内容展示区域 */}
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* 标题和基本信息 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {locale === 'zh' ? '预计使用时间' : 'Estimated Time'}: {estimatedTime}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  {locale === 'zh' ? '适用场景' : 'Use Case'}: {useCase}
                </span>
              </div>
            </div>

            {/* 核心要点 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '核心要点' : 'Key Points'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 预览章节 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '预览内容' : 'Preview Content'}
              </h2>
              <div className="space-y-6">
                {previewSections.map((section, index) => (
                  <div key={index} className={`p-6 rounded-lg ${section.isHighlight ? 'bg-purple-50 border-l-4 border-purple-500' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 完整版包含内容 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === 'zh' ? '完整版包含' : 'Full Version Includes'}
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fullVersionIncludes.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 下载提示 */}
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                {locale === 'zh' 
                  ? '这是预览内容，完整版本包含更多详细信息。点击上方按钮下载完整PDF文件。'
                  : 'This is preview content. The full version contains more detailed information. Click the button above to download the complete PDF file.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* 打印样式 */}
        <style jsx global>{`
          @media print {
            .fixed {
              display: none !important;
            }
            .preview-content {
              padding-top: 0 !important;
            }
            body {
              background: white !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // 如果没有预览内容配置，使用HTML内容（向后兼容）
  return (
    <div className="min-h-screen bg-white">
      {/* 固定顶部工具栏 */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                {locale === 'zh' ? '返回列表' : 'Back to List'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                title={locale === 'zh' ? '打印或保存为PDF' : 'Print or Save as PDF'}
              >
                <Printer className="w-5 h-5 mr-1" />
                <span className="text-sm hidden sm:inline">
                  {locale === 'zh' ? '打印' : 'Print'}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors"
                title={locale === 'zh' ? '分享' : 'Share'}
              >
                <Share2 className="w-5 h-5 mr-1" />
                <span className="text-sm hidden sm:inline">
                  {locale === 'zh' ? '分享' : 'Share'}
                </span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  {locale === 'zh' ? '下载PDF' : 'Download PDF'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HTML内容展示区域 */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            {locale === 'zh' ? 'HTML内容加载中...' : 'Loading HTML content...'}
          </p>
        </div>
      </div>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          .fixed {
            display: none !important;
          }
          .preview-content {
            padding-top: 0 !important;
          }
          body {
            background: white !important;
          }
        }

        .preview-content {
          max-width: none;
        }

        .preview-content body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
