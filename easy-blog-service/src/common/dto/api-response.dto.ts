import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: '请求是否成功',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: '响应消息',
    example: 'Success',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: '错误信息',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: '响应时间戳',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error(message: string, error?: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, message, null, error);
  }
}
