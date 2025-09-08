#!/bin/bash

# 🚀 PDF响应式设计快速修复脚本
# 安全地为所有PDF HTML文件添加标准的移动端媒体查询

echo "🔧 Period Hub PDF响应式设计修复"
echo "================================="
echo ""

# 检查是否在正确目录
if [ ! -d "public/pdf-files" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 创建备份目录
BACKUP_DIR="public/pdf-files-backup-$(date +%Y%m%d_%H%M%S)"
echo "📦 创建备份目录: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 备份所有HTML文件
echo "💾 备份原始文件..."
cp public/pdf-files/*.html "$BACKUP_DIR/"
echo "✅ 备份完成: $(ls $BACKUP_DIR/*.html | wc -l) 个文件"
echo ""

# 定义标准的移动端CSS
MOBILE_CSS='
        /* 📱 移动端响应式优化 - 自动添加 */
        @media (max-width: 768px) {
            body {
                padding: 8px !important;
                font-size: 14px;
            }
            .container {
                padding: 12px !important;
                margin: 0 !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
            .section {
                margin-bottom: 20px !important;
            }
            table, .table-container {
                overflow-x: auto;
                display: block;
                white-space: nowrap;
            }
            .grid, .content-grid {
                grid-template-columns: 1fr !important;
                gap: 10px !important;
            }
        }
        
        @media (max-width: 480px) {
            body {
                padding: 4px !important;
                font-size: 13px;
            }
            .header h1 {
                font-size: 20px !important;
            }
            .header p {
                font-size: 12px !important;
            }
        }'

# 计数器
SUCCESS_COUNT=0
ERROR_COUNT=0
SKIP_COUNT=0

echo "🔧 开始修复PDF文件..."
echo ""

# 处理每个HTML文件
for file in public/pdf-files/*.html; do
    filename=$(basename "$file")
    
    # 检查是否已经有移动端媒体查询
    if grep -q "@media.*max-width" "$file"; then
        echo "⏭️  跳过 $filename (已有响应式设计)"
        ((SKIP_COUNT++))
        continue
    fi
    
    echo "🔧 修复 $filename..."
    
    # 在 </style> 之前插入移动端CSS
    if sed -i.tmp "s|</style>|$MOBILE_CSS</style>|g" "$file"; then
        # 删除临时文件
        rm -f "$file.tmp"
        echo "✅ $filename 修复完成"
        ((SUCCESS_COUNT++))
    else
        echo "❌ $filename 修复失败"
        ((ERROR_COUNT++))
    fi
done

echo ""
echo "📊 修复总结"
echo "==========="
echo "✅ 成功修复: $SUCCESS_COUNT 个文件"
echo "⏭️  已有响应式: $SKIP_COUNT 个文件"
echo "❌ 修复失败: $ERROR_COUNT 个文件"
echo "💾 备份位置: $BACKUP_DIR"
echo ""

if [ $ERROR_COUNT -eq 0 ]; then
    echo "🎉 所有文件修复成功！"
    echo ""
    echo "🧪 测试建议："
    echo "1. 在浏览器中打开几个PDF文件"
    echo "2. 使用开发者工具测试移动端视图"
    echo "3. 确认页面能正确自适应"
    echo ""
    echo "🔄 如需回滚："
    echo "   cp $BACKUP_DIR/*.html public/pdf-files/"
else
    echo "⚠️  有 $ERROR_COUNT 个文件修复失败，请检查备份"
fi

echo ""
echo "🚀 准备测试响应式效果..." 