import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UploadModule } from './modules/upload/upload.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikeModule } from './modules/like/like.module';
import { VisitorModule } from './modules/visitor/visitor.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    TagModule,
    ProfileModule,
    UploadModule,
    CommentModule,
    LikeModule,
    VisitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
