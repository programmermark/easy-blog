import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const { name, slug, description, color } = createTagDto;

    // 生成 slug（如果没有提供）
    const tagSlug = slug || this.generateSlug(name);

    // 检查名称是否已存在
    const existingByName = await this.prisma.tag.findUnique({
      where: { name },
    });

    if (existingByName) {
      throw new ConflictException('标签名称已存在');
    }

    // 检查 slug 是否已存在
    const existingBySlug = await this.prisma.tag.findUnique({
      where: { slug: tagSlug },
    });

    if (existingBySlug) {
      throw new ConflictException('标签别名已存在');
    }

    // 创建标签
    const tag = await this.prisma.tag.create({
      data: {
        name,
        slug: tagSlug,
        description,
        color,
      },
    });

    return tag;
  }

  async findAll() {
    return this.prisma.tag.findMany({
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
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  async findBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const { name, slug, description, color } = updateTagDto;

    // 检查标签是否存在
    const existingTag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      throw new NotFoundException('标签不存在');
    }

    // 如果更新名称，检查是否重复
    if (name && name !== existingTag.name) {
      const existingByName = await this.prisma.tag.findUnique({
        where: { name },
      });

      if (existingByName) {
        throw new ConflictException('标签名称已存在');
      }
    }

    // 如果更新 slug，检查是否重复
    const tagSlug = slug || (name ? this.generateSlug(name) : existingTag.slug);

    if (tagSlug !== existingTag.slug) {
      const existingBySlug = await this.prisma.tag.findUnique({
        where: { slug: tagSlug },
      });

      if (existingBySlug) {
        throw new ConflictException('标签别名已存在');
      }
    }

    // 更新标签
    const tag = await this.prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: tagSlug }),
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

    return tag;
  }

  async remove(id: string) {
    // 检查标签是否存在
    const existingTag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      throw new NotFoundException('标签不存在');
    }

    // 检查是否有文章使用此标签
    const postsCount = await this.prisma.post.count({
      where: {
        tags: {
          some: {
            id,
          },
        },
      },
    });

    if (postsCount > 0) {
      throw new ConflictException('无法删除，该标签下还有文章');
    }

    // 删除标签
    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: '标签删除成功' };
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
