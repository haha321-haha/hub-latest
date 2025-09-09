/**
 * 严格CSP配置 - 第三方资源控制
 * 提供细粒度的安全策略控制
 */

export interface StrictCSPConfig {
  // 允许的第三方域名白名单
  allowedDomains: {
    images: string[];
    scripts: string[];
    styles: string[];
    fonts: string[];
    analytics: string[];
    apis: string[];
  };
  
  // 内联内容控制
  inlineContent: {
    allowInlineScripts: boolean;
    allowInlineStyles: boolean;
    requireNonce: boolean;
  };
  
  // 资源完整性检查
  integrity: {
    requireSRI: boolean;
    allowedHashes: string[];
  };
}

/**
 * 生产环境严格CSP配置
 */
export const strictProductionCSP: StrictCSPConfig = {
  allowedDomains: {
    // 图片资源 - 只允许可信的CDN
    images: [
      'periodhub.health',
      'cdn.periodhub.health',
      'images.unsplash.com', // 如果需要
      'via.placeholder.com', // 占位图片
    ],
    
    // 脚本资源 - 严格控制
    scripts: [
      'periodhub.health',
      'www.googletagmanager.com', // Google Analytics
      'www.google-analytics.com',
      'cdn.jsdelivr.net', // 如果需要特定库
    ],
    
    // 样式资源 - 只允许必要的
    styles: [
      'periodhub.health',
      'fonts.googleapis.com', // Google Fonts CSS
    ],
    
    // 字体资源
    fonts: [
      'periodhub.health',
      'fonts.gstatic.com', // Google Fonts
    ],
    
    // 分析服务
    analytics: [
      'www.google-analytics.com',
      'analytics.google.com',
      'googletagmanager.com',
    ],
    
    // API端点
    apis: [
      'api.periodhub.health',
      'www.periodhub.health',
    ],
  },
  
  inlineContent: {
    allowInlineScripts: false, // 生产环境禁止内联脚本
    allowInlineStyles: true,   // Tailwind CSS需要内联样式
    requireNonce: true,        // 要求nonce验证
  },
  
  integrity: {
    requireSRI: true,          // 要求子资源完整性
    allowedHashes: [],         // 允许的哈希值
  },
};

/**
 * 生成严格的CSP指令
 */
export function generateStrictCSPDirectives(config: StrictCSPConfig) {
  const { allowedDomains, inlineContent, integrity } = config;
  
  return {
    // 默认策略：只允许同源
    'default-src': ["'self'"],
    
    // 脚本策略：严格控制第三方脚本
    'script-src': [
      "'self'",
      ...(inlineContent.allowInlineScripts ? ["'unsafe-inline'"] : []),
      ...(inlineContent.requireNonce ? ["'nonce-{NONCE}'"] : []),
      ...allowedDomains.scripts.map(domain => `https://${domain}`),
    ],
    
    // 样式策略：控制第三方样式
    'style-src': [
      "'self'",
      ...(inlineContent.allowInlineStyles ? ["'unsafe-inline'"] : []),
      ...allowedDomains.styles.map(domain => `https://${domain}`),
    ],
    
    // 图片策略：严格控制图片源
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      ...allowedDomains.images.map(domain => `https://${domain}`),
    ],
    
    // 字体策略：控制字体源
    'font-src': [
      "'self'",
      'data:',
      ...allowedDomains.fonts.map(domain => `https://${domain}`),
    ],
    
    // 连接策略：控制API调用
    'connect-src': [
      "'self'",
      'wss:',
      ...allowedDomains.apis.map(domain => `https://${domain}`),
      ...allowedDomains.analytics.map(domain => `https://${domain}`),
    ],
    
    // 媒体策略：只允许同源媒体
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    
    // 对象策略：完全禁止插件
    'object-src': ["'none'"],
    
    // 基础URI：只允许同源
    'base-uri': ["'self'"],
    
    // 表单操作：只允许同源提交
    'form-action': ["'self'"],
    
    // 框架祖先：防止点击劫持
    'frame-ancestors': ["'none'"],
    
    // 工作线程：只允许同源
    'worker-src': [
      "'self'",
      'blob:',
    ],
    
    // 清单：只允许同源
    'manifest-src': ["'self'"],
    
    // 子资源完整性：要求SRI
    ...(integrity.requireSRI ? {
      'require-sri-for': ['script', 'style'],
    } : {}),
  };
}

/**
 * 第三方资源验证器
 */
export class ThirdPartyResourceValidator {
  private config: StrictCSPConfig;
  
  constructor(config: StrictCSPConfig) {
    this.config = config;
  }
  
  /**
   * 验证图片URL是否被允许
   */
  validateImageURL(url: string): { allowed: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      
      // 检查协议
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'data:' && urlObj.protocol !== 'blob:') {
        return { allowed: false, reason: 'Only HTTPS, data, and blob URLs are allowed' };
      }
      
