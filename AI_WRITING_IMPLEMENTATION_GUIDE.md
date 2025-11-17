# AI 智能写作助手实施指南

## 🚀 快速开始

本文档提供AI写作助手功能的快速实施步骤和代码示例。

---

## 第一步：后端API开发

### 1.1 创建写作助手控制器

创建 `easy-blog-service/src/modules/ai/ai-writing.controller.ts`:

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AIService } from './ai.service';
import { QwenModel } from './dto/qwen-models.dto';

@ApiTags('ai-writing')
@Controller('ai/writing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIWritingController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate-title')
  @ApiOperation({ summary: '生成文章标题' })
  async generateTitle(@Body() body: { content: string; style?: string }) {
    return await this.aiService.generateTitle(body.content, body.style);
  }

  @Post('generate-summary')
  @ApiOperation({ summary: '生成文章摘要' })
  async generateSummary(@Body() body: { content: string; maxLength?: number }) {
    return await this.aiService.generateSummary(body.content, body.maxLength);
  }

  @Post('generate-content')
  @ApiOperation({ summary: '生成文章内容' })
  async generateContent(
    @Body() body: { prompt: string; context?: string; model?: QwenModel },
  ) {
    return await this.aiService.generateContent(
      body.prompt,
      body.context,
      body.model,
    );
  }

  @Post('optimize')
  @ApiOperation({ summary: '优化文章内容' })
  async optimizeContent(
    @Body() body: { content: string; instruction?: string; model?: QwenModel },
  ) {
    return await this.aiService.optimizeContent(
      body.content,
      body.instruction,
      body.model,
    );
  }

  @Post('continue')
  @ApiOperation({ summary: '续写文章' })
  async continueWriting(@Body() body: { content: string; position?: number }) {
    const prompt = '请基于以下内容，自然地续写下一段，保持风格一致：';
    return await this.aiService.chat(prompt + '\n\n' + body.content);
  }

  @Post('analyze')
  @ApiOperation({ summary: '分析文章质量' })
  async analyzeArticle(@Body() body: { content: string; title?: string }) {
    const prompt = `请分析以下文章的质量，从可读性、结构完整性、语言表达等方面给出评分（1-5分）和改进建议：

标题：${body.title || '无'}
内容：
${body.content}`;

    const systemPrompt =
      '你是一个专业的文章质量评估专家。请从可读性、结构完整性、语言表达、逻辑性等方面对文章进行评分，并提供具体的改进建议。';

    const response = await this.aiService.chat(prompt, systemPrompt);
    return {
      analysis: response.content,
      usage: response.usage,
    };
  }
}
```

### 1.2 更新AI模块

更新 `easy-blog-service/src/modules/ai/ai.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { AIWritingController } from './ai-writing.controller'; // 新增

