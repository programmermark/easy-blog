import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: '标签名称',
    example: 'JavaScript',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '标签别名（URL友好）',
    example: 'javascript',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: '标签描述',
    example: 'JavaScript 编程语言相关的内容',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '标签颜色（十六进制颜色代码）',
    example: '#f39c12',
    type: String,
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;
}
