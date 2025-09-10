#!/usr/bin/env node

/**
 * 硬编码URL检测脚本
 * 在修复过程中持续监控，防止产生新的硬编码
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
  // 要检查的文件类型
  filePatterns: ['*.tsx', '*.ts', '*.js', '*.json'],
  
  // 排除的目录
  excludeDirs: ['node_modules', '.next', 'recovery-workspace', 'hub-latest-main', 'backup'],
  
  // 硬编码URL模式
  hardcodedPatterns: [
    /https:\/\/periodhub\.health/g,
    /https:\/\/www\.periodhub\.health/g,
  ],
  
  // 允许的硬编码模式（在特定上下文中）
  allowedPatterns: [
    // 在注释中的URL
    /\/\/.*https:\/\/periodhub\.health/g,
    /\/\*.*https:\/\/periodhub\.health.*\*\//g,
    // 在字符串模板中的环境变量
    /`.*\$\{.*BASE_URL.*\}.*`/g,
  ],
};

// 检查单个文件
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    CONFIG.hardcodedPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // 检查是否在允许的上下文中
          const isAllowed = CONFIG.allowedPatterns.some(allowedPattern => 
            allowedPattern.test(content)
          );
          
          if (!isAllowed) {
            issues.push({
              type: 'hardcoded_url',
              pattern: pattern.toString(),
              match: match,
              line: getLineNumber(content, match),
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    log.error(`读取文件失败: ${filePath} - ${error.message}`);
    return [];
  }
}

// 获取行号
function getLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return 0;
}

// 扫描目录
function scanDirectory(dirPath) {
  const results = [];
  
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
        results.push(...scanDirectory(fullPath));
      } else if (stat.isFile()) {
        // 检查文件类型
        const ext = path.extname(item);
        if (['.tsx', '.ts', '.js', '.json'].includes(ext)) {
          const issues = checkFile(fullPath);
          if (issues.length > 0) {
            results.push({
              file: fullPath,
              issues: issues,
            });
          }
        }
      }
    }
  } catch (error) {
    log.error(`扫描目录失败: ${dirPath} - ${error.message}`);
  }
  
  return results;
}

// 生成报告
function generateReport(results) {
  log.header('硬编码URL检测报告');
  
  if (results.length === 0) {
    log.success('✅ 没有发现硬编码URL问题');
    return;
  }
  
  log.warning(`⚠️ 发现 ${results.length} 个文件包含硬编码URL`);
  
  results.forEach(({ file, issues }) => {
    log.error(`\n📁 文件: ${file}`);
    issues.forEach(issue => {
      log.error(`  第${issue.line}行: ${issue.match}`);
    });
  });
  
  log.warning('\n🔧 建议修复方法:');
  log.info('1. 使用 lib/url-config.ts 中的配置');
  log.info('2. 使用环境变量 process.env.NEXT_PUBLIC_BASE_URL');
  log.info('3. 使用 URL_CONFIG.getUrl() 函数生成URL');
}

// 主函数
function main() {
  log.header('开始硬编码URL检测');
  
  const startTime = Date.now();
  const results = scanDirectory('.');
  const endTime = Date.now();
  
  generateReport(results);
  
  log.info(`\n⏱️ 检测完成，耗时: ${endTime - startTime}ms`);
  
  // 如果有问题，退出码为1
  if (results.length > 0) {
    process.exit(1);
  }
}

// 运行检测
if (require.main === module) {
  main();
}

module.exports = { checkFile, scanDirectory, generateReport };
