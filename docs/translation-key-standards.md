# 翻译键结构标准文档

## 📋 概述

本文档定义了项目中翻译键的命名规范、层级结构和最佳实践，确保翻译系统的一致性和可维护性。

## 🏗️ 翻译键层级结构

### 顶层命名空间

```
messages/
├── zh.json
└── en.json
```

### 翻译键结构

```json
{
  "site": {
    "name": "网站名称",
    "title": "页面标题",
    "description": "页面描述"
  },
  "metadata": {
    "pageName": {
      "title": "页面标题",
      "description": "页面描述",
      "keywords": "关键词"
    }
  },
  "common": {
    "buttons": {
      "save": "保存",
      "cancel": "取消",
      "submit": "提交"
    },
    "messages": {
      "success": "操作成功",
      "error": "操作失败",
      "loading": "加载中"
    },
    "labels": {
      "name": "姓名",
      "email": "邮箱",
      "phone": "电话"
    }
  },
  "pageName": {
    "meta": {
      "title": "页面标题",
      "description": "页面描述"
    },
    "hero": {
      "title": "主标题",
      "subtitle": "副标题",
      "description": "描述文本"
    },
    "sections": {
      "sectionName": {
        "title": "章节标题",
        "content": "章节内容"
      }
    },
    "components": {
      "componentName": {
        "title": "组件标题",
        "description": "组件描述"
      }
    }
  }
}
```

## 📝 命名规范

### 1. 键名规则

- **使用驼峰命名法**: `camelCase`
- **使用有意义的名称**: 避免缩写和简写
- **使用英文**: 所有键名使用英文
- **避免特殊字符**: 只使用字母、数字和点号

#### ✅ 正确示例
```json
{
  "painTracker": {
    "title": "痛经追踪",
    "painLevel": "疼痛程度",
    "painLocation": "疼痛位置"
  }
}
```

#### ❌ 错误示例
```json
{
  "pain_tracker": "痛经追踪",           // 使用下划线
  "painTracker": "痛经追踪",            // 键名应该是英文
  "pt": "痛经追踪",                    // 缩写
  "pain-tracker": "痛经追踪"           // 使用连字符
}
```

### 2. 层级结构规则

#### 页面级结构
```
pageName.meta.title
pageName.hero.title
pageName.sections.sectionName.title
pageName.components.componentName.title
```

#### 组件级结构
```
componentName.elements.elementName
componentName.actions.actionName
componentName.messages.messageName
```

#### 通用级结构
```
common.buttons.buttonName
common.messages.messageName
common.labels.labelName
common.placeholders.placeholderName
```

### 3. 特殊键命名

#### 数组键
```json
{
  "symptoms": {
    "items": [
      "症状1",
      "症状2",
      "症状3"
    ]
  }
}
```

#### 对象键
```json
{
  "user": {
    "profile": {
      "name": "姓名",
      "age": "年龄"
    }
  }
}
```

#### 动态键
```json
{
  "painLevels": {
    "level1": "轻微疼痛",
    "level2": "中度疼痛",
    "level3": "严重疼痛"
  }
}
```

## 🎯 最佳实践

### 1. 键名设计原则

- **描述性**: 键名应该清楚描述其用途
- **一致性**: 相同类型的键使用相同的命名模式
- **简洁性**: 避免过长的键名
- **可读性**: 键名应该易于理解和记忆

### 2. 层级设计原则

- **逻辑分组**: 相关的键放在同一个命名空间下
- **合理深度**: 避免过深的嵌套（建议不超过4层）
- **清晰边界**: 不同功能模块使用不同的命名空间

### 3. 内容组织原则

- **按功能分组**: 将相关功能的翻译键放在一起
- **按页面分组**: 每个页面有独立的翻译键空间
- **按组件分组**: 可复用组件有独立的翻译键空间

## 📊 翻译键分类

### 1. 元数据键
用于SEO和页面元信息
```json
{
  "meta": {
    "title": "页面标题",
    "description": "页面描述",
    "keywords": "关键词"
  }
}
```

### 2. 内容键
用于页面主要内容
```json
{
  "hero": {
    "title": "主标题",
    "subtitle": "副标题"
  },
  "sections": {
    "about": {
      "title": "关于我们",
      "content": "内容描述"
    }
  }
}
```

### 3. 交互键
用于用户交互元素
```json
{
  "buttons": {
    "save": "保存",
    "cancel": "取消",
    "submit": "提交"
  },
  "forms": {
    "labels": {
      "name": "姓名",
      "email": "邮箱"
    },
    "placeholders": {
      "name": "请输入姓名",
      "email": "请输入邮箱"
    }
  }
}
```

### 4. 消息键
用于系统消息和提示
```json
{
  "messages": {
    "success": "操作成功",
    "error": "操作失败",
    "warning": "警告信息",
    "info": "提示信息"
  }
}
```

## 🔧 工具支持

### 1. 验证工具
使用 `validate-translation-keys.js` 验证翻译键是否符合标准：
```bash
node scripts/i18n-toolchain.js validate
```

### 2. 同步工具
使用 `sync-translation-keys.js` 同步翻译键：
```bash
node scripts/i18n-toolchain.js sync
```

### 3. 清理工具
使用 `cleanup-unused-keys.js` 清理未使用的键：
```bash
node scripts/i18n-toolchain.js clean --dry-run
```

## 📋 检查清单

### 新增翻译键时
- [ ] 键名使用驼峰命名法
- [ ] 键名使用英文
- [ ] 键名具有描述性
- [ ] 键名长度适中（不超过50字符）
- [ ] 键名不包含特殊字符
- [ ] 键名不重复
- [ ] 层级结构合理
- [ ] 中英文翻译完整

### 修改翻译键时
- [ ] 保持命名规范一致
- [ ] 更新相关文档
- [ ] 测试翻译键功能
- [ ] 同步所有语言版本

### 删除翻译键时
- [ ] 确认键未被使用
- [ ] 更新相关文档
- [ ] 清理所有语言版本
- [ ] 测试应用功能

## 🚀 实施指南

### 1. 现有项目迁移
1. 运行审计工具检测现有问题
2. 制定迁移计划
3. 逐步重构翻译键结构
4. 验证和测试

### 2. 新项目开发
1. 按照标准创建翻译键结构
2. 使用工具验证翻译键
3. 定期同步和清理
4. 持续优化和改进

## 📚 参考资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [国际化最佳实践](https://developers.google.com/international)
- [翻译键管理工具](../scripts/i18n-toolchain.js)

---

**最后更新**: 2024年12月
**版本**: 1.0.0
**维护者**: 开发团队
