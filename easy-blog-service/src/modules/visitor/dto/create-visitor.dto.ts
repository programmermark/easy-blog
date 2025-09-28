import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateVisitorDto {
  @ApiProperty({
    description: '访客昵称',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '访客邮箱',
    example: 'zhangsan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '访客个人网站',
    example: 'https://example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  site?: string;
}

export class VisitorLoginDto {
  @ApiProperty({
    description: '访客昵称',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '访客邮箱',
    example: 'zhangsan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '访客个人网站',
    example: 'https://example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  site?: string;
}
