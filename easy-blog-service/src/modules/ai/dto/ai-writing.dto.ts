import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { QwenModel } from './qwen-models.dto';

/**
 * 标题风格枚举
 */
export enum TitleStyle {
  CONCISE = 'concise', // 简洁
  ATTRACTIVE = 'attractive', // 吸引人
  TECHNICAL = 'technical', // 技术风格
  SEO = 'seo', // SEO优化
}

/**
 * 生成标题请求 DTO
 */
export class GenerateTitleDto {
  @ApiProperty({
    description: '文章内容',
    example: '这是一篇关于NestJS框架的技术文章...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '标题风格',
    enum: TitleStyle,
    example: TitleStyle.ATTRACTIVE,
    required: false,
  })
  @IsEnum(TitleStyle)
  @IsOptional()
  style?: TitleStyle;
}

/**
 * 生成摘要请求 DTO
 */
export class GenerateSummaryDto {
  @ApiProperty({
    description: '文章内容',
    example: '这是一篇很长的文章内容...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '摘要最大长度（字符数）',
    example: 200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  maxLength?: number;
}

/**
 * 生成内容请求 DTO
 */
export class GenerateContentDto {
  @ApiProperty({
    description: '写作提示词',
    example: '写一篇关于TypeScript的技术文章',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: '上下文信息',
    example: '目标读者是中级开发者',
    required: false,
  })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({
    description: '使用的模型',
    enum: QwenModel,
    example: QwenModel.QWEN_PLUS,
    required: false,
  })
  @IsEnum(QwenModel)
  @IsOptional()
  model?: QwenModel;
}

/**
 * 优化内容请求 DTO
 */
export class OptimizeContentDto {
  @ApiProperty({
    description: '待优化的内容',
    example: '这是一段需要优化的文本...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '优化指令',
    example: '使语言更专业',
    required: false,
  })
  @IsString()
  @IsOptional()
  instruction?: string;

  @ApiProperty({
    description: '使用的模型',
    enum: QwenModel,
    example: QwenModel.QWEN_PLUS,
    required: false,
  })
  @IsEnum(QwenModel)
  @IsOptional()
  model?: QwenModel;
}

/**
 * 续写请求 DTO
 */
export class ContinueWritingDto {
  @ApiProperty({
    description: '当前文章内容',
    example: 'NestJS是一个强大的Node.js框架...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '续写位置（字符位置，可选）',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}

/**
 * 分析文章请求 DTO
 */
export class AnalyzeArticleDto {
  @ApiProperty({
    description: '文章内容',
    example: '文章完整内容...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '文章标题',
    example: '文章标题',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;
}

