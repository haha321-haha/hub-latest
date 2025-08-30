// 内部链接优化工具
export class InternalLinkOptimizer {
  private static keywordToPageMap = {
    // 核心关键词映射
    '痛经缓解': '/zh/articles/5-minute-period-pain-relief',
    '热敷疗法': '/zh/articles/heat-therapy-complete-guide',
    '自然疗法': '/zh/articles/natural-physical-therapy-comprehensive-guide',
    '月经健康': '/zh/health-guide',
    '经期管理': '/zh/interactive-tools',
    '症状评估': '/zh/interactive-tools/symptom-assessment',
    '疼痛追踪': '/zh/interactive-tools/pain-tracker',
    
    // 英文关键词
    'period pain relief': '/en/articles/5-minute-period-pain-relief',
    'heat therapy': '/en/articles/heat-therapy-complete-guide',
    'natural remedies': '/en/articles/natural-physical-therapy-comprehensive-guide',
    'menstrual health': '/en/health-guide',
    'period management': '/en/interactive-tools',
  };

  static generateInternalLinks(content: string, currentPath: string): string {
    let optimizedContent = content;
    
    Object.entries(this.keywordToPageMap).forEach(([keyword, targetPath]) => {
      // 避免链接到当前页面
      if (targetPath === currentPath) return;
      
      // 创建链接的正则表达式
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      
      // 只替换第一次出现的关键词
      let hasReplaced = false;
      optimizedContent = optimizedContent.replace(regex, (match) => {
        if (hasReplaced) return match;
        hasReplaced = true;
        return `<a href="${targetPath}" class="internal-link text-purple-600 hover:text-purple-800 underline">${match}</a>`;
      });
    });
    
    return optimizedContent;
  }

  static getRelatedPages(currentPath: string, tags: string[] = []): Array<{title: string, path: string, description: string}> {
    const relatedPages = [];
    
    // 基于路径的相关页面推荐
    if (currentPath.includes('/articles/')) {
      relatedPages.push(
        { title: '交互工具', path: '/interactive-tools', description: '使用我们的健康评估工具' },
        { title: '健康指南', path: '/health-guide', description: '全面的健康管理指南' }
      );
    }
    
    if (currentPath.includes('/interactive-tools/')) {
      relatedPages.push(
        { title: '专业文章', path: '/articles', description: '深入了解月经健康知识' },
        { title: '场景解决方案', path: '/scenario-solutions', description: '针对特定情况的解决方案' }
      );
    }
    
    return relatedPages;
  }
}

// 面包屑导航组件
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function generateBreadcrumbs(pathname: string, locale: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: locale === 'zh' ? '首页' : 'Home', href: `/${locale}` }
  ];
  
  let currentPath = `/${locale}`;
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // 最后一个段不需要链接
    const isLast = i === segments.length - 1;
    
    breadcrumbs.push({
      label: formatSegmentLabel(segment, locale),
      href: isLast ? undefined : currentPath
    });
  }
  
  return breadcrumbs;
}

function formatSegmentLabel(segment: string, locale: string): string {
  const labelMap: Record<string, Record<string, string>> = {
    zh: {
      'articles': '文章',
      'interactive-tools': '交互工具',
      'health-guide': '健康指南',
      'scenario-solutions': '场景解决方案',
      'natural-therapies': '自然疗法',
      'teen-health': '青少年健康'
    },
    en: {
      'articles': 'Articles',
      'interactive-tools': 'Interactive Tools',
      'health-guide': 'Health Guide',
      'scenario-solutions': 'Scenario Solutions',
      'natural-therapies': 'Natural Therapies',
      'teen-health': 'Teen Health'
    }
  };
  
  return labelMap[locale]?.[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}