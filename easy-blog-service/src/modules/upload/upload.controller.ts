import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 生成日期目录
          const now = new Date();
          const dateDir = now.toISOString().split('T')[0]; // yyyy-MM-dd
          const uploadPath = `uploads/${dateDir}`;

          // 确保目录存在
          const fs = require('fs');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // 生成hash文件名
          const crypto = require('crypto');
          const ext = require('path').extname(file.originalname);
          const hash = crypto
            .createHash('md5')
            .update(file.originalname + Date.now().toString())
            .digest('hex');

          cb(null, `${hash}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: '/uploads/2024-01-01/abc123.jpg' },
        filename: { type: 'string', example: 'abc123.jpg' },
        originalName: { type: 'string', example: 'avatar.jpg' },
        size: { type: 'number', example: 1024000 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 验证文件类型
    if (!this.uploadService.validateFileType(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    // 验证文件大小
    if (!this.uploadService.validateFileSize(file.size)) {
      throw new BadRequestException('File too large. Maximum size is 2MB.');
    }

    // 文件已经保存到正确位置，直接生成URL
    const path = require('path');
    const relativePath = path.relative('uploads', file.path);
    const url = `/uploads/${relativePath}`;

    return {
      url,
      filename: path.basename(file.path),
      originalName: file.originalname,
      size: file.size,
    };
  }
}
