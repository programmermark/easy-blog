# AI 智能写作助手快速开始

## 🚀 快速启动

### 1. 环境配置

#### 后端配置

在 `easy-blog-service/.env` 或 `easy-blog-service/.env.local` 中添加：

```env
# 阿里云百炼 API Key（必填）
DASHSCOPE_API_KEY=sk-xxx

# 地域配置（可选，默认为 beijing）
DASHSCOPE_REGION=beijing

# 默认模型（可选，默认为 qwen-plus）
DASHSCOPE_MODEL=qwen-plus
```

获取 API Key：https://help.aliyun.com/zh/model-studio/get-api-key

#### 前端配置

确保 `easy-blog-admin/.env.local` 中配置了 API 地址：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/blog-service
```

### 2. 启动服务

#### 启动后端

```bash
cd easy-blog-service
pnpm install
pnpm run start:dev
```

服务启动后访问：
- API 文档：http://localhost:8000/blog-service/docs
- 健康检查：http://localhost:8000/blog-service/ai/test

#### 启动前端

```bash
cd easy-blog-admin
pnpm install
pnpm run dev
```

前端启动后访问：
- 管理后台：http://localhost:3000/admin
- 登录后进入文章管理页面

### 3. 验证功能

#### 快速测试脚本

```bash
# 获取 JWT Token（需要先登录）
TOKEN="your-jwt-token"

# 运行测试脚本
./test-ai-apis.sh $TOKEN
```

#### 手动测试

1. **登录管理后台**
   - 访问 http://localhost:3000/admin/login
   - 使用账号登录

2. **创建新文章**
   - 进入文章管理页面
   - 点击"创建文章"

3. **测试 AI 功能**
   - 在编辑器中输入一些内容
   - 点击标题旁的 "AI" 按钮生成标题
   - 点击摘要旁的 "AI生成摘要" 按钮
   - 点击工具栏的 "AI写作" 按钮生成内容
   - 选中文本后点击 "优化" 按钮
   - 点击 "续写" 按钮续写内容

---

## 📚 功能说明

### AI 标题生成
- **位置**：文章标题输入框旁
- **用法**：输入内容后点击 "AI" 按钮
- **功能**：根据文章内容或摘要自动生成标题

### AI 摘要生成
- **位置**：摘要输入框上方
- **用法**：输入文章内容后点击 "AI生成摘要"
- **功能**：自动生成文章摘要（最大200字）

### AI 内容生成
- **位置**：编辑器工具栏
- **用法**：点击 "AI写作" 按钮，输入提示词
- **功能**：根据提示词生成文章内容

### 内容优化
- **位置**：编辑器工具栏
- **用法**：选中文本后点击 "优化" 按钮
- **功能**：优化选中文本的表达和结构

### 智能续写
- **位置**：编辑器工具栏
- **用法**：输入内容后点击 "续写" 按钮
- **功能**：基于当前内容智能续写下一段

---

## 🔧 故障排查

### 问题1：AI 功能无法使用

**可能原因**：
- API Key 未配置
- API Key 无效
- 网络连接问题

**解决方法**：
1. 检查环境变量 `DASHSCOPE_API_KEY` 是否配置
2. 验证 API Key 是否有效
3. 检查网络连接
4. 查看后端日志

### 问题2：接口返回 401 错误

**可能原因**：
- 未登录
- Token 过期

**解决方法**：
1. 重新登录获取新 Token
2. 检查 Token 是否有效

### 问题3：生成内容为空

**可能原因**：
- 提示词不清晰
- API 调用失败

**解决方法**：
1. 使用更清晰的提示词
2. 检查网络连接
3. 查看浏览器控制台错误信息

---

## 📖 更多文档

- [产品设计方案](./AI_WRITING_ASSISTANT_DESIGN.md)
- [实施指南](./AI_WRITING_IMPLEMENTATION_GUIDE.md)
- [开发计划](./AI_WRITING_DEVELOPMENT_PLAN.md)
- [测试指南](./TESTING_GUIDE.md)
- [完成总结](./AI_WRITING_COMPLETION_SUMMARY.md)

---

**最后更新**：2025-11-17

