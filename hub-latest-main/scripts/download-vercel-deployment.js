#!/usr/bin/env node

/**
 * 从Vercel下载已部署的代码
 * 用于恢复被GitHub覆盖的代码
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// 检查Vercel CLI
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log.success('Vercel CLI 已安装');
    return true;
  } catch (error) {
    log.error('Vercel CLI 未安装，请先安装: npm install -g vercel');
    return false;
  }
}

// 获取Vercel项目信息
function getVercelProjectInfo() {
  try {
    log.info('获取Vercel项目信息...');
    const output = execSync('vercel ls', { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    log.error('获取项目信息失败，请确保已登录Vercel');
    log.info('请运行: vercel login');
    return false;
  }
}

// 下载特定部署
function downloadDeployment(deploymentId) {
  try {
    log.info(`下载部署 ${deploymentId}...`);
    
    // 创建下载目录
    const downloadDir = `vercel-backup-${new Date().toISOString().split('T')[0]}`;
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
    
    // 下载部署文件
    execSync(`vercel pull ${deploymentId} --yes`, { 
      stdio: 'inherit',
      cwd: downloadDir 
    });
    
    log.success(`部署文件已下载到: ${downloadDir}`);
    return downloadDir;
  } catch (error) {
    log.error(`下载失败: ${error.message}`);
    return null;
  }
}

// 获取最新部署列表
function getDeployments() {
  try {
    log.info('获取部署列表...');
    const output = execSync('vercel ls --json', { encoding: 'utf8' });
    const deployments = JSON.parse(output);
    
    log.header('最近的部署');
    deployments.slice(0, 10).forEach((deployment, index) => {
      const date = new Date(deployment.created).toLocaleString();
      const status = deployment.state === 'READY' ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${deployment.url} (${date})`);
      console.log(`   ID: ${deployment.uid}`);
      console.log(`   状态: ${deployment.state}`);
      console.log('');
    });
    
    return deployments;
  } catch (error) {
    log.error(`获取部署列表失败: ${error.message}`);
    return [];
  }
}

// 导出部署为静态文件
function exportDeployment(deploymentId) {
  try {
    log.info(`导出部署 ${deploymentId} 为静态文件...`);
    
    const exportDir = `vercel-export-${new Date().toISOString().split('T')[0]}`;
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    
    // 使用vercel export命令
    execSync(`vercel export --output=${exportDir}`, { 
      stdio: 'inherit' 
    });
    
    log.success(`静态文件已导出到: ${exportDir}`);
    return exportDir;
  } catch (error) {
    log.error(`导出失败: ${error.message}`);
    return null;
  }
}

// 从网站下载源代码（通过source maps）
function downloadFromSourceMaps() {
  try {
    log.info('尝试从source maps下载源代码...');
    
    const sourceMapDir = `source-maps-${new Date().toISOString().split('T')[0]}`;
    if (!fs.existsSync(sourceMapDir)) {
      fs.mkdirSync(sourceMapDir);
    }
    
    // 下载常见的source map文件
    const sourceMapUrls = [
      'https://periodhub.health/_next/static/chunks/pages/_app.js.map',
      'https://periodhub.health/_next/static/chunks/pages/index.js.map',
      'https://periodhub.health/_next/static/chunks/pages/zh.js.map',
      'https://periodhub.health/_next/static/chunks/pages/en.js.map',
    ];
    
    const https = require('https');
    const fs = require('fs');
    
    sourceMapUrls.forEach((url, index) => {
      try {
        const fileName = `source-map-${index}.js.map`;
        const file = fs.createWriteStream(path.join(sourceMapDir, fileName));
        
        https.get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            log.success(`下载: ${fileName}`);
          });
        }).on('error', (err) => {
          log.warning(`下载失败: ${url} - ${err.message}`);
        });
      } catch (error) {
        log.warning(`处理 ${url} 时出错: ${error.message}`);
      }
    });
    
    return sourceMapDir;
  } catch (error) {
    log.error(`从source maps下载失败: ${error.message}`);
    return null;
  }
}

// 主函数
async function main() {
  log.header('Vercel部署代码下载工具');
  
  // 检查Vercel CLI
  if (!checkVercelCLI()) {
    return;
  }
  
  // 获取项目信息
  if (!getVercelProjectInfo()) {
    return;
  }
  
  // 获取部署列表
  const deployments = getDeployments();
  
  if (deployments.length === 0) {
    log.error('未找到任何部署');
    return;
  }
  
  // 提供选项
  console.log('\n请选择操作:');
  console.log('1. 下载最新部署');
  console.log('2. 下载特定部署');
  console.log('3. 导出为静态文件');
  console.log('4. 从source maps下载');
  console.log('5. 查看所有部署详情');
  
  // 这里可以添加交互式选择，但为了脚本化，我们默认下载最新部署
  const latestDeployment = deployments[0];
  if (latestDeployment) {
    log.info(`下载最新部署: ${latestDeployment.url}`);
    const downloadDir = downloadDeployment(latestDeployment.uid);
    
    if (downloadDir) {
      log.success(`\n🎉 代码下载完成！`);
      log.info(`下载位置: ${path.resolve(downloadDir)}`);
      log.info(`您可以查看下载的文件并手动恢复需要的代码`);
    }
  }
}

// 运行主函数
if (require.main === module) {
  main().catch((error) => {
    log.error(`执行失败: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  checkVercelCLI,
  getVercelProjectInfo,
  downloadDeployment,
  getDeployments,
  exportDeployment,
  downloadFromSourceMaps
};



