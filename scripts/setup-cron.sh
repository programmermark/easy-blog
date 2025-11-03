#!/bin/bash

# 设置 Easy Blog 定时任务
# 使用方法: ./scripts/setup-cron.sh

set -e

PROJECT_DIR="/opt/easy-blog"
SCRIPT_DIR="$PROJECT_DIR/scripts"

echo "⏰ 设置定时任务..."

# 创建 crontab 文件
cat > /tmp/easy-blog-cron << EOF
# Easy Blog 定时任务

# 每天凌晨 2 点备份数据库
0 2 * * * $SCRIPT_DIR/backup.sh >> /var/log/easy-blog-backup.log 2>&1

# 每 5 分钟检查服务状态
*/5 * * * * $SCRIPT_DIR/monitor.sh >> /var/log/easy-blog-monitor.log 2>&1

# 每周日凌晨 3 点清理 Docker 系统
0 3 * * 0 docker system prune -f >> /var/log/easy-blog-cleanup.log 2>&1

# 每天凌晨 4 点重启服务（可选，根据需要启用）
# 0 4 * * * cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml restart >> /var/log/easy-blog-restart.log 2>&1
EOF

# 安装 crontab
crontab /tmp/easy-blog-cron

# 清理临时文件
rm /tmp/easy-blog-cron

echo "✅ 定时任务设置完成！"
echo "📋 当前定时任务："
crontab -l
