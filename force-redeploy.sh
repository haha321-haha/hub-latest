#!/bin/bash

echo "🚀 强制重新部署以修复sitemap问题..."

# 1. 创建一个空提交来触发重新部署
echo "📝 创建空提交触发重新部署..."
git commit --allow-empty -m "🔄 强制重新部署修复sitemap.xml访问问题

- 触发Vercel重新构建
- 清除缓存
- 确保sitemap.xml和robots.txt正确生成"

# 2. 推送到GitHub
echo "🔄 推送到GitHub..."
git push origin main

# 3. 等待部署完成
echo "⏳ 等待部署完成（2分钟）..."
sleep 120

# 4. 测试sitemap.xml
echo "🧪 测试sitemap.xml..."
curl -I https://www.periodhub.health/sitemap.xml

# 5. 测试robots.txt
echo "🧪 测试robots.txt..."
curl -I https://www.periodhub.health/robots.txt

echo "✅ 强制重新部署完成！"
echo "📋 如果仍然404，可能需要："
echo "   1. 检查Vercel部署日志"
echo "   2. 手动在Vercel控制台触发重新部署"
echo "   3. 检查环境变量配置"


