import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LikePostDto } from './dto/like-post.dto';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) { }

  async likePost(likePostDto: LikePostDto, userId: string) {
    const { postId } = likePostDto;

    // 验证文章是否存在
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 检查是否已经点赞
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    // 创建点赞记录
    return this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unlikePost(likePostDto: LikePostDto, userId: string) {
    const { postId } = likePostDto;

    // 查找点赞记录
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    // 删除点赞记录
    return this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async toggleLike(likePostDto: LikePostDto, userId: string) {
    const { postId } = likePostDto;

    // 验证文章是否存在
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 检查是否已经点赞
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // 取消点赞
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return { liked: false };
    } else {
      // 添加点赞
      await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return { liked: true };
    }
  }

  async getPostLikes(postId: string) {
    return this.prisma.like.count({
      where: { postId },
    });
  }

  async getUserLikes(userId: string) {
    return this.prisma.like.findMany({
      where: { userId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isLikedByUser(postId: string, userId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return !!like;
  }
}
