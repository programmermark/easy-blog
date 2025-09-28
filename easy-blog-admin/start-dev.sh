#!/bin/bash

# 启动博客管理后台开发服务器
echo "🚀 启动博客管理后台..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录下运行此脚本"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
