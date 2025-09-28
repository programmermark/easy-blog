import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'post123' },
        title: { type: 'string', example: '我的第一篇博客文章' },
        slug: { type: 'string', example: 'my-first-blog-post' },
        content: { type: 'string', example: '这是文章的完整内容...' },
        status: { type: 'string', example: 'DRAFT' },
        authorId: { type: 'string', example: 'user123' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    const authorId = req.user.id;
    return this.postService.create(createPostDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts (admin only)' })
  @ApiQuery({ name: 'page', description: '页码', example: 1, required: false })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Return all posts',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'post123' },
              title: { type: 'string', example: '我的第一篇博客文章' },
              slug: { type: 'string', example: 'my-first-blog-post' },
              status: { type: 'string', example: 'DRAFT' },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get published posts' })
  @ApiQuery({ name: 'page', description: '页码', example: 1, required: false })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Return published posts',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'post123' },
              title: { type: 'string', example: '我的第一篇博客文章' },
              slug: { type: 'string', example: 'my-first-blog-post' },
              summary: { type: 'string', example: '这是文章的简要描述...' },
              coverImage: {
                type: 'string',
                example: 'https://example.com/image.jpg',
              },
              createdAt: {
                type: 'string',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
        total: { type: 'number', example: 50 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  findPublished(@Query() paginationDto: PaginationDto) {
    return this.postService.findPublished(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Return post by id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'post123' },
        title: { type: 'string', example: '我的第一篇博客文章' },
        slug: { type: 'string', example: 'my-first-blog-post' },
        summary: { type: 'string', example: '这是文章的简要描述...' },
        content: { type: 'string', example: '这是文章的完整内容...' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/image.jpg',
        },
        status: { type: 'string', example: 'DRAFT' },
        authorId: { type: 'string', example: 'user123' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Post slug',
    example: 'my-first-blog-post',
  })
  @ApiResponse({
    status: 200,
    description: 'Return post by slug',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'post123' },
        title: { type: 'string', example: '我的第一篇博客文章' },
        slug: { type: 'string', example: 'my-first-blog-post' },
        summary: { type: 'string', example: '这是文章的简要描述...' },
        content: { type: 'string', example: '这是文章的完整内容...' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/image.jpg',
        },
        status: { type: 'string', example: 'PUBLISHED' },
        authorId: { type: 'string', example: 'user123' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post by id (PATCH)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'post123' },
        title: { type: 'string', example: '我的第一篇博客文章' },
        slug: { type: 'string', example: 'my-first-blog-post' },
        content: { type: 'string', example: '这是文章的完整内容...' },
        status: { type: 'string', example: 'PUBLISHED' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update post by id (PUT)' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'post123' },
        title: { type: 'string', example: '我的第一篇博客文章' },
        slug: { type: 'string', example: 'my-first-blog-post' },
        content: { type: 'string', example: '这是文章的完整内容...' },
        status: { type: 'string', example: 'PUBLISHED' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  updatePut(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by id' })
  @ApiParam({ name: 'id', description: 'Post ID', example: 'post123' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
