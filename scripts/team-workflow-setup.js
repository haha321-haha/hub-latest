#!/usr/bin/env node

/**
 * 团队协作工作流设置脚本
 * 建立完善的团队协作和沟通机制
 */

const fs = require('fs');
const path = require('path');

class TeamWorkflowSetup {
  constructor() {
    this.workflowDir = './workflow';
    this.templatesDir = './workflow/templates';
    this.docsDir = './docs';
  }

  async setup() {
    console.log('\n👥 设置团队协作工作流');
    
    try {
      // 1. 创建工作流目录结构
      await this.createDirectoryStructure();
      
      // 2. 生成角色分工文档
      await this.generateRoleDefinitions();
      
      // 3. 创建沟通机制
      await this.setupCommunicationChannels();
      
      // 4. 生成工作流模板
      await this.generateWorkflowTemplates();
      
      // 5. 创建培训材料
      await this.createTrainingMaterials();
      
      // 6. 设置代码审查流程
      await this.setupCodeReviewProcess();
      
      console.log('✅ 团队协作工作流设置完成');
      this.printSetupSummary();
      
    } catch (error) {
      console.error(`❌ 工作流设置失败: ${error.message}`);
      process.exit(1);
    }
  }

  async createDirectoryStructure() {
    console.log('📁 创建工作流目录结构...');
    
    const dirs = [
      this.workflowDir,
      this.templatesDir,
      this.docsDir,
      `${this.workflowDir}/checklists`,
      `${this.workflowDir}/templates`,
      `${this.workflowDir}/processes`,
      `${this.docsDir}/standards`,
      `${this.docsDir}/training`,
      `${this.docsDir}/adr` // Architecture Decision Records
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  创建目录: ${dir}`);
      }
    }
  }

  async generateRoleDefinitions() {
    console.log('👤 生成角色分工文档...');
    
    const roles = {
      "技术负责人": {
        "职责": [
          "SEO技术实施和优化",
          "性能优化技术方案制定",
          "硬编码问题技术解决",
          "代码质量把控",
          "技术风险评估"
        ],
        "技能要求": [
          "Next.js/React 高级",
          "SEO 技术专家",
          "性能优化经验",
          "代码审查能力"
        ],
        "在项目中的具体任务": [
          "Phase 1: 实施SEO修复方案",
          "Phase 2: 性能优化技术实施",
          "Phase 3: 硬编码清理技术方案"
        ]
      },
      "产品负责人": {
        "职责": [
          "业务影响评估",
          "用户体验优化决策",
          "功能优先级排序",
          "业务指标监控",
          "用户反馈收集"
        ],
        "技能要求": [
          "产品管理经验",
          "数据分析能力",
          "用户体验设计",
          "业务理解深度"
        ],
        "在项目中的具体任务": [
          "Phase 1: 评估SEO修复对业务的影响",
          "Phase 2: 性能优化用户体验验证",
          "Phase 3: 功能优先级调整"
        ]
      },
      "运维负责人": {
        "职责": [
          "监控系统部署和维护",
          "部署流程优化",
          "系统稳定性保障",
          "告警响应和处理",
          "备份和恢复管理"
        ],
        "技能要求": [
          "DevOps 经验",
          "监控系统配置",
          "部署自动化",
          "故障排查能力"
        ],
        "在项目中的具体任务": [
          "Phase 1: 部署监控系统",
          "Phase 2: 性能监控配置",
          "Phase 3: 自动化流程建立"
        ]
      },
      "测试负责人": {
        "职责": [
          "功能回归测试",
          "性能测试执行",
          "SEO效果验证",
          "用户体验测试",
          "质量保证流程"
        ],
        "技能要求": [
          "测试自动化",
          "性能测试工具",
          "SEO测试方法",
          "用户体验测试"
        ],
        "在项目中的具体任务": [
          "Phase 1: SEO修复效果验证",
          "Phase 2: 性能优化测试",
          "Phase 3: 全面质量保证"
        ]
      }
    };
    
    const roleDoc = `# 团队角色分工定义

## 项目角色和职责

${Object.entries(roles).map(([role, details]) => `
### ${role}

#### 主要职责
${details.职责.map(duty => `- ${duty}`).join('\n')}

#### 技能要求
${details.技能要求.map(skill => `- ${skill}`).join('\n')}

#### 在项目中的具体任务
${details.在项目中的具体任务.map(task => `- ${task}`).join('\n')}
`).join('\n')}

## 协作机制

### 日常沟通
- **每日站会**: 15分钟，同步进度和问题
- **每周回顾**: 1小时，回顾完成情况和调整计划
- **重要节点**: 提前48小时邮件+即时通讯通知
- **紧急问题**: 15分钟内响应机制

### 决策流程
1. **技术决策**: 技术负责人提出方案，团队讨论，技术负责人最终决定
2. **产品决策**: 产品负责人提出需求，技术评估可行性，产品负责人最终决定
3. **紧急决策**: 技术负责人和产品负责人共同决策，事后补流程

### 冲突解决
1. **技术冲突**: 技术负责人最终决定
2. **产品冲突**: 产品负责人最终决定
3. **跨领域冲突**: 团队会议讨论，项目经理协调

---
*最后更新: ${new Date().toISOString()}*
`;

    fs.writeFileSync(`${this.docsDir}/role-definitions.md`, roleDoc);
    console.log('✅ 角色分工文档生成完成');
  }

  async setupCommunicationChannels() {
    console.log('💬 设置沟通机制...');
    
    const communicationConfig = {
      "日常沟通": {
        "每日站会": {
          "时间": "每天上午9:30-9:45",
          "参与人员": "全体项目成员",
          "议程": [
            "昨日完成情况",
            "今日计划",
            "遇到的问题",
            "需要的帮助"
          ],
          "工具": "腾讯会议/钉钉"
        },
        "每周回顾": {
          "时间": "每周五下午4:00-5:00",
          "参与人员": "全体项目成员",
          "议程": [
            "本周完成情况回顾",
            "下周计划调整",
            "风险识别和应对",
            "经验总结分享"
          ],
          "工具": "腾讯会议"
        }
      },
      "重要通知": {
        "发布通知": {
          "提前时间": "48小时",
          "通知方式": ["邮件", "即时通讯群组"],
          "内容": [
            "发布时间",
            "影响范围",
            "预期效果",
            "回滚计划"
          ]
        },
        "紧急问题": {
          "响应时间": "15分钟内",
          "通知方式": ["电话", "即时通讯", "邮件"],
          "升级机制": "15分钟无响应自动升级"
        }
      },
      "文档管理": {
        "技术文档": "docs/technical/",
        "产品文档": "docs/product/",
        "会议记录": "docs/meetings/",
        "决策记录": "docs/adr/"
      }
    };
    
    const commDoc = `# 团队沟通机制

## 沟通渠道配置

${Object.entries(communicationConfig).map(([category, items]) => `
### ${category}

${Object.entries(items).map(([item, details]) => `
#### ${item}
${typeof details === 'object' ? Object.entries(details).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `- **${key}**: ${value.join(', ')}`;
  }
  return `- **${key}**: ${value}`;
}).join('\n') : `- ${details}`}
`).join('\n')}
`).join('\n')}

