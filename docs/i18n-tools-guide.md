# 国际化工具使用指南

## 概述

本指南介绍如何使用为Period Hub项目开发的国际化工具，这些工具专门针对北美市场优化，帮助开发者维护高质量的国际化内容。

## 工具列表

### 1. 硬编码检测工具 (hardcode-detector.js)
- **功能**: 检测项目中的硬编码字符串
- **特点**: 支持多种硬编码模式，提供修复建议
- **适用场景**: 代码审查、质量保证

### 2. 国际化CLI工具 (i18n-cli.js)
- **功能**: 整合多种检查功能的命令行工具
- **特点**: 一键检测、验证、报告生成
- **适用场景**: 日常开发、CI/CD集成

## 快速开始

### 安装依赖
```bash
# 安装必要的npm包
npm install glob
```

### 基本使用

#### 1. 检测硬编码
```bash
# 检测当前项目
node scripts/hardcode-detector.js

# 检测指定项目
node scripts/hardcode-detector.js /path/to/project
```

#### 2. 使用CLI工具
```bash
# 检测硬编码
node scripts/i18n-cli.js detect

# 验证命名规范
node scripts/i18n-cli.js validate

# 检查医学术语
node scripts/i18n-cli.js medical

# 生成综合报告
node scripts/i18n-cli.js report
```

## 详细使用说明

### 硬编码检测工具

#### 检测模式
工具支持以下硬编码模式：

1. **条件字符串**
   ```javascript
   // 检测模式
   locale === 'zh' ? '中文' : 'English'
   locale === 'zh' ? "中文" : "English"
   ```

2. **对象字面量**
   ```javascript
   // 检测模式
   '中文' : 'English'
   "中文" : "English"
   ```

3. **三元运算符**
   ```javascript
   // 检测模式
   locale === 'zh' ? value1 : value2
   ```

4. **中文字符串**
   ```javascript
   // 检测模式
   "包含中文的字符串"
   '包含中文的字符串'
   ```

#### 输出示例
```
🔍 硬编码检测报告
==================================================

📈 摘要:
  总计: 5 个硬编码
  高优先级: 3 个
  中优先级: 2 个
  低优先级: 0 个

📋 按类型统计:
  conditional-string: 3 个
  object-literal: 2 个

📁 按文件统计:
  app/[locale]/natural-therapies/page.tsx: 3 个
  components/Button.tsx: 2 个

🔍 详细报告:

1. 🔴 app/[locale]/natural-therapies/page.tsx:45
   类型: 条件字符串硬编码
   内容: locale === 'zh' ? '自然疗法' : 'Natural Therapies'
   建议: 建议替换为: t('pages.naturalTherapies.title')
   代码: const title = locale === 'zh' ? '自然疗法' : 'Natural Therapies';
```

### CLI工具

#### 命令说明

##### detect - 检测硬编码
```bash
node scripts/i18n-cli.js detect [path]
```
- **功能**: 检测项目中的硬编码问题
- **参数**: `path` - 项目路径（可选，默认为当前目录）
- **输出**: 硬编码检测报告

##### validate - 验证命名规范
```bash
node scripts/i18n-cli.js validate [path]
```
- **功能**: 验证翻译键命名规范
- **参数**: `path` - 翻译文件目录（可选，默认为messages/）
- **输出**: 命名验证报告

##### medical - 检查医学术语
```bash
node scripts/i18n-cli.js medical [path]
```
- **功能**: 检查医学术语准确性
- **参数**: `path` - 翻译文件目录（可选，默认为messages/）
- **输出**: 医学术语检查报告

##### report - 生成综合报告
```bash
node scripts/i18n-cli.js report [path]
```
- **功能**: 生成综合的国际化质量报告
- **参数**: `path` - 项目路径（可选，默认为当前目录）
- **输出**: 综合报告文件

#### 输出示例

##### 命名验证报告
```
📋 翻译键命名验证报告
==================================================
总键数: 150
问题数: 3
分数: 98.0%

🔍 问题详情:
1. naming: pages.naturalTherapies.sections.heatTherapy.title - 键名不符合命名规范
2. structure: pages.naturalTherapies.sections.heatTherapy.details.instructions - 嵌套深度超过3层
3. completeness: pages.naturalTherapies.sections.heatTherapy.title - 中文翻译缺失
```

