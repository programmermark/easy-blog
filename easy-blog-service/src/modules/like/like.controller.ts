import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { LikePostDto } from './dto/like-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like for a post' })
  @ApiResponse({
    status: 200,
    description: 'Like toggled successfully',
    schema: {
      type: 'object',
      properties: {
        liked: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  toggleLike(@Body() likePostDto: LikePostDto, @Request() req) {
    const userId = req.user.id;
    return this.likeService.toggleLike(likePostDto, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({
    status: 201,
    description: 'Post liked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 409, description: 'Already liked' })
  likePost(@Body() likePostDto: LikePostDto, @Request() req) {
    const userId = req.user.id;
    return this.likeService.likePost(likePostDto, userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({
    status: 200,
    description: 'Post unliked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  unlikePost(@Body() likePostDto: LikePostDto, @Request() req) {
    const userId = req.user.id;
    return this.likeService.unlikePost(likePostDto, userId);
  }

  @Get('post/:postId/count')
  @ApiOperation({ summary: 'Get like count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Like count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 42 },
      },
    },
  })
  getPostLikes(@Param('postId') postId: string) {
    return this.likeService.getPostLikes(postId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user likes' })
  @ApiResponse({
    status: 200,
    description: 'User likes retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUserLikes(@Request() req) {
    const userId = req.user.id;
    return this.likeService.getUserLikes(userId);
  }

  @Get('post/:postId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user liked a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Like status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        liked: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  isLikedByUser(@Param('postId') postId: string, @Request() req) {
    const userId = req.user.id;
    return this.likeService.isLikedByUser(postId, userId);
  }
}
