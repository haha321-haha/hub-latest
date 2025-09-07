#!/bin/bash

# 清理端口3001上的进程
echo "🧹 清理端口3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "端口3001已空闲"

# 等待2秒确保端口完全释放
sleep 2

# 启动开发服务器
echo "🚀 启动开发服务器..."
npm run dev
