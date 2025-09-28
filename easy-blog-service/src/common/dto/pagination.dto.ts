import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: '页码，从1开始',
    example: 1,
    default: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({
    description: '每页数量，最小为1',
    example: 10,
    default: 10,
    type: Number,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: '搜索关键词',
    example: '博客',
    type: String,
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: '排序字段',
    example: 'createdAt',
    type: String,
    required: false,
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: '排序方向',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
    required: false,
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
