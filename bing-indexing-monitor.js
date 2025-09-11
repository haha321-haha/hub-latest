#!/usr/bin/env node

/**
 * Bing索引编制监控和后续处理脚本
 * 跟踪已提交的URL索引状态
 */

const fs = require('fs');
const path = require('path');

// 已请求索引的URL列表
const submittedUrls = [
  'https://www.periodhub.health/en/privacy-policy',
  'https://www.periodhub.health/pdf-files/magnesium-gut-health-menstrual-pain-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/magnesium-gut-health-menstrual-pain-guide-en.pdf',
  'https://www.periodhub.health/pdf-files/menstrual-cycle-nutrition-plan-en.pdf',
  'https://www.periodhub.health/zh/interactive-tools/symptom-tracker',
  'https://www.periodhub.health/pdf-files/natural-therapy-assessment-zh.pdf',
  'https://www.periodhub.health/pdf-files/parent-communication-guide-en.pdf',
  'https://www.periodhub.health/pdf-files/parent-communication-guide-zh.pdf',
  'https://www.periodhub.health/pdf-files/teacher-collaboration-handbook-en.pdf',
  'https://www.periodhub.health/pdf-files/teacher-health-manual-en.pdf',
  'https://www.periodhub.health/pdf-files/healthy-habits-checklist-en.pdf',
  'https://www.periodhub.health/pdf-files/pain-tracking-form-zh.pdf',
  'https://www.periodhub.health/pdf-files/specific-menstrual-pain-management-guide-en.pdf',
  'https://www.periodhub.health/en/interactive-tools/symptom-tracker',
  'https://www.periodhub.health/en/interactive-tools',
  'https://www.periodhub.health/zh/teen-health'
];

// 生成监控报告
function generateMonitoringReport() {
  const report = {
    timestamp: new Date().toISOString(),
    totalSubmitted: submittedUrls.length,
    categories: {
      pdfFiles: submittedUrls.filter(url => url.includes('pdf-files/')).length,
      interactiveTools: submittedUrls.filter(url => url.includes('interactive-tools')).length,
      otherPages: submittedUrls.filter(url => !url.includes('pdf-files/') && !url.includes('interactive-tools')).length
    },
    urls: submittedUrls.map(url => ({
      url,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      priority: url.includes('interactive-tools') ? 'high' : 'normal',
      expectedIndexTime: '3-7 days',
      nextCheckDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3天后
    })),
    nextSteps: [
      '1. 等待3-7天让Bing处理索引请求',
      '2. 定期在Bing Webmaster Tools中检查URL状态',
      '3. 监控"站点诊断"中的重复内容报告',
      '4. 检查"搜索性能"中的索引页面数量',
      '5. 如果7天后仍有问题，重新提交URL'
    ],
    monitoringSchedule: {
      daily: '检查Bing Webmaster Tools中的URL状态',
      weekly: '查看站点诊断和搜索性能报告',
      biweekly: '重新提交仍未索引的URL'
    }
  };

  return report;
}

