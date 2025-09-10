# 📊 Google Analytics 数据源字段映射指南

## 🎯 字段映射配置

### 1. 关键字段 (Key Fields) - 必填，最多2个

| Analytics 字段 | CSV 字段 | 说明 |
|---|---|---|
| **数据流 ID** | `event_name` | 用于识别事件类型 |
| **网页路径** | `page_location` | 用于识别页面路径 |

### 2. 导入字段 (Import Fields) - 必填，最多10个

| Analytics 字段 | CSV 字段 | 说明 |
|---|---|---|
| **网页标题** | `page_title` | 页面标题 |
| **主机名** | `page_location` | 从URL提取域名 |
| **网页和屏幕** | `page_location` | 完整页面URL |
| **事件名称** | `event_name` | 事件类型 |
| **事件时间戳** | `event_timestamp` | 事件发生时间 |
| **自定义参数1** | `device_type` | 设备类型 |
| **自定义参数2** | `browser` | 浏览器类型 |
| **自定义参数3** | `country` | 国家/地区 |
| **自定义参数4** | `clicks` | 点击次数 |
| **自定义参数5** | `scrolls` | 滚动次数 |

## 🔧 具体操作步骤

### 步骤1: 添加关键字段

1. 点击 **"添加字段"** 按钮
2. 选择 **"数据流 ID"**
3. 在 **"导入字段"** 中输入: `event_name`
4. 点击 **"添加字段"** 按钮
5. 选择 **"网页路径"**
6. 在 **"导入字段"** 中输入: `page_location`

### 步骤2: 添加导入字段

1. 点击 **"添加字段"** 按钮
2. 选择 **"网页标题"**
3. 在 **"导入字段"** 中输入: `page_title`
4. 重复以上步骤，添加其他字段

## 📝 CSV文件格式要求

确保您的CSV文件包含以下列：

```csv
event_name,event_timestamp,page_location,page_title,device_type,browser,country,clicks,scrolls,time_on_page
pdf_interaction,2025-01-10T10:00:00Z,https://www.periodhub.health/downloads,PDF Downloads - /downloads,desktop,Chrome,CN,15,25,180
pdf_interaction,2025-01-10T10:05:00Z,https://www.periodhub.health/zh/downloads,PDF Downloads - /zh/downloads,mobile,Safari,US,12,30,165
```

## ⚠️ 注意事项

1. **字段名称必须完全匹配** CSV文件中的列名
2. **数据类型要正确** 时间戳使用ISO格式
3. **必填字段不能为空** 确保所有映射字段都有数据
4. **最多10个导入字段** 选择最重要的字段进行映射

## 🎯 推荐的最小字段集

如果只想映射最核心的字段，建议使用：

### 关键字段 (2个)
- 数据流 ID → event_name
- 网页路径 → page_location

### 导入字段 (5个)
- 网页标题 → page_title
- 事件名称 → event_name
- 事件时间戳 → event_timestamp
- 自定义参数1 → device_type
- 自定义参数2 → browser

这样可以满足Google Analytics的基本要求，同时保持数据导入的简洁性。
