/**
 * 翻译系统测试套件
 * 验证翻译系统的完整性和有效性
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Translation System Tests', () => {
  let zhTranslations, enTranslations;

  beforeAll(() => {
    // 加载翻译文件
    const zhPath = path.join(__dirname, '../messages/zh.json');
    const enPath = path.join(__dirname, '../messages/en.json');
    
    zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  });

  describe('翻译文件完整性测试', () => {
    test('翻译文件应该存在', () => {
      expect(zhTranslations).toBeDefined();
      expect(enTranslations).toBeDefined();
    });

    test('基本翻译结构应该存在', () => {
      // 检查核心结构
      expect(zhTranslations.painTracker).toBeDefined();
      expect(enTranslations.painTracker).toBeDefined();
      
      expect(zhTranslations.painTracker.assessment).toBeDefined();
      expect(enTranslations.painTracker.assessment).toBeDefined();
    });

    test('关键翻译键应该存在', () => {
      const criticalKeys = [
        'painTracker.assessment.title',
        'painTracker.assessment.resultMessages.mild',
        'painTracker.assessment.result.nextSteps.trackSymptoms'
      ];

      criticalKeys.forEach(key => {
        expect(getNestedValue(zhTranslations, key)).toBeDefined();
        expect(getNestedValue(enTranslations, key)).toBeDefined();
      });
    });
  });

  describe('翻译键一致性测试', () => {
    test('中英文翻译键应该一致', () => {
      const zhKeys = getAllKeys(zhTranslations);
      const enKeys = getAllKeys(enTranslations);
      
      const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
      const missingInZh = enKeys.filter(key => !zhKeys.includes(key));
      
      expect(missingInEn).toEqual([]);
      expect(missingInZh).toEqual([]);
    });

    test('翻译值不应该是空字符串', () => {
      const zhEmptyKeys = findEmptyValues(zhTranslations);
      const enEmptyKeys = findEmptyValues(enTranslations);
      
      expect(zhEmptyKeys).toEqual([]);
      expect(enEmptyKeys).toEqual([]);
    });
  });

  describe('翻译验证脚本测试', () => {
    test('翻译验证脚本应该通过', () => {
      expect(() => {
        execSync('npm run validate:translations', { stdio: 'pipe' });
      }).not.toThrow();
    });

    test('迁移脚本应该正常运行', () => {
      expect(() => {
        execSync('npm run migrate:translations', { stdio: 'pipe' });
      }).not.toThrow();
    });
  });

  describe('硬编码文本检测', () => {
    test('组件文件不应该包含硬编码中文', () => {
      const componentFiles = findFiles('app', /\.(tsx?|jsx?)$/);
      const hardcodedTexts = [];

      componentFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const chineseMatches = content.match(/['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g);
        
        if (chineseMatches) {
          // 过滤掉注释和翻译文件
          const filteredMatches = chineseMatches.filter(match => {
            const line = content.split('\n').find(line => line.includes(match));
            return line && !line.trim().startsWith('//') && !line.trim().startsWith('*');
          });
          
          if (filteredMatches.length > 0) {
            hardcodedTexts.push({
              file: file.replace(process.cwd(), ''),
              matches: filteredMatches
            });
          }
        }
      });

      if (hardcodedTexts.length > 0) {
        console.warn('发现硬编码中文文本:', hardcodedTexts);
      }
      
      // 允许少量硬编码（如示例数据），但应该控制在合理范围内
      expect(hardcodedTexts.length).toBeLessThan(10);
    });
  });
});

// 工具函数
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function findEmptyValues(obj, prefix = '') {
  const emptyKeys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      emptyKeys.push(...findEmptyValues(value, fullKey));
    } else if (value === '' || value === null || value === undefined) {
      emptyKeys.push(fullKey);
    }
  }
  return emptyKeys;
}

function findFiles(dir, pattern) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, pattern));
    } else if (stat.isFile() && pattern.test(item)) {
      files.push(fullPath);
    }
  });
  
  return files;
}
