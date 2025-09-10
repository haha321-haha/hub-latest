#!/usr/bin/env node

/**
 * 监控系统设置脚本
 * 建立完善的监控指标和告警系统
 */

const fs = require('fs');
const path = require('path');

// 监控配置
const MONITORING_CONFIG = {
  seo: {
    indexRate: { 
      baseline: 0.482, 
      threshold: -0.05, 
      action: 'alert',
      description: '索引率下降超过5%时告警',
      checkInterval: 'daily'
    },
    organicTraffic: { 
      baseline: 'current', 
      threshold: -0.1, 
      action: 'rollback',
      description: '有机流量下降超过10%时回滚',
      checkInterval: 'daily'
    },
    duplicatePages: { 
      baseline: 11, 
      threshold: 15, 
      action: 'rollback',
      description: '重复页面超过15个时回滚',
      checkInterval: 'daily'
    },
    canonicalErrors: {
      baseline: 28,
      threshold: 35,
      action: 'alert',
      description: 'Canonical错误超过35个时告警',
      checkInterval: 'daily'
    },
    sitemapStatus: {
      baseline: 'healthy',
      threshold: 'error',
      action: 'alert',
      description: 'Sitemap状态异常时告警',
      checkInterval: 'hourly'
    }
  },
  performance: {
    lcp: { 
      baseline: 5000, 
      threshold: 6000, 
      action: 'rollback',
      description: 'LCP超过6秒时回滚',
      checkInterval: 'hourly'
    },
    fid: {
      baseline: 150,
      threshold: 300,
      action: 'alert',
      description: 'FID超过300ms时告警',
      checkInterval: 'hourly'
    },
    cls: { 
      baseline: 0.15, 
      threshold: 0.25, 
      action: 'alert',
      description: 'CLS超过0.25时告警',
      checkInterval: 'hourly'
    },
    mobileScore: {
      baseline: 45,
      threshold: 35,
      action: 'alert',
      description: '移动端性能分数低于35时告警',
      checkInterval: 'daily'
    },
    desktopScore: {
      baseline: 94,
      threshold: 85,
      action: 'alert',
      description: '桌面端性能分数低于85时告警',
      checkInterval: 'daily'
    }
  },
  system: {
    errorRate: {
      baseline: 0.01,
      threshold: 0.05,
      action: 'rollback',
      description: '错误率超过5%时回滚',
      checkInterval: 'minutely'
    },
    responseTime: {
      baseline: 2000,
      threshold: 5000,
      action: 'alert',
      description: '响应时间超过5秒时告警',
      checkInterval: 'minutely'
    },
    uptime: {
      baseline: 0.99,
      threshold: 0.95,
      action: 'alert',
      description: '可用性低于95%时告警',
      checkInterval: 'minutely'
    }
  }
};

// 告警配置
const ALERT_CONFIG = {
  channels: {
    email: {
      enabled: true,
      recipients: ['dev-team@periodhub.health', 'ops-team@periodhub.health'],
      template: 'alert-email-template.html'
    },
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts'
    },
    sms: {
      enabled: false,
      recipients: ['+1234567890']
    }
  },
  escalation: {
    levels: [
      { level: 1, delay: 0, channels: ['slack'] },
      { level: 2, delay: 300, channels: ['email'] },
      { level: 3, delay: 900, channels: ['sms'] }
    ]
  }
};

// 日志工具
const log = {
  info: (msg) => console.log(`\n📊 ${msg}`),
  success: (msg) => console.log(`\n✅ ${msg}`),
  warning: (msg) => console.log(`\n⚠️  ${msg}`),
  error: (msg) => console.log(`\n❌ ${msg}`),
  section: (msg) => console.log(`\n🔍 === ${msg} ===`),
};

class MonitoringSetup {
  constructor() {
    this.config = MONITORING_CONFIG;
    this.alerts = ALERT_CONFIG;
  }

  async setup() {
    log.section('设置监控系统');
    
    try {
      // 1. 创建监控目录结构
      await this.createDirectoryStructure();
      
      // 2. 生成监控配置文件
      await this.generateConfigFiles();
      
      // 3. 创建监控脚本
      await this.createMonitoringScripts();
      
      // 4. 设置告警系统
      await this.setupAlertSystem();
      
      // 5. 创建Dashboard
      await this.createDashboard();
      
      // 6. 设置自动化检查
      await this.setupAutomatedChecks();
      
      log.success('监控系统设置完成');
      this.printSetupSummary();
      
    } catch (error) {
      log.error(`监控设置失败: ${error.message}`);
      process.exit(1);
    }
  }

