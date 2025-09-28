import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// 为枚举添加 Swagger 描述
export const PostStatusDescription = {
  [PostStatus.DRAFT]: '草稿',
  [PostStatus.PUBLISHED]: '已发布',
  [PostStatus.ARCHIVED]: '已归档',
};

export class CreatePostDto {
  @ApiProperty({
    description: '文章标题',
    example: '我的第一篇博客文章',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '文章别名（URL友好）',
    example: 'my-first-blog-post',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: '文章摘要',
    example: '这是文章的简要描述...',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({
    description: '文章内容',
    example: '这是文章的完整内容...',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '文章封面图片URL',
    example: 'https://example.com/image.jpg',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: '文章状态',
    enum: PostStatus,
    enumName: 'PostStatus',
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT,
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus = PostStatus.DRAFT;

  @ApiProperty({
    description: '分类ID数组',
    example: ['category1', 'category2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({
    description: '标签ID数组',
    example: ['tag1', 'tag2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}
