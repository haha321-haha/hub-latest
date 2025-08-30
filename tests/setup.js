/**
 * Jest测试设置文件
 */

// 扩展Jest匹配器
expect.extend({
  toBeValidTranslationKey(received) {
    const pass = typeof received === 'string' && 
                 received.length > 0 && 
                 !received.includes(' ') &&
                 /^[a-zA-Z][a-zA-Z0-9._]*$/.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid translation key`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid translation key`,
        pass: false,
      };
    }
  },

  toContainChineseText(received) {
    const pass = typeof received === 'string' && /[\u4e00-\u9fff]/.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to contain Chinese text`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to contain Chinese text`,
        pass: false,
      };
    }
  },

  toBeTranslationKeyFormat(received) {
    const pass = typeof received === 'string' && 
                 !received.includes('painTracker.') &&
                 !received.includes('assessment.') &&
                 !received.includes('[EN]') &&
                 !received.includes('[ZH]');
    
    if (pass) {
      return {
        message: () => `expected ${received} to be in translation key format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} not to be in translation key format`,
        pass: false,
      };
    }
  }
});

// 全局测试配置
global.console = {
  ...console,
  // 在测试中静默某些日志
  warn: jest.fn(),
  error: jest.fn(),
};

// 模拟Next.js环境变量
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