// 生成HTML监控面板
function generateMonitoringDashboard() {
  const report = generateMonitoringReport();
  
  let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bing索引编制监控面板</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #0078d4; color: white; padding: 20px; border-radius: 8px; }
        .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .status-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #0078d4; }
        .url-list { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .url-item { margin: 8px 0; padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #28a745; }
        .pdf-url { border-left-color: #ffc107; }
        .interactive-url { border-left-color: #dc3545; }
        .other-url { border-left-color: #6c757d; }
        .next-steps { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .schedule { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .progress-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { background: #0078d4; height: 100%; width: 0%; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Bing索引编制监控面板</h1>
        <p>跟踪已提交URL的索引状态 - ${report.timestamp}</p>
    </div>

    <div class="status-grid">
        <div class="status-card">
            <h3>📊 提交统计</h3>
            <p><strong>总URL数量:</strong> ${report.totalSubmitted}</p>
            <p><strong>PDF文件:</strong> ${report.categories.pdfFiles}</p>
            <p><strong>交互工具:</strong> ${report.categories.interactiveTools}</p>
            <p><strong>其他页面:</strong> ${report.categories.otherPages}</p>
        </div>
        
        <div class="status-card">
            <h3>⏰ 预期时间</h3>
            <p><strong>处理时间:</strong> 3-7天</p>
            <p><strong>下次检查:</strong> ${new Date(report.urls[0].nextCheckDate).toLocaleDateString()}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p style="font-size: 0.9em; color: #666;">索引编制进度</p>
        </div>
        
        <div class="status-card">
            <h3>🎯 优先级</h3>
            <p><strong>高优先级:</strong> ${report.urls.filter(u => u.priority === 'high').length} 个</p>
            <p><strong>普通优先级:</strong> ${report.urls.filter(u => u.priority === 'normal').length} 个</p>
        </div>
    </div>

    <div class="url-list">
        <h2>📋 已提交的URL列表</h2>
`;

  report.urls.forEach(item => {
    let cssClass = 'url-item';
    if (item.url.includes('pdf-files/')) cssClass += ' pdf-url';
    else if (item.url.includes('interactive-tools')) cssClass += ' interactive-url';
    else cssClass += ' other-url';
    
    html += `
        <div class="${cssClass}">
            <strong>${item.url}</strong>
            <br><small>优先级: ${item.priority === 'high' ? '高' : '普通'} | 提交时间: ${new Date(item.submittedAt).toLocaleString()}</small>
        </div>`;
  });

  html += `
    </div>

    <div class="next-steps">
        <h2>🚀 下一步操作</h2>
        <ul>
`;

  report.nextSteps.forEach(step => {
    html += `<li>${step}</li>`;
  });

  html += `
        </ul>
    </div>

    <div class="schedule">
        <h2>📅 监控计划</h2>
        <p><strong>每日:</strong> ${report.monitoringSchedule.daily}</p>
        <p><strong>每周:</strong> ${report.monitoringSchedule.weekly}</p>
        <p><strong>每两周:</strong> ${report.monitoringSchedule.biweekly}</p>
    </div>

    <script>
        // 简单的进度条动画
        function updateProgress() {
            const now = new Date();
            const startTime = new Date('${report.timestamp}');
            const expectedTime = 7 * 24 * 60 * 60 * 1000; // 7天
            const elapsed = now - startTime;
            const progress = Math.min((elapsed / expectedTime) * 100, 100);
            
            document.querySelector('.progress-fill').style.width = progress + '%';
        }
        
        updateProgress();
        setInterval(updateProgress, 60000); // 每分钟更新一次
    </script>
</body>
</html>`;

  return html;
}

// 生成检查清单
function generateChecklist() {
  const checklist = {
    title: "Bing索引编制检查清单",
    timestamp: new Date().toISOString(),
    items: [
      {
        task: "在Bing Webmaster Tools中检查URL状态",
        frequency: "每日",
        status: "已完成",
        description: "使用URL检查工具验证每个提交的URL"
      },
      {
        task: "监控站点诊断报告",
        frequency: "每周",
        status: "进行中",
        description: "查看重复内容和规范化问题是否解决"
      },
      {
        task: "检查搜索性能数据",
        frequency: "每周",
        status: "待开始",
        description: "确认索引页面数量是否增加"
      },
      {
        task: "重新提交未索引的URL",
        frequency: "每两周",
        status: "待开始",
        description: "对于7天后仍未索引的URL重新提交"
      },
      {
        task: "验证canonical标签",
        frequency: "每月",
        status: "待开始",
        description: "确保所有页面都有正确的canonical标签"
      }
    ]
  };

  return checklist;
}

// 主执行函数
function main() {
  console.log('🔍 生成Bing索引编制监控报告...\n');
  
  // 生成监控报告
  const report = generateMonitoringReport();
  fs.writeFileSync('bing-indexing-monitor.json', JSON.stringify(report, null, 2));
  console.log('✅ 已生成 bing-indexing-monitor.json');
  
  // 生成HTML监控面板
  const dashboard = generateMonitoringDashboard();
  fs.writeFileSync('bing-indexing-dashboard.html', dashboard);
  console.log('✅ 已生成 bing-indexing-dashboard.html');
  
  // 生成检查清单
  const checklist = generateChecklist();
  fs.writeFileSync('bing-indexing-checklist.json', JSON.stringify(checklist, null, 2));
  console.log('✅ 已生成 bing-indexing-checklist.json');
  
  console.log('\n📊 提交统计:');
  console.log(`- 总URL数量: ${report.totalSubmitted}`);
  console.log(`- PDF文件: ${report.categories.pdfFiles}`);
  console.log(`- 交互工具页面: ${report.categories.interactiveTools}`);
  console.log(`- 其他页面: ${report.categories.otherPages}`);
  
  console.log('\n⏰ 预期时间:');
  console.log('- 处理时间: 3-7天');
  console.log('- 下次检查: ' + new Date(report.urls[0].nextCheckDate).toLocaleDateString());
  
  console.log('\n📋 下一步操作:');
  console.log('1. 打开 bing-indexing-dashboard.html 查看监控面板');
  console.log('2. 每日在Bing Webmaster Tools中检查URL状态');
  console.log('3. 每周查看站点诊断和搜索性能报告');
  console.log('4. 7天后重新提交仍未索引的URL');
  
  console.log('\n🎯 重要提醒:');
  console.log('- PDF文件已被robots.txt排除，可能不会被索引');
  console.log('- 交互工具页面是重点，需要优先处理');
  console.log('- 定期检查canonical标签是否正确设置');
}

if (require.main === module) {
  main();
}

module.exports = { generateMonitoringReport, generateMonitoringDashboard, generateChecklist };


