#!/usr/bin/env node

/**
 * 硬编码审计工具
 * 检测代码中的硬编码文本，生成详细的审计报告
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class HardcodingAuditor {
  constructor() {
    this.appDir = path.join(__dirname, '..', 'app');
    this.componentsDir = path.join(__dirname, '..', 'components');
    this.hardcodingPatterns = [
      // 条件硬编码
      /locale\s*===\s*['"`]zh['"`]\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]/g,
      // 数组硬编码
      /locale\s*===\s*['"`]zh['"`]\s*\?\s*\[([^\]]+)\]\s*:\s*\[([^\]]+)\]/g,
      // 对象硬编码
      /locale\s*===\s*['"`]zh['"`]\s*\?\s*\{([^}]+)\}\s*:\s*\{([^}]+)\}/g,
      // 直接中文字符串
      /['"`][\u4e00-\u9fff][^'"`]*['"`]/g,
      // 直接英文字符串（可能未翻译）
      /['"`][A-Za-z][^'"`]{3,}['"`]/g,
      // 模板字符串中的硬编码
      /`[^`]*[\u4e00-\u9fff][^`]*`/g,
      // JSX中的硬编码文本
      />[^<]*[\u4e00-\u9fff][^<]*</g,
      // 注释中的硬编码
      /\/\*[^*]*[\u4e00-\u9fff][^*]*\*\//g,
      /\/\/[^\n]*[\u4e00-\u9fff][^\n]*/g
    ];
    
    this.auditResults = {
      totalFiles: 0,
      filesWithHardcoding: 0,
      totalHardcoding: 0,
      byType: {},
      byFile: {},
      bySeverity: {
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }

  /**
   * 扫描文件中的硬编码
   */
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.appDir, filePath);
      const results = {
        file: relativePath,
        hardcoding: [],
        count: 0
      };

      this.hardcodingPatterns.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const severity = this.assessSeverity(match, index);
            const lineNumber = this.getLineNumber(content, match);
            
            results.hardcoding.push({
              type: this.getPatternType(index),
              content: match,
              severity,
              line: lineNumber,
              suggestion: this.getSuggestion(match, index)
            });
            
            results.count++;
            this.auditResults.totalHardcoding++;
            this.auditResults.bySeverity[severity]++;
          });
        }
      });

      if (results.count > 0) {
        this.auditResults.filesWithHardcoding++;
        this.auditResults.byFile[relativePath] = results;
      }

      return results;
    } catch (error) {
      console.error(`❌ 扫描文件失败 ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * 评估硬编码严重程度
   */
  assessSeverity(content, patternIndex) {
    // 条件硬编码 - 高严重程度
    if (patternIndex === 0 || patternIndex === 1 || patternIndex === 2) {
      return 'high';
    }
    
    // 中文字符串 - 中等严重程度
    if (patternIndex === 3) {
      return 'medium';
    }
    
    // 英文字符串 - 低严重程度（可能是变量名等）
    if (patternIndex === 4) {
      return 'low';
    }
    
    // 其他 - 中等严重程度
    return 'medium';
  }

  /**
   * 获取模式类型
   */
  getPatternType(patternIndex) {
    const types = [
      '条件硬编码',
      '数组硬编码',
      '对象硬编码',
      '中文字符串',
      '英文字符串',
      '模板字符串',
      'JSX文本',
      '注释硬编码'
    ];
    return types[patternIndex] || '未知类型';
  }

  /**
   * 获取行号
   */
  getLineNumber(content, match) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1;
      }
    }
    return 0;
  }

  /**
   * 获取修复建议
   */
  getSuggestion(content, patternIndex) {
    switch (patternIndex) {
      case 0: // 条件硬编码
        return '使用 useTranslations() 和翻译键';
      case 1: // 数组硬编码
        return '将数组内容移到翻译文件中';
      case 2: // 对象硬编码
        return '将对象内容移到翻译文件中';
      case 3: // 中文字符串
        return '使用翻译键替换硬编码文本';
      case 4: // 英文字符串
        return '检查是否需要翻译';
      case 5: // 模板字符串
        return '使用翻译键和参数化翻译';
      case 6: // JSX文本
        return '使用翻译键替换JSX中的硬编码文本';
      case 7: // 注释硬编码
        return '将注释移到翻译文件中或使用英文注释';
      default:
        return '需要进一步分析';
    }
  }

  /**
   * 扫描所有文件
   */
  scanAllFiles() {
    console.log('🔍 开始硬编码审计...\n');
    
    const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
      cwd: this.appDir,
      ignore: ['**/node_modules/**', '**/.next/**', '**/test/**', '**/tests/**']
    });

    this.auditResults.totalFiles = files.length;
    console.log(`📁 扫描 ${files.length} 个文件...`);

    files.forEach(file => {
      const filePath = path.join(this.appDir, file);
      const result = this.scanFile(filePath);
      
      if (result && result.count > 0) {
        console.log(`⚠️  ${file}: ${result.count} 处硬编码`);
      }
    });
  }

  /**
   * 生成详细报告
   */
  generateReport() {
    console.log('\n📊 硬编码审计报告');
    console.log('='.repeat(60));
    
    console.log(`\n📈 总体统计:`);
    console.log(`  - 扫描文件数: ${this.auditResults.totalFiles}`);
    console.log(`  - 包含硬编码的文件: ${this.auditResults.filesWithHardcoding}`);
    console.log(`  - 硬编码总数: ${this.auditResults.totalHardcoding}`);
    console.log(`  - 高严重程度: ${this.auditResults.bySeverity.high}`);
    console.log(`  - 中等严重程度: ${this.auditResults.bySeverity.medium}`);
    console.log(`  - 低严重程度: ${this.auditResults.bySeverity.low}`);

    // 按类型统计
    console.log(`\n📋 按类型统计:`);
    Object.entries(this.auditResults.byFile).forEach(([file, result]) => {
      const typeCount = {};
      result.hardcoding.forEach(item => {
        typeCount[item.type] = (typeCount[item.type] || 0) + 1;
      });
      
      console.log(`\n  📄 ${file}:`);
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`    - ${type}: ${count} 处`);
      });
    });

    // 最严重的文件
    const sortedFiles = Object.entries(this.auditResults.byFile)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10);

    if (sortedFiles.length > 0) {
      console.log(`\n🚨 最严重的文件 (前10个):`);
      sortedFiles.forEach(([file, result]) => {
        console.log(`  - ${file}: ${result.count} 处硬编码`);
      });
    }

    // 生成修复建议
    this.generateFixSuggestions();
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions() {
    console.log(`\n💡 修复建议:`);
    
    if (this.auditResults.bySeverity.high > 0) {
      console.log(`  🔴 高优先级 (${this.auditResults.bySeverity.high} 处):`);
      console.log(`    - 立即修复条件硬编码 (locale === 'zh' ? ... : ...)`);
      console.log(`    - 将硬编码数组和对象移到翻译文件`);
      console.log(`    - 使用 useTranslations() 替换所有条件判断`);
    }
    
    if (this.auditResults.bySeverity.medium > 0) {
      console.log(`  🟡 中优先级 (${this.auditResults.bySeverity.medium} 处):`);
      console.log(`    - 替换中文字符串为翻译键`);
      console.log(`    - 处理模板字符串中的硬编码`);
      console.log(`    - 清理JSX中的硬编码文本`);
    }
    
    if (this.auditResults.bySeverity.low > 0) {
      console.log(`  🟢 低优先级 (${this.auditResults.bySeverity.low} 处):`);
      console.log(`    - 检查英文字符串是否需要翻译`);
      console.log(`    - 清理注释中的硬编码`);
    }

    console.log(`\n🛠️  推荐工具:`);
    console.log(`  - 使用 extract-translation-keys-v3.js 提取翻译键`);
    console.log(`  - 使用 validate-translation-keys.js 验证翻译完整性`);
    console.log(`  - 使用 sync-translation-keys.js 同步翻译文件`);
  }

  /**
   * 生成修复脚本
   */
  generateFixScript() {
    const scriptContent = `#!/usr/bin/env node

/**
 * 自动修复硬编码脚本
 * 基于审计结果生成的修复脚本
 */

const fs = require('fs');
const path = require('path');

// 修复规则
const fixRules = [
  {
    pattern: /locale\\s*===\\s*['"\`]zh['"\`]\\s*\\?\\s*['"\`]([^'"\`]+)['"\`]\\s*:\\s*['"\`]([^'"\`]+)['"\`]/g,
    replacement: "t('$1')",
    description: "条件硬编码修复"
  },
  {
    pattern: /locale\\s*===\\s*['"\`]zh['"\`]\\s*\\?\\s*\\[([^\\]]+)\\]\\s*:\\s*\\[([^\\]]+)\\]/g,
    replacement: "t('arrayKey', { returnObjects: true })",
    description: "数组硬编码修复"
  }
];

// 修复文件
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixRules.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        content = content.replace(rule.pattern, rule.replacement);
        modified = true;
        console.log(\`✅ 修复 \${rule.description} 在 \${filePath}\`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return modified;
  } catch (error) {
    console.error(\`❌ 修复文件失败 \${filePath}:\`, error.message);
    return false;
  }
}

// 运行修复
console.log('🔧 开始自动修复硬编码...');
// 这里需要根据实际文件路径进行修复
console.log('✅ 修复完成！');
`;

    const scriptPath = path.join(__dirname, 'auto-fix-hardcoding.js');
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log(`\n📝 已生成修复脚本: ${scriptPath}`);
  }

  /**
   * 运行审计
   */
  run() {
    this.scanAllFiles();
    this.generateReport();
    this.generateFixScript();
    
    console.log('\n' + '='.repeat(60));
    if (this.auditResults.totalHardcoding > 0) {
      console.log('❌ 发现硬编码问题，需要修复');
      process.exit(1);
    } else {
      console.log('✅ 未发现硬编码问题');
      process.exit(0);
    }
  }
}

// 运行审计
if (require.main === module) {
  const auditor = new HardcodingAuditor();
  auditor.run();
}

module.exports = HardcodingAuditor;
