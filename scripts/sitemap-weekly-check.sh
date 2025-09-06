#!/bin/bash

# 每周sitemap检查脚本
# 简单但有效的监控方案

echo "🔍 每周sitemap检查 - $(date)"
echo "=================================="

# 1. 可访问性检查
echo "1. 可访问性检查:"
http_status=$(curl -s -o /dev/null -w "%{http_code}" https://www.periodhub.health/sitemap.xml)
echo "   HTTP状态码: $http_status"
if [ "$http_status" = "200" ]; then
    echo "   ✅ sitemap可访问"
else
    echo "   ❌ sitemap不可访问"
fi

# 2. URL数量检查
echo "2. URL数量检查:"
url_count=$(curl -s https://www.periodhub.health/sitemap.xml | grep -c "<url>")
echo "   📊 当前URL数量: $url_count"

# 3. www前缀检查
echo "3. www前缀检查:"
www_count=$(curl -s https://www.periodhub.health/sitemap.xml | grep -o "https://www.periodhub.health" | wc -l)
if [ $www_count -gt 0 ]; then
    echo "   ✅ 包含www前缀 ($www_count 个URL)"
else
    echo "   ❌ 缺少www前缀"
fi

# 4. 样本URL检查
echo "4. 样本URL检查:"
echo "   📋 前3个URL:"
curl -s https://www.periodhub.health/sitemap.xml | grep -o "<loc>.*</loc>" | head -3 | sed 's/<loc>//g' | sed 's/<\/loc>//g'

echo "=================================="
echo "✅ 检查完成 - $(date)"
echo "📝 最后检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
