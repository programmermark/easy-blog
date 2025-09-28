import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCommentDto: CreateCommentDto, authorId?: string, visitorId?: string) {
    const { content, postId, parentId } = createCommentDto;

    // 验证文章是否存在
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 如果指定了父评论，验证父评论是否存在
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    // 验证必须提供authorId或visitorId之一
    if (!authorId && !visitorId) {
      throw new NotFoundException('Author ID or Visitor ID is required');
    }

    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        visitorId,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        visitor: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            site: true,
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
            visitor: {
              select: {
                id: true,
                nickname: true,
                avatarUrl: true,
                site: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findByPostId(postId: string) {
    // 获取所有评论（包括多级回复）
    const allComments = await this.prisma.comment.findMany({
      where: {
        postId,
        isApproved: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        visitor: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            site: true,
          },
        },
        parent: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            visitor: {
              select: {
                id: true,
                nickname: true,
                avatarUrl: true,
                site: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // 构建层级结构
    const topLevelComments = allComments.filter(comment => !comment.parentId);
    const replyComments = allComments.filter(comment => comment.parentId);

    // 为每个顶级评论分配所有回复（包括多级回复）
    return topLevelComments.map(topComment => {
      // 找到所有回复（包括对回复的回复）
      const getAllReplies = (parentId: string): any[] => {
        return replyComments
          .filter(reply => reply.parentId === parentId)
          .map(reply => ({
            ...reply,
            replies: getAllReplies(reply.id), // 递归获取子回复
          }));
      };

      return {
        ...topComment,
        replies: getAllReplies(topComment.id),
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        visitor: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            site: true,
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
            visitor: {
              select: {
                id: true,
                nickname: true,
                avatarUrl: true,
                site: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 只有评论作者可以删除自己的评论
    if (comment.authorId !== userId) {
      throw new NotFoundException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
