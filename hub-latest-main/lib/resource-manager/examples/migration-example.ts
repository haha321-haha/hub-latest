/**
 * Period Hub 资源管理系统迁移示例
 * 从简单系统到企业级系统的迁移指南
 */

import { 
  createResourceManager, 
  EnterpriseResource, 
  ResourceType, 
  ResourceStatus, 
  DifficultyLevel, 
  TargetAudience 
} from '../index';

/**
 * 第1步：创建企业级资源管理器
 */
async function step1_createResourceManager() {
  console.log('🚀 创建企业级资源管理器...');
  
  // 创建开发环境的资源管理器
  const resourceManager = createResourceManager('development');
  
  // 初始化系统
  const initResult = await resourceManager.initialize();
  if (!initResult.success) {
    console.error('❌ 初始化失败:', initResult.error);
    return null;
  }
  
  console.log('✅ 资源管理器初始化成功');
  return resourceManager;
}

/**
 * 第2步：将现有PDF资源迁移到新系统
 */
async function step2_migrateExistingPDFs(resourceManager: any) {
  console.log('📋 开始迁移现有PDF资源...');
  
  // 现有的PDF资源数据（基于SimplePDFCenter）
  const existingPDFResources = [
    {
      id: 'pain-tracking-form',
      title: { zh: '疼痛追踪表', en: 'Pain Tracking Form' },
      description: { zh: '记录疼痛程度和症状的追踪表', en: 'Track pain levels and symptoms' },
      category: 'immediate-relief',
      fileName: 'pain-tracking-form.pdf'
    },
    {
      id: 'menstrual-cycle-nutrition-plan',
      title: { zh: '月经周期营养计划', en: 'Menstrual Cycle Nutrition Plan' },
      description: { zh: '针对月经周期的营养补充计划', en: 'Nutrition plan for menstrual cycle' },
      category: 'planned-preparation',
      fileName: 'menstrual-cycle-nutrition-plan.pdf'
    }
    // ... 其他资源
  ];

  const migratedResources = [];
  
  for (const pdfResource of existingPDFResources) {
    // 转换为企业级资源格式
    const enterpriseResource: EnterpriseResource = {
      id: pdfResource.id,
      type: ResourceType.PDF,
      status: ResourceStatus.ACTIVE,
      version: '1.0.0',
      
      title: pdfResource.title,
      description: pdfResource.description,
      summary: pdfResource.description, // 使用描述作为摘要
      
      categoryId: pdfResource.category,
      tags: ['健康', '经期', 'PDF'],
      keywords: {
        zh: ['疼痛', '追踪', '经期', '健康'],
        en: ['pain', 'tracking', 'menstrual', 'health']
      },
      
      files: {
        pdf: {
          url: `/pdf-files/${pdfResource.fileName}`,
          mimeType: 'application/pdf',
          size: 1024 * 1024, // 1MB 估算
          checksum: 'mock-checksum',
          lastModified: new Date()
        }
      },
      
      author: 'Period Hub Team',
      publishDate: new Date(),
      lastModified: new Date(),
      
      difficulty: DifficultyLevel.BEGINNER,
      targetAudience: [TargetAudience.GENERAL],
      estimatedReadTime: 10,
      
      relatedResources: [],
      prerequisites: [],
      followUpResources: [],
      
      stats: {
        views: 0,
        downloads: 0,
        shares: 0,
        likes: 0,
        searchHits: 0,
        lastAccessed: new Date(),
        popularityScore: 0,
        userRating: 0,
        ratingCount: 0
      },
      
      seo: {
        title: pdfResource.title,
        description: pdfResource.description,
        keywords: {
          zh: ['疼痛', '追踪', '经期', '健康'],
          en: ['pain', 'tracking', 'menstrual', 'health']
        }
      },
      
      access: {
        isPublic: true,
        requiresAuth: false,
        allowedRoles: [],
        permissions: []
      },
      
      customFields: {},
      
      changeLog: [{
        version: '1.0.0',
        date: new Date(),
        changes: '初始版本迁移',
        author: 'Period Hub Team'
      }]
    };
    
    // 保存到新系统
    const saveResult = await resourceManager.saveResource(enterpriseResource);
    if (saveResult.success) {
      migratedResources.push(enterpriseResource);
      console.log(`✅ 成功迁移: ${pdfResource.title.zh}`);
    } else {
      console.error(`❌ 迁移失败: ${pdfResource.title.zh} - ${saveResult.error}`);
    }
  }
  
  console.log(`📋 迁移完成: ${migratedResources.length} 个资源已迁移`);
  return migratedResources;
}

/**
 * 第3步：测试新的搜索功能
 */
async function step3_testSearchFunctionality(resourceManager: any) {
  console.log('🔍 测试新的搜索功能...');
  
  // 测试关键词搜索
  const searchResults = await resourceManager.searchResources('疼痛', {
    type: [ResourceType.PDF],
    status: [ResourceStatus.ACTIVE]
  }, 'zh');
  
  if (searchResults.success) {
    console.log(`✅ 搜索成功: 找到 ${searchResults.data.total} 个结果`);
    console.log(`⏱️ 搜索耗时: ${searchResults.data.searchTime}ms`);
    
    // 显示搜索结果
    searchResults.data.resources.forEach((resource: any) => {
      console.log(`  - ${resource.title.zh} (${resource.type})`);
    });
  } else {
    console.error(`❌ 搜索失败: ${searchResults.error}`);
  }
}

/**
 * 第4步：生成分析报告
 */
async function step4_generateAnalyticsReport(resourceManager: any) {
  console.log('📊 生成分析报告...');
  
  const reportResult = await resourceManager.getAnalyticsReport();
  if (reportResult.success) {
    const report = reportResult.data;
    console.log('📈 分析报告:');
    console.log(`  总资源数: ${report.totalResources}`);
    console.log(`  PDF资源: ${report.resourcesByType.pdf || 0}`);
    console.log(`  文章资源: ${report.resourcesByType.article || 0}`);
    console.log(`  活跃资源: ${report.resourcesByStatus.active || 0}`);
    console.log(`  热门标签: ${report.topTags.map((t: any) => t.tag).join(', ')}`);
  } else {
    console.error(`❌ 生成报告失败: ${reportResult.error}`);
  }
}

/**
 * 主迁移流程
 */
export async function runMigrationExample() {
  console.log('🚀 开始Period Hub企业级资源管理系统迁移示例');
  console.log('='.repeat(50));
  
  try {
    // 步骤1：创建资源管理器
    const resourceManager = await step1_createResourceManager();
    if (!resourceManager) {
      console.error('❌ 无法创建资源管理器');
      return;
    }
    
    // 步骤2：迁移现有资源
    await step2_migrateExistingPDFs(resourceManager);
    
    // 步骤3：测试搜索功能
    await step3_testSearchFunctionality(resourceManager);
    
    // 步骤4：生成分析报告
    await step4_generateAnalyticsReport(resourceManager);
    
    console.log('='.repeat(50));
    console.log('🎉 迁移示例完成！');
    console.log('💡 下一步：在实际项目中替换SimplePDFCenter组件');
    
  } catch (error) {
    console.error('❌ 迁移示例失败:', error);
  }
}

// 如果直接运行此文件，执行迁移示例
if (require.main === module) {
  runMigrationExample();
} 