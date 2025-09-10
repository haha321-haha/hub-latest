#!/usr/bin/env node

/**
 * 性能优化启动脚本
 * 自动执行关键优化步骤
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  // 优化目标
  targets: {
    mobile: {
      performance: 85, // 目标性能得分
      lcp: 2.5,       // 目标LCP (秒)
      tbt: 200,       // 目标TBT (毫秒)
      fcp: 1.8        // 目标FCP (秒)
    },
    desktop: {
      performance: 98, // 目标性能得分
      lcp: 1.0,       // 目标LCP (秒)
      tbt: 100,       // 目标TBT (毫秒)
      fcp: 0.8        // 目标FCP (秒)
    }
  },
  
  // 当前问题
  current: {
    mobile: {
      performance: 45,
      lcp: 5.0,
      tbt: 2910,
      fcp: 2.9
    },
    desktop: {
      performance: 94,
      lcp: 0.8,
      tbt: 170,
      fcp: 0.6
    }
  },
  
  // 优化文件路径
  files: {
    nextConfig: 'next.config.js',
    packageJson: 'package.json',
    tailwindConfig: 'tailwind.config.js',
    appDir: 'app',
    componentsDir: 'components',
    stylesDir: 'styles'
  }
};

// 执行命令
function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(`✅ ${description} 完成`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    return null;
  }
}

// 创建优化分支
function createOptimizationBranch() {
  console.log('🚀 创建性能优化分支...');
  
  try {
    // 检查当前分支
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    console.log(`当前分支: ${currentBranch}`);
    
    // 创建新分支
    const branchName = 'performance-optimization';
    runCommand(`git checkout -b ${branchName}`, '创建性能优化分支');
    
    return branchName;
  } catch (error) {
    console.error('❌ 创建分支失败:', error.message);
    return null;
  }
}

// 备份当前配置
function backupCurrentConfig() {
  console.log('💾 备份当前配置...');
  
  const backupDir = 'backup/performance-optimization';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const filesToBackup = [
    'next.config.js',
    'package.json',
    'tailwind.config.js'
  ];
  
  filesToBackup.forEach(file => {
    if (fs.existsSync(file)) {
      const backupFile = path.join(backupDir, `${file}.backup`);
      fs.copyFileSync(file, backupFile);
      console.log(`✅ 备份 ${file} → ${backupFile}`);
    }
  });
}

// 应用性能优化配置
function applyPerformanceOptimizations() {
  console.log('⚡ 应用性能优化配置...');
  
  // 1. 更新next.config.js
  const nextConfigContent = `
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // 编译器优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 重定向配置
  async redirects() {
    return [
      { source: '/downloads-new', destination: '/downloads', permanent: true },
      { source: '/download-center', destination: '/downloads', permanent: true },
      { source: '/articles-pdf-center', destination: '/downloads', permanent: true },
      { source: '/zh/downloads-new', destination: '/zh/downloads', permanent: true },
      { source: '/zh/download-center', destination: '/zh/downloads', permanent: true },
      { source: '/zh/articles-pdf-center', destination: '/zh/downloads', permanent: true },
      { source: '/en/downloads-new', destination: '/en/downloads', permanent: true },
      { source: '/en/download-center', destination: '/en/downloads', permanent: true },
      { source: '/en/articles-pdf-center', destination: '/en/downloads', permanent: true },
    ];
  },
  
  // 头部优化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Link',
            value: '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
  `;
  
  fs.writeFileSync(CONFIG.files.nextConfig, nextConfigContent);
  console.log('✅ 更新 next.config.js');
  
  // 2. 创建性能优化CSS
  const performanceCSS = `
/* 性能优化CSS */
/* 关键CSS内联 */
.critical-css {
  display: block;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

/* 触摸目标优化 */
.clickable {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.clickable:active {
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.clickable:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 按钮优化 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .clickable {
    min-height: 48px;
    min-width: 48px;
    padding: 16px 20px;
  }
  
  .btn {
    min-height: 48px;
    padding: 16px 28px;
    font-size: 18px;
  }
}

/* 对比度优化 */
.text-content {
  color: #1a1a1a;
  background-color: #ffffff;
}

.low-contrast-text {
  color: #333333;
  background-color: #f8f9fa;
}

/* 加载状态 */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  `;
  
  const stylesDir = CONFIG.files.stylesDir || 'styles';
  const cssFile = path.join(stylesDir, 'performance.css');
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  fs.writeFileSync(cssFile, performanceCSS);
  console.log('✅ 创建性能优化CSS');
  
  // 3. 创建性能监控脚本
  const monitoringScript = `
// 性能监控脚本
(function() {
  // 监控LCP
  function trackLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // 发送到分析工具
        if (typeof gtag !== 'undefined') {
          gtag('event', 'lcp', {
            event_category: 'performance',
            value: Math.round(lastEntry.startTime)
          });
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
  
  // 监控FCP
  function trackFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          console.log('FCP:', fcpEntry.startTime);
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'fcp', {
              event_category: 'performance',
              value: Math.round(fcpEntry.startTime)
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }
  
  // 监控CLS
  function trackCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cls', {
            event_category: 'performance',
            value: Math.round(clsValue * 1000)
          });
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  // 初始化监控
  document.addEventListener('DOMContentLoaded', function() {
    trackLCP();
    trackFCP();
    trackCLS();
  });
})();
  `;
  
  const monitoringFile = path.join(stylesDir, 'performance-monitoring.js');
  fs.writeFileSync(monitoringFile, monitoringScript);
  console.log('✅ 创建性能监控脚本');
}

// 运行性能测试
function runPerformanceTests() {
  console.log('🧪 运行性能测试...');
  
  // 构建项目
  const buildResult = runCommand('npm run build', '构建项目');
  if (!buildResult) {
    console.error('❌ 构建失败，无法继续测试');
    return false;
  }
  
  // 启动开发服务器进行测试
  console.log('🚀 启动开发服务器进行测试...');
  console.log('请在浏览器中访问 http://localhost:3000 进行性能测试');
  console.log('使用Google PageSpeed Insights测试移动端和桌面端性能');
  
  return true;
}

// 生成优化报告
function generateOptimizationReport() {
  console.log('📊 生成优化报告...');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimization: {
      mobile: {
        current: CONFIG.current.mobile,
        target: CONFIG.targets.mobile,
        improvement: {
          performance: CONFIG.targets.mobile.performance - CONFIG.current.mobile.performance,
          lcp: CONFIG.current.mobile.lcp - CONFIG.targets.mobile.lcp,
          tbt: CONFIG.current.mobile.tbt - CONFIG.targets.mobile.tbt,
          fcp: CONFIG.current.mobile.fcp - CONFIG.targets.mobile.fcp
        }
      },
      desktop: {
        current: CONFIG.current.desktop,
        target: CONFIG.targets.desktop,
        improvement: {
          performance: CONFIG.targets.desktop.performance - CONFIG.current.desktop.performance,
          lcp: CONFIG.current.desktop.lcp - CONFIG.targets.desktop.lcp,
          tbt: CONFIG.current.desktop.tbt - CONFIG.targets.desktop.tbt,
          fcp: CONFIG.current.desktop.fcp - CONFIG.targets.desktop.fcp
        }
      }
    },
    
    nextSteps: [
      '1. 测试移动端性能 (目标: 85分+)',
      '2. 测试桌面端性能 (目标: 98分+)',
      '3. 优化图片和资源加载',
      '4. 实施代码分割',
      '5. 监控性能指标变化'
    ],
    
    files: {
      nextConfig: 'next.config.js (已更新)',
      performanceCSS: 'styles/performance.css (已创建)',
      monitoringScript: 'styles/performance-monitoring.js (已创建)',
      backupDir: 'backup/performance-optimization/ (已创建)'
    }
  };
  
  const reportFile = 'performance-optimization-report.json';
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`✅ 优化报告已保存: ${reportFile}`);
  
  return report;
}

// 主函数
async function main() {
  console.log('🚀 开始性能优化实施...\n');
  
  try {
    // 1. 创建优化分支
    const branchName = createOptimizationBranch();
    if (!branchName) {
      console.error('❌ 无法创建优化分支');
      return;
    }
    
    // 2. 备份当前配置
    backupCurrentConfig();
    
    // 3. 应用性能优化
    applyPerformanceOptimizations();
    
    // 4. 运行性能测试
    const testResult = runPerformanceTests();
    if (!testResult) {
      console.error('❌ 性能测试失败');
      return;
    }
    
    // 5. 生成优化报告
    const report = generateOptimizationReport();
    
    // 6. 输出总结
    console.log('\n🎉 性能优化实施完成！');
    console.log('=' .repeat(50));
    console.log(`分支名称: ${branchName}`);
    console.log('已完成的优化:');
    console.log('- ✅ 更新 next.config.js 配置');
    console.log('- ✅ 创建性能优化CSS');
    console.log('- ✅ 创建性能监控脚本');
    console.log('- ✅ 备份原始配置');
    
    console.log('\n📋 下一步操作:');
    report.nextSteps.forEach(step => {
      console.log(`  ${step}`);
    });
    
    console.log('\n🔍 测试建议:');
    console.log('1. 访问 http://localhost:3000');
    console.log('2. 使用Google PageSpeed Insights测试');
    console.log('3. 检查移动端和桌面端性能');
    console.log('4. 验证无效点击问题是否改善');
    
    console.log('\n📊 预期效果:');
    console.log(`移动端性能: ${CONFIG.current.mobile.performance} → ${CONFIG.targets.mobile.performance} (+${report.optimization.mobile.improvement.performance})`);
    console.log(`桌面端性能: ${CONFIG.current.desktop.performance} → ${CONFIG.targets.desktop.performance} (+${report.optimization.desktop.improvement.performance})`);
    
  } catch (error) {
    console.error('❌ 性能优化实施失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createOptimizationBranch,
  backupCurrentConfig,
  applyPerformanceOptimizations,
  runPerformanceTests,
  generateOptimizationReport,
  CONFIG
};
