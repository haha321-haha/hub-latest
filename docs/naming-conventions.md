# 翻译键命名规范 - 北美市场优化

## 概述

本规范专门针对北美市场的Period Hub项目，确保翻译键的命名清晰、一致且易于维护。

## 核心原则

1. **英文优先**: 以英文为基准语言，中文为翻译语言
2. **语义清晰**: 键名能够清楚表达内容含义
3. **结构一致**: 保持统一的命名结构
4. **易于维护**: 便于开发者理解和维护

## 命名结构

### 基本格式
```
[namespace].[category].[section].[item]
```

### 最大嵌套深度
- **限制**: 最多3层嵌套
- **原因**: 避免过深的嵌套，保持可读性

### 命名风格
- **格式**: camelCase（驼峰命名）
- **禁用字符**: `-`, `_`, ` `（空格）
- **允许字符**: 字母、数字、点号

## 命名空间规范

### 1. 页面级别 (pages)
```
pages.[pageName].[section].[item]
```

**示例**:
```json
{
  "pages": {
    "naturalTherapies": {
      "meta": {
        "title": "Natural Therapies for Menstrual Pain",
        "description": "Evidence-based natural treatments for dysmenorrhea"
      },
      "hero": {
        "title": "Natural Pain Relief",
        "subtitle": "Evidence-based therapies for menstrual pain",
        "description": "Discover effective natural treatments..."
      },
      "sections": {
        "heatTherapy": {
          "title": "Heat Therapy",
          "description": "Safe and effective heat treatment methods"
        }
      }
    }
  }
}
```

### 2. 组件级别 (components)
```
components.[componentName].[prop]
```

**示例**:
```json
{
  "components": {
    "button": {
      "text": "Submit",
      "loading": "Loading...",
      "error": "Error occurred"
    },
    "modal": {
      "title": "Confirmation",
      "close": "Close",
      "confirm": "Confirm"
    }
  }
}
```

### 3. 医学内容 (medical)
```
medical.[category].[type].[item]
```

**示例**:
```json
{
  "medical": {
    "terms": {
      "symptoms": {
        "dysmenorrhea": "Dysmenorrhea",
        "endometriosis": "Endometriosis"
      },
      "treatments": {
        "heatTherapy": "Heat Therapy",
        "acupuncture": "Acupuncture"
      }
    },
    "dosage": {
      "ibuprofen": "400-600mg every 6-8 hours",
      "acetaminophen": "500-1000mg every 4-6 hours"
    },
    "warnings": {
      "high": "Consult healthcare provider immediately",
      "medium": "Monitor symptoms closely",
      "low": "Continue monitoring"
    }
  }
}
```

### 4. 通用内容 (common)
```
common.[category].[item]
```

**示例**:
```json
{
  "common": {
    "actions": {
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete"
    },
    "messages": {
      "loading": "Loading...",
      "error": "An error occurred",
      "success": "Success!",
      "noData": "No data available"
    },
    "navigation": {
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "help": "Help"
    }
  }
}
```

## 特殊规则

### 1. 医学术语处理
- **前缀**: 使用 `medical.` 前缀
- **分类**: 按症状、治疗、药物等分类
- **一致性**: 确保医学术语在整个应用中保持一致

### 2. 动态内容
- **列表项**: 使用索引 `[0]`, `[1]`, `[2]`
- **动态键**: 使用模板字符串 `${variable}`

**示例**:
```json
{
  "therapies": {
    "list": {
      "0": "Heat Therapy",
      "1": "Yoga",
      "2": "Aromatherapy"
    }
  }
}
```

### 3. 条件内容
- **性别相关**: 使用 `gender` 分类
- **年龄相关**: 使用 `age` 分类
- **症状相关**: 使用 `symptom` 分类

**示例**:
```json
{
  "medical": {
    "gender": {
      "female": "Female",
      "male": "Male"
    },
    "age": {
      "teen": "Teen (13-19)",
      "adult": "Adult (20+)"
    }
  }
}
```

## 命名最佳实践

### 1. 语义化命名
```json
// ✅ 好的命名
{
  "pages": {
    "naturalTherapies": {
      "sections": {
        "heatTherapy": {
          "title": "Heat Therapy",
          "description": "Safe heat treatment methods"
        }
      }
    }
  }
}

// ❌ 避免的命名
{
  "p": {
    "nt": {
      "s": {
        "ht": {
          "t": "Heat Therapy"
        }
      }
    }
  }
}
```

### 2. 一致性
```json
// ✅ 保持一致的命名模式
{
  "pages": {
    "naturalTherapies": {
      "sections": {
        "heatTherapy": { "title": "Heat Therapy" },
        "yogaTherapy": { "title": "Yoga Therapy" },
        "herbalTherapy": { "title": "Herbal Therapy" }
      }
    }
  }
}
```

### 3. 可读性
```json
// ✅ 清晰的层次结构
{
  "medical": {
    "treatments": {
      "heatTherapy": {
        "title": "Heat Therapy",
        "description": "Safe heat treatment methods",
        "instructions": "Apply heat for 15-20 minutes"
      }
    }
  }
}
```

## 验证规则

### 1. 命名验证
- 检查是否符合camelCase格式
- 验证嵌套深度不超过3层
- 确保没有禁用字符

### 2. 结构验证
- 验证命名空间结构
- 检查键名唯一性
- 确保中英文键名一致

### 3. 内容验证
- 验证翻译内容完整性
- 检查医学术语准确性
- 确保用户体验一致性

## 工具支持

### 1. 命名验证工具
```bash
# 验证翻译键命名
./scripts/validate-naming.js
```

### 2. 结构检查工具
```bash
# 检查翻译键结构
./scripts/check-structure.js
```

### 3. 自动修复工具
```bash
# 自动修复命名问题
./scripts/fix-naming.js
```

## 示例项目结构

```
messages/
├── en.json
├── zh.json
└── templates/
    ├── page-template.json
    ├── component-template.json
    └── medical-template.json
```

## 总结

这个命名规范专门针对北美市场的Period Hub项目，确保：

1. **清晰性**: 每个键名都能清楚表达其含义
2. **一致性**: 保持统一的命名模式
3. **可维护性**: 便于开发者理解和维护
4. **专业性**: 特别针对医学内容的命名规范
5. **扩展性**: 支持未来功能的扩展

遵循这个规范将确保项目的国际化工作高效、准确且易于维护。

