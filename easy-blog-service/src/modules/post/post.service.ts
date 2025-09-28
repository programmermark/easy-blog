import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const { categoryIds, tagIds, ...postData } = createPostDto;

    // 检查 slug 是否已存在
    const existingPost = await this.prisma.post.findUnique({
      where: { slug: postData.slug },
    });

    if (existingPost) {
      throw new ConflictException('Slug already exists');
    }

    // 验证作者是否存在
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // 验证分类是否存在
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (categories.length !== categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    // 验证标签是否存在
    if (tagIds && tagIds.length > 0) {
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: tagIds } },
      });

      if (tags.length !== tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    // 准备创建数据
    const createData: any = {
      ...postData,
      authorId,
    };

    // 如果状态是发布，设置发布时间
    if (postData.status === 'PUBLISHED') {
      createData.publishedAt = new Date();
    }

    // 添加分类和标签关联
    if (categoryIds) {
      createData.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    if (tagIds) {
      createData.tags = {
        connect: tagIds.map((id) => ({ id })),
      };
    }

    const post = await this.prisma.post.create({
      data: createData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: true,
        tags: true,
      },
    });

    return post;
  }

  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { content: { contains: search, mode: 'insensitive' as any } },
            { summary: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          categories: true,
          tags: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: true,
        tags: true,
        comments: {
          where: { isApproved: true },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 增加阅读量
    await this.prisma.post.update({
      where: { id },
      data: { readCount: { increment: 1 } },
    });

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: true,
        tags: true,
        comments: {
          where: { isApproved: true },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 增加阅读量
    await this.prisma.post.update({
      where: { slug },
      data: { readCount: { increment: 1 } },
    });

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { categoryIds, tagIds, ...updateData } = updatePostDto;

    // 准备更新数据
    const updateDataWithDate: any = { ...updateData };

    // 如果状态改为发布，设置发布时间
    if (updateData.status === 'PUBLISHED') {
      updateDataWithDate.publishedAt = new Date();
    }

    // 添加分类和标签关联
    if (categoryIds) {
      updateDataWithDate.categories = {
        set: categoryIds.map((id) => ({ id })),
      };
    }

    if (tagIds) {
      updateDataWithDate.tags = {
        set: tagIds.map((id) => ({ id })),
      };
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: updateDataWithDate,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: true,
        tags: true,
      },
    });

    return post;
  }

  async remove(id: string) {
    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async findPublished(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const where = {
      status: 'PUBLISHED' as any,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as any } },
              { content: { contains: search, mode: 'insensitive' as any } },
              { summary: { contains: search, mode: 'insensitive' as any } },
            ],
          }
        : {}),
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          categories: true,
          tags: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
