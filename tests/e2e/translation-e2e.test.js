/**
 * 翻译系统端到端测试
 * 验证用户界面中的翻译显示是否正确
 */

const { chromium } = require('playwright');

describe('Translation E2E Tests', () => {
  let browser, context, page;
  const baseUrl = process.env.TEST_URL || 'http://localhost:3008';

  beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('症状评估工具翻译测试', () => {
    test('中文版本应该显示正确的中文文本', async () => {
      await page.goto(`${baseUrl}/zh/interactive-tools/symptom-assessment`);
      
      // 等待页面加载
      await page.waitForSelector('h2');
      
      // 检查标题
      const title = await page.textContent('h2');
      expect(title).toContain('症状评估工具');
      expect(title).not.toContain('painTracker');
      expect(title).not.toContain('assessment');
      
      // 检查描述文本
      const description = await page.textContent('p');
      expect(description).toMatch(/[\u4e00-\u9fff]/); // 包含中文字符
      expect(description).not.toContain('resultMessages');
    });

    test('英文版本应该显示正确的英文文本', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools/symptom-assessment`);
      
      // 等待页面加载
      await page.waitForSelector('h2');
      
      // 检查标题
      const title = await page.textContent('h2');
      expect(title).toContain('Symptom Assessment Tool');
      expect(title).not.toContain('painTracker');
      expect(title).not.toContain('assessment');
      
      // 检查描述文本
      const description = await page.textContent('p');
      expect(description).toMatch(/[a-zA-Z]/); // 包含英文字符
      expect(description).not.toMatch(/[\u4e00-\u9fff]/); // 不包含中文字符
      expect(description).not.toContain('resultMessages');
    });

    test('完整评估流程应该显示正确翻译', async () => {
      // 测试中文版本
      await page.goto(`${baseUrl}/zh/interactive-tools/symptom-assessment`);
      
      // 开始评估
      await page.click('button:has-text("开始评估")');
      
      // 检查问题页面
      await page.waitForSelector('h2');
      const questionTitle = await page.textContent('h2');
      expect(questionTitle).toMatch(/[\u4e00-\u9fff]/);
      expect(questionTitle).not.toContain('title');
      
      // 回答所有问题（简化版本）
      for (let i = 0; i < 12; i++) {
        // 选择第一个选项
        const firstOption = await page.$('input[type="radio"], input[type="checkbox"]');
        if (firstOption) {
          await firstOption.click();
        }
        
        // 点击下一题或完成
        const nextButton = await page.$('button:has-text("下一题"), button:has-text("完成评估")');
        if (nextButton) {
          await nextButton.click();
          await page.waitForTimeout(500); // 等待页面更新
        }
      }
      
      // 检查结果页面
      await page.waitForSelector('text=评估结果', { timeout: 10000 });
      const resultTitle = await page.textContent('h2');
      expect(resultTitle).toContain('评估结果');
      expect(resultTitle).not.toContain('result.title');
    });
  });

  describe('语言切换测试', () => {
    test('语言切换应该正确更新所有文本', async () => {
      // 从中文页面开始
      await page.goto(`${baseUrl}/zh/interactive-tools/symptom-assessment`);
      
      // 记录中文文本
      const zhTitle = await page.textContent('h2');
      
      // 切换到英文
      await page.goto(`${baseUrl}/en/interactive-tools/symptom-assessment`);
      
      // 检查英文文本
      const enTitle = await page.textContent('h2');
      
      expect(zhTitle).not.toEqual(enTitle);
      expect(zhTitle).toMatch(/[\u4e00-\u9fff]/);
      expect(enTitle).toMatch(/[a-zA-Z]/);
    });
  });

  describe('错误处理测试', () => {
    test('页面不应该显示翻译键', async () => {
      await page.goto(`${baseUrl}/zh/interactive-tools/symptom-assessment`);
      
      // 检查页面内容
      const pageContent = await page.textContent('body');
      
      // 不应该包含常见的翻译键模式
      expect(pageContent).not.toContain('painTracker.assessment');
      expect(pageContent).not.toContain('resultMessages.');
      expect(pageContent).not.toContain('recommendations.');
      expect(pageContent).not.toContain('[EN]');
      expect(pageContent).not.toContain('[ZH]');
    });

    test('控制台不应该有翻译错误', async () => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warn') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto(`${baseUrl}/zh/interactive-tools/symptom-assessment`);
      await page.waitForTimeout(2000);
      
      // 过滤翻译相关的错误
      const translationErrors = consoleErrors.filter(error => 
        error.includes('Translation') || 
        error.includes('翻译') ||
        error.includes('missing')
      );
      
      expect(translationErrors).toEqual([]);
    });
  });
});

// 工具函数
async function waitForTranslation(page, selector, timeout = 5000) {
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      return element && 
             element.textContent && 
             !element.textContent.includes('painTracker') &&
             !element.textContent.includes('assessment');
    },
    selector,
    { timeout }
  );
}

async function checkNoTranslationKeys(page) {
  const content = await page.textContent('body');
  const translationKeyPatterns = [
    /painTracker\./,
    /assessment\./,
    /resultMessages\./,
    /recommendations\./,
    /\[EN\]/,
    /\[ZH\]/
  ];
  
  for (const pattern of translationKeyPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Found translation key pattern: ${pattern} in page content`);
    }
  }
}
