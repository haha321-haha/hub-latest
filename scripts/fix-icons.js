#!/usr/bin/env node

/**
 * 🎨 PeriodHub 图标修复脚本
 * 
 * 功能：
 * 1. 检查所有必需的图标文件
 * 2. 生成缺失的图标尺寸
 * 3. 修复 manifest.json 配置
 * 4. 验证图标引用
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class IconFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.publicDir = path.join(this.projectRoot, 'public');
    
    // 需要的图标尺寸
    this.requiredIcons = [
      { name: 'icon-192.png', size: 192 },
      { name: 'icon-512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 }, // Apple 推荐尺寸
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'favicon-16x16.png', size: 16 }
    ];
    
    this.results = {
      existing: [],
      generated: [],
      errors: []
    };
  }

  async run() {
    console.log('🎨 开始修复图标文件...\n');
    
    try {
      await this.checkSharpInstallation();
      await this.checkExistingIcons();
      await this.generateMissingIcons();
      await this.updateManifest();
      await this.generateReport();
      
      console.log('\n✅ 图标修复完成！');
      
    } catch (error) {
      console.error('❌ 图标修复失败:', error.message);
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

  async checkExistingIcons() {
    console.log('🔍 检查现有图标文件...');
    
    for (const icon of this.requiredIcons) {
      const iconPath = path.join(this.publicDir, icon.name);
      
      if (fs.existsSync(iconPath)) {
        console.log(`✅ 找到: ${icon.name}`);
        this.results.existing.push(icon.name);
      } else {
        console.log(`❌ 缺失: ${icon.name}`);
      }
    }
  }

  async generateMissingIcons() {
    console.log('🎨 生成缺失的图标...');
    
    // 查找源图标文件
    const sourceIcon = this.findSourceIcon();
    if (!sourceIcon) {
      throw new Error('未找到源图标文件');
    }
    
    console.log(`📄 使用源文件: ${sourceIcon}`);
    
    for (const icon of this.requiredIcons) {
      const iconPath = path.join(this.publicDir, icon.name);
      
      if (!fs.existsSync(iconPath)) {
        try {
          await this.generateIcon(sourceIcon, iconPath, icon.size);
          console.log(`✅ 生成: ${icon.name} (${icon.size}x${icon.size})`);
          this.results.generated.push(icon.name);
        } catch (error) {
          console.error(`❌ 生成失败: ${icon.name} - ${error.message}`);
          this.results.errors.push({
            file: icon.name,
            error: error.message
          });
        }
      }
    }
  }

  findSourceIcon() {
    const possibleSources = [
      path.join(this.publicDir, 'icon.svg'),
      path.join(this.publicDir, 'icon-512.png'),
      path.join(this.publicDir, 'icon-192.png'),
      path.join(this.publicDir, 'images', 'logo.png')
    ];
    
    for (const source of possibleSources) {
      if (fs.existsSync(source)) {
        return source;
      }
    }
    
    return null;
  }

  async generateIcon(sourcePath, outputPath, size) {
    const image = sharp(sourcePath);
    
    // 如果是 SVG，需要设置密度
    if (path.extname(sourcePath) === '.svg') {
      await image
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
    } else {
      await image
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
    }
  }

  async updateManifest() {
    console.log('📝 更新 manifest.json...');
    
    const manifestPath = path.join(this.publicDir, 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      console.log('⚠️ manifest.json 不存在，跳过更新');
      return;
    }
    
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // 更新图标配置
      manifest.icons = [
        {
          "src": "/icon-192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "/icon-512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "/apple-touch-icon.png",
          "sizes": "180x180",
          "type": "image/png",
          "purpose": "any"
        }
      ];
      
      // 更新主题色
      manifest.theme_color = "#9333ea";
      manifest.background_color = "#ffffff";
      
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('✅ manifest.json 更新完成');
      
    } catch (error) {
      console.error('❌ 更新 manifest.json 失败:', error.message);
      this.results.errors.push({
        file: 'manifest.json',
        error: error.message
      });
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        existingIcons: this.results.existing.length,
        generatedIcons: this.results.generated.length,
        errors: this.results.errors.length
      },
      existing: this.results.existing,
      generated: this.results.generated,
      errors: this.results.errors,
      nextSteps: [
        '1. 验证所有图标文件都已生成',
        '2. 检查 manifest.json 配置',
        '3. 测试 PWA 安装功能',
        '4. 验证苹果设备上的图标显示'
      ]
    };

    // 保存报告
    const reportPath = path.join(this.projectRoot, 'icon-fix-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 控制台输出摘要
    console.log('\n📊 图标修复摘要:');
    console.log(`   现有图标: ${report.summary.existingIcons} 个`);
    console.log(`   生成图标: ${report.summary.generatedIcons} 个`);
    console.log(`   错误数量: ${report.summary.errors}`);
    
    if (report.summary.errors > 0) {
      console.log('\n❌ 错误详情:');
      this.results.errors.forEach(error => {
        console.log(`   ${error.file}: ${error.error}`);
      });
    }
  }
}

// 运行图标修复器
if (require.main === module) {
  const fixer = new IconFixer();
  fixer.run().catch(console.error);
}

module.exports = IconFixer;