## 沟通工具

### 即时通讯
- **主要群组**: PeriodHub项目群
- **技术讨论**: 技术专项群
- **紧急联系**: 电话/短信

### 会议工具
- **日常会议**: 腾讯会议
- **重要会议**: 线下会议室
- **文档协作**: 腾讯文档

### 项目管理
- **任务跟踪**: GitHub Issues
- **进度管理**: 项目看板
- **文档管理**: Git仓库

---
*最后更新: ${new Date().toISOString()}*
`;

    fs.writeFileSync(`${this.docsDir}/communication-channels.md`, commDoc);
    console.log('✅ 沟通机制设置完成');
  }

  async generateWorkflowTemplates() {
    console.log('📋 生成工作流模板...');
    
    // 代码审查模板
    const codeReviewTemplate = `# 代码审查清单

## 审查前检查
- [ ] 代码已通过所有自动化测试
- [ ] 代码已通过linting检查
- [ ] 代码已通过类型检查
- [ ] 相关文档已更新

## 代码质量检查
- [ ] 代码逻辑清晰，易于理解
- [ ] 变量和函数命名规范
- [ ] 没有硬编码URL或文本
- [ ] 错误处理完善
- [ ] 性能考虑合理

## SEO相关检查
- [ ] 页面元数据正确
- [ ] Canonical标签正确
- [ ] 内部链接正确
- [ ] 图片alt属性完整

