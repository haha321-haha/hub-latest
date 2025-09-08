#!/bin/bash

# 🚀 Period Hub 生产部署包创建脚本
# 创建时间：2024年6月24日
# 用途：为GitHub上传和Vercel部署准备优化的项目包

echo "🚀 Period Hub - 创建生产部署包"
echo "================================="
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录中运行此脚本"
    exit 1
fi

# 获取项目信息
PROJECT_NAME=$(node -p "require('./package.json').name")
PROJECT_VERSION=$(node -p "require('./package.json').version")
DATE=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="periodhub-health-${DATE}"

echo "📦 项目信息："
echo "- 项目名称: ${PROJECT_NAME}"
echo "- 项目版本: ${PROJECT_VERSION}"
echo "- 包名称: ${PACKAGE_NAME}"
echo ""

# 创建临时目录
echo "🔧 步骤1：创建临时目录..."
TEMP_DIR="../${PACKAGE_NAME}"
mkdir -p "${TEMP_DIR}"

# 复制项目文件
echo "📋 步骤2：复制项目文件..."
rsync -av --progress . "${TEMP_DIR}/" \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='node_modules' \
    --exclude='dev.log' \
    --exclude='downloads_page.html' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db'

# 进入临时目录
cd "${TEMP_DIR}"

# 安装依赖
echo "📦 步骤3：安装生产依赖..."
npm ci --only=production

# 构建项目
echo "🔨 步骤4：构建项目..."
npm run build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
else
    echo "❌ 构建失败！"
    exit 1
fi

# 清理不必要的文件
echo "🧹 步骤5：清理不必要文件..."
rm -rf node_modules/.cache
rm -rf .next/cache
rm -rf *.log

# 创建压缩包
echo "📦 步骤6：创建压缩包..."
cd ..
tar -czf "${PACKAGE_NAME}.tar.gz" "${PACKAGE_NAME}/"

# 创建ZIP文件（用于Windows用户）
if command -v zip &> /dev/null; then
    echo "📦 步骤7：创建ZIP文件..."
    zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}/"
fi

# 生成文件清单
echo "📋 步骤8：生成文件清单..."
find "${PACKAGE_NAME}" -type f | sort > "${PACKAGE_NAME}-files.txt"

# 计算文件大小
TAR_SIZE=$(du -h "${PACKAGE_NAME}.tar.gz" | cut -f1)
if [ -f "${PACKAGE_NAME}.zip" ]; then
    ZIP_SIZE=$(du -h "${PACKAGE_NAME}.zip" | cut -f1)
fi

# 显示结果
echo ""
echo "🎉 部署包创建完成！"
echo "===================="
echo "📦 生成的文件："
echo "- 压缩包: ${PACKAGE_NAME}.tar.gz (${TAR_SIZE})"
if [ -f "${PACKAGE_NAME}.zip" ]; then
    echo "- ZIP文件: ${PACKAGE_NAME}.zip (${ZIP_SIZE})"
fi
echo "- 文件清单: ${PACKAGE_NAME}-files.txt"
echo ""

# 显示包含的内容
echo "📋 包含的内容："
echo "- ✅ 所有源代码文件"
echo "- ✅ 构建输出 (.next目录)"
echo "- ✅ 配置文件 (next.config.js, vercel.json等)"
echo "- ✅ PDF资源文件"
echo "- ✅ 翻译文件"
echo "- ✅ 公共资源 (images, pdfs等)"
echo "- ✅ 修复文档和指南"
echo ""

# 提供使用说明
echo "📖 使用说明："
echo "1. 上传到GitHub："
echo "   - 解压文件"
echo "   - 创建新仓库"
echo "   - 上传所有文件"
echo ""
echo "2. 部署到Vercel："
echo "   - 从GitHub导入仓库"
echo "   - 使用默认设置"
echo "   - 自动部署"
echo ""
echo "3. 本地测试："
echo "   - cd ${PACKAGE_NAME}"
echo "   - npm install"
echo "   - npm run dev"
echo ""

# 验证关键文件
echo "🔍 验证关键文件："
CRITICAL_FILES=(
    "${PACKAGE_NAME}/package.json"
    "${PACKAGE_NAME}/next.config.js"
    "${PACKAGE_NAME}/vercel.json"
    "${PACKAGE_NAME}/components/SimplePDFCenter.tsx"
    "${PACKAGE_NAME}/components/pdf-id-mapping.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (缺失)"
    fi
done

echo ""
echo "🎯 下一步："
echo "1. 将生成的压缩包上传到GitHub"
echo "2. 在Vercel中导入并部署"
echo "3. 验证所有功能正常"
echo "4. 开始企业级重构"
echo ""
echo "✅ 部署包准备完成！" 