#!/bin/bash

# PeriodHub SEO技术文件上传脚本
# 只上传技术实现相关的文件，不包含商业策略文档

echo "🚀 上传SEO技术实现文件..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 只添加技术实现文件
echo "🔧 添加SEO技术文件..."
git add app/layout.tsx
git add scripts/seo-automation.js

# 检查文件状态
echo "📋 检查待提交文件..."
git status

# 提交更改
echo "💾 提交SEO技术优化..."
git commit -m "feat: 🔍 SEO技术优化和自动化工具

🔧 技术优化:
- 优化layout.tsx中的关键词配置
- 新增SEO自动化分析脚本

⚡ 功能特性:
- 自动关键词机会分析
- SEO优化建议生成
- 内容创作指导

🎯 技术效果:
- 提升SEO配置标准化
- 自动化SEO分析流程"

# 推送到远程仓库
echo "🌐 推送到GitHub..."
git push origin main

echo "✅ SEO技术文件上传完成!"
echo ""
echo "📋 已上传的技术文件:"
echo "  🔄 app/layout.tsx - 优化后的SEO配置"
echo "  🤖 scripts/seo-automation.js - SEO自动化工具"
echo ""
echo "📚 策略文档已保留在本地:"
echo "  📄 SEO_CONTENT_STRATEGY.md - 内部策略指导"
echo "  📄 KEYWORD_RESEARCH_GUIDE.md - 操作指南"  
echo "  📄 INTERNAL_LINKING_STRATEGY.md - 内链策略"
echo ""
echo "💡 建议:"
echo "  1. 将策略文档移至团队知识库"
echo "  2. 使用策略文档指导实际SEO工作"
echo "  3. 定期基于策略更新技术实现"