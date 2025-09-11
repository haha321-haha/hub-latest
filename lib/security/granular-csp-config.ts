/**
 * 细粒度CSP配置
 * 提供更精确的安全策略控制
 */

export interface GranularCSPConfig {
  // 按页面类型配置不同的CSP策略
  pageSpecific: {
    public: CSPDirectives;
    authenticated: CSPDirectives;
    admin: CSPDirectives;
    api: CSPDirectives;
  };
  
  // 按功能模块配置
  featureSpecific: {
    analytics: CSPDirectives;
    payments: CSPDirectives;
    uploads: CSPDirectives;
    charts: CSPDirectives;
  };
  
  // 动态策略调整
  dynamic: {
    enableNonce: boolean;
    enableHash: boolean;
    enableStrictDynamic: boolean;
  };
}

export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'media-src'?: string[];
  'object-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'frame-src'?: string[];
  'worker-src'?: string[];
  'manifest-src'?: string[];
  'require-sri-for'?: string[];
}

/**
 * 细粒度CSP配置实现
 */
export const granularCSPConfig: GranularCSPConfig = {
  // 按页面类型配置
  pageSpecific: {
    // 公开页面 - 相对宽松
    public: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'strict-dynamic'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Tailwind CSS
        'https://fonts.googleapis.com',
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://www.periodhub.health',
        'https://images.unsplash.com',
      ],
      'font-src': [
        "'self'",
        'data:',
        'https://fonts.gstatic.com',
      ],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
    },
    
    // 认证页面 - 更严格
    authenticated: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'strict-dynamic'",
        'https://www.googletagmanager.com',
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://www.periodhub.health',
      ],
      'font-src': [
        "'self'",
        'data:',
        'https://fonts.gstatic.com',
      ],
      'connect-src': [
        "'self'",
        'https://api.periodhub.health',
        'https://www.google-analytics.com',
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
    },
    
    // 管理页面 - 最严格
    admin: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'strict-dynamic'",
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
      ],
      'font-src': [
        "'self'",
        'data:',
      ],
      'connect-src': [
        "'self'",
        'https://api.periodhub.health',
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
    },
    
    // API页面 - 最小权限
    api: {
      'default-src': ["'none'"],
      'script-src': ["'none'"],
      'style-src': ["'none'"],
      'img-src': ["'none'"],
      'font-src': ["'none'"],
      'connect-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'none'"],
      'form-action': ["'none'"],
      'frame-ancestors': ["'none'"],
    },
  },
  
  // 按功能模块配置
  featureSpecific: {
    // 分析功能
    analytics: {
      'script-src': [
        "'self'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
      ],
    },
    
    // 支付功能
    payments: {
      'script-src': [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.stripe.com',
      ],
      'connect-src': [
        "'self'",
        'https://api.stripe.com',
        'https://checkout.stripe.com',
      ],
      'frame-src': [
        'https://checkout.stripe.com',
        'https://js.stripe.com',
      ],
    },
    
    // 文件上传功能
    uploads: {
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://www.periodhub.health',
      ],
      'connect-src': [
        "'self'",
        'https://api.periodhub.health',
      ],
    },
    
    // 图表功能
    charts: {
      'script-src': [
        "'self'",
        'https://cdn.jsdelivr.net', // Chart.js
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
      ],
    },
  },
  
  // 动态策略配置
  dynamic: {
    enableNonce: true,
    enableHash: true,
    enableStrictDynamic: true,
  },
};

/**
 * 细粒度CSP管理器
 */
export class GranularCSPManager {
  private config: GranularCSPConfig;
  private nonce: string;
  
