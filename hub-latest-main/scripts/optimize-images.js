#!/usr/bin/env node

/**
 * 🖼️ PeriodHub 图片优化脚本
 * 
 * 功能：
 * 1. 自动压缩图片
 * 2. 转换为现代格式 (WebP)
 * 3. 生成响应式图片尺寸
 * 4. 添加懒加载属性
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class ImageOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.publicDir = path.join(this.projectRoot, 'public');
    this.imagesDir = path.join(this.publicDir, 'images');
    this.optimizedDir = path.join(this.imagesDir, 'optimized');
    
    // 响应式图片尺寸
    this.sizes = [320, 640, 768, 1024, 1280, 1920];
    
    // 支持的图片格式
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    
    this.stats = {
      processed: 0,
      originalSize: 0,
      optimizedSize: 0,
      errors: []
    };
  }

  async run() {
    console.log('🖼️ 开始图片优化...\n');
    
    try {
      await this.checkSharpInstallation();
      await this.createOptimizedDirectory();
      await this.processImages();
      await this.generateReport();
      
      console.log('\n✅ 图片优化完成！');
      
    } catch (error) {
      console.error('❌ 图片优化失败:', error.message);
      process.exit(1);
    }
  }

  async checkSharpInstallation() {
    try {
      require('sharp');
      console.log('✅ Sharp 已安装');
    } catch (error) {
      console.log('📦 正在安装 Sharp...');
      const { execSync } = require('child_process');
      execSync('npm install sharp', { stdio: 'inherit' });
      console.log('✅ Sharp 安装完成');
    }
  }

  async createOptimizedDirectory() {
    if (!fs.existsSync(this.optimizedDir)) {
      fs.mkdirSync(this.optimizedDir, { recursive: true });
      console.log('📁 创建优化图片目录');
    }
  }

  async processImages() {
    if (!fs.existsSync(this.imagesDir)) {
      console.log('⚠️ images 目录不存在，跳过图片优化');
      return;
    }

    const imageFiles = this.getImageFiles(this.imagesDir);
    console.log(`🔍 找到 ${imageFiles.length} 个图片文件`);

    for (const imagePath of imageFiles) {
      await this.optimizeImage(imagePath);
    }
  }

  getImageFiles(dir) {
    const files = [];
    
    function scanDirectory(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.includes('optimized')) {
          scanDirectory(itemPath);
        } else if (optimizer.supportedFormats.includes(path.extname(item).toLowerCase())) {
          files.push(itemPath);
        }
      }
    }
    
    const optimizer = this;
    scanDirectory(dir);
    return files;
  }

  async optimizeImage(imagePath) {
    try {
      const fileName = path.basename(imagePath, path.extname(imagePath));
      const originalStats = fs.statSync(imagePath);
      this.stats.originalSize += originalStats.size;

      console.log(`🔧 优化: ${path.basename(imagePath)}`);

      // 获取图片信息
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // 生成 WebP 格式的响应式图片
      for (const size of this.sizes) {
        if (size <= metadata.width) {
          const outputPath = path.join(
            this.optimizedDir,
            `${fileName}-${size}w.webp`
          );

          await image
            .resize(size, null, {
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp({
              quality: 85,
              effort: 6
            })
            .toFile(outputPath);

          const optimizedStats = fs.statSync(outputPath);
          this.stats.optimizedSize += optimizedStats.size;
        }
      }

      // 生成原始尺寸的 WebP 版本
      const webpPath = path.join(this.optimizedDir, `${fileName}.webp`);
      await image
        .webp({
          quality: 85,
          effort: 6
        })
        .toFile(webpPath);

      const webpStats = fs.statSync(webpPath);
      this.stats.optimizedSize += webpStats.size;

      this.stats.processed++;

    } catch (error) {
      console.error(`❌ 优化失败: ${path.basename(imagePath)} - ${error.message}`);
      this.stats.errors.push({
        file: imagePath,
        error: error.message
      });
    }
  }

  async generateReport() {
    const compressionRatio = this.stats.originalSize > 0 
      ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize * 100).toFixed(1)
      : 0;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        processedImages: this.stats.processed,
        originalSizeKB: Math.round(this.stats.originalSize / 1024),
        optimizedSizeKB: Math.round(this.stats.optimizedSize / 1024),
        savedKB: Math.round((this.stats.originalSize - this.stats.optimizedSize) / 1024),
        compressionRatio: `${compressionRatio}%`,
        errors: this.stats.errors.length
      },
      errors: this.stats.errors,
      nextSteps: [
        '1. 在组件中使用 Next.js Image 组件',
        '2. 配置 srcSet 属性实现响应式图片',
        '3. 添加适当的 alt 文本提升可访问性',
        '4. 考虑使用图片懒加载'
      ]
    };

    // 保存 JSON 报告
    const reportPath = path.join(this.projectRoot, 'image-optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成使用指南
    this.generateUsageGuide(report);

    // 控制台输出摘要
    console.log('\n📊 优化摘要:');
    console.log(`   处理图片: ${report.summary.processedImages} 个`);
    console.log(`   原始大小: ${report.summary.originalSizeKB} KB`);
    console.log(`   优化后大小: ${report.summary.optimizedSizeKB} KB`);
    console.log(`   节省空间: ${report.summary.savedKB} KB (${report.summary.compressionRatio})`);
    
    if (report.summary.errors > 0) {
      console.log(`   错误数量: ${report.summary.errors}`);
    }
  }

  generateUsageGuide(report) {
    const guidePath = path.join(this.projectRoot, 'image-usage-guide.md');
    
    const content = `# 🖼️ PeriodHub 图片使用指南

生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}

## 📊 优化结果

- **处理图片**: ${report.summary.processedImages} 个
- **原始大小**: ${report.summary.originalSizeKB} KB
- **优化后大小**: ${report.summary.optimizedSizeKB} KB
- **节省空间**: ${report.summary.savedKB} KB (${report.summary.compressionRatio})

## 🚀 使用优化后的图片

### 1. 基础用法

\`\`\`jsx
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/images/optimized/hero-image.webp"
      alt="描述性文本"
      width={800}
      height={600}
      priority // 对于首屏重要图片
    />
  );
}
\`\`\`

### 2. 响应式图片

\`\`\`jsx
import Image from 'next/image';

function ResponsiveImage() {
  return (
    <Image
      src="/images/optimized/hero-image.webp"
      alt="描述性文本"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover"
    />
  );
}
\`\`\`

### 3. 懒加载图片

\`\`\`jsx
import Image from 'next/image';

function LazyImage() {
  return (
    <Image
      src="/images/optimized/content-image.webp"
      alt="描述性文本"
      width={600}
      height={400}
      loading="lazy" // 默认就是懒加载
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  );
}
\`\`\`

## 📱 移动端优化

### 使用 srcSet 提供多种尺寸

\`\`\`jsx
<Image
  src="/images/optimized/hero-image.webp"
  srcSet="
    /images/optimized/hero-image-320w.webp 320w,
    /images/optimized/hero-image-640w.webp 640w,
    /images/optimized/hero-image-1024w.webp 1024w
  "
  sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, 1024px"
  alt="描述性文本"
  width={1024}
  height={768}
/>
\`\`\`

## 🎯 性能最佳实践

### 1. 图片优先级
- 首屏图片使用 \`priority={true}\`
- 其他图片使用默认懒加载

### 2. 尺寸规划
- 移动端: 320px, 640px
- 平板: 768px, 1024px  
- 桌面: 1280px, 1920px

### 3. 格式选择
- 优先使用 WebP 格式
- 提供 JPEG/PNG 作为后备

### 4. 压缩设置
- 质量: 85% (平衡质量和大小)
- 渐进式 JPEG
- 优化元数据

## 🔧 故障排除

${report.errors.length > 0 ? `
### 处理错误的图片

${report.errors.map((error, index) => `
${index + 1}. **${path.basename(error.file)}**
   - 错误: ${error.error}
   - 建议: 检查图片格式和完整性
`).join('')}
` : '✅ 所有图片都成功优化！'}

## 📈 下一步行动

${report.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---

*由 PeriodHub 图片优化器生成*
`;

    fs.writeFileSync(guidePath, content);
  }
}

// 运行优化器
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = ImageOptimizer;