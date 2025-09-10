#!/usr/bin/env node

/**
 * 硬编码预防工具包
 * 基于项目国际化硬编码修复经验，提供完整的预防和解决机制
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}`),
  debug: (msg) => console.log(`${colors.gray}[DEBUG]${colors.reset} ${msg}`)
};

// 配置
const CONFIG = {
  // 要检查的文件类型
  filePatterns: ['*.tsx', '*.ts', '*.js'],
  
  // 排除的目录
  excludeDirs: ['node_modules', '.next', '.git', 'recovery-workspace', 'hub-latest-main', 'backup'],
  
  // 硬编码检测模式
  hardcodePatterns: [
    // 条件硬编码
    {
      pattern: /locale === 'zh' \? '([^']+)' : '([^']+)'/g,
      type: 'conditional-string',
      severity: 'high',
      description: '条件硬编码字符串'
    },
    {
      pattern: /locale === 'zh' \? "([^"]+)" : "([^"]+)"/g,
      type: 'conditional-string',
      severity: 'high',
      description: '条件硬编码字符串'
    },
    
    // 直接中文字符串
    {
      pattern: /'[\u4e00-\u9fff]+'/g,
      type: 'chinese-text',
      severity: 'high',
      description: '直接中文字符串'
    },
    {
      pattern: /"[\u4e00-\u9fff]+"/g,
      type: 'chinese-text',
      severity: 'high',
      description: '直接中文字符串'
    },
    
    // 科学参数硬编码
    {
      pattern: /temperature.*[0-9]+.*°[CF]/g,
      type: 'scientific-param',
      severity: 'medium',
      description: '温度参数硬编码'
    },
    {
      pattern: /duration.*[0-9]+.*minute/g,
      type: 'scientific-param',
      severity: 'medium',
      description: '时长参数硬编码'
    },
    {
      pattern: /dosage.*[0-9]+.*mg/g,
      type: 'scientific-param',
      severity: 'high',
      description: '剂量参数硬编码'
    },
    
    // 硬编码URL
    {
      pattern: /https:\/\/periodhub\.health/g,
      type: 'hardcoded-url',
      severity: 'high',
      description: '硬编码非www URL'
    },
    {
      pattern: /https:\/\/www\.periodhub\.health/g,
      type: 'hardcoded-url',
      severity: 'medium',
      description: '硬编码www URL'
    }
  ],
  
  // 翻译键命名规范
  namingConventions: {
    pages: /^pages\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*$/,
    components: /^components\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*$/,
    common: /^common\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*$/,
    medical: /^medical\.[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*$/
  }
};

// 硬编码检测器
class HardcodeDetector {
  constructor() {
    this.reports = [];
  }
  
  // 检测单个文件
  detectInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileReports = [];
      
      CONFIG.hardcodePatterns.forEach(rule => {
        const matches = content.matchAll(rule.pattern);
        for (const match of matches) {
          const report = {
            file: filePath,
            line: this.getLineNumber(content, match.index),
            match: match[0],
            type: rule.type,
            severity: rule.severity,
            description: rule.description,
            suggestion: this.generateSuggestion(match, rule.type)
          };
          
          fileReports.push(report);
          this.reports.push(report);
        }
      });
      
      return fileReports;
    } catch (error) {
      log.error(`读取文件失败: ${filePath} - ${error.message}`);
      return [];
    }
  }
  
  // 检测整个项目
  detectInProject() {
    this.reports = [];
    const files = this.getSourceFiles();
    
    log.info(`开始检测 ${files.length} 个文件...`);
    
    files.forEach(file => {
      const fileReports = this.detectInFile(file);
      if (fileReports.length > 0) {
        log.warning(`发现 ${fileReports.length} 个问题: ${file}`);
      }
    });
    
    return this.reports;
  }
  
  // 获取源文件列表
  getSourceFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            if (!CONFIG.excludeDirs.includes(item)) {
              scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (['.tsx', '.ts', '.js'].includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        log.debug(`扫描目录失败: ${dir} - ${error.message}`);
      }
    };
    
    scanDirectory('.');
    return files;
  }
  
  // 获取行号
  getLineNumber(content, index) {
    const lines = content.substring(0, index).split('\n');
    return lines.length;
  }
  
  // 生成修复建议
  generateSuggestion(match, type) {
    const [fullMatch, ...groups] = match;
    
    switch (type) {
      case 'conditional-string':
        return `建议替换为: t('${this.generateKeySuggestion(groups[0])}')`;
      case 'chinese-text':
        return `建议替换为: t('${this.generateKeySuggestion(groups[0])}')`;
      case 'scientific-param':
        return `建议将科学参数移到翻译文件中，支持多语言和单位转换`;
      case 'hardcoded-url':
        return `建议使用 URL_CONFIG.getUrl() 或环境变量`;
      default:
        return `建议使用翻译键替代硬编码`;
    }
  }
  
  // 生成翻译键建议
  generateKeySuggestion(text) {
    // 简单的键名生成逻辑
    const key = text
      .replace(/[^\u4e00-\u9fff\w\s]/g, '') // 移除特殊字符
      .replace(/\s+/g, '.') // 空格替换为点
      .toLowerCase();
    
    return `common.${key}`;
  }
  
  // 生成报告
  generateReport() {
    if (this.reports.length === 0) {
      log.success('✅ 没有发现硬编码问题');
      return;
    }
    
    log.header('硬编码检测报告');
    
    // 按严重程度分组
    const bySeverity = this.reports.reduce((acc, report) => {
      if (!acc[report.severity]) acc[report.severity] = [];
      acc[report.severity].push(report);
      return acc;
    }, {});
    
    // 按类型分组
    const byType = this.reports.reduce((acc, report) => {
      if (!acc[report.type]) acc[report.type] = [];
      acc[report.type].push(report);
      return acc;
    }, {});
    
    // 统计信息
    log.info(`总问题数: ${this.reports.length}`);
    log.info(`高严重性: ${bySeverity.high?.length || 0}`);
    log.info(`中严重性: ${bySeverity.medium?.length || 0}`);
    log.info(`低严重性: ${bySeverity.low?.length || 0}`);
    
    // 按文件分组显示
    const byFile = this.reports.reduce((acc, report) => {
      if (!acc[report.file]) acc[report.file] = [];
      acc[report.file].push(report);
      return acc;
    }, {});
    
    Object.keys(byFile).forEach(file => {
      log.error(`\n📁 文件: ${file}`);
      byFile[file].forEach(report => {
        log.error(`  第${report.line}行: ${report.match}`);
        log.info(`  建议: ${report.suggestion}`);
      });
    });
    
    // 修复建议
    log.header('修复建议');
    log.info('1. 使用翻译键替代硬编码文本');
    log.info('2. 将科学参数移到翻译文件中');
    log.info('3. 使用 URL_CONFIG 管理URL');
    log.info('4. 建立代码审查流程');
  }
}

// 翻译键检查器
class TranslationKeyChecker {
  constructor() {
    this.usedKeys = new Set();
    this.availableKeys = new Set();
  }
  
  // 检查翻译键完整性
  checkCompleteness() {
    this.extractUsedKeys();
    this.extractAvailableKeys();
    
    const missingKeys = [...this.usedKeys].filter(key => !this.availableKeys.has(key));
    const unusedKeys = [...this.availableKeys].filter(key => !this.usedKeys.has(key));
    
    return {
      totalUsed: this.usedKeys.size,
      totalAvailable: this.availableKeys.size,
      missingKeys,
      unusedKeys,
      completeness: (this.usedKeys.size - missingKeys.length) / this.usedKeys.size
    };
  }
  
  // 提取使用的翻译键
  extractUsedKeys() {
    const files = this.getSourceFiles();
    
    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // 匹配 t('key') 模式
        const tMatches = content.matchAll(/t\(['"`]([^'"`]+)['"`]\)/g);
        for (const match of tMatches) {
          this.usedKeys.add(match[1]);
        }
        
        // 匹配 useTranslations('namespace') + t('key') 模式
        const namespaceMatches = content.matchAll(/useTranslations\(['"`]([^'"`]+)['"`]\)/g);
        for (const match of namespaceMatches) {
          const namespace = match[1];
          const tMatches = content.matchAll(/t\(['"`]([^'"`]+)['"`]\)/g);
          for (const tMatch of tMatches) {
            this.usedKeys.add(`${namespace}.${tMatch[1]}`);
          }
        }
      } catch (error) {
        log.debug(`处理文件失败: ${file} - ${error.message}`);
      }
    });
  }
  
  // 提取可用的翻译键
  extractAvailableKeys() {
    const translationFiles = ['messages/zh.json', 'messages/en.json'];
    
    translationFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          const data = JSON.parse(content);
          this.extractKeysFromObject(data, '');
        }
      } catch (error) {
        log.debug(`处理翻译文件失败: ${file} - ${error.message}`);
      }
    });
  }
  
  // 从对象中提取键
  extractKeysFromObject(obj, prefix) {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.extractKeysFromObject(obj[key], fullKey);
      } else {
        this.availableKeys.add(fullKey);
      }
    });
  }
  
  // 获取源文件列表
  getSourceFiles() {
    const files = [];
    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (!CONFIG.excludeDirs.includes(item)) {
              scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (['.tsx', '.ts', '.js'].includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        log.debug(`扫描目录失败: ${dir} - ${error.message}`);
      }
    };
    scanDirectory('.');
    return files;
  }
}

// 模板生成器
class TemplateGenerator {
  // 生成页面模板
  generatePageTemplate(pageName) {
    const template = {
      metadata: {
        title: `{{${pageName}.meta.title}}`,
        description: `{{${pageName}.meta.description}}`,
        keywords: `{{${pageName}.meta.keywords}}`
      },
      content: {
        hero: {
          title: `{{${pageName}.hero.title}}`,
          subtitle: `{{${pageName}.hero.subtitle}}`,
          description: `{{${pageName}.hero.description}}`
        },
        sections: {
          // 动态section模板
          [sectionName]: {
            title: `{{${pageName}.sections.${sectionName}.title}}`,
            description: `{{${pageName}.sections.${sectionName}.description}}`
          }
        }
      }
    };
    
    return template;
  }
  
  // 生成组件模板
  generateComponentTemplate(componentName, props) {
    const template = {};
    props.forEach(prop => {
      template[prop] = `{{${componentName}.${prop}}}`;
    });
    return template;
  }
  
  // 生成翻译键结构
  generateTranslationStructure(pageName) {
    return {
      [pageName]: {
        meta: {
          title: '',
          description: '',
          keywords: ''
        },
        hero: {
          title: '',
          subtitle: '',
          description: ''
        },
        sections: {
          // 动态section
        }
      }
    };
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'detect':
      log.header('硬编码检测');
      const detector = new HardcodeDetector();
      detector.detectInProject();
      detector.generateReport();
      break;
      
    case 'check-keys':
      log.header('翻译键完整性检查');
      const checker = new TranslationKeyChecker();
      const report = checker.checkCompleteness();
      
      log.info(`使用的翻译键: ${report.totalUsed}`);
      log.info(`可用的翻译键: ${report.totalAvailable}`);
      log.info(`完整性: ${(report.completeness * 100).toFixed(2)}%`);
      
      if (report.missingKeys.length > 0) {
        log.warning(`缺失的翻译键: ${report.missingKeys.length}`);
        report.missingKeys.forEach(key => log.warning(`  - ${key}`));
      }
      
      if (report.unusedKeys.length > 0) {
        log.warning(`未使用的翻译键: ${report.unusedKeys.length}`);
        report.unusedKeys.slice(0, 10).forEach(key => log.warning(`  - ${key}`));
        if (report.unusedKeys.length > 10) {
          log.warning(`  ... 还有 ${report.unusedKeys.length - 10} 个`);
        }
      }
      break;
      
    case 'generate-template':
      const pageName = args[1];
      if (!pageName) {
        log.error('请提供页面名称');
        process.exit(1);
      }
      
      log.header(`生成页面模板: ${pageName}`);
      const generator = new TemplateGenerator();
      const template = generator.generatePageTemplate(pageName);
      
      const templateFile = `templates/${pageName}-template.json`;
      fs.writeFileSync(templateFile, JSON.stringify(template, null, 2));
      log.success(`模板已生成: ${templateFile}`);
      break;
      
    case 'help':
    default:
      log.header('硬编码预防工具包');
      log.info('用法: node scripts/hardcode-prevention-toolkit.js <command>');
      log.info('');
      log.info('命令:');
      log.info('  detect             检测硬编码问题');
      log.info('  check-keys         检查翻译键完整性');
      log.info('  generate-template  生成页面模板');
      log.info('  help               显示帮助信息');
      break;
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  HardcodeDetector,
  TranslationKeyChecker,
  TemplateGenerator
};
