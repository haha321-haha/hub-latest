#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 检查文章SEO元素完整性
 * 验证H1标签、Meta描述、关键词等SEO要素
 */

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, 'content', 'articles'),
  outputReport: path.join(__dirname, 'seo-validation-report.json'),
  outputSummary: path.join(__dirname, 'seo-validation-summary.md')
};

/**
 * 递归扫描目录获取所有markdown文件
 */
function scanDirectoryRecursively(dir, basePath = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const relativePath = basePath ? `${basePath}/${item}` : item;
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        const subFiles = scanDirectoryRecursively(itemPath, relativePath);
        files.push(...subFiles);
      } else if (item.endsWith('.md')) {
        // 添加markdown文件
        files.push({
          path: itemPath,
          relativePath: relativePath,
          key: relativePath.replace('.md', '')
        });
      }
    }
  } catch (error) {
    console.warn(`⚠️  扫描目录失败: ${dir}`, error.message);
  }
  
  return files;
}

/**
 * 解析Frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }
  
  const frontmatterText = frontmatterMatch[1];
  const frontmatter = {};
  
  // 简单的YAML解析（处理基本键值对）
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // 处理数组值
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // 如果JSON解析失败，保持原值
        }
      }
      
      frontmatter[key] = value;
    }
  }
  
  return frontmatter;
}

/**
 * 提取H1标签
 */
function extractH1(content) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : null;
}

/**
 * 检查SEO元素
 */
function checkSEOElements(frontmatter, h1, content) {
  const issues = [];
  const recommendations = [];
  
  // 检查必需的SEO元素
  const requiredElements = [
    'title',
    'seo_title',
    'seo_description',
    'summary',
    'tags',
    'category',
    'author',
    'canonical_url'
  ];
  
  for (const element of requiredElements) {
    if (!frontmatter[element]) {
      issues.push(`缺少必需的SEO元素: ${element}`);
    }
  }
  
  // 检查H1标签
  if (!h1) {
    issues.push('缺少H1标签');
  } else {
    // 检查H1长度
    if (h1.length > 60) {
      recommendations.push('H1标签过长，建议控制在60字符以内');
    }
    
    // 检查H1是否包含关键词
    if (frontmatter.title && !h1.toLowerCase().includes(frontmatter.title.toLowerCase().substring(0, 10))) {
      recommendations.push('H1标签与标题关联性不强');
    }
  }
  
  // 检查SEO标题
  if (frontmatter.seo_title) {
    if (frontmatter.seo_title.length > 60) {
      recommendations.push('SEO标题过长，建议控制在60字符以内');
    }
    if (frontmatter.seo_title.length < 30) {
      recommendations.push('SEO标题过短，建议至少30字符');
    }
  }
  
  // 检查SEO描述
  if (frontmatter.seo_description) {
    if (frontmatter.seo_description.length > 160) {
      recommendations.push('SEO描述过长，建议控制在160字符以内');
    }
    if (frontmatter.seo_description.length < 120) {
      recommendations.push('SEO描述过短，建议至少120字符');
    }
  }
  
  // 检查关键词
  if (frontmatter.keywords) {
    if (Array.isArray(frontmatter.keywords) && frontmatter.keywords.length < 5) {
      recommendations.push('关键词数量较少，建议至少5个关键词');
    }
  } else {
    recommendations.push('缺少关键词字段');
  }
  
  // 检查标签
  if (frontmatter.tags) {
    if (Array.isArray(frontmatter.tags) && frontmatter.tags.length < 3) {
      recommendations.push('标签数量较少，建议至少3个标签');
    }
  }
  
  // 检查内容长度
  const contentLength = content.length;
  if (contentLength < 1000) {
    recommendations.push('内容过短，建议至少1000字符');
  } else if (contentLength > 5000) {
    recommendations.push('内容较长，考虑分段或优化结构');
  }
  
  // 检查图片
  if (!frontmatter.featured_image) {
    recommendations.push('缺少特色图片');
  }
  
  // 检查阅读时间
  if (!frontmatter.reading_time) {
    recommendations.push('缺少阅读时间估算');
  }
  
  return { issues, recommendations };
}

