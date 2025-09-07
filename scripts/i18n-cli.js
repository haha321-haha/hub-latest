#!/usr/bin/env node

/**
 * 国际化CLI工具 - 针对北美市场优化
 * 整合硬编码检测、命名验证、医学术语检查等功能
 */

const fs = require('fs');
const path = require('path');
const HardcodeDetector = require('./hardcode-detector');
const MedicalValidator = require('./medical-validator');

class I18nCLI {
  constructor() {
    this.commands = {
      'detect': this.detectHardcode.bind(this),
      'validate': this.validateNaming.bind(this),
      'medical': this.checkMedicalTerms.bind(this),
      'fda': this.checkFDACompliance.bind(this),
      'north-america': this.checkNorthAmerica.bind(this),
      'report': this.generateReport.bind(this),
      'help': this.showHelp.bind(this)
    };
  }

  /**
   * 主入口
   */
  async run() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    if (!command || !this.commands[command]) {
      this.showHelp();
      process.exit(1);
    }

    try {
      await this.commands[command](args);
    } catch (error) {
      console.error(`❌ 错误: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * 检测硬编码
   */
  async detectHardcode(args) {
    const projectRoot = args[0] || process.cwd();
    const detector = new HardcodeDetector();
    
    console.log(`🔍 检测项目硬编码: ${projectRoot}`);
    
    const reports = detector.detectInProject(projectRoot);
    const report = detector.generateReport(reports);
    
    detector.printReport(report);
    
    // 保存报告到文件
    const reportFile = path.join(projectRoot, 'hardcode-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 详细报告已保存到: ${reportFile}`);
    
    if (reports.length > 0) {
      process.exit(1);
    }
  }

  /**
   * 验证命名规范
   */
  async validateNaming(args) {
    const messagesDir = args[0] || path.join(process.cwd(), 'messages');
    
    console.log(`📋 验证翻译键命名规范: ${messagesDir}`);
    
    const enFile = path.join(messagesDir, 'en.json');
    const zhFile = path.join(messagesDir, 'zh.json');
    
    if (!fs.existsSync(enFile) || !fs.existsSync(zhFile)) {
      throw new Error('翻译文件不存在');
    }
    
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const zhData = JSON.parse(fs.readFileSync(zhFile, 'utf-8'));
    
    const validation = this.validateTranslationKeys(enData, zhData);
    this.printValidationReport(validation);
    
    if (validation.issues.length > 0) {
      process.exit(1);
    }
  }

  /**
   * 检查医学术语
   */
  async checkMedicalTerms(args) {
    const messagesDir = args[0] || path.join(process.cwd(), 'messages');
    
    console.log(`🏥 检查医学术语: ${messagesDir}`);
    
    const enFile = path.join(messagesDir, 'en.json');
    const zhFile = path.join(messagesDir, 'zh.json');
    
    if (!fs.existsSync(enFile) || !fs.existsSync(zhFile)) {
      throw new Error('翻译文件不存在');
    }
    
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const zhData = JSON.parse(fs.readFileSync(zhFile, 'utf-8'));
    
    const medicalCheck = this.checkMedicalContent(enData, zhData);
    this.printMedicalReport(medicalCheck);
    
    if (medicalCheck.issues.length > 0) {
      process.exit(1);
    }
  }

  /**
   * 检查FDA合规性 - 北美市场专用
   */
  async checkFDACompliance(args) {
    const projectRoot = args[0] || process.cwd();
    
    console.log(`🏛️ 检查FDA合规性: ${projectRoot}`);
    
    const validator = new MedicalValidator();
    const results = validator.validateProject(projectRoot);
    
    let totalIssues = 0;
    let totalScore = 0;
    
    results.forEach(result => {
      if (result.error) {
        console.error(`❌ 错误: ${result.file} - ${result.error}`);
      } else {
        console.log(`\n📄 文件: ${result.file}`);
        console.log(`分数: ${result.report.score.toFixed(1)}%`);
        console.log(`问题数: ${result.report.totalIssues}`);
        
        totalIssues += result.report.totalIssues;
        totalScore += result.report.score;
        
        if (result.report.totalIssues > 0) {
          console.log('\n🔍 FDA合规问题:');
          Object.entries(result.report.issuesByType).forEach(([type, issues]) => {
            console.log(`\n${type}:`);
            issues.forEach((issue, index) => {
              console.log(`  ${index + 1}. ${issue.issue}`);
              if (issue.suggestion) {
                console.log(`     建议: ${issue.suggestion}`);
              }
            });
          });
        }
      }
    });
    
    const averageScore = results.length > 0 ? totalScore / results.length : 0;
    console.log(`\n📊 FDA合规性摘要:`);
    console.log(`平均分数: ${averageScore.toFixed(1)}%`);
    console.log(`总问题数: ${totalIssues}`);
    
    if (totalIssues > 0) {
      console.log('\n⚠️  FDA合规性问题需要关注，建议修复后重新检查');
      console.log('💡 提示: 这些问题不会阻断开发，但建议及时处理以确保合规性');
      // 不退出，只显示警告
    } else {
      console.log('\n✅ FDA合规性检查通过！');
    }
  }

