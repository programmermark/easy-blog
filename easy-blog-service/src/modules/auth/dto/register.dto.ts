import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({
    description: '用户姓名',
    example: '张三',
  })
  @IsString({ message: '姓名必须是字符串' })
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;
}