@Module({
  controllers: [AIController, AIWritingController], // 添加
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
```

---

## 第二步：前端API客户端

### 2.1 创建AI写作API文件

创建 `easy-blog-admin/src/api/ai-writing/index.ts`:

```typescript
import { requestClient } from '@/lib/request-client';

export interface GenerateTitleRequest {
  content: string;
  style?: 'concise' | 'attractive' | 'technical' | 'seo';
}

export interface GenerateSummaryRequest {
  content: string;
  maxLength?: number;
}

export interface GenerateContentRequest {
  prompt: string;
  context?: string;
  model?: string;
}

export interface OptimizeContentRequest {
  content: string;
  instruction?: string;
  model?: string;
}

export interface ContinueWritingRequest {
  content: string;
  position?: number;
}

export interface AnalyzeArticleRequest {
  content: string;
  title?: string;
}

const aiWritingApi = {
  // 生成标题
  generateTitle: (data: GenerateTitleRequest) =>
    requestClient.post<string>('/ai/writing/generate-title', data),

  // 生成摘要
  generateSummary: (data: GenerateSummaryRequest) =>
    requestClient.post<string>('/ai/writing/generate-summary', data),

  // 生成内容
  generateContent: (data: GenerateContentRequest) =>
    requestClient.post<string>('/ai/writing/generate-content', data),

  // 优化内容
  optimizeContent: (data: OptimizeContentRequest) =>
    requestClient.post<string>('/ai/writing/optimize', data),

  // 续写
  continueWriting: (data: ContinueWritingRequest) =>
    requestClient.post<{ content: string }>('/ai/writing/continue', data),

  // 分析文章
  analyzeArticle: (data: AnalyzeArticleRequest) =>
    requestClient.post<{ analysis: string; usage: any }>(
      '/ai/writing/analyze',
      data,
    ),
};

export default aiWritingApi;
```

---

## 第三步：前端组件开发

### 3.1 AI工具栏组件

创建 `easy-blog-admin/src/components/AIEditorToolbar.tsx`:

```typescript
"use client";

import { Button, Space, Popconfirm, message } from "antd";
import {
  RobotOutlined,
  ThunderboltOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import AIWritingPanel from "./AIWritingPanel";
import aiWritingApi from "@/api/ai-writing";

interface AIEditorToolbarProps {
  editor: Editor;
}

export default function AIEditorToolbar({ editor }: AIEditorToolbarProps) {
  const [aiPanelVisible, setAiPanelVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // AI生成内容
  const handleGenerate = () => {
    setAiPanelVisible(true);
  };

  // 优化选中内容
  const handleOptimize = async () => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
    );

    if (!selectedText) {
      message.warning("请先选中要优化的文本");
      return;
    }

    setLoading(true);
    try {
      const optimized = await aiWritingApi.optimizeContent({
        content: selectedText,
      });
      editor
        .chain()
        .focus()
        .deleteSelection()
        .insertContent(optimized)
        .run();
      message.success("内容优化完成");
    } catch (error) {
      message.error("优化失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 续写
  const handleContinue = async () => {
    const currentContent = editor.getHTML();
    setLoading(true);
    try {
      const response = await aiWritingApi.continueWriting({
        content: currentContent,
      });
      editor.chain().focus().insertContent("<p>" + response.content + "</p>").run();
      message.success("续写完成");
    } catch (error) {
      message.error("续写失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space>
        <Button
          type="default"
          icon={<RobotOutlined />}
          onClick={handleGenerate}
          size="small"
        >
          AI写作
        </Button>
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={handleOptimize}
          disabled={!editor.state.selection.empty}
          loading={loading}
          size="small"
        >
          优化
        </Button>
        <Button
          type="default"
          icon={<ThunderboltOutlined />}
          onClick={handleContinue}
          loading={loading}
          size="small"
        >
          续写
        </Button>
      </Space>

      <AIWritingPanel
        visible={aiPanelVisible}
        onClose={() => setAiPanelVisible(false)}
        onInsert={(content) => {
          editor.chain().focus().insertContent(content).run();
          setAiPanelVisible(false);
        }}
      />
    </>
  );
}
```

### 3.2 AI写作面板组件

创建 `easy-blog-admin/src/components/AIWritingPanel.tsx`:

```typescript
"use client";

import { Modal, Input, Button, message, Space, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import aiWritingApi from "@/api/ai-writing";

interface AIWritingPanelProps {
  visible: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export default function AIWritingPanel({
  visible,
  onClose,
  onInsert,
}: AIWritingPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning("请输入写作提示");
      return;
    }

    setLoading(true);
    try {
      const content = await aiWritingApi.generateContent({
        prompt,
        context: context || undefined,
      });
      setGeneratedContent(content);
    } catch (error) {
      message.error("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedContent) {
      onInsert(generatedContent);
      setPrompt("");
      setContext("");
      setGeneratedContent("");
    }
  };

  return (
    <Modal
      title="AI 智能写作"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">写作提示</label>
          <Input.TextArea
            rows={4}
            placeholder="例如：写一篇关于NestJS框架的技术文章，包括其特点、优势和使用场景"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">上下文信息（可选）</label>
          <Input.TextArea
            rows={2}
            placeholder="例如：目标读者是中级开发者，文章风格要专业但易懂"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleGenerate}
          loading={loading}
          block
        >
          生成内容
        </Button>

        {loading && (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">AI正在思考中...</p>
          </div>
        )}

        {generatedContent && !loading && (
          <div>
            <label className="block mb-2 font-medium">生成的内容</label>
            <div
              className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generatedContent }}
            />
            <Space className="mt-4">
              <Button type="primary" onClick={handleInsert}>
                插入到编辑器
              </Button>
              <Button onClick={() => setGeneratedContent("")}>重新生成</Button>
            </Space>
          </div>
        )}
      </div>
    </Modal>
  );
}
```

### 3.3 集成到PostEditor

更新 `easy-blog-admin/src/components/PostEditor.tsx`，添加AI工具栏：

```typescript
// 在工具栏区域添加
import AIEditorToolbar from "./AIEditorToolbar";

// 在工具栏部分添加
<div className="border-b border-gray-300 p-2">
  <Space wrap>
    {/* 原有工具栏按钮 */}
    {/* ... */}
    
    <Divider type="vertical" />
    
    {/* AI工具栏 */}
    <AIEditorToolbar editor={editor} />
  </Space>
</div>
```

### 3.4 添加AI标题生成功能

更新 `easy-blog-admin/src/components/PostForm.tsx`，在标题输入框旁添加AI生成按钮：

```typescript
import { SparklesOutlined } from "@ant-design/icons";
import aiWritingApi from "@/api/ai-writing";

// 在标题输入框旁添加
<Form.Item
  label={
    <span className="text-gray-700 font-medium">
      文章标题 <span className="text-red-500">*</span>
    </span>
  }
  name="title"
  rules={[{ required: true, message: "请输入文章标题" }]}
>
  <Input
    placeholder="请输入文章标题"
    onChange={handleTitleChange}
    size="large"
    className="rounded-lg"
    suffix={
      <Button
        type="text"
        icon={<SparklesOutlined />}
        onClick={async () => {
          const content = content || form.getFieldValue("summary") || "";
          if (!content) {
            message.warning("请先输入文章内容或摘要");
            return;
          }
          try {
            const title = await aiWritingApi.generateTitle({ content });
            form.setFieldsValue({ title });
            message.success("标题生成成功");
          } catch (error) {
            message.error("标题生成失败");
          }
        }}
      >
        AI生成
      </Button>
    }
  />
</Form.Item>
```

---

## 第四步：测试验证

### 4.1 测试AI功能

1. 启动后端服务
2. 启动前端管理后台
3. 登录后台，进入文章创建页面
4. 测试各项AI功能：
   - AI标题生成
   - AI摘要生成
   - AI内容生成
   - 内容优化
   - 续写功能

### 4.2 验证API连通性

```bash
# 测试AI接口
curl -X POST http://localhost:8000/blog-service/ai/writing/generate-title \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content": "这是一篇关于NestJS的技术文章..."}'
```

---

## 第五步：优化与完善

### 5.1 性能优化
- 添加防抖处理
- 实现请求缓存
- 优化加载状态

### 5.2 用户体验优化
- 添加操作提示
- 优化错误处理
- 添加使用统计

### 5.3 功能扩展
- 添加更多AI功能
- 支持批量操作
- 添加使用限制

---

## 📝 注意事项

1. **API Key配置**：确保后端已配置 `DASHSCOPE_API_KEY`
2. **权限控制**：确保只有授权用户可以使用AI功能
3. **成本控制**：建议添加使用频率限制
4. **错误处理**：完善错误提示和重试机制
5. **内容审核**：AI生成的内容需要人工审核

---

## 🎯 下一步

1. 完成基础功能开发
2. 进行用户测试
3. 收集反馈并优化
4. 逐步添加高级功能

---

**文档版本**：v1.0  
**最后更新**：2025-11-17

