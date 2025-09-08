#!/usr/bin/env node

/**
 * Period Hub 部署状态检查脚本
 * 检查网站的可用性、性能和基本功能
 */

const https = require('https');
const http = require('http');

// 配置
const CONFIG = {
  domain: 'periodhub.health',
  urls: [
    'https://periodhub.health',
    'https://periodhub.health/zh',
    'https://periodhub.health/en',
    'https://periodhub.health/zh/articles',
    'https://periodhub.health/en/articles',
    'https://periodhub.health/zh/interactive-tools',
    'https://periodhub.health/en/interactive-tools',
  ],
  timeout: 10000,
};

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

// HTTP 请求函数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, {
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': 'Period-Hub-Deployment-Checker/1.0',
      },
    }, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          statusCode: res.statusCode,
          responseTime,
          headers: res.headers,
          body: data,
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });
    
    req.on('error', (error) => {
      reject({
        url,
        error: error.message,
        success: false,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        url,
        error: 'Request timeout',
        success: false,
      });
    });
  });
}

// 检查单个 URL
async function checkUrl(url) {
  try {
    const result = await makeRequest(url);
    
    if (result.success) {
      log.success(`${url} - ${result.statusCode} (${result.responseTime}ms)`);
      
      // 检查内容
      const checks = {
        hasTitle: result.body.includes('<title>'),
        hasMetaDescription: result.body.includes('<meta name="description"'),
        hasNextJs: result.body.includes('__NEXT_DATA__'),
        hasNoErrors: !result.body.includes('Error') && !result.body.includes('404'),
      };
      
      // 显示内容检查结果
      Object.entries(checks).forEach(([check, passed]) => {
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${check}`);
      });
      
      return { url, ...result, checks };
    } else {
      log.error(`${url} - ${result.statusCode}`);
      return result;
    }
  } catch (error) {
    log.error(`${url} - ${error.error || error.message}`);
    return { url, success: false, error: error.error || error.message };
  }
}

// 检查 DNS 解析
async function checkDNS() {
  log.header('DNS 检查');
  
  try {
    const dns = require('dns').promises;
    const records = await dns.resolve4(CONFIG.domain);
    log.success(`${CONFIG.domain} 解析到: ${records.join(', ')}`);
    return true;
  } catch (error) {
    log.error(`DNS 解析失败: ${error.message}`);
    return false;
  }
}

// 检查 SSL 证书
async function checkSSL() {
  log.header('SSL 证书检查');
  
  return new Promise((resolve) => {
    const options = {
      hostname: CONFIG.domain,
      port: 443,
      method: 'GET',
      path: '/',
    };
    
    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      
      if (cert && cert.subject) {
        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        
        const isValid = now >= validFrom && now <= validTo;
        const daysUntilExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
        
        if (isValid) {
          log.success(`SSL 证书有效 (${daysUntilExpiry} 天后过期)`);
          log.info(`颁发者: ${cert.issuer.O || cert.issuer.CN}`);
          log.info(`主题: ${cert.subject.CN}`);
        } else {
          log.error('SSL 证书已过期或无效');
        }
        
        resolve(isValid);
      } else {
        log.error('无法获取 SSL 证书信息');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      log.error(`SSL 检查失败: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

// 性能检查
async function performanceCheck() {
  log.header('性能检查');
  
  const mainUrl = `https://${CONFIG.domain}`;
  try {
    const result = await makeRequest(mainUrl);
    
    if (result.success) {
      // 响应时间检查
      if (result.responseTime < 1000) {
        log.success(`响应时间优秀: ${result.responseTime}ms`);
      } else if (result.responseTime < 3000) {
        log.warning(`响应时间良好: ${result.responseTime}ms`);
      } else {
        log.error(`响应时间较慢: ${result.responseTime}ms`);
      }
      
      // 检查压缩
      const isCompressed = result.headers['content-encoding'];
      if (isCompressed) {
        log.success(`内容压缩: ${isCompressed}`);
      } else {
        log.warning('未检测到内容压缩');
      }
      
      // 检查缓存头
      const cacheControl = result.headers['cache-control'];
      if (cacheControl) {
        log.success(`缓存控制: ${cacheControl}`);
      } else {
        log.warning('未设置缓存控制头');
      }
      
      return true;
    } else {
      log.error('性能检查失败 - 无法访问主页');
      return false;
    }
  } catch (error) {
    log.error(`性能检查失败: ${error.message}`);
    return false;
  }
}

// 主检查函数
async function runChecks() {
  console.log(`${colors.magenta}Period Hub 部署状态检查${colors.reset}`);
  console.log(`检查域名: ${CONFIG.domain}`);
  console.log(`检查时间: ${new Date().toLocaleString()}\n`);
  
  const results = {
    dns: false,
    ssl: false,
    performance: false,
    urls: [],
  };
  
  // DNS 检查
  results.dns = await checkDNS();
  
  // SSL 检查
  results.ssl = await checkSSL();
  
  // URL 检查
  log.header('URL 可用性检查');
  for (const url of CONFIG.urls) {
    const result = await checkUrl(url);
    results.urls.push(result);
    
    // 添加延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 性能检查
  results.performance = await performanceCheck();
  
  // 总结报告
  log.header('检查总结');
  
  const successfulUrls = results.urls.filter(r => r.success).length;
  const totalUrls = results.urls.length;
  
  console.log(`DNS 解析: ${results.dns ? '✅' : '❌'}`);
  console.log(`SSL 证书: ${results.ssl ? '✅' : '❌'}`);
  console.log(`URL 可用性: ${successfulUrls}/${totalUrls} ${successfulUrls === totalUrls ? '✅' : '❌'}`);
  console.log(`性能检查: ${results.performance ? '✅' : '❌'}`);
  
  const allPassed = results.dns && results.ssl && (successfulUrls === totalUrls) && results.performance;
  
  if (allPassed) {
    log.success('\n🎉 所有检查通过！Period Hub 部署状态良好。');
  } else {
    log.error('\n⚠️  部分检查失败，请检查上述问题。');
  }
  
  return allPassed;
}

// 运行检查
if (require.main === module) {
  runChecks()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      log.error(`检查过程出错: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runChecks, checkUrl, checkDNS, checkSSL };
