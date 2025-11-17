# AI 模块使用说明

本模块封装了阿里云通义千问（百炼）的 API 调用，提供了通用的 AI 服务方法，可用于智能写作助手等场景。

## 环境配置

在 `.env` 或 `.env.local` 文件中配置以下环境变量：

```env
# 阿里云百炼 API Key（必填）
DASHSCOPE_API_KEY=sk-xxx

# 地域配置（可选，默认为 beijing）
# 可选值：beijing（北京）或 singapore（新加坡）
DASHSCOPE_REGION=beijing

# 自定义 baseURL（可选，如果不配置会根据 region 自动选择）
# DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 默认模型（可选，默认为 qwen-plus）
# DASHSCOPE_MODEL=qwen-plus
```

获取 API Key：https://help.aliyun.com/zh/model-studio/get-api-key

## 使用方法

### 1. 在其他服务中注入 AIService

```typescript
import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

@Injectable()
export class YourService {
  constructor(private readonly aiService: AIService) {}

  async yourMethod() {
    // 使用 AI 服务
  }
}
```

### 2. 基础聊天方法

#### 方法一：使用 `chat()` 方法（简化版）

```typescript
// 简单对话
const response = await this.aiService.chat('你是谁？');
console.log(response.content);

// 带系统提示的对话
const response = await this.aiService.chat(
  '写一篇关于 TypeScript 的文章',
  '你是一个专业的技术写作助手',
);
console.log(response.content);
```

#### 方法二：使用 `createChatCompletion()` 方法（完整版）

```typescript
import {
  CreateChatCompletionDto,
  MessageRole,
} from '../ai/dto/chat-message.dto';
import { QwenModel } from '../ai/dto/qwen-models.dto';

const dto: CreateChatCompletionDto = {
  model: QwenModel.QWEN_PLUS, // 使用枚举类型，推荐
  messages: [
    { role: MessageRole.SYSTEM, content: 'You are a helpful assistant.' },
    { role: MessageRole.USER, content: '你是谁？' },
  ],
  temperature: 0.7, // 可选
  max_tokens: 2000, // 可选
};

const response = await this.aiService.createChatCompletion(dto);
console.log(response.content);
console.log(response.usage); // token 使用情况
```

### 3. 智能写作助手专用方法

#### 生成文章内容

```typescript
import {
  QwenModel,
  WritingAssistantModelRecommendation,
} from '../ai/dto/qwen-models.dto';

// 使用默认推荐模型（qwen-plus）
const content = await this.aiService.generateContent(
  '请写一篇关于 NestJS 框架的介绍文章，包括其特点、优势和使用场景',
  '目标读者是中级开发者',
);

// 使用高质量模型
const highQualityContent = await this.aiService.generateContent(
  '请写一篇关于 NestJS 框架的介绍文章',
  '目标读者是中级开发者',
  WritingAssistantModelRecommendation.HIGH_QUALITY, // 使用 qwen-max
);
```

#### 优化文章内容

```typescript
// 自动优化
const optimized = await this.aiService.optimizeContent('原始文章内容...');

// 按指令优化
const optimized = await this.aiService.optimizeContent(
  '原始文章内容...',
  '请使语言更加简洁，增加技术细节',
);
```

#### 生成文章摘要

```typescript
import { QwenModel } from '../ai/dto/qwen-models.dto';

// 自动生成摘要（短文章使用默认模型，超长文章自动使用 qwen-long）
const summary = await this.aiService.generateSummary('文章完整内容...');

// 指定最大长度
const summary = await this.aiService.generateSummary('文章完整内容...', 200);

// 超长文章，明确指定使用 qwen-long
const longArticleSummary = await this.aiService.generateSummary(
  '超长文章内容...',
  200,
  QwenModel.QWEN_LONG,
);
```

#### 生成文章标题

```typescript
// 自动生成标题
const title = await this.aiService.generateTitle('文章内容...');

// 指定风格
const title = await this.aiService.generateTitle(
  '文章内容...',
  '简洁、吸引人、技术风格',
);
```

## 响应格式

所有方法返回 `ChatCompletionResponse` 对象：

```typescript
interface ChatCompletionResponse {
  content: string; // AI 生成的内容
  model: string; // 使用的模型名称
  usage?: {
    // Token 使用情况（可选）
    prompt_tokens?: number; // 输入 token 数
    completion_tokens?: number; // 输出 token 数
    total_tokens?: number; // 总 token 数
  };
}
```

## 错误处理

服务会自动处理错误并抛出 `BadRequestException`，包含详细的错误信息。建议在调用时使用 try-catch：

```typescript
try {
  const response = await this.aiService.chat('你的问题');
  console.log(response.content);
} catch (error) {
  console.error('AI 调用失败:', error.message);
}
```

## 模型选择指南

### 可用模型列表

本模块支持所有通义千问模型，通过 `QwenModel` 枚举类型提供类型安全：

```typescript
import {
  QwenModel,
  getModelInfo,
  WritingAssistantModelRecommendation,
} from '../ai/dto/qwen-models.dto';

// 查看所有可用模型
Object.values(QwenModel).forEach((model) => {
  const info = getModelInfo(model);
  console.log(`${model}: ${info.features.join(', ')}`);
});

// 使用推荐模型
const model = WritingAssistantModelRecommendation.DEFAULT; // qwen-plus
```

