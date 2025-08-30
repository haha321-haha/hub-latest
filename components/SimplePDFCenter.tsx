'use client';

import React, { useState } from 'react';
import { Search, Clock, AlertCircle, Brain, TrendingUp, Download, Share2, Eye, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Locale } from '@/i18n';
import { SITE_CONFIG } from '@/config/site.config';

interface SimplePDFCenterProps {
  locale: Locale;
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'pdf';
  readTime?: string;
  category: string;
  keywords?: string[];
  description?: string;
}

const SimplePDFCenter: React.FC<SimplePDFCenterProps> = ({ locale }) => {
  const [activeCategory, setActiveCategory] = useState('immediate');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  // 🌐 翻译系统
  const t = useTranslations('pdfCenter.search');
  
  // 计算总资源数
  const totalResources = SITE_CONFIG.statistics.articles + SITE_CONFIG.statistics.pdfResources;

  // 🚀 Phase 1: 修复后的文章ID到slug映射表（基于实际文件）
  const articleIdToSlugMap: Record<string, string> = {
    // 即时缓解类文章 (7篇) - 基于实际资源定义
    'immediate-1': '5-minute-period-pain-relief',                    // 5分钟快速缓解痛经技巧
    'immediate-2': 'heat-therapy-complete-guide',                    // 热疗完整指南
    'immediate-3': 'menstrual-pain-vs-other-abdominal-pain-guide',   // 经期疼痛与其他腹痛鉴别指南
    'immediate-4': 'natural-physical-therapy-comprehensive-guide',   // 自然物理疗法综合指南
    'immediate-5': 'ginger-menstrual-pain-relief-guide',            // 生姜经期疼痛缓解指南
    'immediate-6': 'nsaid-menstrual-pain-professional-guide',       // 非甾体抗炎药专业指南
    'immediate-7': 'specific-menstrual-pain-management-guide',      // 特定痛经管理指南

    // 计划准备类文章 (7篇) - 基于实际资源定义
    'preparation-1': 'menstrual-preventive-care-complete-plan',     // 经期预防性护理完全方案
    'preparation-2': 'comprehensive-menstrual-sleep-quality-guide', // 经期睡眠质量全面改善指南
    'preparation-3': 'menstrual-stress-management-complete-guide',  // 经期压力管理完全指南
    'preparation-4': 'zhan-zhuang-baduanjin-for-menstrual-pain-relief', // 站桩八段锦经期疼痛缓解
    'preparation-5': 'anti-inflammatory-diet-period-pain',          // 抗炎饮食与经期疼痛
    'preparation-6': 'magnesium-gut-health-comprehensive-guide',    // 镁与肠道健康综合指南
    'preparation-7': 'period-friendly-recipes',                     // 经期友好食谱

    // 深入了解类文章 (13篇) - 基于实际资源定义
    'learning-1': 'womens-lifecycle-menstrual-pain-analysis',       // 女性生命周期痛经特点全解析
    'learning-2': 'menstrual-pain-research-progress-2024',          // 2024年痛经研究进展报告
    'learning-3': 'understanding-your-cycle',                       // 了解您的生理周期
    'learning-4': 'us-menstrual-pain-insurance-coverage-guide',     // 美国痛经治疗医疗保险覆盖指南
    'learning-5': 'hidden-culprits-of-menstrual-pain',             // 经期疼痛的隐藏元凶
    'learning-6': 'menstrual-pain-faq-expert-answers',             // 经期疼痛常见问题专家解答
    'learning-7': 'when-to-see-doctor-period-pain',                // 何时就医：经期疼痛警示信号
    'learning-8': 'when-to-seek-medical-care-comprehensive-guide', // 何时寻求医疗护理综合指南
    'learning-9': 'comprehensive-medical-guide-to-dysmenorrhea',   // 痛经综合医学指南
    'learning-10': 'menstrual-pain-complications-management',      // 经期疼痛并发症管理
    'learning-11': 'comprehensive-iud-guide',                      // 宫内节育器综合指南
    'learning-12': 'menstrual-pain-medical-guide',                 // 循证医学痛经指南
    'learning-13': 'essential-oils-aromatherapy-menstrual-pain-guide', // 精油芳疗经期疼痛指南

    // 长期管理类文章 (9篇) - 基于实际资源定义
    'management-1': 'recommended-reading-list',                     // 推荐阅读清单
    'management-2': 'herbal-tea-menstrual-pain-relief',            // 有效草药茶经期疼痛缓解
    'management-3': 'global-traditional-menstrual-pain-relief',    // 全球传统经期疼痛缓解方法
    'management-4': 'personal-menstrual-health-profile',           // 个人经期健康档案
    'management-5': 'herbal-tea-menstrual-pain-relief',           // 抗炎饮食缓解经期疼痛指南 (修复：使用现有文章)
    'management-6': 'period-friendly-recipes',                     // 经期友好营养食谱
    'management-7': 'comprehensive-report-non-medical-factors-menstrual-pain', // 长期健康生活方式指南
    'management-8': 'period-pain-simulator-accuracy-analysis',     // 经期健康追踪与分析
    'management-9': 'medication-vs-natural-remedies-menstrual-pain' // 可持续健康管理策略
  };

  const handleArticleRead = (articleId: string) => {
    setLoadingStates(prev => ({ ...prev, [articleId]: true }));

    // 使用映射表获取正确的slug
    const slug = articleIdToSlugMap[articleId];

    if (!slug) {
      console.error(`No slug found for article ID: ${articleId}`);
      setLoadingStates(prev => ({ ...prev, [articleId]: false }));
      return;
    }

    try {
      router.push(`/${locale}/articles/${slug}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setLoadingStates(prev => ({ ...prev, [articleId]: false }));
    }
  };

  // 🔧 PDF ID映射：SimplePDFCenter ID -> 预览系统支持的ID (扩展到30个PDF)
  const pdfIdToPreviewIdMap: Record<string, string> = {
    // 即时缓解PDF (7个：3个现有 + 4个新增)
    'immediate-pdf-1': 'pain-tracking-form',                    // 疼痛追踪表格
    'immediate-pdf-2': 'campus-emergency-checklist',           // 校园紧急检查清单
    'immediate-pdf-3': 'specific-menstrual-pain-management-guide', // 特定痛经管理指南PDF
    'immediate-pdf-4': 'emergency-pain-relief-card',           // 紧急疼痛缓解卡片
    'immediate-pdf-5': '5-minute-relief-checklist',            // 5分钟快速缓解检查清单
    'immediate-pdf-6': 'heat-therapy-guide-pdf',               // 热疗完整指南PDF版
    'immediate-pdf-7': 'workplace-relief-toolkit',             // 职场疼痛缓解工具包

    // 计划准备PDF (7个：4个现有 + 3个新增)
    'preparation-pdf-1': 'healthy-habits-checklist',           // 健康习惯检查清单
    'preparation-pdf-2': 'menstrual-cycle-nutrition-plan',     // 经期营养计划
    'preparation-pdf-3': 'magnesium-gut-health-menstrual-pain-guide',         // 镁与肠道健康指南
    'preparation-pdf-4': 'zhan-zhuang-baduanjin-illustrated-guide', // 站桩八段锦图解指南
    'preparation-pdf-5': 'monthly-preparation-planner',        // 月度准备计划表
    'preparation-pdf-6': 'stress-management-workbook',         // 压力管理工作册
    'preparation-pdf-7': 'sleep-quality-improvement-guide',    // 睡眠质量改善指南

    // 学习理解PDF (10个：6个现有 + 4个新增)
    'learning-pdf-1': 'natural-therapy-assessment',            // 自然疗法评估表
    'learning-pdf-2': 'menstrual-pain-complications-management', // 痛经并发症管理
    'learning-pdf-3': 'teacher-health-manual',                 // 教师健康手册
    'learning-pdf-4': 'teacher-collaboration-handbook',        // 教师协作手册
    'learning-pdf-5': 'parent-communication-guide',            // 家长沟通指南
    'learning-pdf-6': 'pain-tracking-form',                    // 美国保险快速参考卡 (复用)
    'learning-pdf-7': 'menstrual-cycle-education-guide',       // 月经周期教育指南
    'learning-pdf-8': 'pain-research-summary-2024',            // 2024痛经研究摘要
    'learning-pdf-9': 'medical-consultation-preparation',      // 就医咨询准备指南
    'learning-pdf-10': 'global-health-perspectives',           // 全球健康视角报告

    // 长期管理PDF (6个：全新分类)
    'management-pdf-1': 'long-term-health-planner',            // 长期健康规划师
    'management-pdf-2': 'personal-health-journal',             // 个人健康日记模板
    'management-pdf-3': 'nutrition-meal-planning-kit',         // 营养膳食规划工具包
    'management-pdf-4': 'exercise-routine-builder',            // 运动计划构建器
    'management-pdf-5': 'lifestyle-assessment-toolkit',        // 生活方式评估工具包
    'management-pdf-6': 'sustainable-health-strategies'        // 可持续健康策略指南
  };

  const handlePDFPreview = (pdfId: string) => {
    setLoadingStates(prev => ({ ...prev, [`${pdfId}-preview`]: true }));

    // 使用映射表获取正确的预览ID
    const previewId = pdfIdToPreviewIdMap[pdfId];

    if (!previewId) {
      console.error(`No preview ID found for PDF: ${pdfId}`);
      setLoadingStates(prev => ({ ...prev, [`${pdfId}-preview`]: false }));
      return;
    }

    try {
      router.push(`/${locale}/downloads/preview/${previewId}`);
    } catch (error) {
      console.error('Preview navigation error:', error);
      setLoadingStates(prev => ({ ...prev, [`${pdfId}-preview`]: false }));
    }
  };

  const handlePDFDownload = async (pdfId: string, title: string) => {
    setLoadingStates(prev => ({ ...prev, [`${pdfId}-download`]: true }));

    try {
      // 🚀 修复：使用和预览页面相同的映射逻辑
      const previewId = pdfIdToPreviewIdMap[pdfId];
      
      if (!previewId) {
        console.error(`No preview ID found for PDF: ${pdfId}`);
        alert(locale === 'zh' ? '资源映射错误，请联系技术支持' : 'Resource mapping error, please contact support');
        return;
      }

      // 构建HTML文件路径（使用和预览页面相同的逻辑）
      let htmlFilename = `${previewId}.html`;
      if (locale === 'en' && !htmlFilename.includes('-en')) {
        htmlFilename = htmlFilename.replace('.html', '-en.html');
      }
      
      const fetchUrl = `/pdf-files/${htmlFilename}`;
      console.log(`正在获取PDF内容: ${fetchUrl}`);

      // 从服务器获取实际HTML内容
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF content: ${response.status} ${response.statusText}`);
      }

      const htmlContent = await response.text();
      
      // 验证内容不为空
      if (!htmlContent || htmlContent.trim().length < 100) {
        throw new Error('PDF content is empty or too short');
      }

      // 创建下载
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`PDF下载成功: ${title}`);

    } catch (error) {
      console.error('PDF下载错误:', error);
      alert(locale === 'zh' 
        ? `下载失败: ${error instanceof Error ? error.message : '未知错误'}` 
        : `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoadingStates(prev => ({ ...prev, [`${pdfId}-download`]: false }));
    }
  };

  const handleShare = async (resourceId: string, title: string, type: 'article' | 'pdf') => {
    const baseUrl = window.location.origin;
    const shareUrl = type === 'article'
      ? `${baseUrl}/${locale}/articles/${resourceId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      : `${baseUrl}/${locale}/downloads/preview/${resourceId}`;

    const shareData = {
      title: title,
      text: locale === 'zh' ? `来自 Period Hub 的资源：${title}` : `Resource from Period Hub: ${title}`,
      url: shareUrl
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(shareUrl);
        alert(locale === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
      }
    } catch (error) {
      console.error('Share error:', error);
      // 最后的降级方案
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(locale === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  // 生成PDF的HTML内容（简化版本）
  const generatePDFHTML = (pdfId: string, title: string, locale: string) => {
    return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Period Hub</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 40px; }
        .header { border-bottom: 2px solid #9333ea; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #9333ea; font-size: 24px; font-weight: bold; }
        .content { max-width: 800px; }
        @media print { body { margin: 20px; } }
        @media (max-width: 768px) { body { margin: 20px; } .title { font-size: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${title}</h1>
        <p>${locale === 'zh' ? '来源：Period Hub 健康资源中心' : 'Source: Period Hub Health Resource Center'}</p>
    </div>
    <div class="content">
        <p>${locale === 'zh' ? '此资源正在开发中，敬请期待完整内容。' : 'This resource is under development. Complete content coming soon.'}</p>
        <p>${locale === 'zh' ? '如需更多信息，请访问：' : 'For more information, visit:'} <a href="https://periodhub.health">periodhub.health</a></p>
    </div>
</body>
</html>`;
  };

  // 🔥 应用类型安全的翻译核心 - 消除硬编码
  const getCategoryTitle = (key: string) => {
    const titles = {
      immediate: locale === 'zh' ? '即时缓解方案' : 'Immediate Relief',
      preparation: locale === 'zh' ? '计划与准备' : 'Planning & Preparation',
      learning: locale === 'zh' ? '学习与理解' : 'Learning & Understanding',
      management: locale === 'zh' ? '长期管理' : 'Long-term Management'
    };
    return titles[key as keyof typeof titles] || key;
  };

  const getCategorySubtitle = (key: string) => {
    const subtitles = {
      immediate: locale === 'zh' ? '快速缓解疼痛' : 'Quick pain relief',
      preparation: locale === 'zh' ? '提前准备管理' : 'Advance planning',
      learning: locale === 'zh' ? '深入了解知识' : 'Deep understanding',
      management: locale === 'zh' ? '持续改善健康' : 'Continuous improvement'
    };
    return subtitles[key as keyof typeof subtitles] || key;
  };

  // 🚀 完整的资源数据 - 基于实际需求的49个资源
  const categories = {
    immediate: {
      id: 'immediate',
      title: getCategoryTitle('immediate'),
      subtitle: getCategorySubtitle('immediate'),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      resources: [
        // 即时缓解文章 (7篇)
        {
          id: 'immediate-1',
          title: locale === 'zh' ? '5分钟快速缓解痛经技巧' : '5-Minute Quick Period Pain Relief',
          type: 'article' as const,
          readTime: locale === 'zh' ? '5分钟' : '5 min read',
          category: 'immediate',
          keywords: locale === 'zh' ? ['疼痛', '缓解', '快速', '技巧'] : ['pain', 'relief', 'quick', 'techniques']
        },
        {
          id: 'immediate-2',
          title: locale === 'zh' ? '热疗完整指南' : 'Complete Heat Therapy Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '8分钟' : '8 min read',
          category: 'immediate'
        },
        {
          id: 'immediate-3',
          title: locale === 'zh' ? '经期疼痛与其他腹痛鉴别指南' : 'Menstrual Pain vs Other Abdominal Pain Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '25分钟' : '25 min read',
          category: 'immediate'
        },
        {
          id: 'immediate-4',
          title: locale === 'zh' ? '自然物理疗法综合指南' : 'Natural Physical Therapy Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '12分钟' : '12 min read',
          category: 'immediate'
        },
        {
          id: 'immediate-5',
          title: locale === 'zh' ? '生姜经期疼痛缓解指南' : 'Ginger Menstrual Pain Relief Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '12分钟' : '12 min read',
          category: 'immediate',
          keywords: locale === 'zh' ? ['生姜', '缓解', '疼痛', '自然', '天然'] : ['ginger', 'relief', 'pain', 'natural', 'herbal']
        },
        {
          id: 'immediate-6',
          title: locale === 'zh' ? '非甾体抗炎药专业指南' : 'NSAID Professional Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '15分钟' : '15 min read',
          category: 'immediate',
          keywords: locale === 'zh' ? ['药物', '医学', '专业', '抗炎', '治疗'] : ['medication', 'medical', 'professional', 'anti-inflammatory', 'treatment']
        },
        {
          id: 'immediate-7',
          title: locale === 'zh' ? '特定痛经管理指南' : 'Specific Menstrual Pain Management',
          type: 'article' as const,
          readTime: locale === 'zh' ? '20分钟' : '20 min read',
          category: 'immediate'
        },
        // 即时缓解PDF (7个：3个现有 + 4个新增)
        {
          id: 'immediate-pdf-1',
          title: locale === 'zh' ? '疼痛追踪表格' : 'Pain Tracking Form',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['疼痛', '追踪', '记录', '监测', '管理'] : ['pain', 'tracking', 'record', 'monitoring', 'management'],
          description: locale === 'zh' ? '记录和追踪疼痛程度的专业表格' : 'Professional form for tracking and recording pain levels'
        },
        {
          id: 'immediate-pdf-2',
          title: locale === 'zh' ? '校园紧急检查清单' : 'Campus Emergency Checklist',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['校园', '紧急', '检查', '学生', '应急'] : ['campus', 'emergency', 'checklist', 'student', 'crisis'],
          description: locale === 'zh' ? '校园环境中经期紧急情况的应对清单' : 'Emergency response checklist for menstrual situations on campus'
        },
        {
          id: 'immediate-pdf-3',
          title: locale === 'zh' ? '特定痛经管理指南PDF' : 'Specific Pain Management Guide PDF',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['痛经', '管理', '指南', '治疗', '缓解'] : ['dysmenorrhea', 'management', 'guide', 'treatment', 'relief'],
          description: locale === 'zh' ? '针对特定痛经类型的专业管理指南' : 'Professional management guide for specific types of dysmenorrhea'
        },
        {
          id: 'immediate-pdf-4',
          title: locale === 'zh' ? '紧急疼痛缓解卡片' : 'Emergency Pain Relief Card',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['紧急', '缓解', '卡片', '便携', '快速'] : ['emergency', 'relief', 'card', 'portable', 'quick'],
          description: locale === 'zh' ? '便携式紧急疼痛缓解方法速查卡' : 'Portable quick reference card for emergency pain relief methods'
        },
        {
          id: 'immediate-pdf-5',
          title: locale === 'zh' ? '5分钟快速缓解检查清单' : '5-Minute Quick Relief Checklist',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['5分钟', '快速', '缓解', '检查', '步骤'] : ['5-minute', 'quick', 'relief', 'checklist', 'steps'],
          description: locale === 'zh' ? '即时可用的5分钟快速缓解步骤清单' : 'Instant-use 5-minute quick relief step checklist'
        },
        {
          id: 'immediate-pdf-6',
          title: locale === 'zh' ? '热疗完整指南PDF版' : 'Complete Heat Therapy Guide PDF',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['热疗', '指南', '温热', '治疗', '方法'] : ['heat', 'therapy', 'thermal', 'treatment', 'methods'],
          description: locale === 'zh' ? '详细的热疗使用方法和注意事项指南' : 'Detailed guide on heat therapy methods and precautions'
        },
        {
          id: 'immediate-pdf-7',
          title: locale === 'zh' ? '职场疼痛缓解工具包' : 'Workplace Pain Relief Toolkit',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'immediate',
          keywords: locale === 'zh' ? ['职场', '工作', '缓解', '工具', '办公'] : ['workplace', 'office', 'relief', 'toolkit', 'professional'],
          description: locale === 'zh' ? '办公环境下的疼痛管理和缓解方案' : 'Pain management and relief solutions for office environments'
        }
      ]
    },
    preparation: {
      id: 'preparation',
      title: getCategoryTitle('preparation'),
      subtitle: getCategorySubtitle('preparation'),
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      resources: [
        // 计划准备文章 (7篇)
        {
          id: 'preparation-1',
          title: locale === 'zh' ? '经期预防性护理完全方案' : 'Complete Preventive Care Plan',
          type: 'article' as const,
          readTime: locale === 'zh' ? '22分钟' : '22 min read',
          category: 'preparation'
        },
        {
          id: 'preparation-2',
          title: locale === 'zh' ? '经期睡眠质量全面改善指南' : 'Comprehensive Sleep Quality Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '20分钟' : '20 min read',
          category: 'preparation'
        },
        {
          id: 'preparation-3',
          title: locale === 'zh' ? '经期压力管理完全指南' : 'Complete Stress Management Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '22分钟' : '22 min read',
          category: 'preparation'
        },
        {
          id: 'preparation-4',
          title: locale === 'zh' ? '站桩八段锦经期疼痛缓解' : 'Zhan Zhuang Baduanjin for Pain Relief',
          type: 'article' as const,
          readTime: locale === 'zh' ? '18分钟' : '18 min read',
          category: 'preparation',
          keywords: locale === 'zh' ? ['运动', '八段锦', '站桩', '缓解', '锻炼'] : ['exercise', 'baduanjin', 'qigong', 'relief', 'workout']
        },
        {
          id: 'preparation-5',
          title: locale === 'zh' ? '抗炎饮食与经期疼痛' : 'Anti-inflammatory Diet for Period Pain',
          type: 'article' as const,
          readTime: locale === 'zh' ? '18分钟' : '18 min read',
          category: 'preparation',
          keywords: locale === 'zh' ? ['饮食', '营养', '抗炎', '疼痛', '食物'] : ['diet', 'nutrition', 'anti-inflammatory', 'pain', 'food']
        },
        {
          id: 'preparation-6',
          title: locale === 'zh' ? '镁与肠道健康综合指南' : 'Magnesium and Gut Health Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '16分钟' : '16 min read',
          category: 'preparation'
        },
        {
          id: 'preparation-7',
          title: locale === 'zh' ? '经期友好食谱' : 'Period-Friendly Recipes',
          type: 'article' as const,
          readTime: locale === 'zh' ? '12分钟' : '12 min read',
          category: 'preparation'
        },
        // 计划准备PDF (7个：4个现有 + 3个新增)
        {
          id: 'preparation-pdf-1',
          title: locale === 'zh' ? '健康习惯检查清单' : 'Healthy Habits Checklist',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['健康', '习惯', '检查', '清单', '计划'] : ['health', 'habits', 'checklist', 'planning', 'routine'],
          description: locale === 'zh' ? '建立健康生活习惯的专业检查清单' : 'Professional checklist for establishing healthy lifestyle habits'
        },
        {
          id: 'preparation-pdf-2',
          title: locale === 'zh' ? '经期营养计划' : 'Menstrual Cycle Nutrition Plan',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['营养', '计划', '饮食', '健康', '周期'] : ['nutrition', 'plan', 'diet', 'health', 'cycle'],
          description: locale === 'zh' ? '针对月经周期的个性化营养补充计划' : 'Personalized nutrition plan for menstrual cycle support'
        },
        {
          id: 'preparation-pdf-3',
          title: locale === 'zh' ? '镁与肠道健康指南' : 'Magnesium Gut Health Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['镁', '肠道', '健康', '矿物质', '补充'] : ['magnesium', 'gut', 'health', 'minerals', 'supplement'],
          description: locale === 'zh' ? '镁元素与肠道健康的综合指导手册' : 'Comprehensive guide on magnesium and gut health connection'
        },
        {
          id: 'preparation-pdf-4',
          title: locale === 'zh' ? '站桩八段锦图解指南' : 'Zhan Zhuang Baduanjin Illustrated Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['运动', '八段锦', '站桩', '缓解', '锻炼'] : ['exercise', 'baduanjin', 'qigong', 'relief', 'workout'],
          description: locale === 'zh' ? '传统八段锦和站桩功法的详细图解教程' : 'Detailed illustrated tutorial for traditional Baduanjin and Zhan Zhuang exercises'
        },
        {
          id: 'preparation-pdf-5',
          title: locale === 'zh' ? '月度准备计划表' : 'Monthly Preparation Planner',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['月度', '计划', '准备', '管理', '安排'] : ['monthly', 'planning', 'preparation', 'management', 'schedule'],
          description: locale === 'zh' ? '提前规划经期健康管理的月度计划工具' : 'Monthly planning tool for advance menstrual health management'
        },
        {
          id: 'preparation-pdf-6',
          title: locale === 'zh' ? '压力管理工作册' : 'Stress Management Workbook',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['压力', '管理', '工作册', '心理', '调节'] : ['stress', 'management', 'workbook', 'mental', 'wellness'],
          description: locale === 'zh' ? '经期压力管理的实用练习册和指导手册' : 'Practical workbook and guide for menstrual stress management'
        },
        {
          id: 'preparation-pdf-7',
          title: locale === 'zh' ? '睡眠质量改善指南' : 'Sleep Quality Improvement Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'preparation',
          keywords: locale === 'zh' ? ['睡眠', '质量', '改善', '休息', '恢复'] : ['sleep', 'quality', 'improvement', 'rest', 'recovery'],
          description: locale === 'zh' ? '经期睡眠优化的详细指导和实用技巧' : 'Detailed guidance and practical tips for menstrual sleep optimization'
        }
      ]
    },
    learning: {
      id: 'learning',
      title: getCategoryTitle('learning'),
      subtitle: getCategorySubtitle('learning'),
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      resources: [
        // 学习理解文章 (13篇)
        {
          id: 'learning-1',
          title: locale === 'zh' ? '女性生命周期痛经特点全解析' : 'Women\'s Lifecycle Pain Analysis',
          type: 'article' as const,
          readTime: locale === 'zh' ? '24分钟' : '24 min read',
          category: 'learning'
        },
        {
          id: 'learning-2',
          title: locale === 'zh' ? '2024年痛经研究进展报告' : '2024 Menstrual Pain Research Progress',
          type: 'article' as const,
          readTime: locale === 'zh' ? '18分钟' : '18 min read',
          category: 'learning'
        },
        {
          id: 'learning-3',
          title: locale === 'zh' ? '了解您的生理周期' : 'Understanding Your Cycle',
          type: 'article' as const,
          readTime: locale === 'zh' ? '25分钟' : '25 min read',
          category: 'learning'
        },
        {
          id: 'learning-4',
          title: locale === 'zh' ? '美国痛经治疗医疗保险覆盖指南' : 'US Insurance Coverage Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '25分钟' : '25 min read',
          category: 'learning'
        },
        {
          id: 'learning-5',
          title: locale === 'zh' ? '经期疼痛的隐藏元凶' : 'Hidden Culprits of Period Pain',
          type: 'article' as const,
          readTime: locale === 'zh' ? '20分钟' : '20 min read',
          category: 'learning'
        },
        {
          id: 'learning-6',
          title: locale === 'zh' ? '经期疼痛常见问题专家解答' : 'Expert FAQ on Period Pain',
          type: 'article' as const,
          readTime: locale === 'zh' ? '18分钟' : '18 min read',
          category: 'learning'
        },
        {
          id: 'learning-7',
          title: locale === 'zh' ? '何时就医：经期疼痛警示信号' : 'When to See Doctor: Warning Signs',
          type: 'article' as const,
          readTime: locale === 'zh' ? '10分钟' : '10 min read',
          category: 'learning'
        },
        {
          id: 'learning-8',
          title: locale === 'zh' ? '何时寻求医疗护理综合指南' : 'When to Seek Medical Care Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '15分钟' : '15 min read',
          category: 'learning'
        },
        {
          id: 'learning-9',
          title: locale === 'zh' ? '痛经综合医学指南' : 'Comprehensive Medical Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '30分钟' : '30 min read',
          category: 'learning',
          keywords: locale === 'zh' ? ['医学', '综合', '指南', '专业', '治疗'] : ['medical', 'comprehensive', 'guide', 'professional', 'treatment']
        },
        {
          id: 'learning-10',
          title: locale === 'zh' ? '经期疼痛并发症管理' : 'Pain Complications Management',
          type: 'article' as const,
          readTime: locale === 'zh' ? '22分钟' : '22 min read',
          category: 'learning'
        },
        {
          id: 'learning-11',
          title: locale === 'zh' ? '宫内节育器综合指南' : 'IUD Comprehensive Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '28分钟' : '28 min read',
          category: 'learning'
        },
        {
          id: 'learning-12',
          title: locale === 'zh' ? '循证医学痛经指南' : 'Evidence-Based Pain Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '32分钟' : '32 min read',
          category: 'learning'
        },
        {
          id: 'learning-13',
          title: locale === 'zh' ? '精油芳疗经期疼痛指南' : 'Essential Oils Pain Relief Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '14分钟' : '14 min read',
          category: 'learning'
        },
        // 学习理解PDF (10个：6个现有 + 4个新增)
        {
          id: 'learning-pdf-1',
          title: locale === 'zh' ? '自然疗法评估表' : 'Natural Therapy Assessment',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['自然', '疗法', '评估', '表格', '选择'] : ['natural', 'therapy', 'assessment', 'evaluation', 'selection'],
          description: locale === 'zh' ? '评估和选择适合个人的自然疗法方案' : 'Assessment tool for selecting suitable natural therapy approaches'
        },
        {
          id: 'learning-pdf-2',
          title: locale === 'zh' ? '痛经并发症管理' : 'Pain Complications Management PDF',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['并发症', '管理', '医学', '专业', '治疗'] : ['complications', 'management', 'medical', 'professional', 'treatment'],
          description: locale === 'zh' ? '痛经相关并发症的识别和管理指南' : 'Guide for identifying and managing menstrual pain complications'
        },
        {
          id: 'learning-pdf-3',
          title: locale === 'zh' ? '教师健康手册' : 'Teacher Health Manual',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['教师', '健康', '手册', '教育', '工作'] : ['teacher', 'health', 'manual', 'education', 'workplace'],
          description: locale === 'zh' ? '教育工作者的健康管理和职业保健手册' : 'Health management and occupational wellness manual for educators'
        },
        {
          id: 'learning-pdf-4',
          title: locale === 'zh' ? '教师协作手册' : 'Teacher Collaboration Handbook',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['教师', '协作', '沟通', '合作', '指导'] : ['teacher', 'collaboration', 'communication', 'cooperation', 'guidance'],
          description: locale === 'zh' ? '教师间协作和学生健康支持的指导手册' : 'Guidance manual for teacher collaboration and student health support'
        },
        {
          id: 'learning-pdf-5',
          title: locale === 'zh' ? '家长沟通指南' : 'Parent Communication Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['沟通', '家长', '对话', '交流', '指导'] : ['communication', 'parent', 'dialogue', 'conversation', 'guidance'],
          description: locale === 'zh' ? '与家长就青春期健康问题进行有效沟通的指南' : 'Guide for effective communication with parents about adolescent health'
        },
        {
          id: 'learning-pdf-6',
          title: locale === 'zh' ? '美国保险快速参考卡' : 'US Insurance Quick Reference',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['保险', '美国', '参考', '医疗', '覆盖'] : ['insurance', 'USA', 'reference', 'medical', 'coverage'],
          description: locale === 'zh' ? '美国医疗保险中经期健康服务的快速参考' : 'Quick reference for menstrual health services under US health insurance'
        },
        {
          id: 'learning-pdf-7',
          title: locale === 'zh' ? '月经周期教育指南' : 'Menstrual Cycle Education Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['教育', '周期', '生理', '科学', '知识'] : ['education', 'cycle', 'physiology', 'science', 'knowledge'],
          description: locale === 'zh' ? '全面的月经周期科学教育和健康知识材料' : 'Comprehensive scientific education material about menstrual cycle and health'
        },
        {
          id: 'learning-pdf-8',
          title: locale === 'zh' ? '2024痛经研究摘要' : '2024 Pain Research Summary',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['研究', '2024', '最新', '科学', '进展'] : ['research', '2024', 'latest', 'science', 'progress'],
          description: locale === 'zh' ? '2024年最新痛经研究成果和科学进展汇总' : '2024 latest menstrual pain research findings and scientific progress summary'
        },
        {
          id: 'learning-pdf-9',
          title: locale === 'zh' ? '就医咨询准备指南' : 'Medical Consultation Preparation Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['就医', '咨询', '准备', '医生', '问诊'] : ['medical', 'consultation', 'preparation', 'doctor', 'appointment'],
          description: locale === 'zh' ? '就医前的准备工作和问题清单指导' : 'Guidance for preparation and question checklist before medical appointments'
        },
        {
          id: 'learning-pdf-10',
          title: locale === 'zh' ? '全球健康视角报告' : 'Global Health Perspectives Report',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'learning',
          keywords: locale === 'zh' ? ['全球', '视角', '文化', '国际', '比较'] : ['global', 'perspectives', 'cultural', 'international', 'comparative'],
          description: locale === 'zh' ? '不同文化背景下经期健康管理方法的比较研究' : 'Comparative study of menstrual health management across different cultural backgrounds'
        }
      ]
    },
    management: {
      id: 'management',
      title: getCategoryTitle('management'),
      subtitle: getCategorySubtitle('management'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      resources: [
        // 长期管理文章 (9篇)
        {
          id: 'management-1',
          title: locale === 'zh' ? '推荐阅读清单' : 'Recommended Reading List',
          type: 'article' as const,
          readTime: locale === 'zh' ? '35分钟' : '35 min read',
          category: 'management'
        },
        {
          id: 'management-2',
          title: locale === 'zh' ? '有效草药茶经期疼痛缓解' : 'Herbal Tea Pain Relief',
          type: 'article' as const,
          readTime: locale === 'zh' ? '15分钟' : '15 min read',
          category: 'management'
        },
        {
          id: 'management-3',
          title: locale === 'zh' ? '全球传统经期疼痛缓解方法' : 'Global Traditional Pain Relief',
          type: 'article' as const,
          readTime: locale === 'zh' ? '25分钟' : '25 min read',
          category: 'management'
        },
        {
          id: 'management-4',
          title: locale === 'zh' ? '个人经期健康档案' : 'Personal Health Profile',
          type: 'article' as const,
          readTime: locale === 'zh' ? '20分钟' : '20 min read',
          category: 'management'
        },
        {
          id: 'management-5',
          title: locale === 'zh' ? '抗炎饮食缓解经期疼痛指南' : 'Anti-inflammatory Diet Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '18分钟' : '18 min read',
          category: 'management'
        },
        {
          id: 'management-6',
          title: locale === 'zh' ? '经期友好营养食谱' : 'Period-Friendly Nutrition Recipes',
          type: 'article' as const,
          readTime: locale === 'zh' ? '12分钟' : '12 min read',
          category: 'management',
          keywords: locale === 'zh' ? ['营养', '食谱', '友好', '饮食', '健康'] : ['nutrition', 'recipes', 'friendly', 'diet', 'health']
        },
        {
          id: 'management-7',
          title: locale === 'zh' ? '长期健康生活方式指南' : 'Long-term Healthy Lifestyle Guide',
          type: 'article' as const,
          readTime: locale === 'zh' ? '30分钟' : '30 min read',
          category: 'management'
        },
        {
          id: 'management-8',
          title: locale === 'zh' ? '经期健康追踪与分析' : 'Health Tracking and Analysis',
          type: 'article' as const,
          readTime: locale === 'zh' ? '22分钟' : '22 min read',
          category: 'management'
        },
        {
          id: 'management-9',
          title: locale === 'zh' ? '可持续健康管理策略' : 'Sustainable Health Management',
          type: 'article' as const,
          readTime: locale === 'zh' ? '28分钟' : '28 min read',
          category: 'management'
        },
        // 长期管理PDF (6个：全新分类)
        {
          id: 'management-pdf-1',
          title: locale === 'zh' ? '长期健康规划师' : 'Long-term Health Planner',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['长期', '健康', '规划', '目标', '计划'] : ['long-term', 'health', 'planning', 'goals', 'strategy'],
          description: locale === 'zh' ? '年度健康管理和目标设定的专业工具' : 'Professional tool for annual health management and goal setting'
        },
        {
          id: 'management-pdf-2',
          title: locale === 'zh' ? '个人健康日记模板' : 'Personal Health Journal Template',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['日记', '模板', '记录', '追踪', '个人'] : ['journal', 'template', 'record', 'tracking', 'personal'],
          description: locale === 'zh' ? '长期健康追踪和记录的日记模板工具' : 'Journal template tool for long-term health tracking and recording'
        },
        {
          id: 'management-pdf-3',
          title: locale === 'zh' ? '营养膳食规划工具包' : 'Nutrition Meal Planning Kit',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['营养', '膳食', '规划', '工具', '饮食'] : ['nutrition', 'meal', 'planning', 'toolkit', 'diet'],
          description: locale === 'zh' ? '长期营养管理和膳食规划的实用工具包' : 'Practical toolkit for long-term nutrition management and meal planning'
        },
        {
          id: 'management-pdf-4',
          title: locale === 'zh' ? '运动计划构建器' : 'Exercise Routine Builder',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['运动', '计划', '构建', '锻炼', '健身'] : ['exercise', 'routine', 'builder', 'workout', 'fitness'],
          description: locale === 'zh' ? '个性化运动计划制定和执行的指导工具' : 'Guidance tool for creating and implementing personalized exercise routines'
        },
        {
          id: 'management-pdf-5',
          title: locale === 'zh' ? '生活方式评估工具包' : 'Lifestyle Assessment Toolkit',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['生活方式', '评估', '工具', '健康', '分析'] : ['lifestyle', 'assessment', 'toolkit', 'health', 'analysis'],
          description: locale === 'zh' ? '全面的生活方式健康评估和优化工具' : 'Comprehensive lifestyle health assessment and optimization tool'
        },
        {
          id: 'management-pdf-6',
          title: locale === 'zh' ? '可持续健康策略指南' : 'Sustainable Health Strategies Guide',
          type: 'pdf' as const,
          readTime: locale === 'zh' ? 'PDF' : 'PDF',
          category: 'management',
          keywords: locale === 'zh' ? ['可持续', '策略', '健康', '管理', '长期'] : ['sustainable', 'strategies', 'health', 'management', 'long-term'],
          description: locale === 'zh' ? '长期可持续健康管理策略的指导手册' : 'Guidance manual for long-term sustainable health management strategies'
        }
      ]
    }
  };

  // 🔍 搜索过滤逻辑
  const searchResources = (searchTerm: string): Resource[] => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    const allResources: Resource[] = Object.values(categories).flatMap(cat => cat.resources as Resource[]);
    
    return allResources.filter((resource: Resource) => {
      // 搜索标题
      const titleMatch = resource.title.toLowerCase().includes(term);
      
      // 搜索关键词
      const keywordMatch = resource.keywords?.some((keyword: string) => 
        keyword.toLowerCase().includes(term)
      ) || false;
      
      // 搜索描述
      const descriptionMatch = resource.description?.toLowerCase().includes(term) || false;
      
      return titleMatch || keywordMatch || descriptionMatch;
    });
  };

  // 根据搜索词获取要显示的资源
  const filteredResources = searchTerm ? searchResources(searchTerm) : [];

  // 🎨 Phase 1: 移动优先的ResourceCard组件
  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const isLoading = (action: string) => loadingStates[`${resource.id}${action ? `-${action}` : ''}`] || false;

    return (
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 touch-manipulation">
        {/* 移动优化：标题和类型标签 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-2 sm:mr-3 min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight mb-2 line-clamp-2">
              {resource.title}
            </h3>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                resource.type === 'article'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {resource.type === 'article' ? (locale === 'zh' ? '文章' : 'Article') : 'PDF'}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{resource.readTime}</span>
            </div>
          </div>

          {/* 移动优化：分享按钮 - 更大的触摸区域 */}
          <button
            onClick={() => handleShare(resource.id, resource.title, resource.type)}
            className="p-2 sm:p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            title={locale === 'zh' ? '分享' : 'Share'}
            aria-label={locale === 'zh' ? '分享此资源' : 'Share this resource'}
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 移动优化：按钮组 */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          {resource.type === 'article' ? (
            // 文章：单个"阅读全文"按钮 - 移动优化
            <button
              onClick={() => handleArticleRead(resource.id)}
              disabled={isLoading('')}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
              aria-label={locale === 'zh' ? '阅读完整文章' : 'Read full article'}
            >
              {isLoading('') ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
              <span className="hidden xs:inline sm:inline">{locale === 'zh' ? '阅读全文' : 'Read Full'}</span>
              <span className="xs:hidden">{locale === 'zh' ? '阅读' : 'Read'}</span>
            </button>
          ) : (
            // PDF：预览和下载按钮 - 移动优化
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePDFPreview(resource.id)}
                disabled={isLoading('preview')}
                className="flex items-center space-x-1 px-2 sm:px-3 py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
                aria-label={locale === 'zh' ? '预览PDF内容' : 'Preview PDF content'}
              >
                {isLoading('preview') ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span className="hidden xs:inline">{locale === 'zh' ? '预览' : 'Preview'}</span>
              </button>

              <button
                onClick={() => handlePDFDownload(resource.id, resource.title)}
                disabled={isLoading('download')}
                className="flex items-center space-x-1 px-2 sm:px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
                aria-label={locale === 'zh' ? '下载PDF文件' : 'Download PDF file'}
              >
                {isLoading('download') ? (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden xs:inline">{locale === 'zh' ? '下载' : 'Download'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CategorySection = ({ category }: { category: any }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg mr-3 bg-gradient-to-r ${category.color} text-white`}>
          {category.icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{category.title}</h2>
          <p className="text-sm text-gray-600">{category.subtitle}</p>
        </div>
        <div className="ml-auto">
          <span className="text-lg font-bold text-gray-600">{category.resources.length}</span>
        </div>
      </div>
      <div className="grid gap-3">
        {category.resources.map((resource: Resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-0">
      {/* 🔍 增强搜索区域 - 带关键词建议 */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder={t('placeholder', { totalResources })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none bg-white touch-manipulation"
            aria-label={t('ariaLabel')}
            title={t('helpText', { totalResources })}
          />
        </div>
        
        {/* 💡 搜索提示 - 仅在空搜索时显示 */}
        {!searchTerm && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            <span className="hidden sm:inline">{t('suggestions')}</span>
            <span className="sm:hidden">
              {locale === 'zh' ? '试试：疼痛、缓解、营养' : 'Try: pain, relief, nutrition'}
            </span>
          </div>
        )}
      </div>

      {/* 移动优化：分类选择 */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-pink-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center">
          {locale === 'zh' ? '我现在需要什么帮助？' : 'What help do I need now?'}
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {Object.values(categories).map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-200 border-2 touch-manipulation min-h-[60px] sm:min-h-[auto] ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg scale-105`
                  : `${category.bgColor} ${category.borderColor} text-gray-700 hover:shadow-md hover:scale-102`
              }`}
              aria-label={`${category.title} - ${category.resources.length} ${locale === 'zh' ? '个资源' : 'resources'}`}
            >
              <div className="flex items-center">
                <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0 ${
                  activeCategory === category.id
                    ? 'bg-white/20'
                    : `bg-gradient-to-r ${category.color} text-white`
                }`}>
                  {React.cloneElement(category.icon, {
                    className: 'w-4 h-4 sm:w-5 sm:h-5'
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">{category.title}</div>
                  <div className={`text-xs sm:text-sm line-clamp-1 ${
                    activeCategory === category.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.subtitle}
                  </div>
                </div>
                <div className={`text-lg sm:text-xl font-bold flex-shrink-0 ${
                  activeCategory === category.id ? 'text-white' : 'text-gray-600'
                }`}>
                  {category.resources.length}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {searchTerm ? (
        // 显示搜索结果
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg mr-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {locale === 'zh' ? '搜索结果' : 'Search Results'}
              </h2>
              <p className="text-sm text-gray-600">
                {locale === 'zh' 
                  ? `找到 ${filteredResources.length} 个相关资源` 
                  : `Found ${filteredResources.length} relevant resources`}
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource: Resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">
                  {locale === 'zh' ? '未找到相关资源' : 'No resources found'}
                </p>
                <p className="text-sm">
                  {locale === 'zh' 
                    ? '试试搜索：疼痛、缓解、营养、运动、医学、沟通' 
                    : 'Try searching: pain, relief, nutrition, exercise, medical, communication'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 显示分类内容
        <CategorySection category={categories[activeCategory as keyof typeof categories]} />
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600 mb-1">{totalResources}</div>
          <div className="text-xs text-gray-600">{locale === 'zh' ? '总资源' : 'Total Resources'}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-pink-600 mb-1">{Object.keys(categories).length}</div>
          <div className="text-xs text-gray-600">{locale === 'zh' ? '分类' : 'Categories'}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
          <div className="text-xs text-gray-600">{locale === 'zh' ? '循证' : 'Evidence-Based'}</div>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFCenter;
