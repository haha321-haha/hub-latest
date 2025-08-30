#!/usr/bin/env node

/**
 * 智能搜索系统测试脚本
 * 验证搜索引擎的基本功能
 */

const { getSearchEngine } = require('../lib/smart-search');

async function testSmartSearch() {
  console.log('🔍 智能搜索系统测试开始');
  console.log('======================================');

  try {
    // 获取搜索引擎实例
    const searchEngine = getSearchEngine({
      mode: 'instant',
      personalization: false,
      enableCache: false // 测试时禁用缓存
    });

    console.log('✅ 搜索引擎实例创建成功');

    // 测试搜索功能
    console.log('\n📋 测试基础搜索功能...');
    
    const searchResults = await searchEngine.search({
      query: '痛经缓解',
      scope: ['all'],
      mode: 'instant'
    });

    console.log(`✅ 搜索完成: "${searchResults.query}"`);
    console.log(`📊 结果统计:`);
    console.log(`   - 总结果数: ${searchResults.totalResults}`);
    console.log(`   - 搜索时间: ${searchResults.searchTime}ms`);
    console.log(`   - 当前页: ${searchResults.page}`);

    if (searchResults.results.length > 0) {
      console.log(`\n🎯 搜索结果预览:`);
      searchResults.results.slice(0, 3).forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.title}`);
        console.log(`      类型: ${result.type} | 评分: ${result.score.toFixed(2)}`);
        console.log(`      描述: ${result.description.substring(0, 50)}...`);
      });
    }

    // 测试搜索建议
    console.log('\n🔮 测试搜索建议功能...');
    const suggestions = await searchEngine.suggest('痛', 5);
    console.log(`✅ 建议生成完成，获得 ${suggestions.length} 个建议`);
    if (suggestions.length > 0) {
      console.log(`   建议: ${suggestions.join(', ')}`);
    }

    // 测试推荐功能
    console.log('\n🎲 测试推荐功能...');
    const recommendations = await searchEngine.getRecommendations('test-user', 3);
    console.log(`✅ 推荐生成完成，获得 ${recommendations.length} 个推荐`);

    // 测试分析功能
    console.log('\n📈 测试分析功能...');
    const analytics = await searchEngine.getAnalytics();
    console.log(`✅ 分析数据获取完成:`);
    console.log(`   - 总搜索次数: ${analytics.totalSearches}`);
    console.log(`   - 独特查询数: ${analytics.uniqueQueries}`);
    console.log(`   - 平均响应时间: ${analytics.averageResponseTime.toFixed(2)}ms`);

    console.log('\n🎉 所有测试通过！智能搜索系统工作正常');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

// 运行测试
testSmartSearch().catch(console.error); 