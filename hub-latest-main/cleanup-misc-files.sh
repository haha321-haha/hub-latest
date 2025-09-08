#!/bin/bash

# 清理GitHub仓库中的misc文件
echo "🧹 开始清理misc临时文件..."

# 删除所有misc-开头的文件
find . -name "misc-*.js" -delete
find . -name "misc-*.ts" -delete

# 提交更改
git add -A
git commit -m "🧹 Clean up VSCode recovery misc files

- Remove all misc-*.js and misc-*.ts temporary files
- These were generated during VSCode recovery process
- Clean up repository structure"

# 推送到远程仓库
git push origin main

echo "✅ 清理完成！misc文件已从仓库中删除"