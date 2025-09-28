# Easy Blog - 个人博客系统

一个基于 Next.js + NestJS + Prisma 的全栈个人博客系统，包含前端展示、后台管理和后端服务。

## 🏗️ 项目结构

```
easy-blog/
├── easy-blog-front/     # 前端展示网站 (Next.js)
├── easy-blog-admin/     # 后台管理系统 (Next.js)
├── easy-blog-service/   # 后端API服务 (NestJS + Prisma)
└── package.json         # 根目录包管理
```

## 🚀 技术栈

### 前端 (easy-blog-front)

- **框架**: Next.js 14.2.33
- **UI 库**: Ant Design
- **样式**: Tailwind CSS
- **状态管理**: TanStack Query
- **类型检查**: TypeScript

### 后台 (easy-blog-admin)

- **框架**: Next.js
- **UI 库**: Ant Design
- **样式**: Tailwind CSS
- **类型检查**: TypeScript

### 后端 (easy-blog-service)

- **框架**: NestJS
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **认证**: JWT + Cookie
- **文件上传**: Multer
- **API 文档**: Swagger

## 📦 安装和运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd easy-blog
```

### 2. 安装依赖

```bash
# 安装根目录依赖
pnpm install

# 安装各子项目依赖
cd easy-blog-front && pnpm install
cd ../easy-blog-admin && pnpm install
cd ../easy-blog-service && pnpm install
```

### 3. 环境配置

#### 后端服务 (easy-blog-service)

```bash
cd easy-blog-service
# 复制环境变量文件
cp .env.example .env

# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 启动开发服务器
pnpm run start:dev
```

#### 前端网站 (easy-blog-front)

```bash
cd easy-blog-front
# 创建环境变量文件
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8000/upload" > .env.local

# 启动开发服务器
pnpm run dev
```

#### 后台管理 (easy-blog-admin)

```bash
cd easy-blog-admin
# 创建环境变量文件
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# 启动开发服务器
pnpm run dev
```

## 🎯 功能特性

### 前端网站

- ✅ 响应式设计，支持移动端
- ✅ 文章列表和详情页
- ✅ 评论系统（支持访客评论）
- ✅ 点赞功能
- ✅ 个人作品集展示
- ✅ 工具页面（封面设计器）
- ✅ 关于我页面
- ✅ 简历页面

### 后台管理

- ✅ 用户认证和授权
- ✅ 文章管理（CRUD）
- ✅ 分类和标签管理
- ✅ 评论管理
- ✅ 文件上传管理
- ✅ 个人资料管理

### 后端服务

- ✅ RESTful API
- ✅ JWT 认证
- ✅ 文件上传
- ✅ 数据库操作
- ✅ 访客评论系统
- ✅ 多级评论回复
- ✅ API 文档

## 🛠️ 开发工具

### 工具页面

- **封面设计器**: 支持自定义标题、配图和下载功能
- **图片上传**: 支持手动上传和链接输入
- **实时预览**: 所见即所得的封面预览

### 评论系统

- **访客评论**: 无需注册即可评论
- **多级回复**: 支持无限级评论回复
- **头像上传**: 访客可上传自定义头像
- **本地存储**: 访客信息本地持久化

## 📱 页面路由

### 前端网站 (http://localhost:9000)

- `/` - 首页
- `/post/[id]` - 文章详情
- `/about` - 关于我
- `/production` - 作品集
- `/tools` - 工具页面
- `/tools/cover-designer` - 封面设计器
- `/resume` - 简历

### 后台管理 (http://localhost:3000)

- `/admin` - 管理首页
- `/admin/posts` - 文章管理
- `/admin/categories` - 分类管理
- `/admin/tags` - 标签管理
- `/admin/profile` - 个人资料

### 后端 API (http://localhost:8000)

- `/api/posts` - 文章相关 API
- `/api/categories` - 分类相关 API
- `/api/tags` - 标签相关 API
- `/api/comments` - 评论相关 API
- `/api/visitor` - 访客相关 API
- `/upload` - 文件上传 API
- `/api-docs` - API 文档

## 🗄️ 数据库结构

主要数据表：

- `User` - 用户表
- `Post` - 文章表
- `Category` - 分类表
- `Tag` - 标签表
- `Comment` - 评论表
- `Visitor` - 访客表
- `Like` - 点赞表

## 🚀 部署

### 生产环境配置

```bash
# 后端
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/easy_blog

# 前端
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_UPLOAD_URL=https://api.yourdomain.com/upload
```

### Docker 部署

```bash
# 构建镜像
docker build -t easy-blog-service ./easy-blog-service
docker build -t easy-blog-front ./easy-blog-front

# 运行容器
docker-compose up -d
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- 作者：爱编程的 Mark
- 网站：https://yourdomain.com
- 邮箱：your-email@example.com
