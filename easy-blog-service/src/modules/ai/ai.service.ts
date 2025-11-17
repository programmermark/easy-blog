import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateChatCompletionDto, ChatMessageDto, MessageRole } from './dto/chat-message.dto';
import {
  QwenModel,
  WritingAssistantModelRecommendation,
  getModelInfo,
} from './dto/qwen-models.dto';

/**
 * AI 服务响应接口
 */
export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * AI 服务配置接口
 */
export interface AIServiceConfig {
  apiKey?: string;
  baseURL?: string;
  defaultModel?: string;
  region?: 'beijing' | 'singapore';
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI | null = null;
  private readonly defaultModel: string;
  private readonly config: AIServiceConfig;

  constructor() {
    this.config = this.getConfig();
    this.defaultModel = this.config.defaultModel || QwenModel.QWEN_PLUS;

    // 延迟初始化 OpenAI 客户端，只有在有 API Key 时才初始化
    this.initializeClient();
  }

  /**
   * 初始化 OpenAI 客户端
   */
  private initializeClient(): void {
    const apiKey = this.config.apiKey || process.env.DASHSCOPE_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      this.logger.warn(
        'DASHSCOPE_API_KEY 未配置，AI 功能将无法使用。请在环境变量中设置 DASHSCOPE_API_KEY',
      );
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: this.config.baseURL || this.getBaseURL(this.config.region),
      });
      this.logger.log('AI 服务初始化成功');
    } catch (error) {
      this.logger.error(`AI 服务初始化失败: ${error.message}`, error.stack);
    }
  }

  /**
   * 获取 OpenAI 客户端，如果未初始化则抛出错误
   */
  private getClient(): OpenAI {
    if (!this.openai) {
      throw new BadRequestException(
        'AI 服务未初始化。请配置 DASHSCOPE_API_KEY 环境变量。获取 API Key：https://help.aliyun.com/zh/model-studio/get-api-key',
      );
    }
    return this.openai;
  }

  /**
   * 获取配置信息
   */
  private getConfig(): AIServiceConfig {
    const region = (process.env.DASHSCOPE_REGION as 'beijing' | 'singapore') || 'beijing';
    return {
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: process.env.DASHSCOPE_BASE_URL,
      defaultModel: (process.env.DASHSCOPE_MODEL as QwenModel) || QwenModel.QWEN_PLUS,
      region,
    };
  }

  /**
   * 根据地域获取 baseURL
   */
  private getBaseURL(region?: 'beijing' | 'singapore'): string {
    if (region === 'singapore') {
      return 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
    }
    return 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  }

  /**
   * 创建聊天补全（通用方法）
   * @param dto 聊天请求 DTO
   * @returns 聊天响应
   */
  async createChatCompletion(dto: CreateChatCompletionDto): Promise<ChatCompletionResponse> {
    try {
      const { model = this.defaultModel, messages, temperature, max_tokens } = dto;

      // 验证消息列表
      if (!messages || messages.length === 0) {
        throw new BadRequestException('消息列表不能为空');
      }

      this.logger.log(`调用模型: ${model}, 消息数量: ${messages.length}`);

      const client = this.getClient();
      const completion = await client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        ...(temperature !== undefined && { temperature }),
        ...(max_tokens !== undefined && { max_tokens }),
      });

      const response: ChatCompletionResponse = {
        content: completion.choices[0]?.message?.content || '',
        model: completion.model,
        usage: completion.usage
          ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
          : undefined,
      };

      this.logger.log(`AI 响应成功，token 使用: ${response.usage?.total_tokens || 0}`);
      return response;
    } catch (error) {
      this.logger.error(`AI 调用失败: ${error.message}`, error.stack);
      throw new BadRequestException(
        `AI 调用失败: ${error.message}。请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code`,
      );
    }
  }

  /**
   * 简化方法：直接发送用户消息（自动添加系统提示）
   * @param userMessage 用户消息
   * @param systemPrompt 系统提示词（可选）
   * @param model 模型名称（可选，默认使用推荐模型）
   * @returns 聊天响应
   */
  async chat(
    userMessage: string,
    systemPrompt?: string,
    model?: QwenModel | string,
  ): Promise<ChatCompletionResponse> {
    const messages: ChatMessageDto[] = [];

    if (systemPrompt) {
      messages.push({
        role: MessageRole.SYSTEM,
        content: systemPrompt,
      });
    }

    messages.push({
      role: MessageRole.USER,
      content: userMessage,
    });

    return this.createChatCompletion({
      model,
      messages,
    });
  }

  /**
   * 智能写作助手：生成文章内容
   * @param prompt 写作提示词
   * @param context 上下文信息（可选）
   * @param model 使用的模型（可选，默认使用推荐模型）
   * @returns 生成的内容
   */
  async generateContent(
    prompt: string,
    context?: string,
    model: QwenModel = WritingAssistantModelRecommendation.DEFAULT,
  ): Promise<string> {
    const systemPrompt = `你是一个专业的写作助手。请根据用户的需求，生成高质量、结构清晰的文章内容。
${context ? `上下文信息：${context}` : ''}
要求：
1. 内容要有逻辑性和可读性
2. 使用合适的段落结构
3. 语言表达准确、流畅
4. 如果涉及技术内容，请确保准确性`;

    const response = await this.chat(prompt, systemPrompt, model);
    return response.content;
  }

  /**
   * 智能写作助手：优化文章内容
   * @param content 待优化的内容
   * @param instruction 优化指令（可选）
   * @param model 使用的模型（可选，默认使用推荐模型）
   * @returns 优化后的内容
   */
  async optimizeContent(
    content: string,
    instruction?: string,
    model: QwenModel = WritingAssistantModelRecommendation.DEFAULT,
  ): Promise<string> {
    const prompt = instruction
      ? `请根据以下指令优化以下内容：\n\n指令：${instruction}\n\n内容：\n${content}`
      : `请优化以下内容，使其更加清晰、流畅、易读：\n\n${content}`;

    const systemPrompt =
      '你是一个专业的文本编辑助手。请优化用户提供的内容，使其更加清晰、流畅、易读，同时保持原意不变。';

    const response = await this.chat(prompt, systemPrompt, model);
    return response.content;
  }

  /**
   * 智能写作助手：生成文章摘要
   * @param content 文章内容
   * @param maxLength 最大长度（可选）
   * @param model 使用的模型（可选，超长文章建议使用 QWEN_LONG）
   * @returns 文章摘要
   */
  async generateSummary(
    content: string,
    maxLength?: number,
    model?: QwenModel,
  ): Promise<string> {
    const lengthHint = maxLength ? `，长度控制在 ${maxLength} 字以内` : '';
    const prompt = `请为以下文章生成一个简洁明了的摘要${lengthHint}：\n\n${content}`;

    const systemPrompt = '你是一个专业的文本摘要生成助手。请为文章生成准确、简洁的摘要，突出文章的核心内容。';

    // 如果内容很长，自动使用 QWEN_LONG 模型
    const selectedModel =
      model || (content.length > 100000 ? QwenModel.QWEN_LONG : WritingAssistantModelRecommendation.DEFAULT);

    const response = await this.chat(prompt, systemPrompt, selectedModel);
    return response.content;
  }

  /**
   * 智能写作助手：生成文章标题
   * @param content 文章内容
   * @param style 标题风格（可选）
   * @param model 使用的模型（可选，默认使用推荐模型）
   * @returns 文章标题
   */
  async generateTitle(
    content: string,
    style?: string,
    model: QwenModel = WritingAssistantModelRecommendation.DEFAULT,
  ): Promise<string> {
    const styleHint = style ? `，风格要求：${style}` : '';
    const prompt = `请为以下文章生成一个吸引人的标题${styleHint}：\n\n${content}`;

    const systemPrompt =
      '你是一个专业的标题生成助手。请为文章生成简洁、吸引人、准确反映文章内容的标题。';

    const response = await this.chat(prompt, systemPrompt, model);
    return response.content;
  }

  /**
   * 获取模型信息
   * @param model 模型名称
   * @returns 模型信息
   */
  getModelInfo(model: QwenModel) {
    return getModelInfo(model);
  }
}

