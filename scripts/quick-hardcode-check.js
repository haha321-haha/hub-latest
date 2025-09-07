#!/usr/bin/env node

/**
 * 快速硬编码检查工具 - 只显示真正需要修复的问题
 * 过滤掉低优先级和重复问题
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class QuickHardcodeChecker {
  constructor() {
    // 只检测真正需要修复的高优先级模式
    this.criticalPatterns = [
      {
        regex: /locale === 'zh' \? '([^']+)' : '([^']+)'/g,
        type: 'conditional-string',
        description: '条件字符串硬编码',
        severity: 'high'
      },
      {
        regex: /locale === 'zh' \? "([^"]+)" : "([^"]+)"/g,
        type: 'conditional-string-double',
        description: '条件字符串硬编码（双引号）',
        severity: 'high'
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
      '**/docs/**',
      '**/scripts/**'
    ];
    
    // 包含的文件类型
    this.includeExtensions = ['.tsx', '.ts', '.jsx', '.js'];
  }

  /**
   * 检测单个文件中的关键硬编码
   */
  detectInFile(filePath) {
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return [];
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const reports = [];
      
      this.criticalPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern.regex);
        for (const match of matches) {
          const lineNumber = this.getLineNumber(content, match.index);
          const lineContent = this.getLineContent(content, match.index);
          
          reports.push({
            file: filePath,
            line: lineNumber,
            type: pattern.type,
            description: pattern.description,
            match: match[0],
            chineseText: match[1] || '',
            englishText: match[2] || '',
            lineContent: lineContent.trim(),
            suggestion: this.generateSuggestion(match, pattern.type)
          });
        }
      });
      
      return reports;
    } catch (error) {
      return [];
    }
  }

  /**
   * 检测整个项目
   */
  detectInProject(projectRoot = process.cwd()) {
    const files = this.getSourceFiles(projectRoot);
    const allReports = [];
    
    console.log(`🔍 快速扫描 ${files.length} 个文件...`);
    
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
    
    return `建议替换为: t('${keySuggestion}')`;
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
      const keywords = this.extractKeywords(chineseText);
      return keywords.join('.');
    }
    
    return 'translation.key';
  }

  /**
   * 提取中文关键词
   */
  extractKeywords(text) {
    const words = text.replace(/[^\u4e00-\u9fff]/g, '').split('');
    const keywords = [];
    
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
    const invalidWords = ['的', '了', '在', '是', '有', '和', '与', '或', '但', '而'];
    return word.length >= 2 && !invalidWords.includes(word);
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
   * 生成简化报告
   */
  generateReport(reports) {
    const summary = {
      total: reports.length,
      byFile: {}
    };

    reports.forEach(report => {
      summary.byFile[report.file] = (summary.byFile[report.file] || 0) + 1;
    });

    return {
      summary,
      reports: reports.sort((a, b) => a.file.localeCompare(b.file))
    };
  }

  /**
   * 输出简化报告
   */
  printReport(report) {
    console.log('\n🚀 快速硬编码检查报告');
    console.log('='.repeat(50));
    
    console.log(`\n📈 摘要:`);
    console.log(`  需要修复的硬编码: ${report.summary.total} 个`);
    
    // 按文件统计
    console.log(`\n📁 按文件统计:`);
    Object.entries(report.summary.byFile)
      .sort(([,a], [,b]) => b - a)
      .forEach(([file, count]) => {
        console.log(`  ${file}: ${count} 个`);
      });
    
    // 只显示前10个问题作为示例
    if (report.reports.length > 0) {
      console.log(`\n🔍 示例问题 (前10个):`);
      report.reports.slice(0, 10).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.file}:${item.line}`);
        console.log(`   内容: ${item.match}`);
        console.log(`   建议: ${item.suggestion}`);
      });
      
      if (report.reports.length > 10) {
        console.log(`\n... 还有 ${report.reports.length - 10} 个问题`);
      }
    }
    
    console.log(`\n💡 建议:`);
    console.log(`  1. 优先修复高优先级文件`);
    console.log(`  2. 使用 node scripts/i18n-cli.js detect [文件路径] 查看详细报告`);
    console.log(`  3. 修复后重新运行检查`);
  }
}

// CLI 接口
if (require.main === module) {
  const checker = new QuickHardcodeChecker();
  const projectRoot = process.argv[2] || process.cwd();
  
  console.log(`🚀 快速检查项目: ${projectRoot}`);
  
  const reports = checker.detectInProject(projectRoot);
  const report = checker.generateReport(reports);
  
  checker.printReport(report);
  
  // 如果有硬编码，退出码为1
  if (reports.length > 0) {
    process.exit(1);
  } else {
    console.log('\n✅ 未发现需要修复的硬编码问题！');
    process.exit(0);
  }
}

module.exports = QuickHardcodeChecker;
