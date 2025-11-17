import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QwenModel } from './qwen-models.dto';

/**
 * 消息角色枚举
 */
export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

/**
 * 消息对象
 */
export class ChatMessageDto {
  @ApiProperty({
    description: '消息角色',
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @IsEnum(MessageRole)
  @IsNotEmpty()
  role: MessageRole;

  @ApiProperty({
    description: '消息内容',
    example: '你是谁？',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

/**
 * 创建聊天请求 DTO
 */
export class CreateChatCompletionDto {
  @ApiProperty({
    description: '模型名称',
    enum: QwenModel,
    example: QwenModel.QWEN_PLUS,
    default: QwenModel.QWEN_PLUS,
  })
  @IsEnum(QwenModel)
  @IsOptional()
  model?: QwenModel | string;

  @ApiProperty({
    description: '消息列表',
    type: [ChatMessageDto],
    example: [
      { role: MessageRole.SYSTEM, content: 'You are a helpful assistant.' },
      { role: MessageRole.USER, content: '你是谁？' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  @IsNotEmpty()
  messages: ChatMessageDto[];

  @ApiProperty({
    description: '温度参数，控制输出的随机性，范围 0-2',
    example: 0.7,
    required: false,
  })
  @IsOptional()
  temperature?: number;

  @ApiProperty({
    description: '最大生成 token 数',
    example: 2000,
    required: false,
  })
  @IsOptional()
  max_tokens?: number;
}

