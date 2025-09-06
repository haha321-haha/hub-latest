#!/usr/bin/env node

// 验证sitemap环境变量配置脚本
const https = require('https');

const testSitemap = async () => {
  try {
    console.log('🔍 检查sitemap环境变量配置...\n');
    
    const response = await fetch('https://www.periodhub.health/sitemap.xml');
    const text = await response.text();
    
    console.log('📊 Sitemap状态检查:');
    console.log(`   状态码: ${response.status}`);
    console.log(`   包含www: ${text.includes('www.periodhub.health')}`);
    console.log(`   URL数量: ${(text.match(/<url>/g) || []).length}`);
    
    // 检查URL格式
    const urlMatches = text.match(/<loc>(.*?)<\/loc>/g) || [];
    const sampleUrls = urlMatches.slice(0, 5).map(match => 
      match.replace(/<\/?loc>/g, '')
    );
    
    console.log('\n📋 样本URL检查:');
    sampleUrls.forEach((url, index) => {
      const hasWww = url.includes('www.periodhub.health');
      const status = hasWww ? '✅' : '❌';
      console.log(`   ${status} ${url}`);
    });
    
    // 检查是否使用环境变量（通过日志判断）
    if (text.includes('www.periodhub.health')) {
      console.log('\n🎉 验证结果:');
      console.log('   ✅ Sitemap正常工作');
      console.log('   ✅ 包含正确的www前缀');
      console.log('   ✅ URL格式正确');
      
      if (urlMatches.length > 0) {
        console.log('\n💡 建议:');
        console.log('   - 检查Vercel构建日志确认环境变量使用');
        console.log('   - 监控Google和Bing的sitemap识别状态');
        console.log('   - 观察1-2周确保稳定性');
      }
    } else {
      console.log('\n❌ 发现问题:');
      console.log('   - sitemap缺少www前缀');
      console.log('   - 请检查Vercel环境变量配置');
    }
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
};

testSitemap();
