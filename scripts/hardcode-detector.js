#!/usr/bin/env node

/**
 * 硬编码检测工具 - 针对北美市场优化
 * 专门检测中英文硬编码模式，确保国际化完整性
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class HardcodeDetector {
  constructor() {
    // 针对北美市场的检测模式 - 英语优先
    this.patterns = [
      // 条件字符串模式
      {
        regex: /locale === 'zh' \? '([^']+)' : '([^']+)'/g,
        type: 'conditional-string',
        description: '条件字符串硬编码'
      },
      {
        regex: /locale === 'zh' \? "([^"]+)" : "([^"]+)"/g,
        type: 'conditional-string-double',
        description: '条件字符串硬编码（双引号）'
      },
      
      // 对象字面量模式
      {
        regex: /'([^']+)' : '([^']+)'/g,
        type: 'object-literal',
        description: '对象字面量硬编码'
      },
      {
        regex: /"([^"]+)" : "([^"]+)"/g,
        type: 'object-literal-double',
        description: '对象字面量硬编码（双引号）'
      },
      
      // 三元运算符模式
      {
        regex: /locale === 'zh' \? ([^:]+) : ([^,)]+)/g,
        type: 'ternary-operator',
        description: '三元运算符硬编码'
      },
      
      // 直接字符串硬编码（需要人工判断）
      {
        regex: /['"]([^'"]*[\u4e00-\u9fff][^'"]*)['"]/g,
        type: 'chinese-string',
        description: '可能的中文字符串硬编码'
      }
    ];
    
    // 排除的文件和目录
    this.excludePatterns = [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '**/*.backup*',
      '**/messages/**',
      '**/docs/**'
    ];
    
    // 包含的文件类型
    this.includeExtensions = ['.tsx', '.ts', '.jsx', '.js'];
    
    // 北美市场特殊检查模式
    this.northAmericaChecks = {
      // 医疗建议语气检测
      medicalAdvicePatterns: [
        {
          regex: /you should/gi,
          type: 'medical_advice',
          description: '医疗建议语气: "you should"',
          severity: 'medium'
        },
        {
          regex: /we recommend/gi,
          type: 'medical_advice',
          description: '医疗建议语气: "we recommend"',
          severity: 'medium'
        },
        {
          regex: /take.*mg/gi,
          type: 'dosage_advice',
          description: '剂量建议: "take X mg"',
          severity: 'high'
        },
        {
          regex: /dosage/gi,
          type: 'medical_term',
          description: '医学术语: "dosage"',
          severity: 'low'
        },
        {
          regex: /prescription/gi,
          type: 'medical_term',
          description: '医学术语: "prescription"',
          severity: 'low'
        },
        {
          regex: /doctor.*prescribe/gi,
          type: 'medical_advice',
          description: '医疗建议语气: "doctor prescribe"',
          severity: 'medium'
        }
      ],
      
      // 医学术语检测
      medicalTermPatterns: [
        {
          regex: /FDA|CDC|NIH|Mayo Clinic|WebMD/gi,
          type: 'authoritative_source',
          description: '权威医学来源',
          severity: 'low'
        },
        {
          regex: /over-the-counter|OTC/gi,
          type: 'medical_term',
          description: '医学术语: "over-the-counter"',
          severity: 'low'
        }
      ],
      
      // 必需的免责声明关键词
      requiredDisclaimerKeywords: [
        {
          keyword: 'educational purposes',
          type: 'disclaimer_required',
          description: '必需免责声明: "educational purposes"',
          severity: 'medium'
        },
        {
          keyword: 'not replace professional medical advice',
          type: 'disclaimer_required',
          description: '必需免责声明: "not replace professional medical advice"',
          severity: 'medium'
        },
        {
          keyword: 'consult with a qualified healthcare provider',
          type: 'disclaimer_required',
          description: '必需免责声明: "consult with a qualified healthcare provider"',
          severity: 'medium'
        },
        {
          keyword: 'individual results may vary',
          type: 'disclaimer_required',
          description: '必需免责声明: "individual results may vary"',
          severity: 'low'
        }
      ]
    };
  }

  /**
   * 检测单个文件中的硬编码
   */
  detectInFile(filePath) {
    try {
      // 检查是否为文件
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return [];
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const reports = [];
      
      // 检测传统硬编码模式
      this.patterns.forEach(pattern => {
        const matches = content.matchAll(pattern.regex);
        for (const match of matches) {
          const lineNumber = this.getLineNumber(content, match.index);
          const lineContent = this.getLineContent(content, match.index);
          
          reports.push({
            file: filePath,
            line: lineNumber,
            column: match.index - this.getLineStartIndex(content, match.index) + 1,
            type: pattern.type,
            description: pattern.description,
            match: match[0],
            chineseText: match[1] || '',
            englishText: match[2] || '',
            lineContent: lineContent.trim(),
            suggestion: this.generateSuggestion(match, pattern.type),
            severity: this.getSeverity(pattern.type, match)
          });
        }
      });
      
      // 检测北美市场特殊问题
      const northAmericaReports = this.detectNorthAmericaIssues(content, filePath);
      reports.push(...northAmericaReports);
      
      return reports;
    } catch (error) {
      // 静默处理错误，避免输出过多错误信息
      return [];
    }
  }

  /**
   * 检测北美市场特殊问题
   */
  detectNorthAmericaIssues(content, filePath) {
    const reports = [];
    
    // 检测医疗建议语气
    this.northAmericaChecks.medicalAdvicePatterns.forEach(pattern => {
      const matches = content.matchAll(pattern.regex);
      for (const match of matches) {
        const lineNumber = this.getLineNumber(content, match.index);
        const lineContent = this.getLineContent(content, match.index);
        
        reports.push({
          file: filePath,
          line: lineNumber,
          column: match.index - this.getLineStartIndex(content, match.index) + 1,
          type: pattern.type,
          description: pattern.description,
          match: match[0],
          lineContent: lineContent.trim(),
          suggestion: this.generateNorthAmericaSuggestion(pattern.type, match[0]),
          severity: pattern.severity,
          category: 'north_america'
        });
      }
    });
    
    // 检测医学术语
    this.northAmericaChecks.medicalTermPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern.regex);
      for (const match of matches) {
        const lineNumber = this.getLineNumber(content, match.index);
        const lineContent = this.getLineContent(content, match.index);
        
        reports.push({
          file: filePath,
          line: lineNumber,
          column: match.index - this.getLineStartIndex(content, match.index) + 1,
          type: pattern.type,
          description: pattern.description,
          match: match[0],
          lineContent: lineContent.trim(),
          suggestion: this.generateNorthAmericaSuggestion(pattern.type, match[0]),
          severity: pattern.severity,
          category: 'north_america'
        });
      }
    });
    
    // 检查必需的免责声明
    this.northAmericaChecks.requiredDisclaimerKeywords.forEach(keyword => {
      if (!content.includes(keyword.keyword)) {
        reports.push({
          file: filePath,
          line: 1,
          column: 1,
          type: keyword.type,
          description: keyword.description,
          match: `Missing: ${keyword.keyword}`,
          lineContent: 'File level check',
          suggestion: `建议添加免责声明: "${keyword.keyword}"`,
          severity: keyword.severity,
          category: 'north_america'
        });
      }
    });
    
    return reports;
  }

  /**
   * 检测整个项目
   */
  detectInProject(projectRoot = process.cwd()) {
    const files = this.getSourceFiles(projectRoot);
    const allReports = [];
    
    console.log(`🔍 扫描 ${files.length} 个文件...`);
    
    files.forEach(file => {
      const reports = this.detectInFile(file);
      allReports.push(...reports);
    });
    
    return allReports;
  }

  /**
   * 获取源文件列表
   */
  getSourceFiles(projectRoot) {
    const patterns = this.includeExtensions.map(ext => 
      path.join(projectRoot, '**', `*${ext}`)
    );
    
    let files = [];
    patterns.forEach(pattern => {
      const matches = glob.sync(pattern, {
        ignore: this.excludePatterns
      });
      files = files.concat(matches);
    });
    
    return [...new Set(files)]; // 去重
  }

  /**
   * 生成修复建议
   */
  generateSuggestion(match, type) {
    const [fullMatch, chineseText, englishText] = match;
    
    // 生成翻译键建议
    const keySuggestion = this.generateKeySuggestion(chineseText, englishText);
    
    switch (type) {
      case 'conditional-string':
      case 'conditional-string-double':
        return `建议替换为: t('${keySuggestion}')`;
      
      case 'object-literal':
      case 'object-literal-double':
        return `建议替换为: t('${keySuggestion}')`;
      
      case 'ternary-operator':
        return `建议替换为: t('${keySuggestion}')`;
      
      case 'chinese-string':
        return `请检查是否为硬编码，如果是请替换为: t('${keySuggestion}')`;
      
      default:
        return `建议替换为: t('${keySuggestion}')`;
    }
  }

  /**
   * 生成北美市场特殊建议
   */
  generateNorthAmericaSuggestion(type, match) {
    switch (type) {
      case 'medical_advice':
        return '建议改为教育性语言，避免构成医疗建议。例如："you should" → "you may consider"';
      
      case 'dosage_advice':
        return '⚠️ 高优先级：避免提供具体剂量建议，建议改为"consult your healthcare provider"';
      
      case 'medical_term':
        return '医学术语检测到，建议确保使用FDA认证的术语';
      
      case 'authoritative_source':
        return '✅ 检测到权威来源引用，这有助于提高内容可信度';
      
      case 'disclaimer_required':
        return '建议添加完整的医疗免责声明以确保合规性';
      
      default:
        return '建议检查内容是否符合FDA合规要求';
    }
  }

  /**
   * 生成翻译键建议 - 北美市场优化（英语优先）
   */
  generateKeySuggestion(chineseText, englishText) {
    // 优先基于英文文本生成键名（北美市场策略）
    if (englishText) {
      const words = englishText.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .slice(0, 3);
      return words.join('.');
    }
    
    // 基于中文文本生成键名（备用方案）
    if (chineseText) {
      // 提取关键词
      const keywords = this.extractKeywords(chineseText);
      return keywords.join('.');
    }
    
    return 'translation.key';
  }

  /**
   * 提取中文关键词
   */
  extractKeywords(text) {
    // 简单的关键词提取逻辑
    const words = text.replace(/[^\u4e00-\u9fff]/g, '').split('');
    const keywords = [];
    
    // 提取2-4个字符的关键词
    for (let i = 0; i < words.length - 1; i++) {
      const word = words.slice(i, i + 2).join('');
      if (this.isValidKeyword(word)) {
        keywords.push(word);
        if (keywords.length >= 2) break;
      }
    }
    
    return keywords.length > 0 ? keywords : ['content'];
  }

  /**
   * 判断是否为有效关键词
   */
  isValidKeyword(word) {
    // 过滤掉常见的无意义字符
    const invalidWords = ['的', '了', '在', '是', '有', '和', '与', '或', '但', '而'];
    return word.length >= 2 && !invalidWords.includes(word);
  }

  /**
   * 获取严重程度
   */
  getSeverity(type, match) {
    switch (type) {
      case 'conditional-string':
      case 'conditional-string-double':
      case 'object-literal':
      case 'object-literal-double':
        return 'high';
      
      case 'ternary-operator':
        return 'medium';
      
      case 'chinese-string':
        return 'low';
      
      default:
        return 'medium';
    }
  }

  /**
   * 获取行号
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * 获取行内容
   */
  getLineContent(content, index) {
    const lines = content.split('\n');
    const lineNumber = this.getLineNumber(content, index);
    return lines[lineNumber - 1] || '';
  }

  /**
   * 获取行开始索引
   */
  getLineStartIndex(content, index) {
    const beforeIndex = content.substring(0, index);
    const lastNewline = beforeIndex.lastIndexOf('\n');
    return lastNewline + 1;
  }

  /**
   * 生成报告
   */
  generateReport(reports) {
    const summary = {
      total: reports.length,
      byType: {},
      bySeverity: { high: 0, medium: 0, low: 0 },
      byFile: {},
      byCategory: { hardcode: 0, north_america: 0 }
    };

    reports.forEach(report => {
      // 按类型统计
      summary.byType[report.type] = (summary.byType[report.type] || 0) + 1;
      
      // 按严重程度统计
      summary.bySeverity[report.severity]++;
      
      // 按文件统计
      summary.byFile[report.file] = (summary.byFile[report.file] || 0) + 1;
      
      // 按类别统计
      if (report.category === 'north_america') {
        summary.byCategory.north_america++;
      } else {
        summary.byCategory.hardcode++;
      }
    });

    return {
      summary,
      reports: reports.sort((a, b) => {
        // 按严重程度和文件排序
        const severityOrder = { high: 3, medium: 2, low: 1 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return a.file.localeCompare(b.file);
      })
    };
  }

  /**
   * 输出报告
   */
  printReport(report) {
    console.log('\n📊 硬编码检测报告 - 北美市场优化版');
    console.log('='.repeat(60));
    
    // 摘要
    console.log(`\n📈 摘要:`);
    console.log(`  总计: ${report.summary.total} 个问题`);
    console.log(`  硬编码问题: ${report.summary.byCategory.hardcode} 个`);
    console.log(`  北美市场问题: ${report.summary.byCategory.north_america} 个`);
    console.log(`  高优先级: ${report.summary.bySeverity.high} 个`);
    console.log(`  中优先级: ${report.summary.bySeverity.medium} 个`);
    console.log(`  低优先级: ${report.summary.bySeverity.low} 个`);
    
    // 按类型统计
    console.log(`\n📋 按类型统计:`);
    Object.entries(report.summary.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} 个`);
    });
    
    // 按文件统计
    console.log(`\n📁 按文件统计:`);
    Object.entries(report.summary.byFile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([file, count]) => {
        console.log(`  ${file}: ${count} 个`);
      });
    
    // 北美市场特殊检查摘要
    if (report.summary.byCategory.north_america > 0) {
      console.log(`\n🇺🇸 北美市场合规性检查:`);
      const northAmericaReports = report.reports.filter(r => r.category === 'north_america');
      const medicalAdviceCount = northAmericaReports.filter(r => r.type === 'medical_advice').length;
      const dosageAdviceCount = northAmericaReports.filter(r => r.type === 'dosage_advice').length;
      const disclaimerCount = northAmericaReports.filter(r => r.type === 'disclaimer_required').length;
      const authoritativeSourceCount = northAmericaReports.filter(r => r.type === 'authoritative_source').length;
      
      console.log(`  医疗建议语气: ${medicalAdviceCount} 个`);
      console.log(`  剂量建议: ${dosageAdviceCount} 个`);
      console.log(`  缺失免责声明: ${disclaimerCount} 个`);
      console.log(`  权威来源引用: ${authoritativeSourceCount} 个`);
    }
    
    // 详细报告
    if (report.reports.length > 0) {
      console.log(`\n🔍 详细报告:`);
      report.reports.forEach((item, index) => {
        const severityIcon = {
          high: '🔴',
          medium: '🟡',
          low: '🟢'
        }[item.severity];
        
        const categoryIcon = item.category === 'north_america' ? '🇺🇸' : '🔧';
        
        console.log(`\n${index + 1}. ${severityIcon} ${categoryIcon} ${item.file}:${item.line}`);
        console.log(`   类型: ${item.description}`);
        console.log(`   内容: ${item.match}`);
        console.log(`   建议: ${item.suggestion}`);
        if (item.lineContent !== 'File level check') {
          console.log(`   代码: ${item.lineContent}`);
        }
      });
    }
  }
}

// CLI 接口
if (require.main === module) {
  const detector = new HardcodeDetector();
  const projectRoot = process.argv[2] || process.cwd();
  
  console.log(`🚀 开始检测项目: ${projectRoot}`);
  
  const reports = detector.detectInProject(projectRoot);
  const report = detector.generateReport(reports);
  
  detector.printReport(report);
  
  // 如果有硬编码，退出码为1
  if (reports.length > 0) {
    process.exit(1);
  } else {
    console.log('\n✅ 未发现硬编码问题！');
    process.exit(0);
  }
}

module.exports = HardcodeDetector;
