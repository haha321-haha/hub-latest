#!/usr/bin/env node

/**
 * IndexNow自动提交脚本
 * 使用根目录密钥文件配置
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// IndexNow配置
const CONFIG = {
  key: 'a3f202e9872f45238294db525b233bf5',
  host: 'www.periodhub.health',
  keyLocation: 'https://www.periodhub.health/a3f202e9872f45238294db525b233bf5.txt',
  endpoints: [
    'https://api.indexnow.org/indexnow',
    'https://yandex.com/indexnow'
  ]
};

// 要提交的URL列表
const URLS = [
  'https://www.periodhub.health/',
  'https://www.periodhub.health/zh/',
  'https://www.periodhub.health/zh/articles',
  'https://www.periodhub.health/zh/interactive-tools',
  'https://www.periodhub.health/zh/immediate-relief',
  'https://www.periodhub.health/zh/health-guide',
  'https://www.periodhub.health/zh/teen-health',
  'https://www.periodhub.health/zh/downloads',
  'https://www.periodhub.health/en/',
  'https://www.periodhub.health/en/articles',
  'https://www.periodhub.health/en/interactive-tools',
  'https://www.periodhub.health/en/immediate-relief',
  'https://www.periodhub.health/en/health-guide',
  'https://www.periodhub.health/en/teen-health',
  'https://www.periodhub.health/en/downloads'
];

async function submitToIndexNow() {
  console.log('🚀 开始IndexNow自动提交...');
  console.log(`🌐 目标网站: ${CONFIG.host}`);
  console.log(`🔑 密钥文件: ${CONFIG.keyLocation}`);
  console.log('');

  // 分批提交URL（每批最多10个）
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < URLS.length; i += batchSize) {
    batches.push(URLS.slice(i, i + batchSize));
  }

  console.log(`📦 分为 ${batches.length} 批提交`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📤 提交第 ${i + 1} 批 (${batch.length} 个URL)`);
    
    try {
      const result = await submitBatch(batch);
      if (result.success) {
        successCount += batch.length;
        console.log(`✅ 第 ${i + 1} 批提交成功`);
      } else {
        failCount += batch.length;
        console.log(`❌ 第 ${i + 1} 批提交失败: ${result.error}`);
      }
    } catch (error) {
      failCount += batch.length;
      console.log(`❌ 第 ${i + 1} 批提交失败: ${error.message}`);
    }
    
    console.log('');
    
    // 避免请求过于频繁
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 输出总结
  console.log('🎉 IndexNow自动提交完成！');
  console.log(`📈 搜索引擎将加速索引这些页面`);
  console.log(`⏰ 预计1-3天内看到索引效果`);
  console.log('');
  console.log('📊 提交统计:');
  console.log(`✅ 成功: ${successCount} 个URL`);
  console.log(`❌ 失败: ${failCount} 个URL`);
  console.log('');
  console.log('🔍 验证步骤:');
  console.log('1. 检查密钥文件: curl -s https://www.periodhub.health/a3f202e9872f45238294db525b233bf5.txt');
  console.log('2. 监控Bing Webmaster Tools状态变化');
  console.log('3. 观察搜索引擎索引速度改善');
}

function submitBatch(urlList) {
  return new Promise((resolve) => {
    const payload = {
      host: CONFIG.host,
      key: CONFIG.key,
      keyLocation: CONFIG.keyLocation,
      urlList: urlList
    };

    const postData = JSON.stringify(payload);
    
    // 尝试多个端点
    submitToEndpoint(CONFIG.endpoints[0], postData)
      .then(result => {
        if (result.success) {
          resolve(result);
        } else {
          // 如果主要端点失败，尝试备用端点
          return submitToEndpoint(CONFIG.endpoints[1], postData);
        }
      })
      .then(result => resolve(result))
      .catch(error => resolve({ success: false, error: error.message }));
  });
}

function submitToEndpoint(endpoint, postData) {
  return new Promise((resolve) => {
    console.log(`📤 正在提交到IndexNow...`);
    console.log(`🔑 使用密钥: ${CONFIG.key}`);
    console.log(`📊 提交URL数量: ${JSON.parse(postData).urlList.length}`);

    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData, 'utf8'),
        'User-Agent': 'PeriodHub-IndexNow-Submit/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        
        if (success) {
          console.log(`✅ 提交成功! 状态码: ${res.statusCode}`);
          if (responseData) {
            console.log(`📄 响应: ${responseData}`);
          }
          resolve({ success: true, statusCode: res.statusCode, response: responseData });
        } else {
          console.log(`❌ 提交失败! 状态码: ${res.statusCode}`);
          console.log(`❌ 第 1 批提交失败: HTTP ${res.statusCode}: ${responseData}`);
          resolve({ success: false, error: `HTTP ${res.statusCode}: ${responseData}` });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ 请求失败: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(30000, () => {
      console.log('⏰ 请求超时');
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// 运行提交
if (require.main === module) {
  submitToIndexNow().catch(console.error);
}

module.exports = { submitToIndexNow, CONFIG, URLS };