## 性能相关检查
- [ ] 图片优化合理
- [ ] 代码分割适当
- [ ] 第三方脚本优化
- [ ] 缓存策略合理

## 安全性检查
- [ ] 没有敏感信息泄露
- [ ] 输入验证完善
- [ ] XSS防护到位
- [ ] CSRF防护到位

## 审查意见
**审查人**: ________________
**审查时间**: ________________
**通过状态**: [ ] 通过 [ ] 需要修改 [ ] 拒绝
**修改建议**:
_________________________________
_________________________________
_________________________________

**审查人签名**: ________________
`;

    fs.writeFileSync(`${this.templatesDir}/code-review-checklist.md`, codeReviewTemplate);

    // 发布检查清单
    const releaseChecklist = `# 发布检查清单

## 发布前检查
- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 文档更新完成
- [ ] 备份已创建
- [ ] 回滚计划准备

## SEO检查
- [ ] Sitemap更新
- [ ] Robots.txt检查
- [ ] Canonical标签检查
- [ ] 重复页面检查
- [ ] 内部链接检查

## 性能检查
- [ ] 移动端性能测试
- [ ] 桌面端性能测试
- [ ] 关键指标监控
- [ ] 加载时间测试

## 功能检查
- [ ] 核心功能测试
- [ ] 多语言测试
- [ ] 响应式测试
- [ ] 浏览器兼容性测试

## 发布后检查
- [ ] 监控指标正常
- [ ] 错误日志检查
- [ ] 用户反馈收集
- [ ] 性能指标监控

**发布负责人**: ________________
**发布时间**: ________________
**发布版本**: ________________
`;

    fs.writeFileSync(`${this.templatesDir}/release-checklist.md`, releaseChecklist);

    // 问题报告模板
    const issueTemplate = `# 问题报告模板

## 问题描述
**问题标题**: 
**发现时间**: 
**发现人**: 
**问题类型**: [ ] Bug [ ] 性能问题 [ ] SEO问题 [ ] 用户体验问题

## 问题详情
**问题描述**:
_________________________________
_________________________________

**重现步骤**:
1. 
2. 
3. 

**预期结果**:
_________________________________

**实际结果**:
_________________________________

## 环境信息
**浏览器**: 
**操作系统**: 
**设备类型**: [ ] 桌面 [ ] 移动 [ ] 平板
**网络环境**: 

## 影响评估
**严重程度**: [ ] 低 [ ] 中 [ ] 高 [ ] 严重
**影响范围**: 
**用户影响**: 

## 解决方案
**建议解决方案**:
_________________________________
_________________________________

**优先级**: [ ] P0 [ ] P1 [ ] P2 [ ] P3
**预计修复时间**: 
**负责人**: 
`;

    fs.writeFileSync(`${this.templatesDir}/issue-report-template.md`, issueTemplate);

    console.log('✅ 工作流模板生成完成');
  }

  async createTrainingMaterials() {
    console.log('📚 创建培训材料...');
    
    // 新人入职培训
    const onboardingGuide = `# 新人入职培训指南

## 项目概述
PeriodHub是一个专注于女性健康的国际化网站，提供多语言支持和专业的健康内容。

## 技术栈
- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **部署**: Vercel
- **监控**: 自定义监控系统