### 模型分类

#### 1. 通用对话模型（推荐用于智能文章助手）

| 模型             | 上下文窗口       | 特点             | 适用场景                                     |
| ---------------- | ---------------- | ---------------- | -------------------------------------------- |
| **qwen-plus** ⭐ | 1,000,000 tokens | 性能与成本平衡   | **日常文章生成、内容优化、摘要生成（推荐）** |
| **qwen-max**     | 262,144 tokens   | 最强性能         | 高质量文章生成、复杂推理任务                 |
| **qwen-turbo**   | 1,000,000 tokens | 低时延、高性价比 | 快速响应需求、实时对话、批量处理             |
| **qwen-flash**   | 1,000,000 tokens | 低时延、高性价比 | 快速响应需求、实时对话、批量处理             |

#### 2. 长文本模型

| 模型          | 上下文窗口 | 特点         | 适用场景                               |
| ------------- | ---------- | ------------ | -------------------------------------- |
| **qwen-long** | 超长       | 超长文档处理 | 超长文章处理、长文档摘要、长篇内容分析 |

#### 3. 代码模型

| 模型           | 上下文窗口       | 特点         | 适用场景                         |
| -------------- | ---------------- | ------------ | -------------------------------- |
| **qwen-coder** | 1,000,000 tokens | 专为编码设计 | 技术文章编写、代码生成、代码分析 |

#### 4. 视觉语言模型

| 模型             | 上下文窗口       | 特点           | 适用场景               |
| ---------------- | ---------------- | -------------- | ---------------------- |
| **qwen-vl-plus** | 16,384 tokens/图 | 多模态输入     | 图文内容生成、文档理解 |
| **qwen-vl-max**  | 16,384 tokens/图 | 旗舰级视觉推理 | 高质量视觉内容理解     |

### 智能文章助手模型推荐

根据不同的使用场景，我们提供了模型推荐：

```typescript
import { WritingAssistantModelRecommendation } from '../ai/dto/qwen-models.dto';

// 日常文章生成（推荐）- 使用 qwen-plus
WritingAssistantModelRecommendation.DEFAULT;

// 高质量文章生成 - 使用 qwen-max
WritingAssistantModelRecommendation.HIGH_QUALITY;

// 快速响应场景 - 使用 qwen-turbo
WritingAssistantModelRecommendation.FAST;

// 超长文章处理 - 使用 qwen-long
WritingAssistantModelRecommendation.LONG_ARTICLE;

// 技术文章/代码相关 - 使用 qwen-coder
WritingAssistantModelRecommendation.TECHNICAL;
```

### 模型选择建议

#### 对于智能文章助手，推荐使用：

1. **日常使用（推荐）**：`qwen-plus`

   - ✅ 性能与成本的最佳平衡
   - ✅ 支持超长上下文（1,000,000 tokens），适合长篇文章
   - ✅ 适合大多数写作场景：生成、优化、摘要、标题

2. **高质量需求**：`qwen-max`

   - ✅ 最强性能，适合对质量要求极高的场景
   - ⚠️ 成本较高，上下文窗口较小（262,144 tokens）

3. **快速响应**：`qwen-turbo` 或 `qwen-flash`

   - ✅ 低时延，适合实时交互场景
   - ✅ 高性价比

4. **超长文章**：`qwen-long`

   - ✅ 专门处理超长文档
   - ✅ 适合处理数万字的文章

5. **技术文章**：`qwen-coder`
   - ✅ 专为代码和技术内容优化
   - ✅ 适合编写技术文档、代码示例

### 使用示例

```typescript
import {
  QwenModel,
  WritingAssistantModelRecommendation,
} from '../ai/dto/qwen-models.dto';

// 方式1：使用推荐模型（推荐）
const content = await this.aiService.generateContent(
  '写一篇关于 TypeScript 的文章',
  undefined,
  WritingAssistantModelRecommendation.DEFAULT,
);

// 方式2：直接使用枚举
const content = await this.aiService.generateContent(
  '写一篇关于 TypeScript 的文章',
  undefined,
  QwenModel.QWEN_PLUS,
);

// 方式3：获取模型信息
const modelInfo = this.aiService.getModelInfo(QwenModel.QWEN_PLUS);
console.log('模型特点:', modelInfo.features);
console.log('适用场景:', modelInfo.useCases);
```

### 模型信息查询

```typescript
import { getModelInfo, MODEL_INFO_MAP } from '../ai/dto/qwen-models.dto';

// 获取单个模型信息
const info = getModelInfo(QwenModel.QWEN_PLUS);
console.log(info);

// 查看所有模型信息
Object.entries(MODEL_INFO_MAP).forEach(([model, info]) => {
  console.log(`${model}:`, info);
});
```

### 官方文档

更多模型详情：https://help.aliyun.com/zh/model-studio/getting-started/models

## 注意事项

1. API Key 必须正确配置，否则服务无法使用
2. 不同地域（北京/新加坡）的 API Key 不同，需要对应配置
3. 注意 API 调用频率限制，避免频繁调用
4. 建议在生产环境中添加缓存机制，减少 API 调用成本
5. 长文本内容建议分段处理，避免超出 token 限制
