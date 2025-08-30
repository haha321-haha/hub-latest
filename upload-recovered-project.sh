#!/bin/bash

# 上传恢复的项目到新的GitHub仓库
# 项目路径: /Users/duting/Downloads/money💰/recovered-from-vscode
# 目标仓库: https://github.com/haha321-haha/-periodhub-latest.git

set -e

PROJECT_PATH="/Users/duting/Downloads/money💰/recovered-from-vscode"
REPO_URL="https://github.com/haha321-haha/-periodhub-latest.git"

echo "开始上传恢复的项目到GitHub仓库..."

# 检查项目目录是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    echo "错误: 项目目录不存在: $PROJECT_PATH"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_PATH"

# 检查是否已经是git仓库
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
fi

# 添加远程仓库
echo "添加远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# 添加所有文件到暂存区
echo "添加文件到暂存区..."
git add .

# 提交更改
echo "提交更改..."
git commit -m "Initial commit: Upload recovered project from VSCode"

# 推送到远程仓库
echo "推送到远程仓库..."
git branch -M main
git push -u origin main --force

echo "✅ 项目已成功上传到GitHub仓库: $REPO_URL"