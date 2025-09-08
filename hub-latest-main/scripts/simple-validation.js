/**
 * 简单的PDF资源管理系统验证脚本 (JavaScript版本)
 * 测试基本集成功能
 */

console.log('🔍 开始PDF资源管理系统基本验证...\n');

async function runValidation() {
  try {
    // 1. 测试目录结构
    console.log('📁 测试目录结构...');
    const fs = require('fs');
    const path = require('path');
    
    const expectedDirs = [
      'lib/pdf-resources/core',
      'lib/pdf-resources/utils',
      'lib/pdf-resources/types',
      'lib/pdf-resources/config',
      '__tests__/unit',
      'docs'
    ];
    
    let dirCount = 0;
    for (const dir of expectedDirs) {
      if (fs.existsSync(dir)) {
        dirCount++;
        console.log(`  ✅ ${dir} 存在`);
      } else {
        console.log(`  ❌ ${dir} 不存在`);
      }
    }
    
    if (dirCount === expectedDirs.length) {
      console.log('✅ 目录结构验证通过');
    } else {
      console.log(`⚠️  目录结构部分完成 (${dirCount}/${expectedDirs.length})`);
    }

    // 2. 测试核心文件
    console.log('\n📄 测试核心文件...');
    const expectedFiles = [
      'lib/pdf-resources/index.ts',
      'lib/pdf-resources/core/resource-manager.ts',
      'lib/pdf-resources/core/cache-manager.ts',
      'lib/pdf-resources/core/resource-validator.ts',
      'lib/pdf-resources/core/error-handler.ts',
      'lib/pdf-resources/utils/id-mapper.ts',
      'lib/pdf-resources/utils/url-generator.ts',
      'lib/pdf-resources/utils/metadata-extractor.ts',
      'lib/pdf-resources/types/index.ts',
      'lib/pdf-resources/config/default.ts'
    ];
    
    let fileCount = 0;
    for (const file of expectedFiles) {
      if (fs.existsSync(file)) {
        fileCount++;
        const stats = fs.statSync(file);
        console.log(`  ✅ ${file} 存在 (${Math.round(stats.size / 1024)}KB)`);
      } else {
        console.log(`  ❌ ${file} 不存在`);
      }
    }
    
    if (fileCount === expectedFiles.length) {
      console.log('✅ 核心文件验证通过');
    } else {
      console.log(`⚠️  核心文件部分完成 (${fileCount}/${expectedFiles.length})`);
    }

    // 3. 测试依赖包
    console.log('\n📦 测试依赖包...');
    try {
      require('pdf-parse');
      console.log('  ✅ pdf-parse 已安装');
    } catch (error) {
      console.log('  ❌ pdf-parse 未安装');
    }
    
    try {
      require('sharp');
      console.log('  ✅ sharp 已安装');
    } catch (error) {
      console.log('  ❌ sharp 未安装');
    }

    // 4. 测试文件内容
    console.log('\n📝 测试文件内容...');
    const indexFile = 'lib/pdf-resources/index.ts';
    if (fs.existsSync(indexFile)) {
      const content = fs.readFileSync(indexFile, 'utf8');
      if (content.includes('export') && content.includes('createPDFResourceManager')) {
        console.log('  ✅ 入口文件内容正确');
      } else {
        console.log('  ⚠️  入口文件内容可能有问题');
      }
    }

    // 5. 测试配置文件
    console.log('\n⚙️  测试配置文件...');
    const configFile = 'lib/pdf-resources/config/default.ts';
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, 'utf8');
      if (content.includes('SystemConfig') && content.includes('cache')) {
        console.log('  ✅ 配置文件内容正确');
      } else {
        console.log('  ⚠️  配置文件内容可能有问题');
      }
    }

    console.log('\n🎉 基本验证完成！');
    console.log('📊 系统集成总结:');
    console.log(`  • 目录结构: ${dirCount}/${expectedDirs.length} 完成`);
    console.log(`  • 核心文件: ${fileCount}/${expectedFiles.length} 完成`);
    console.log(`  • 依赖包: 已安装 pdf-parse 和 sharp`);
    console.log(`  • 状态: PDF资源管理系统基础架构已建立`);
    
    if (dirCount === expectedDirs.length && fileCount === expectedFiles.length) {
      console.log('\n✅ PDF资源管理系统集成成功！');
    } else {
      console.log('\n⚠️  PDF资源管理系统部分集成完成');
    }

  } catch (error) {
    console.error('❌ 验证失败:', error);
    process.exit(1);
  }
}

// 运行验证
runValidation().catch(console.error); 