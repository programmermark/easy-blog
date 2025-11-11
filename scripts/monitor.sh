#!/bin/bash

# Easy Blog 监控脚本
# 使用方法: ./scripts/monitor.sh

set -e

PROJECT_DIR="/opt/easy-blog"
LOG_FILE="/var/log/easy-blog-monitor.log"

echo "🔍 开始监控 Easy Blog 服务状态..."

# 进入项目目录
cd $PROJECT_DIR

# 检查 Docker 服务状态
check_docker_services() {
    echo "🐳 检查 Docker 服务状态..."
    
    # 检查容器是否运行
    if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        echo "❌ 有容器未正常运行"
        docker-compose -f docker-compose.prod.yml ps
        return 1
    fi
    
    echo "✅ 所有容器运行正常"
}

# 检查服务健康状态
check_service_health() {
    echo "🏥 检查服务健康状态..."
    
    # 检查后端 API
    if curl -f -s http://localhost/blog-service/health > /dev/null; then
        echo "✅ 后端 API 健康"
    else
        echo "❌ 后端 API 不健康"
        return 1
    fi
    
    # 检查前端
    if curl -f -s http://localhost/blog/ > /dev/null; then
        echo "✅ 前端服务健康"
    else
        echo "❌ 前端服务不健康"
        return 1
    fi
    
    # 检查管理后台
    if curl -f -s http://localhost/blog-admin/ > /dev/null; then
        echo "✅ 管理后台健康"
    else
        echo "❌ 管理后台不健康"
        return 1
    fi
}

# 检查磁盘空间
check_disk_space() {
    echo "💾 检查磁盘空间..."
    
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $DISK_USAGE -gt 80 ]; then
        echo "⚠️  磁盘使用率过高: ${DISK_USAGE}%"
        return 1
    else
        echo "✅ 磁盘使用率正常: ${DISK_USAGE}%"
    fi
}

# 检查内存使用
check_memory_usage() {
    echo "🧠 检查内存使用..."
    
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ $MEMORY_USAGE -gt 90 ]; then
        echo "⚠️  内存使用率过高: ${MEMORY_USAGE}%"
        return 1
    else
        echo "✅ 内存使用率正常: ${MEMORY_USAGE}%"
    fi
}

# 检查日志错误
check_logs() {
    echo "📋 检查应用日志..."
    
    # 检查后端错误日志
    ERROR_COUNT=$(docker-compose -f docker-compose.prod.yml logs backend 2>&1 | grep -i error | wc -l)
    
    if [ $ERROR_COUNT -gt 10 ]; then
        echo "⚠️  后端错误日志过多: $ERROR_COUNT 条"
        return 1
    else
        echo "✅ 后端日志正常"
    fi
}

# 主监控流程
main() {
    echo "$(date): 开始监控检查" >> $LOG_FILE
    
    if check_docker_services && check_service_health && check_disk_space && check_memory_usage && check_logs; then
        echo "✅ 所有检查通过"
        echo "$(date): 监控检查通过" >> $LOG_FILE
    else
        echo "❌ 发现问题，请检查日志"
        echo "$(date): 监控检查失败" >> $LOG_FILE
        
        # 发送告警（可以集成邮件、钉钉等）
        # send_alert "Easy Blog 服务异常"
    fi
}

# 运行监控
main