## 开发环境设置
1. 克隆代码仓库
2. 安装依赖: \`npm install\`
3. 配置环境变量
4. 启动开发服务器: \`npm run dev\`

## 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 使用Prettier格式化
- 提交前运行所有检查

## 工作流程
1. 创建功能分支
2. 开发功能
3. 运行测试
4. 代码审查
5. 合并到主分支

## 常用命令
- \`npm run dev\`: 启动开发服务器
- \`npm run build\`: 构建项目
- \`npm run lint\`: 代码检查
- \`npm run test\`: 运行测试

## 重要文档
- 技术文档: docs/technical/
- 产品文档: docs/product/
- 工作流程: workflow/
`;

    fs.writeFileSync(`${this.docsDir}/training/onboarding-guide.md`, onboardingGuide);

    // 技术培训材料
    const technicalTraining = `# 技术培训材料

## SEO技术培训

### 基础知识
- 搜索引擎工作原理
- SEO核心概念
- 技术SEO要素

### 实践技能
- Canonical标签配置
- Sitemap生成和提交
- 内部链接优化
- 页面性能优化

### 工具使用
- Google Search Console
- Google PageSpeed Insights
- Lighthouse
- 自定义监控工具

## 性能优化培训

### 核心指标
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

### 优化技术
- 图片优化
- 代码分割
- 缓存策略
- 第三方脚本优化

### 监控工具
- 性能监控系统
- 告警配置
- 数据分析

## 国际化技术培训

### 基础概念
- 多语言支持
- 翻译键管理
- 硬编码问题

### 最佳实践
- 翻译键命名规范
- 硬编码预防
- 内容模板使用

### 工具使用
- 硬编码检测工具
- 翻译键检查工具
- 内容模板生成器
`;

    fs.writeFileSync(`${this.docsDir}/training/technical-training.md`, technicalTraining);

    console.log('✅ 培训材料创建完成');
  }

  async setupCodeReviewProcess() {
    console.log('🔍 设置代码审查流程...');
    
    // Git hooks配置
    const preCommitHook = `#!/bin/sh
# Pre-commit hook for PeriodHub project

echo "🔍 运行代码检查..."

# 运行linting检查
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting检查失败，请修复后再提交"
    exit 1
fi

# 运行类型检查
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ 类型检查失败，请修复后再提交"
    exit 1
fi

# 检查硬编码URL
npm run hardcode:detect
if [ $? -ne 0 ]; then
    echo "❌ 发现硬编码URL，请修复后再提交"
    exit 1
fi

echo "✅ 代码检查通过"
exit 0
`;

    fs.writeFileSync(`${this.workflowDir}/pre-commit`, preCommitHook);
    fs.chmodSync(`${this.workflowDir}/pre-commit`, '755');

    // 代码审查流程文档
    const codeReviewProcess = `# 代码审查流程

## 审查原则
1. **代码质量第一**: 确保代码质量，不妥协
2. **学习机会**: 把审查当作学习机会
3. **建设性反馈**: 提供建设性的改进建议
4. **及时响应**: 24小时内完成审查

## 审查流程
1. **提交PR**: 创建Pull Request
2. **自动检查**: CI/CD自动运行检查
3. **人工审查**: 至少一人审查
4. **修改完善**: 根据反馈修改代码
5. **合并代码**: 审查通过后合并

## 审查重点
- 代码逻辑正确性
- 性能影响评估
- 安全性考虑
- SEO影响评估
- 可维护性
- 测试覆盖度

## 审查工具
- GitHub Pull Request
- 代码审查清单
- 自动化检查工具
- 性能测试工具

## 审查标准
- 代码通过所有自动化测试
- 符合项目编码规范
- 没有硬编码问题
- 性能影响可接受
- 安全性检查通过
`;

    fs.writeFileSync(`${this.docsDir}/code-review-process.md`, codeReviewProcess);

    console.log('✅ 代码审查流程设置完成');
  }

  printSetupSummary() {
    console.log('\n👥 团队协作工作流设置摘要');
    
    console.log('\n📁 目录结构:');
    console.log('   workflow/');
    console.log('   ├── checklists/      # 检查清单');
    console.log('   ├── templates/       # 工作流模板');
    console.log('   └── processes/       # 流程文档');
    console.log('   docs/');
    console.log('   ├── standards/       # 标准文档');
    console.log('   ├── training/        # 培训材料');
    console.log('   └── adr/            # 架构决策记录');
    
    console.log('\n👤 角色分工:');
    console.log('   - 技术负责人: SEO技术实施、性能优化');
    console.log('   - 产品负责人: 业务影响评估、用户体验');
    console.log('   - 运维负责人: 监控部署、系统稳定性');
    console.log('   - 测试负责人: 功能测试、质量保证');
    
    console.log('\n💬 沟通机制:');
    console.log('   - 每日站会: 15分钟同步');
    console.log('   - 每周回顾: 1小时总结');
    console.log('   - 重要通知: 48小时提前通知');
    console.log('   - 紧急问题: 15分钟响应');
    
    console.log('\n📋 工作流模板:');
    console.log('   - 代码审查清单');
    console.log('   - 发布检查清单');
    console.log('   - 问题报告模板');
    
    console.log('\n🔍 代码审查:');
    console.log('   - Pre-commit hooks');
    console.log('   - 自动化检查');
    console.log('   - 人工审查流程');
  }
}

// 主执行
if (require.main === module) {
  const setup = new TeamWorkflowSetup();
  setup.setup().catch(console.error);
}

module.exports = TeamWorkflowSetup;
