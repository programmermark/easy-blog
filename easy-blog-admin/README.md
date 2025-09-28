# 博客管理后台

基于 Next.js 14 + Ant Design 5 + Zustand 的现代化博客管理后台。

## 🚀 技术栈

- **前端框架**: Next.js 14 + TypeScript
- **UI 组件库**: Ant Design 5
- **状态管理**: Zustand
- **富文本编辑器**: Tiptap
- **HTTP 客户端**: Axios
- **表单处理**: React Hook Form + Zod
- **数据获取**: React Query
- **样式**: Tailwind CSS

## ✨ 功能特性

- ✅ 用户认证和授权
- ✅ 文章管理（创建、编辑、删除、发布）
- ✅ 分类管理
- ✅ 标签管理
- ✅ 富文本编辑器
- ✅ 响应式设计
- ✅ 状态持久化
- ✅ JWT 认证
- ✅ 自动 token 刷新

## 🏗️ 项目结构

```
blog-admin/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   │   ├── posts/         # 文章管理
│   │   ├── categories/    # 分类管理
│   │   └── tags/          # 标签管理
│   ├── login/             # 登录页面
│   ├── api/               # API 路由
│   └── layout.tsx         # 根布局
├── components/            # 可复用组件
│   ├── PostEditor.tsx     # 富文本编辑器
│   ├── PostForm.tsx       # 文章表单
│   └── AuthGuard.tsx      # 认证守卫
├── stores/                # Zustand 状态管理
│   └── auth.ts           # 认证状态
├── lib/                   # 工具库
│   ├── api.ts            # API 客户端
│   └── providers.tsx     # React Query Provider
└── types/                 # TypeScript 类型定义
    └── index.ts
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=博客管理后台
```

### 3. 启动开发服务器

```bash
# 使用启动脚本
./start-dev.sh

# 或者直接使用 npm
npm run dev
```

### 4. 访问应用

- 前端地址: http://localhost:3000
- 后端地址: http://localhost:8000

## 🔧 开发指南

### 添加新页面

1. 在 `app/` 目录下创建新的路由
2. 使用 `AuthGuard` 包装需要认证的页面
3. 遵循现有的组件结构

### 添加新功能

1. 在 `types/index.ts` 中定义类型
2. 在 `lib/api.ts` 中添加 API 调用
3. 在 `stores/` 中添加状态管理
4. 创建相应的页面和组件

### 状态管理

使用 Zustand 进行状态管理，支持持久化：

```typescript
import { useAuthStore } from "@/stores/auth";

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### API 调用

使用封装的 API 客户端：

```typescript
import api from "@/lib/api";

// GET 请求
const response = await api.get("/posts");

// POST 请求
const response = await api.post("/posts", data);
```

## 🎨 组件说明

### PostEditor

基于 Tiptap 的富文本编辑器，支持：

- 粗体、斜体、下划线、删除线
- 代码块和行内代码
- 链接和图片
- 有序列表和无序列表
- 引用块
- 撤销和重做

### PostForm

文章表单组件，包含：

- 标题和 URL 别名（自动生成）
- 摘要和封面图片
- 状态选择（草稿/已发布/已归档）
- 分类和标签选择
- 富文本内容编辑

### AuthGuard

认证守卫组件，用于保护需要登录的页面：

```typescript
<AuthGuard>
  <YourProtectedComponent />
</AuthGuard>
```

## 🔐 认证流程

1. 用户输入邮箱和密码
2. 前端调用 `/api/auth/login` 接口
3. 后端验证用户信息并返回 JWT token
4. 前端将 token 存储到 localStorage
5. 后续请求自动携带 token
6. token 过期时自动刷新

## 📱 响应式设计

- 移动端友好的界面设计
- 自适应布局
- 触摸友好的交互

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t blog-admin .

# 运行容器
docker run -p 3000:3000 blog-admin
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Ant Design](https://ant.design/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tiptap](https://tiptap.dev/)
- [React Query](https://tanstack.com/query)
