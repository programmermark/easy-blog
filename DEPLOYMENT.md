# Easy Blog 部署指南

## 📋 目录

- [服务器准备](#服务器准备)
- [环境配置](#环境配置)
- [数据库迁移](#数据库迁移)
- [部署步骤](#部署步骤)
- [CI/CD 配置](#cicd-配置)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 🖥️ 服务器准备

### 1. 服务器要求

**最低配置：**

- CPU: 2 核
- 内存: 4GB
- 存储: 40GB SSD
- 带宽: 5Mbps

**推荐配置：**

- CPU: 4 核
- 内存: 8GB
- 存储: 100GB SSD
- 带宽: 10Mbps

### 2. 系统环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y curl wget git vim htop

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 安装 Nginx（可选，如果不用 Docker 中的 Nginx）
sudo apt install -y nginx

# 安装 Certbot（用于 SSL 证书）
sudo apt install -y certbot python3-certbot-nginx
```

## ⚙️ 环境配置

### 1. 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /opt/easy-blog
sudo chown $USER:$USER /opt/easy-blog

# 克隆代码
cd /opt/easy-blog
git clone https://github.com/your-username/easy-blog.git .
```

### 2. 配置环境变量

```bash
# 复制环境变量文件
cp env.production.example .env

# 编辑环境变量
vim .env
```

**重要配置项：**

```bash
# 数据库配置
POSTGRES_PASSWORD=your_strong_password_here
DATABASE_URL=postgresql://postgres:your_strong_password_here@postgres:5432/easy_blog?schema=public

# JWT 配置（必须修改）
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# API 地址配置
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 3. 配置域名和 SSL

```bash
# 修改 Nginx 配置中的域名
vim nginx/conf.d/easy-blog.conf

# 获取 SSL 证书
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

## 🗄️ 数据库迁移

### 1. 从 SQLite 迁移到 PostgreSQL

```bash
# 进入后端目录
cd easy-blog-service

# 安装依赖
pnpm install

# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 如果需要导入现有数据，可以使用 Prisma 的数据迁移工具
```

### 2. 数据备份和恢复

```bash
# 备份现有 SQLite 数据
sqlite3 prisma/dev.db ".dump" > backup.sql

# 在 PostgreSQL 中恢复数据（需要手动转换）
# 建议使用 Prisma 的数据迁移工具或编写迁移脚本
```

## 🚀 部署步骤

### 1. 手动部署

```bash
# 进入项目目录
cd /opt/easy-blog

# 运行部署脚本
./scripts/deploy.sh production
```

### 2. 验证部署

```bash
# 检查容器状态
docker-compose -f docker-compose.prod.yml ps

# 检查服务健康状态
./scripts/monitor.sh

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. 设置定时任务

```bash
# 设置定时备份和监控
./scripts/setup-cron.sh
```

## 🔄 CI/CD 配置

### 1. GitHub Actions 配置

1. 在 GitHub 仓库中添加以下 Secrets：

   - `HOST`: 服务器 IP 地址
   - `USERNAME`: 服务器用户名
   - `SSH_KEY`: 服务器 SSH 私钥

2. 推送代码到 main 分支即可自动部署

### 2. 手动触发部署

```bash
# 在服务器上手动拉取和部署
cd /opt/easy-blog
git pull origin main
./scripts/deploy.sh production
```

## 📊 监控和维护

### 1. 监控脚本

```bash
# 手动运行监控
./scripts/monitor.sh

# 查看监控日志
tail -f /var/log/easy-blog-monitor.log
```

### 2. 备份脚本

```bash
# 手动备份
./scripts/backup.sh

# 查看备份文件
ls -la /opt/backups/easy-blog/
```

### 3. 日志管理

```bash
# 查看应用日志
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f admin

# 查看 Nginx 日志
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## 🔧 故障排除

### 1. 常见问题

**容器无法启动：**

```bash
# 检查日志
docker-compose -f docker-compose.prod.yml logs

# 检查环境变量
docker-compose -f docker-compose.prod.yml config
```

**数据库连接失败：**

```bash
# 检查数据库容器
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d easy_blog

# 检查网络连接
docker network ls
docker network inspect easy-blog_easy-blog-network
```

**SSL 证书问题：**

```bash
# 检查证书文件
ls -la ssl/

# 测试 SSL 配置
openssl s_client -connect your-domain.com:443
```

### 2. 性能优化

**数据库优化：**

```bash
# 进入数据库容器
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d easy_blog

# 创建索引
CREATE INDEX CONCURRENTLY idx_posts_status_published ON posts(status, published_at);
CREATE INDEX CONCURRENTLY idx_comments_post_id ON comments(post_id);
```

**Nginx 优化：**

```bash
# 编辑 Nginx 配置
vim nginx/conf.d/easy-blog.conf

# 添加缓存配置
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 安全加固

**防火墙配置：**

```bash
# 安装 UFW
sudo apt install -y ufw

# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**定期更新：**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新 Docker 镜像
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 技术支持

如果遇到问题，请：

1. 查看日志文件
2. 检查服务状态
3. 参考故障排除部分
4. 提交 Issue 到 GitHub 仓库

---

**部署完成后，你的博客将可以通过以下地址访问：**

- 前端：https://your-domain.com
- 管理后台：https://your-domain.com/admin
- API 文档：https://your-domain.com/api/docs
