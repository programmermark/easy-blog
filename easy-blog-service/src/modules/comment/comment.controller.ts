import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    // 如果请求中有JWT token，使用用户身份
    if (req.user) {
      const authorId = req.user.id;
      return this.commentService.create(createCommentDto, authorId);
    }

    // 否则使用访客身份
    const { visitorId } = createCommentDto;
    if (!visitorId) {
      throw new Error('Visitor ID is required for guest comments');
    }

    return this.commentService.create(createCommentDto, undefined, visitorId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments by post ID' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
  })
  findByPostId(@Param('postId') postId: string) {
    return this.commentService.findByPostId(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.commentService.remove(id, userId);
  }
}
