#!/bin/bash

# VS Code历史文件恢复脚本
RECOVERY_DIR="/Users/duting/Downloads/money💰/recovered-from-vscode"
HISTORY_DIR="$HOME/Library/Application Support/Code/User/History"

echo "🔄 开始从VS Code历史中恢复文件..."
echo "恢复目录: $RECOVERY_DIR"

# 创建恢复目录结构
mkdir -p "$RECOVERY_DIR"/{components,lib,app,types,utils,config,tests}

# 计数器
count=0

# 查找今天修改的文件
find "$HISTORY_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -newermt "2025-08-30 09:00" | while read file; do
    if [ -f "$file" ]; then
        # 获取文件名和扩展名
        filename=$(basename "$file")
        extension="${filename##*.}"
        
        # 根据内容判断文件类型并分类
        if grep -q "tailwind" "$file" 2>/dev/null; then
            cp "$file" "$RECOVERY_DIR/config/tailwind-$filename"
        elif grep -q "component\|Component\|jsx\|tsx" "$file" 2>/dev/null; then
            cp "$file" "$RECOVERY_DIR/components/component-$filename"
        elif grep -q "PDF\|pdf" "$file" 2>/dev/null; then
            cp "$file" "$RECOVERY_DIR/lib/pdf-$filename"
        elif grep -q "test\|Test" "$file" 2>/dev/null; then
            cp "$file" "$RECOVERY_DIR/tests/test-$filename"
        elif grep -q "type\|interface" "$file" 2>/dev/null; then
            cp "$file" "$RECOVERY_DIR/types/types-$filename"
        else
            cp "$file" "$RECOVERY_DIR/misc-$filename"
        fi
        
        count=$((count + 1))
        echo "✅ 已恢复: $filename"
    fi
done

echo "🎉 恢复完成！共恢复 $count 个文件"
echo "📁 文件位置: $RECOVERY_DIR"