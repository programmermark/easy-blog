import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AIService } from './ai.service';
import {
  GenerateTitleDto,
  GenerateSummaryDto,
  GenerateContentDto,
  OptimizeContentDto,
  ContinueWritingDto,
  AnalyzeArticleDto,
} from './dto/ai-writing.dto';
import { QwenModel } from './dto/qwen-models.dto';

@ApiTags('ai-writing')
@Controller('ai/writing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIWritingController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate-title')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成文章标题' })
  @ApiBody({ type: GenerateTitleDto })
  @ApiResponse({
    status: 200,
    description: '标题生成成功',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'NestJS框架：现代化Node.js应用开发指南' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async generateTitle(@Body() dto: GenerateTitleDto) {
    const styleMap = {
      concise: '简洁',
      attractive: '吸引人',
      technical: '技术风格',
      seo: 'SEO优化',
    };
    const style = dto.style ? styleMap[dto.style] : undefined;
    const title = await this.aiService.generateTitle(dto.content, style);
    return { content: title };
  }

  @Post('generate-summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成文章摘要' })
  @ApiBody({ type: GenerateSummaryDto })
  @ApiResponse({
    status: 200,
    description: '摘要生成成功',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '本文介绍了NestJS框架的核心特性...' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async generateSummary(@Body() dto: GenerateSummaryDto) {
    const summary = await this.aiService.generateSummary(dto.content, dto.maxLength);
    return { content: summary };
  }

  @Post('generate-content')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成文章内容' })
  @ApiBody({ type: GenerateContentDto })
  @ApiResponse({
    status: 200,
    description: '内容生成成功',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '生成的文章内容...' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async generateContent(@Body() dto: GenerateContentDto) {
    const content = await this.aiService.generateContent(
      dto.prompt,
      dto.context,
      dto.model,
    );
    return { content };
  }

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '优化文章内容' })
  @ApiBody({ type: OptimizeContentDto })
  @ApiResponse({
    status: 200,
    description: '内容优化成功',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '优化后的内容...' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async optimizeContent(@Body() dto: OptimizeContentDto) {
    const optimized = await this.aiService.optimizeContent(
      dto.content,
      dto.instruction,
      dto.model,
    );
    return { content: optimized };
  }

  @Post('continue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '续写文章' })
  @ApiBody({ type: ContinueWritingDto })
  @ApiResponse({
    status: 200,
    description: '续写成功',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: '续写的内容...' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async continueWriting(@Body() dto: ContinueWritingDto) {
    const prompt = '请基于以下内容，自然地续写下一段，保持风格一致：';
    const response = await this.aiService.chat(
      prompt + '\n\n' + dto.content,
      '你是一个专业的写作助手，擅长续写文章，保持原有风格和逻辑。',
    );
    return { content: response.content };
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分析文章质量' })
  @ApiBody({ type: AnalyzeArticleDto })
  @ApiResponse({
    status: 200,
    description: '分析成功',
    schema: {
      type: 'object',
      properties: {
        analysis: {
          type: 'string',
          example: '可读性：4/5\n结构完整性：5/5\n语言表达：4/5\n...',
        },
        usage: {
          type: 'object',
          properties: {
            total_tokens: { type: 'number', example: 500 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async analyzeArticle(@Body() dto: AnalyzeArticleDto) {
    const prompt = `请分析以下文章的质量，从可读性、结构完整性、语言表达、逻辑性等方面给出评分（1-5分）和改进建议：

标题：${dto.title || '无'}
内容：
${dto.content}`;

    const systemPrompt =
      '你是一个专业的文章质量评估专家。请从可读性、结构完整性、语言表达、逻辑性等方面对文章进行评分，并提供具体的改进建议。';

    const response = await this.aiService.chat(prompt, systemPrompt);
    return {
      analysis: response.content,
      usage: response.usage,
    };
  }
}

