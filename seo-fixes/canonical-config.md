# Canonical 标签配置
# 用于解决重复页面问题

## 需要添加 canonical 标签的页面

### 1. 交互工具页面
- https://www.periodhub.health/en/interactive-tools/symptom-tracker
  <link rel="canonical" href="https://www.periodhub.health/en/interactive-tools/symptom-tracker" />

- https://www.periodhub.health/en/interactive-tools
  <link rel="canonical" href="https://www.periodhub.health/en/interactive-tools" />

- https://www.periodhub.health/zh/teen-health
  <link rel="canonical" href="https://www.periodhub.health/zh/teen-health" />

## 2. PDF 文件处理建议

以下 PDF 文件建议从搜索引擎索引中移除：
- https://www.periodhub.health/pdf-files/zhan-zhuang-baduanjin-illustrated-guide-zh.pdf
- https://www.periodhub.health/pdf-files/parent-communication-guide-en.pdf
- https://www.periodhub.health/pdf-files/parent-communication-guide-zh.pdf
- https://www.periodhub.health/pdf-files/teacher-collaboration-handbook-en.pdf
- https://www.periodhub.health/pdf-files/teacher-health-manual-en.pdf
- https://www.periodhub.health/pdf-files/healthy-habits-checklist-en.pdf
- https://www.periodhub.health/pdf-files/pain-tracking-form-zh.pdf
- https://www.periodhub.health/pdf-files/specific-menstrual-pain-management-guide-en.pdf

建议在 robots.txt 中添加：
Disallow: /pdf-files/

## 3. 实施步骤

1. 将 sitemap.xml 上传到网站根目录
2. 更新 robots.txt 文件
3. 为重复页面添加 canonical 标签
4. 在 Google Search Console 中重新提交 sitemap
5. 监控索引状态变化

## 4. 验证方法

1. 检查 sitemap.xml 是否可以正常访问
2. 验证 robots.txt 是否正确阻止 PDF 文件
3. 检查 canonical 标签是否正确设置
4. 监控 Google Search Console 中的重复页面数量变化
