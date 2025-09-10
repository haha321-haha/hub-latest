#!/usr/bin/env node

/**
 * 安全的硬编码URL修复脚本
 * 使用URL配置中心，防止产生新的硬编码
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
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}`),
};

// 配置
const CONFIG = {
  // 要修复的文件类型
  filePatterns: ['*.tsx', '*.ts', '*.js'],
  
  // 排除的目录
  excludeDirs: ['node_modules', '.next', 'recovery-workspace', 'hub-latest-main', 'backup'],
  
  // 替换规则
  replacements: [
    {
      // 替换硬编码的www URL为配置引用
      pattern: /https:\/\/www\.periodhub\.health/g,
      replacement: 'URL_CONFIG.baseUrl',
      import: "import { URL_CONFIG } from '@/lib/url-config';",
    },
    {
      // 替换硬编码的非www URL为配置引用
      pattern: /https:\/\/periodhub\.health/g,
      replacement: 'URL_CONFIG.baseUrl',
      import: "import { URL_CONFIG } from '@/lib/url-config';",
    },
  ],
  
  // 特殊处理规则
  specialCases: [
    {
      // 页面元数据中的canonical URL
      pattern: /canonical:\s*`https:\/\/periodhub\.health\/([^`]+)`/g,
      replacement: 'canonical: URL_CONFIG.getCanonicalUrl(\'/$1\')',
    },
    {
      // 页面元数据中的url字段
      pattern: /url:\s*`https:\/\/periodhub\.health\/([^`]+)`/g,
      replacement: 'url: URL_CONFIG.getUrl(\'/$1\')',
    },
    {
      // 多语言页面URL
      pattern: /`https:\/\/periodhub\.health\/\$\{locale\}\/([^`]+)`/g,
      replacement: 'URL_CONFIG.getPageUrl(locale, \'/$1\')',
    },
  ],
};

// 检查文件是否需要修复
function needsFix(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否包含硬编码URL
    const hasHardcoded = CONFIG.replacements.some(rule => 
      rule.pattern.test(content)
    );
    
    // 检查是否已经导入了URL_CONFIG
    const hasImport = content.includes('URL_CONFIG') || content.includes('@/lib/url-config');
    
    return hasHardcoded && !hasImport;
  } catch (error) {
    log.error(`检查文件失败: ${filePath} - ${error.message}`);
    return false;
  }
}

// 修复单个文件
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // 应用特殊处理规则
    CONFIG.specialCases.forEach(rule => {
      const matches = newContent.match(rule.pattern);
      if (matches) {
        newContent = newContent.replace(rule.pattern, rule.replacement);
        hasChanges = true;
        log.info(`应用特殊规则: ${rule.pattern.toString()}`);
      }
    });
    
    // 应用通用替换规则
    CONFIG.replacements.forEach(rule => {
      const matches = newContent.match(rule.pattern);
      if (matches) {
        newContent = newContent.replace(rule.pattern, rule.replacement);
        hasChanges = true;
        log.info(`应用替换规则: ${rule.pattern.toString()}`);
      }
    });
    
    // 添加必要的导入
    if (hasChanges && !newContent.includes('URL_CONFIG')) {
      // 查找合适的位置添加导入
      const importMatch = newContent.match(/import.*from.*['"]@\/lib\/url-config['"];?/);
      if (!importMatch) {
        // 在文件顶部添加导入
        const lines = newContent.split('\n');
        let insertIndex = 0;
        
        // 找到最后一个import语句的位置
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            insertIndex = i + 1;
          }
        }
        
        lines.splice(insertIndex, 0, "import { URL_CONFIG } from '@/lib/url-config';");
        newContent = lines.join('\n');
      }
    }
    
    if (hasChanges) {
      // 备份原文件
      fs.writeFileSync(`${filePath}.backup`, content);
      
      // 写入修复后的内容
      fs.writeFileSync(filePath, newContent);
      
      log.success(`✅ 修复完成: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    log.error(`修复文件失败: ${filePath} - ${error.message}`);
    return false;
  }
}

// 扫描并修复目录
function scanAndFixDirectory(dirPath) {
  const results = {
    total: 0,
    fixed: 0,
    errors: 0,
  };
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (CONFIG.excludeDirs.includes(item)) {
          continue;
        }
        
        // 递归扫描子目录
        const subResults = scanAndFixDirectory(fullPath);
        results.total += subResults.total;
        results.fixed += subResults.fixed;
        results.errors += subResults.errors;
      } else if (stat.isFile()) {
        // 检查文件类型
        const ext = path.extname(item);
        if (['.tsx', '.ts', '.js'].includes(ext)) {
          results.total++;
          
          if (needsFix(fullPath)) {
            if (fixFile(fullPath)) {
              results.fixed++;
            } else {
              results.errors++;
            }
          }
        }
      }
    }
  } catch (error) {
    log.error(`扫描目录失败: ${dirPath} - ${error.message}`);
    results.errors++;
  }
  
  return results;
}

// 验证修复结果
function validateFix() {
  log.header('验证修复结果');
  
  try {
    // 运行硬编码检测脚本
    execSync('node scripts/detect-hardcoded-urls.js', { stdio: 'pipe' });
    log.success('✅ 验证通过：没有发现新的硬编码URL');
    return true;
  } catch (error) {
    log.error('❌ 验证失败：仍然存在硬编码URL');
    return false;
  }
}

// 主函数
function main() {
  log.header('开始安全修复硬编码URL');
  
  const startTime = Date.now();
  const results = scanAndFixDirectory('.');
  const endTime = Date.now();
  
  log.header('修复结果统计');
  log.info(`总文件数: ${results.total}`);
  log.success(`修复成功: ${results.fixed}`);
  log.error(`修复失败: ${results.errors}`);
  log.info(`耗时: ${endTime - startTime}ms`);
  
  // 验证修复结果
  if (results.fixed > 0) {
    if (validateFix()) {
      log.success('🎉 所有硬编码URL已成功修复！');
    } else {
      log.error('❌ 修复验证失败，请检查结果');
      process.exit(1);
    }
  } else {
    log.info('ℹ️ 没有发现需要修复的文件');
  }
}

// 运行修复
if (require.main === module) {
  main();
}

module.exports = { fixFile, scanAndFixDirectory, validateFix };
