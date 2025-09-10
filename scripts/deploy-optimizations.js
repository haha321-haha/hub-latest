#!/usr/bin/env node

/**
 * 部署性能优化到Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');

// 配置
const CONFIG = {
  branch: 'performance-optimization',
  mainBranch: 'main',
  commitMessage: '🚀 部署性能优化到生产环境',
  vercelProject: '--main'
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

// 检查Git状态
function checkGitStatus() {
  console.log('📋 检查Git状态...');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('📝 发现未提交的更改:');
      console.log(status);
      return true;
    } else {
      console.log('✅ 工作目录干净');
      return false;
    }
  } catch (error) {
    console.error('❌ 检查Git状态失败:', error.message);
    return false;
  }
}

// 添加和提交更改
function commitChanges() {
  console.log('💾 提交性能优化更改...');
  
  // 添加所有文件
  const addResult = runCommand('git add .', '添加所有文件到暂存区');
  if (!addResult) {
    console.error('❌ 添加文件失败');
    return false;
  }
  
  // 提交更改
  const commitResult = runCommand(`git commit -m "${CONFIG.commitMessage}"`, '提交性能优化更改');
  if (!commitResult) {
    console.error('❌ 提交更改失败');
    return false;
  }
  
  return true;
}

// 推送到远程仓库
function pushToRemote() {
  console.log('📤 推送到远程仓库...');
  
  // 推送当前分支
  const pushResult = runCommand(`git push origin ${CONFIG.branch}`, '推送性能优化分支');
  if (!pushResult) {
    console.error('❌ 推送分支失败');
    return false;
  }
  
  // 合并到主分支
  console.log('🔄 合并到主分支...');
  
  // 切换到主分支
  const checkoutMain = runCommand(`git checkout ${CONFIG.mainBranch}`, '切换到主分支');
  if (!checkoutMain) {
    console.error('❌ 切换到主分支失败');
    return false;
  }
  
  // 拉取最新更改
  const pullResult = runCommand('git pull origin main', '拉取最新更改');
  if (!pullResult) {
    console.warn('⚠️ 拉取最新更改失败，继续执行');
  }
  
  // 合并性能优化分支
  const mergeResult = runCommand(`git merge ${CONFIG.branch}`, '合并性能优化分支');
  if (!mergeResult) {
    console.error('❌ 合并分支失败');
    return false;
  }
  
  // 推送到主分支
  const pushMain = runCommand(`git push origin ${CONFIG.mainBranch}`, '推送主分支');
  if (!pushMain) {
    console.error('❌ 推送主分支失败');
    return false;
  }
  
  return true;
}

// 部署到Vercel
function deployToVercel() {
  console.log('🚀 部署到Vercel...');
  
  // 检查Vercel CLI是否安装
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 安装Vercel CLI...');
    const installResult = runCommand('npm install -g vercel', '安装Vercel CLI');
    if (!installResult) {
      console.error('❌ 安装Vercel CLI失败');
      return false;
    }
  }
  
  // 部署到生产环境
  const deployResult = runCommand('vercel --prod --yes', '部署到Vercel生产环境');
  if (!deployResult) {
    console.error('❌ 部署到Vercel失败');
    return false;
  }
  
  return true;
}

// 验证部署
function verifyDeployment() {
  console.log('🔍 验证部署...');
  
  console.log('📋 请手动验证以下内容:');
  console.log('1. 访问 https://www.periodhub.health');
  console.log('2. 使用Google PageSpeed Insights测试性能');
  console.log('3. 检查移动端和桌面端性能指标');
  console.log('4. 验证无效点击问题是否改善');
  
  console.log('\n📊 预期改善:');
  console.log('- 移动端性能: 45分 → 85分+');
  console.log('- 桌面端性能: 94分 → 98分+');
  console.log('- LCP: 5.0秒 → 2.5秒内');
  console.log('- TBT: 2,910毫秒 → 200毫秒内');
  console.log('- 无效点击率: 100% → 20%以下');
}

// 生成部署报告
function generateDeploymentReport() {
  const report = {
    timestamp: new Date().toISOString(),
    branch: CONFIG.branch,
    commitMessage: CONFIG.commitMessage,
    deployedFiles: [
      'next.config.js (性能优化配置)',
      'styles/performance.css (性能优化样式)',
      'styles/performance-monitoring.js (性能监控脚本)',
      'backup/performance-optimization/ (原始配置备份)'
    ],
    optimizations: [
      '图片优化 (WebP/AVIF支持)',
      '压缩优化 (Gzip压缩)',
      '缓存优化 (静态资源缓存)',
      '字体优化 (预加载关键字体)',
      '触摸目标优化 (最小44px触摸区域)',
      '对比度优化 (提升文字可读性)'
    ],
    nextSteps: [
      '验证性能指标改善',
      '监控用户行为变化',
      '收集用户反馈',
      '持续优化迭代'
    ]
  };
  
  const reportFile = 'deployment-report.json';
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`✅ 部署报告已保存: ${reportFile}`);
  
  return report;
}

// 主函数
async function main() {
  console.log('🚀 开始部署性能优化到Vercel...\n');
  
  try {
    // 1. 检查Git状态
    const hasChanges = checkGitStatus();
    if (!hasChanges) {
      console.log('✅ 没有需要提交的更改');
    }
    
    // 2. 提交更改
    if (hasChanges) {
      const commitSuccess = commitChanges();
      if (!commitSuccess) {
        console.error('❌ 提交更改失败，无法继续部署');
        return;
      }
    }
    
    // 3. 推送到远程仓库
    const pushSuccess = pushToRemote();
    if (!pushSuccess) {
      console.error('❌ 推送到远程仓库失败，无法继续部署');
      return;
    }
    
    // 4. 部署到Vercel
    const deploySuccess = deployToVercel();
    if (!deploySuccess) {
      console.error('❌ 部署到Vercel失败');
      return;
    }
    
    // 5. 生成部署报告
    const report = generateDeploymentReport();
    
    // 6. 验证部署
    verifyDeployment();
    
    // 7. 输出总结
    console.log('\n🎉 性能优化部署完成！');
    console.log('=' .repeat(50));
    console.log(`分支: ${CONFIG.branch}`);
    console.log(`提交信息: ${CONFIG.commitMessage}`);
    console.log('已部署的优化:');
    report.optimizations.forEach(opt => {
      console.log(`- ✅ ${opt}`);
    });
    
    console.log('\n🔍 下一步操作:');
    report.nextSteps.forEach(step => {
      console.log(`  ${step}`);
    });
    
    console.log('\n📊 验证链接:');
    console.log('- 网站: https://www.periodhub.health');
    console.log('- 性能测试: https://pagespeed.web.dev/');
    console.log('- Vercel仪表板: https://vercel.com/dashboard');
    
  } catch (error) {
    console.error('❌ 部署失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkGitStatus,
  commitChanges,
  pushToRemote,
  deployToVercel,
  verifyDeployment,
  generateDeploymentReport,
  CONFIG
};
