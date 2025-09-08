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
  keywords?: string;
  description?: string;
}

const SimplePDFCenter: React.FC<SimplePDFCenterProps> = ({ locale }) => {
  const [activeCategory, setActiveCategory] = useState('immediate');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const router = useRouter();
  
  // 🌐 翻译系统
  const t = useTranslations('simplePdfCenter');
  
  // 🚨 紧急关键词检测系统
  const urgentKeywords = [
    "疼", "痛", "现在", "马上", "缓解", "紧急", "急", "快", "立即", "立刻",
    "热敷", "敷热水袋", "暖宝宝", "按摩", "揉肚子", "止痛药",
    "热疗法", "热疗", "温热疗法", "热敷疗法", "热敷治疗",
    "疼痛", "痛经", "经期疼痛", "月经痛", "生理痛"
  ];
  
  // 🔍 6个用户搜索关键词映射系统
  const userSearchKeywords = {
    [t('simplePdfCenter.userSearchKeywords.heatTherapy.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.heatTherapy.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    },
    [t('simplePdfCenter.userSearchKeywords.warmWaterBottle.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.warmWaterBottle.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    },
    [t('simplePdfCenter.userSearchKeywords.warmPatch.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.warmPatch.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    },
    [t('simplePdfCenter.userSearchKeywords.massage.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.massage.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    },
    [t('simplePdfCenter.userSearchKeywords.bellyMassage.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.bellyMassage.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    },
    [t('simplePdfCenter.userSearchKeywords.painkiller.keyword')]: { 
      targetContent: t('simplePdfCenter.userSearchKeywords.painkiller.targetContent'), 
      category: 'immediate', 
      priority: 'high',
      autoRedirect: true
    }
  };

  // 🚨 紧急模式检测函数
  const detectEmergencyMode = (searchTerm: string) => {
    const hasUrgentKeyword = urgentKeywords.some(keyword => 
      searchTerm.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasUrgentKeyword && !isEmergencyMode) {
      setIsEmergencyMode(true);
      setActiveCategory('immediate');
      console.log(t('simplePdfCenter.consoleMessages.emergencyModeActivated'));
    } else if (!hasUrgentKeyword && isEmergencyMode) {
      setIsEmergencyMode(false);
    }
  };

  // 🔍 智能搜索处理函数
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // 检测紧急模式
    detectEmergencyMode(value);
    
    // 检查6个关键词映射
    if (value.trim()) {
      const matchedKeyword = Object.keys(userSearchKeywords).find(keyword => 
        value.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matchedKeyword) {
        const mapping = userSearchKeywords[matchedKeyword as keyof typeof userSearchKeywords];
        if (mapping.autoRedirect) {
          setActiveCategory(mapping.category);
          console.log(`🎯 自动跳转到分类: ${mapping.category} - ${mapping.targetContent}`);
        }
      }
    }
  };
  
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
    'management-1': 'long-term-healthy-lifestyle-guide',           // 长期管理策略
    'management-2': 'comprehensive-menstrual-sleep-quality-guide', // 生活方式优化
    'management-3': 'personal-menstrual-health-profile',           // 健康监测系统
    'management-4': 'menstrual-preventive-care-complete-plan',     // 预防措施实施
    'management-5': 'comprehensive-report-non-medical-factors-menstrual-pain', // 可持续实践方法
    'management-6': 'global-traditional-menstrual-pain-relief',    // 社区支持网络
    'management-7': 'comprehensive-medical-guide-to-dysmenorrhea', // 专业指导服务
    'management-8': 'period-pain-simulator-accuracy-analysis',     // 技术集成应用
    'management-9': 'medication-vs-natural-remedies-menstrual-pain' // 质量持续改进
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
        alert(t('alerts.resourceMappingError'));
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
      console.error(t('simplePdfCenter.consoleMessages.pdfDownloadError'), error);
      alert(t('alerts.downloadFailed'));
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
        alert(t('alerts.linkCopied'));
      }
    } catch (error) {
      console.error('Share error:', error);
      // 最后的降级方案
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(t('alerts.linkCopied'));
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
        <p>${t('share.source')}</p>
    </div>
    <div class="content">
        <p>${t('share.underDevelopment')}</p>
        <p>${t('share.moreInfo')} <a href="https://periodhub.health">periodhub.health</a></p>
    </div>
</body>
</html>`;
  };

  // 🔥 应用类型安全的翻译核心 - 消除硬编码
  const getCategoryTitle = (key: string) => {
    const titles = {
      immediate: t('categories.immediate'),
      preparation: t('categories.preparation'),
      learning: t('categories.learning'),
      management: t('categories.management')
    };
    return titles[key as keyof typeof titles] || key;
  };

  const getCategorySubtitle = (key: string) => {
    const subtitles = {
      immediate: t('subtitles.immediate'),
      preparation: t('subtitles.preparation'),
      learning: t('subtitles.learning'),
      management: t('subtitles.management')
    };
    return subtitles[key as keyof typeof subtitles] || key;
  };

  // 🚀 阶段1：即时缓解类资源数据生成器
  const generateImmediateResources = () => {
    const articles = [
        {
          id: 'immediate-1',
        title: t('immediate.articles.quickRelief.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.quickRelief.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.quickRelief.keywords'),
        description: t('immediate.articles.quickRelief.description')
        },
        {
          id: 'immediate-2',
        title: t('immediate.articles.heatTherapy.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.heatTherapy.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.heatTherapy.keywords'),
        description: t('immediate.articles.heatTherapy.description')
        },
        {
          id: 'immediate-3',
        title: t('immediate.articles.painVsOther.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.painVsOther.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.painVsOther.keywords'),
        description: t('immediate.articles.painVsOther.description')
        },
        {
          id: 'immediate-4',
        title: t('immediate.articles.naturalTherapy.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.naturalTherapy.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.naturalTherapy.keywords'),
        description: t('immediate.articles.naturalTherapy.description')
        },
        {
          id: 'immediate-5',
        title: t('immediate.articles.gingerRelief.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.gingerRelief.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.gingerRelief.keywords'),
        description: t('immediate.articles.gingerRelief.description')
        },
        {
          id: 'immediate-6',
        title: t('immediate.articles.nsaidGuide.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.nsaidGuide.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.nsaidGuide.keywords'),
        description: t('immediate.articles.nsaidGuide.description')
        },
        {
          id: 'immediate-7',
        title: t('immediate.articles.specificManagement.title'),
          type: 'article' as const,
        readTime: t('immediate.articles.specificManagement.readTime'),
          category: 'immediate',
        keywords: t('immediate.articles.specificManagement.keywords'),
        description: t('immediate.articles.specificManagement.description')
      }
    ];

    const pdfs = [
        {
          id: 'immediate-pdf-1',
        title: t('immediate.pdfs.painTrackingForm.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.painTrackingForm.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.painTrackingForm.keywords'),
        description: t('immediate.pdfs.painTrackingForm.description')
        },
        {
          id: 'immediate-pdf-2',
        title: t('immediate.pdfs.campusChecklist.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.campusChecklist.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.campusChecklist.keywords'),
        description: t('immediate.pdfs.campusChecklist.description')
        },
        {
          id: 'immediate-pdf-3',
        title: t('immediate.pdfs.specificPainManagementPdf.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.specificPainManagementPdf.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.specificPainManagementPdf.keywords'),
        description: t('immediate.pdfs.specificPainManagementPdf.description')
        },
        {
          id: 'immediate-pdf-4',
        title: t('immediate.pdfs.emergencyPainReliefCard.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.emergencyPainReliefCard.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.emergencyPainReliefCard.keywords'),
        description: t('immediate.pdfs.emergencyPainReliefCard.description')
        },
        {
          id: 'immediate-pdf-5',
        title: t('immediate.pdfs.fiveMinuteReliefChecklist.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.fiveMinuteReliefChecklist.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.fiveMinuteReliefChecklist.keywords'),
        description: t('immediate.pdfs.fiveMinuteReliefChecklist.description')
        },
        {
          id: 'immediate-pdf-6',
        title: t('immediate.pdfs.heatTherapyGuidePdf.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.heatTherapyGuidePdf.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.heatTherapyGuidePdf.keywords'),
        description: t('immediate.pdfs.heatTherapyGuidePdf.description')
        },
        {
          id: 'immediate-pdf-7',
        title: t('immediate.pdfs.workplaceReliefToolkit.title'),
          type: 'pdf' as const,
        readTime: t('immediate.pdfs.workplaceReliefToolkit.readTime'),
          category: 'immediate',
        keywords: t('immediate.pdfs.workplaceReliefToolkit.keywords'),
        description: t('immediate.pdfs.workplaceReliefToolkit.description')
      }
    ];

    return [...articles, ...pdfs];
  };

  // 🚀 阶段2：计划准备类资源数据生成器
  const generatePreparationResources = () => {
    const articles = [
        {
          id: 'preparation-1',
        title: t('preparation.articles.preventiveCare.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.preventiveCare.readTime'),
        category: 'preparation',
        keywords: t('preparation.articles.preventiveCare.keywords'),
        description: t('preparation.articles.preventiveCare.description')
        },
        {
          id: 'preparation-2',
        title: t('preparation.articles.sleepQuality.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.sleepQuality.readTime'),
        category: 'preparation',
        keywords: t('preparation.articles.sleepQuality.keywords'),
        description: t('preparation.articles.sleepQuality.description')
        },
        {
          id: 'preparation-3',
        title: t('preparation.articles.stressManagement.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.stressManagement.readTime'),
        category: 'preparation',
        keywords: t('preparation.articles.stressManagement.keywords'),
        description: t('preparation.articles.stressManagement.description')
        },
        {
          id: 'preparation-4',
        title: t('preparation.articles.baduanjinExercise.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.baduanjinExercise.readTime'),
          category: 'preparation',
        keywords: t('preparation.articles.baduanjinExercise.keywords'),
        description: t('preparation.articles.baduanjinExercise.description')
        },
        {
          id: 'preparation-5',
        title: t('preparation.articles.antiInflammatoryDiet.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.antiInflammatoryDiet.readTime'),
          category: 'preparation',
        keywords: t('preparation.articles.antiInflammatoryDiet.keywords'),
        description: t('preparation.articles.antiInflammatoryDiet.description')
        },
        {
          id: 'preparation-6',
        title: t('preparation.articles.magnesiumGutHealth.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.magnesiumGutHealth.readTime'),
        category: 'preparation',
        keywords: t('preparation.articles.magnesiumGutHealth.keywords'),
        description: t('preparation.articles.magnesiumGutHealth.description')
        },
        {
          id: 'preparation-7',
        title: t('preparation.articles.periodFriendlyRecipes.title'),
          type: 'article' as const,
        readTime: t('preparation.articles.periodFriendlyRecipes.readTime'),
        category: 'preparation',
        keywords: t('preparation.articles.periodFriendlyRecipes.keywords'),
        description: t('preparation.articles.periodFriendlyRecipes.description')
      }
    ];

    const pdfs = [
        {
          id: 'preparation-pdf-1',
        title: t('preparation.pdfs.healthyHabitsChecklist.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.healthyHabitsChecklist.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.healthyHabitsChecklist.keywords'),
        description: t('preparation.pdfs.healthyHabitsChecklist.description')
        },
        {
          id: 'preparation-pdf-2',
        title: t('preparation.pdfs.nutritionPlan.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.nutritionPlan.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.nutritionPlan.keywords'),
        description: t('preparation.pdfs.nutritionPlan.description')
        },
        {
          id: 'preparation-pdf-3',
        title: t('preparation.pdfs.magnesiumGuide.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.magnesiumGuide.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.magnesiumGuide.keywords'),
        description: t('preparation.pdfs.magnesiumGuide.description')
        },
        {
          id: 'preparation-pdf-4',
        title: t('preparation.pdfs.baduanjinGuide.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.baduanjinGuide.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.baduanjinGuide.keywords'),
        description: t('preparation.pdfs.baduanjinGuide.description')
        },
        {
          id: 'preparation-pdf-5',
        title: t('preparation.pdfs.monthlyPlanner.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.monthlyPlanner.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.monthlyPlanner.keywords'),
        description: t('preparation.pdfs.monthlyPlanner.description')
        },
        {
          id: 'preparation-pdf-6',
        title: t('preparation.pdfs.stressWorkbook.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.stressWorkbook.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.stressWorkbook.keywords'),
        description: t('preparation.pdfs.stressWorkbook.description')
        },
        {
          id: 'preparation-pdf-7',
        title: t('preparation.pdfs.sleepGuide.title'),
          type: 'pdf' as const,
        readTime: t('preparation.pdfs.sleepGuide.readTime'),
          category: 'preparation',
        keywords: t('preparation.pdfs.sleepGuide.keywords'),
        description: t('preparation.pdfs.sleepGuide.description')
      }
    ];

    return [...articles, ...pdfs];
  };

  // 🚀 阶段3：学习理解类资源数据生成器
  const generateLearningResources = () => {
    const articles = [
      {
        id: 'learning-1',
        title: t('learning.articles.lifecycleAnalysis.title'),
        type: 'article' as const,
        readTime: t('learning.articles.lifecycleAnalysis.readTime'),
        category: 'learning',
        keywords: t('learning.articles.lifecycleAnalysis.keywords'),
        description: t('learning.articles.lifecycleAnalysis.description')
      },
      {
        id: 'learning-2',
        title: t('learning.articles.painMechanism.title'),
        type: 'article' as const,
        readTime: t('learning.articles.painMechanism.readTime'),
        category: 'learning',
        keywords: t('learning.articles.painMechanism.keywords'),
        description: t('learning.articles.painMechanism.description')
      },
      {
        id: 'learning-3',
        title: t('learning.articles.hormoneBalance.title'),
        type: 'article' as const,
        readTime: t('learning.articles.hormoneBalance.readTime'),
        category: 'learning',
        keywords: t('learning.articles.hormoneBalance.keywords'),
        description: t('learning.articles.hormoneBalance.description')
      },
      {
        id: 'learning-4',
        title: t('learning.articles.nutritionScience.title'),
        type: 'article' as const,
        readTime: t('learning.articles.nutritionScience.readTime'),
        category: 'learning',
        keywords: t('learning.articles.nutritionScience.keywords'),
        description: t('learning.articles.nutritionScience.description')
      },
      {
        id: 'learning-5',
        title: t('learning.articles.exerciseTherapy.title'),
        type: 'article' as const,
        readTime: t('learning.articles.exerciseTherapy.readTime'),
        category: 'learning',
        keywords: t('learning.articles.exerciseTherapy.keywords'),
        description: t('learning.articles.exerciseTherapy.description')
      },
      {
        id: 'learning-6',
        title: t('learning.articles.psychologicalFactors.title'),
        type: 'article' as const,
        readTime: t('learning.articles.psychologicalFactors.readTime'),
        category: 'learning',
        keywords: t('learning.articles.psychologicalFactors.keywords'),
        description: t('learning.articles.psychologicalFactors.description')
      },
      {
        id: 'learning-7',
        title: t('learning.articles.medicalResearch.title'),
        type: 'article' as const,
        readTime: t('learning.articles.medicalResearch.readTime'),
        category: 'learning',
        keywords: t('learning.articles.medicalResearch.keywords'),
        description: t('learning.articles.medicalResearch.description')
      },
      {
        id: 'learning-8',
        title: t('learning.articles.traditionalMedicine.title'),
        type: 'article' as const,
        readTime: t('learning.articles.traditionalMedicine.readTime'),
        category: 'learning',
        keywords: t('learning.articles.traditionalMedicine.keywords'),
        description: t('learning.articles.traditionalMedicine.description')
      },
      {
        id: 'learning-9',
        title: t('learning.articles.globalPerspectives.title'),
        type: 'article' as const,
        readTime: t('learning.articles.globalPerspectives.readTime'),
        category: 'learning',
        keywords: t('learning.articles.globalPerspectives.keywords'),
        description: t('learning.articles.globalPerspectives.description')
      },
      {
        id: 'learning-10',
        title: t('learning.articles.technologyInnovation.title'),
        type: 'article' as const,
        readTime: t('learning.articles.technologyInnovation.readTime'),
        category: 'learning',
        keywords: t('learning.articles.technologyInnovation.keywords'),
        description: t('learning.articles.technologyInnovation.description')
      },
      {
        id: 'learning-11',
        title: t('learning.articles.communicationSkills.title'),
        type: 'article' as const,
        readTime: t('learning.articles.communicationSkills.readTime'),
        category: 'learning',
        keywords: t('learning.articles.communicationSkills.keywords'),
        description: t('learning.articles.communicationSkills.description')
      },
      {
        id: 'learning-12',
        title: t('learning.articles.selfCareStrategies.title'),
        type: 'article' as const,
        readTime: t('learning.articles.selfCareStrategies.readTime'),
        category: 'learning',
        keywords: t('learning.articles.selfCareStrategies.keywords'),
        description: t('learning.articles.selfCareStrategies.description')
      },
      {
        id: 'learning-13',
        title: t('learning.articles.longTermManagement.title'),
        type: 'article' as const,
        readTime: t('learning.articles.longTermManagement.readTime'),
        category: 'learning',
        keywords: t('learning.articles.longTermManagement.keywords'),
        description: t('learning.articles.longTermManagement.description')
      }
    ];

    const pdfs = [
      {
        id: 'learning-pdf-1',
        title: t('learning.pdfs.naturalTherapyAssessment.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.naturalTherapyAssessment.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.naturalTherapyAssessment.keywords'),
        description: t('learning.pdfs.naturalTherapyAssessment.description')
      },
      {
        id: 'learning-pdf-2',
        title: t('learning.pdfs.hormoneTestingGuide.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.hormoneTestingGuide.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.hormoneTestingGuide.keywords'),
        description: t('learning.pdfs.hormoneTestingGuide.description')
      },
      {
        id: 'learning-pdf-3',
        title: t('learning.pdfs.nutritionalAnalysis.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.nutritionalAnalysis.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.nutritionalAnalysis.keywords'),
        description: t('learning.pdfs.nutritionalAnalysis.description')
      },
      {
        id: 'learning-pdf-4',
        title: t('learning.pdfs.exerciseProgram.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.exerciseProgram.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.exerciseProgram.keywords'),
        description: t('learning.pdfs.exerciseProgram.description')
      },
      {
        id: 'learning-pdf-5',
        title: t('learning.pdfs.psychologicalAssessment.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.psychologicalAssessment.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.psychologicalAssessment.keywords'),
        description: t('learning.pdfs.psychologicalAssessment.description')
      },
      {
        id: 'learning-pdf-6',
        title: t('learning.pdfs.researchSummary.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.researchSummary.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.researchSummary.keywords'),
        description: t('learning.pdfs.researchSummary.description')
      },
      {
        id: 'learning-pdf-7',
        title: t('learning.pdfs.cycleEducationGuide.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.cycleEducationGuide.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.cycleEducationGuide.keywords'),
        description: t('learning.pdfs.cycleEducationGuide.description')
      },
      {
        id: 'learning-pdf-8',
        title: t('learning.pdfs.consultationPreparation.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.consultationPreparation.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.consultationPreparation.keywords'),
        description: t('learning.pdfs.consultationPreparation.description')
      },
      {
        id: 'learning-pdf-9',
        title: t('learning.pdfs.globalHealthReport.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.globalHealthReport.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.globalHealthReport.keywords'),
        description: t('learning.pdfs.globalHealthReport.description')
      },
      {
        id: 'learning-pdf-10',
        title: t('learning.pdfs.technologyGuide.title'),
        type: 'pdf' as const,
        readTime: t('learning.pdfs.technologyGuide.readTime'),
        category: 'learning',
        keywords: t('learning.pdfs.technologyGuide.keywords'),
        description: t('learning.pdfs.technologyGuide.description')
      }
    ];

    return [...articles, ...pdfs];
  };

  // 🚀 阶段4：长期管理类资源数据生成器
  const generateManagementResources = () => {
    const articles = [
      {
        id: 'management-1',
        title: t('management.articles.longTermStrategy.title'),
        type: 'article' as const,
        readTime: t('management.articles.longTermStrategy.readTime'),
        category: 'management',
        keywords: t('management.articles.longTermStrategy.keywords'),
        description: t('management.articles.longTermStrategy.description')
      },
      {
        id: 'management-2',
        title: t('management.articles.lifestyleOptimization.title'),
        type: 'article' as const,
        readTime: t('management.articles.lifestyleOptimization.readTime'),
        category: 'management',
        keywords: t('management.articles.lifestyleOptimization.keywords'),
        description: t('management.articles.lifestyleOptimization.description')
      },
      {
        id: 'management-3',
        title: t('management.articles.healthMonitoring.title'),
        type: 'article' as const,
        readTime: t('management.articles.healthMonitoring.readTime'),
        category: 'management',
        keywords: t('management.articles.healthMonitoring.keywords'),
        description: t('management.articles.healthMonitoring.description')
      },
      {
        id: 'management-4',
        title: t('management.articles.preventiveMeasures.title'),
        type: 'article' as const,
        readTime: t('management.articles.preventiveMeasures.readTime'),
        category: 'management',
        keywords: t('management.articles.preventiveMeasures.keywords'),
        description: t('management.articles.preventiveMeasures.description')
      },
      {
        id: 'management-5',
        title: t('management.articles.sustainablePractices.title'),
        type: 'article' as const,
        readTime: t('management.articles.sustainablePractices.readTime'),
        category: 'management',
        keywords: t('management.articles.sustainablePractices.keywords'),
        description: t('management.articles.sustainablePractices.description')
      },
      {
        id: 'management-6',
        title: t('management.articles.communitySupport.title'),
        type: 'article' as const,
        readTime: t('management.articles.communitySupport.readTime'),
        category: 'management',
        keywords: t('management.articles.communitySupport.keywords'),
        description: t('management.articles.communitySupport.description')
      },
      {
        id: 'management-7',
        title: t('management.articles.professionalGuidance.title'),
        type: 'article' as const,
        readTime: t('management.articles.professionalGuidance.readTime'),
        category: 'management',
        keywords: t('management.articles.professionalGuidance.keywords'),
        description: t('management.articles.professionalGuidance.description')
      },
      {
        id: 'management-8',
        title: t('management.articles.technologyIntegration.title'),
        type: 'article' as const,
        readTime: t('management.articles.technologyIntegration.readTime'),
        category: 'management',
        keywords: t('management.articles.technologyIntegration.keywords'),
        description: t('management.articles.technologyIntegration.description')
      },
      {
        id: 'management-9',
        title: t('management.articles.qualityImprovement.title'),
        type: 'article' as const,
        readTime: t('management.articles.qualityImprovement.readTime'),
        category: 'management',
        keywords: t('management.articles.qualityImprovement.keywords'),
        description: t('management.articles.qualityImprovement.description')
      }
    ];

    const pdfs = [
      {
        id: 'management-pdf-1',
        title: t('management.pdfs.managementPlan.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.managementPlan.readTime'),
        category: 'management',
        keywords: t('management.pdfs.managementPlan.keywords'),
        description: t('management.pdfs.managementPlan.description')
      },
      {
        id: 'management-pdf-2',
        title: t('management.pdfs.lifestyleGuide.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.lifestyleGuide.readTime'),
        category: 'management',
        keywords: t('management.pdfs.lifestyleGuide.keywords'),
        description: t('management.pdfs.lifestyleGuide.description')
      },
      {
        id: 'management-pdf-3',
        title: t('management.pdfs.monitoringTools.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.monitoringTools.readTime'),
        category: 'management',
        keywords: t('management.pdfs.monitoringTools.keywords'),
        description: t('management.pdfs.monitoringTools.description')
      },
      {
        id: 'management-pdf-4',
        title: t('management.pdfs.preventionChecklist.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.preventionChecklist.readTime'),
        category: 'management',
        keywords: t('management.pdfs.preventionChecklist.keywords'),
        description: t('management.pdfs.preventionChecklist.description')
      },
      {
        id: 'management-pdf-5',
        title: t('management.pdfs.sustainabilityGuide.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.sustainabilityGuide.readTime'),
        category: 'management',
        keywords: t('management.pdfs.sustainabilityGuide.keywords'),
        description: t('management.pdfs.sustainabilityGuide.description')
      },
      {
        id: 'management-pdf-6',
        title: t('management.pdfs.communityResources.title'),
        type: 'pdf' as const,
        readTime: t('management.pdfs.communityResources.readTime'),
        category: 'management',
        keywords: t('management.pdfs.communityResources.keywords'),
        description: t('management.pdfs.communityResources.description')
      }
    ];

    return [...articles, ...pdfs];
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
      resources: generateImmediateResources()
    },
    preparation: {
      id: 'preparation',
      title: getCategoryTitle('preparation'),
      subtitle: getCategorySubtitle('preparation'),
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      resources: generatePreparationResources()
    },
    learning: {
      id: 'learning',
      title: getCategoryTitle('learning'),
      subtitle: getCategorySubtitle('learning'),
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      resources: generateLearningResources()
    },
    management: {
      id: 'management',
      title: getCategoryTitle('management'),
      subtitle: getCategorySubtitle('management'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      resources: generateManagementResources()
    }
  };

  // 🔍 增强的搜索过滤逻辑 - 支持紧急关键词和6个用户关键词
  const searchResources = (searchTerm: string): Resource[] => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    const allResources: Resource[] = Object.values(categories).flatMap(cat => cat.resources as Resource[]);
    
    // 英文关键词映射到中文关键词
    const englishToChineseKeywords = {
      'hot compress': t('simplePdfCenter.englishToChineseKeywords.hotCompress'),
      'warm bag': t('simplePdfCenter.englishToChineseKeywords.warmBag'),
      'warm baby': t('simplePdfCenter.englishToChineseKeywords.warmBaby'),
      'massage': t('simplePdfCenter.englishToChineseKeywords.massage'),
      'belly massage': t('simplePdfCenter.englishToChineseKeywords.bellyMassage'),
      'painkillers': t('simplePdfCenter.englishToChineseKeywords.painkillers')
    };
    
    // 获取对应的中文关键词（如果搜索的是英文）
    const chineseKeyword = englishToChineseKeywords[term as keyof typeof englishToChineseKeywords];
    
    return allResources.filter((resource: Resource) => {
      // 搜索标题
      const titleMatch = resource.title.toLowerCase().includes(term);
      
      // 搜索关键词 - 修复：检查关键词字符串中是否包含搜索词
      const keywordMatch = resource.keywords?.toLowerCase().includes(term) || false;
      
      // 搜索描述
      const descriptionMatch = resource.description?.toLowerCase().includes(term) || false;
      
      // 紧急关键词匹配 - 修复：直接匹配搜索词
      const urgentMatch = urgentKeywords.some(keyword => 
        term.includes(keyword.toLowerCase()) && (
          resource.title.toLowerCase().includes(keyword.toLowerCase()) ||
          resource.keywords?.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // 用户搜索关键词匹配 - 修复：支持中英文关键词映射
      const userKeywordMatch = Object.keys(userSearchKeywords).some(keyword => {
        // 检查搜索词是否包含中文关键词
        const chineseMatch = term.includes(keyword.toLowerCase()) && (
          resource.title.toLowerCase().includes(keyword.toLowerCase()) ||
          resource.keywords?.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // 检查搜索词是否包含对应的英文关键词
        const englishMatch = chineseKeyword && keyword === chineseKeyword && (
          resource.title.toLowerCase().includes(term) ||
          resource.keywords?.toLowerCase().includes(term)
        );
        
        return chineseMatch || englishMatch;
      });
      
      return titleMatch || keywordMatch || descriptionMatch || urgentMatch || userKeywordMatch;
    });
  };

  // 🎨 Phase 1: 移动优先的ResourceCard组件
  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const isLoading = (action: string) => loadingStates[`${resource.id}${action ? `-${action}` : ''}`] || false;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 leading-tight flex-1">
              {resource.title}
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {resource.readTime}
            </span>
          </div>
          
          {resource.description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {resource.description}
            </p>
          )}
          
          {resource.keywords && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {resource.keywords}
              </span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
            {resource.type === 'article' ? (
              <button
                onClick={() => handleArticleRead(resource.id)}
                disabled={isLoading('read')}
                className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation flex-1 sm:flex-none"
                aria-label={t('simplePdfCenter.ariaLabels.readArticle')}
              >
                {isLoading('read') ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{t('ui.buttons.read')}</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => handlePDFPreview(resource.id)}
                disabled={isLoading('preview')}
                className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation flex-1 sm:flex-none"
                aria-label={t('simplePdfCenter.ariaLabels.previewPdf')}
              >
                {isLoading('preview') ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{t('ui.buttons.preview')}</span>
                )}
              </button>
            )}
            
            <button
              onClick={() => handleShare(resource.id, resource.title, resource.type)}
              className="flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors min-h-[44px] touch-manipulation flex-1 sm:flex-none"
              aria-label={t('simplePdfCenter.ariaLabels.shareResource')}
            >
              <span className="hidden sm:inline">{t('ui.buttons.share')}</span>
              <span className="sm:hidden">分享</span>
            </button>
            
            {resource.type === 'pdf' && (
              <button
                onClick={() => handlePDFDownload(resource.id, resource.title)}
                disabled={isLoading('download')}
                className="flex items-center justify-center space-x-1 px-2 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation flex-1 sm:flex-none"
                aria-label={t('simplePdfCenter.ariaLabels.downloadPdf')}
              >
                {isLoading('download') ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">{t('ui.buttons.download')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ category }: { category: any }) => (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center mb-4 px-2">
        <div className={`p-1.5 sm:p-2 rounded-lg ${category.bgColor} ${category.borderColor} border`}>
          <div className={`text-white ${category.color.includes('from-') ? 'bg-gradient-to-r ' + category.color : category.color}`}>
            {category.icon}
          </div>
        </div>
        <div className="ml-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{category.title}</h2>
          <p className="text-xs sm:text-sm text-gray-600">{category.subtitle}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {category.resources.map((resource: Resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* 页面标题 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('description')}
          </p>
        </div>

        {/* 紧急模式提示 */}
        {isEmergencyMode && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">
                {t('simplePdfCenter.emergencyMode.message')}
              </p>
            </div>
          </div>
        )}

        {/* 搜索框 - 移动端优化 */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto px-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder={t('ui.placeholder', { totalResources })}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg touch-manipulation ${
                isEmergencyMode 
                  ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                  : 'border-gray-300'
              }`}
              aria-label={t('ui.ariaLabel')}
            />
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 px-4">
            <span className="hidden sm:inline">{t('ui.searchHints.desktop')}</span>
            <span className="sm:hidden">{t('ui.searchHints.mobile')}</span>
          </p>
        </div>

        {/* 我现在需要什么帮助？板块 - 移动端优化 */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 px-2">
              {t('helpSection.title')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Object.values(categories).map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 min-h-[120px] sm:min-h-[140px] touch-manipulation ${
                    activeCategory === category.id
                      ? `${category.borderColor} border-opacity-100 bg-gradient-to-br ${category.bgColor} text-white`
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2 h-full justify-between">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${category.bgColor} ${category.borderColor} border`}>
                      <div className={`text-white ${category.color.includes('from-') ? 'bg-gradient-to-r ' + category.color : category.color}`}>
                        {category.icon}
                      </div>
                    </div>
                    <div className="text-center flex-1 flex flex-col justify-center">
                      <h3 className="font-semibold text-xs sm:text-sm leading-tight">{category.title}</h3>
                      <p className="text-xs opacity-80 mt-1 hidden sm:block">{category.subtitle}</p>
                    </div>
                    <div className="text-sm sm:text-lg font-bold">{category.resources.length}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">{t('helpSection.needMoreHelp')}</p>
              <button
                onClick={() => router.push(`/${locale}/interactive-tools`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('helpSection.exploreTools')}
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 - 移动端优化 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{totalResources}</div>
            <div className="text-xs sm:text-sm text-gray-600 leading-tight">{t('ui.stats.totalResources')}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">4</div>
            <div className="text-xs sm:text-sm text-gray-600 leading-tight">{t('ui.stats.categories')}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">100%</div>
            <div className="text-xs sm:text-sm text-gray-600 leading-tight">{t('ui.stats.evidenceBased')}</div>
          </div>
        </div>

        {/* 搜索结果或分类展示 - 移动端优化 */}
        {searchTerm ? (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 px-2">
              {t('ui.searchResults.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {searchResources(searchTerm).map((resource: Resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            {searchResources(searchTerm).length === 0 && (
              <div className="text-center py-6 sm:py-8 px-4">
                <p className="text-gray-500 mb-2 text-sm sm:text-base">{t('ui.searchResults.noResults')}</p>
                <p className="text-xs sm:text-sm text-gray-400">{t('ui.searchResults.suggestions')}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {Object.values(categories).map((category: any) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePDFCenter;
