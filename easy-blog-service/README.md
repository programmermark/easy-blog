<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Easy Blog Service

基于 NestJS + Prisma 的博客系统后端服务

## 技术栈

- **框架**: NestJS v10
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + Passport
- **验证**: class-validator + class-transformer
- **文档**: Swagger/OpenAPI
- **缓存**: Redis (计划中)
- **任务队列**: BullMQ (计划中)

## 功能特性

- 用户管理 (注册、登录、角色管理)
- 文章管理 (CRUD、草稿/发布、分类标签)
- 评论系统 (嵌套回复、审核)
- 点赞收藏
- 搜索功能
- 权限控制 (RBAC)

## 项目结构

```
src/
├── common/           # 通用 DTO、拦截器、管道等
├── config/           # 配置管理
├── modules/          # 功能模块
│   ├── auth/         # 认证模块
│   ├── user/         # 用户模块
│   ├── post/         # 文章模块
│   ├── category/     # 分类模块 (计划中)
│   ├── tag/          # 标签模块 (计划中)
│   ├── comment/      # 评论模块 (计划中)
│   └── admin/        # 管理后台 (计划中)
├── prisma/           # Prisma 服务
└── main.ts           # 应用入口
```

## 快速开始

### 1. 环境要求

- Node.js 18+
- PostgreSQL 12+
- Redis (可选)

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

复制环境配置文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/easy_blog?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
```

### 4. 数据库设置

启动 PostgreSQL 服务，创建数据库：

```sql
CREATE DATABASE easy_blog;
```

运行数据库迁移：

```bash
npx prisma migrate dev --name init
```

### 5. 启动服务

开发模式：

```bash
pnpm run start:dev
```

生产模式：

```bash
pnpm run build
pnpm run start:prod
```

### 6. 访问 API 文档

启动服务后，访问 Swagger 文档：

```
http://localhost:8000/api
```

## API 接口

### 认证接口

- `POST /auth/login` - 用户登录

### 用户接口

- `POST /users` - 创建用户
- `GET /users` - 获取所有用户
- `GET /users/:id` - 获取指定用户
- `PATCH /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

### 文章接口

- `POST /posts` - 创建文章
- `GET /posts` - 获取所有文章 (管理员)
- `GET /posts/published` - 获取已发布文章
- `GET /posts/:id` - 根据 ID 获取文章
- `GET /posts/slug/:slug` - 根据 slug 获取文章
- `PATCH /posts/:id` - 更新文章
- `DELETE /posts/:id` - 删除文章

## 开发指南

### 添加新模块

1. 在 `src/modules/` 下创建模块目录
2. 创建 DTO、Service、Controller
3. 在 `app.module.ts` 中导入模块

### 数据库操作

使用 Prisma Client 进行数据库操作：

```typescript
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class YourService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.yourModel.findMany();
  }
}
```

### 数据验证

使用 class-validator 装饰器进行数据验证：

```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t easy-blog-service .

# 运行容器
docker run -p 3000:3000 easy-blog-service
```

### 环境变量

生产环境需要设置以下环境变量：

- `DATABASE_URL`: 生产数据库连接
- `JWT_SECRET`: 强密钥
- `NODE_ENV`: production
- `PORT`: 服务端口

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
