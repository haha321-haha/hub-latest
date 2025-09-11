#!/bin/bash

echo "🚀 开始修复sitemap和robots.txt部署问题..."

# 1. 确保所有更改已提交
echo "📝 检查Git状态..."
git status

# 2. 推送到GitHub触发自动部署
echo "🔄 推送到GitHub触发Vercel自动部署..."
git push origin main

# 3. 等待部署完成
echo "⏳ 等待部署完成..."
sleep 30

# 4. 测试sitemap.xml
echo "🧪 测试sitemap.xml..."
curl -I https://www.periodhub.health/sitemap.xml

# 5. 测试robots.txt
echo "🧪 测试robots.txt..."
curl -I https://www.periodhub.health/robots.txt

echo "✅ 部署修复完成！"
echo "📋 如果仍然404，请检查："
echo "   1. Vercel部署日志"
echo "   2. 环境变量配置"
echo "   3. 手动触发重新部署"


