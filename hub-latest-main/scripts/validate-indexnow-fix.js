#!/usr/bin/env node

/**
 * IndexNow修复验证脚本
 * 按照Claude建议的步骤验证配置
 */

const https = require('https');

console.log('🔧 IndexNow修复验证脚本');
console.log('按照Claude建议的步骤验证配置\n');

// 修复后的配置
const FIXED_CONFIG = {
  host: 'www.periodhub.health',
  key: 'a3f202e9872f45238294db525b233bf5',
  keyLocation: 'https://www.periodhub.health/a3f202e9872f45238294db525b233bf5.txt',
  urlList: [
    'https://www.periodhub.health/',
    'https://www.periodhub.health/zh/'
  ]
};

async function validateFix() {
  console.log('📋 修复后的配置:');
  console.log(JSON.stringify(FIXED_CONFIG, null, 2));
  console.log('');

  // 步骤1：验证密钥文件位置
  console.log('🔍 步骤1: 验证密钥文件已移至根目录');
  await validateKeyFileLocation();

  // 步骤2：验证文件内容格式
  console.log('\n🔍 步骤2: 验证文件内容格式');
  await validateKeyFileContent();

  // 步骤3：验证URL格式
  console.log('\n🔍 步骤3: 验证URL格式标准化');
  validateUrlFormat();

  // 步骤4：测试IndexNow API
  console.log('\n🔍 步骤4: 测试IndexNow API');
  await testIndexNowAPI();

  // 步骤5：对比修复前后
  console.log('\n🔍 步骤5: 修复前后对比');
  showFixComparison();
}

function validateKeyFileLocation() {
  return new Promise((resolve) => {
    console.log(`检查新位置: ${FIXED_CONFIG.keyLocation}`);
    
    https.get(FIXED_CONFIG.keyLocation, (res) => {
      console.log(`   状态码: ${res.statusCode}`);
      console.log(`   位置: 根目录 ${res.statusCode === 200 ? '✅' : '❌'}`);
      
      if (res.statusCode === 200) {
        console.log('   ✅ 密钥文件已成功移至根目录');
      } else {
        console.log('   ❌ 密钥文件在根目录不可访问');
      }
      
      resolve();
    }).on('error', (err) => {
      console.log(`   ❌ 访问失败: ${err.message}`);
      resolve();
    });
  });
}

function validateKeyFileContent() {
  return new Promise((resolve) => {
    https.get(FIXED_CONFIG.keyLocation, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   原始内容: "${data}"`);
        console.log(`   内容长度: ${data.length} 字节`);
        console.log(`   去空白后: "${data.trim()}"`);
        console.log(`   去空白长度: ${data.trim().length} 字节`);
        
        const isExactMatch = data === FIXED_CONFIG.key;
        const isTrimMatch = data.trim() === FIXED_CONFIG.key;
        
        console.log(`   严格匹配: ${isExactMatch ? '✅' : '❌'} (无任何额外字符)`);
        console.log(`   修剪匹配: ${isTrimMatch ? '✅' : '❌'} (去除空白后匹配)`);
        
        if (isExactMatch) {
          console.log('   ✅ 文件内容格式完美');
        } else if (isTrimMatch) {
          console.log('   ⚠️  文件内容正确但有额外空白字符');
        } else {
          console.log('   ❌ 文件内容不匹配');
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`   ❌ 读取失败: ${err.message}`);
      resolve();
    });
  });
}

function validateUrlFormat() {
  console.log('检查URL格式标准化:');
  FIXED_CONFIG.urlList.forEach((url, index) => {
    console.log(`   URL ${index + 1}: ${url}`);
    
    try {
      const urlObj = new URL(url);
      console.log(`     协议: ${urlObj.protocol} ${urlObj.protocol === 'https:' ? '✅' : '❌'}`);
      console.log(`     主机: ${urlObj.hostname} ${urlObj.hostname === FIXED_CONFIG.host ? '✅' : '❌'}`);
      console.log(`     路径: ${urlObj.pathname}`);
      console.log(`     尾部斜杠: ${urlObj.pathname.endsWith('/') ? '✅' : '⚠️'}`);
    } catch (e) {
      console.log(`     ❌ URL格式无效: ${e.message}`);
    }
  });
}

function testIndexNowAPI() {
  return new Promise((resolve) => {
    console.log('提交测试URL到IndexNow API:');
    
    const postData = JSON.stringify(FIXED_CONFIG);
    console.log('请求数据:');
    console.log(postData);
    
    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData, 'utf8'),
        'User-Agent': 'PeriodHub-FixValidation/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        console.log(`\n📊 API测试结果:`);
        console.log(`状态码: ${res.statusCode}`);
        console.log(`响应: ${responseData}`);
        
        switch (res.statusCode) {
          case 200:
          case 202:
            console.log('🎉 成功！IndexNow接受了请求');
            console.log('✅ 修复生效，422错误已解决');
            break;
          case 400:
            console.log('❌ 400错误: 请求格式无效');
            break;
          case 403:
            console.log('❌ 403错误: 密钥无效');
            break;
          case 422:
            console.log('⚠️ 仍然是422错误');
            console.log('可能需要等待IndexNow服务器缓存更新');
            console.log('或者需要进一步调试');
            break;
          case 429:
            console.log('⚠️ 429错误: 请求过多，稍后重试');
            break;
          default:
            console.log(`❓ 未知状态码: ${res.statusCode}`);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`❌ 请求错误: ${error.message}`);
      resolve();
    });

    req.setTimeout(15000, () => {
      console.log('⏰ 请求超时');
      req.destroy();
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

function showFixComparison() {
  console.log('📊 修复前后对比:');
  console.log('');
  console.log('修复前配置:');
  console.log('  密钥位置: https://www.periodhub.health/.well-known/a3f202e9872f45238294db525b233bf5.txt');
  console.log('  URL格式: 混合格式，部分无尾部斜杠');
  console.log('  测试结果: 持续422错误');
  console.log('');
  console.log('修复后配置:');
  console.log('  密钥位置: https://www.periodhub.health/a3f202e9872f45238294db525b233bf5.txt');
  console.log('  URL格式: 标准化，统一尾部斜杠');
  console.log('  测试结果: 见上方API测试结果');
  console.log('');
  console.log('🎯 关键改进:');
  console.log('1. 密钥文件移至根目录（符合IndexNow官方建议）');
  console.log('2. URL格式标准化（提高兼容性）');
  console.log('3. 减少测试URL数量（避免批量提交问题）');
  console.log('');
  console.log('🚀 下一步:');
  console.log('1. 如果API测试成功，部署这些更改到生产环境');
  console.log('2. 等待1-3天观察Bing Webmaster Tools状态变化');
  console.log('3. 如果仍有问题，考虑联系IndexNow技术支持');
}

// 运行验证
validateFix().catch(console.error);