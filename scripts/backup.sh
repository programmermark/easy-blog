#!/bin/bash

# Easy Blog 数据库备份脚本
# 使用方法: ./scripts/backup.sh

set -e

PROJECT_DIR="/opt/easy-blog"
BACKUP_DIR="/opt/backups/easy-blog"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 开始备份数据库..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 进入项目目录
cd $PROJECT_DIR

# 备份数据库
echo "📊 备份 PostgreSQL 数据库..."
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres easy_blog > $BACKUP_DIR/postgres_backup_$DATE.sql

# 备份上传文件
echo "📁 备份上传文件..."
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C $PROJECT_DIR uploads/

# 备份 Redis 数据
echo "🔴 备份 Redis 数据..."
docker-compose -f docker-compose.prod.yml exec -T redis redis-cli BGSAVE
docker cp $(docker-compose -f docker-compose.prod.yml ps -q redis):/data/dump.rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# 清理旧备份（保留最近 7 天）
echo "🧹 清理旧备份..."
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete

echo "✅ 备份完成！"
echo "📁 备份文件位置: $BACKUP_DIR"
echo "📊 数据库备份: postgres_backup_$DATE.sql"
echo "📁 文件备份: uploads_backup_$DATE.tar.gz"
echo "🔴 Redis 备份: redis_backup_$DATE.rdb"
