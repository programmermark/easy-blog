import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) { }

  async get() {
    const profile = await this.prisma.profile.findUnique({ where: { id: 'singleton' } });
    if (profile) return profile;
    return this.prisma.profile.create({ data: { id: 'singleton' } });
  }

  async update(data: {
    nickname?: string;
    wechat?: string;
    phone?: string;
    email?: string;
    github?: string;
    avatarBase64?: string;
  }) {
    await this.get(); // ensure exists
    return this.prisma.profile.update({ where: { id: 'singleton' }, data });
  }
}