  /**
   * 检查北美市场特殊问题 - 集成硬编码检测和FDA检查
   */
  async checkNorthAmerica(args) {
    const projectRoot = args[0] || process.cwd();
    
    console.log(`🇺🇸 检查北美市场特殊问题: ${projectRoot}`);
    console.log('='.repeat(60));
    
    // 使用增强的硬编码检测工具
    const detector = new HardcodeDetector();
    const reports = detector.detectInProject(projectRoot);
    const report = detector.generateReport(reports);
    
    // 输出报告
    detector.printReport(report);
    
    // 特别关注北美市场问题
    const northAmericaReports = reports.filter(r => r.category === 'north_america');
    if (northAmericaReports.length > 0) {
      console.log(`\n🎯 北美市场重点关注:`);
      
      const highPriorityIssues = northAmericaReports.filter(r => r.severity === 'high');
      if (highPriorityIssues.length > 0) {
        console.log(`\n🔴 高优先级问题 (${highPriorityIssues.length} 个):`);
        highPriorityIssues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue.description}`);
          console.log(`     建议: ${issue.suggestion}`);
        });
      }
      
      const mediumPriorityIssues = northAmericaReports.filter(r => r.severity === 'medium');
      if (mediumPriorityIssues.length > 0) {
        console.log(`\n🟡 中优先级问题 (${mediumPriorityIssues.length} 个):`);
        mediumPriorityIssues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue.description}`);
          console.log(`     建议: ${issue.suggestion}`);
        });
      }
    }
    
    // 总结
    console.log(`\n📊 北美市场检查总结:`);
    console.log(`硬编码问题: ${report.summary.byCategory.hardcode} 个`);
    console.log(`北美市场问题: ${report.summary.byCategory.north_america} 个`);
    console.log(`高优先级: ${report.summary.bySeverity.high} 个`);
    
    if (report.summary.bySeverity.high > 0) {
      console.log('\n⚠️  发现高优先级问题，建议优先处理');
    } else if (report.summary.byCategory.north_america > 0) {
      console.log('\n💡 发现北美市场问题，建议逐步优化');
    } else {
      console.log('\n✅ 北美市场检查通过！');
    }
  }

  /**
   * 生成综合报告
   */
  async generateReport(args) {
    const projectRoot = args[0] || process.cwd();
    
    console.log(`📊 生成综合报告: ${projectRoot}`);
    
    const report = {
      timestamp: new Date().toISOString(),
      project: projectRoot,
      hardcode: await this.getHardcodeReport(projectRoot),
      naming: await this.getNamingReport(projectRoot),
      medical: await this.getMedicalReport(projectRoot)
    };
    
    // 保存报告
    const reportFile = path.join(projectRoot, 'i18n-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // 打印摘要
    this.printSummaryReport(report);
    
    console.log(`\n📄 详细报告已保存到: ${reportFile}`);
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
🌍 国际化CLI工具 - 针对北美市场优化

用法: node i18n-cli.js <command> [options]

命令:
  detect [path]        检测硬编码问题
  validate [path]      验证翻译键命名规范
  medical [path]       检查医学术语
  fda [path]           检查FDA合规性（北美市场专用）
  north-america [path] 检查北美市场特殊问题（推荐）
  report [path]        生成综合报告
  help                 显示帮助信息

示例:
  node i18n-cli.js detect                    # 检测当前项目
  node i18n-cli.js north-america             # 检查北美市场问题（推荐）
  node i18n-cli.js detect /path/to/project   # 检测指定项目
  node i18n-cli.js validate messages/        # 验证翻译文件
  node i18n-cli.js medical messages/         # 检查医学术语
  node i18n-cli.js fda                       # 检查FDA合规性
  node i18n-cli.js report                    # 生成综合报告

推荐工作流:
  1. 开发时: node i18n-cli.js detect
  2. 提交前: node i18n-cli.js north-america
  3. 定期: node i18n-cli.js report

选项:
  --help, -h       显示帮助信息
  --version, -v    显示版本信息
    `);
  }

  /**
   * 验证翻译键
   */
  validateTranslationKeys(enData, zhData) {
    const issues = [];
    const enKeys = this.extractKeys(enData);
    const zhKeys = this.extractKeys(zhData);
    
    // 检查键名规范
    enKeys.forEach(key => {
      if (!this.isValidKeyName(key)) {
        issues.push({
          type: 'naming',
          key,
          message: '键名不符合命名规范'
        });
      }
    });
    
    // 检查嵌套深度
    enKeys.forEach(key => {
      const depth = key.split('.').length;
      if (depth > 3) {
        issues.push({
          type: 'structure',
          key,
          message: '嵌套深度超过3层'
        });
      }
    });
    
    // 检查中英文键名一致性
    const missingInZh = enKeys.filter(key => !zhKeys.includes(key));
    const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
    
    missingInZh.forEach(key => {
      issues.push({
        type: 'completeness',
        key,
        message: '中文翻译缺失'
      });
    });
    
    missingInEn.forEach(key => {
      issues.push({
        type: 'completeness',
        key,
        message: '英文翻译缺失'
      });
    });
    
    return {
      totalKeys: enKeys.length,
      issues,
      score: this.calculateScore(issues, enKeys.length)
    };
  }

  /**
   * 检查医学内容
   */
  checkMedicalContent(enData, zhData) {
    const issues = [];
    const medicalTerms = this.extractMedicalTerms(enData, zhData);
    
    // 检查医学术语准确性
    medicalTerms.forEach(term => {
      if (!this.isValidMedicalTerm(term)) {
        issues.push({
          type: 'medical',
          term,
          message: '医学术语可能不准确'
        });
      }
    });
    
    // 检查药物信息
    const medicationInfo = this.extractMedicationInfo(enData, zhData);
    medicationInfo.forEach(med => {
      if (!med.dosage) {
        issues.push({
          type: 'medication',
          term: med.name,
          message: '药物信息缺少剂量'
        });
      }
      if (!med.warnings) {
        issues.push({
          type: 'medication',
          term: med.name,
          message: '药物信息缺少安全警告'
        });
      }
    });
    
    return {
      medicalTerms: medicalTerms.length,
      medicationInfo: medicationInfo.length,
      issues,
      score: this.calculateMedicalScore(issues, medicalTerms.length)
    };
  }

  /**
   * 提取键名
   */
  extractKeys(obj, prefix = '') {
    const keys = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...this.extractKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }

  /**
   * 验证键名
   */
  isValidKeyName(key) {
    // 检查camelCase格式
    const parts = key.split('.');
    return parts.every(part => /^[a-z][a-zA-Z0-9]*$/.test(part));
  }

  /**
   * 提取医学术语
   */
  extractMedicalTerms(enData, zhData) {
    const terms = [];
    const medicalKeywords = [
      'dysmenorrhea', 'endometriosis', 'menstrual', 'period',
      '痛经', '子宫内膜异位症', '月经', '经期'
    ];
    
    const allText = JSON.stringify(enData) + JSON.stringify(zhData);
    
    medicalKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        terms.push(keyword);
      }
    });
    
    return terms;
  }

  /**
   * 提取药物信息
   */
  extractMedicationInfo(enData, zhData) {
    const medications = [];
    const medicationNames = ['ibuprofen', 'acetaminophen', 'naproxen', '布洛芬', '对乙酰氨基酚'];
    
    const allText = JSON.stringify(enData) + JSON.stringify(zhData);
    
    medicationNames.forEach(name => {
      if (allText.includes(name)) {
        medications.push({
          name,
          dosage: allText.includes('mg') || allText.includes('剂量'),
          warnings: allText.includes('warning') || allText.includes('警告')
        });
      }
    });
    
    return medications;
  }

  /**
   * 验证医学术语
   */
  isValidMedicalTerm(term) {
    const validTerms = [
      'dysmenorrhea', 'endometriosis', 'menstrual', 'period',
      '痛经', '子宫内膜异位症', '月经', '经期'
    ];
    return validTerms.includes(term);
  }

  /**
   * 计算分数
   */
  calculateScore(issues, totalKeys) {
    return Math.max(0, (totalKeys - issues.length) / totalKeys * 100);
  }

  /**
   * 计算医学分数
   */
  calculateMedicalScore(issues, totalTerms) {
    return Math.max(0, (totalTerms - issues.length) / totalTerms * 100);
  }

  /**
   * 打印验证报告
   */
  printValidationReport(validation) {
    console.log('\n📋 翻译键命名验证报告');
    console.log('='.repeat(50));
    console.log(`总键数: ${validation.totalKeys}`);
    console.log(`问题数: ${validation.issues.length}`);
    console.log(`分数: ${validation.score.toFixed(1)}%`);
    
    if (validation.issues.length > 0) {
      console.log('\n🔍 问题详情:');
      validation.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.key} - ${issue.message}`);
      });
    } else {
      console.log('\n✅ 所有翻译键命名规范！');
    }
  }

  /**
   * 打印医学报告
   */
  printMedicalReport(medicalCheck) {
    console.log('\n🏥 医学术语检查报告');
    console.log('='.repeat(50));
    console.log(`医学术语数: ${medicalCheck.medicalTerms}`);
    console.log(`药物信息数: ${medicalCheck.medicationInfo}`);
    console.log(`问题数: ${medicalCheck.issues.length}`);
    console.log(`分数: ${medicalCheck.score.toFixed(1)}%`);
    
    if (medicalCheck.issues.length > 0) {
      console.log('\n🔍 问题详情:');
      medicalCheck.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.term} - ${issue.message}`);
      });
    } else {
      console.log('\n✅ 所有医学术语检查通过！');
    }
  }

  /**
   * 打印摘要报告
   */
  printSummaryReport(report) {
    console.log('\n📊 综合报告摘要');
    console.log('='.repeat(50));
    console.log(`项目: ${report.project}`);
    console.log(`时间: ${report.timestamp}`);
    console.log(`硬编码问题: ${report.hardcode.summary.total}`);
    console.log(`命名问题: ${report.naming.issues.length}`);
    console.log(`医学问题: ${report.medical.issues.length}`);
    
    const overallScore = (
      (report.hardcode.summary.total === 0 ? 100 : 0) +
      report.naming.score +
      report.medical.score
    ) / 3;
    
    console.log(`总体分数: ${overallScore.toFixed(1)}%`);
  }

  /**
   * 获取硬编码报告
   */
  async getHardcodeReport(projectRoot) {
    const detector = new HardcodeDetector();
    const reports = detector.detectInProject(projectRoot);
    return detector.generateReport(reports);
  }

  /**
   * 获取命名报告
   */
  async getNamingReport(projectRoot) {
    const messagesDir = path.join(projectRoot, 'messages');
    const enFile = path.join(messagesDir, 'en.json');
    const zhFile = path.join(messagesDir, 'zh.json');
    
    if (!fs.existsSync(enFile) || !fs.existsSync(zhFile)) {
      return { issues: [], score: 0 };
    }
    
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const zhData = JSON.parse(fs.readFileSync(zhFile, 'utf-8'));
    
    return this.validateTranslationKeys(enData, zhData);
  }

  /**
   * 获取医学报告
   */
  async getMedicalReport(projectRoot) {
    const messagesDir = path.join(projectRoot, 'messages');
    const enFile = path.join(messagesDir, 'en.json');
    const zhFile = path.join(messagesDir, 'zh.json');
    
    if (!fs.existsSync(enFile) || !fs.existsSync(zhFile)) {
      return { issues: [], score: 0 };
    }
    
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
    const zhData = JSON.parse(fs.readFileSync(zhFile, 'utf-8'));
    
    return this.checkMedicalContent(enData, zhData);
  }
}

// 运行CLI
if (require.main === module) {
  const cli = new I18nCLI();
  cli.run();
}

module.exports = I18nCLI;
