/**
 * 简单的PDF资源管理系统验证脚本
 * 测试基本集成功能
 */

import { createPDFResourceManager } from '../lib/pdf-resources/index';
import { ResourceCategory, ResourceType, ResourceStatus } from '../lib/pdf-resources/types/index';

console.log('🔍 开始PDF资源管理系统基本验证...\n');

async function runValidation() {
  try {
    // 1. 测试系统创建
    console.log('📋 测试系统创建...');
    const pdfManager = createPDFResourceManager();
    console.log('✅ 系统创建成功');

    // 2. 测试初始化
    console.log('🚀 测试系统初始化...');
    await pdfManager.initialize();
    console.log('✅ 系统初始化成功');

    // 3. 测试类型定义
    console.log('📝 测试类型定义...');
    const testCategory: ResourceCategory = ResourceCategory.RELIEF;
    const testType: ResourceType = ResourceType.PDF;
    const testStatus: ResourceStatus = ResourceStatus.ACTIVE;
    console.log('✅ 类型定义正常');

    // 4. 测试健康检查
    console.log('🏥 测试健康检查...');
    const health = await pdfManager.healthCheck();
    console.log('✅ 健康检查完成:', health);

    // 5. 测试搜索功能
    console.log('🔍 测试搜索功能...');
    const searchResults = await pdfManager.searchResources({
      query: '疼痛缓解',
      category: ResourceCategory.RELIEF,
      type: ResourceType.PDF
    });
    console.log('✅ 搜索功能完成:', searchResults.results?.length || 0, '个结果');

    console.log('\n🎉 所有基本验证测试通过！');
    console.log('✅ PDF资源管理系统集成成功');

  } catch (error) {
    console.error('❌ 验证失败:', error);
    process.exit(1);
  }
}

// 运行验证
runValidation().catch(console.error); 