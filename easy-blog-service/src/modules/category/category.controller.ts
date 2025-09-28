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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建分类' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: '分类创建成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'category123' },
        name: { type: 'string', example: '技术分享' },
        slug: { type: 'string', example: 'tech' },
        description: { type: 'string', example: '分享技术相关的文章和心得' },
        color: { type: 'string', example: '#3498db' },
      },
    },
  })
  @ApiResponse({ status: 409, description: '分类名称或别名已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  @ApiResponse({
    status: 200,
    description: '分类列表',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'category123' },
          name: { type: 'string', example: '技术分享' },
          slug: { type: 'string', example: 'tech' },
          description: { type: 'string', example: '分享技术相关的文章和心得' },
          color: { type: 'string', example: '#3498db' },
          _count: {
            type: 'object',
            properties: {
              posts: { type: 'number', example: 5 },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  @ApiResponse({
    status: 200,
    description: '分类详情',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'category123' },
        name: { type: 'string', example: '技术分享' },
        slug: { type: 'string', example: 'tech' },
        description: { type: 'string', example: '分享技术相关的文章和心得' },
        color: { type: 'string', example: '#3498db' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '分类不存在' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据别名获取分类' })
  @ApiParam({ name: 'slug', description: '分类别名' })
  @ApiResponse({
    status: 200,
    description: '分类详情',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'category123' },
        name: { type: 'string', example: '技术分享' },
        slug: { type: 'string', example: 'tech' },
        description: { type: 'string', example: '分享技术相关的文章和心得' },
        color: { type: 'string', example: '#3498db' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '分类不存在' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: '分类更新成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'category123' },
        name: { type: 'string', example: '技术分享' },
        slug: { type: 'string', example: 'tech' },
        description: { type: 'string', example: '分享技术相关的文章和心得' },
        color: { type: 'string', example: '#3498db' },
        _count: {
          type: 'object',
          properties: {
            posts: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '分类不存在' })
  @ApiResponse({ status: 409, description: '分类名称或别名已存在' })
  @ApiResponse({ status: 401, description: '未授权' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除分类' })
  @ApiParam({ name: 'id', description: '分类ID' })
  @ApiResponse({
    status: 200,
    description: '分类删除成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '分类删除成功' },
      },
    },
  })
  @ApiResponse({ status: 404, description: '分类不存在' })
  @ApiResponse({ status: 409, description: '无法删除，该分类下还有文章' })
  @ApiResponse({ status: 401, description: '未授权' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
