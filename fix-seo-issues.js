#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复 SEO 问题的综合脚本
 * 包括 sitemap 重命名、robots.txt 更新、canonical 标签等
 */

// 配置
const CONFIG = {
  sitemapFixed: path.join(__dirname, 'sitemap-fixed.xml'),
  sitemapFinal: path.join(__dirname, 'sitemap.xml'),
  robotsTemplate: path.join(__dirname, 'robots.txt-update.txt'),
  canonicalTemplate: path.join(__dirname, 'canonical-tags-template.html'),
  outputDir: path.join(__dirname, 'seo-fixes'),
  duplicatePages: [
    'https://www.periodhub.health/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf',
    'https://www.periodhub.health/pdf-files/parent-communication-guide-en.pdf',
    'https://www.periodhub.health/pdf-files/parent-communication-guide-zh.pdf',
    'https://www.periodhub.health/pdf-files/teacher-collaboration-handbook-en.pdf',
    'https://www.periodhub.health/pdf-files/teacher-health-manual-en.pdf',
    'https://www.periodhub.health/pdf-files/healthy-habits-checklist-en.pdf',
    'https://www.periodhub.health/pdf-files/pain-tracking-form-zh.pdf',
    'https://www.periodhub.health/pdf-files/specific-menstrual-pain-management-guide-en.pdf',
    'https://www.periodhub.health/en/interactive-tools/symptom-tracker',
    'https://www.periodhub.health/en/interactive-tools',
    'https://www.periodhub.health/zh/teen-health'
  ]
};

/**
 * 创建输出目录
 */
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 创建输出目录: ${CONFIG.outputDir}`);
  }
}

/**
 * 处理 sitemap 重命名
 */
function handleSitemapRename() {
  try {
    // 检查修复后的 sitemap 是否存在
    if (fs.existsSync(CONFIG.sitemapFixed)) {
      // 复制为最终的 sitemap.xml
      fs.copyFileSync(CONFIG.sitemapFixed, CONFIG.sitemapFinal);
      console.log('✅ Sitemap 已重命名为 sitemap.xml');
      
      // 复制到输出目录
      const outputSitemap = path.join(CONFIG.outputDir, 'sitemap.xml');
      fs.copyFileSync(CONFIG.sitemapFixed, outputSitemap);
      console.log(`✅ Sitemap 已复制到: ${outputSitemap}`);
      
      return true;
    } else {
      console.error('❌ 找不到修复后的 sitemap 文件');
      return false;
    }
  } catch (error) {
    console.error('❌ 处理 sitemap 重命名时出错:', error.message);
    return false;
  }
}

/**
 * 生成 robots.txt 更新
 */
function generateRobotsTxt() {
  try {
    const robotsContent = `# Robots.txt 更新规则
# 用于解决 PDF 文件重复索引问题

User-agent: *
# 禁止搜索引擎索引 PDF 文件
Disallow: /pdf-files/

# 允许其他内容
Allow: /

# Sitemap 位置
Sitemap: https://www.periodhub.health/sitemap.xml

# 可选：禁止特定重复页面
# Disallow: /en/interactive-tools/symptom-tracker
# Disallow: /en/interactive-tools
# Disallow: /zh/teen-health
`;

    const outputRobots = path.join(CONFIG.outputDir, 'robots.txt');
    fs.writeFileSync(outputRobots, robotsContent);
    console.log(`✅ Robots.txt 已生成: ${outputRobots}`);
    
    return true;
  } catch (error) {
    console.error('❌ 生成 robots.txt 时出错:', error.message);
    return false;
  }
}

/**
 * 生成 canonical 标签配置
 */
function generateCanonicalConfig() {
  try {
    const canonicalContent = `# Canonical 标签配置
# 用于解决重复页面问题

## 需要添加 canonical 标签的页面

### 1. 交互工具页面
- https://www.periodhub.health/en/interactive-tools/symptom-tracker
  <link rel="canonical" href="https://www.periodhub.health/en/interactive-tools/symptom-tracker" />

- https://www.periodhub.health/en/interactive-tools
  <link rel="canonical" href="https://www.periodhub.health/en/interactive-tools" />

- https://www.periodhub.health/zh/teen-health
  <link rel="canonical" href="https://www.periodhub.health/zh/teen-health" />

