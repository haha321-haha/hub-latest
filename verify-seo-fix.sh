#!/bin/bash

# 🚀 SEO修复验证脚本 - 增强版
# 用于验证URL一致性和重定向配置

set -e  # 遇到错误时退出

echo "🔍 开始SEO修复验证..."
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_url() {
    local url=$1
    local description=$2
    local expected_status=$3
    
    echo -e "\n${BLUE}🔗 检查: $description${NC}"
    echo "URL: $url"
    
    # 使用curl检查，设置超时和重定向跟踪
    response=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" --max-time 10 --location "$url" 2>/dev/null || echo "ERROR|")
    
    if [[ $response == "ERROR"* ]]; then
        echo -e "${RED}❌ 连接失败或超时${NC}"
        return 1
    fi
    
    status_code=$(echo $response | cut -d'|' -f1)
    redirect_url=$(echo $response | cut -d'|' -f2)
    
    echo "状态码: $status_code"
    if [[ -n "$redirect_url" ]]; then
        echo "重定向到: $redirect_url"
    fi
    
    if [[ "$status_code" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ 通过${NC}"
        return 0
    else
        echo -e "${RED}❌ 失败 - 期望状态码: $expected_status, 实际: $status_code${NC}"
        return 1
    fi
}

# DNS检查函数
check_dns() {
    local domain=$1
    local record_type=$2
    
    echo -e "\n${BLUE}🌐 DNS检查: $domain ($record_type)${NC}"
    
    if [[ "$record_type" == "A" ]]; then
        result=$(dig +short "$domain" A 2>/dev/null | head -1)
    elif [[ "$record_type" == "CNAME" ]]; then
        result=$(dig +short "$domain" CNAME 2>/dev/null | head -1)
    fi
    
    if [[ -n "$result" ]]; then
        echo -e "${GREEN}✅ $record_type记录: $result${NC}"
        return 0
    else
        echo -e "${RED}❌ 未找到$record_type记录${NC}"
        return 1
    fi
}

# 元数据检查函数
check_metadata() {
    local url=$1
    local description=$2
    
    echo -e "\n${BLUE}🏷️ 元数据检查: $description${NC}"
    echo "URL: $url"
    
    # 获取页面内容并检查关键元数据
    content=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")
    
    if [[ -z "$content" ]]; then
        echo -e "${RED}❌ 无法获取页面内容${NC}"
        return 1
    fi
    
    # 检查title标签
    title=$(echo "$content" | grep -i '<title>' | head -1 | sed 's/<[^>]*>//g' | xargs)
    if [[ -n "$title" ]]; then
        echo -e "${GREEN}✅ 标题: $title${NC}"
    else
        echo -e "${YELLOW}⚠️ 未找到title标签${NC}"
    fi
    
    # 检查description
    description=$(echo "$content" | grep -i 'name="description"' | head -1 | sed 's/.*content="\([^"]*\)".*/\1/')
    if [[ -n "$description" ]]; then
        echo -e "${GREEN}✅ 描述: $description${NC}"
    else
        echo -e "${YELLOW}⚠️ 未找到description标签${NC}"
    fi
    
    # 检查canonical URL
    canonical=$(echo "$content" | grep -i 'rel="canonical"' | head -1 | sed 's/.*href="\([^"]*\)".*/\1/')
    if [[ -n "$canonical" ]]; then
        echo -e "${GREEN}✅ Canonical: $canonical${NC}"
        if [[ "$canonical" == *"www.periodhub.health"* ]]; then
            echo -e "${GREEN}✅ Canonical URL使用正确的www格式${NC}"
        else
            echo -e "${RED}❌ Canonical URL格式不正确${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ 未找到canonical标签${NC}"
    fi
    
    return 0
}

# 开始验证
echo -e "${YELLOW}开始全面SEO修复验证...${NC}"

# 1. DNS配置检查
echo -e "\n${BLUE}=========================================="
echo "🌐 DNS配置检查"
echo "==========================================${NC}"

check_dns "periodhub.health" "A"
check_dns "www.periodhub.health" "CNAME"

# 2. 基础URL访问检查
echo -e "\n${BLUE}=========================================="
echo "🔗 基础URL访问检查"
echo "==========================================${NC}"

check_url "https://www.periodhub.health/" "主页访问 (www版本)" "200"

# 3. 重定向检查
echo -e "\n${BLUE}=========================================="
echo "🔄 重定向配置检查"
echo "==========================================${NC}"

check_url "https://periodhub.health/" "非www到www重定向" "301"

# 4. Sitemap和Robots检查
echo -e "\n${BLUE}=========================================="
echo "🗺️ Sitemap和Robots检查"
echo "==========================================${NC}"

check_url "https://www.periodhub.health/sitemap.xml" "Sitemap可访问性" "200"
check_url "https://www.periodhub.health/robots.txt" "Robots.txt可访问性" "200"

# 5. 元数据检查
echo -e "\n${BLUE}=========================================="
echo "🏷️ 页面元数据检查"
echo "==========================================${NC}"

check_metadata "https://www.periodhub.health/" "主页元数据"

# 6. 关键页面检查
echo -e "\n${BLUE}=========================================="
echo "📄 关键页面检查"
echo "==========================================${NC}"

check_url "https://www.periodhub.health/zh" "中文首页" "200"
check_url "https://www.periodhub.health/en" "英文首页" "200"

# 7. 内部链接检查建议
echo -e "\n${BLUE}=========================================="
echo "🔍 内部链接检查建议"
echo "==========================================${NC}"

echo -e "${YELLOW}建议运行以下命令检查硬编码的非www链接:${NC}"
echo "grep -r 'https://periodhub.health' . --include='*.tsx' --include='*.ts' --include='*.js' --exclude-dir=node_modules"
echo ""

# 8. 监控建议
echo -e "\n${BLUE}=========================================="
echo "📊 后续监控建议"
echo "==========================================${NC}"

echo -e "${YELLOW}重要监控点:${NC}"
echo "1. 第1周: 验证重定向正常工作，无4xx/5xx错误"
echo "2. 第2周: 检查Google Search Console中的索引变化"
echo "3. 第3-4周: 监控SEO分数恢复情况"
echo ""
echo -e "${YELLOW}手动检查工具:${NC}"
echo "• PageSpeed Insights: https://pagespeed.web.dev/analysis/https-www-periodhub-health/"
echo "• Google Search Console: https://search.google.com/search-console"
echo "• 手动提交sitemap: https://www.periodhub.health/sitemap.xml"
echo ""

# 总结
echo -e "\n${BLUE}=========================================="
echo "✅ 验证完成"
echo "==========================================${NC}"

echo -e "${GREEN}如果所有检查都通过，您的SEO修复配置已正确部署！${NC}"
echo -e "${YELLOW}请按照上述监控建议持续跟踪恢复情况。${NC}"

echo -e "\n${BLUE}部署命令:${NC}"
echo "git add vercel.json"
echo "git commit -m 'Add www redirect and security headers'"
echo "git push"
echo ""

echo -e "${GREEN}🎉 SEO修复验证脚本执行完成！${NC}"
