# 翻译键命名规范 (Translation Key Naming Conventions)

## 📋 概述

本文档定义了Period Hub项目中翻译键的命名规范和最佳实践，确保代码的可维护性和一致性。

## 🎯 命名原则

### 1. 基本规则
- **camelCase**: 所有翻译键使用驼峰命名法
- **描述性**: 键名应该清晰描述其用途
- **简洁性**: 避免过长的键名，但保持可读性
- **一致性**: 相同类型的键使用统一的命名模式

### 2. 层级结构
```
顶级分类 -> 子分类 -> 具体功能 -> 状态/类型
```

## 📚 分类规范

### 1. 页面级别 (Page Level)
```json
{
  "pageName": {
    "title": "页面标题",
    "description": "页面描述",
    "meta": {
      "title": "SEO标题",
      "description": "SEO描述"
    }
  }
}
```

**示例:**
```json
{
  "homePage": {
    "title": "Home",
    "description": "Welcome to Period Hub"
  },
  "articlesPage": {
    "title": "Articles",
    "description": "Health articles and guides"
  }
}
```

### 2. 组件级别 (Component Level)
```json
{
  "componentName": {
    "title": "组件标题",
    "subtitle": "副标题",
    "description": "描述文本",
    "actions": {
      "primary": "主要操作",
      "secondary": "次要操作"
    }
  }
}
```

**示例:**
```json
{
  "heroSection": {
    "title": "Professional Menstrual Health",
    "subtitle": "Evidence-based guidance",
    "cta": {
      "primary": "Get Started",
      "secondary": "Learn More"
    }
  }
}
```

### 3. 功能级别 (Feature Level)
```json
{
  "featureName": {
    "title": "功能标题",
    "description": "功能描述",
    "status": {
      "active": "激活状态",
      "inactive": "非激活状态"
    }
  }
}
```

### 4. 通用元素 (Common Elements)
```json
{
  "common": {
    "buttons": {
      "submit": "提交",
      "cancel": "取消",
      "save": "保存",
      "delete": "删除"
    },
    "navigation": {
      "home": "首页",
      "back": "返回",
      "next": "下一步"
    },
    "states": {
      "loading": "加载中",
      "error": "错误",
      "success": "成功"
    }
  }
}
```

## 🔧 具体命名模式

### 1. 按钮和操作
- `buttonName`: 按钮文本
- `actionName`: 操作文本
- `ctaName`: 行动号召文本

**示例:**
```json
{
  "buttons": {
    "submitForm": "Submit Form",
    "cancelAction": "Cancel",
    "saveChanges": "Save Changes"
  },
  "actions": {
    "startAssessment": "Start Assessment",
    "viewResults": "View Results"
  },
  "cta": {
    "getStarted": "Get Started",
    "learnMore": "Learn More"
  }
}
```

### 2. 表单元素
- `fieldName`: 字段标签
- `fieldNamePlaceholder`: 占位符文本
- `fieldNameHint`: 提示文本
- `fieldNameError`: 错误信息

**示例:**
```json
{
  "form": {
    "name": "Full Name",
    "namePlaceholder": "Enter your full name",
    "nameHint": "This will be displayed publicly",
    "nameError": "Name is required"
  }
}
```

### 3. 状态和消息
- `statusName`: 状态文本
- `messageType`: 消息文本
- `alertType`: 警告文本

**示例:**
```json
{
  "status": {
    "loading": "Loading...",
    "success": "Success!",
    "error": "An error occurred"
  },
  "messages": {
    "saveSuccess": "Data saved successfully",
    "saveError": "Failed to save data"
  },
  "alerts": {
    "warning": "Please check your input",
    "info": "Additional information available"
  }
}
```

### 4. 导航和菜单
- `navItemName`: 导航项文本
- `menuItemName`: 菜单项文本
- `breadcrumbName`: 面包屑文本

**示例:**
```json
{
  "navigation": {
    "home": "Home",
    "articles": "Articles",
    "tools": "Tools"
  },
  "menu": {
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Logout"
  },
  "breadcrumb": {
    "home": "Home",
    "currentPage": "Current Page"
  }
}
```

## 📝 特殊命名约定

### 1. 复数形式
- 使用复数形式表示集合或列表
- 单数形式表示单个项目

```json
{
  "articles": "Articles",           // 文章列表
  "article": "Article",             // 单篇文章
  "categories": "Categories",       // 分类列表
  "category": "Category"            // 单个分类
}
```

### 2. 时态和语态
- 使用现在时表示当前状态
- 使用过去时表示已完成的操作
- 使用将来时表示即将发生的操作

```json
{
  "current": "Current Status",
  "completed": "Completed",
  "upcoming": "Upcoming"
}
```

### 3. 修饰符
- 使用形容词修饰名词
- 使用副词修饰动词

```json
{
  "quickAction": "Quick Action",
  "carefullyRead": "Carefully Read",
  "immediateRelief": "Immediate Relief"
}
```

## 🚫 避免的命名模式

### 1. 不要使用
- 缩写: `btn` 而不是 `button`
- 数字开头: `1stStep` 应该改为 `firstStep`
- 特殊字符: `step-1` 应该改为 `step1`
- 过长的名称: `veryLongDescriptiveName` 应该简化为 `descriptiveName`

### 2. 不要重复
- 避免在键名中重复父级信息
- 避免冗余的描述词

```json
// ❌ 错误示例
{
  "articlePage": {
    "articleTitle": "Article Title",  // 重复了 "article"
    "articleDescription": "Description"
  }
}

// ✅ 正确示例
{
  "articlePage": {
    "title": "Article Title",
    "description": "Description"
  }
}
```

## 📊 层级深度建议

### 1. 推荐层级深度
- **2-3层**: 大多数情况
- **4层**: 复杂组件
- **5层以上**: 避免使用

### 2. 层级示例
```json
{
  "pageName": {                    // 1层: 页面
    "sectionName": {               // 2层: 区域
      "componentName": {           // 3层: 组件
        "elementName": "Value"     // 4层: 元素
      }
    }
  }
}
```

## 🔍 验证和检查

### 1. 命名检查清单
- [ ] 使用camelCase命名
- [ ] 名称具有描述性
- [ ] 避免缩写和特殊字符
- [ ] 层级结构合理
- [ ] 与现有模式一致

### 2. 自动验证工具
```bash
# 检查翻译键命名规范
npm run lint:translations

# 验证翻译键结构
npm run validate:translations
```

## 📚 最佳实践

### 1. 命名策略
1. **从具体到抽象**: 先确定具体功能，再抽象为通用模式
2. **保持一致性**: 相同类型的元素使用相同的命名模式
3. **考虑扩展性**: 为未来可能的功能预留命名空间

### 2. 文档维护
1. **及时更新**: 新增翻译键时更新此文档
2. **团队共享**: 确保团队成员了解并遵循规范
3. **定期审查**: 定期检查现有翻译键是否符合规范

## 🎯 实施计划

### Phase 1: 建立规范
- [x] 创建命名规范文档
- [x] 定义分类和模式
- [ ] 团队培训和沟通

### Phase 2: 重构现有键
- [ ] 识别不符合规范的键
- [ ] 制定重构计划
- [ ] 逐步重构和测试

### Phase 3: 自动化验证
- [ ] 创建验证工具
- [ ] 集成到CI/CD流程
- [ ] 建立代码审查检查点

---

**注意**: 此规范应该根据项目需求和发展进行调整，确保其始终符合团队的最佳实践。



