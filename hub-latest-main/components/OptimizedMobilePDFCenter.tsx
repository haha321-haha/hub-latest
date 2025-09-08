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

  // 获取翻译函数 - 移到组件顶部，避免条件性调用
  const t = useTranslations('downloadsPage.resources');
  const articlesT = useTranslations('articlesPage.categories');

  // 类别标题翻译
  const getCategoryTitle = (key: string) => {
    const titles = {
      immediate: locale === 'zh' ? '立即帮助' : 'Immediate Help',
      preparation: locale === 'zh' ? '计划准备' : 'Planning & Preparation',
      learning: locale === 'zh' ? '深入了解' : 'Learning & Understanding',
      longterm: locale === 'zh' ? '长期管理' : 'Long-term Management'
    };
    return titles[key as keyof typeof titles] || key;
  };

  const getCategorySubtitle = (key: string) => {
    const subtitles = {
      immediate: locale === 'zh' ? '现在就疼！马上需要缓解' : 'Pain right now! Need immediate relief',
      preparation: locale === 'zh' ? '提前准备，从容应对' : 'Prepare ahead, handle with confidence',
      learning: locale === 'zh' ? '了解原理，科学管理' : 'Understand principles, manage scientifically',
      longterm: locale === 'zh' ? '建立习惯，持续改善' : 'Build habits, continuous improvement'
    };
    return subtitles[key as keyof typeof subtitles] || key;
  };

  // 从统一配置获取PDF资源并转换为组件格式
  const convertPDFToResource = (pdfResource: any): Resource => ({
    type: 'pdf' as const,
    title: t(pdfResource.titleKey), // 使用翻译后的标题
    icon: pdfResource.icon,
    size: `${pdfResource.fileSize}KB`,
    priority: pdfResource.featured ? 'highest' : 'high',
    tags: ['PDF', '下载'],
    id: pdfResource.id
  });

  // 创建文章资源的翻译函数
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
        // 文章资源 - 使用翻译键
        createArticleResource('immediateRelief', 'fiveMinuteRelief', 5, 'highest', ['疼痛', '缓解', '快速'], '5-minute-period-pain-relief'),
        createArticleResource('understandingEducation', 'painDifferential', 25, 'highest', ['自检', '安全', '鉴别'], 'menstrual-pain-vs-other-abdominal-pain-guide'),
        createArticleResource('immediateRelief', 'heatTherapy', 8, 'high', ['热敷', '方法', '科学'], 'heat-therapy-complete-guide'),
        createArticleResource('naturalTherapies', 'physicalTherapy', 12, 'high', ['腰痛', '护理', '缓解'], 'menstrual-back-pain-comprehensive-care-guide'),
        createArticleResource('naturalTherapies', 'traditionalMethods', 12, 'high', ['生姜', '自然疗法', '缓解'], 'ginger-menstrual-pain-relief-guide'),
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
        // 文章资源 - 使用翻译键
        createArticleResource('nutritionHealth', 'preventiveCare', 22, 'highest', ['预防性护理', '全周期管理', '循证医学'], 'menstrual-preventive-care-complete-plan'),
        createArticleResource('nutritionHealth', 'sleepQuality', 20, 'highest', ['睡眠质量', '21天计划', '睡眠卫生'], 'comprehensive-menstrual-sleep-quality-guide'),
        createArticleResource('nutritionHealth', 'stressManagement', 22, 'highest', ['压力管理', '职场健康', '心理调节'], 'menstrual-stress-management-complete-guide'),
        createArticleResource('naturalTherapies', 'zhanZhuang', 18, 'high', ['运动', '八段锦', '缓解'], 'zhan-zhuang-baduanjin-for-menstrual-pain-relief'),
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
        createArticleResource('understandingEducation', 'lifecycleAnalysis', 24, 'highest', ['生命周期', '年龄特点', '科学管理'], 'womens-lifecycle-menstrual-pain-analysis'),
        createArticleResource('understandingEducation', 'researchProgress2024', 18, 'highest', ['循证医学', '研究进展', '新药开发'], 'menstrual-pain-research-progress-2024'),
        createArticleResource('understandingEducation', 'painDifferential', 25, 'highest', ['痛经鉴别', '腹痛诊断', '危险信号'], 'menstrual-pain-vs-other-abdominal-pain-guide'),

        createArticleResource('understandingEducation', 'understandingCycle', 25, 'high', ['周期', '教育', '基础'], 'understanding-your-cycle'),

        createArticleResource('understandingEducation', 'insuranceCoverage', 25, 'high', ['医疗保险', 'ACA政策', '保险理赔'], 'us-menstrual-pain-insurance-coverage-guide'),

        createArticleResource('medicalGuidance', 'whenToSeeDoctor', 10, 'highest', ['就医', '预警', '安全'], 'when-to-see-doctor-period-pain'),
        createArticleResource('medicalGuidance', 'medicalCare', 15, 'high', ['医疗', '护理', '指南'], 'when-to-seek-medical-care-comprehensive-guide'),
        // PDF资源 - 从统一配置获取
        ...PDF_RESOURCES.filter(pdf =>
          ['natural-therapy-assessment', 'menstrual-pain-complications-management', 'teacher-health-manual', 'teacher-collaboration-handbook', 'parent-communication-guide', 'us-insurance-quick-reference-card'].includes(pdf.id)
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
    const urgentKeywords = ['疼', '痛', '现在', '马上', '缓解', '快速', '立即'];
    const preparationKeywords = ['营养', '饮食', '运动', '习惯', '准备', '预防'];
    const learningKeywords = ['医生', '医学', '就医', '周期', '了解', '指南', '教育', '知识'];
    const managementKeywords = ['长期', '管理', '生活', '档案', '记录', '持续'];

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

  // 渐进式加载
  useEffect(() => {
    if (activeCategory && !loadedCategories.includes(activeCategory)) {
      setLoadedCategories(prev => [...prev, activeCategory]);
    }
  }, [activeCategory, loadedCategories]);

  // 紧急模式检测
  useEffect(() => {
    const urgentTerms = ['疼', '痛', '现在', '马上', '急'];
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
        text: locale === 'zh' ? '最推荐' : 'Top Pick',
        color: 'bg-red-500 text-white'
      },
      high: {
        text: locale === 'zh' ? '推荐' : 'Recommended',
        color: 'bg-orange-500 text-white'
      },
      medium: {
        text: locale === 'zh' ? '重要' : 'Important',
        color: 'bg-yellow-500 text-white'
      },
      low: {
        text: locale === 'zh' ? '选读' : 'Optional',
        color: 'bg-gray-500 text-white'
      }
    };
    return badges[priority as keyof typeof badges] || badges.low;
  };

  // 快速筛选标签
  const quickFilters = [
    { key: '疼痛', label: locale === 'zh' ? '疼痛' : 'Pain', category: 'immediate' },
    { key: '缓解', label: locale === 'zh' ? '缓解' : 'Relief', category: 'immediate' },
    { key: '营养', label: locale === 'zh' ? '营养' : 'Nutrition', category: 'preparation' },
    { key: '运动', label: locale === 'zh' ? '运动' : 'Exercise', category: 'preparation' },
    { key: '医学', label: locale === 'zh' ? '医学' : 'Medical', category: 'learning' },
    { key: '沟通', label: locale === 'zh' ? '沟通' : 'Communication', category: 'learning' }
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
              href={`/${locale}/articles/${resource.slug}`}
              className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center block"
            >
              {locale === 'zh' ? '阅读文章' : 'Read Article'}
            </a>
          ) : (
            <>
              <button
                onClick={() => handlePreview(resource.id!)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                {locale === 'zh' ? '预览' : 'Preview'}
              </button>
              <button
                onClick={() => handlePDFDownload(resource.id!)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                title="下载HTML格式PDF（连续阅读，支持打印）"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleShare(resource)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                title="分享"
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
        {activeCategory === 'all' ? (
          Object.values(optimizedCategories).map((category) => (
            <CategorySection key={category.id} category={category} />
          ))
        ) : (
          <CategorySection category={optimizedCategories[activeCategory]} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">38</div>
            <div className="text-xs text-gray-600">{locale === 'zh' ? '总资源' : 'Total Resources'}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-600 mb-1">4</div>
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
