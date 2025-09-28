#!/bin/bash

echo "🚀 启动 Easy Blog Service 开发环境..."

# 检查环境文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑配置数据库连接信息"
    echo "📝 示例: DATABASE_URL=\"postgresql://username:password@localhost:5432/easy_blog?schema=public\""
    exit 1
fi

# 检查数据库连接
echo "🔍 检查数据库连接..."
if ! npx prisma db pull > /dev/null 2>&1; then
    echo "❌ 无法连接到数据库，请检查 .env 文件中的 DATABASE_URL 配置"
    echo "💡 确保 PostgreSQL 服务正在运行"
    exit 1
fi

echo "✅ 数据库连接正常"

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npx prisma generate

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
npx prisma migrate dev --name init

# 初始化测试数据
echo "🌱 初始化测试数据..."
pnpm run db:seed

# 启动开发服务器
echo "🚀 启动开发服务器..."
pnpm run start:dev
