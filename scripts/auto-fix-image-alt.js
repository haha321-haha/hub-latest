#!/usr/bin/env node

/**
 * 自动修复图片Alt标签工具
 * 基于扫描结果自动修复图片alt属性
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class AutoImageAltFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
    this.backupDir = path.join(process.cwd(), 'backups', 'image-alt-fixes');
  }

  /**
   * 创建备份
   */
  createBackup(filePath) {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const fileName = path.basename(filePath);
    const backupPath = path.join(this.backupDir, `${fileName}.backup.${Date.now()}`);
    fs.copyFileSync(filePath, backupPath);
    
    return backupPath;
  }

  /**
   * 生成智能alt文本
   */
  generateSmartAlt(src, context, fileName) {
    // 基于文件名生成alt文本
    const baseName = path.basename(src, path.extname(src));
    const cleanName = baseName
      .replace(/[-_]/g, ' ')
      .replace(/\d+/g, '')
      .trim();

    // 基于上下文关键词
    const contextKeywords = this.extractContextKeywords(context);
    
    // 基于图片类型
    const imageType = this.detectImageType(src, context);

    // 生成alt文本
    let altText = '';

    if (imageType) {
      altText = `${imageType}: ${cleanName}`;
    } else if (contextKeywords.length > 0) {
      altText = `${contextKeywords[0]}: ${cleanName}`;
    } else {
      altText = cleanName || 'Image';
    }

    // 确保alt文本符合SEO最佳实践
    return this.optimizeAltText(altText);
  }

  /**
   * 从上下文提取关键词
   */
  extractContextKeywords(context) {
    const healthKeywords = [
      'period', 'menstrual', 'cycle', 'pain', 'symptom', 'health',
      'tracker', 'calendar', 'chart', 'graph', 'data', 'woman', 'female',
      '月经', '周期', '疼痛', '症状', '健康', '追踪', '日历', '女性'
    ];

    const lowerContext = context.toLowerCase();
    return healthKeywords.filter(keyword => 
      lowerContext.includes(keyword.toLowerCase())
    );
  }

  /**
   * 检测图片类型
   */
  detectImageType(src, context) {
    const srcLower = src.toLowerCase();
    const contextLower = context.toLowerCase();

    if (srcLower.includes('icon') || contextLower.includes('icon')) return 'Icon';
    if (srcLower.includes('logo') || contextLower.includes('logo')) return 'Logo';
    if (srcLower.includes('banner') || contextLower.includes('banner')) return 'Banner';
    if (srcLower.includes('hero') || contextLower.includes('hero')) return 'Hero image';
    if (srcLower.includes('chart') || contextLower.includes('chart')) return 'Chart';
    if (srcLower.includes('graph') || contextLower.includes('graph')) return 'Graph';
    if (srcLower.includes('diagram') || contextLower.includes('diagram')) return 'Diagram';
    if (srcLower.includes('illustration') || contextLower.includes('illustration')) return 'Illustration';
    if (srcLower.includes('avatar') || contextLower.includes('avatar')) return 'Avatar';
    if (srcLower.includes('profile') || contextLower.includes('profile')) return 'Profile picture';
    
    return null;
  }

  /**
   * 优化alt文本
   */
  optimizeAltText(altText) {
    // 首字母大写
    altText = altText.charAt(0).toUpperCase() + altText.slice(1);
    
    // 移除多余空格
    altText = altText.replace(/\s+/g, ' ').trim();
    
    // 确保长度适中 (10-125字符)
    if (altText.length < 10) {
      altText = `Image: ${altText}`;
    } else if (altText.length > 125) {
      altText = altText.substring(0, 122) + '...';
    }
    
    return altText;
  }

  /**
   * 修复单个文件中的图片alt标签
   */
  fixFileImageAlt(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let modified = false;
      const fixes = [];

      const newLines = lines.map((line, index) => {
        // 检测图片标签
        const imgPatterns = [
          /<img([^>]*src=["']([^"']+)["'][^>]*)>/gi,
          /<Image([^>]*src=["']([^"']+)["'][^>]*)>/gi,
          /<OptimizedImage([^>]*src=["']([^"']+)["'][^>]*)>/gi,
        ];

        for (const pattern of imgPatterns) {
          const match = pattern.exec(line);
          if (match) {
            const fullTag = match[0];
            const imageSrc = match[2];
            
            // 检查是否已有alt属性
            if (!/alt\s*=/i.test(fullTag)) {
              // 生成智能alt文本
              const altText = this.generateSmartAlt(imageSrc, line, path.basename(filePath));
              
              // 添加alt属性
              const newTag = fullTag.replace(
                /(src=["'][^"']+["'])/i,
                `$1 alt="${altText}"`
              );
              
              fixes.push({
                line: index + 1,
                original: line.trim(),
                fixed: line.replace(fullTag, newTag).trim(),
                altText: altText
              });
              
              modified = true;
              return line.replace(fullTag, newTag);
            }
          }
        }

        return line;
      });

      if (modified) {
        // 创建备份
        const backupPath = this.createBackup(filePath);
        
        // 写入修复后的内容
        fs.writeFileSync(filePath, newLines.join('\n'));
        
        this.fixedFiles.push({
          file: filePath,
          backup: backupPath,
          fixes: fixes
        });
        
        console.log(`✅ 修复文件: ${filePath} (${fixes.length} 个修复)`);
        return fixes;
      }

      return [];
    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error.message
      });
      console.error(`❌ 修复失败: ${filePath} - ${error.message}`);
      return [];
    }
  }

  /**
   * 批量修复所有文件
   */
  async fixAllFiles() {
    console.log('🔧 开始自动修复图片Alt标签...');
    
    // 获取所有需要修复的文件
    const componentFiles = glob.sync('**/*.{tsx,jsx,ts,js}', {
      ignore: ['node_modules/**', '.next/**', 'out/**', 'reports/**', 'backups/**']
    });

    let totalFixes = 0;
    const allFixes = [];

    for (const file of componentFiles) {
      if (!fs.statSync(file).isFile()) continue;
      
      const fixes = this.fixFileImageAlt(file);
      totalFixes += fixes.length;
      allFixes.push(...fixes);
    }

    // 生成修复报告
    await this.generateFixReport(allFixes);

    console.log(`\n🎉 修复完成!`);
    console.log(`📊 总修复数: ${totalFixes}`);
    console.log(`📁 修复文件数: ${this.fixedFiles.length}`);
    console.log(`❌ 错误数: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ 修复错误:');
      this.errors.forEach(error => {
        console.log(`  - ${error.file}: ${error.error}`);
      });
    }

    return {
      totalFixes,
      fixedFiles: this.fixedFiles.length,
      errors: this.errors.length,
      allFixes
    };
  }

  /**
   * 生成修复报告
   */
  async generateFixReport(allFixes) {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    // 生成JSON报告
    const jsonReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFixes: allFixes.length,
        fixedFiles: this.fixedFiles.length,
        errors: this.errors.length
      },
      fixes: allFixes,
      fixedFiles: this.fixedFiles,
      errors: this.errors
    };

    fs.writeFileSync(
      path.join(reportsDir, `image-alt-auto-fix-${timestamp}.json`),
      JSON.stringify(jsonReport, null, 2)
    );

    // 生成Markdown报告
    const markdownReport = this.generateMarkdownReport(jsonReport);
    fs.writeFileSync(
      path.join(reportsDir, `image-alt-auto-fix-${timestamp}.md`),
      markdownReport
    );

    console.log(`📊 修复报告已保存到 reports/image-alt-auto-fix-${timestamp}.json`);
    console.log(`📝 Markdown报告已保存到 reports/image-alt-auto-fix-${timestamp}.md`);
  }

  /**
   * 生成Markdown报告
   */
  generateMarkdownReport(report) {
    let markdown = `# 🔧 图片Alt标签自动修复报告\n\n`;
    markdown += `**修复时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 摘要
    markdown += `## 📊 修复摘要\n\n`;
    markdown += `- **总修复数**: ${report.summary.totalFixes}\n`;
    markdown += `- **修复文件数**: ${report.summary.fixedFiles}\n`;
    markdown += `- **错误数**: ${report.summary.errors}\n\n`;

    // 修复详情
    if (report.fixes.length > 0) {
      markdown += `## 🔧 修复详情\n\n`;
      
      const fixesByFile = report.fixes.reduce((acc, fix) => {
        if (!acc[fix.file]) acc[fix.file] = [];
        acc[fix.file].push(fix);
        return acc;
      }, {});

      Object.entries(fixesByFile).forEach(([file, fixes]) => {
        markdown += `### ${file}\n\n`;
        
        fixes.forEach((fix, index) => {
          markdown += `#### 修复 ${index + 1} (第${fix.line}行)\n\n`;
          markdown += `**原始代码**:\n\`\`\`\n${fix.original}\n\`\`\`\n\n`;
          markdown += `**修复后**:\n\`\`\`\n${fix.fixed}\n\`\`\`\n\n`;
          markdown += `**添加的Alt文本**: "${fix.altText}"\n\n`;
        });
      });
    }

    // 备份信息
    if (report.fixedFiles.length > 0) {
      markdown += `## 💾 备份信息\n\n`;
      markdown += `所有修改的文件都已自动备份到 \`backups/image-alt-fixes/\` 目录\n\n`;
    }

    return markdown;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const fixer = new AutoImageAltFixer();
  fixer.fixAllFiles().catch(console.error);
}

module.exports = AutoImageAltFixer;
