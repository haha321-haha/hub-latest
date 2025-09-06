#!/bin/bash

echo "🔍 检查DNS配置状态..."
echo "================================"

echo "1. 检查当前CNAME记录："
nslookup www.periodhub.health

echo ""
echo "2. 检查dig结果："
dig www.periodhub.health CNAME

echo ""
echo "3. 检查网站可访问性："
curl -I https://www.periodhub.health 2>/dev/null | head -5

echo ""
echo "4. 检查sitemap状态："
curl -s https://www.periodhub.health/sitemap.xml | grep -o "https://[^<]*" | head -3

echo ""
echo "✅ DNS检查完成！"