/**
 * 主检查函数
 */
function checkArticleSEO() {
  console.log('🔍 开始检查文章SEO元素...\n');
  
  // 扫描所有文章文件
  const enDir = path.join(CONFIG.articlesDir, 'en');
  const zhDir = path.join(CONFIG.articlesDir, 'zh');
  
  const allFiles = [];
  
  if (fs.existsSync(enDir)) {
    allFiles.push(...scanDirectoryRecursively(enDir, 'en'));
  }
  
  if (fs.existsSync(zhDir)) {
    allFiles.push(...scanDirectoryRecursively(zhDir, 'zh'));
  }
  
  console.log(`📁 发现 ${allFiles.length} 个文章文件\n`);
  
  const results = {
    totalFiles: allFiles.length,
    checkedFiles: 0,
    filesWithIssues: 0,
    filesWithRecommendations: 0,
    files: [],
    checkTime: new Date().toISOString()
  };
  
  // 检查每个文件
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const frontmatter = parseFrontmatter(content);
      const h1 = extractH1(content);
      
      if (!frontmatter) {
        results.files.push({
          file: file.key,
          path: file.path,
          status: 'error',
          issues: ['无法解析Frontmatter'],
          recommendations: []
        });
        results.filesWithIssues++;
        continue;
      }
      
      const seoCheck = checkSEOElements(frontmatter, h1, content);
      
      const fileResult = {
        file: file.key,
        path: file.path,
        status: seoCheck.issues.length > 0 ? 'issues' : 'ok',
        issues: seoCheck.issues,
        recommendations: seoCheck.recommendations,
        seoScore: calculateSEOScore(frontmatter, h1, content, seoCheck),
        frontmatter: {
          title: frontmatter.title,
          seo_title: frontmatter.seo_title,
          seo_description: frontmatter.seo_description,
          tags: frontmatter.tags,
          keywords: frontmatter.keywords
        }
      };
      
      results.files.push(fileResult);
      results.checkedFiles++;
      
      if (seoCheck.issues.length > 0) {
        results.filesWithIssues++;
        console.log(`❌ ${file.key} - 存在问题`);
        seoCheck.issues.forEach(issue => console.log(`   - ${issue}`));
      } else if (seoCheck.recommendations.length > 0) {
        results.filesWithRecommendations++;
        console.log(`⚠️  ${file.key} - 有改进建议`);
        seoCheck.recommendations.forEach(rec => console.log(`   - ${rec}`));
      } else {
        console.log(`✅ ${file.key} - SEO元素完整`);
      }
      
    } catch (error) {
      console.error(`❌ 检查文件失败: ${file.key}`, error.message);
      results.files.push({
        file: file.key,
        path: file.path,
        status: 'error',
        issues: [`文件读取错误: ${error.message}`],
        recommendations: []
      });
      results.filesWithIssues++;
    }
  }
  
  // 生成报告
  generateReports(results);
  
  // 输出摘要
  console.log('\n📊 SEO检查结果摘要:');
  console.log(`总文件数量: ${results.totalFiles}`);
  console.log(`已检查文件: ${results.checkedFiles}`);
  console.log(`存在问题: ${results.filesWithIssues}`);
  console.log(`有改进建议: ${results.filesWithRecommendations}`);
  console.log(`SEO完整: ${results.checkedFiles - results.filesWithIssues - results.filesWithRecommendations}`);
}

/**
 * 计算SEO评分
 */
function calculateSEOScore(frontmatter, h1, content, seoCheck) {
  let score = 100;
  
  // 基础元素检查
  const requiredElements = ['title', 'seo_title', 'seo_description', 'summary', 'tags', 'category', 'author', 'canonical_url'];
  const missingElements = requiredElements.filter(el => !frontmatter[el]);
  score -= missingElements.length * 10;
  
  // H1标签检查
  if (!h1) score -= 15;
  
  // 长度检查
  if (frontmatter.seo_title && frontmatter.seo_title.length > 60) score -= 5;
  if (frontmatter.seo_description && frontmatter.seo_description.length > 160) score -= 5;
  
  // 内容长度检查
  if (content.length < 1000) score -= 10;
  
  // 关键词检查
  if (!frontmatter.keywords) score -= 10;
  
  // 图片检查
  if (!frontmatter.featured_image) score -= 5;
  
  return Math.max(0, score);
}

