import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '用户密码，最少6位（可选）',
    example: '123456',
    type: String,
    minLength: 6,
    required: false,
  })
  password?: string;
}
