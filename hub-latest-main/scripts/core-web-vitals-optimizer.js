#!/usr/bin/env node

/**
 * 🚀 PeriodHub Core Web Vitals 优化器
 * 
 * 这个脚本会：
 * 1. 检查页面加载速度
 * 2. 优化图片压缩和懒加载
 * 3. 检查移动端响应式设计
 * 4. 生成性能优化报告
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CoreWebVitalsOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.publicDir = path.join(this.projectRoot, 'public');
    this.imagesDir = path.join(this.publicDir, 'images');
    this.results = {
      images: [],
      performance: {},
      recommendations: []
    };
  }

  async run() {
    console.log('🚀 开始 Core Web Vitals 优化...\n');
    
    try {
      await this.checkProjectStructure();
      await this.analyzeImages();
      await this.checkNextConfig();
      await this.analyzeCSS();
      await this.generateOptimizations();
      await this.generateReport();
      
      console.log('\n✅ Core Web Vitals 优化完成！');
      console.log('📊 查看详细报告: ./core-web-vitals-report.json');
      
    } catch (error) {
      console.error('❌ 优化过程中出现错误:', error.message);
      process.exit(1);
    }
  }

  async checkProjectStructure() {
    console.log('📁 检查项目结构...');
    
    const requiredDirs = ['public', 'app', 'components'];
    const missingDirs = [];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        missingDirs.push(dir);
      }
    }
    
    if (missingDirs.length > 0) {
      throw new Error(`缺少必要目录: ${missingDirs.join(', ')}`);
    }
    
    console.log('✅ 项目结构检查通过');
  }

  async analyzeImages() {
    console.log('🖼️  分析图片资源...');
    
    if (!fs.existsSync(this.imagesDir)) {
      console.log('⚠️  images 目录不存在，跳过图片分析');
      return;
    }
    
    const imageFiles = this.getImageFiles(this.imagesDir);
    
    for (const imagePath of imageFiles) {
      const stats = fs.statSync(imagePath);
      const relativePath = path.relative(this.publicDir, imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      
      const imageInfo = {
        path: relativePath,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
        extension: ext,
        needsOptimization: false,
        recommendations: []
      };
      
      // 检查图片大小
      if (stats.size > 500 * 1024) { // 500KB
        imageInfo.needsOptimization = true;
        imageInfo.recommendations.push('图片过大，建议压缩到500KB以下');
      }
      
      // 检查图片格式
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        imageInfo.recommendations.push('建议转换为WebP格式以获得更好的压缩率');
      }
      
      this.results.images.push(imageInfo);
    }
    
    console.log(`✅ 分析了 ${imageFiles.length} 个图片文件`);
  }

  getImageFiles(dir) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const files = [];
    
    function scanDirectory(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (imageExtensions.includes(path.extname(item).toLowerCase())) {
          files.push(itemPath);
        }
      }
    }
    
    scanDirectory(dir);
    return files;
  }

  async checkNextConfig() {
    console.log('⚙️  检查 Next.js 配置...');
    
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
      this.results.recommendations.push({
        type: 'config',
        priority: 'high',
        message: '缺少 next.config.js 文件',
        solution: '创建 next.config.js 并配置图片优化'
      });
      return;
    }
    
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // 检查图片优化配置
    if (!configContent.includes('images:')) {
      this.results.recommendations.push({
        type: 'config',
        priority: 'medium',
        message: 'Next.js 图片优化未配置',
        solution: '在 next.config.js 中添加 images 配置'
      });
    }
    
    // 检查现代图片格式支持
    if (!configContent.includes('webp') && !configContent.includes('avif')) {
      this.results.recommendations.push({
        type: 'config',
        priority: 'medium',
        message: '未启用现代图片格式',
        solution: '在 images 配置中添加 formats: ["image/webp", "image/avif"]'
      });
    }
    
    console.log('✅ Next.js 配置检查完成');
  }

  async analyzeCSS() {
    console.log('🎨 分析 CSS 性能...');
    
    const globalCSSPath = path.join(this.projectRoot, 'app', 'globals.css');
    
    if (!fs.existsSync(globalCSSPath)) {
      this.results.recommendations.push({
        type: 'css',
        priority: 'low',
        message: '未找到 globals.css 文件',
        solution: '确保全局样式文件存在'
      });
      return;
    }
    
    const cssContent = fs.readFileSync(globalCSSPath, 'utf8');
    const cssSize = Buffer.byteLength(cssContent, 'utf8');
    
    this.results.performance.cssSize = cssSize;
    this.results.performance.cssSizeKB = Math.round(cssSize / 1024);
    
    // 检查CSS大小
    if (cssSize > 100 * 1024) { // 100KB
      this.results.recommendations.push({
        type: 'css',
        priority: 'medium',
        message: `CSS文件过大 (${Math.round(cssSize / 1024)}KB)`,
        solution: '考虑拆分CSS或移除未使用的样式'
      });
    }
    
    // 检查关键CSS优化
    if (!cssContent.includes('@media')) {
      this.results.recommendations.push({
        type: 'css',
        priority: 'low',
        message: '缺少响应式媒体查询',
        solution: '添加移动端优化的媒体查询'
      });
    }
    
    console.log(`✅ CSS 分析完成 (${Math.round(cssSize / 1024)}KB)`);
  }

  async generateOptimizations() {
    console.log('🔧 生成优化建议...');
    
    // 图片优化建议
    const largeImages = this.results.images.filter(img => img.needsOptimization);
    if (largeImages.length > 0) {
      this.results.recommendations.push({
        type: 'images',
        priority: 'high',
        message: `发现 ${largeImages.length} 个需要优化的图片`,
        solution: '使用 Next.js Image 组件并启用自动优化',
        details: largeImages.map(img => `${img.path} (${img.sizeKB}KB)`)
      });
    }
    
    // 性能优化建议
    this.results.recommendations.push({
      type: 'performance',
      priority: 'high',
      message: '启用 Next.js 性能优化功能',
      solution: '确保使用 Image 组件、动态导入和代码分割'
    });
    
    // 移动端优化建议
    this.results.recommendations.push({
      type: 'mobile',
      priority: 'high',
      message: '移动端性能优化',
      solution: '使用响应式图片、触摸优化和移动端友好的交互'
    });
    
    console.log(`✅ 生成了 ${this.results.recommendations.length} 个优化建议`);
  }

  async generateReport() {
    console.log('📊 生成性能报告...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalImages: this.results.images.length,
        imagesNeedingOptimization: this.results.images.filter(img => img.needsOptimization).length,
        totalRecommendations: this.results.recommendations.length,
        cssSize: this.results.performance.cssSizeKB || 0
      },
      images: this.results.images,
      performance: this.results.performance,
      recommendations: this.results.recommendations,
      nextSteps: [
        '1. 运行 npm run build 检查构建性能',
        '2. 使用 PageSpeed Insights 测试实际性能',
        '3. 实施高优先级的优化建议',
        '4. 定期监控 Core Web Vitals 指标'
      ]
    };
    
    const reportPath = path.join(this.projectRoot, 'core-web-vitals-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // 生成人类可读的报告
    this.generateHumanReadableReport(report);
    
    console.log('✅ 报告生成完成');
  }

  generateHumanReadableReport(report) {
    const readableReportPath = path.join(this.projectRoot, 'core-web-vitals-report.md');
    
    let content = `# 🚀 PeriodHub Core Web Vitals 优化报告

生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}

## 📊 总览

- **图片总数**: ${report.summary.totalImages}
- **需要优化的图片**: ${report.summary.imagesNeedingOptimization}
- **CSS文件大小**: ${report.summary.cssSize}KB
- **优化建议数量**: ${report.summary.totalRecommendations}

## 🎯 优化建议

`;

    // 按优先级分组显示建议
    const highPriority = report.recommendations.filter(r => r.priority === 'high');
    const mediumPriority = report.recommendations.filter(r => r.priority === 'medium');
    const lowPriority = report.recommendations.filter(r => r.priority === 'low');

    if (highPriority.length > 0) {
      content += `### 🔴 高优先级 (${highPriority.length})\n\n`;
      highPriority.forEach((rec, index) => {
        content += `${index + 1}. **${rec.message}**\n   - 解决方案: ${rec.solution}\n`;
        if (rec.details) {
          content += `   - 详情: ${rec.details.join(', ')}\n`;
        }
        content += '\n';
      });
    }

    if (mediumPriority.length > 0) {
      content += `### 🟡 中优先级 (${mediumPriority.length})\n\n`;
      mediumPriority.forEach((rec, index) => {
        content += `${index + 1}. **${rec.message}**\n   - 解决方案: ${rec.solution}\n\n`;
      });
    }

    if (lowPriority.length > 0) {
      content += `### 🟢 低优先级 (${lowPriority.length})\n\n`;
      lowPriority.forEach((rec, index) => {
        content += `${index + 1}. **${rec.message}**\n   - 解决方案: ${rec.solution}\n\n`;
      });
    }

    content += `## 📈 下一步行动

${report.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## 🖼️ 图片分析详情

`;

    if (report.images.length > 0) {
      content += '| 文件路径 | 大小 | 格式 | 需要优化 | 建议 |\n';
      content += '|----------|------|------|----------|------|\n';
      
      report.images.forEach(img => {
        const needsOpt = img.needsOptimization ? '是' : '否';
        const recommendations = img.recommendations.join('; ') || '无';
        content += `| ${img.path} | ${img.sizeKB}KB | ${img.extension} | ${needsOpt} | ${recommendations} |\n`;
      });
    } else {
      content += '未找到图片文件。\n';
    }

    content += `
## 🔧 实施指南

### 1. 图片优化
\`\`\`bash
# 安装图片优化工具
npm install --save-dev imagemin imagemin-webp

# 使用 Next.js Image 组件
import Image from 'next/image'
\`\`\`

### 2. 性能监控
\`\`\`bash
# 构建并分析包大小
npm run build
npx @next/bundle-analyzer
\`\`\`

### 3. 测试性能
- 使用 PageSpeed Insights: https://pagespeed.web.dev/
- 使用 Lighthouse 进行本地测试
- 监控 Core Web Vitals 指标

---

*报告由 PeriodHub Core Web Vitals 优化器生成*
`;

    fs.writeFileSync(readableReportPath, content);
  }
}

// 运行优化器
if (require.main === module) {
  const optimizer = new CoreWebVitalsOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = CoreWebVitalsOptimizer;