/**
 * 生成详细报告
 */
function generateReports(results) {
  try {
    // JSON报告
    fs.writeFileSync(CONFIG.outputReport, JSON.stringify(results, null, 2));
    console.log(`\n📄 详细报告已保存: ${CONFIG.outputReport}`);
    
    // Markdown摘要报告
    const markdownReport = generateMarkdownReport(results);
    fs.writeFileSync(CONFIG.outputSummary, markdownReport);
    console.log(`📄 摘要报告已保存: ${CONFIG.outputSummary}`);
    
  } catch (error) {
    console.error('❌ 生成报告时出错:', error.message);
  }
}

/**
 * 生成Markdown格式的摘要报告
 */
function generateMarkdownReport(results) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# 文章SEO元素检查报告\n\n`;
  report += `**检查时间**: ${timestamp}\n\n`;
  
  report += `## 📊 检查摘要\n\n`;
  report += `- **总文件数量**: ${results.totalFiles}\n`;
  report += `- **已检查文件**: ${results.checkedFiles}\n`;
  report += `- **存在问题**: ${results.filesWithIssues}\n`;
  report += `- **有改进建议**: ${results.filesWithRecommendations}\n`;
  report += `- **SEO完整**: ${results.checkedFiles - results.filesWithIssues - results.filesWithRecommendations}\n\n`;
  
  // 按状态分组
  const filesWithIssues = results.files.filter(f => f.status === 'issues');
  const filesWithRecommendations = results.files.filter(f => f.status === 'ok' && f.recommendations.length > 0);
  const perfectFiles = results.files.filter(f => f.status === 'ok' && f.recommendations.length === 0);
  
  if (filesWithIssues.length > 0) {
    report += `## ❌ 存在问题的文件\n\n`;
    filesWithIssues.forEach(file => {
      report += `### ${file.file}\n`;
      report += `- **问题**: ${file.issues.join(', ')}\n`;
      if (file.recommendations.length > 0) {
        report += `- **建议**: ${file.recommendations.join(', ')}\n`;
      }
      report += `- **SEO评分**: ${file.seoScore}/100\n\n`;
    });
  }
  
  if (filesWithRecommendations.length > 0) {
    report += `## ⚠️ 有改进建议的文件\n\n`;
    filesWithRecommendations.forEach(file => {
      report += `### ${file.file}\n`;
      report += `- **建议**: ${file.recommendations.join(', ')}\n`;
      report += `- **SEO评分**: ${file.seoScore}/100\n\n`;
    });
  }
  
  if (perfectFiles.length > 0) {
    report += `## ✅ SEO完整的文件\n\n`;
    perfectFiles.forEach(file => {
      report += `- ${file.file} (评分: ${file.seoScore}/100)\n`;
    });
    report += `\n`;
  }
  
  report += `## 🔧 SEO优化建议\n\n`;
  report += `1. **确保所有必需元素**: title, seo_title, seo_description, summary, tags, category, author, canonical_url\n`;
  report += `2. **H1标签优化**: 包含关键词，长度控制在60字符以内\n`;
  report += `3. **SEO标题优化**: 长度30-60字符，包含主要关键词\n`;
  report += `4. **SEO描述优化**: 长度120-160字符，包含关键词和行动号召\n`;
  report += `5. **关键词设置**: 至少5个相关关键词\n`;
  report += `6. **内容长度**: 建议1000-5000字符\n`;
  report += `7. **特色图片**: 添加相关的特色图片\n`;
  report += `8. **阅读时间**: 提供准确的阅读时间估算\n\n`;
  
  return report;
}

// 运行检查
if (require.main === module) {
  checkArticleSEO();
}

module.exports = {
  checkArticleSEO,
  parseFrontmatter,
  extractH1,
  checkSEOElements
};
