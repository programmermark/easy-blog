import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, description, color } = createCategoryDto;

    // 生成 slug（如果没有提供）
    const categorySlug = slug || this.generateSlug(name);

    // 检查名称是否已存在
    const existingByName = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingByName) {
      throw new ConflictException('分类名称已存在');
    }

    // 检查 slug 是否已存在
    const existingBySlug = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingBySlug) {
      throw new ConflictException('分类别名已存在');
    }

    // 创建分类
    const category = await this.prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        description,
        color,
      },
    });

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name, slug, description, color } = updateCategoryDto;

    // 检查分类是否存在
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('分类不存在');
    }

    // 如果更新名称，检查是否重复
    if (name && name !== existingCategory.name) {
      const existingByName = await this.prisma.category.findUnique({
        where: { name },
      });

      if (existingByName) {
        throw new ConflictException('分类名称已存在');
      }
    }

    // 如果更新 slug，检查是否重复
    const categorySlug =
      slug || (name ? this.generateSlug(name) : existingCategory.slug);

    if (categorySlug !== existingCategory.slug) {
      const existingBySlug = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (existingBySlug) {
        throw new ConflictException('分类别名已存在');
      }
    }

    // 更新分类
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: categorySlug }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return category;
  }

  async remove(id: string) {
    // 检查分类是否存在
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('分类不存在');
    }

    // 检查是否有文章使用此分类
    const postsCount = await this.prisma.post.count({
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
    });

    if (postsCount > 0) {
      throw new ConflictException('无法删除，该分类下还有文章');
    }

    // 删除分类
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: '分类删除成功' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符替换为单个
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
      .trim();
  }
}
