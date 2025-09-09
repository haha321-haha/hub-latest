/**
 * 内容安全策略 (CSP) 配置
 * 提供严格的安全策略配置
 */

export interface CSPConfig {
  directives: Record<string, string[]>;
  reportOnly?: boolean;
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
}

/**
 * 生产环境CSP配置 - 严格模式
 */
export const productionCSP: CSPConfig = {
  directives: {
    // 默认策略：只允许同源资源
    'default-src': ["'self'"],
    
    // 脚本策略：只允许同源脚本，禁止内联脚本
    'script-src': [
      "'self'",
      "'strict-dynamic'", // 允许通过nonce加载的脚本
      // 允许必要的第三方脚本（如果需要）
      "'unsafe-eval'", // Next.js开发需要，生产环境可移除
    ],
    
    // 样式策略：允许同源样式和内联样式
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Tailwind CSS需要
      'https://fonts.googleapis.com', // Google Fonts
    ],
    
    // 图片策略：允许同源图片和安全的第三方图片
    'img-src': [
      "'self'",
      'data:', // Base64图片
      'blob:', // Blob URL
      'https:', // HTTPS图片
      'https://periodhub.health', // 自己的域名
    ],
    
    // 字体策略：允许同源字体和Google Fonts
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    
    // 连接策略：限制连接目标
    'connect-src': [
      "'self'",
      'https://api.periodhub.health', // 自己的API
      'https://www.google-analytics.com', // Google Analytics
      'https://analytics.google.com',
      'wss:', // WebSocket连接
    ],
    
    // 媒体策略：允许同源媒体文件
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    
    // 对象策略：禁止插件
    'object-src': ["'none'"],
    
    // 基础URI策略：限制基础URI
    'base-uri': ["'self'"],
    
    // 表单操作策略：限制表单提交目标
    'form-action': ["'self'"],
    
    // 框架祖先策略：防止点击劫持
    'frame-ancestors': ["'none'"],
    
    // 插件类型策略：限制插件类型
    'plugin-types': [],
    
    // 清单策略：允许同源清单文件
    'manifest-src': ["'self'"],
    
    // 工作线程策略：允许同源工作线程
    'worker-src': [
      "'self'",
      'blob:',
    ],
    
    // 子资源完整性策略：要求SRI
    'require-sri-for': ['script', 'style'],
  },
  reportOnly: false,
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
};

/**
 * 开发环境CSP配置 - 宽松模式
 */
export const developmentCSP: CSPConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'", // 开发环境需要
      'https://localhost:*',
      'https://127.0.0.1:*',
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
      'https:',
      'http:', // 开发环境允许HTTP
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'https://localhost:*',
      'https://127.0.0.1:*',
      'wss:',
      'ws:', // 开发环境WebSocket
    ],
    'media-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
    'worker-src': [
      "'self'",
      'blob:',
    ],
  },
  reportOnly: true, // 开发环境使用报告模式
  upgradeInsecureRequests: false,
  blockAllMixedContent: false,
};

/**
 * 获取当前环境的CSP配置
 */
export function getCSPConfig(): CSPConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? productionCSP : developmentCSP;
}

/**
 * 生成CSP头部字符串
 */
export function generateCSPHeader(config: CSPConfig): string {
  const directives: string[] = [];
  
  // 添加指令
  Object.entries(config.directives).forEach(([directive, sources]) => {
    if (sources.length > 0) {
      directives.push(`${directive} ${sources.join(' ')}`);
    }
  });
  
  // 添加特殊指令
  if (config.upgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests');
  }
  
  if (config.blockAllMixedContent) {
    directives.push('block-all-mixed-content');
  }
  
  return directives.join('; ');
}

/**
 * 生成报告URI（用于CSP违规报告）
 */
export function generateReportURI(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health';
  return `${baseUrl}/api/csp-report`;
}

/**
 * 完整的CSP头部配置
 */
export function getCSPHeaders() {
  const config = getCSPConfig();
  const cspHeader = generateCSPHeader(config);
  const reportUri = generateReportURI();
  
  const headers: Record<string, string> = {
    'Content-Security-Policy': `${cspHeader}; report-uri ${reportUri}`,
  };
  
  // 如果是报告模式，添加报告专用头部
  if (config.reportOnly) {
    headers['Content-Security-Policy-Report-Only'] = headers['Content-Security-Policy'];
    delete headers['Content-Security-Policy'];
  }
  
  return headers;
}

/**
 * CSP违规报告处理器
 */
export interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number'?: number;
    'column-number'?: number;
    'source-file'?: string;
    'status-code': number;
  };
}

/**
 * 处理CSP违规报告
 */
export function processCSPViolation(report: CSPViolationReport) {
  const violation = report['csp-report'];
  
  // 记录违规信息
  console.warn('CSP Violation:', {
    document: violation['document-uri'],
    directive: violation['violated-directive'],
    blocked: violation['blocked-uri'],
    source: violation['source-file'],
    line: violation['line-number'],
  });
  
  // 在生产环境中，可以发送到监控服务
  if (process.env.NODE_ENV === 'production') {
    // 发送到监控服务（如Sentry、LogRocket等）
    // monitorService.reportCSPViolation(violation);
  }
}

/**
 * 安全头部配置
 */
export function getSecurityHeaders() {
  const cspHeaders = getCSPHeaders();
  
  return {
    ...cspHeaders,
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    
    // 防止MIME类型嗅探
    'X-Content-Type-Options': 'nosniff',
    
    // 启用XSS保护
    'X-XSS-Protection': '1; mode=block',
    
    // 引用者策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // 禁用FLoC
    ].join(', '),
    
    // 严格传输安全（HTTPS）
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

/**
 * 验证CSP配置
 */
export function validateCSPConfig(config: CSPConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 检查必要的指令
  const requiredDirectives = ['default-src', 'script-src', 'style-src'];
  requiredDirectives.forEach(directive => {
    if (!config.directives[directive]) {
      errors.push(`Missing required directive: ${directive}`);
    }
  });
  
  // 检查危险配置
  if (config.directives['script-src']?.includes("'unsafe-inline'") && 
      config.directives['script-src']?.includes("'unsafe-eval'") &&
      process.env.NODE_ENV === 'production') {
    errors.push('Production CSP should not allow both unsafe-inline and unsafe-eval');
  }
  
  // 检查对象源
  if (config.directives['object-src']?.includes("'self'")) {
    errors.push('object-src should be set to "none" for security');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
