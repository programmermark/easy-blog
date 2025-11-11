# 项目配置文件

## 环境变量配置

### 根目录 (.env)

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
PORT=8000
```

### 前端 (easy-blog-front/.env.local)

```bash
# 默认使用相同域名下的反向代理路径，如无 Nginx 代理可改成 http://localhost:8000
NEXT_PUBLIC_API_URL=/blog-service
NEXT_PUBLIC_UPLOAD_URL=/blog-service/upload
```

### 后台 (easy-blog-admin/.env.local)

```bash
# 根据部署环境调整为实际后端服务地址
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 后端 (easy-blog-service/.env)

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
PORT=8000
```

## 端口与访问路径

- 前端网站: http://localhost:3000/blog
- 后台管理: http://localhost:3000/blog-admin
- 后端 API: http://localhost:8000/blog-service
- API 文档: http://localhost:8000/blog-service/docs

## 开发命令

```bash
# 启动后端服务
cd easy-blog-service && pnpm run start:dev

# 启动前端网站
cd easy-blog-front && pnpm run dev

# 启动后台管理
cd easy-blog-admin && pnpm run dev
```

## 数据库操作

```bash
# 生成 Prisma 客户端
cd easy-blog-service && npx prisma generate

# 运行数据库迁移
cd easy-blog-service && npx prisma migrate dev

# 查看数据库
cd easy-blog-service && npx prisma studio

# 重置数据库
cd easy-blog-service && npx prisma migrate reset
```

## 部署配置

### 生产环境变量

```bash
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/easy_blog"

# API地址
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/blog-service
NEXT_PUBLIC_UPLOAD_URL=https://api.yourdomain.com/blog-service/upload

# JWT密钥（生产环境请使用强密钥）
JWT_SECRET="your-production-jwt-secret"
```
