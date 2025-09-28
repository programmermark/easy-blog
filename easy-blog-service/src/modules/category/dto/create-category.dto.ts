import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: '分类名称',
    example: '技术分享',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '分类别名（URL友好）',
    example: 'tech',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: '分类描述',
    example: '分享技术相关的文章和心得',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '分类颜色（十六进制颜色代码）',
    example: '#3498db',
    type: String,
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
}
