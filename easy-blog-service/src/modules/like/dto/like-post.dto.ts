import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LikePostDto {
  @ApiProperty({
    description: '文章ID',
    example: 'post123',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;
}