##### 医学术语检查报告
```
🏥 医学术语检查报告
==================================================
医学术语数: 25
药物信息数: 8
问题数: 2
分数: 92.0%

🔍 问题详情:
1. medication: ibuprofen - 药物信息缺少剂量
2. medical: dysmenorrhea - 医学术语可能不准确
```

##### 综合报告
```
📊 综合报告摘要
==================================================
项目: /path/to/project
时间: 2025-01-07T10:30:00.000Z
硬编码问题: 0
命名问题: 3
医学问题: 2
总体分数: 96.7%
```

## 集成到工作流

### 1. 开发环境集成

#### 创建快捷脚本
```bash
# 创建package.json脚本
{
  "scripts": {
    "i18n:check": "node scripts/i18n-cli.js detect",
    "i18n:validate": "node scripts/i18n-cli.js validate",
    "i18n:medical": "node scripts/i18n-cli.js medical",
    "i18n:report": "node scripts/i18n-cli.js report"
  }
}
```

#### 使用方式
```bash
# 快速检查
npm run i18n:check

# 验证命名
npm run i18n:validate

# 检查医学内容
npm run i18n:medical

# 生成报告
npm run i18n:report
```

### 2. Git Hooks集成

#### 创建pre-commit hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 检查硬编码..."
node scripts/i18n-cli.js detect

if [ $? -ne 0 ]; then
  echo "❌ 发现硬编码问题，请修复后重新提交"
  exit 1
fi

echo "✅ 硬编码检查通过"
```

#### 创建commit-msg hook
```bash
#!/bin/sh
# .git/hooks/commit-msg

echo "📋 验证翻译键命名..."
node scripts/i18n-cli.js validate

if [ $? -ne 0 ]; then
  echo "❌ 翻译键命名验证失败，请修复后重新提交"
  exit 1
fi

echo "✅ 翻译键命名验证通过"
```

### 3. CI/CD集成

#### GitHub Actions示例
```yaml
name: I18n Quality Check

on: [push, pull_request]

jobs:
  i18n-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Check hardcode
      run: node scripts/i18n-cli.js detect
    
    - name: Validate naming
      run: node scripts/i18n-cli.js validate
    
    - name: Check medical terms
      run: node scripts/i18n-cli.js medical
    
    - name: Generate report
      run: node scripts/i18n-cli.js report
    
    - name: Upload report
      uses: actions/upload-artifact@v2
      with:
        name: i18n-report
        path: i18n-report.json
```

## 最佳实践

### 1. 日常开发
- 每次提交前运行硬编码检测
- 定期验证翻译键命名规范
- 新增医学内容时检查术语准确性

### 2. 代码审查
- 使用工具生成报告
- 重点关注高优先级问题
- 确保医学内容准确性

### 3. 质量保证
- 定期运行综合报告
- 监控质量分数趋势
- 及时修复发现的问题

## 故障排除

### 常见问题

#### 1. 工具无法运行
```bash
# 检查Node.js版本
node --version

# 安装依赖
npm install glob

# 检查文件权限
chmod +x scripts/*.js
```

#### 2. 检测结果不准确
- 检查文件路径是否正确
- 确认排除模式是否合适
- 验证检测模式是否完整

#### 3. 报告文件无法生成
- 检查目录权限
- 确认磁盘空间充足
- 验证JSON格式是否正确

### 调试模式
```bash
# 启用详细输出
DEBUG=* node scripts/i18n-cli.js detect

# 检查特定文件
node scripts/hardcode-detector.js /path/to/specific/file
```

## 总结

这些工具为Period Hub项目提供了完整的国际化质量保证解决方案：

1. **硬编码检测**: 防止新的硬编码问题
2. **命名验证**: 确保翻译键命名规范
3. **医学检查**: 保证医学内容准确性
4. **综合报告**: 提供全面的质量评估

通过合理使用这些工具，可以显著提高项目的国际化质量和维护效率。

