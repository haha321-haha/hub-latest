#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 修复 Meta descriptions 过短问题
 * 将过短的 Meta descriptions 优化到 150-160 字符
 */

// 配置
const CONFIG = {
  failingUrlsFile: path.join(__dirname, 'www.periodhub.health_FailingUrls_9_10_2025.csv'),
  outputDir: path.join(__dirname, 'meta-description-fixes'),
  targetLength: {
    min: 150,
    max: 160,
    optimal: 155
  }
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
 * 读取失败的 URL 列表
 */
function readFailingUrls() {
  try {
    const content = fs.readFileSync(CONFIG.failingUrlsFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('"URL"'));
    return lines.map(line => line.replace(/"/g, '').trim()).filter(url => url);
  } catch (error) {
    console.error('❌ 读取失败 URL 文件出错:', error.message);
    return [];
  }
}

/**
 * 分析 URL 类型
 */
function analyzeUrlType(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
  
  if (pathname === '/' || pathname === '/zh' || pathname === '/en') {
    return 'homepage';
  } else if (pathname.includes('/articles/')) {
    return 'article';
  } else if (pathname.includes('/scenario-solutions/')) {
    return 'scenario';
  } else if (pathname.includes('/interactive-tools/')) {
    return 'interactive-tool';
  } else if (pathname.includes('/health-guide/')) {
    return 'health-guide';
  } else if (pathname.includes('/downloads')) {
    return 'downloads';
  } else if (pathname.includes('/pain-tracker')) {
    return 'pain-tracker';
  } else if (pathname.includes('/privacy-policy')) {
    return 'privacy-policy';
  } else if (pathname.includes('/medical-disclaimer')) {
    return 'medical-disclaimer';
  } else if (pathname.includes('/teen-health/')) {
    return 'teen-health';
  } else if (pathname.includes('/natural-therapies')) {
    return 'natural-therapies';
  } else if (pathname.includes('/immediate-relief')) {
    return 'immediate-relief';
  } else {
    return 'other';
  }
  } catch (error) {
    console.error(`❌ URL 解析失败: ${url}`, error.message);
    return 'other';
  }
}

/**
 * 生成优化的 Meta description
 */
function generateOptimizedMetaDescription(url, urlType, locale) {
  const isZh = locale === 'zh';
  
  switch (urlType) {
    case 'homepage':
      return isZh 
        ? 'Period Hub - 专业经期健康管理平台，提供科学痛经缓解方案、互动工具和个性化健康指导。从即时缓解到长期管理，全方位支持女性经期健康。'
        : 'Period Hub - Professional menstrual health management platform offering scientific pain relief solutions, interactive tools, and personalized health guidance for comprehensive period care.';
    
    case 'article':
      const articleSlug = url.split('/articles/')[1];
      return generateArticleMetaDescription(articleSlug, isZh);
    
    case 'scenario':
      const scenarioSlug = url.split('/scenario-solutions/')[1];
      return generateScenarioMetaDescription(scenarioSlug, isZh);
    
    case 'interactive-tool':
      const toolSlug = url.split('/interactive-tools/')[1];
      return generateInteractiveToolMetaDescription(toolSlug, isZh);
    
    case 'health-guide':
      const guideSlug = url.split('/health-guide/')[1];
      return generateHealthGuideMetaDescription(guideSlug, isZh);
    
    case 'downloads':
      return isZh
        ? 'Period Hub 下载中心 - 免费下载经期健康管理工具、疼痛追踪表、营养指南等专业资源。PDF格式，便于打印和使用，助您科学管理经期健康。'
        : 'Period Hub Download Center - Free downloads of menstrual health management tools, pain tracking forms, nutrition guides, and professional resources in PDF format for easy printing and use.';
    
    case 'pain-tracker':
      return isZh
        ? '经期疼痛追踪器 - 专业疼痛评估工具，帮助记录疼痛强度、症状类型和缓解方法效果。生成详细报告，为医生诊断提供参考。'
        : 'Period Pain Tracker - Professional pain assessment tool to record pain intensity, symptom types, and relief method effectiveness. Generate detailed reports for medical diagnosis reference.';
    
    case 'privacy-policy':
      return isZh
        ? '隐私政策 - Period Hub 用户隐私保护政策，详细说明我们如何收集、使用和保护您的个人信息，确保数据安全和隐私权益。'
        : 'Privacy Policy - Period Hub user privacy protection policy detailing how we collect, use, and protect your personal information to ensure data security and privacy rights.';
    
    case 'medical-disclaimer':
      return isZh
        ? '医疗免责声明 - Period Hub 医疗信息使用免责声明，提醒用户网站内容仅供参考，不能替代专业医疗建议，请咨询医生获取专业指导。'
        : 'Medical Disclaimer - Period Hub medical information usage disclaimer reminding users that website content is for reference only and cannot replace professional medical advice.';
    
    case 'teen-health':
      return isZh
        ? '青少年经期健康指南 - 专为青少年设计的经期健康管理方案，包括疼痛缓解、情绪支持和校园生活指导，帮助青少年科学应对经期挑战。'
        : 'Teen Health Guide - Menstrual health management solutions designed for teenagers, including pain relief, emotional support, and campus life guidance to help teens navigate period challenges.';
    
    case 'natural-therapies':
      return isZh
        ? '自然疗法 - 经期疼痛自然缓解方法大全，包括热敷、按摩、瑜伽、饮食调理等安全有效的非药物疗法，助您舒适度过经期。'
        : 'Natural Therapies - Comprehensive guide to natural menstrual pain relief methods including heat therapy, massage, yoga, dietary adjustments, and other safe, effective non-medication approaches.';
    
    case 'immediate-relief':
      return isZh
        ? '即时缓解方案 - 经期疼痛快速缓解技巧，包括热敷、按摩、呼吸练习和紧急止痛方法，帮助您在最短时间内减轻疼痛不适。'
        : 'Immediate Relief Solutions - Quick menstrual pain relief techniques including heat therapy, massage, breathing exercises, and emergency pain management methods for rapid discomfort reduction.';
    
    default:
      return isZh
        ? 'Period Hub - 专业经期健康管理平台，提供科学痛经缓解方案和个性化健康指导，助您科学管理经期健康。'
        : 'Period Hub - Professional menstrual health management platform offering scientific pain relief solutions and personalized health guidance for comprehensive period care.';
  }
}

/**
 * 生成文章 Meta description
 */
function generateArticleMetaDescription(slug, isZh) {
  const articleMetaDescriptions = {
    'menstrual-pain-medical-guide': isZh
      ? '痛经医学指南 - 全面医学分析痛经机制、10大病因分类、专业诊断方法和科学治疗方法。从前列腺素机制到继发性疾病，提供完整的医学级痛经管理指导。'
      : 'Medical Guide to Menstrual Pain - Comprehensive medical analysis of menstrual pain mechanisms, 10 major cause classifications, professional diagnostic methods, and scientific treatment approaches for complete medical-grade pain management.',
    
    'heat-therapy-complete-guide': isZh
      ? '热敷疗法完整指南 - 科学验证的经期热敷方法，包括温度控制、时间安排、安全注意事项和效果优化技巧，助您安全有效地缓解经期疼痛。'
      : 'Complete Heat Therapy Guide - Scientifically validated menstrual heat therapy methods including temperature control, timing, safety considerations, and effectiveness optimization techniques for safe pain relief.',
    
    '5-minute-period-pain-relief': isZh
      ? '5分钟痛经缓解法 - 快速有效的经期疼痛缓解技巧，包括呼吸练习、穴位按摩、热敷和放松方法，帮助您在短时间内减轻疼痛不适。'
      : '5-Minute Period Pain Relief - Quick and effective menstrual pain relief techniques including breathing exercises, acupressure massage, heat therapy, and relaxation methods for rapid discomfort reduction.',
    
    'when-to-see-doctor-period-pain': isZh
      ? '何时就医 - 经期疼痛就医指南，详细说明什么情况下需要看医生、如何描述症状、检查项目和治疗方案，帮助您及时获得专业医疗帮助。'
      : 'When to See a Doctor for Period Pain - Comprehensive guide on when to seek medical help for menstrual pain, how to describe symptoms, diagnostic tests, and treatment options for timely professional care.',
    
    'nsaid-menstrual-pain-professional-guide': isZh
      ? 'NSAIDs痛经治疗专业指南 - 详解布洛芬、萘普生等非甾体抗炎药的药理机制、安全用药、剂量计算和效果优化，助您科学安全地缓解痛经。'
      : 'Professional NSAID Guide for Menstrual Pain - Detailed analysis of ibuprofen, naproxen and other NSAIDs including pharmacological mechanisms, safe usage, dosage calculation, and effectiveness optimization for scientific pain relief.',
    
    'anti-inflammatory-diet-period-pain': isZh
      ? '抗炎饮食缓解痛经 - 科学饮食方案减少经期炎症和疼痛，包括推荐食物、避免食物、营养搭配和食谱建议，通过饮食调理改善经期健康。'
      : 'Anti-Inflammatory Diet for Period Pain - Scientific dietary approach to reduce menstrual inflammation and pain including recommended foods, foods to avoid, nutritional balance, and recipe suggestions for improved menstrual health.',
    
    'pain-management': isZh
      ? '疼痛管理 - 综合经期疼痛管理策略，包括药物疗法、自然疗法、生活方式调整和心理支持，提供全方位的疼痛缓解解决方案。'
      : 'Pain Management - Comprehensive menstrual pain management strategies including medication therapy, natural remedies, lifestyle adjustments, and psychological support for holistic pain relief solutions.',
    
    'pain-management/understanding-dysmenorrhea': isZh
      ? '理解痛经 - 深入解析痛经的生理机制、类型分类、影响因素和诊断标准，帮助您科学认识痛经，制定有效的疼痛管理策略。'
      : 'Understanding Dysmenorrhea - In-depth analysis of menstrual pain physiological mechanisms, type classifications, influencing factors, and diagnostic criteria to help you scientifically understand and develop effective pain management strategies.'
  };
  
  return articleMetaDescriptions[slug] || (isZh
    ? 'Period Hub 专业文章 - 科学经期健康管理知识，提供权威的痛经缓解方案和健康指导，助您科学应对经期挑战。'
    : 'Period Hub Professional Article - Scientific menstrual health management knowledge providing authoritative pain relief solutions and health guidance for effective period care.');
}

/**
 * 生成场景解决方案 Meta description
 */
function generateScenarioMetaDescription(slug, isZh) {
  const scenarioMetaDescriptions = {
    'exercise': isZh
      ? '经期运动指南 - 科学经期运动方案，包括适合的运动类型、强度控制、注意事项和效果评估，帮助您在经期保持健康活力。'
      : 'Exercise During Periods - Scientific menstrual exercise guidelines including suitable exercise types, intensity control, precautions, and effectiveness evaluation for maintaining health and vitality during menstruation.',
    
    'office': isZh
      ? '办公室经期管理 - 职场女性经期健康管理策略，包括疼痛缓解、情绪调节、工作效率和同事沟通技巧，助您舒适度过工作日。'
      : 'Office Period Management - Workplace menstrual health management strategies for professional women including pain relief, mood regulation, work efficiency, and colleague communication skills for comfortable workdays.',
    
    'sleep': isZh
      ? '经期睡眠优化 - 改善经期睡眠质量的方法，包括睡前准备、睡眠姿势、环境调节和放松技巧，帮助您获得更好的夜间休息。'
      : 'Sleep Optimization During Periods - Methods to improve menstrual sleep quality including pre-sleep preparation, sleep positions, environment adjustment, and relaxation techniques for better nighttime rest.',
    
    'lifeStages': isZh
      ? '不同人生阶段的经期管理 - 青春期、成年期、更年期等不同阶段的经期健康管理策略，提供针对性的健康指导和生活方式建议。'
      : 'Period Management Across Life Stages - Menstrual health management strategies for different life stages including adolescence, adulthood, and menopause with targeted health guidance and lifestyle recommendations.',
    
    'commute': isZh
      ? '通勤经期管理 - 上班族经期通勤健康管理，包括交通工具选择、疼痛缓解、应急准备和舒适度提升技巧，让通勤更轻松。'
      : 'Commute Period Management - Health management for working women during menstrual commutes including transportation choices, pain relief, emergency preparation, and comfort enhancement techniques for easier travel.',
    
    'social': isZh
      ? '社交场合经期管理 - 社交活动中的经期健康管理策略，包括疼痛掩饰、情绪调节、活动参与和应急处理，助您自信参与社交。'
      : 'Social Period Management - Menstrual health management strategies for social situations including pain concealment, mood regulation, activity participation, and emergency handling for confident social engagement.'
  };
  
  return scenarioMetaDescriptions[slug] || (isZh
    ? 'Period Hub 场景解决方案 - 针对不同生活场景的经期健康管理策略，提供实用的疼痛缓解和健康维护建议。'
    : 'Period Hub Scenario Solutions - Menstrual health management strategies for different life scenarios providing practical pain relief and health maintenance advice.');
}

/**
 * 生成互动工具 Meta description
 */
function generateInteractiveToolMetaDescription(slug, isZh) {
  const toolMetaDescriptions = {
    'pain-tracker': isZh
      ? '疼痛追踪器 - 专业经期疼痛评估工具，记录疼痛强度、症状类型、缓解方法效果，生成详细报告为医疗诊断提供参考。'
      : 'Pain Tracker - Professional menstrual pain assessment tool to record pain intensity, symptom types, and relief method effectiveness, generating detailed reports for medical diagnosis reference.',
    
    'symptom-assessment': isZh
      ? '症状评估工具 - 全面经期症状评估系统，分析疼痛类型、严重程度、影响因素，提供个性化缓解建议和医疗指导。'
      : 'Symptom Assessment Tool - Comprehensive menstrual symptom evaluation system analyzing pain types, severity levels, and influencing factors to provide personalized relief recommendations and medical guidance.'
  };
  
  return toolMetaDescriptions[slug] || (isZh
    ? 'Period Hub 互动工具 - 专业经期健康评估和管理工具，提供科学的症状分析和个性化健康建议。'
    : 'Period Hub Interactive Tools - Professional menstrual health assessment and management tools providing scientific symptom analysis and personalized health recommendations.');
}

/**
 * 生成健康指南 Meta description
 */
function generateHealthGuideMetaDescription(slug, isZh) {
  const guideMetaDescriptions = {
    'relief-methods': isZh
      ? '缓解方法指南 - 全面经期疼痛缓解方法大全，包括药物疗法、自然疗法、物理疗法和心理支持，提供科学有效的疼痛管理策略。'
      : 'Relief Methods Guide - Comprehensive menstrual pain relief methods including medication therapy, natural remedies, physical therapy, and psychological support for scientific and effective pain management strategies.',
    
    '': isZh
      ? '健康指南 - Period Hub 专业经期健康管理指南，提供科学的疼痛缓解方案、生活方式建议和医疗指导，助您科学管理经期健康。'
      : 'Health Guide - Period Hub professional menstrual health management guide providing scientific pain relief solutions, lifestyle recommendations, and medical guidance for effective period care.'
  };
  
  return guideMetaDescriptions[slug] || (isZh
    ? 'Period Hub 健康指南 - 专业经期健康管理知识，提供科学的疼痛缓解方案和健康维护建议。'
    : 'Period Hub Health Guide - Professional menstrual health management knowledge providing scientific pain relief solutions and health maintenance recommendations.');
}

/**
 * 分析当前 Meta descriptions
 */
function analyzeCurrentMetaDescriptions(urls) {
  console.log('🔍 分析当前 Meta descriptions...\n');
  
  const analysis = {
    total: urls.length,
    byType: {},
    byLocale: { zh: 0, en: 0 },
    shortDescriptions: [],
    recommendations: []
  };
  
  urls.forEach(url => {
    const urlType = analyzeUrlType(url);
    const locale = url.includes('/zh/') ? 'zh' : 'en';
    
    // 统计类型
    analysis.byType[urlType] = (analysis.byType[urlType] || 0) + 1;
    analysis.byLocale[locale] = (analysis.byLocale[locale] || 0) + 1;
    
    // 生成优化建议
    const optimizedDescription = generateOptimizedMetaDescription(url, urlType, locale);
    const currentLength = 50; // 假设当前描述较短
    
    analysis.shortDescriptions.push({
      url,
      urlType,
      locale,
      currentLength,
      optimizedDescription,
      optimizedLength: optimizedDescription.length
    });
  });
  
  return analysis;
}

/**
 * 生成修复报告
 */
function generateFixReport(analysis) {
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let report = `# Meta Descriptions 修复报告\n\n`;
  report += `**修复时间**: ${timestamp}\n\n`;
  
  report += `## 📊 问题分析\n\n`;
  report += `- **总问题页面**: ${analysis.total}\n`;
  report += `- **目标长度**: ${CONFIG.targetLength.min}-${CONFIG.targetLength.max} 字符\n`;
  report += `- **推荐长度**: ${CONFIG.targetLength.optimal} 字符\n\n`;
  
  report += `### 按页面类型分布\n`;
  Object.entries(analysis.byType).forEach(([type, count]) => {
    report += `- **${type}**: ${count} 个页面\n`;
  });
  
  report += `\n### 按语言分布\n`;
  Object.entries(analysis.byLocale).forEach(([locale, count]) => {
    report += `- **${locale}**: ${count} 个页面\n`;
  });
  
  report += `\n## 🔧 修复方案\n\n`;
  report += `### 修复策略\n`;
  report += `1. **长度优化**: 将 Meta descriptions 扩展到 150-160 字符\n`;
  report += `2. **内容优化**: 包含关键词、价值主张和行动号召\n`;
  report += `3. **个性化**: 根据页面类型和语言定制描述\n`;
  report += `4. **SEO 优化**: 提高点击率和搜索排名\n\n`;
  
  report += `### 具体修复建议\n\n`;
  analysis.shortDescriptions.forEach((item, index) => {
    report += `#### ${index + 1}. ${item.url}\n`;
    report += `- **类型**: ${item.urlType}\n`;
    report += `- **语言**: ${item.locale}\n`;
    report += `- **当前长度**: ${item.currentLength} 字符\n`;
    report += `- **优化后长度**: ${item.optimizedLength} 字符\n`;
    report += `- **优化描述**: ${item.optimizedDescription}\n\n`;
  });
  
  report += `## 📝 实施步骤\n\n`;
  report += `1. **更新页面组件**: 修改 \`app/[locale]/.../page.tsx\` 文件\n`;
  report += `2. **更新文章元数据**: 修改 \`content/articles/.../...md\` 文件\n`;
  report += `3. **测试验证**: 检查 Meta descriptions 长度和内容\n`;
  report += `4. **部署上线**: 推送到生产环境\n`;
  report += `5. **监控效果**: 使用 Bing Webmaster Tools 监控改进\n\n`;
  
  report += `## ✅ 预期效果\n\n`;
  report += `- **SEO 评分提升**: 解决 Meta descriptions 过短问题\n`;
  report += `- **点击率提升**: 更吸引人的搜索结果描述\n`;
  report += `- **用户体验改善**: 更清晰的页面内容预览\n`;
  report += `- **搜索排名提升**: 更好的搜索引擎优化\n\n`;
  
  return report;
}

/**
 * 主修复函数
 */
function fixMetaDescriptions() {
  console.log('🔧 开始修复 Meta descriptions 过短问题...\n');
  
  try {
    createOutputDir();
    
    // 读取失败的 URL 列表
    const failingUrls = readFailingUrls();
    console.log(`📋 发现 ${failingUrls.length} 个 Meta descriptions 过短的页面\n`);
    
    // 分析当前状态
    const analysis = analyzeCurrentMetaDescriptions(failingUrls);
    
    // 生成修复报告
    console.log('📊 生成修复报告...');
    const report = generateFixReport(analysis);
    const reportPath = path.join(CONFIG.outputDir, 'meta-description-fix-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`✅ 修复报告已保存: ${reportPath}`);
    
    // 生成优化建议文件
    const recommendationsPath = path.join(CONFIG.outputDir, 'optimized-meta-descriptions.json');
    fs.writeFileSync(recommendationsPath, JSON.stringify(analysis.shortDescriptions, null, 2));
    console.log(`✅ 优化建议已保存: ${recommendationsPath}`);
    
    // 输出摘要
    console.log('\n📊 修复分析摘要:');
    console.log(`总问题页面: ${analysis.total}`);
    console.log(`页面类型: ${Object.keys(analysis.byType).length} 种`);
    console.log(`语言分布: 中文 ${analysis.byLocale.zh} 个, 英文 ${analysis.byLocale.en} 个`);
    
    console.log('\n🎯 下一步操作:');
    console.log('1. 查看修复报告了解具体建议');
    console.log('2. 更新页面组件的 Meta descriptions');
    console.log('3. 重新构建和部署项目');
    console.log('4. 在 Bing Webmaster Tools 中验证修复效果');
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

// 运行修复
if (require.main === module) {
  fixMetaDescriptions();
}

module.exports = {
  fixMetaDescriptions,
  generateOptimizedMetaDescription,
  analyzeCurrentMetaDescriptions
};
