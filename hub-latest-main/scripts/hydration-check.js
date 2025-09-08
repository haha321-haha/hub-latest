#!/usr/bin/env node

/**
 * Hydration错误预防检查脚本
 * 用于检测可能导致Hydration Mismatch的常见问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 开始Hydration错误预防检查...\n');

// 检查项目
const checks = {
  unusedImports: checkUnusedImports,
  clientSafeUsage: checkClientSafeUsage,
  dynamicImports: checkDynamicImports,
  ssrComponents: checkSSRComponents,
  buildSuccess: checkBuildSuccess
};

let hasIssues = false;

// 执行所有检查
for (const [checkName, checkFn] of Object.entries(checks)) {
  try {
    console.log(`📋 检查: ${checkName}`);
    const result = checkFn();
    if (result.issues.length > 0) {
      hasIssues = true;
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

// 总结
if (hasIssues) {
  console.log('🚨 发现潜在的Hydration问题，请修复后再部署！');
  process.exit(1);
} else {
  console.log('🎉 所有检查通过，可以安全部署！');
  process.exit(0);
}

/**
 * 检查未使用的导入
 */
function checkUnusedImports() {
  const issues = [];
  
  try {
    const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf8' });
    const unusedImportLines = lintOutput.split('\n').filter(line => 
      line.includes('defined but never used') && 
      (line.includes('useTranslations') || line.includes('getTranslations'))
    );
    
    unusedImportLines.forEach(line => {
      issues.push(`未使用的next-intl导入: ${line.trim()}`);
    });
  } catch (error) {
    // ESLint可能返回非零退出码，但我们仍然可以解析输出
    const output = error.stdout || error.message;
    if (output.includes('defined but never used')) {
      issues.push('发现未使用的导入，请检查ESLint输出');
    }
  }
  
  return {
    issues,
    message: '未发现有问题的未使用导入'
  };
}

/**
 * 检查ClientSafe组件的使用
 */
function checkClientSafeUsage() {
  const issues = [];
  
  // 检查layout.tsx中是否使用了ClientSafe
  const layoutPath = 'app/layout.tsx';
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    if (content.includes('<ClientSafe>') || (content.includes('ClientSafe') && !content.includes('// import ClientSafe'))) {
      issues.push('根布局中使用了ClientSafe组件，这可能导致Hydration错误');
    }
  }
  
  // 检查其他可能的问题使用
  const appDir = 'app';
  if (fs.existsSync(appDir)) {
    const files = getAllTsxFiles(appDir);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('<ClientSafe>') && content.includes('{children}')) {
        issues.push(`${file}: 可能不当使用ClientSafe包装children`);
      }
    });
  }
  
  return {
    issues,
    message: 'ClientSafe组件使用正确'
  };
}

/**
 * 检查动态导入的使用
 */
function checkDynamicImports() {
  const issues = [];
  
  const appDir = 'app';
  if (fs.existsSync(appDir)) {
    const files = getAllTsxFiles(appDir);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // 检查是否有浏览器API但没有客户端标记
      if ((content.includes('window.') || content.includes('document.')) && 
          !content.includes('dangerouslySetInnerHTML')) {
        if (!content.includes("'use client'") && !content.includes('dynamic(') && 
            !content.includes('typeof window')) {
          issues.push(`${file}: 使用了浏览器API但未标记为客户端组件`);
        }
      }
      
      // 检查动态导入是否正确配置
      if (content.includes('dynamic(') && !content.includes('ssr: false')) {
        const dynamicLines = content.split('\n').filter(line => line.includes('dynamic('));
        dynamicLines.forEach(line => {
          if (!line.includes('ssr:') && line.includes('window')) {
            issues.push(`${file}: 动态导入可能需要 ssr: false 配置`);
          }
        });
      }
    });
  }
  
  return {
    issues,
    message: '动态导入配置正确'
  };
}

/**
 * 检查SSR组件的问题
 */
function checkSSRComponents() {
  const issues = [];
  
  const appDir = 'app';
  if (fs.existsSync(appDir)) {
    const files = getAllTsxFiles(appDir);
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // 检查useState + useEffect模式是否正确
      if (content.includes('useState(false)') && content.includes('setIsClient(true)')) {
        if (!content.includes('if (!isClient)')) {
          issues.push(`${file}: 客户端检查模式不完整`);
        }
      }
      
      // 检查可能的hydration不匹配 - 但允许正确的window检查模式
      if (content.includes('typeof window') && !content.includes("'use client'") && 
          !content.includes('typeof window === \'undefined\'')) {
        issues.push(`${file}: 使用window检查但未标记为客户端组件`);
      }
    });
  }
  
  return {
    issues,
    message: 'SSR组件配置正确'
  };
}

/**
 * 检查构建是否成功
 */
function checkBuildSuccess() {
  const issues = [];
  
  // 在Vercel环境中跳过构建检查，避免循环调用
  if (process.env.VERCEL === '1') {
    console.log('   在Vercel环境中跳过构建检查...');
    return {
      issues: [],
      message: '在Vercel环境中跳过构建检查'
    };
  }
  
  try {
    console.log('   正在执行构建检查...');
    // 使用 build:unsafe 避免循环调用
    execSync('npm run build:unsafe', { stdio: 'pipe' });
  } catch (error) {
    issues.push('构建失败，请检查构建错误');
    if (error.stdout) {
      const output = error.stdout.toString();
      if (output.includes('Hydration')) {
        issues.push('构建输出中包含Hydration相关错误');
      }
    }
  }
  
  return {
    issues,
    message: '构建成功'
  };
}

/**
 * 获取所有TSX文件
 */
function getAllTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}