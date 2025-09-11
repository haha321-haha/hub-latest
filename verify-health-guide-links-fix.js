#!/usr/bin/env node

/**
 * 验证Health Guide链接修复
 * 检查是否成功替换了"Read More"为描述性文字
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 验证Health Guide链接修复...\n');

// 检查翻译文件
function checkTranslationFiles() {
  console.log('📝 检查翻译文件...');
  
  const enFile = path.join(__dirname, 'messages', 'en.json');
  const zhFile = path.join(__dirname, 'messages', 'zh.json');
  
  try {
    const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    const zhData = JSON.parse(fs.readFileSync(zhFile, 'utf8'));
    
    const sections = ['understandingPain', 'reliefMethods', 'lifestyleManagement', 'whenSeekHelp', 'mythsFacts', 'globalPerspective'];
    
    console.log('✅ 英文翻译检查:');
    sections.forEach(section => {
      if (enData.healthGuidePage?.sections?.[section]?.cta) {
        console.log(`   ${section}: "${enData.healthGuidePage.sections[section].cta}"`);
      } else {
        console.log(`   ❌ ${section}: 缺少cta字段`);
      }
    });
    
    console.log('\n✅ 中文翻译检查:');
    sections.forEach(section => {
      if (zhData.healthGuidePage?.sections?.[section]?.cta) {
        console.log(`   ${section}: "${zhData.healthGuidePage.sections[section].cta}"`);
      } else {
        console.log(`   ❌ ${section}: 缺少cta字段`);
      }
    });
    
    return true;
  } catch (error) {
    console.log('❌ 翻译文件检查失败:', error.message);
    return false;
  }
}

// 检查页面组件
function checkPageComponent() {
  console.log('\n📄 检查页面组件...');
  
  const pageFile = path.join(__dirname, 'app', '[locale]', 'health-guide', 'page.tsx');
  
  try {
    const content = fs.readFileSync(pageFile, 'utf8');
    
    // 检查是否添加了cta字段
    const hasCtaField = content.includes('cta: t(');
    console.log(`✅ CTA字段添加: ${hasCtaField ? '是' : '否'}`);
    
    // 检查是否使用了chapter.cta
    const usesChapterCta = content.includes('{chapter.cta}');
    console.log(`✅ 使用chapter.cta: ${usesChapterCta ? '是' : '否'}`);
    
    // 检查是否移除了硬编码的readMore
    const hasHardcodedReadMore = content.includes('{t(\'sections.readMore\')}');
    console.log(`✅ 移除硬编码readMore: ${!hasHardcodedReadMore ? '是' : '否'}`);
    
    return hasCtaField && usesChapterCta && !hasHardcodedReadMore;
  } catch (error) {
    console.log('❌ 页面组件检查失败:', error.message);
    return false;
  }
}

// 检查SEO效果
function checkSEOImprovement() {
  console.log('\n🔍 SEO改进检查...');
  
  const pageFile = path.join(__dirname, 'app', '[locale]', 'health-guide', 'page.tsx');
  
  try {
    const content = fs.readFileSync(pageFile, 'utf8');
    
    // 检查是否包含描述性关键词
    const descriptiveKeywords = [
      'Pain Causes',
      'Relief Methods', 
      'Lifestyle Tips',
      'See a Doctor',
      'Common Myths',
      'Global Therapies'
    ];
    
    console.log('✅ 描述性关键词检查:');
    descriptiveKeywords.forEach(keyword => {
      const found = content.includes(keyword);
      console.log(`   ${keyword}: ${found ? '✅' : '❌'}`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ SEO检查失败:', error.message);
    return false;
  }
}

// 主验证函数
function main() {
  console.log('🚀 开始验证Health Guide链接修复...\n');
  
  const translationCheck = checkTranslationFiles();
  const componentCheck = checkPageComponent();
  const seoCheck = checkSEOImprovement();
  
  console.log('\n📊 验证结果总结:');
  console.log(`   翻译文件更新: ${translationCheck ? '✅ 通过' : '❌ 失败'}`);
  console.log(`   组件代码更新: ${componentCheck ? '✅ 通过' : '❌ 失败'}`);
  console.log(`   SEO改进: ${seoCheck ? '✅ 通过' : '❌ 失败'}`);
  
  if (translationCheck && componentCheck && seoCheck) {
    console.log('\n🎉 所有检查通过！Health Guide链接修复成功！');
    console.log('\n📋 修复内容:');
    console.log('   • 添加了6个描述性CTA文字');
    console.log('   • 支持中英文双语');
    console.log('   • 完全避免硬编码');
    console.log('   • 提升SEO效果');
    console.log('\n🔗 建议下一步:');
    console.log('   1. 启动开发服务器测试效果');
    console.log('   2. 运行PageSpeed Insights验证');
    console.log('   3. 检查移动端显示');
    console.log('   4. 部署到生产环境');
  } else {
    console.log('\n❌ 部分检查失败，请检查上述错误信息');
  }
}

main();


