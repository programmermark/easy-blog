import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      name: '管理员',
      role: 'ADMIN',
    },
  });

  // 创建作者用户
  const authorPassword = await bcrypt.hash('author123', 12);
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      email: 'author@example.com',
      passwordHash: authorPassword,
      name: '作者',
      role: 'AUTHOR',
    },
  });

  // 创建普通用户
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPassword,
      name: '用户',
      role: 'READER',
    },
  });

  // 创建分类
  const technologyCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: '技术',
      slug: 'technology',
    },
  });

  const lifeCategory = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: {
      name: '生活',
      slug: 'life',
    },
  });

  // 创建标签
  const javascriptTag = await prisma.tag.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      name: 'JavaScript',
      slug: 'javascript',
    },
  });

  const nestjsTag = await prisma.tag.upsert({
    where: { slug: 'nestjs' },
    update: {},
    create: {
      name: 'NestJS',
      slug: 'nestjs',
    },
  });

  const prismaTag = await prisma.tag.upsert({
    where: { slug: 'prisma' },
    update: {},
    create: {
      name: 'Prisma',
      slug: 'prisma',
    },
  });

  // 创建示例文章
  const samplePost = await prisma.post.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: 'Hello World - 欢迎使用 Easy Blog',
      slug: 'hello-world',
      summary: '这是 Easy Blog 系统的第一篇示例文章，展示了系统的基本功能。',
      content: `# Hello World

欢迎使用 Easy Blog 系统！

这是一个基于 NestJS 和 Prisma 构建的现代化博客系统。

## 主要特性

- 🚀 基于 NestJS 框架
- 🗄️ 使用 Prisma ORM
- 🔐 JWT 认证
- 📝 支持 Markdown
- 🏷️ 分类和标签系统
- 💬 评论功能
- 👍 点赞和收藏

## 技术栈

- **后端**: NestJS + Prisma + PostgreSQL
- **认证**: JWT + Passport
- **验证**: class-validator
- **文档**: Swagger/OpenAPI

开始你的博客之旅吧！`,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: author.id,
      categories: {
        connect: [{ id: technologyCategory.id }],
      },
      tags: {
        connect: [{ id: nestjsTag.id }, { id: prismaTag.id }],
      },
    },
  });

  console.log('数据库初始化完成！');
  console.log('创建的用户:');
  console.log(`- 管理员: ${admin.email} (密码: admin123)`);
  console.log(`- 作者: ${author.email} (密码: author123)`);
  console.log(`- 用户: ${user.email} (密码: user123)`);
  console.log('创建的分类:', technologyCategory.name, lifeCategory.name);
  console.log(
    '创建的标签:',
    javascriptTag.name,
    nestjsTag.name,
    prismaTag.name,
  );
  console.log('创建的示例文章:', samplePost.title);
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
