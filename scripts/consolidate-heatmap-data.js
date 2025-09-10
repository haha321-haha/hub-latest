#!/usr/bin/env node

/**
 * 热点地图数据整合脚本
 * 合并重定向页面的用户行为数据到主页面
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 重定向映射关系
  redirects: {
    '/downloads-new': '/downloads',
    '/download-center': '/downloads', 
    '/articles-pdf-center': '/downloads',
    '/zh/downloads-new': '/zh/downloads',
    '/zh/download-center': '/zh/downloads',
    '/zh/articles-pdf-center': '/zh/downloads',
    '/en/downloads-new': '/en/downloads',
    '/en/download-center': '/en/downloads',
    '/en/articles-pdf-center': '/en/downloads'
  },
  
  // 数据文件路径
  dataDir: path.join(__dirname, '../data/heatmap'),
  outputFile: path.join(__dirname, '../data/heatmap/consolidated-data.json'),
  
  // 数据保留时间（天）
  dataRetentionDays: 90
};

// 模拟热点地图数据结构
const HEATMAP_DATA_SCHEMA = {
  page: 'string',           // 页面路径
  clicks: 'number',         // 点击次数
  scrolls: 'number',        // 滚动次数
  timeOnPage: 'number',     // 页面停留时间（秒）
  bounceRate: 'number',     // 跳出率
  deviceType: 'string',     // 设备类型
  browser: 'string',        // 浏览器
  country: 'string',        // 国家
  timestamp: 'string',      // 时间戳
  sessionId: 'string'       // 会话ID
};

// 创建示例热点地图数据
function generateSampleHeatmapData() {
  const data = [];
  const now = new Date();
  
  // 为每个重定向页面生成示例数据
  Object.keys(CONFIG.redirects).forEach(sourcePath => {
    const targetPath = CONFIG.redirects[sourcePath];
    
    // 生成过去30天的数据
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // 生成多条记录
      const recordCount = Math.floor(Math.random() * 10) + 5;
      
      for (let j = 0; j < recordCount; j++) {
        data.push({
          page: sourcePath,
          clicks: Math.floor(Math.random() * 50) + 10,
          scrolls: Math.floor(Math.random() * 100) + 20,
          timeOnPage: Math.floor(Math.random() * 300) + 30,
          bounceRate: Math.random() * 0.5 + 0.2,
          deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
          browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][Math.floor(Math.random() * 4)],
          country: ['CN', 'US', 'GB', 'CA', 'AU'][Math.floor(Math.random() * 5)],
          timestamp: date.toISOString(),
          sessionId: `session_${i}_${j}_${Math.random().toString(36).substr(2, 9)}`
        });
      }
    }
  });
  
  return data;
}

// 整合热点地图数据
function consolidateHeatmapData(rawData) {
  const consolidated = new Map();
  
  // 处理原始数据
  rawData.forEach(record => {
    const sourcePath = record.page;
    const targetPath = CONFIG.redirects[sourcePath] || sourcePath;
    
    if (!consolidated.has(targetPath)) {
      consolidated.set(targetPath, {
        page: targetPath,
        totalClicks: 0,
        totalScrolls: 0,
        totalTimeOnPage: 0,
        totalSessions: 0,
        bounceRateSum: 0,
        deviceBreakdown: {},
        browserBreakdown: {},
        countryBreakdown: {},
        dailyData: {},
        lastUpdated: new Date().toISOString(),
        sourcePages: new Set()
      });
    }
    
    const consolidatedData = consolidated.get(targetPath);
    
    // 累加数据
    consolidatedData.totalClicks += record.clicks;
    consolidatedData.totalScrolls += record.scrolls;
    consolidatedData.totalTimeOnPage += record.timeOnPage;
    consolidatedData.totalSessions += 1;
    consolidatedData.bounceRateSum += record.bounceRate;
    consolidatedData.sourcePages.add(sourcePath);
    
    // 设备类型统计
    consolidatedData.deviceBreakdown[record.deviceType] = 
      (consolidatedData.deviceBreakdown[record.deviceType] || 0) + 1;
    
    // 浏览器统计
    consolidatedData.browserBreakdown[record.browser] = 
      (consolidatedData.browserBreakdown[record.browser] || 0) + 1;
    
    // 国家统计
    consolidatedData.countryBreakdown[record.country] = 
      (consolidatedData.countryBreakdown[record.country] || 0) + 1;
    
    // 按日期统计
    const date = record.timestamp.split('T')[0];
    if (!consolidatedData.dailyData[date]) {
      consolidatedData.dailyData[date] = {
        clicks: 0,
        scrolls: 0,
        timeOnPage: 0,
        sessions: 0
      };
    }
    
    consolidatedData.dailyData[date].clicks += record.clicks;
    consolidatedData.dailyData[date].scrolls += record.scrolls;
    consolidatedData.dailyData[date].timeOnPage += record.timeOnPage;
    consolidatedData.dailyData[date].sessions += 1;
  });
  
  // 计算平均值和百分比
  const result = Array.from(consolidated.values()).map(data => {
    const avgTimeOnPage = data.totalSessions > 0 ? data.totalTimeOnPage / data.totalSessions : 0;
    const avgBounceRate = data.totalSessions > 0 ? data.bounceRateSum / data.totalSessions : 0;
    
    // 转换Set为Array
    data.sourcePages = Array.from(data.sourcePages);
    
    // 计算设备类型百分比
    const totalDeviceCount = Object.values(data.deviceBreakdown).reduce((sum, count) => sum + count, 0);
    Object.keys(data.deviceBreakdown).forEach(device => {
      data.deviceBreakdown[device] = {
        count: data.deviceBreakdown[device],
        percentage: totalDeviceCount > 0 ? (data.deviceBreakdown[device] / totalDeviceCount * 100).toFixed(2) : 0
      };
    });
    
    // 计算浏览器百分比
    const totalBrowserCount = Object.values(data.browserBreakdown).reduce((sum, count) => sum + count, 0);
    Object.keys(data.browserBreakdown).forEach(browser => {
      data.browserBreakdown[browser] = {
        count: data.browserBreakdown[browser],
        percentage: totalBrowserCount > 0 ? (data.browserBreakdown[browser] / totalBrowserCount * 100).toFixed(2) : 0
      };
    });
    
    // 计算国家百分比
    const totalCountryCount = Object.values(data.countryBreakdown).reduce((sum, count) => sum + count, 0);
    Object.keys(data.countryBreakdown).forEach(country => {
      data.countryBreakdown[country] = {
        count: data.countryBreakdown[country],
        percentage: totalCountryCount > 0 ? (data.countryBreakdown[country] / totalCountryCount * 100).toFixed(2) : 0
      };
    });
    
    return {
      ...data,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      avgBounceRate: Math.round(avgBounceRate * 100) / 100,
      totalSourcePages: data.sourcePages.length
    };
  });
  
  return result;
}

// 保存整合后的数据
function saveConsolidatedData(data) {
  // 确保数据目录存在
  if (!fs.existsSync(CONFIG.dataDir)) {
    fs.mkdirSync(CONFIG.dataDir, { recursive: true });
  }
  
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalPages: data.length,
      dataRetentionDays: CONFIG.dataRetentionDays,
      description: '整合后的热点地图数据，包含重定向页面的用户行为数据'
    },
    data: data
  };
  
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(output, null, 2));
  console.log(`✅ 整合后的热点地图数据已保存到: ${CONFIG.outputFile}`);
}

// 生成报告
function generateReport(consolidatedData) {
  console.log('\n📊 热点地图数据整合报告');
  console.log('=' .repeat(50));
  
  consolidatedData.forEach(pageData => {
    console.log(`\n📄 页面: ${pageData.page}`);
    console.log(`   📈 总点击: ${pageData.totalClicks}`);
    console.log(`   📜 总滚动: ${pageData.totalScrolls}`);
    console.log(`   ⏱️  平均停留时间: ${pageData.avgTimeOnPage}秒`);
    console.log(`   📊 平均跳出率: ${pageData.avgBounceRate}`);
    console.log(`   🔗 来源页面数: ${pageData.totalSourcePages}`);
    console.log(`   📱 设备分布:`, pageData.deviceBreakdown);
    console.log(`   🌍 国家分布:`, pageData.countryBreakdown);
  });
  
  console.log('\n✅ 热点地图数据整合完成！');
  console.log('\n📝 下一步操作:');
  console.log('1. 将整合后的数据导入到Google Analytics');
  console.log('2. 更新Bing Webmaster Tools中的页面数据');
  console.log('3. 在Google Search Console中查看页面性能');
}

// 主函数
async function main() {
  console.log('🚀 开始热点地图数据整合...\n');
  
  try {
    // 生成示例数据（实际使用时应该从真实数据源读取）
    console.log('📊 生成示例热点地图数据...');
    const rawData = generateSampleHeatmapData();
    console.log(`✅ 生成了 ${rawData.length} 条原始数据记录`);
    
    // 整合数据
    console.log('\n🔄 整合热点地图数据...');
    const consolidatedData = consolidateHeatmapData(rawData);
    console.log(`✅ 整合为 ${consolidatedData.length} 个页面的数据`);
    
    // 保存数据
    console.log('\n💾 保存整合后的数据...');
    saveConsolidatedData(consolidatedData);
    
    // 生成报告
    generateReport(consolidatedData);
    
  } catch (error) {
    console.error('❌ 热点地图数据整合失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  consolidateHeatmapData,
  generateSampleHeatmapData,
  CONFIG
};
