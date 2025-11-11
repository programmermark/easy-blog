import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const GLOBAL_PREFIX = 'blog-service';
  process.env.API_GLOBAL_PREFIX = GLOBAL_PREFIX;
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cookie 解析中间件
  app.use(cookieParser());

  // CORS 配置
  app.enableCors({
    origin: true, // 允许所有来源
    credentials: true, // 允许发送 cookies
  });

  // 静态文件服务
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: `/${GLOBAL_PREFIX}/uploads/`,
  });

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('Easy Blog API')
    .setDescription('Easy Blog 博客系统 API 文档')
    .setVersion('1.0.0')
    .addTag('auth', '用户认证')
    .addTag('users', '用户管理')
    .addTag('posts', '文章管理')
    .addTag('health', '系统健康')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 简化的 Swagger UI 配置
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true, // 保持认证状态
      displayRequestDuration: true, // 显示请求耗时
      filter: true, // 启用搜索过滤
      deepLinking: true, // 启用深度链接
    },
    customSiteTitle: 'Easy Blog API 文档',
    customCss: `
      .swagger-ui .topbar { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px 0;
      }
      .swagger-ui .info .title {
        color: #2c3e50;
        font-size: 36px;
        font-weight: 600;
      }
      .swagger-ui .opblock {
        border-radius: 8px;
        margin: 10px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .swagger-ui .btn.execute {
        background-color: #27ae60;
        border-color: #27ae60;
        border-radius: 6px;
      }
      .swagger-ui .btn.authorize {
        background-color: #3498db;
        border-color: #3498db;
        border-radius: 6px;
      }
    `,
  };

  SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, document, customOptions);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${port}/${GLOBAL_PREFIX}/docs`,
  );
}
bootstrap();
