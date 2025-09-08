'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Clock, AlertCircle, Brain, TrendingUp, Download, ExternalLink, Star, Zap, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Locale } from '@/i18n';
import { PDF_RESOURCES, getPDFResourceById } from '@/config/pdfResources';

interface OptimizedMobilePDFCenterProps {
  locale: Locale;
}

interface Resource {
  type: 'article' | 'pdf';
  title: string;
  readTime?: string;
  icon?: string;
  size?: string;
  priority: 'highest' | 'high' | 'medium' | 'low';
  tags: string[];
  id?: string;
  slug?: string;
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  priority: string;
  loadPriority: number;
  resources: Resource[];
}

const OptimizedMobilePDFCenter: React.FC<OptimizedMobilePDFCenterProps> = ({ locale }) => {
  const [activeCategory, setActiveCategory] = useState('immediate');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCategories, setLoadedCategories] = useState(['immediate']); // 渐进式加载
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // 获取翻译函数 - 使用正确的翻译键
  const t = useTranslations('simplePdfCenter');
  const articlesT = useTranslations('articlesPage.categories');

  // 类别标题翻译 - 使用正确的翻译键
  const getCategoryTitle = (key: string) => {
    const titles = {
      immediate: t('categories.immediate'),
      preparation: t('categories.preparation'),
      learning: t('categories.learning'),
      longterm: t('categories.management')
    };
    return titles[key as keyof typeof titles] || key;
  };

  const getCategorySubtitle = (key: string) => {
    const subtitles = {
      immediate: t('subtitles.immediate'),
      preparation: t('subtitles.preparation'),
      learning: t('subtitles.learning'),
      longterm: t('subtitles.management')
    };
    return subtitles[key as keyof typeof subtitles] || key;
  };

  // 从统一配置获取PDF资源并转换为组件格式
  const convertPDFToResource = (pdfResource: any): Resource => {
    // 根据PDF ID映射到正确的翻译键路径
    const getTranslationKey = (id: string) => {
      const keyMap: Record<string, string> = {
        'pain-tracking-form': 'immediate.pdfs.painTrackingForm.title',
        'campus-emergency-checklist': 'immediate.pdfs.campusChecklist.title',
        'specific-menstrual-pain-management-guide': 'immediate.pdfs.specificPainManagementPdf.title',
        'healthy-habits-checklist': 'preparation.pdfs.healthyHabitsChecklist.title',
        'menstrual-cycle-nutrition-plan': 'preparation.pdfs.nutritionPlan.title',
        'magnesium-gut-health-guide': 'preparation.pdfs.magnesiumGuide.title',
        'zhan-zhuang-baduanjin-illustrated-guide': 'preparation.pdfs.baduanjinGuide.title',
        'natural-therapy-assessment': 'learning.pdfs.naturalTherapyAssessment.title',
        'hormone-testing-guide': 'learning.pdfs.hormoneTestingGuide.title',
        'nutritional-analysis': 'learning.pdfs.nutritionalAnalysis.title',
        'exercise-program': 'learning.pdfs.exerciseProgram.title',
        'reading-list-pdf': 'management.pdfs.readingListPdf.title',
        'herbal-tea-guide': 'management.pdfs.herbalTeaGuide.title',
        'personal-profile-template': 'management.pdfs.personalProfileTemplate.title',
        'anti-inflammatory-guide': 'management.pdfs.antiInflammatoryGuide.title'
      };
      return keyMap[id] || pdfResource.titleKey;
    };

    // 根据PDF类型设置不同的标签
    const getPDFTags = (id: string): string[] => {
      const tagMap: Record<string, string[]> = {
        // 热敷相关
        'pain-tracking-form': [t('tags.heatTherapy'), t('tags.heatTherapyMethod'), t('tags.heatTherapyTreatment'), t('tags.warmWaterBottle'), t('tags.warmPatch'), t('tags.pain'), t('tags.relief')],
        'campus-emergency-checklist': [t('tags.heatTherapy'), t('tags.heatTherapyMethod'), t('tags.emergency'), t('tags.pain'), t('tags.relief')],
        'specific-menstrual-pain-management-guide': [t('tags.heatTherapy'), t('tags.heatTherapyMethod'), t('tags.management'), t('tags.relief')],
        
        // 按摩相关
        'natural-therapy-assessment': [t('tags.massage'), t('tags.acupressure'), t('tags.bellyRub'), t('tags.abdominalMassage'), t('tags.menstrualMassage'), t('tags.painMassage')],
        'hormone-testing-guide': [t('tags.massage'), t('tags.acupressure'), t('tags.medical'), t('tags.examination')],
        'nutritional-analysis': [t('tags.massage'), t('tags.acupressure'), t('tags.nutrition'), t('tags.health')],
        'exercise-program': [t('tags.massage'), t('tags.acupressure'), t('tags.exercise'), t('tags.exercise')],
        
        // 止痛药相关
        'reading-list-pdf': [t('tags.painkiller'), t('tags.nsaid'), t('tags.medication'), t('tags.learning'), t('tags.management'), t('tags.communication')],
        'herbal-tea-guide': [t('tags.painkiller'), t('tags.medication'), t('tags.medication'), t('tags.medication'), t('tags.communication')],
        'personal-profile-template': [t('tags.painkiller'), t('tags.medication'), t('tags.management'), t('tags.record'), t('tags.communication')],
        'anti-inflammatory-guide': [t('tags.painkiller'), t('tags.nsaid'), t('tags.medication'), t('tags.medication'), t('tags.communication')],
        
        // 其他
        'healthy-habits-checklist': [t('tags.nutrition'), t('tags.health'), t('tags.habit'), t('tags.preparation')],
        'menstrual-cycle-nutrition-plan': [t('tags.nutrition'), t('tags.diet'), t('tags.plan'), t('tags.preparation')],
        'magnesium-gut-health-guide': [t('tags.nutrition'), t('tags.health'), t('tags.learning')],
        'zhan-zhuang-baduanjin-illustrated-guide': [t('tags.exercise'), t('tags.exercise'), t('tags.baduanjin'), t('tags.preparation')]
      };
      
      return tagMap[id] || [t('tags.pain'), t('tags.relief')];
    };

    return {
      type: 'pdf' as const,
      title: t(getTranslationKey(pdfResource.id)), // 使用正确的翻译键路径
      icon: pdfResource.icon,
      size: `${pdfResource.fileSize}KB`,
      priority: pdfResource.featured ? 'highest' : 'high',
      tags: getPDFTags(pdfResource.id), // 使用动态标签
      id: pdfResource.id
    };
  };

  // 创建文章资源的翻译函数 - 使用正确的翻译键
  const createArticleResource = (
    categoryKey: string,
    articleKey: string,
    readTimeMinutes: number,
    priority: 'highest' | 'high' | 'medium' | 'low',
    tags: string[],
    slug: string
  ): Resource => ({
    type: 'article' as const,
    title: articlesT(`${categoryKey}.articles.${articleKey}`),
    readTime: locale === 'zh' ? `${readTimeMinutes}分钟` : `${readTimeMinutes} min read`,
    priority,
    tags,
    id: slug,
    slug
  });

  // 优化后的内容分类 - 基于统一配置的PDF资源
  const optimizedCategories: Record<string, Category> = {
    immediate: {
      id: 'immediate',
      title: getCategoryTitle('immediate'),
      subtitle: getCategorySubtitle('immediate'),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      priority: 'critical',
      loadPriority: 1,
      resources: [
        // 文章资源 - 使用正确的翻译键
        createArticleResource('immediateRelief', 'fiveMinuteRelief', 5, 'highest', [t('tags.pain'), t('tags.relief'), t('tags.quick')], '5-minute-period-pain-relief'),
        createArticleResource('understandingEducation', 'painDifferential', 25, 'highest', [t('tags.examination'), t('tags.health'), t('tags.diagnosis')], 'menstrual-pain-vs-other-abdominal-pain-guide'),
        createArticleResource('immediateRelief', 'heatTherapy', 8, 'high', [t('tags.heatTherapy'), t('tags.method'), t('tags.science')], 'heat-therapy-complete-guide'),
        createArticleResource('naturalTherapies', 'physicalTherapy', 12, 'high', [t('tags.pain'), t('tags.health'), t('tags.relief')], 'menstrual-back-pain-comprehensive-care-guide'),
        createArticleResource('naturalTherapies', 'traditionalMethods', 12, 'high', [t('tags.medication'), t('tags.medication'), t('tags.relief')], 'ginger-menstrual-pain-relief-guide'),
        // PDF资源 - 从统一配置获取
        ...PDF_RESOURCES.filter(pdf =>
          ['pain-tracking-form', 'campus-emergency-checklist', 'specific-menstrual-pain-management-guide'].includes(pdf.id)
        ).map(convertPDFToResource)
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
      priority: 'important',
      loadPriority: 2,
      resources: [
        // 文章资源 - 使用正确的翻译键
        createArticleResource('nutritionHealth', 'preventiveCare', 22, 'highest', [t('tags.prevention'), t('tags.cycle'), t('tags.evidenceBased')], 'menstrual-preventive-care-complete-plan'),
        createArticleResource('nutritionHealth', 'sleepQuality', 20, 'highest', [t('tags.health'), t('tags.plan'), t('tags.health')], 'comprehensive-menstrual-sleep-quality-guide'),
        createArticleResource('nutritionHealth', 'stressManagement', 22, 'highest', [t('tags.management'), t('tags.health'), t('tags.management')], 'menstrual-stress-management-complete-guide'),
        createArticleResource('naturalTherapies', 'zhanZhuang', 18, 'high', [t('tags.exercise'), t('tags.baduanjin'), t('tags.relief')], 'zhan-zhuang-baduanjin-for-menstrual-pain-relief'),
        // PDF资源 - 从统一配置获取
        ...PDF_RESOURCES.filter(pdf =>
          ['healthy-habits-checklist', 'menstrual-cycle-nutrition-plan', 'magnesium-gut-health-guide', 'zhan-zhuang-baduanjin-illustrated-guide'].includes(pdf.id)
        ).map(convertPDFToResource)
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
      priority: 'normal',
      loadPriority: 3,
      resources: [
        // 文章资源 - 使用翻译键
        createArticleResource('understandingEducation', 'lifecycleAnalysis', 24, 'highest', [t('tags.cycle'), t('tags.cycle'), t('tags.management')], 'womens-lifecycle-menstrual-pain-analysis'),
        createArticleResource('understandingEducation', 'researchProgress2024', 18, 'highest', [t('tags.evidenceBased'), t('tags.research'), t('tags.medication'), t('tags.painkiller'), t('tags.nsaid')], 'menstrual-pain-research-progress-2024'),
        createArticleResource('medicalGuidance', 'nsaidProfessionalGuide', 25, 'highest', [t('tags.nsaid'), t('tags.painkiller'), t('tags.medication'), t('tags.medication'), t('tags.medication')], 'nsaid-menstrual-pain-professional-guide'),
        {
          type: 'article' as const,
          title: '痛经安全用药全指南：布洛芬/萘普生等NSAIDs使用规范',
          readTime: locale === 'zh' ? '20分钟' : '20 min read',
          priority: 'highest' as const,
          tags: [t('tags.nsaid'), t('tags.painkiller'), t('tags.ibuprofen'), t('tags.medication'), t('tags.medication'), t('tags.medication')],
          id: 'medication-guide',
          slug: 'downloads/medication-guide'
        },
        createArticleResource('understandingEducation', 'painDifferential', 25, 'highest', [t('tags.diagnosis'), t('tags.diagnosis'), t('tags.emergency')], 'menstrual-pain-vs-other-abdominal-pain-guide'),

        createArticleResource('understandingEducation', 'understandingCycle', 25, 'high', [t('tags.cycle'), t('tags.education'), t('tags.knowledge')], 'understanding-your-cycle'),

        createArticleResource('understandingEducation', 'insuranceCoverage', 25, 'high', [t('tags.medical'), t('tags.medical'), t('tags.medical'), t('tags.communication')], 'us-menstrual-pain-insurance-coverage-guide'),

        createArticleResource('medicalGuidance', 'whenToSeeDoctor', 10, 'highest', [t('tags.seeDoctor'), t('tags.emergency'), t('tags.health'), t('tags.communication')], 'when-to-see-doctor-period-pain'),
        createArticleResource('medicalGuidance', 'medicalCare', 15, 'high', [t('tags.medical'), t('tags.health'), t('tags.guide'), t('tags.communication')], 'when-to-seek-medical-care-comprehensive-guide'),
        // PDF资源 - 从统一配置获取
        ...PDF_RESOURCES.filter(pdf =>
          ['natural-therapy-assessment', 'hormone-testing-guide', 'nutritional-analysis', 'exercise-program'].includes(pdf.id)
        ).map(convertPDFToResource)
      ]
    },
    management: {
      id: 'management',
      title: getCategoryTitle('longterm'),
      subtitle: getCategorySubtitle('longterm'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      priority: 'low',
      loadPriority: 4,
      resources: [
        // 长期管理文章 - 使用翻译键
        createArticleResource('specializedGuides', 'readingList', 35, 'medium', ['综合', '因素', '影响'], 'recommended-reading-list'),
        createArticleResource('naturalTherapies', 'herbalTea', 15, 'low', ['草药', '茶', '配方'], 'herbal-tea-menstrual-pain-relief'),
        createArticleResource('naturalTherapies', 'traditionalMethods', 25, 'low', ['全球', '传统', '现代'], 'global-traditional-menstrual-pain-relief'),
        createArticleResource('understandingEducation', 'understandingCycle', 20, 'medium', ['档案', '记录', '管理'], 'personal-menstrual-health-profile')
      ]
    }
  };

  // 智能搜索算法
  const semanticSearch = useMemo(() => {
    // 直接使用翻译文件中的数组，而不是通过 t() 函数
    const urgentKeywords = [
      // 6个核心关键词及其同义词
      "热敷", "敷热水袋", "暖宝宝", "按摩", "揉肚子", "止痛药",
      // 专业术语映射
      "热疗法", "热疗", "温热疗法", "热敷疗法", "热敷治疗",
      // 按摩相关
      "穴位按压", "肌肉放松", "腹部按摩", "经期按摩", "疼痛按摩",
      // 药物相关
      "NSAID", "非甾体抗炎药", "布洛芬", "对乙酰氨基酚", "止痛药物",
      // 其他紧急相关词汇
      "疼", "痛", "现在", "马上", "缓解", "快速", "立即", "紧急", "急", "疼得厉害"
    ];
    
    const preparationKeywords = [
      "营养", "饮食", "运动", "习惯", "准备", "预防", "计划", "提前", "养生", "健康", "锻炼", "瑜伽", "八段锦",
      // 热敷相关准备
      "热敷准备", "热敷工具", "热敷用品", "暖宝宝准备",
      // 按摩相关准备
      "按摩准备", "按摩工具", "按摩技巧", "按摩学习"
    ];
    
    const learningKeywords = [
      "医生", "医学", "就医", "周期", "了解", "指南", "教育", "知识", "学习", "研究", "科学", "循证", "诊断", "检查",
      // 热敷学习
      "热敷方法", "热敷技巧", "热敷原理", "热敷学习",
      // 按摩学习
      "按摩方法", "按摩技巧", "按摩原理", "按摩学习",
      // 药物学习
      "药物知识", "用药指南", "药物对比", "用药学习"
    ];
    
    const managementKeywords = [
      "长期", "管理", "生活", "档案", "记录", "持续", "跟踪", "监测", "分析", "报告", "模板",
      // 热敷管理
      "热敷管理", "热敷记录", "热敷计划", "热敷跟踪",
      // 按摩管理
      "按摩管理", "按摩记录", "按摩计划", "按摩跟踪",
      // 药物管理
      "用药管理", "用药记录", "用药计划", "用药跟踪"
    ];

    if (!searchTerm) return null;

    const term = searchTerm.toLowerCase();

    if (urgentKeywords.some(keyword => term.includes(keyword))) {
      return { category: 'immediate', boost: true };
    } else if (preparationKeywords.some(keyword => term.includes(keyword))) {
      return { category: 'preparation', boost: false };
    } else if (learningKeywords.some(keyword => term.includes(keyword))) {
      return { category: 'learning', boost: false };
    } else if (managementKeywords.some(keyword => term.includes(keyword))) {
      return { category: 'management', boost: false };
    }

    return null;
  }, [searchTerm]);

  // 内容搜索逻辑 - 搜索资源标题、标签等
  // 智能内容搜索功能 - 支持模糊匹配和语义理解
  const contentSearch = useMemo(() => {
    if (!searchTerm) return null;

    const term = searchTerm.toLowerCase();
    const allResources = Object.values(optimizedCategories).flatMap(category => category.resources);

    // 定义同义词映射表
    const synonymMap: Record<string, string[]> = {
      [t('tags.heatTherapy')]: [t('tags.heatTherapyMethod'), t('tags.heatTherapyTreatment'), t('tags.heatTherapyTreatment2'), t('tags.warmWaterBottle'), t('tags.warmPatch')],
      [t('tags.massage')]: [t('tags.acupressure'), t('tags.muscleRelaxation'), t('tags.abdominalMassage'), t('tags.menstrualMassage'), t('tags.painMassage'), t('tags.bellyRub')],
      [t('tags.painkiller')]: [t('tags.nsaid'), t('tags.antiInflammatoryDrug'), t('tags.ibuprofen'), t('tags.acetaminophen'), t('tags.painMedication'), t('tags.medication')],
      [t('tags.warmPatch')]: [t('tags.heatTherapy'), t('tags.heatTherapyMethod'), t('tags.heatTherapyTreatment')],
      [t('tags.bellyRub')]: [t('tags.massage'), t('tags.abdominalMassage'), t('tags.menstrualMassage'), t('tags.painMassage')],
      [t('tags.warmWaterBottle')]: [t('tags.heatTherapy'), t('tags.heatTherapyMethod'), t('tags.heatTherapyTreatment')]
    };

    // 获取搜索词的所有同义词
    const getSynonyms = (searchTerm: string): string[] => {
      const synonyms: string[] = [searchTerm];
      for (const [key, values] of Object.entries(synonymMap)) {
        if (key.includes(searchTerm) || searchTerm.includes(key)) {
          synonyms.push(...values);
        }
        if (values.some(v => v.includes(searchTerm) || searchTerm.includes(v))) {
          synonyms.push(key, ...values);
        }
      }
      return [...new Set(synonyms)]; // 去重
    };

    const synonyms = getSynonyms(term);
    
    // 计算资源相关性评分 - 修复评分算法
    const calculateRelevanceScore = (resource: any): number => {
      const searchableText = [
        resource.title,
        resource.tags.join(' '),
        resource.type
      ].join(' ').toLowerCase();

      let score = 0;
      let maxPossibleScore = 0;
      
      // 精确匹配得分最高 (100分)
      if (searchableText.includes(term)) {
        score += 100;
        maxPossibleScore = 100;
      } else {
        // 同义词匹配 (80分)
        let synonymMatch = false;
        synonyms.forEach(synonym => {
          if (searchableText.includes(synonym.toLowerCase())) {
            score += 80;
            synonymMatch = true;
          }
        });
        
        if (synonymMatch) {
          maxPossibleScore = 80;
        } else {
          // 部分匹配 (30分)
          if (term.length >= 2) {
            for (let i = 0; i <= term.length - 2; i++) {
              const substring = term.substring(i, i + 2);
              if (searchableText.includes(substring)) {
                score += 30;
                maxPossibleScore = 30;
                break;
              }
            }
          }
          
          // 标签匹配 (20分)
          resource.tags.forEach((tag: string) => {
            const tagLower = tag.toLowerCase();
            if (tagLower.includes(term) || term.includes(tagLower)) {
              score += 20;
              if (maxPossibleScore < 20) maxPossibleScore = 20;
            }
          });
        }
      }
      
      // 确保分数不超过100
      return Math.min(score, 100);
    };

    // 过滤并评分
    const scoredResources = allResources
      .map(resource => ({
        ...resource,
        relevanceScore: calculateRelevanceScore(resource)
      }))
      .filter(resource => resource.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredResources;
  }, [searchTerm, optimizedCategories]);

  // 渐进式加载
  useEffect(() => {
    if (activeCategory && !loadedCategories.includes(activeCategory)) {
      setLoadedCategories(prev => [...prev, activeCategory]);
    }
  }, [activeCategory, loadedCategories]);

  // 紧急模式检测
  useEffect(() => {
    const urgentTerms = [
      t('tags.hurt'), t('tags.ache'), t('tags.now'), t('tags.immediately'), t('tags.urgent'), 
      t('tags.heatTherapy'), t('tags.massage'), t('tags.emergency'), t('tags.severe')
    ];
    const isUrgent = urgentTerms.some(term => searchTerm.includes(term));
    setIsEmergencyMode(isUrgent);
    
    if (isUrgent && activeCategory !== 'immediate') {
      setActiveCategory('immediate');
    }
  }, [searchTerm, activeCategory]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'highest': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      highest: {
        text: t('labels.topPick'),
        color: 'bg-red-500 text-white'
      },
      high: {
        text: t('labels.recommended'),
        color: 'bg-orange-500 text-white'
      },
      medium: {
        text: t('labels.important'),
        color: 'bg-yellow-500 text-white'
      },
      low: {
        text: t('labels.optional'),
        color: 'bg-gray-500 text-white'
      }
    };
    return badges[priority as keyof typeof badges] || badges.low;
  };

  // 快速筛选标签 - 使用正确的翻译键
  const quickFilters = [
    { key: '疼痛', label: t('keywords.pain'), category: 'immediate' },
    { key: '缓解', label: t('keywords.relief'), category: 'immediate' },
    { key: '营养', label: t('keywords.nutrition'), category: 'preparation' },
    { key: '运动', label: t('keywords.exercise'), category: 'preparation' },
    { key: '医学', label: t('keywords.medical'), category: 'learning' },
    { key: '沟通', label: t('keywords.communication'), category: 'learning' }
  ];

  // PDF文件名获取 - 从统一配置获取
  const getPDFFilename = (resourceId: string): string => {
    // 直接使用resourceId，因为PDF资源已经使用了配置文件中的正确ID
    const resource = getPDFResourceById(resourceId);
    return resource?.filename || `${resourceId}.pdf`;
  };

  // 处理HTML格式PDF下载
  const handlePDFDownload = (resourceId: string) => {
    // 下载HTML格式的PDF内容，提供更好的屏幕阅读体验
    const htmlFilename = `${resourceId}.html`;
    const url = `/pdf-files/${htmlFilename}`;

    console.log(`下载HTML格式PDF: ${resourceId} -> ${htmlFilename}`);

    // 创建临时链接进行下载
    const link = document.createElement('a');
    link.href = url;
    link.download = htmlFilename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理分享功能
  const handleShare = async (resource: Resource) => {
    const shareText = locale === 'zh'
      ? `推荐这个有用的经期健康资源：${resource.title}`
      : `Check out this helpful menstrual health resource: ${resource.title}`;

    const shareData = {
      title: `Period Hub - ${resource.title}`,
      text: shareText,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
      // 降级到复制链接
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      } catch (clipboardError) {
        console.error('复制失败:', clipboardError);
      }
    }
  };

  // 处理预览功能
  const handlePreview = (resourceId: string) => {
    // 确保使用正确的资源ID（不需要映射，因为PDF资源已经使用了正确的ID）
    console.log(`预览PDF: ${resourceId}`);
    window.location.href = `/${locale}/downloads/preview/${resourceId}`;
  };

  // 资源卡片组件
  const ResourceCard = ({ resource, categoryColor }: { resource: Resource; categoryColor: string }) => {
    const badge = getPriorityBadge(resource.priority);

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.text}
          </div>
          {resource.type === 'article' && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {resource.readTime}
            </div>
          )}
          {resource.type === 'pdf' && (
            <div className="flex items-center text-xs text-gray-500">
              <Download className="w-3 h-3 mr-1" />
              {resource.size}
            </div>
          )}
        </div>

        <div className="flex items-start mb-3">
          {resource.type === 'pdf' && (
            <div className="text-2xl mr-3 flex-shrink-0">{resource.icon}</div>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {resource.title}
          </h3>
        </div>

        <div className="flex gap-2">
          {resource.type === 'article' ? (
            <a
              href={`/${locale}/${resource.slug}`}
              className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center block"
            >
              {t('actions.readArticle')}
            </a>
          ) : (
            <>
              <button
                onClick={() => handlePreview(resource.id!)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                {t('actions.preview')}
              </button>
              <button
                onClick={() => handlePDFDownload(resource.id!)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                title={t('actions.downloadHtmlPdf')}
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleShare(resource)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                title={t('actions.share')}
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // 分类区域组件
  const CategorySection = ({ category }: { category: Category }) => (
    <div className={`${category.bgColor} rounded-2xl p-6 mb-6`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mr-4 shadow-lg`}>
          {category.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h2>
          <p className="text-gray-600 text-sm">{category.subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{category.resources.length}</div>
          <div className="text-xs text-gray-500">{locale === 'zh' ? '个资源' : 'resources'}</div>
        </div>
      </div>

      <div className="grid gap-3">
        {category.resources
          .sort((a, b) => {
            const priorityOrder = { highest: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .slice(0, activeCategory === category.id ? undefined : 3)
          .map((resource, index) => (
            <ResourceCard key={index} resource={resource} categoryColor={category.color} />
          ))}
      </div>

      {activeCategory !== category.id && category.resources.length > 3 && (
        <button
          onClick={() => setActiveCategory(category.id)}
          className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
        >
          {locale === 'zh' ? `查看全部 ${category.resources.length} 个资源 →` : `View all ${category.resources.length} resources →`}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端优化样式 */}
      <style jsx>{`
        @media (max-width: 640px) {
          button, a[role="button"] {
            min-height: 44px; /* 触摸友好 */
          }
          
          h1 { line-height: 1.2; }
          h2, h3 { line-height: 1.3; }
          
          img {
            max-width: 100%;
            height: auto;
          }
        }
        
        /* 超小屏幕优化 */
        @media (max-width: 375px) {
          h1 { font-size: 1.5rem; }
          h2 { font-size: 1.25rem; }
        }
      `}</style>
      
      {/* Main Content */}
      <div className="px-4 py-6 max-w-md mx-auto">

        {/* Emergency Decision Tree */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl mb-6 border border-pink-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            {locale === 'zh' ? '我现在需要什么帮助？' : 'What help do I need now?'}
          </h2>
          <div className="space-y-3">
            {Object.values(optimizedCategories).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg scale-105`
                    : `${category.bgColor} ${category.borderColor} text-gray-700 hover:shadow-md hover:scale-102`
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    activeCategory === category.id
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${category.color} text-white`
                  }`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{category.title}</div>
                    <div className={`text-sm ${
                      activeCategory === category.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {category.subtitle}
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${
                    activeCategory === category.id ? 'text-white' : 'text-gray-600'
                  }`}>
                    {category.resources.length}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={locale === 'zh' ? '搜索资源...' : 'Search resources...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setSearchTerm(filter.key);
                  setActiveCategory(filter.category);
                }}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs whitespace-nowrap hover:bg-purple-200 transition-colors"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {searchTerm && contentSearch ? (
          // 显示搜索结果
          <div className="mb-6 pb-20">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {locale === 'zh' ? `搜索结果 (${contentSearch.length}个)` : `Search Results (${contentSearch.length})`}
              </h2>
              <div className="grid gap-3 max-h-60 sm:max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
                {/* 滚动提示 */}
                {contentSearch.length > 2 && (
                  <div className="absolute top-0 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-b-lg z-10">
                    {locale === 'zh' ? '向下滚动查看更多' : 'Scroll for more'}
                  </div>
                )}
                {contentSearch.map((resource, index) => (
                  <div key={index} className="relative">
                    <ResourceCard resource={resource} categoryColor="from-blue-500 to-blue-600" />
                    {/* 相关性评分和匹配原因 */}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {locale === 'zh' ? `相关性: ${resource.relevanceScore}%` : `Relevance: ${resource.relevanceScore}%`}
                        </span>
                        {resource.relevanceScore >= 100 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {locale === 'zh' ? '精确匹配' : 'Exact Match'}
                          </span>
                        )}
                        {resource.relevanceScore >= 80 && resource.relevanceScore < 100 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {locale === 'zh' ? '同义词匹配' : 'Synonym Match'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* 底部渐变遮罩提示 */}
                {contentSearch.length > 2 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none"></div>
                )}
              </div>
            </div>
          </div>
        ) : activeCategory === 'all' ? (
          Object.values(optimizedCategories).map((category) => (
            <CategorySection key={category.id} category={category} />
          ))
        ) : (
          <CategorySection category={optimizedCategories[activeCategory]} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Object.values(optimizedCategories).reduce((total, category) => total + category.resources.length, 0)}
            </div>
            <div className="text-xs text-gray-600">{locale === 'zh' ? '总资源' : 'Total Resources'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-600 mb-1">{Object.keys(optimizedCategories).length}</div>
            <div className="text-xs text-gray-600">{locale === 'zh' ? '分类' : 'Categories'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-xs text-gray-600">{locale === 'zh' ? '循证' : 'Evidence-Based'}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">
            {locale === 'zh' ? '需要更多帮助？' : 'Need More Help?'}
          </h3>
          <p className="text-sm opacity-90 mb-4">
            {locale === 'zh' ? '探索我们的互动工具获得个性化建议' : 'Explore our interactive tools for personalized recommendations'}
          </p>
          <a
            href={`/${locale}/interactive-tools`}
            className="inline-block bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            {locale === 'zh' ? '使用互动工具' : 'Use Interactive Tools'}
          </a>
        </div>
      </div>

      {/* Bottom spacer for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default OptimizedMobilePDFCenter;
