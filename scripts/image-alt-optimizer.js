#!/usr/bin/env node

/**
 * 图片Alt标签优化工具
 * 自动检测和优化图片的alt属性
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ImageAltOptimizer {
  constructor() {
    this.imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
    this.componentExtensions = ['.tsx', '.jsx', '.ts', '.js'];
    this.issues = [];
    this.fixes = [];
  }

  /**
   * 扫描所有组件文件中的图片使用
   */
  async scanImageUsage() {
    console.log('🔍 扫描图片使用情况...');
    
    const componentFiles = glob.sync('**/*.{tsx,jsx,ts,js}', {
      ignore: ['node_modules/**', '.next/**', 'out/**', 'reports/**']
    });

    const imageUsage = [];

    for (const file of componentFiles) {
      // 检查是否为文件
      if (!fs.statSync(file).isFile()) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 检测各种图片使用模式
        const patterns = [
          /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
          /<Image[^>]*src=["']([^"']+)["'][^>]*>/gi,
          /<OptimizedImage[^>]*src=["']([^"']+)["'][^>]*>/gi,
          /src=["']([^"']+\.(jpg|jpeg|png|webp|avif|svg))["']/gi
        ];

        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            const imageSrc = match[1];
            const fullTag = match[0];
            
            imageUsage.push({
              file: file,
              line: index + 1,
              lineContent: line.trim(),
              imageSrc: imageSrc,
              fullTag: fullTag,
              hasAlt: this.hasAltAttribute(fullTag),
              altValue: this.extractAltValue(fullTag)
            });
          }
        });
      });
    }

    return imageUsage;
  }

  /**
   * 检查是否有alt属性
   */
  hasAltAttribute(tag) {
    return /alt\s*=/i.test(tag);
  }

  /**
   * 提取alt属性值
   */
  extractAltValue(tag) {
    const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    return altMatch ? altMatch[1] : null;
  }

  /**
   * 分析图片使用问题
   */
  analyzeImageIssues(imageUsage) {
    const issues = {
      missingAlt: [],
      emptyAlt: [],
      genericAlt: [],
      seoUnfriendly: []
    };

    imageUsage.forEach(usage => {
      if (!usage.hasAlt) {
        issues.missingAlt.push(usage);
      } else if (!usage.altValue || usage.altValue.trim() === '') {
        issues.emptyAlt.push(usage);
      } else if (this.isGenericAlt(usage.altValue)) {
        issues.genericAlt.push(usage);
      } else if (!this.isSeoFriendly(usage.altValue)) {
        issues.seoUnfriendly.push(usage);
      }
    });

    return issues;
  }

  /**
   * 检查是否为通用alt文本
   */
  isGenericAlt(altText) {
    const genericAlts = [
      'image', 'img', 'picture', 'photo', '图片', '图像',
      'placeholder', 'banner', 'icon', 'logo', '图标'
    ];
    
    return genericAlts.some(generic => 
      altText.toLowerCase().includes(generic.toLowerCase())
    );
  }

  /**
   * 检查是否为SEO友好的alt文本
   */
  isSeoFriendly(altText) {
    // SEO友好的alt文本应该：
    // 1. 长度适中 (10-125字符)
    // 2. 包含相关关键词
    // 3. 描述图片内容
    // 4. 不是纯装饰性图片
    
    if (altText.length < 10 || altText.length > 125) {
      return false;
    }

    // 检查是否包含关键词
    const healthKeywords = [
      'period', 'menstrual', 'health', 'cycle', 'pain', 'symptom',
      '月经', '健康', '周期', '疼痛', '症状', '女性'
    ];

    const hasKeywords = healthKeywords.some(keyword => 
      altText.toLowerCase().includes(keyword.toLowerCase())
    );

    return hasKeywords;
  }

  /**
   * 生成优化的alt文本建议
   */
  generateAltSuggestions(usage) {
    const suggestions = [];
    const imageSrc = usage.imageSrc;
    const fileName = path.basename(imageSrc, path.extname(imageSrc));
    
    // 基于文件名生成建议
    const fileNameWords = fileName.split(/[-_]/).filter(word => word.length > 2);
    
    // 基于上下文生成建议
    const contextKeywords = this.extractContextKeywords(usage.lineContent);
    
    // 生成多个建议选项
    if (fileNameWords.length > 0) {
      const descriptiveAlt = fileNameWords
        .map(word => this.capitalizeFirst(word))
        .join(' ');
      suggestions.push(descriptiveAlt);
    }

    if (contextKeywords.length > 0) {
      const contextualAlt = `${contextKeywords.join(' ')} - ${fileNameWords[0] || 'image'}`;
      suggestions.push(contextualAlt);
    }

    // 基于图片类型生成建议
    const imageType = this.detectImageType(imageSrc, usage.lineContent);
    if (imageType) {
      suggestions.push(`${imageType} - ${fileNameWords[0] || 'image'}`);
    }

    return suggestions.filter((suggestion, index, self) => 
      suggestion && self.indexOf(suggestion) === index
    );
  }

  /**
   * 从上下文提取关键词
   */
  extractContextKeywords(lineContent) {
    const healthKeywords = [
      'period', 'menstrual', 'cycle', 'pain', 'symptom', 'health',
      'tracker', 'calendar', 'chart', 'graph', 'data',
      '月经', '周期', '疼痛', '症状', '健康', '追踪', '日历'
    ];

    return healthKeywords.filter(keyword => 
      lineContent.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * 检测图片类型
   */
  detectImageType(imageSrc, context) {
    const src = imageSrc.toLowerCase();
    const ctx = context.toLowerCase();

    if (src.includes('icon') || ctx.includes('icon')) return 'Icon';
    if (src.includes('logo') || ctx.includes('logo')) return 'Logo';
    if (src.includes('banner') || ctx.includes('banner')) return 'Banner';
    if (src.includes('chart') || ctx.includes('chart')) return 'Chart';
    if (src.includes('graph') || ctx.includes('graph')) return 'Graph';
    if (src.includes('diagram') || ctx.includes('diagram')) return 'Diagram';
    if (src.includes('illustration') || ctx.includes('illustration')) return 'Illustration';
    
    return null;
  }

  /**
   * 首字母大写
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions(issues) {
    const fixes = [];

    // 缺失alt属性的修复
    issues.missingAlt.forEach(usage => {
      const suggestions = this.generateAltSuggestions(usage);
      fixes.push({
        type: 'missing_alt',
        file: usage.file,
        line: usage.line,
        currentLine: usage.lineContent,
        suggestions: suggestions,
        recommendedFix: this.generateRecommendedFix(usage, suggestions[0])
      });
    });

    // 空alt属性的修复
    issues.emptyAlt.forEach(usage => {
      const suggestions = this.generateAltSuggestions(usage);
      fixes.push({
        type: 'empty_alt',
        file: usage.file,
        line: usage.line,
        currentLine: usage.lineContent,
        suggestions: suggestions,
        recommendedFix: this.generateRecommendedFix(usage, suggestions[0])
      });
    });

    // 通用alt属性的修复
    issues.genericAlt.forEach(usage => {
      const suggestions = this.generateAltSuggestions(usage);
      fixes.push({
        type: 'generic_alt',
        file: usage.file,
        line: usage.line,
        currentLine: usage.lineContent,
        currentAlt: usage.altValue,
        suggestions: suggestions,
        recommendedFix: this.generateRecommendedFix(usage, suggestions[0])
      });
    });

    return fixes;
  }

  /**
   * 生成推荐的修复代码
   */
  generateRecommendedFix(usage, suggestedAlt) {
    const currentLine = usage.lineContent;
    
    if (usage.type === 'missing_alt') {
      // 添加alt属性
      if (currentLine.includes('<img')) {
        return currentLine.replace(
          /<img([^>]*src=["'][^"']+["'][^>]*)>/i,
          `<img$1 alt="${suggestedAlt}">`
        );
      } else if (currentLine.includes('<Image')) {
        return currentLine.replace(
          /<Image([^>]*src=["'][^"']+["'][^>]*)>/i,
          `<Image$1 alt="${suggestedAlt}">`
        );
      }
    } else if (usage.type === 'empty_alt' || usage.type === 'generic_alt') {
      // 替换alt属性
      return currentLine.replace(
        /alt\s*=\s*["'][^"']*["']/i,
        `alt="${suggestedAlt}"`
      );
    }

    return currentLine;
  }

  /**
   * 生成优化报告
   */
  generateReport(issues, fixes) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: issues.missingAlt.length + issues.emptyAlt.length + 
                    issues.genericAlt.length + issues.seoUnfriendly.length,
        missingAlt: issues.missingAlt.length,
        emptyAlt: issues.emptyAlt.length,
        genericAlt: issues.genericAlt.length,
        seoUnfriendly: issues.seoUnfriendly.length
      },
      issues: issues,
      fixes: fixes,
      recommendations: this.generateRecommendations(issues, fixes)
    };

    return report;
  }

  /**
   * 生成优化建议
   */
  generateRecommendations(issues, fixes) {
    const recommendations = [];

    if (issues.missingAlt.length > 0) {
      recommendations.push({
        priority: 'high',
        type: 'accessibility',
        message: `发现 ${issues.missingAlt.length} 个图片缺少alt属性`,
        impact: '影响可访问性和SEO排名',
        action: '为所有图片添加描述性alt属性'
      });
    }

    if (issues.genericAlt.length > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'seo',
        message: `发现 ${issues.genericAlt.length} 个图片使用通用alt文本`,
        impact: '降低SEO效果',
        action: '使用更具体和描述性的alt文本'
      });
    }

    recommendations.push({
      priority: 'medium',
      type: 'best_practices',
      message: '建立图片alt标签规范',
      impact: '提升整体SEO和可访问性',
      action: '制定alt标签编写指南和审核流程'
    });

    return recommendations;
  }

  /**
   * 保存报告
   */
  async saveReport(report) {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    // 保存JSON报告
    fs.writeFileSync(
      path.join(reportsDir, `image-alt-optimization-${timestamp}.json`),
      JSON.stringify(report, null, 2)
    );

    // 保存Markdown报告
    const markdownReport = this.generateMarkdownReport(report);
    fs.writeFileSync(
      path.join(reportsDir, `image-alt-optimization-${timestamp}.md`),
      markdownReport
    );

    console.log(`📊 图片Alt优化报告已保存到 reports/image-alt-optimization-${timestamp}.json`);
    console.log(`📝 Markdown报告已保存到 reports/image-alt-optimization-${timestamp}.md`);
  }

  /**
   * 生成Markdown报告
   */
  generateMarkdownReport(report) {
    let markdown = `# 🖼️ 图片Alt标签优化报告\n\n`;
    markdown += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 摘要
    markdown += `## 📊 问题摘要\n\n`;
    markdown += `- **总问题数**: ${report.summary.totalIssues}\n`;
    markdown += `- **缺少alt属性**: ${report.summary.missingAlt} 个\n`;
    markdown += `- **空alt属性**: ${report.summary.emptyAlt} 个\n`;
    markdown += `- **通用alt文本**: ${report.summary.genericAlt} 个\n`;
    markdown += `- **SEO不友好**: ${report.summary.seoUnfriendly} 个\n\n`;

    // 建议
    if (report.recommendations.length > 0) {
      markdown += `## 🎯 优化建议\n\n`;
      report.recommendations.forEach((rec, index) => {
        markdown += `### ${index + 1}. ${rec.message}\n\n`;
        markdown += `**影响**: ${rec.impact}\n\n`;
        markdown += `**建议行动**: ${rec.action}\n\n`;
      });
    }

    // 修复建议
    if (report.fixes.length > 0) {
      markdown += `## 🔧 具体修复建议\n\n`;
      
      const fixesByType = report.fixes.reduce((acc, fix) => {
        if (!acc[fix.type]) acc[fix.type] = [];
        acc[fix.type].push(fix);
        return acc;
      }, {});

      Object.entries(fixesByType).forEach(([type, fixes]) => {
        markdown += `### ${this.getTypeTitle(type)} (${fixes.length}个)\n\n`;
        
        fixes.slice(0, 5).forEach((fix, index) => {
          markdown += `#### ${index + 1}. ${path.basename(fix.file)}:${fix.line}\n\n`;
          markdown += `**当前代码**:\n\`\`\`\n${fix.currentLine}\n\`\`\`\n\n`;
          markdown += `**建议修复**:\n\`\`\`\n${fix.recommendedFix}\n\`\`\`\n\n`;
          if (fix.suggestions.length > 0) {
            markdown += `**Alt文本建议**:\n`;
            fix.suggestions.forEach(suggestion => {
              markdown += `- "${suggestion}"\n`;
            });
            markdown += `\n`;
          }
        });

        if (fixes.length > 5) {
          markdown += `*还有 ${fixes.length - 5} 个类似问题...*\n\n`;
        }
      });
    }

    return markdown;
  }

  /**
   * 获取类型标题
   */
  getTypeTitle(type) {
    const titles = {
      'missing_alt': '缺少Alt属性',
      'empty_alt': '空Alt属性',
      'generic_alt': '通用Alt文本'
    };
    return titles[type] || type;
  }

  /**
   * 主执行函数
   */
  async run() {
    console.log('🔍 开始扫描图片Alt标签...');
    
    try {
      const imageUsage = await this.scanImageUsage();
      console.log(`📊 发现 ${imageUsage.length} 个图片使用`);
      
      const issues = this.analyzeImageIssues(imageUsage);
      const fixes = this.generateFixSuggestions(issues);
      const report = this.generateReport(issues, fixes);
      
      await this.saveReport(report);
      
      // 控制台输出摘要
      console.log('\n📊 图片Alt标签扫描完成:');
      console.log(`总问题数: ${report.summary.totalIssues}`);
      console.log(`缺少alt属性: ${report.summary.missingAlt} 个`);
      console.log(`空alt属性: ${report.summary.emptyAlt} 个`);
      console.log(`通用alt文本: ${report.summary.genericAlt} 个`);
      console.log(`SEO不友好: ${report.summary.seoUnfriendly} 个`);
      
      if (report.recommendations.length > 0) {
        console.log('\n🎯 主要建议:');
        report.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message}`);
        });
      }
      
    } catch (error) {
      console.error('❌ 图片Alt扫描失败:', error);
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const optimizer = new ImageAltOptimizer();
  optimizer.run();
}

module.exports = ImageAltOptimizer;
