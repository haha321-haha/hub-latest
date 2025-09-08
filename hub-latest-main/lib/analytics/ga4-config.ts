// lib/analytics/ga4-config.ts

export const GA4_CONFIG = {
  // GA4 测量ID (需要替换为实际的ID)
  MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  
  // 是否启用GA4
  ENABLED: process.env.NODE_ENV === 'production',
  
  // 自定义事件配置
  EVENTS: {
    // 页面浏览
    PAGE_VIEW: 'page_view',
    
    // 用户交互
    CLICK: 'click',
    SCROLL: 'scroll',
    SEARCH: 'search',
    
    // 内容交互
    PDF_DOWNLOAD: 'pdf_download',
    PDF_PREVIEW: 'pdf_preview',
    ARTICLE_READ: 'article_read',
    TOOL_USAGE: 'tool_usage',
    
    // 转化事件
    SUBSCRIBE: 'subscribe',
    CONTACT: 'contact',
    SHARE: 'share',
    
    // 用户行为
    SESSION_START: 'session_start',
    SESSION_END: 'session_end',
    USER_REGISTRATION: 'user_registration'
  },
  
  // 自定义维度
  CUSTOM_DIMENSIONS: {
    USER_TYPE: 'user_type',
    CONTENT_CATEGORY: 'content_category',
    LANGUAGE: 'language',
    DEVICE_TYPE: 'device_type'
  },
  
  // 自定义指标
  CUSTOM_METRICS: {
    SESSION_DURATION: 'session_duration',
    PAGE_SCROLL_DEPTH: 'page_scroll_depth',
    CONTENT_ENGAGEMENT: 'content_engagement'
  }
};

// GA4 初始化脚本
export const GA4_INIT_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA4_CONFIG.MEASUREMENT_ID}', {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      'custom_dimension1': '${GA4_CONFIG.CUSTOM_DIMENSIONS.USER_TYPE}',
      'custom_dimension2': '${GA4_CONFIG.CUSTOM_DIMENSIONS.CONTENT_CATEGORY}',
      'custom_dimension3': '${GA4_CONFIG.CUSTOM_DIMENSIONS.LANGUAGE}',
      'custom_dimension4': '${GA4_CONFIG.CUSTOM_DIMENSIONS.DEVICE_TYPE}'
    }
  });
`;

// GA4 事件追踪工具
export class GA4Tracker {
  private static instance: GA4Tracker;
  private isInitialized = false;

  static getInstance(): GA4Tracker {
    if (!GA4Tracker.instance) {
      GA4Tracker.instance = new GA4Tracker();
    }
    return GA4Tracker.instance;
  }

  init(): void {
    if (typeof window !== 'undefined' && GA4_CONFIG.ENABLED) {
      // 注入GA4脚本
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // 执行初始化脚本
      const initScript = document.createElement('script');
      initScript.innerHTML = GA4_INIT_SCRIPT;
      document.head.appendChild(initScript);

      this.isInitialized = true;
    }
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && this.isInitialized && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  }

  trackPageView(pageTitle: string, pageLocation: string): void {
    this.trackEvent(GA4_CONFIG.EVENTS.PAGE_VIEW, {
      page_title: pageTitle,
      page_location: pageLocation
    });
  }

  trackPDFDownload(resourceId: string, resourceName: string, language: string): void {
    this.trackEvent(GA4_CONFIG.EVENTS.PDF_DOWNLOAD, {
      resource_id: resourceId,
      resource_name: resourceName,
      language: language,
      content_category: 'pdf'
    });
  }

  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent(GA4_CONFIG.EVENTS.SEARCH, {
      search_term: query,
      results_count: resultsCount
    });
  }

  trackToolUsage(toolName: string, action: string): void {
    this.trackEvent(GA4_CONFIG.EVENTS.TOOL_USAGE, {
      tool_name: toolName,
      action: action
    });
  }

  trackSubscribe(email: string, source: string): void {
    this.trackEvent(GA4_CONFIG.EVENTS.SUBSCRIBE, {
      email: email,
      source: source
    });
  }
}

export default GA4Tracker; 