  constructor(config: GranularCSPConfig) {
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
   * 根据页面类型获取CSP策略
   */
  getCSPForPageType(pageType: keyof GranularCSPConfig['pageSpecific']): string {
    const directives = this.config.pageSpecific[pageType];
    return this.generateCSPHeader(directives);
  }
  
  /**
   * 根据功能模块获取CSP策略
   */
  getCSPForFeature(feature: keyof GranularCSPConfig['featureSpecific']): string {
    const directives = this.config.featureSpecific[feature];
    return this.generateCSPHeader(directives);
  }
  
  /**
   * 合并多个CSP策略
   */
  mergeCSPDirectives(...directives: CSPDirectives[]): CSPDirectives {
    const merged: CSPDirectives = {};
    
    directives.forEach(directive => {
      Object.entries(directive).forEach(([key, values]) => {
        if (merged[key as keyof CSPDirectives]) {
          // 合并数组，去重
          const existing = merged[key as keyof CSPDirectives] as string[];
          const combined = [...new Set([...existing, ...values])];
          merged[key as keyof CSPDirectives] = combined;
        } else {
          merged[key as keyof CSPDirectives] = values;
        }
      });
    });
    
    return merged;
  }
  
  /**
   * 生成CSP头部字符串
   */
  private generateCSPHeader(directives: CSPDirectives): string {
    const processedDirectives: string[] = [];
    
    Object.entries(directives).forEach(([directive, sources]) => {
      if (sources && sources.length > 0) {
        // 处理特殊指令
        let processedSources = sources.map((source: string) => {
          if (source === '{NONCE}') {
            return `'nonce-${this.nonce}'`;
          }
          return source;
        });
        
        processedDirectives.push(`${directive} ${processedSources.join(' ')}`);
      }
    });
    
    return processedDirectives.join('; ');
  }
  
  /**
   * 验证资源是否被允许
   */
  validateResource(
    pageType: keyof GranularCSPConfig['pageSpecific'],
    resourceType: keyof CSPDirectives,
    url: string
  ): { allowed: boolean; reason?: string } {
    const directives = this.config.pageSpecific[pageType];
    const allowedSources = directives[resourceType];
    
    if (!allowedSources) {
      return { allowed: false, reason: `No ${resourceType} directive found` };
    }
    
    try {
      const urlObj = new URL(url);
      
      // 检查是否匹配允许的源
      const isAllowed = allowedSources.some(source => {
        if (source === "'self'") {
          return urlObj.origin === window.location.origin;
        }
        if (source === 'data:') {
          return urlObj.protocol === 'data:';
        }
        if (source === 'blob:') {
          return urlObj.protocol === 'blob:';
        }
        if (source.startsWith('https://')) {
          return urlObj.protocol === 'https:' && 
                 (urlObj.hostname === source.replace('https://', '') ||
                  urlObj.hostname.endsWith('.' + source.replace('https://', '')));
        }
        return false;
      });
      
      if (!isAllowed) {
        return { 
          allowed: false, 
          reason: `URL ${url} is not allowed by ${resourceType} directive` 
        };
      }
      
      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Invalid URL format' };
    }
  }
  
  /**
   * 获取当前nonce
   */
  getNonce(): string {
    return this.nonce;
  }
  
  /**
   * 生成资源完整性哈希
   */
  async generateResourceHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256-${btoa(hashHex)}`;
  }
}

/**
 * CSP策略测试器
 */
export class CSPPolicyTester {
  private manager: GranularCSPManager;
  
  constructor(manager: GranularCSPManager) {
    this.manager = manager;
  }
  
  /**
   * 测试CSP策略
   */
  async testCSPPolicy(pageType: keyof GranularCSPConfig['pageSpecific']) {
    const tests = [
      {
        name: 'Self-origin script',
        type: 'script-src' as keyof CSPDirectives,
        url: `${window.location.origin}/script.js`,
        expected: true,
      },
      {
        name: 'External script',
        type: 'script-src' as keyof CSPDirectives,
        url: 'https://malicious-site.com/script.js',
        expected: false,
      },
      {
        name: 'Data URI image',
        type: 'img-src' as keyof CSPDirectives,
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        expected: true,
      },
      {
        name: 'External image',
        type: 'img-src' as keyof CSPDirectives,
        url: 'https://malicious-site.com/image.jpg',
        expected: false,
      },
    ];
    
    const results = tests.map(test => {
      const result = this.manager.validateResource(pageType, test.type, test.url);
      return {
        ...test,
        actual: result.allowed,
        passed: result.allowed === test.expected,
        reason: result.reason,
      };
    });
    
    return results;
  }
  
  /**
   * 生成测试报告
   */
  generateTestReport(results: any[]) {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    return {
      summary: {
        passed,
        total,
        percentage: Math.round((passed / total) * 100),
      },
      details: results,
      recommendations: this.generateRecommendations(results),
    };
  }
  
  /**
   * 生成优化建议
   */
  private generateRecommendations(results: any[]) {
    const recommendations = [];
    
    const failedTests = results.filter(r => !r.passed);
    
    if (failedTests.length > 0) {
      recommendations.push({
        type: 'security',
        message: `${failedTests.length} 个CSP测试失败`,
        action: '检查CSP策略配置，确保所有必要的资源都被允许',
      });
    }
    
    return recommendations;
  }
}
