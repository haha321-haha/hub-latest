# 北美市场快速开始指南

## 概述

本指南专门针对Period Hub项目在北美市场的国际化需求，提供快速上手的步骤和最佳实践。

## 市场定位

- **主要市场**: 北美（美国、加拿大）
- **主要语言**: 英语（默认）
- **次要语言**: 中文（华裔用户群体）
- **合规要求**: FDA标准、HIPAA隐私保护

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
npm install glob

# 确保工具可执行
chmod +x scripts/*.js
```

### 2. 基础检查

```bash
# 检测硬编码问题
node scripts/i18n-cli.js detect

# 验证翻译键命名
node scripts/i18n-cli.js validate

# 检查FDA合规性
node scripts/i18n-cli.js fda

# 生成综合报告
node scripts/i18n-cli.js report
```

### 3. 开发工作流

#### 新内容开发
```bash
# 1. 先开发英语内容
# 2. 运行FDA合规检查
node scripts/i18n-cli.js fda

# 3. 验证医学术语
node scripts/i18n-cli.js medical

# 4. 检查硬编码
node scripts/i18n-cli.js detect

# 5. 生成报告
node scripts/i18n-cli.js report
```

#### 内容更新
```bash
# 1. 更新英语内容
# 2. 运行所有检查
node scripts/i18n-cli.js report

# 3. 修复发现的问题
# 4. 重新检查
node scripts/i18n-cli.js report
```

## 北美市场特殊要求

### 1. FDA合规性

#### 必需的免责声明
```json
{
  "medicalDisclaimer": {
    "title": "Medical Disclaimer",
    "content": "This information is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns."
  }
}
```

#### 禁止的声明
- ❌ "cure" (治愈)
- ❌ "treat" (治疗)
- ❌ "diagnose" (诊断)
- ❌ "prevent" (预防)
- ❌ "guarantee" (保证)

#### 推荐的表达
- ✅ "may help" (可能有助于)
- ✅ "support" (支持)
- ✅ "relieve" (缓解)
- ✅ "manage" (管理)

### 2. 医学术语标准

#### 使用FDA认证术语
```json
{
  "medical": {
    "symptoms": {
      "dysmenorrhea": "Dysmenorrhea",
      "endometriosis": "Endometriosis"
    },
    "treatments": {
      "heatTherapy": "Heat Therapy",
      "acupuncture": "Acupuncture"
    },
    "medications": {
      "ibuprofen": "Ibuprofen",
      "acetaminophen": "Acetaminophen"
    }
  }
}
```

#### 药物信息要求
```json
{
  "medications": {
    "ibuprofen": {
      "name": "Ibuprofen",
      "dosage": "400-600mg every 6-8 hours",
      "maxDaily": "2400mg",
      "warnings": [
        "Do not exceed recommended dose",
        "Consult doctor if symptoms persist"
      ]
    }
  }
}
```

### 3. 文化适应性

#### 测量单位
- **温度**: 显示华氏度(°F)，医学记录用摄氏度(°C)
- **重量**: 显示磅(lbs)，医学记录用千克(kg)
- **身高**: 显示英尺英寸，医学记录用厘米(cm)

#### 日期时间格式
- **日期**: MM/DD/YYYY
- **时间**: 12小时制，带AM/PM
- **时区**: 考虑美国多个时区

## 质量保证流程

### 1. 英语内容优先

```typescript
// 开发优先级
const developmentPriority = {
  english: {
    priority: 'P0',
    completeness: '100%',
    quality: 'professional',
    review: 'medical_professional'
  },
  chinese: {
    priority: 'P1',
    completeness: '80%',
    quality: 'basic_medical',
    review: 'basic_check'
  }
};
```

### 2. 检查清单

#### 英语内容检查
- [ ] 医学术语使用FDA认证术语
- [ ] 包含必需的免责声明
- [ ] 药物信息包含剂量和警告
- [ ] 符合美式英语表达习惯
- [ ] 通过FDA合规性检查

#### 中文内容检查
- [ ] 核心功能完整翻译
- [ ] 医学术语准确翻译
- [ ] 基本用户界面本地化
- [ ] 通过基础医学检查

### 3. 自动化检查

```bash
# 添加到package.json
{
  "scripts": {
    "i18n:check": "node scripts/i18n-cli.js detect",
    "i18n:fda": "node scripts/i18n-cli.js fda",
    "i18n:medical": "node scripts/i18n-cli.js medical",
    "i18n:report": "node scripts/i18n-cli.js report"
  }
}
```

## 常见问题解决

### 1. FDA合规性问题

#### 问题: 缺少免责声明
```bash
# 检查
node scripts/i18n-cli.js fda

# 解决方案: 添加必需声明
{
  "medicalDisclaimer": {
    "title": "Medical Disclaimer",
    "content": "This information is for educational purposes only..."
  }
}
```

#### 问题: 包含禁止声明
```bash
# 检查
node scripts/i18n-cli.js fda

# 解决方案: 替换为允许的表达
# ❌ "cure dysmenorrhea"
# ✅ "may help manage dysmenorrhea"
```

### 2. 医学术语问题

#### 问题: 术语不准确
```bash
# 检查
node scripts/i18n-cli.js medical

# 解决方案: 使用FDA认证术语
# ❌ "menstrual pain"
# ✅ "dysmenorrhea"
```

#### 问题: 药物信息不完整
```bash
# 检查
node scripts/i18n-cli.js medical

# 解决方案: 添加完整信息
{
  "ibuprofen": {
    "dosage": "400-600mg every 6-8 hours",
    "warnings": ["Do not exceed recommended dose"]
  }
}
```

### 3. 硬编码问题

#### 问题: 发现硬编码
```bash
# 检查
node scripts/i18n-cli.js detect

# 解决方案: 替换为翻译键
# ❌ locale === 'zh' ? '中文' : 'English'
# ✅ t('translation.key')
```

## 最佳实践

### 1. 开发流程
1. **英语优先**: 先完善英语内容
2. **合规检查**: 确保FDA合规性
3. **医学审核**: 验证医学术语准确性
4. **中文补充**: 添加中文翻译
5. **质量保证**: 运行所有检查

### 2. 内容策略
- **专业性**: 使用标准医学术语
- **准确性**: 确保医学信息准确
- **合规性**: 符合FDA要求
- **用户友好**: 考虑用户体验

### 3. 维护策略
- **定期检查**: 每周运行质量检查
- **及时更新**: 根据最新医学研究更新
- **用户反馈**: 收集并响应用户反馈
- **持续改进**: 不断优化内容质量

## 总结

这个快速开始指南确保：

1. **市场定位准确**: 明确面向北美市场
2. **合规性保证**: 符合FDA和当地法规
3. **质量优先**: 英语内容质量优先
4. **工具支持**: 自动化检查工具
5. **流程清晰**: 明确的开发流程

通过遵循这个指南，Period Hub将在北美市场建立专业、可信的品牌形象。