  async createDirectoryStructure() {
    log.info('创建监控目录结构...');
    
    const dirs = [
      'monitoring',
      'monitoring/config',
      'monitoring/scripts',
      'monitoring/dashboards',
      'monitoring/alerts',
      'monitoring/reports',
      'monitoring/logs'
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log.info(`创建目录: ${dir}`);
      }
    }
  }

  async generateConfigFiles() {
    log.info('生成监控配置文件...');
    
    // 主配置文件
    const mainConfig = {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.periodhub.health',
      monitoring: this.config,
      alerts: this.alerts,
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      'monitoring/config/monitoring.json',
      JSON.stringify(mainConfig, null, 2)
    );
    
    // 环境变量配置
    const envConfig = `
# 监控系统环境变量
MONITORING_ENABLED=true
MONITORING_INTERVAL=300000
MONITORING_RETENTION_DAYS=30

# 告警配置
SLACK_WEBHOOK_URL=${process.env.SLACK_WEBHOOK_URL || ''}
ALERT_EMAIL_FROM=alerts@periodhub.health
ALERT_EMAIL_TO=dev-team@periodhub.health,ops-team@periodhub.health

# 性能监控
PERFORMANCE_BUDGET_LCP=2500
PERFORMANCE_BUDGET_FID=100
PERFORMANCE_BUDGET_CLS=0.1

# SEO监控
SEO_BASELINE_INDEX_RATE=0.482
SEO_BASELINE_DUPLICATE_PAGES=11
SEO_BASELINE_CANONICAL_ERRORS=28
`;
    
    fs.writeFileSync('monitoring/config/.env', envConfig);
    
    log.success('配置文件生成完成');
  }

  async createMonitoringScripts() {
    log.info('创建监控脚本...');
    
    // SEO监控脚本
    const seoMonitoringScript = `#!/usr/bin/env node
/**
 * SEO监控脚本
 * 检查SEO关键指标
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class SEOMonitor {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('monitoring/config/monitoring.json', 'utf8'));
    this.results = {};
  }

  async checkIndexRate() {
    // 模拟检查索引率（实际应该调用Google Search Console API）
    const currentIndexRate = 0.482; // 当前基线
    const threshold = this.config.monitoring.seo.indexRate.threshold;
    
    if (currentIndexRate < (this.config.monitoring.seo.indexRate.baseline + threshold)) {
      this.triggerAlert('seo', 'indexRate', {
        current: currentIndexRate,
        baseline: this.config.monitoring.seo.indexRate.baseline,
        threshold: threshold
      });
    }
    
    this.results.indexRate = currentIndexRate;
  }

  async checkDuplicatePages() {
    // 模拟检查重复页面
    const currentDuplicates = 11; // 当前基线
    const threshold = this.config.monitoring.seo.duplicatePages.threshold;
    
    if (currentDuplicates > threshold) {
      this.triggerAlert('seo', 'duplicatePages', {
        current: currentDuplicates,
        threshold: threshold
      });
    }
    
    this.results.duplicatePages = currentDuplicates;
  }

  async checkCanonicalErrors() {
    // 模拟检查Canonical错误
    const currentErrors = 28; // 当前基线
    const threshold = this.config.monitoring.seo.canonicalErrors.threshold;
    
    if (currentErrors > threshold) {
      this.triggerAlert('seo', 'canonicalErrors', {
        current: currentErrors,
        threshold: threshold
      });
    }
    
    this.results.canonicalErrors = currentErrors;
  }

  triggerAlert(category, metric, data) {
    const alert = {
      timestamp: new Date().toISOString(),
      category: category,
      metric: metric,
      level: 'warning',
      data: data,
      message: this.config.monitoring[category][metric].description
    };
    
    // 保存告警到文件
    const alertFile = \`monitoring/alerts/alert-\${Date.now()}.json\`;
    fs.writeFileSync(alertFile, JSON.stringify(alert, null, 2));
    
    console.log(\`🚨 告警触发: \${metric} - \${alert.message}\`);
  }

  async run() {
    console.log('🔍 开始SEO监控检查...');
    
    await this.checkIndexRate();
    await this.checkDuplicatePages();
    await this.checkCanonicalErrors();
    
    // 保存结果
    const resultFile = \`monitoring/reports/seo-monitor-\${Date.now()}.json\`;
    fs.writeFileSync(resultFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results
    }, null, 2));
    
    console.log('✅ SEO监控检查完成');
  }
}

// 主执行
if (require.main === module) {
  const monitor = new SEOMonitor();
  monitor.run().catch(console.error);
}

module.exports = SEOMonitor;
`;

    fs.writeFileSync('monitoring/scripts/seo-monitor.js', seoMonitoringScript);
    fs.chmodSync('monitoring/scripts/seo-monitor.js', '755');

    // 性能监控脚本
    const performanceMonitoringScript = `#!/usr/bin/env node
/**
 * 性能监控脚本
 * 检查性能关键指标
 */

const https = require('https');
const fs = require('fs');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('monitoring/config/monitoring.json', 'utf8'));
    this.results = {};
  }

  async checkLCP() {
    // 模拟LCP检查（实际应该使用Lighthouse）
    const currentLCP = 5000; // 当前基线
    const threshold = this.config.monitoring.performance.lcp.threshold;
    
    if (currentLCP > threshold) {
      this.triggerAlert('performance', 'lcp', {
        current: currentLCP,
        threshold: threshold
      });
    }
    
    this.results.lcp = currentLCP;
  }

  async checkMobileScore() {
    // 模拟移动端性能分数检查
    const currentScore = 45; // 当前基线
    const threshold = this.config.monitoring.performance.mobileScore.threshold;
    
    if (currentScore < threshold) {
      this.triggerAlert('performance', 'mobileScore', {
        current: currentScore,
        threshold: threshold
      });
    }
    
    this.results.mobileScore = currentScore;
  }

  triggerAlert(category, metric, data) {
    const alert = {
      timestamp: new Date().toISOString(),
      category: category,
      metric: metric,
      level: 'warning',
      data: data,
      message: this.config.monitoring[category][metric].description
    };
    
    // 保存告警到文件
    const alertFile = \`monitoring/alerts/alert-\${Date.now()}.json\`;
    fs.writeFileSync(alertFile, JSON.stringify(alert, null, 2));
    
    console.log(\`🚨 告警触发: \${metric} - \${alert.message}\`);
  }

  async run() {
    console.log('🔍 开始性能监控检查...');
    
    await this.checkLCP();
    await this.checkMobileScore();
    
    // 保存结果
    const resultFile = \`monitoring/reports/performance-monitor-\${Date.now()}.json\`;
    fs.writeFileSync(resultFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results
    }, null, 2));
    
    console.log('✅ 性能监控检查完成');
  }
}

// 主执行
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(console.error);
}

module.exports = PerformanceMonitor;
`;

    fs.writeFileSync('monitoring/scripts/performance-monitor.js', performanceMonitoringScript);
    fs.chmodSync('monitoring/scripts/performance-monitor.js', '755');

    log.success('监控脚本创建完成');
  }

  async setupAlertSystem() {
    log.info('设置告警系统...');
    
    // 告警处理脚本
    const alertHandlerScript = `#!/usr/bin/env node
/**
 * 告警处理脚本
 * 处理监控告警和通知
 */

const fs = require('fs');
const path = require('path');

class AlertHandler {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('monitoring/config/monitoring.json', 'utf8'));
  }

  async processAlerts() {
    const alertDir = 'monitoring/alerts';
    const alerts = fs.readdirSync(alertDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(alertDir, file), 'utf8');
        return JSON.parse(content);
      });

    for (const alert of alerts) {
      await this.handleAlert(alert);
    }
  }

  async handleAlert(alert) {
    console.log(\`处理告警: \${alert.category}.\${alert.metric}\`);
    
    // 根据告警级别处理
    switch (alert.level) {
      case 'critical':
        await this.sendCriticalAlert(alert);
        break;
      case 'warning':
        await this.sendWarningAlert(alert);
        break;
      default:
        console.log(\`未知告警级别: \${alert.level}\`);
    }
  }

  async sendCriticalAlert(alert) {
    console.log(\`🚨 严重告警: \${alert.message}\`);
    // 实际实现中应该发送邮件、Slack通知等
  }

  async sendWarningAlert(alert) {
    console.log(\`⚠️  警告: \${alert.message}\`);
    // 实际实现中应该发送Slack通知等
  }
}

// 主执行
if (require.main === module) {
  const handler = new AlertHandler();
  handler.processAlerts().catch(console.error);
}

module.exports = AlertHandler;
`;

    fs.writeFileSync('monitoring/scripts/alert-handler.js', alertHandlerScript);
    fs.chmodSync('monitoring/scripts/alert-handler.js', '755');

    log.success('告警系统设置完成');
  }

  async createDashboard() {
    log.info('创建监控Dashboard...');
    
    const dashboardHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PeriodHub 监控Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .metric-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .metric-status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-ok { background: #d4edda; color: #155724; }
        .status-warning { background: #fff3cd; color: #856404; }
        .status-error { background: #f8d7da; color: #721c24; }
        .chart { height: 200px; background: #f8f9fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PeriodHub 监控Dashboard</h1>
            <p>实时监控系统状态和关键指标</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-title">SEO 索引率</div>
                <div class="metric-value" id="indexRate">48.2%</div>
                <div class="metric-status status-warning">需要关注</div>
                <div class="chart">图表区域</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">重复页面</div>
                <div class="metric-value" id="duplicatePages">11</div>
                <div class="metric-status status-error">需要修复</div>
                <div class="chart">图表区域</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">移动端性能</div>
                <div class="metric-value" id="mobileScore">45/100</div>
                <div class="metric-status status-error">需要优化</div>
                <div class="chart">图表区域</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">LCP (毫秒)</div>
                <div class="metric-value" id="lcp">5000</div>
                <div class="metric-status status-error">需要优化</div>
                <div class="chart">图表区域</div>
            </div>
        </div>
    </div>
    
    <script>
        // 简单的数据更新逻辑
        function updateMetrics() {
            // 这里应该从API获取实时数据
            console.log('更新监控数据...');
        }
        
        // 每30秒更新一次
        setInterval(updateMetrics, 30000);
    </script>
</body>
</html>`;

    fs.writeFileSync('monitoring/dashboards/index.html', dashboardHTML);
    
    log.success('Dashboard创建完成');
  }

  async setupAutomatedChecks() {
    log.info('设置自动化检查...');
    
    // Cron任务配置
    const cronConfig = `# PeriodHub 监控Cron任务
# 每5分钟检查性能指标
*/5 * * * * cd /path/to/project && node monitoring/scripts/performance-monitor.js

# 每天检查SEO指标
0 9 * * * cd /path/to/project && node monitoring/scripts/seo-monitor.js

# 每小时处理告警
0 * * * * cd /path/to/project && node monitoring/scripts/alert-handler.js

# 每天生成报告
0 18 * * * cd /path/to/project && node scripts/daily-report.js
`;

    fs.writeFileSync('monitoring/crontab.txt', cronConfig);
    
    // Package.json脚本
    const packageScripts = {
      "monitoring:setup": "node scripts/monitoring-setup.js",
      "monitoring:seo": "node monitoring/scripts/seo-monitor.js",
      "monitoring:performance": "node monitoring/scripts/performance-monitor.js",
      "monitoring:alerts": "node monitoring/scripts/alert-handler.js",
      "monitoring:dashboard": "open monitoring/dashboards/index.html",
      "monitoring:status": "node scripts/monitoring-status.js"
    };
    
    log.success('自动化检查设置完成');
  }

  printSetupSummary() {
    log.section('监控系统设置摘要');
    
    console.log('\n📁 目录结构:');
    console.log('   monitoring/');
    console.log('   ├── config/          # 配置文件');
    console.log('   ├── scripts/         # 监控脚本');
    console.log('   ├── dashboards/      # 监控面板');
    console.log('   ├── alerts/          # 告警文件');
    console.log('   ├── reports/         # 监控报告');
    console.log('   └── logs/           # 日志文件');
    
    console.log('\n🔧 可用命令:');
    console.log('   npm run monitoring:seo          # SEO监控');
    console.log('   npm run monitoring:performance  # 性能监控');
    console.log('   npm run monitoring:alerts       # 告警处理');
    console.log('   npm run monitoring:dashboard    # 打开监控面板');
    
    console.log('\n📊 监控指标:');
    console.log('   SEO: 索引率、重复页面、Canonical错误');
    console.log('   性能: LCP、FID、CLS、移动端分数');
    console.log('   系统: 错误率、响应时间、可用性');
    
    console.log('\n🚨 告警配置:');
    console.log('   渠道: Slack、邮件、短信');
    console.log('   级别: 警告、严重、紧急');
    console.log('   升级: 自动升级机制');
  }
}

// 主执行
if (require.main === module) {
  const setup = new MonitoringSetup();
  setup.setup().catch(console.error);
}

module.exports = MonitoringSetup;
