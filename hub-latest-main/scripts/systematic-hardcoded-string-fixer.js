#!/usr/bin/env node

/**
 * Systematic Hardcoded String Fixer
 * Automatically fixes hardcoded strings across the entire codebase
 */

const fs = require('fs');
const path = require('path');

class SystematicHardcodedStringFixer {
  constructor() {
    this.fixes = [];
    this.errors = [];
    this.componentFiles = [];
    this.hardcodedPatterns = [
      // Chinese characters in strings
      /['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g,
      // Common hardcoded English phrases
      /['"`](Start|Begin|Complete|Finish|Save|Cancel|Submit|Reset|Next|Previous|Continue|Back)['"`]/g,
      // Error messages
      /['"`](Error|Failed|Success|Warning|Info).*['"`]/g,
      // Common UI text
      /['"`](Loading|Please wait|Try again|Retry).*['"`]/g
    ];
    this.translationReplacements = new Map();
    this.initializeCommonReplacements();
  }

  initializeCommonReplacements() {
    // Common hardcoded strings and their translation keys
    this.translationReplacements.set('开始评估', 'start.startButton');
    this.translationReplacements.set('Start Assessment', 'start.startButton');
    this.translationReplacements.set('症状评估工具', 'title');
    this.translationReplacements.set('Symptom Assessment Tool', 'title');
    this.translationReplacements.set('评估结果', 'result.title');
    this.translationReplacements.set('Assessment Results', 'result.title');
    this.translationReplacements.set('您的得分', 'result.yourScore');
    this.translationReplacements.set('Your Score', 'result.yourScore');
    this.translationReplacements.set('疼痛程度：', 'painScale.title');
    this.translationReplacements.set('Pain Level: ', 'painScale.title');
    this.translationReplacements.set('无痛', 'painScale.levels.none');
    this.translationReplacements.set('None', 'painScale.levels.none');
    this.translationReplacements.set('轻微', 'painScale.levels.mild');
    this.translationReplacements.set('Mild', 'painScale.levels.mild');
    this.translationReplacements.set('中等', 'painScale.levels.moderate');
    this.translationReplacements.set('Moderate', 'painScale.levels.moderate');
    this.translationReplacements.set('严重', 'painScale.levels.severe');
    this.translationReplacements.set('Severe', 'painScale.levels.severe');
    this.translationReplacements.set('极重', 'painScale.levels.extreme');
    this.translationReplacements.set('Extreme', 'painScale.levels.extreme');
  }

  // Find all component files
  findComponentFiles() {
    const searchDirs = [
      'app/[locale]/interactive-tools/components',
      'app/[locale]/interactive-tools/shared/hooks',
      'app/[locale]/interactive-tools/shared/components',
      'components',
      'app/components'
    ];

    searchDirs.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      if (fs.existsSync(fullPath)) {
        this.scanDirectory(fullPath);
      }
    });

    console.log(`Found ${this.componentFiles.length} component files to process`);
  }

  scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        this.componentFiles.push(fullPath);
      }
    });
  }

  // Analyze and fix hardcoded strings in a file
  fixHardcodedStringsInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      let modifiedContent = content;
      let hasChanges = false;
      const fileChanges = [];

      // Check if file already uses translation hooks
      const hasTranslationHook = content.includes('useTranslations') || 
                                 content.includes('useSafeTranslations') ||
                                 content.includes('useInteractiveToolTranslations');

      if (!hasTranslationHook) {
        console.log(`⚠️  ${relativePath}: No translation hook found, skipping automatic fixes`);
        return { success: false, reason: 'No translation hook' };
      }

      // Check if file has locale parameter
      const hasLocaleParam = content.includes('locale:') || content.includes('{ locale }');

      // Find hardcoded strings
      this.hardcodedPatterns.forEach((pattern, patternIndex) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const hardcodedString = match[1];
          
          // Skip if it's already a translation key
          if (hardcodedString.includes('.') && /^[a-zA-Z][a-zA-Z0-9.]*$/.test(hardcodedString)) {
            continue;
          }

          // Skip if it's in a comment
          const beforeMatch = content.substring(0, match.index);
          const lastLineStart = beforeMatch.lastIndexOf('\n');
          const currentLine = content.substring(lastLineStart, match.index + match[0].length);
          if (currentLine.trim().startsWith('//') || currentLine.includes('/*')) {
            continue;
          }

          // Check if we have a replacement for this string
          const translationKey = this.translationReplacements.get(hardcodedString);
          if (translationKey) {
            let replacement;
            if (hasLocaleParam) {
              // Use language-aware fallback
              const isChineseString = /[\u4e00-\u9fff]/.test(hardcodedString);
              if (isChineseString) {
                replacement = `t('${translationKey}', {}, locale === 'en' ? '${this.getEnglishEquivalent(hardcodedString)}' : '${hardcodedString}')`;
              } else {
                replacement = `t('${translationKey}', {}, locale === 'en' ? '${hardcodedString}' : '${this.getChineseEquivalent(hardcodedString)}')`;
              }
            } else {
              // Simple translation key replacement
              replacement = `t('${translationKey}')`;
            }

            const oldPattern = match[0];
            const newPattern = `{${replacement}}`;
            
            modifiedContent = modifiedContent.replace(oldPattern, newPattern);
            hasChanges = true;
            
            fileChanges.push({
              type: 'HARDCODED_STRING_FIX',
              old: oldPattern,
              new: newPattern,
              translationKey,
              line: this.getLineNumber(content, match.index)
            });
          }
        }
      });

      if (hasChanges) {
        // Write the modified content back to file
        fs.writeFileSync(filePath, modifiedContent);
        
        this.fixes.push({
          file: relativePath,
          changes: fileChanges,
          timestamp: new Date().toISOString()
        });

        console.log(`✅ Fixed ${fileChanges.length} hardcoded strings in ${relativePath}`);
        return { success: true, changes: fileChanges.length };
      } else {
        return { success: true, changes: 0 };
      }

    } catch (error) {
      this.errors.push({
        file: path.relative(process.cwd(), filePath),
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.error(`❌ Error processing ${filePath}:`, error.message);
      return { success: false, reason: error.message };
    }
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  getEnglishEquivalent(chineseString) {
    const equivalents = {
      '开始评估': 'Start Assessment',
      '症状评估工具': 'Symptom Assessment Tool',
      '评估结果': 'Assessment Results',
      '您的得分': 'Your Score',
      '疼痛程度：': 'Pain Level: ',
      '无痛': 'None',
      '轻微': 'Mild',
      '中等': 'Moderate',
      '严重': 'Severe',
      '极重': 'Extreme',
      '疼痛程度参考': 'Pain Level Reference',
      '无痛或极轻微不适': 'No pain or very mild discomfort',
      '轻微疼痛，不影响日常活动': 'Mild pain, does not affect daily activities',
      '中等疼痛，影响部分活动': 'Moderate pain, affects some activities',
      '严重疼痛，严重影响生活': 'Severe pain, seriously affects life'
    };
    return equivalents[chineseString] || chineseString;
  }

  getChineseEquivalent(englishString) {
    const equivalents = {
      'Start Assessment': '开始评估',
      'Symptom Assessment Tool': '症状评估工具',
      'Assessment Results': '评估结果',
      'Your Score': '您的得分',
      'Pain Level: ': '疼痛程度：',
      'None': '无痛',
      'Mild': '轻微',
      'Moderate': '中等',
      'Severe': '严重',
      'Extreme': '极重',
      'Pain Level Reference': '疼痛程度参考',
      'No pain or very mild discomfort': '无痛或极轻微不适',
      'Mild pain, does not affect daily activities': '轻微疼痛，不影响日常活动',
      'Moderate pain, affects some activities': '中等疼痛，影响部分活动',
      'Severe pain, seriously affects life': '严重疼痛，严重影响生活'
    };
    return equivalents[englishString] || englishString;
  }

  // Process all files
  processAllFiles() {
    console.log('🚀 Starting systematic hardcoded string fixing...');
    
    this.findComponentFiles();
    
    let totalChanges = 0;
    let processedFiles = 0;
    let skippedFiles = 0;

    this.componentFiles.forEach(filePath => {
      const result = this.fixHardcodedStringsInFile(filePath);
      
      if (result.success) {
        processedFiles++;
        totalChanges += result.changes || 0;
      } else {
        skippedFiles++;
      }
    });

    console.log('\n📊 SYSTEMATIC FIXING SUMMARY:');
    console.log(`Files processed: ${processedFiles}`);
    console.log(`Files skipped: ${skippedFiles}`);
    console.log(`Total changes made: ${totalChanges}`);
    console.log(`Errors encountered: ${this.errors.length}`);

    // Generate report
    this.generateReport();
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.componentFiles.length,
        processedFiles: this.fixes.length,
        totalChanges: this.fixes.reduce((sum, fix) => sum + fix.changes.length, 0),
        errors: this.errors.length
      },
      fixes: this.fixes,
      errors: this.errors,
      recommendations: [
        'Review all automatic changes before committing',
        'Test all modified components in both languages',
        'Add missing translation keys to translation files',
        'Verify that all fallback values are language-appropriate',
        'Run comprehensive translation audit after fixes'
      ]
    };

    const reportPath = path.join(process.cwd(), 'systematic-hardcoded-string-fixes-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Detailed report saved to: ${reportPath}`);
    return report;
  }
}

// Execute if run directly
if (require.main === module) {
  const fixer = new SystematicHardcodedStringFixer();
  fixer.processAllFiles();
}

module.exports = SystematicHardcodedStringFixer;
