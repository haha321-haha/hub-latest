#!/bin/bash

echo "🚨 紧急DNS修复验证脚本"
echo "================================"

echo "1. 检查当前CNAME记录："
nslookup www.periodhub.health

echo ""
echo "2. 检查目标CNAME记录："
dig www.periodhub.health CNAME

echo ""
echo "3. 测试www域名可访问性："
curl -I https://www.periodhub.health 2>/dev/null | head -10

echo ""
echo "4. 检查SSL证书状态："
echo | openssl s_client -servername www.periodhub.health -connect www.periodhub.health:443 2>/dev/null | openssl x509 -noout -dates

echo ""
echo "5. 检查sitemap可访问性："
curl -s https://www.periodhub.health/sitemap.xml | head -5

echo ""
echo "6. 检查根域名重定向："
curl -I https://periodhub.health 2>/dev/null | head -5

echo ""
echo "✅ DNS修复验证完成！"
echo "如果看到正确的CNAME记录和200状态码，说明修复成功！"

