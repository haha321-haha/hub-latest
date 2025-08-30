#!/bin/bash

# PeriodHub SEO文件上传脚本
# 将所有SEO相关的新文件和修改文件上传到GitHub

echo "🚀 开始上传PeriodHub SEO优化文件..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 添加所有SEO相关文件
echo "📁 添加SEO策略文档..."
git add SEO_CONTENT_STRATEGY.md
git add KEYWORD_RESEARCH_GUIDE.md
git add INTERNAL_LINKING_STRATEGY.md

echo "🔧 添加SEO自动化脚本..."
git add scripts/seo-automation.js

echo "📊 添加SEO数据文件..."
git add seo-optimization-report.json
git add content-creation-checklist.json

echo "🔄 添加修改的核心文件..."
git add app/layout.tsx

# 检查文件状态
echo "📋 检查待提交文件..."
git status

# 提交更改
echo "💾 提交SEO优化更改..."
git commit -m "feat: 🔍 完善SEO优化策略和自动化工具

✨ 新增功能:
- SEO内容策略完整指南
- 关键词研究方法和工具
- 内链策略实施方案
- SEO自动化分析脚本

🔧 优化改进:
- 优化layout.tsx中的关键词配置
- 生成SEO优化分析报告
- 创建内容创作清单

📊 数据文件:
- seo-optimization-report.json
- content-creation-checklist.json

🎯 预期效果:
- 提升有机流量200%+
- 覆盖高价值关键词
- 建立系统化SEO流程"

# 推送到远程仓库
echo "🌐 推送到GitHub..."
git push origin main

echo "✅ SEO文件上传完成!"
echo ""
echo "📋 已上传的文件:"
echo "  📄 SEO_CONTENT_STRATEGY.md - SEO内容策略"
echo "  📄 KEYWORD_RESEARCH_GUIDE.md - 关键词研究指南"  
echo "  📄 INTERNAL_LINKING_STRATEGY.md - 内链策略指南"
echo "  🔧 scripts/seo-automation.js - SEO自动化脚本"
echo "  📊 seo-optimization-report.json - SEO分析报告"
echo "  📊 content-creation-checklist.json - 内容创作清单"
echo "  🔄 app/layout.tsx - 优化后的布局文件"
echo ""
echo "🎯 下一步建议:"
echo "  1. 使用Google Keyword Planner获取真实关键词数据"
echo "  2. 开始创建高价值内容文章"
echo "  3. 实施内链策略优化"
echo "  4. 监控SEO效果数据"