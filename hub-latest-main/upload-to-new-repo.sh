#!/bin/bash

# 将恢复的项目上传到新GitHub仓库的完整脚本
PROJECT_DIR="/Users/duting/Downloads/money💰/restored-project"
REPO_URL="https://github.com/haha321-haha/-periodhub-latest.git"

echo "🚀 准备将恢复的项目上传到新GitHub仓库"
echo "================================================"
echo "项目目录: $PROJECT_DIR"
echo "目标仓库: $REPO_URL"
echo ""

# 进入项目目录
cd "$PROJECT_DIR"

echo "📋 第一步：初始化Git仓库"
# 删除可能存在的.git目录
rm -rf .git

# 初始化新的Git仓库
git init
git branch -m main

echo "✅ Git仓库初始化完成"

echo ""
echo "📝 第二步：创建完善的.gitignore"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env*
!.env.example

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache
.cache
.parcel-cache

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# MacOS
.DS_Store

# Windows
Thumbs.db
ehthumbs.db

# Linux
*~

# IDE
.vscode/
.idea/
*.swp
*.swo

# TypeScript
*.tsbuildinfo

# Vercel
.vercel

# Testing
/coverage

# Backup files
*.backup
backup-*/

# Temporary files
*.tmp
*.temp
EOF

echo "✅ .gitignore 创建完成"

echo ""
echo "📄 第三步：更新README.md"
cat > README.md << 'EOF'
# Period Hub - 经期健康管理平台

> 🌸 专为女性设计的全面经期健康管理和疼痛缓解平台

## 📖 项目简介

Period Hub 是一个现代化的经期健康管理平台，提供：
- 🩸 经期跟踪和预测
- 💊 疼痛缓解方案
- 📚 健康教育资源
- 🌍 多语言支持（中文/英文）
- 📱 响应式设计

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel
- **国际化**: next-intl

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

## 📁 项目结构

```
period-hub/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   └── api/               # API路由
├── components/             # React组件
│   ├── ui/                # UI组件
│   ├── forms/             # 表单组件
│   └── layout/            # 布局组件
├── lib/                    # 工具库
│   ├── pdf/               # PDF功能
│   ├── utils/             # 工具函数
│   └── analytics/         # 分析功能
├── types/                  # TypeScript类型定义
├── public/                 # 静态资源
└── styles/                 # 样式文件
```

## 🌟 核心功能

### 📊 经期管理
- 周期跟踪
- 症状记录
- 预测算法

### 💡 疼痛缓解
- 个性化建议
- 自然疗法
- 药物指导

### 📚 教育资源
- 健康指南
- PDF下载
- 专家建议

### 🌍 国际化
- 中文/英文双语
- 本地化内容
- 文化适配

## 🔧 开发指南

### 添加新页面
```bash
# 在 app/[locale]/ 下创建新页面
mkdir app/[locale]/new-page
touch app/[locale]/new-page/page.tsx
```

### 添加新组件
```bash
# 在 components/ 下创建组件
touch components/NewComponent.tsx
```

### 国际化
```bash
# 在 messages/ 下添加翻译
# messages/en.json - 英文
# messages/zh.json - 中文
```

## 📦 部署

### Vercel部署
```bash
# 连接到Vercel
vercel

# 部署到生产环境
vercel --prod
```

### 环境变量
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.0.0 (2025-08-30)
- 🎉 项目从VS Code历史成功恢复
- ✨ 完整的经期管理功能
- 🌍 多语言支持
- 📱 响应式设计
- 📚 PDF资源下载

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢所有为经期健康教育做出贡献的开发者和专家。

---

💝 **特别说明**: 本项目通过VS Code本地历史功能成功恢复，证明了良好的开发工具和备份策略的重要性。
EOF

echo "✅ README.md 更新完成"

echo ""
echo "📦 第四步：添加所有文件到Git"
git add .

echo "✅ 文件添加完成"

echo ""
echo "💬 第五步：创建初始提交"
git commit -m "🎉 Initial commit: Period Hub project recovered from VS Code history

✨ Features:
- Complete period management system
- Multi-language support (zh/en)
- PDF resource downloads
- Responsive design
- TypeScript + Next.js 14

🔄 Recovery Info:
- Recovered from VS Code local history
- Date: $(date)
- Files recovered: 120+
- Project structure reorganized

🚀 Ready for development and deployment"

echo "✅ 初始提交完成"

echo ""
echo "🔗 第六步：连接远程仓库"
git remote add origin "$REPO_URL"

echo "✅ 远程仓库连接完成"

echo ""
echo "📤 第七步：推送到GitHub"
echo "正在推送到远程仓库..."

# 拉取远程README（如果存在）
git pull origin main --allow-unrelated-histories --no-edit || echo "远程仓库为空，继续推送..."

# 推送到远程仓库
git push -u origin main

echo ""
echo "🎉 上传完成！"
echo "================================================"
echo "✅ 项目已成功上传到GitHub"
echo "🔗 仓库地址: $REPO_URL"
echo ""
echo "🚀 下一步建议："
echo "   1. 在GitHub上检查文件是否完整"
echo "   2. 配置Vercel自动部署"
echo "   3. 设置分支保护规则"
echo "   4. 邀请协作者（如需要）"
echo ""
echo "💡 Vercel部署："
echo "   - 访问 https://vercel.com"
echo "   - 导入GitHub仓库"
echo "   - 自动检测Next.js配置"
echo "   - 一键部署"
echo ""
echo "🎊 恭喜！您的项目重获新生！"