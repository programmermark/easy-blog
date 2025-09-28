import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: '分类ID数组（可选）',
    example: ['category1', 'category2'],
    type: [String],
    required: false,
  })
  categoryIds?: string[];

  @ApiProperty({
    description: '标签ID数组（可选）',
    example: ['tag1', 'tag2'],
    type: [String],
    required: false,
  })
  tagIds?: string[];
}
