import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVisitorDto, VisitorLoginDto } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(private readonly prisma: PrismaService) { }

  async loginOrCreate(loginDto: VisitorLoginDto) {
    const { nickname, email, site } = loginDto;

    // 首先尝试根据邮箱查找现有访客
    let visitor = await this.prisma.visitor.findUnique({
      where: { email },
    });

    if (visitor) {
      // 如果访客存在，更新昵称和网站信息（如果提供了新信息）
      visitor = await this.prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          nickname,
          ...(site && { site }),
        },
      });
    } else {
      // 如果访客不存在，创建新访客
      try {
        visitor = await this.prisma.visitor.create({
          data: {
            nickname,
            email,
            site,
          },
        });
      } catch (error) {
        // 处理并发创建时的冲突
        if (error.code === 'P2002') {
          visitor = await this.prisma.visitor.findUnique({
            where: { email },
          });
          if (!visitor) {
            throw new ConflictException('访客创建失败');
          }
        } else {
          throw error;
        }
      }
    }

    return visitor;
  }

  async findById(id: string) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException('访客不存在');
    }

    return visitor;
  }

  async findByEmail(email: string) {
    return this.prisma.visitor.findUnique({
      where: { email },
    });
  }

  async updateAvatar(id: string, avatarUrl: string) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException('访客不存在');
    }

    return this.prisma.visitor.update({
      where: { id },
      data: { avatarUrl },
    });
  }
}
