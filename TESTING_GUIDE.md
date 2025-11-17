# AI 智能写作助手测试指南

## 📋 测试清单

### 后端 API 测试

#### 前置条件
1. 确保后端服务已启动
2. 确保已配置 `DASHSCOPE_API_KEY` 环境变量
3. 确保已登录并获取 JWT Token

#### 测试方法 1：使用 Swagger UI（推荐）

1. **访问 Swagger 文档**
   ```
   http://localhost:8000/blog-service/docs
   ```

2. **找到 `ai-writing` 标签**

3. **测试各个接口**：

   **生成标题**
   - 点击 `POST /ai/writing/generate-title`
   - 点击 "Try it out"
   - 输入测试数据：
     ```json
     {
       "content": "这是一篇关于NestJS框架的技术文章，介绍了其特点、优势和使用场景。NestJS是一个用于构建高效、可扩展的Node.js服务器端应用程序的框架。"
     }
     ```
   - 点击 "Execute"
   - 验证返回结果包含 `content` 字段

   **生成摘要**
   - 点击 `POST /ai/writing/generate-summary`
   - 输入测试数据：
     ```json
     {
       "content": "这是一篇很长的文章内容...",
       "maxLength": 200
     }
     ```
   - 验证返回摘要长度不超过指定值

   **生成内容**
   - 点击 `POST /ai/writing/generate-content`
   - 输入测试数据：
     ```json
     {
       "prompt": "写一篇关于TypeScript的技术文章",
       "context": "目标读者是中级开发者"
     }
     ```
   - 验证返回生成的内容

   **优化内容**
   - 点击 `POST /ai/writing/optimize`
   - 输入测试数据：
     ```json
     {
       "content": "这是一段需要优化的文本，可能有一些语法错误或表达不够清晰的地方。",
       "instruction": "使语言更专业"
     }
     ```
   - 验证返回优化后的内容

   **续写**
   - 点击 `POST /ai/writing/continue`
   - 输入测试数据：
     ```json
     {
       "content": "NestJS是一个强大的Node.js框架..."
     }
     ```
   - 验证返回续写的内容

   **文章分析**
   - 点击 `POST /ai/writing/analyze`
   - 输入测试数据：
     ```json
     {
       "content": "文章完整内容...",
       "title": "文章标题"
     }
     ```
   - 验证返回分析结果和 usage 信息

#### 测试方法 2：使用 curl

```bash
# 设置变量
TOKEN="your-jwt-token"
BASE_URL="http://localhost:8000/blog-service"

# 1. 生成标题
curl -X POST "${BASE_URL}/ai/writing/generate-title" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "content": "这是一篇关于NestJS框架的技术文章..."
  }'

# 2. 生成摘要
curl -X POST "${BASE_URL}/ai/writing/generate-summary" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "content": "文章完整内容...",
    "maxLength": 200
  }'

# 3. 生成内容
curl -X POST "${BASE_URL}/ai/writing/generate-content" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "prompt": "写一篇关于TypeScript的技术文章",
    "context": "目标读者是中级开发者"
  }'

# 4. 优化内容
curl -X POST "${BASE_URL}/ai/writing/optimize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "content": "需要优化的文本...",
    "instruction": "使语言更专业"
  }'

# 5. 续写
curl -X POST "${BASE_URL}/ai/writing/continue" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "content": "当前文章内容..."
  }'

# 6. 文章分析
curl -X POST "${BASE_URL}/ai/writing/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "content": "文章内容...",
    "title": "文章标题"
  }'
```

#### 测试方法 3：使用 Postman

1. 导入以下集合（或手动创建）：

```json
{
  "info": {
    "name": "AI Writing API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate Title",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"content\": \"文章内容...\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/ai/writing/generate-title",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "writing", "generate-title"]
        }
      }
    }
  ]
}
```

2. 设置环境变量：
   - `baseUrl`: `http://localhost:8000/blog-service`
   - `token`: 你的 JWT Token

---

### 前端功能测试

#### 前置条件
1. 确保后端服务已启动
2. 确保前端服务已启动
3. 确保已登录管理后台

#### 测试场景

**场景 1：创建新文章并使用 AI 辅助**

1. **访问文章创建页面**
   ```
   http://localhost:3000/admin/posts/create
   ```

2. **测试标题生成**
   - 在编辑器中输入一些内容
   - 点击标题输入框旁的 "AI" 按钮
   - ✅ 验证：显示加载状态
   - ✅ 验证：生成标题并自动填入
   - ✅ 验证：如果内容为空，显示友好提示

3. **测试摘要生成**
   - 在编辑器中输入文章内容
   - 点击摘要区域旁的 "AI生成摘要" 按钮
   - ✅ 验证：显示加载状态
   - ✅ 验证：生成摘要并自动填入
   - ✅ 验证：摘要长度符合要求

4. **测试内容生成**
   - 点击编辑器工具栏的 "AI写作" 按钮
   - ✅ 验证：弹出 AI 写作面板
   - 输入提示词："写一篇关于NestJS的技术文章"
   - 可选：输入上下文信息
   - 点击 "生成内容" 按钮
   - ✅ 验证：显示加载状态和提示信息
   - ✅ 验证：生成内容后显示在面板中
   - ✅ 验证：可以点击 "插入到编辑器"
   - ✅ 验证：可以点击 "重新生成"

