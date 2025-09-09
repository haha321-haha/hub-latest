#!/usr/bin/env node

/**
 * 内容更新管理系统
 * 自动监控内容新鲜度，提供更新提醒
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class ContentUpdateManager {
  constructor() {
    this.articlesPath = path.join(process.cwd(), 'content/articles');
    this.updateThreshold = 90; // 90天未更新提醒
    this.criticalThreshold = 180; // 180天未更新警告
    
    // 内容更新频率建议
    this.updateSchedule = {
      weekly: {
        target: 2, // 每周2篇
        priority: ['news', 'tips', 'quick-guides'],
        timeEstimate: '2-3小时'
      },
      monthly: {
        target: 8, // 每月8篇
        priority: ['comprehensive-guides', 'research', 'seasonal-content'],
        timeEstimate: '8-12小时'
      },
      quarterly: {
        target: 24, // 每季度24篇
        priority: ['in-depth-articles', 'case-studies', 'trend-analysis'],
        timeEstimate: '24-36小时'
      }
    };
  }

  /**
   * 检查所有文章的新鲜度
   */
  async checkContentFreshness() {
    const locales = ['en', 'zh'];
    const results = {
      total: 0,
      needsUpdate: [],
      critical: [],
      recentlyUpdated: []
    };

    for (const locale of locales) {
      const localePath = path.join(this.articlesPath, locale);
      if (!fs.existsSync(localePath)) continue;

      const files = fs.readdirSync(localePath).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        const filePath = path.join(localePath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        
        const lastModified = fs.statSync(filePath).mtime;
        const publishDate = new Date(data.date || data.publishDate || lastModified);
        const daysSinceUpdate = Math.floor((Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
        
        results.total++;
        
        const articleInfo = {
          file: file,
          locale: locale,
          title: data.title || data.title_zh || file,
          lastModified: publishDate,
          daysSinceUpdate: daysSinceUpdate,
          category: data.category || '未分类'
        };

        if (daysSinceUpdate > this.criticalThreshold) {
          results.critical.push(articleInfo);
        } else if (daysSinceUpdate > this.updateThreshold) {
          results.needsUpdate.push(articleInfo);
        } else if (daysSinceUpdate <= 30) {
          results.recentlyUpdated.push(articleInfo);
        }
      }
    }

    return results;
  }

  /**
   * 生成内容更新报告
   */
  generateUpdateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.total,
        needsUpdate: results.needsUpdate.length,
        critical: results.critical.length,
        recentlyUpdated: results.recentlyUpdated.length
      },
      recommendations: this.generateRecommendations(results),
      details: results
    };

    return report;
  }

  /**
   * 生成更新建议
   */
  generateRecommendations(results) {
    const recommendations = [];

    if (results.critical.length > 0) {
      recommendations.push({
        priority: 'high',
        type: 'content_freshness',
        message: `有 ${results.critical.length} 篇文章超过180天未更新，需要立即更新`,
        articles: results.critical.map(a => `${a.title} (${a.locale})`)
      });
    }

    if (results.needsUpdate.length > 0) {
      recommendations.push({
        priority: 'medium',
        type: 'content_freshness',
        message: `有 ${results.needsUpdate.length} 篇文章超过90天未更新，建议更新`,
        articles: results.needsUpdate.map(a => `${a.title} (${a.locale})`)
      });
    }

    // 按类别分析
    const categoryStats = {};
    [...results.needsUpdate, ...results.critical].forEach(article => {
      const category = article.category;
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    Object.entries(categoryStats).forEach(([category, count]) => {
      recommendations.push({
        priority: 'medium',
        type: 'category_focus',
        message: `"${category}" 类别有 ${count} 篇文章需要更新`,
        suggestion: `建议优先更新 ${category} 类别的内容`
      });
    });

    // 添加更新频率建议
    recommendations.push({
      priority: 'low',
      type: 'update_schedule',
      message: '建议的内容更新频率',
      suggestion: this.generateUpdateScheduleAdvice(results)
    });

    return recommendations;
  }

  /**
   * 生成更新频率建议
   */
  generateUpdateScheduleAdvice(results) {
    const totalArticles = results.total;
    const needsUpdate = results.needsUpdate.length + results.critical.length;
    
    const advice = [];
    
    // 基于当前文章数量给出建议
    if (totalArticles < 50) {
      advice.push('📈 内容较少，建议每周发布2-3篇新文章');
      advice.push('🎯 重点：基础健康知识、常见问题解答');
    } else if (totalArticles < 100) {
      advice.push('📊 内容适中，建议每周发布1-2篇新文章');
      advice.push('🎯 重点：深度专题、最新研究、季节性内容');
    } else {
      advice.push('📚 内容丰富，建议每周发布1篇高质量文章');
      advice.push('🎯 重点：专业深度内容、案例研究、趋势分析');
    }
    
    // 基于需要更新的文章数量
    if (needsUpdate > 20) {
      advice.push('⚠️ 需要更新的文章较多，建议优先更新核心内容');
    } else if (needsUpdate > 10) {
      advice.push('✅ 需要更新的文章适中，按计划更新即可');
    } else {
      advice.push('🎉 内容新鲜度良好，继续保持');
    }
    
    return advice.join('；');
  }

  /**
   * 创建内容更新计划
   */
  createUpdatePlan(results) {
    const plan = {
      weekly: [],
      monthly: [],
      quarterly: []
    };

    // 按优先级分配更新计划
    results.critical.forEach(article => {
      plan.weekly.push({
        ...article,
        action: 'urgent_update',
        suggestedActions: [
          '更新数据和统计信息',
          '检查链接有效性',
          '添加最新研究结果',
          '优化SEO关键词'
        ]
      });
    });

    results.needsUpdate.forEach(article => {
      plan.monthly.push({
        ...article,
        action: 'content_refresh',
        suggestedActions: [
          '更新过时信息',
          '添加相关新内容',
          '优化文章结构',
          '检查图片和链接'
        ]
      });
    });

    return plan;
  }

  /**
   * 保存报告到文件
   */
  async saveReport(report, plan) {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    // 保存JSON报告
    fs.writeFileSync(
      path.join(reportsDir, `content-freshness-${timestamp}.json`),
      JSON.stringify({ report, plan }, null, 2)
    );

    // 保存Markdown报告
    const markdownReport = this.generateMarkdownReport(report, plan);
    fs.writeFileSync(
      path.join(reportsDir, `content-freshness-${timestamp}.md`),
      markdownReport
    );

    console.log(`📊 内容更新报告已保存到 reports/content-freshness-${timestamp}.json`);
    console.log(`📝 Markdown报告已保存到 reports/content-freshness-${timestamp}.md`);
  }

  /**
   * 生成Markdown格式报告
   */
  generateMarkdownReport(report, plan) {
    let markdown = `# 📝 内容更新报告\n\n`;
    markdown += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;

    // 摘要
    markdown += `## 📊 内容新鲜度摘要\n\n`;
    markdown += `- **总文章数**: ${report.summary.total}\n`;
    markdown += `- **需要更新**: ${report.summary.needsUpdate} 篇\n`;
    markdown += `- **紧急更新**: ${report.summary.critical} 篇\n`;
    markdown += `- **最近更新**: ${report.summary.recentlyUpdated} 篇\n\n`;

    // 建议
    if (report.recommendations.length > 0) {
      markdown += `## 🎯 更新建议\n\n`;
      report.recommendations.forEach((rec, index) => {
        markdown += `### ${index + 1}. ${rec.message}\n\n`;
        if (rec.articles) {
          markdown += `**相关文章**:\n`;
          rec.articles.forEach(article => {
            markdown += `- ${article}\n`;
          });
          markdown += `\n`;
        }
        if (rec.suggestion) {
          markdown += `**建议**: ${rec.suggestion}\n\n`;
        }
      });
    }

    // 更新计划
    markdown += `## 📅 更新计划\n\n`;
    
    if (plan.weekly.length > 0) {
      markdown += `### 🚨 本周紧急更新\n\n`;
      plan.weekly.forEach(article => {
        markdown += `- **${article.title}** (${article.locale}) - ${article.daysSinceUpdate}天未更新\n`;
      });
      markdown += `\n`;
    }

    if (plan.monthly.length > 0) {
      markdown += `### 📅 本月计划更新\n\n`;
      plan.monthly.forEach(article => {
        markdown += `- **${article.title}** (${article.locale}) - ${article.daysSinceUpdate}天未更新\n`;
      });
      markdown += `\n`;
    }

    return markdown;
  }

  /**
   * 主执行函数
   */
  async run() {
    console.log('🔍 开始检查内容新鲜度...');
    
    try {
      const results = await this.checkContentFreshness();
      const report = this.generateUpdateReport(results);
      const plan = this.createUpdatePlan(results);
      
      await this.saveReport(report, plan);
      
      // 控制台输出摘要
      console.log('\n📊 内容新鲜度检查完成:');
      console.log(`总文章数: ${report.summary.total}`);
      console.log(`需要更新: ${report.summary.needsUpdate} 篇`);
      console.log(`紧急更新: ${report.summary.critical} 篇`);
      console.log(`最近更新: ${report.summary.recentlyUpdated} 篇`);
      
      if (report.recommendations.length > 0) {
        console.log('\n🎯 主要建议:');
        report.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.message}`);
        });
      }
      
    } catch (error) {
      console.error('❌ 内容检查失败:', error);
      process.exit(1);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const manager = new ContentUpdateManager();
  manager.run();
}

module.exports = ContentUpdateManager;