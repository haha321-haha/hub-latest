#!/usr/bin/env node

/**
 * 将热点地图JSON数据转换为Google Analytics CSV格式
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  inputFile: path.join(__dirname, '../data/heatmap/consolidated-data.json'),
  outputDir: path.join(__dirname, '../data/heatmap/csv'),
  
  // Google Analytics CSV格式配置
  ga4Formats: {
    // 事件数据格式
    events: {
      filename: 'heatmap-events.csv',
      headers: ['event_name', 'event_timestamp', 'page_location', 'page_title', 'custom_parameters'],
      mapping: {
        event_name: 'pdf_interaction',
        event_timestamp: 'timestamp',
        page_location: 'page',
        page_title: 'page_title',
        custom_parameters: 'device_type,browser,country,clicks,scrolls,time_on_page'
      }
    },
    
    // 用户数据格式
    users: {
      filename: 'heatmap-users.csv',
      headers: ['user_id', 'device_type', 'browser', 'country', 'total_clicks', 'total_scrolls', 'avg_time_on_page'],
      mapping: {
        user_id: 'sessionId',
        device_type: 'deviceType',
        browser: 'browser',
        country: 'country',
        total_clicks: 'clicks',
        total_scrolls: 'scrolls',
        avg_time_on_page: 'timeOnPage'
      }
    }
  }
};

// 读取JSON数据
function readJsonData() {
  try {
    const data = fs.readFileSync(CONFIG.inputFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ 读取JSON数据失败:', error.message);
    return null;
  }
}

// 转换为事件数据CSV
function convertToEventsCSV(jsonData) {
  const events = [];
  
  jsonData.data.forEach(pageData => {
    // 为每个页面生成事件数据
    const eventCount = Math.min(pageData.totalClicks, 100); // 限制事件数量
    
    for (let i = 0; i < eventCount; i++) {
      events.push({
        event_name: 'pdf_interaction',
        event_timestamp: new Date().toISOString(),
        page_location: `https://www.periodhub.health${pageData.page}`,
        page_title: `PDF Downloads - ${pageData.page}`,
        custom_parameters: JSON.stringify({
          device_type: Object.keys(pageData.deviceBreakdown)[i % Object.keys(pageData.deviceBreakdown).length],
          browser: Object.keys(pageData.browserBreakdown)[i % Object.keys(pageData.browserBreakdown).length],
          country: Object.keys(pageData.countryBreakdown)[i % Object.keys(pageData.countryBreakdown).length],
          clicks: Math.floor(pageData.totalClicks / eventCount),
          scrolls: Math.floor(pageData.totalScrolls / eventCount),
          time_on_page: pageData.avgTimeOnPage
        })
      });
    }
  });
  
  return events;
}

// 转换为用户数据CSV
function convertToUsersCSV(jsonData) {
  const users = [];
  
  jsonData.data.forEach(pageData => {
    // 为每个页面生成用户数据
    const userCount = Math.min(pageData.totalSessions, 50); // 限制用户数量
    
    for (let i = 0; i < userCount; i++) {
      const deviceTypes = Object.keys(pageData.deviceBreakdown);
      const browsers = Object.keys(pageData.browserBreakdown);
      const countries = Object.keys(pageData.countryBreakdown);
      
      users.push({
        user_id: `user_${pageData.page.replace(/\//g, '_')}_${i}`,
        device_type: deviceTypes[i % deviceTypes.length],
        browser: browsers[i % browsers.length],
        country: countries[i % countries.length],
        total_clicks: Math.floor(pageData.totalClicks / userCount),
        total_scrolls: Math.floor(pageData.totalScrolls / userCount),
        avg_time_on_page: pageData.avgTimeOnPage
      });
    }
  });
  
  return users;
}

// 生成CSV内容
function generateCSV(data, headers) {
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // 转义CSV中的特殊字符
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

// 保存CSV文件
function saveCSV(content, filename) {
  // 确保输出目录存在
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const filepath = path.join(CONFIG.outputDir, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ CSV文件已保存: ${filepath}`);
  
  return filepath;
}

// 主函数
async function main() {
  console.log('🔄 开始转换热点地图数据为Google Analytics CSV格式...\n');
  
  try {
    // 读取JSON数据
    const jsonData = readJsonData();
    if (!jsonData) {
      console.error('❌ 无法读取JSON数据');
      return;
    }
    
    console.log(`📊 处理 ${jsonData.data.length} 个页面的数据`);
    
    // 转换为事件数据
    console.log('\n📈 生成事件数据CSV...');
    const eventsData = convertToEventsCSV(jsonData);
    const eventsCSV = generateCSV(eventsData, CONFIG.ga4Formats.events.headers);
    const eventsFile = saveCSV(eventsCSV, CONFIG.ga4Formats.events.filename);
    
    // 转换为用户数据
    console.log('\n👥 生成用户数据CSV...');
    const usersData = convertToUsersCSV(jsonData);
    const usersCSV = generateCSV(usersData, CONFIG.ga4Formats.users.headers);
    const usersFile = saveCSV(usersCSV, CONFIG.ga4Formats.users.filename);
    
    // 生成导入说明
    const importGuide = `
# Google Analytics 数据导入说明

## 生成的文件：
1. **事件数据**: ${path.basename(eventsFile)}
   - 包含PDF交互事件数据
   - 可用于分析用户行为模式
   
2. **用户数据**: ${path.basename(usersFile)}
   - 包含用户属性和行为数据
   - 可用于用户细分和个性化

## 导入步骤：
1. 访问 Google Analytics > 管理 > 数据导入
2. 选择 "自定义事件数据" 或 "用户数据"
3. 上传对应的CSV文件
4. 配置字段映射
5. 提交导入

## 注意事项：
- 确保CSV文件格式正确
- 字段映射要与GA4架构匹配
- 导入后需要等待处理时间
    `;
    
    const guideFile = path.join(CONFIG.outputDir, 'import-guide.md');
    fs.writeFileSync(guideFile, importGuide, 'utf8');
    console.log(`✅ 导入说明已保存: ${guideFile}`);
    
    console.log('\n🎉 CSV转换完成！');
    console.log(`📁 输出目录: ${CONFIG.outputDir}`);
    
  } catch (error) {
    console.error('❌ CSV转换失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  convertToEventsCSV,
  convertToUsersCSV,
  generateCSV,
  CONFIG
};