5. **测试内容优化**
   - 在编辑器中输入一些文本
   - 选中一段文本
   - 点击工具栏的 "优化" 按钮
   - ✅ 验证：未选中文本时按钮禁用
   - ✅ 验证：选中文本后按钮可用
   - ✅ 验证：显示加载状态
   - ✅ 验证：优化后的内容替换选中文本
   - ✅ 验证：显示成功提示

6. **测试续写功能**
   - 在编辑器中输入一些内容
   - 点击工具栏的 "续写" 按钮
   - ✅ 验证：显示加载状态
   - ✅ 验证：在编辑器末尾插入续写内容
   - ✅ 验证：续写内容风格一致
   - ✅ 验证：显示成功提示

**场景 2：编辑现有文章并使用 AI 优化**

1. 打开一篇文章进行编辑
2. 选中需要优化的文本
3. 点击 "优化" 按钮
4. ✅ 验证：优化功能正常工作
5. 点击 "续写" 按钮
6. ✅ 验证：续写功能正常工作
7. 保存文章
8. ✅ 验证：修改已保存

**场景 3：错误处理测试**

1. **网络错误测试**
   - 断开网络连接
   - 尝试使用任何 AI 功能
   - ✅ 验证：显示友好的网络错误提示

2. **空内容测试**
   - 不输入任何内容，直接点击 AI 生成按钮
   - ✅ 验证：显示友好的提示信息

3. **API 错误测试**
   - 使用无效的 API Key（如果可能）
   - ✅ 验证：显示友好的错误提示

4. **超时测试**
   - 模拟长时间请求（如果可能）
   - ✅ 验证：显示超时提示

**场景 4：用户体验测试**

1. **Tooltip 提示**
   - 鼠标悬停在各个 AI 按钮上
   - ✅ 验证：显示功能说明 Tooltip

2. **加载状态**
   - 执行任何 AI 操作
   - ✅ 验证：按钮显示加载动画
   - ✅ 验证：显示加载提示文字

3. **取消操作**
   - 在 AI 写作面板中点击生成
   - 在生成过程中点击 "取消生成"
   - ✅ 验证：成功取消操作
   - ✅ 验证：显示取消提示

4. **缓存功能**
   - 使用相同内容生成标题两次
   - ✅ 验证：第二次请求更快（使用缓存）

---

### 性能测试

#### 响应时间测试

使用浏览器开发者工具 Network 面板：

1. 打开开发者工具（F12）
2. 切换到 Network 标签
3. 执行 AI 操作
4. 检查请求响应时间
5. ✅ 验证：响应时间在可接受范围内（< 10秒）

#### 缓存测试

1. 使用相同内容生成标题
2. 记录第一次响应时间
3. 立即再次使用相同内容生成标题
4. 记录第二次响应时间
5. ✅ 验证：第二次明显更快（使用缓存）

---

### 边界情况测试

1. **超长内容**
   - 输入非常长的文章内容（> 10000 字）
   - 测试生成摘要
   - ✅ 验证：能正常处理超长内容

2. **空内容**
   - 不输入任何内容
   - 尝试生成标题/摘要
   - ✅ 验证：显示友好提示

3. **特殊字符**
   - 输入包含特殊字符的内容
   - ✅ 验证：能正常处理

4. **并发请求**
   - 快速连续点击多个 AI 功能
   - ✅ 验证：不会出现冲突

---

### 安全测试

1. **认证测试**
   - 未登录状态下访问 API
   - ✅ 验证：返回 401 未授权错误

2. **输入验证**
   - 输入恶意脚本或 SQL 注入代码
   - ✅ 验证：后端正确处理，不会执行

---

## 📊 测试结果记录表

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 生成标题 API | ⬜ | |
| 生成摘要 API | ⬜ | |
| 生成内容 API | ⬜ | |
| 优化内容 API | ⬜ | |
| 续写 API | ⬜ | |
| 文章分析 API | ⬜ | |
| 标题生成 UI | ⬜ | |
| 摘要生成 UI | ⬜ | |
| 内容生成 UI | ⬜ | |
| 内容优化 UI | ⬜ | |
| 续写 UI | ⬜ | |
| 错误处理 | ⬜ | |
| 加载状态 | ⬜ | |
| 性能表现 | ⬜ | |

---

## 🐛 问题记录

如果发现问题，请记录：

1. **问题描述**：
2. **复现步骤**：
3. **预期行为**：
4. **实际行为**：
5. **环境信息**：
6. **截图/日志**：

---

## ✅ 测试完成标准

所有测试项通过后，功能可以上线：

- ✅ 所有 API 接口正常工作
- ✅ 所有 UI 功能正常工作
- ✅ 错误处理完善
- ✅ 性能表现良好
- ✅ 用户体验流畅
- ✅ 无严重 bug

---

**测试文档版本**：v1.0  
**最后更新**：2025-11-17