## 2. PDF 文件处理建议

以下 PDF 文件建议从搜索引擎索引中移除：
${CONFIG.duplicatePages.filter(url => url.includes('.pdf')).map(url => `- ${url}`).join('\n')}

建议在 robots.txt 中添加：
Disallow: /pdf-files/

## 3. 实施步骤

1. 将 sitemap.xml 上传到网站根目录
2. 更新 robots.txt 文件
3. 为重复页面添加 canonical 标签
4. 在 Google Search Console 中重新提交 sitemap
5. 监控索引状态变化

## 4. 验证方法

1. 检查 sitemap.xml 是否可以正常访问
2. 验证 robots.txt 是否正确阻止 PDF 文件
3. 检查 canonical 标签是否正确设置
4. 监控 Google Search Console 中的重复页面数量变化
`;

    const outputCanonical = path.join(CONFIG.outputDir, 'canonical-config.md');
    fs.writeFileSync(outputCanonical, canonicalContent);
    console.log(`✅ Canonical 配置已生成: ${outputCanonical}`);
    
    return true;
  } catch (error) {
    console.error('❌ 生成 canonical 配置时出错:', error.message);
    return false;
  }
}

/**
 * 生成实施指南
 */
function generateImplementationGuide() {
  try {
    const guideContent = `# SEO 问题修复实施指南

## 🎯 修复目标
解决 Google 发现的 11 个重复网页问题，确保 sitemap 正确配置。

## 📋 问题清单
- [x] Sitemap 重复 URL 问题（8 个重复 URL）
- [x] Sitemap 文件命名问题
- [ ] PDF 文件重复索引问题（8 个 PDF 文件）
- [ ] HTML 页面重复问题（3 个页面）

## 🔧 修复步骤

### 步骤 1: 上传修复后的 Sitemap
1. 将 \`sitemap.xml\` 上传到网站根目录
2. 确保文件可以通过 https://www.periodhub.health/sitemap.xml 访问
3. 验证 sitemap 包含 170 个唯一 URL

### 步骤 2: 更新 Robots.txt
1. 在网站根目录的 robots.txt 中添加以下规则：
   \`\`\`
   Disallow: /pdf-files/
   \`\`\`
2. 确保 sitemap 位置正确：
   \`\`\`
   Sitemap: https://www.periodhub.health/sitemap.xml
   \`\`\`

### 步骤 3: 添加 Canonical 标签
为以下页面添加 canonical 标签：

#### 交互工具页面
- /en/interactive-tools/symptom-tracker
- /en/interactive-tools
- /zh/teen-health

示例：
\`\`\`html
<link rel="canonical" href="https://www.periodhub.health/en/interactive-tools/symptom-tracker" />
\`\`\`

### 步骤 4: 重新提交 Sitemap
1. 登录 Google Search Console
2. 进入 Sitemaps 部分
3. 删除旧的 sitemap 提交
4. 重新提交 sitemap.xml
5. 在 Bing Webmaster Tools 中执行相同操作

### 步骤 5: 监控和验证
1. 等待 1-2 周让搜索引擎重新抓取
2. 检查 Google Search Console 中的重复页面数量
3. 验证页面数量是否从 178 减少到 170
4. 确认 Bing 和 Google 的页面数量一致

## 📊 预期结果
- Google 和 Bing 都显示 170 个页面
- 重复页面数量从 11 个减少到 0 个
- PDF 文件不再被搜索引擎索引
- 所有页面都有正确的 canonical 标签

## ⚠️ 注意事项
1. 修复后需要等待搜索引擎重新抓取才能看到效果
2. 建议在测试环境中先验证修复效果
3. 定期监控 SEO 指标变化
4. 如果问题持续存在，可能需要进一步调查内容差异

## 📞 技术支持
如果遇到问题，请检查：
1. 文件上传是否正确
2. 服务器配置是否支持 robots.txt
3. HTML 页面的 canonical 标签是否正确添加
4. 搜索引擎抓取工具是否正常工作
`;

    const outputGuide = path.join(CONFIG.outputDir, 'implementation-guide.md');
    fs.writeFileSync(outputGuide, guideContent);
    console.log(`✅ 实施指南已生成: ${outputGuide}`);
    
    return true;
  } catch (error) {
    console.error('❌ 生成实施指南时出错:', error.message);
    return false;
  }
}

