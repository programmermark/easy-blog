import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '评论内容',
    example: '这是一条很有用的评论！',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '文章ID',
    example: 'post123',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: '父评论ID（用于回复）',
    example: 'comment123',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: '访客ID（访客评论时使用）',
    example: 'visitor123',
    required: false,
  })
  @IsString()
  @IsOptional()
  visitorId?: string;
}
