#!/bin/bash

# 🔧 内部链接修复脚本
# 将所有硬编码的 https://periodhub.health 替换为 https://www.periodhub.health

set -e

echo "🔧 开始修复内部链接..."
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 统计变量
total_files=0
fixed_files=0
total_replacements=0

# 需要修复的文件类型
file_patterns=("*.tsx" "*.ts" "*.js" "*.json")

# 排除的目录
exclude_dirs=("node_modules" ".next" "recovery-workspace" "hub-latest-main" "backup")

# 创建排除目录的grep参数
exclude_grep=""
for dir in "${exclude_dirs[@]}"; do
    exclude_grep="$exclude_grep --exclude-dir=$dir"
done

echo -e "${BLUE}🔍 扫描需要修复的文件...${NC}"

# 查找所有包含非www链接的文件
files_to_fix=$(grep -r "https://periodhub.health" . --include="*.tsx" --include="*.ts" --include="*.js" --include="*.json" $exclude_grep -l)

if [ -z "$files_to_fix" ]; then
    echo -e "${GREEN}✅ 没有找到需要修复的文件${NC}"
    exit 0
fi

echo -e "${YELLOW}找到以下文件需要修复:${NC}"
echo "$files_to_fix"
echo ""

# 处理每个文件
for file in $files_to_fix; do
    echo -e "${BLUE}🔧 修复文件: $file${NC}"
    
    # 备份原文件
    cp "$file" "$file.backup"
    
    # 执行替换
    sed -i.tmp 's|https://periodhub\.health|https://www.periodhub.health|g' "$file"
    
    # 删除临时文件
    rm -f "$file.tmp"
    
    # 统计替换次数
    replacements=$(grep -c "https://www.periodhub.health" "$file" || echo "0")
    total_replacements=$((total_replacements + replacements))
    
    echo -e "${GREEN}✅ 完成 - 替换了 $replacements 个链接${NC}"
    fixed_files=$((fixed_files + 1))
    total_files=$((total_files + 1))
done

echo ""
echo -e "${BLUE}=========================================="
echo "📊 修复完成统计"
echo "==========================================${NC}"

echo -e "${GREEN}✅ 处理文件数: $total_files${NC}"
echo -e "${GREEN}✅ 成功修复文件数: $fixed_files${NC}"
echo -e "${GREEN}✅ 总替换次数: $total_replacements${NC}"

echo ""
echo -e "${YELLOW}⚠️ 重要提醒:${NC}"
echo "1. 原文件已备份为 .backup 文件"
echo "2. 请检查修复结果是否正确"
echo "3. 建议运行验证脚本确认修复效果"
echo "4. 确认无误后可删除 .backup 文件"

echo ""
echo -e "${BLUE}🔍 验证修复结果:${NC}"
echo "运行以下命令验证修复效果:"
echo "grep -r 'https://periodhub.health' . --include='*.tsx' --include='*.ts' --include='*.js' --exclude-dir=node_modules --exclude-dir=.next"

echo ""
echo -e "${GREEN}🎉 内部链接修复完成！${NC}"
