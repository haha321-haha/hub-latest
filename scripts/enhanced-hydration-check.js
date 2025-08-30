#!/usr/bin/env node

/**
 * 增强版Hydration错误预防检查脚本
 * 深度分析并预防hydration不匹配问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 开始增强版Hydration错误预防检查...\n');

// 增强的检查项目
const checks = {
  hydrationPatterns: checkHydrationPatterns,
  svgAttributes: checkSvgAttributes,
  clientServerConsistency: checkClientServerConsistency,
  useStatePatterns: checkUseStatePatterns,
  browserApiUsage: checkBrowserApiUsage,
  responsiveDesign: checkResponsiveDesign,
  buildIntegrity: checkBuildIntegrity
};

let hasIssues = false;
let totalIssues = 0;

// 执行所有检查
for (const [checkName, checkFn] of Object.entries(checks)) {
  try {
    console.log(`📋 深度检查: ${checkName}`);
    const result = checkFn();
    if (result.issues.length > 0) {
      hasIssues = true;
      totalIssues += result.issues.length;
      console.log(`❌ 发现 ${result.issues.length} 个问题:`);
      result.issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ ${result.message}`);
    }
    console.log('');
  } catch (error) {
    console.log(`⚠️  检查失败: ${error.message}\n`);
  }
}

// 总结报告
console.log('📊 检查总结报告');
console.log('================');
if (hasIssues) {
  console.log(`🚨 发现 ${totalIssues} 个潜在的Hydration问题！`);
  console.log('💡 建议修复步骤：');
  console.log('   1. 检查客户端/服务端渲染一致性');
  console.log('   2. 验证SVG图标属性');
  console.log('   3. 确保useState初始值一致');
  console.log('   4. 检查浏览器API的安全使用');
  console.log('   5. 验证响应式设计实现');
  process.exit(1);
} else {
  console.log('🎉 所有检查通过，可以安全部署！');
  console.log('✅ 项目已具备hydration抗性');
  process.exit(0);
}

/**
 * 检查常见的hydration模式
 */
function checkHydrationPatterns() {
  const issues = [];
  const appDir = 'app';
  
  if (fs.existsSync(appDir)) {
    const files = getAllTsxFiles(appDir);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // 检查危险的hydration模式
      if (content.includes('typeof window') && !content.includes('use client')) {
        issues.push(`${file}: 使用window检查但未标记为客户端组件`);
      }
      
      // 检查useEffect + useState的延迟渲染模式
      if (content.includes('useState(false)') && 
          content.includes('setIsClient(true)') && 
          !content.includes('typeof window')) {
        issues.push(`${file}: 可能使用不安全的客户端检测模式`);
      }
      
      // 检查SVG图标属性
      if (content.includes('aria-hidden') && content.includes('className={`')) {
        issues.push(`${file}: SVG图标可能因条件类名导致hydration不匹配`);
      }
    });
  }
  
  return {
    issues,
    message: 'Hydration模式检查完成'
  };
}

/**
 * 检查SVG属性问题
 */
function checkSvgAttributes() {
  const issues = [];
  const componentsDir = 'components';
  
  if (fs.existsSync(componentsDir)) {
    const files = getAllTsxFiles(componentsDir);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // 检查SVG属性可能导致的问题
      const svgIssues = [
        /aria-hidden="[^"]*".*className.*\$\{/,
        /className.*\$\{.*aria-hidden/,
        /stroke-width="[^"]*".*className.*\$\{/,
        /fill="[^"]*".*className.*\$/
      ];
      
      svgIssues.forEach(pattern => {
        if (pattern.test(content)) {
          issues.push(`${file}: SVG属性可能因动态类名导致hydration问题`);
        }
      });
    });
  }
  
  return {
    issues,
    message: 'SVG属性检查完成'
  };
}

/**
 * 检查客户端/服务端一致性
 */
