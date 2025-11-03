#!/bin/bash

# Easy Blog 部署脚本
# 使用方法: ./scripts/deploy.sh [environment]
# 环境: dev, staging, production

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/easy-blog"
BACKUP_DIR="/opt/backups/easy-blog"

echo "🚀 开始部署 Easy Blog ($ENVIRONMENT 环境)..."

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then
    echo "❌ 请不要使用 root 用户运行此脚本"
    exit 1
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
sudo mkdir -p $PROJECT_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $PROJECT_DIR/uploads
sudo mkdir -p $PROJECT_DIR/ssl
sudo mkdir -p $PROJECT_DIR/backups

# 设置目录权限
sudo chown -R $USER:$USER $PROJECT_DIR
sudo chown -R $USER:$USER $BACKUP_DIR

# 进入项目目录
cd $PROJECT_DIR

# 备份数据库（如果存在）
if [ -f "docker-compose.prod.yml" ]; then
    echo "💾 备份数据库..."
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres easy_blog > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 复制环境变量文件
if [ ! -f ".env" ]; then
    echo "📋 复制环境变量文件..."
    cp env.production.example .env
    echo "⚠️  请编辑 .env 文件配置正确的环境变量"
    echo "⚠️  特别是数据库密码、JWT密钥等敏感信息"
fi

# 拉取最新镜像
echo "🐳 拉取最新镜像..."
docker-compose -f docker-compose.prod.yml pull

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose -f docker-compose.prod.yml down

# 启动新容器
echo "🚀 启动新容器..."
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose -f docker-compose.prod.yml ps

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ 部署完成！"
echo "🌐 前端地址: http://your-domain.com"
echo "🔧 管理后台: http://your-domain.com/admin"
echo "📊 API 文档: http://your-domain.com/api/docs"
