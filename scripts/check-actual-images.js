#!/usr/bin/env node

/**
 * 检查实际项目图片的alt标签情况
 * 专门检查您提到的8个图片
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ActualImageChecker {
  constructor() {
    this.expectedImages = {
      medical: [
        'female_reproductive_system_anatomy_800x800.png',
        'female_reproductive_system_anatomy_400x400.png',
        'female_reproductive_system_anatomy_800x800.webp',
        'female_reproductive_system_anatomy_400x400.webp'
      ],
      essentialOils: [
        'lavender_essential_oil_800x800.webp',
        'lavender_essential_oil_400x400.webp',
        'cinnamon_essential_oil_800x800.webp',
        'cinnamon_essential_oil_400x400.webp',
        'rose_essential_oil_800x800.webp',
        'rose_essential_oil_400x400.webp',
        'marjoram_essential_oil_800x800.webp',
        'marjoram_essential_oil_400x400.webp',
        'ginger_essential_oil_800x800.webp',
        'ginger_essential_oil_400x400.webp',
        'chamomile_essential_oil_800x800.webp',
        'chamomile_essential_oil_400x400.webp'
      ],
      tools: [
        'assessment-illustration.jpg'
      ]
    };
  }

  /**
   * 检查图片文件是否存在
   */
  checkImageFiles() {
    const results = {
      medical: [],
      essentialOils: [],
      tools: [],
      missing: []
    };

    // 检查医学图片
    this.expectedImages.medical.forEach(imageName => {
      const imagePath = path.join('public/images/medical', imageName);
      if (fs.existsSync(imagePath)) {
        results.medical.push({
          name: imageName,
          path: imagePath,
          size: fs.statSync(imagePath).size,
          exists: true
        });
      } else {
        results.missing.push({
          name: imageName,
          path: imagePath,
          exists: false
        });
      }
    });

    // 检查精油图片
    this.expectedImages.essentialOils.forEach(imageName => {
      const imagePath = path.join('public/images/essential-oils', imageName);
      if (fs.existsSync(imagePath)) {
        results.essentialOils.push({
          name: imageName,
          path: imagePath,
          size: fs.statSync(imagePath).size,
          exists: true
        });
      } else {
        results.missing.push({
          name: imageName,
          path: imagePath,
          exists: false
        });
      }
    });

    // 检查工具图片
    this.expectedImages.tools.forEach(imageName => {
      const imagePath = path.join('public/images/tools', imageName);
      if (fs.existsSync(imagePath)) {
        results.tools.push({
          name: imageName,
          path: imagePath,
          size: fs.statSync(imagePath).size,
          exists: true
        });
      } else {
        results.missing.push({
          name: imageName,
          path: imagePath,
          exists: false
        });
      }
    });

    return results;
  }

  /**
   * 检查图片在代码中的使用情况
   */
  checkImageUsage() {
    const usage = [];
    
    // 扫描项目文件
    const files = glob.sync('**/*.{tsx,jsx,ts,js}', {
      ignore: [
        'node_modules/**', 
        '.next/**', 
        'out/**', 
        'reports/**', 
        'backups/**',
        'recovery-workspace/**',
        'recovered/**',
        'hub-latest-main/**',
        'scripts/**'
      ]
    });

    for (const file of files) {
      if (!fs.statSync(file).isFile()) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // 检查是否包含我们关心的图片路径
        const imagePatterns = [
          /\/images\/medical\//,
          /\/images\/essential-oils\//,
          /\/images\/tools\//
        ];

        imagePatterns.forEach(pattern => {
          if (pattern.test(line)) {
            // 提取图片路径
            const srcMatch = line.match(/src=["']([^"']+)["']/);
            if (srcMatch) {
              const imageSrc = srcMatch[1];
              
              // 检查当前行和接下来几行是否有alt属性
              let hasAlt = false;
              let altText = null;
              
              // 检查当前行
              const currentAltMatch = line.match(/alt=["']([^"']*)["']/);
              if (currentAltMatch) {
                hasAlt = true;
                altText = currentAltMatch[1];
              } else {
                // 检查接下来3行
                for (let i = 1; i <= 3 && index + i < lines.length; i++) {
                  const nextLine = lines[index + i];
                  const nextAltMatch = nextLine.match(/alt=["']([^"']*)["']/);
                  if (nextAltMatch) {
                    hasAlt = true;
                    altText = nextAltMatch[1];
                    break;
                  }
                }
              }
              
              usage.push({
                file: file,
                line: index + 1,
                lineContent: line.trim(),
                imageSrc: imageSrc,
                hasAlt: hasAlt,
                altText: altText
              });
            }
          }
        });
      });
    }

    return usage;
  }

  /**
   * 生成报告
   */
  generateReport(fileCheck, usageCheck) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalExpectedImages: Object.values(this.expectedImages).flat().length,
        totalFoundImages: fileCheck.medical.length + fileCheck.essentialOils.length + fileCheck.tools.length,
        missingImages: fileCheck.missing.length,
        totalUsage: usageCheck.length,
        usageWithAlt: usageCheck.filter(u => u.hasAlt).length,
        usageWithoutAlt: usageCheck.filter(u => !u.hasAlt).length
      },
      fileCheck: fileCheck,
      usageCheck: usageCheck,
      recommendations: this.generateRecommendations(fileCheck, usageCheck)
    };

    return report;
  }

  /**
   * 生成建议
   */
  generateRecommendations(fileCheck, usageCheck) {
    const recommendations = [];

    if (fileCheck.missing.length > 0) {
      recommendations.push({
        type: 'missing_files',
        message: `发现 ${fileCheck.missing.length} 个图片文件缺失`,
        details: fileCheck.missing.map(m => m.name)
      });
    }

    const usageWithoutAlt = usageCheck.filter(u => !u.hasAlt);
    if (usageWithoutAlt.length > 0) {
      recommendations.push({
        type: 'missing_alt',
        message: `发现 ${usageWithoutAlt.length} 个图片使用缺少alt属性`,
        details: usageWithoutAlt.map(u => `${u.file}:${u.line}`)
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
      path.join(reportsDir, `actual-images-check-${timestamp}.json`),
      JSON.stringify(report, null, 2)
    );

    // 保存Markdown报告
    const markdownReport = this.generateMarkdownReport(report);
    fs.writeFileSync(
      path.join(reportsDir, `actual-images-check-${timestamp}.md`),
      markdownReport
    );

    console.log(`📊 实际图片检查报告已保存到 reports/actual-images-check-${timestamp}.json`);
    console.log(`📝 Markdown报告已保存到 reports/actual-images-check-${timestamp}.md`);
  }

  /**
   * 生成Markdown报告
   */
  generateMarkdownReport(report) {
    let markdown = `# 🖼️ 实际项目图片检查报告\n\n`;
    markdown += `**检查时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 摘要
    markdown += `## 📊 检查摘要\n\n`;
    markdown += `- **预期图片总数**: ${report.summary.totalExpectedImages}\n`;
    markdown += `- **找到图片数**: ${report.summary.totalFoundImages}\n`;
    markdown += `- **缺失图片数**: ${report.summary.missingImages}\n`;
    markdown += `- **代码中使用数**: ${report.summary.totalUsage}\n`;
    markdown += `- **有alt属性**: ${report.summary.usageWithAlt}\n`;
    markdown += `- **缺少alt属性**: ${report.summary.usageWithoutAlt}\n\n`;

    // 文件检查详情
    markdown += `## 📁 文件检查详情\n\n`;
    
    if (report.fileCheck.medical.length > 0) {
      markdown += `### 医学图片 (${report.fileCheck.medical.length}个)\n\n`;
      report.fileCheck.medical.forEach(img => {
        markdown += `- ✅ ${img.name} (${(img.size / 1024).toFixed(1)}KB)\n`;
      });
      markdown += `\n`;
    }

    if (report.fileCheck.essentialOils.length > 0) {
      markdown += `### 精油图片 (${report.fileCheck.essentialOils.length}个)\n\n`;
      report.fileCheck.essentialOils.forEach(img => {
        markdown += `- ✅ ${img.name} (${(img.size / 1024).toFixed(1)}KB)\n`;
      });
      markdown += `\n`;
    }

    if (report.fileCheck.tools.length > 0) {
      markdown += `### 工具图片 (${report.fileCheck.tools.length}个)\n\n`;
      report.fileCheck.tools.forEach(img => {
        markdown += `- ✅ ${img.name} (${(img.size / 1024).toFixed(1)}KB)\n`;
      });
      markdown += `\n`;
    }

    if (report.fileCheck.missing.length > 0) {
      markdown += `### 缺失图片 (${report.fileCheck.missing.length}个)\n\n`;
      report.fileCheck.missing.forEach(img => {
        markdown += `- ❌ ${img.name}\n`;
      });
      markdown += `\n`;
    }

    // 使用情况详情
    if (report.usageCheck.length > 0) {
      markdown += `## 🔍 代码使用情况\n\n`;
      
      const usageByFile = report.usageCheck.reduce((acc, usage) => {
        if (!acc[usage.file]) acc[usage.file] = [];
        acc[usage.file].push(usage);
        return acc;
      }, {});

      Object.entries(usageByFile).forEach(([file, usages]) => {
        markdown += `### ${file}\n\n`;
        usages.forEach((usage, index) => {
          markdown += `#### 使用 ${index + 1} (第${usage.line}行)\n\n`;
          markdown += `**图片路径**: ${usage.imageSrc}\n\n`;
          markdown += `**代码**:\n\`\`\`\n${usage.lineContent}\n\`\`\`\n\n`;
          markdown += `**Alt状态**: ${usage.hasAlt ? '✅ 有' : '❌ 无'}\n\n`;
          if (usage.altText) {
            markdown += `**Alt文本**: "${usage.altText}"\n\n`;
          }
        });
      });
    }

    // 建议
    if (report.recommendations.length > 0) {
      markdown += `## 🎯 建议\n\n`;
      report.recommendations.forEach((rec, index) => {
        markdown += `### ${index + 1}. ${rec.message}\n\n`;
        if (rec.details) {
          markdown += `**详情**:\n`;
          rec.details.forEach(detail => {
            markdown += `- ${detail}\n`;
          });
          markdown += `\n`;
        }
      });
    }

    return markdown;
  }

  /**
   * 主执行函数
   */
  async run() {
    console.log('🔍 开始检查实际项目图片...');
    
    try {
      const fileCheck = this.checkImageFiles();
      const usageCheck = this.checkImageUsage();
      const report = this.generateReport(fileCheck, usageCheck);
      
      await this.saveReport(report);
      
      // 控制台输出摘要
      console.log('\n📊 实际图片检查完成:');
      console.log(`预期图片总数: ${report.summary.totalExpectedImages}`);
      console.log(`找到图片数: ${report.summary.totalFoundImages}`);
      console.log(`缺失图片数: ${report.summary.missingImages}`);
      console.log(`代码中使用数: ${report.summary.totalUsage}`);
      console.log(`有alt属性: ${report.summary.usageWithAlt}`);
      console.log(`缺少alt属性: ${report.summary.usageWithoutAlt}`);
      
      if (report.recommendations.length > 0) {
        console.log('\n🎯 主要建议:');
        report.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message}`);
        });
      }
      
    } catch (error) {
      console.error('❌ 图片检查失败:', error);
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const checker = new ActualImageChecker();
  checker.run();
}

module.exports = ActualImageChecker;
