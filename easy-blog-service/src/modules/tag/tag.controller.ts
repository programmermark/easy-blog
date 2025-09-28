import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建标签' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: '标签创建成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tag123' },
        name: { type: 'string', example: 'JavaScript' },
        slug: { type: 'string', example: 'javascript' },
        description: {
          type: 'string',
          example: 'JavaScript 编程语言相关的内容',
        },
        color: { type: 'string', example: '#f39c12' },
      },
    },
  })
  @ApiResponse({ status: 409, description: '标签名称或别名已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  @ApiResponse({
    status: 200,
    description: '标签列表',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'tag123' },
          name: { type: 'string', example: 'JavaScript' },
          slug: { type: 'string', example: 'javascript' },
          description: {
            type: 'string',
            example: 'JavaScript 编程语言相关的内容',
          },
          color: { type: 'string', example: '#f39c12' },
          _count: {
            type: 'object',
            properties: {
              posts: { type: 'number', example: 3 },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({
    status: 200,
    description: '标签详情',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tag123' },
        name: { type: 'string', example: 'JavaScript' },
        slug: { type: 'string', example: 'javascript' },
        description: {
          type: 'string',
          example: 'JavaScript 编程语言相关的内容',
        },
        color: { type: 'string', example: '#f39c12' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '标签不存在' })
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取标签' })
  @ApiParam({ name: 'slug', description: '标签别名' })
  @ApiResponse({
    status: 200,
    description: '标签详情',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tag123' },
        name: { type: 'string', example: 'JavaScript' },
        slug: { type: 'string', example: 'javascript' },
        description: {
          type: 'string',
          example: 'JavaScript 编程语言相关的内容',
        },
        color: { type: 'string', example: '#f39c12' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '标签不存在' })
  findBySlug(@Param('slug') slug: string) {
    return this.tagService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: '标签更新成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tag123' },
        name: { type: 'string', example: 'JavaScript' },
        slug: { type: 'string', example: 'javascript' },
        description: {
          type: 'string',
          example: 'JavaScript 编程语言相关的内容',
        },
        color: { type: 'string', example: '#f39c12' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @ApiResponse({ status: 409, description: '标签名称或别名已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除标签' })
  @ApiParam({ name: 'id', description: '标签ID' })
  @ApiResponse({
    status: 200,
    description: '标签删除成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '标签删除成功' },
      },
    },
  })
  @ApiResponse({ status: 404, description: '标签不存在' })
  @ApiResponse({ status: 409, description: '无法删除，该标签下还有文章' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
