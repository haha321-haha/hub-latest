#!/bin/bash

# Vercel部署脚本 - 修复routes-manifest.json错误
echo "🚀 开始部署到Vercel..."

# 清理之前的构建
echo "🧹 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查关键文件是否存在
echo "✅ 检查构建文件..."
if [ -f ".next/routes-manifest.json" ]; then
    echo "✅ routes-manifest.json 存在"
else
    echo "❌ routes-manifest.json 缺失"
    exit 1
fi

if [ -f ".next/build-manifest.json" ]; then
    echo "✅ build-manifest.json 存在"
else
    echo "❌ build-manifest.json 缺失"
    exit 1
fi

# 部署到Vercel
echo "🚀 部署到Vercel..."
npx vercel --prod

echo "✅ 部署完成！"




