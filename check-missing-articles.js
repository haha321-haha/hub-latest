#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 检查失败URL对应的文章文件是否存在
 * 分析 content/articles/ 目录中的markdown文件
 */

// 配置
const CONFIG = {
  articlesDir: path.join(__dirname, 'content', 'articles'),
  failingUrlsFile: path.join(__dirname, 'www.periodhub.health_FailingUrls_9_9_2025.csv'),
  outputReport: path.join(__dirname, 'missing-articles-report.json'),
  outputSummary: path.join(__dirname, 'missing-articles-summary.md')
};

/**
 * 从CSV文件读取失败URL列表
 */
function readFailingUrls() {
  try {
    const content = fs.readFileSync(CONFIG.failingUrlsFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // 跳过标题行，提取URL
    const urls = lines.slice(1).map(line => {
      // 移除引号并提取URL
      const url = line.replace(/"/g, '').trim();
      return url;
    }).filter(url => url && url.startsWith('http'));
    
    console.log(`📊 读取到 ${urls.length} 个失败URL`);
    return urls;
  } catch (error) {
    console.error('❌ 读取失败URL文件时出错:', error.message);
    return [];
  }
}

/**
 * 递归扫描目录获取所有markdown文件
 */
function scanDirectoryRecursively(dir, basePath = '') {
  const files = new Map();
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const relativePath = basePath ? `${basePath}/${item}` : item;
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        const subFiles = scanDirectoryRecursively(itemPath, relativePath);
        for (const [key, value] of subFiles) {
          files.set(key, value);
        }
      } else if (item.endsWith('.md')) {
        // 添加markdown文件
        const fileKey = relativePath.replace('.md', '');
        files.set(fileKey, itemPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️  扫描目录失败: ${dir}`, error.message);
  }
  
  return files;
}

/**
 * 获取所有可用的文章文件
 */
function getAllArticleFiles() {
  const articleFiles = new Map();
  
  try {
    // 检查英文文章
    const enDir = path.join(CONFIG.articlesDir, 'en');
    if (fs.existsSync(enDir)) {
      const enFiles = scanDirectoryRecursively(enDir, 'en');
      for (const [key, value] of enFiles) {
        articleFiles.set(key, value);
      }
    }
    
    // 检查中文文章
    const zhDir = path.join(CONFIG.articlesDir, 'zh');
    if (fs.existsSync(zhDir)) {
      const zhFiles = scanDirectoryRecursively(zhDir, 'zh');
      for (const [key, value] of zhFiles) {
        articleFiles.set(key, value);
      }
    }
    
    console.log(`📁 发现 ${articleFiles.size} 个文章文件`);
    return articleFiles;
  } catch (error) {
    console.error('❌ 读取文章目录时出错:', error.message);
    return new Map();
  }
}

/**
 * 故意删除的URL列表（不应该报告为缺失）
 */
const intentionallyRemovedUrls = [
  'zh/pain-management',
  'zh/pain-management/understanding-dysmenorrhea'
];

/**
 * 从URL提取文章标识符
 */
function extractArticleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // 匹配文章URL模式: /{locale}/articles/{article-slug}
    const articleMatch = pathname.match(/\/([a-z]{2})\/articles\/(.+)$/);
    if (articleMatch) {
      const [, locale, articleSlug] = articleMatch;
      const key = `${locale}/${articleSlug}`;
      
      // 检查是否是故意删除的URL
      if (intentionallyRemovedUrls.includes(key)) {
        return {
          locale,
          slug: articleSlug,
          key: key,
          url: url,
          intentionallyRemoved: true
        };
      }
      
      return {
        locale,
        slug: articleSlug,
        key: key,
        url: url
      };
    }
    
    return null;
  } catch (error) {
    console.warn(`⚠️  解析URL失败: ${url}`, error.message);
    return null;
  }
}

/**
 * 检查文章文件是否存在
 */
function checkArticleExists(articleKey, articleFiles) {
  return articleFiles.has(articleKey);
}

/**
 * 主检查函数
 */
function checkMissingArticles() {
  console.log('🔍 开始检查缺失的文章文件...\n');
  
  // 读取失败URL
  const failingUrls = readFailingUrls();
  if (failingUrls.length === 0) {
    console.log('❌ 没有找到失败URL，请检查CSV文件');
    return;
  }
  
  // 获取所有文章文件
  const articleFiles = getAllArticleFiles();
  if (articleFiles.size === 0) {
    console.log('❌ 没有找到文章文件，请检查content/articles目录');
    return;
  }
  
  // 分析结果
  const results = {
    totalUrls: failingUrls.length,
    articleUrls: 0,
    missingArticles: [],
    existingArticles: [],
    intentionallyRemoved: [],
    nonArticleUrls: [],
    checkTime: new Date().toISOString()
  };
  
  console.log('📋 分析URL...\n');
  
  failingUrls.forEach(url => {
    const article = extractArticleFromUrl(url);
    
    if (article) {
      results.articleUrls++;
      
      // 检查是否是故意删除的URL
      if (article.intentionallyRemoved) {
        results.intentionallyRemoved.push({
          url: url,
          locale: article.locale,
          slug: article.slug,
          key: article.key,
          status: 'intentionally-removed'
        });
        console.log(`🗑️  ${article.key} - 故意删除的页面`);
        return;
      }
      
      const exists = checkArticleExists(article.key, articleFiles);
      
      if (exists) {
        results.existingArticles.push({
          url: url,
          locale: article.locale,
          slug: article.slug,
          key: article.key,
          status: 'exists'
        });
        console.log(`✅ ${article.key} - 文件存在`);
      } else {
        results.missingArticles.push({
          url: url,
          locale: article.locale,
          slug: article.slug,
          key: article.key,
          status: 'missing',
          expectedFile: path.join(CONFIG.articlesDir, article.locale, article.slug + '.md')
        });
        console.log(`❌ ${article.key} - 文件缺失`);
      }
    } else {
      results.nonArticleUrls.push({
        url: url,
        status: 'non-article'
      });
      console.log(`ℹ️  ${url} - 非文章URL`);
    }
  });
  
  // 生成报告
  generateReports(results);
  
  // 输出摘要
  console.log('\n📊 检查结果摘要:');
  console.log(`总URL数量: ${results.totalUrls}`);
  console.log(`文章URL数量: ${results.articleUrls}`);
  console.log(`缺失文章: ${results.missingArticles.length}`);
  console.log(`存在文章: ${results.existingArticles.length}`);
  console.log(`故意删除: ${results.intentionallyRemoved.length}`);
  console.log(`非文章URL: ${results.nonArticleUrls.length}`);
  
  if (results.missingArticles.length > 0) {
    console.log('\n❌ 缺失的文章文件:');
    results.missingArticles.forEach(article => {
      console.log(`  - ${article.key} (${article.url})`);
    });
  }
  
  if (results.intentionallyRemoved.length > 0) {
    console.log('\n🗑️  故意删除的页面:');
    results.intentionallyRemoved.forEach(article => {
      console.log(`  - ${article.key} (${article.url})`);
    });
  }
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
  
  let report = `# 缺失文章文件检查报告\n\n`;
  report += `**检查时间**: ${timestamp}\n\n`;
  
  report += `## 📊 检查摘要\n\n`;
  report += `- **总URL数量**: ${results.totalUrls}\n`;
  report += `- **文章URL数量**: ${results.articleUrls}\n`;
  report += `- **缺失文章**: ${results.missingArticles.length}\n`;
  report += `- **存在文章**: ${results.existingArticles.length}\n`;
  report += `- **非文章URL**: ${results.nonArticleUrls.length}\n\n`;
  
  if (results.missingArticles.length > 0) {
    report += `## ❌ 缺失的文章文件\n\n`;
    report += `以下文章URL对应的markdown文件不存在:\n\n`;
    
    results.missingArticles.forEach(article => {
      report += `### ${article.key}\n`;
      report += `- **URL**: ${article.url}\n`;
      report += `- **语言**: ${article.locale}\n`;
      report += `- **期望文件路径**: \`${article.expectedFile}\`\n`;
      report += `- **建议操作**: 创建对应的markdown文件\n\n`;
    });
    
    report += `## 🔧 修复建议\n\n`;
    report += `1. **创建缺失文件**: 为每个缺失的文章创建对应的markdown文件\n`;
    report += `2. **检查文件命名**: 确保文件名与URL slug完全匹配\n`;
    report += `3. **验证内容**: 确保文件包含正确的frontmatter和内容\n`;
    report += `4. **测试访问**: 创建文件后测试URL是否可以正常访问\n\n`;
  } else {
    report += `## ✅ 检查结果\n\n`;
    report += `所有文章URL都有对应的文件存在，无需修复。\n\n`;
  }
  
  if (results.nonArticleUrls.length > 0) {
    report += `## ℹ️ 非文章URL\n\n`;
    report += `以下URL不是文章URL，可能对应其他类型的页面:\n\n`;
    results.nonArticleUrls.forEach(item => {
      report += `- ${item.url}\n`;
    });
    report += `\n`;
  }
  
  return report;
}

// 运行检查
if (require.main === module) {
  checkMissingArticles();
}

module.exports = {
  checkMissingArticles,
  extractArticleFromUrl,
  getAllArticleFiles
};
