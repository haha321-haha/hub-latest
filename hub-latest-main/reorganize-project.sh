#!/bin/bash

# 项目重组脚本 - 将恢复的文件重新组织成完整的Next.js项目结构
RECOVERED_DIR="/Users/duting/Downloads/money💰/recovered-from-vscode"
NEW_PROJECT_DIR="/Users/duting/Downloads/money💰/restored-project"

echo "🏗️ 开始重新组织项目结构..."
echo "源目录: $RECOVERED_DIR"
echo "目标目录: $NEW_PROJECT_DIR"

# 创建标准的Next.js项目结构
mkdir -p "$NEW_PROJECT_DIR"/{app,components,lib,types,utils,config,public,styles,tests,scripts}
mkdir -p "$NEW_PROJECT_DIR"/app/{api,\[locale\]}
mkdir -p "$NEW_PROJECT_DIR"/components/{ui,forms,layout}
mkdir -p "$NEW_PROJECT_DIR"/lib/{pdf,analytics,seo,utils}
mkdir -p "$NEW_PROJECT_DIR"/types/{api,components}

echo "📁 创建项目目录结构完成"

# 复制并重命名文件的函数
copy_and_rename() {
    local source_file="$1"
    local target_file="$2"
    local description="$3"
    
    if [ -f "$source_file" ]; then
        cp "$source_file" "$target_file"
        echo "✅ $description: $(basename "$target_file")"
        return 0
    else
        echo "⚠️  未找到: $description"
        return 1
    fi
}

# 分析文件内容并智能分类
analyze_and_copy() {
    local file="$1"
    local filename=$(basename "$file")
    
    # 读取文件前几行来判断类型
    local content=$(head -10 "$file" 2>/dev/null)
    
    # 根据内容特征分类
    if echo "$content" | grep -q "tailwind\|Config"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/tailwind.config.js" "Tailwind配置"
    elif echo "$content" | grep -q "PDF.*download\|pdf.*util"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/lib/pdf/$(echo $filename | sed 's/.*-//'))" "PDF工具函数"
    elif echo "$content" | grep -q "Component\|jsx\|tsx.*component"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/components/$(echo $filename | sed 's/.*-//')" "React组件"
    elif echo "$content" | grep -q "interface\|type.*=\|export.*type"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/types/$(echo $filename | sed 's/.*-//')" "类型定义"
    elif echo "$content" | grep -q "test\|describe\|expect"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/tests/$(echo $filename | sed 's/.*-//')" "测试文件"
    elif echo "$content" | grep -q "export.*function\|util\|helper"; then
        copy_and_rename "$file" "$NEW_PROJECT_DIR/lib/utils/$(echo $filename | sed 's/.*-//')" "工具函数"
    else
        # 默认放到lib目录
        copy_and_rename "$file" "$NEW_PROJECT_DIR/lib/$(echo $filename | sed 's/.*-//')" "通用库文件"
    fi
}

echo "🔄 开始智能分类和复制文件..."

# 处理已分类的文件夹
if [ -d "$RECOVERED_DIR/components" ]; then
    echo "📦 处理组件文件..."
    for file in "$RECOVERED_DIR/components"/*; do
        if [ -f "$file" ]; then
            analyze_and_copy "$file"
        fi
    done
fi

if [ -d "$RECOVERED_DIR/lib" ]; then
    echo "📚 处理库文件..."
    for file in "$RECOVERED_DIR/lib"/*; do
        if [ -f "$file" ]; then
            analyze_and_copy "$file"
        fi
    done
fi

if [ -d "$RECOVERED_DIR/types" ]; then
    echo "🏷️  处理类型文件..."
    for file in "$RECOVERED_DIR/types"/*; do
        if [ -f "$file" ]; then
            analyze_and_copy "$file"
        fi
    done
fi

if [ -d "$RECOVERED_DIR/tests" ]; then
    echo "🧪 处理测试文件..."
    for file in "$RECOVERED_DIR/tests"/*; do
        if [ -f "$file" ]; then
            analyze_and_copy "$file"
        fi
    done
fi

if [ -d "$RECOVERED_DIR/config" ]; then
    echo "⚙️  处理配置文件..."
    for file in "$RECOVERED_DIR/config"/*; do
        if [ -f "$file" ]; then
            analyze_and_copy "$file"
        fi
    done
fi

# 处理根目录的重要文件
echo "📄 处理根目录文件..."
if [ -f "$RECOVERED_DIR/tailwind.config.js" ]; then
    copy_and_rename "$RECOVERED_DIR/tailwind.config.js" "$NEW_PROJECT_DIR/tailwind.config.js" "Tailwind配置"
fi

if [ -f "$RECOVERED_DIR/pdf-utils.ts" ]; then
    copy_and_rename "$RECOVERED_DIR/pdf-utils.ts" "$NEW_PROJECT_DIR/lib/pdf/utils.ts" "PDF工具函数"
fi

# 处理misc文件（根据内容智能分类）
echo "🗂️  处理杂项文件..."
for file in "$RECOVERED_DIR"/misc-*; do
    if [ -f "$file" ]; then
        analyze_and_copy "$file"
    fi
done

# 创建基础的package.json（如果不存在）
if [ ! -f "$NEW_PROJECT_DIR/package.json" ]; then
    cat > "$NEW_PROJECT_DIR/package.json" << 'EOF'
{
  "name": "period-hub-restored",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.31",
    "react": "^18",
    "react-dom": "^18",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "@types/jest": "^29",
    "jest": "^29"
  }
}
EOF
    echo "✅ 创建基础package.json"
fi

# 创建基础的tsconfig.json（如果不存在）
if [ ! -f "$NEW_PROJECT_DIR/tsconfig.json" ]; then
    cat > "$NEW_PROJECT_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    echo "✅ 创建基础tsconfig.json"
fi

# 创建README.md
cat > "$NEW_PROJECT_DIR/README.md" << 'EOF'
# Period Hub - 恢复版本

这是从VS Code历史记录中恢复的Period Hub项目。

## 恢复信息
- 恢复时间: $(date)
- 恢复来源: VS Code本地历史
- 原因: Git覆盖事故恢复

## 项目结构
- `app/` - Next.js 13+ App Router
- `components/` - React组件
- `lib/` - 工具库和业务逻辑
- `types/` - TypeScript类型定义
- `public/` - 静态资源
- `styles/` - 样式文件

## 开发命令
```bash
npm install
npm run dev
```

## 注意事项
1. 请检查所有依赖是否完整
2. 验证PDF下载功能
3. 测试多语言支持
4. 检查Vercel部署配置
EOF

echo "📝 创建README.md"

# 统计恢复的文件
total_files=$(find "$NEW_PROJECT_DIR" -type f | wc -l)
echo ""
echo "🎉 项目重组完成！"
echo "📊 统计信息:"
echo "   - 总文件数: $total_files"
echo "   - 项目位置: $NEW_PROJECT_DIR"
echo ""
echo "🚀 下一步:"
echo "   1. cd \"$NEW_PROJECT_DIR\""
echo "   2. npm install"
echo "   3. npm run dev"
echo ""
echo "💡 建议:"
echo "   - 检查package.json中的依赖"
echo "   - 验证所有导入路径"
echo "   - 测试关键功能"