      // 检查域名白名单
      if (urlObj.protocol === 'https:') {
        const domain = urlObj.hostname;
        const isAllowed = this.config.allowedDomains.images.some(allowedDomain => 
          domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
        );
        
        if (!isAllowed) {
          return { allowed: false, reason: `Domain ${domain} is not in the allowed list` };
        }
      }
      
      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Invalid URL format' };
    }
  }
  
  /**
   * 验证脚本URL是否被允许
   */
  validateScriptURL(url: string): { allowed: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      
      if (urlObj.protocol !== 'https:') {
        return { allowed: false, reason: 'Only HTTPS URLs are allowed for scripts' };
      }
      
      const domain = urlObj.hostname;
      const isAllowed = this.config.allowedDomains.scripts.some(allowedDomain => 
        domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
      );
      
      if (!isAllowed) {
        return { allowed: false, reason: `Script domain ${domain} is not in the allowed list` };
      }
      
      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Invalid URL format' };
    }
  }
  
  /**
   * 验证样式URL是否被允许
   */
  validateStyleURL(url: string): { allowed: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      
      if (urlObj.protocol !== 'https:') {
        return { allowed: false, reason: 'Only HTTPS URLs are allowed for styles' };
      }
      
      const domain = urlObj.hostname;
      const isAllowed = this.config.allowedDomains.styles.some(allowedDomain => 
        domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
      );
      
      if (!isAllowed) {
        return { allowed: false, reason: `Style domain ${domain} is not in the allowed list` };
      }
      
      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Invalid URL format' };
    }
  }
}

/**
 * CSP违规监控和报告
 */
export class CSPViolationMonitor {
  private violations: Array<{
    timestamp: Date;
    violation: any;
    severity: 'low' | 'medium' | 'high';
  }> = [];
  
  /**
   * 记录CSP违规
   */
  recordViolation(violation: any) {
    const severity = this.assessSeverity(violation);
    
    this.violations.push({
      timestamp: new Date(),
      violation,
      severity,
    });
    
    // 如果是高风险违规，立即告警
    if (severity === 'high') {
      this.alertHighSeverityViolation(violation);
    }
  }
  
  /**
   * 评估违规严重程度
   */
  private assessSeverity(violation: any): 'low' | 'medium' | 'high' {
    const { 'violated-directive': directive, 'blocked-uri': blockedUri } = violation;
    
    // 高风险：脚本相关违规
    if (directive.includes('script-src')) {
      return 'high';
    }
    
    // 中风险：样式或连接相关违规
    if (directive.includes('style-src') || directive.includes('connect-src')) {
      return 'medium';
    }
    
    // 低风险：其他违规
    return 'low';
  }
  
  /**
   * 高风险违规告警
   */
  private alertHighSeverityViolation(violation: any) {
    console.error('🚨 HIGH SEVERITY CSP VIOLATION:', {
      directive: violation['violated-directive'],
      blocked: violation['blocked-uri'],
      document: violation['document-uri'],
      timestamp: new Date().toISOString(),
    });
    
    // 在生产环境中发送到监控服务
    if (process.env.NODE_ENV === 'production') {
      // 发送到Sentry、DataDog等监控服务
      // monitoringService.reportCSPViolation(violation);
    }
  }
  
  /**
   * 获取违规统计
   */
  getViolationStats() {
    const stats = {
      total: this.violations.length,
      high: this.violations.filter(v => v.severity === 'high').length,
      medium: this.violations.filter(v => v.severity === 'medium').length,
      low: this.violations.filter(v => v.severity === 'low').length,
    };
    
    return stats;
  }
}

/**
 * 动态CSP策略生成器
 */
export class DynamicCSPGenerator {
  private config: StrictCSPConfig;
  private nonce: string;
  
  constructor(config: StrictCSPConfig) {
    this.config = config;
    this.nonce = this.generateNonce();
  }
  
  /**
   * 生成随机nonce
   */
  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * 生成当前页面的CSP头部
   */
  generateCSPHeader(): string {
    const directives = generateStrictCSPDirectives(this.config);
    
    // 替换nonce占位符
    const processedDirectives = Object.entries(directives).map(([key, values]) => {
      const processedValues = values.map(value => 
        value.replace('{NONCE}', this.nonce)
      );
      return `${key} ${processedValues.join(' ')}`;
    });
    
    return processedDirectives.join('; ');
  }
  
  /**
   * 获取当前nonce
   */
  getNonce(): string {
    return this.nonce;
  }
  
  /**
   * 验证资源是否被CSP允许
   */
  validateResource(type: 'script' | 'style' | 'image', url: string): boolean {
    const validator = new ThirdPartyResourceValidator(this.config);
    
    switch (type) {
      case 'script':
        return validator.validateScriptURL(url).allowed;
      case 'style':
        return validator.validateStyleURL(url).allowed;
      case 'image':
        return validator.validateImageURL(url).allowed;
      default:
        return false;
    }
  }
}
