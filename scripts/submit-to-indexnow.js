#!/usr/bin/env node

/**
 * IndexNow URL Submission Script
 * 批量提交URL到搜索引擎进行索引
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  baseUrl: 'https://periodhub.health',
  key: 'a3f202e9872f45238294db525b233bf5',
  keyFile: 'a3f202e9872f45238294db525b233bf5.txt',
  maxUrlsPerBatch: 10000, // IndexNow限制
  searchEngines: [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ]
};

// 从sitemap获取所有URL
async function getUrlsFromSitemap() {
  try {
    const sitemapPath = path.join(__dirname, '../app/sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // 提取所有页面路径
    const pageMatches = sitemapContent.match(/['"`]\/[^'"`]*['"`]/g) || [];
    const urls = pageMatches
      .map(match => match.replace(/['"`]/g, ''))
      .filter(path => path.startsWith('/'))
      .map(path => `${CONFIG.baseUrl}${path}`)
      .filter((url, index, array) => array.indexOf(url) === index); // 去重
    
    console.log(`📋 从sitemap.ts提取到 ${urls.length} 个URL`);
    return urls;
  } catch (error) {
    console.error('❌ 读取sitemap失败:', error.message);
    return [];
  }
}

// 手动定义的重要URL列表
function getImportantUrls() {
  return [
    // 首页
    `${CONFIG.baseUrl}/zh`,
    `${CONFIG.baseUrl}/en`,
    
    // 主要功能页面
    `${CONFIG.baseUrl}/zh/interactive-tools`,
    `${CONFIG.baseUrl}/en/interactive-tools`,
    `${CONFIG.baseUrl}/zh/immediate-relief`,
    `${CONFIG.baseUrl}/en/immediate-relief`,
    `${CONFIG.baseUrl}/zh/natural-therapies`,
    `${CONFIG.baseUrl}/en/natural-therapies`,
    `${CONFIG.baseUrl}/zh/downloads`,
    `${CONFIG.baseUrl}/en/downloads`,
    `${CONFIG.baseUrl}/zh/articles`,
    `${CONFIG.baseUrl}/en/articles`,
    `${CONFIG.baseUrl}/zh/health-guide`,
    `${CONFIG.baseUrl}/en/health-guide`,
    
    // 重要文章
    `${CONFIG.baseUrl}/zh/articles/menstrual-pain-medical-guide`,
    `${CONFIG.baseUrl}/en/articles/menstrual-pain-medical-guide`,
    `${CONFIG.baseUrl}/zh/articles/anti-inflammatory-diet-period-pain`,
    `${CONFIG.baseUrl}/en/articles/anti-inflammatory-diet-period-pain`,
    `${CONFIG.baseUrl}/zh/articles/comprehensive-iud-guide`,
    `${CONFIG.baseUrl}/en/articles/comprehensive-iud-guide`,
    `${CONFIG.baseUrl}/zh/articles/heat-therapy-complete-guide`,
    `${CONFIG.baseUrl}/en/articles/heat-therapy-complete-guide`,
    `${CONFIG.baseUrl}/zh/articles/nsaid-menstrual-pain-professional-guide`,
    `${CONFIG.baseUrl}/en/articles/nsaid-menstrual-pain-professional-guide`,
  ];
}

// 提交URL到搜索引擎
async function submitToSearchEngine(searchEngine, urls) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      host: 'periodhub.health',
      key: CONFIG.key,
      urlList: urls
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(searchEngine, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          searchEngine,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          response: data
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        searchEngine,
        success: false,
        error: error.message
      });
    });

    req.write(postData);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('🚀 开始IndexNow URL提交...\n');
  
  // 获取URL列表
  const sitemapUrls = await getUrlsFromSitemap();
  const importantUrls = getImportantUrls();
  const allUrls = [...new Set([...sitemapUrls, ...importantUrls])]; // 合并并去重
  
  console.log(`📊 总共需要提交 ${allUrls.length} 个URL`);
  
  if (allUrls.length === 0) {
    console.log('❌ 没有找到需要提交的URL');
    return;
  }
  
  // 分批提交
  const batches = [];
  for (let i = 0; i < allUrls.length; i += CONFIG.maxUrlsPerBatch) {
    batches.push(allUrls.slice(i, i + CONFIG.maxUrlsPerBatch));
  }
  
  console.log(`📦 分为 ${batches.length} 个批次提交\n`);
  
  // 提交到所有搜索引擎
  for (const searchEngine of CONFIG.searchEngines) {
    console.log(`🔍 提交到 ${searchEngine}...`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`  批次 ${i + 1}/${batches.length}: ${batch.length} 个URL`);
      
      const result = await submitToSearchEngine(searchEngine, batch);
      
      if (result.success) {
        console.log(`  ✅ 成功 (状态码: ${result.status})`);
      } else {
        console.log(`  ❌ 失败: ${result.error || `状态码: ${result.status}`}`);
        if (result.response) {
          console.log(`     响应: ${result.response}`);
        }
      }
      
      // 避免请求过于频繁
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('');
  }
  
  console.log('🎉 IndexNow提交完成！');
  console.log('\n📝 注意事项:');
  console.log('- 搜索引擎可能需要几分钟到几小时来处理这些URL');
  console.log('- 可以在Google Search Console中查看索引状态');
  console.log('- 如果URL仍然未被索引，请检查内容质量和重复内容问题');
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getUrlsFromSitemap, getImportantUrls, submitToSearchEngine };
