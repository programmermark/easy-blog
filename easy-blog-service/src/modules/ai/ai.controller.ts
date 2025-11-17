import { Controller, Get, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateChatCompletionDto } from './dto/chat-message.dto';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('test')
  @ApiOperation({ summary: '测试通义千问接口连通性' })
  @ApiResponse({
    status: 200,
    description: '接口连通性测试成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '通义千问接口连接成功' },
        data: {
          type: 'object',
          properties: {
            model: { type: 'string', example: 'qwen-plus' },
            response: { type: 'string', example: '你好！我是通义千问...' },
            usage: {
              type: 'object',
              properties: {
                total_tokens: { type: 'number', example: 50 },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '接口连接失败或配置错误',
  })
  async testConnection() {
    try {
      // 发送一个简单的测试消息
      const response = await this.aiService.chat('你好，请简单介绍一下你自己。');

      return {
        success: true,
        message: '通义千问接口连接成功',
        data: {
          model: response.model,
          response: response.content,
          usage: response.usage,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `接口连接失败: ${error.message}`,
        error: error.message,
      };
    }
  }

  @Post('chat')
  @ApiOperation({ summary: '创建聊天补全' })
  @ApiBody({ type: CreateChatCompletionDto })
  @ApiResponse({
    status: 200,
    description: '聊天补全成功',
  })
  async createChatCompletion(@Body() dto: CreateChatCompletionDto) {
    return await this.aiService.createChatCompletion(dto);
  }
}

