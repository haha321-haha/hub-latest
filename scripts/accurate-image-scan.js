#!/usr/bin/env node

/**
 * 精确图片扫描工具
 * 只扫描实际项目文件，排除备份和测试文件
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class AccurateImageScanner {
  constructor() {
    // 只扫描实际项目文件
    this.includePatterns = [
      'app/**/*.{tsx,jsx,ts,js}',
      'components/**/*.{tsx,jsx,ts,js}',
      'lib/**/*.{tsx,jsx,ts,js}',
      'pages/**/*.{tsx,jsx,ts,js}',
      'content/**/*.{tsx,jsx,ts,js}',
    ];
    
    // 排除的文件和目录
    this.excludePatterns = [
      'node_modules/**',
      '.next/**',
      'out/**',
      'reports/**',
      'backups/**',
      'recovery-workspace/**',
      'recovered/**',
      'hub-latest-main/**',
      'scripts/**', // 排除脚本文件
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
    ];
  }

  /**
   * 扫描实际项目中的图片使用
   */
  async scanProjectImages() {
    console.log('🔍 扫描实际项目图片使用情况...');
    
    const imageUsage = [];
    
    for (const pattern of this.includePatterns) {
      const files = glob.sync(pattern, {
        ignore: this.excludePatterns
      });
      
      for (const file of files) {
        if (!fs.statSync(file).isFile()) continue;
        
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // 检测图片使用模式
          const patterns = [
            /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
            /<Image[^>]*src=["']([^"']+)["'][^>]*>/gi,
            /<OptimizedImage[^>]*src=["']([^"']+)["'][^>]*>/gi,
          ];

          patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(line)) !== null) {
              const imageSrc = match[1];
              const fullTag = match[0];
              
              // 只统计实际的图片文件
              if (this.isActualImage(imageSrc)) {
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
            }
          });
        });
      }
    }

    return imageUsage;
  }

  /**
   * 检查是否为实际图片文件
   */
  isActualImage(src) {
    // 排除明显的测试图片
    const testPatterns = [
      'test-image',
      'placeholder',
      'dummy',
      'mock',
      'sample',
      'example',
      'hero-image.jpg', // 测试用的通用图片名
      'image.jpg',
      'content-image.webp'
    ];
    
    const srcLower = src.toLowerCase();
    return !testPatterns.some(pattern => srcLower.includes(pattern));
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
   * 分析图片问题
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
    if (altText.length < 10 || altText.length > 125) {
      return false;
    }

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
   * 生成报告
   */
  generateReport(imageUsage, issues) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalImages: imageUsage.length,
        totalIssues: issues.missingAlt.length + issues.emptyAlt.length + 
                    issues.genericAlt.length + issues.seoUnfriendly.length,
        missingAlt: issues.missingAlt.length,
        emptyAlt: issues.emptyAlt.length,
        genericAlt: issues.genericAlt.length,
        seoUnfriendly: issues.seoUnfriendly.length
      },
      imageUsage: imageUsage,
      issues: issues,
      recommendations: this.generateRecommendations(issues)
    };

    return report;
  }

  /**
   * 生成建议
   */
  generateRecommendations(issues) {
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
      path.join(reportsDir, `accurate-image-scan-${timestamp}.json`),
      JSON.stringify(report, null, 2)
    );

    // 保存Markdown报告
    const markdownReport = this.generateMarkdownReport(report);
    fs.writeFileSync(
      path.join(reportsDir, `accurate-image-scan-${timestamp}.md`),
      markdownReport
    );

    console.log(`📊 精确图片扫描报告已保存到 reports/accurate-image-scan-${timestamp}.json`);
    console.log(`📝 Markdown报告已保存到 reports/accurate-image-scan-${timestamp}.md`);
  }

  /**
   * 生成Markdown报告
   */
  generateMarkdownReport(report) {
    let markdown = `# 🖼️ 精确图片扫描报告\n\n`;
    markdown += `**扫描时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 摘要
    markdown += `## 📊 扫描摘要\n\n`;
    markdown += `- **总图片数**: ${report.summary.totalImages}\n`;
    markdown += `- **总问题数**: ${report.summary.totalIssues}\n`;
    markdown += `- **缺少alt属性**: ${report.summary.missingAlt} 个\n`;
    markdown += `- **空alt属性**: ${report.summary.emptyAlt} 个\n`;
    markdown += `- **通用alt文本**: ${report.summary.genericAlt} 个\n`;
    markdown += `- **SEO不友好**: ${report.summary.seoUnfriendly} 个\n\n`;

    // 图片使用详情
    if (report.imageUsage.length > 0) {
      markdown += `## 🖼️ 图片使用详情\n\n`;
      
      const imagesByFile = report.imageUsage.reduce((acc, usage) => {
        if (!acc[usage.file]) acc[usage.file] = [];
        acc[usage.file].push(usage);
        return acc;
      }, {});

      Object.entries(imagesByFile).forEach(([file, images]) => {
        markdown += `### ${file}\n\n`;
        images.forEach((image, index) => {
          markdown += `#### 图片 ${index + 1} (第${image.line}行)\n\n`;
          markdown += `**图片源**: ${image.imageSrc}\n\n`;
          markdown += `**代码**:\n\`\`\`\n${image.lineContent}\n\`\`\`\n\n`;
          markdown += `**Alt状态**: ${image.hasAlt ? '✅ 有' : '❌ 无'}\n\n`;
          if (image.altValue) {
            markdown += `**Alt文本**: "${image.altValue}"\n\n`;
          }
        });
      });
    }

    // 建议
    if (report.recommendations.length > 0) {
      markdown += `## 🎯 优化建议\n\n`;
      report.recommendations.forEach((rec, index) => {
        markdown += `### ${index + 1}. ${rec.message}\n\n`;
        markdown += `**影响**: ${rec.impact}\n\n`;
        markdown += `**建议行动**: ${rec.action}\n\n`;
      });
    }

    return markdown;
  }

  /**
   * 主执行函数
   */
  async run() {
    console.log('🔍 开始精确扫描项目图片...');
    
    try {
      const imageUsage = await this.scanProjectImages();
      console.log(`📊 发现 ${imageUsage.length} 个实际图片使用`);
      
      const issues = this.analyzeImageIssues(imageUsage);
      const report = this.generateReport(imageUsage, issues);
      
      await this.saveReport(report);
      
      // 控制台输出摘要
      console.log('\n📊 精确图片扫描完成:');
      console.log(`总图片数: ${report.summary.totalImages}`);
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
      console.error('❌ 图片扫描失败:', error);
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const scanner = new AccurateImageScanner();
  scanner.run();
}

module.exports = AccurateImageScanner;