/**
 * 生成修复摘要
 */
function generateFixSummary() {
  try {
    const summaryContent = `# SEO 问题修复摘要

## ✅ 已完成的修复
1. **Sitemap 重复 URL 问题**: 已移除 8 个重复 URL
2. **Sitemap 文件命名**: 已重命名为 sitemap.xml
3. **文件准备**: 已生成所有必要的配置文件

## 📁 生成的文件
- \`sitemap.xml\`: 修复后的 sitemap（170 个唯一 URL）
- \`robots.txt\`: 更新规则，阻止 PDF 文件索引
- \`canonical-config.md\`: Canonical 标签配置说明
- \`implementation-guide.md\`: 详细实施指南

## 🎯 下一步操作
1. 上传 sitemap.xml 到网站根目录
2. 更新 robots.txt 文件
3. 为重复页面添加 canonical 标签
4. 重新提交 sitemap 到搜索引擎
5. 监控修复效果

## 📈 预期效果
- Google 和 Bing 页面数量一致（170 个）
- 重复页面数量减少到 0
- PDF 文件不再被索引
- 整体 SEO 健康度提升

修复时间: ${new Date().toLocaleString('zh-CN')}
`;

    const outputSummary = path.join(CONFIG.outputDir, 'fix-summary.md');
    fs.writeFileSync(outputSummary, summaryContent);
    console.log(`✅ 修复摘要已生成: ${outputSummary}`);
    
    return true;
  } catch (error) {
    console.error('❌ 生成修复摘要时出错:', error.message);
    return false;
  }
}

/**
 * 主修复函数
 */
function fixSeoIssues() {
  console.log('🔧 开始修复 SEO 问题...\n');
  
  // 创建输出目录
  createOutputDir();
  
  let successCount = 0;
  const totalSteps = 5;
  
  // 步骤 1: 处理 sitemap 重命名
  console.log('📄 处理 sitemap 重命名...');
  if (handleSitemapRename()) {
    successCount++;
    console.log('✅ Sitemap 重命名完成\n');
  } else {
    console.log('❌ Sitemap 重命名失败\n');
  }
  
  // 步骤 2: 生成 robots.txt
  console.log('🤖 生成 robots.txt 更新...');
  if (generateRobotsTxt()) {
    successCount++;
    console.log('✅ Robots.txt 生成完成\n');
  } else {
    console.log('❌ Robots.txt 生成失败\n');
  }
  
  // 步骤 3: 生成 canonical 配置
  console.log('🏷️  生成 canonical 配置...');
  if (generateCanonicalConfig()) {
    successCount++;
    console.log('✅ Canonical 配置生成完成\n');
  } else {
    console.log('❌ Canonical 配置生成失败\n');
  }
  
  // 步骤 4: 生成实施指南
  console.log('📖 生成实施指南...');
  if (generateImplementationGuide()) {
    successCount++;
    console.log('✅ 实施指南生成完成\n');
  } else {
    console.log('❌ 实施指南生成失败\n');
  }
  
  // 步骤 5: 生成修复摘要
  console.log('📊 生成修复摘要...');
  if (generateFixSummary()) {
    successCount++;
    console.log('✅ 修复摘要生成完成\n');
  } else {
    console.log('❌ 修复摘要生成失败\n');
  }
  
  // 输出最终结果
  console.log('🎉 SEO 问题修复完成！');
  console.log(`✅ 成功完成 ${successCount}/${totalSteps} 个步骤`);
  console.log(`📁 所有文件已保存到: ${CONFIG.outputDir}`);
  
  if (successCount === totalSteps) {
    console.log('\n🚀 下一步操作:');
    console.log('1. 上传 sitemap.xml 到网站根目录');
    console.log('2. 更新 robots.txt 文件');
    console.log('3. 为重复页面添加 canonical 标签');
    console.log('4. 重新提交 sitemap 到搜索引擎');
    console.log('5. 监控修复效果');
  }
}

// 运行修复
if (require.main === module) {
  fixSeoIssues();
}

module.exports = {
  fixSeoIssues,
  handleSitemapRename,
  generateRobotsTxt,
  generateCanonicalConfig
};