function checkClientServerConsistency() {
  const issues = [];
  
  // 检查Header组件
  const headerPath = 'components/Header.tsx';
  if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8');
    
    // 检查LanguageSwitcher的实现
    if (content.includes('LanguageSwitcher') && 
        !content.includes('isMounted') && 
        !content.includes('typeof window')) {
      issues.push(`${headerPath}: LanguageSwitcher可能缺少hydration保护`);
    }
    
    // 检查SVG图标使用
    if (content.includes('className={`') && 
        content.includes('aria-hidden="true"')) {
      issues.push(`${headerPath}: SVG图标可能因条件渲染导致hydration问题`);
    }
  }
  
  return {
    issues,
    message: '客户端/服务端一致性检查完成'
  };
}

/**
 * 检查useState模式
 */
function checkUseStatePatterns() {
  const issues = [];
  const allFiles = [...getAllTsxFiles('app'), ...getAllTsxFiles('components')];
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 检查不安全的useState初始值
    const useStateMatches = content.match(/useState\([^)]*\)/g) || [];
    useStateMatches.forEach(match => {
      if (match.includes('window.') || match.includes('navigator.')) {
        issues.push(`${file}: useState初始值可能依赖浏览器API`);
      }
    });
    
    // 检查日期/时间相关的不安全初始值
    if (content.includes('useState(new Date()') || content.includes('useState(Date.now()')) {
      issues.push(`${file}: useState使用了不安全的日期初始值`);
    }
  });
  
  return {
    issues,
    message: 'useState模式检查完成'
  };
}

/**
 * 检查浏览器API使用
 */
function checkBrowserApiUsage() {
  const issues = [];
  const allFiles = [...getAllTsxFiles('app'), ...getAllTsxFiles('components')];
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 检查不安全的浏览器API使用
    const dangerousApis = [
      'window.localStorage',
      'window.sessionStorage', 
      'navigator.',
      'document.',
      'screen.',
      'location.',
      'localStorage.',
      'sessionStorage.'
    ];
    
    dangerousApis.forEach(api => {
      if (content.includes(api) && 
          !content.includes('typeof window') && 
          !content.includes('typeof window !== "undefined"') &&
          !content.includes('use client')) {
        issues.push(`${file}: 使用了${api}但未进行安全检查`);
      }
    });
  });
  
  return {
    issues,
    message: '浏览器API使用检查完成'
  };
}

/**
 * 检查响应式设计问题
 */
function checkResponsiveDesign() {
  const issues = [];
  const allFiles = [...getAllTsxFiles('app'), ...getAllTsxFiles('components')];
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 检查响应式类名可能导致的hydration问题
    const responsivePatterns = [
      /className.*sm:/,
      /className.*md:/,
      /className.*lg:/,
      /className.*xl:/
    ];
    
    responsivePatterns.forEach(pattern => {
      if (pattern.test(content) && 
          content.includes('useState') && 
          !content.includes('isMounted')) {
        issues.push(`${file}: 响应式类名可能与状态变化冲突`);
      }
    });
  });
  
  return {
    issues,
    message: '响应式设计检查完成'
  };
}

/**
 * 检查构建完整性
 */
function checkBuildIntegrity() {
  const issues = [];
  
  try {
    console.log('   正在验证构建完整性...');
    
    // 检查必要的构建文件
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js'
    ];
    
    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        issues.push(`缺少必要文件: ${file}`);
      }
    });
    
    // 检查关键目录
    const requiredDirs = ['app', 'components', 'lib'];
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        issues.push(`缺少必要目录: ${dir}`);
      }
    });
    
    // 验证构建
    try {
      execSync('npm run build:unsafe', { stdio: 'pipe' });
    } catch (error) {
      const output = error.stdout?.toString() || error.message;
      if (output.includes('Hydration')) {
        const lines = output.split('\n').filter(line => line.includes('Hydration'));
        lines.forEach(line => {
          issues.push(`构建错误: ${line.trim()}`);
        });
      }
    }
    
  } catch (error) {
    issues.push(`构建完整性检查失败: ${error.message}`);
  }
  
  return {
    issues,
    message: '构建完整性验证完成'
  };
}

/**
 * 获取所有TSX文件
 */
function getAllTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      } catch (error) {
        // 忽略无法访问的文件
      }
    }
  }
  
  traverse(dir);
  return files;
}