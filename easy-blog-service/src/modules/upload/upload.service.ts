import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadPath = 'uploads';

  constructor() {
    // 确保上传目录存在
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * 生成文件存储路径
   * @param originalName 原始文件名
   * @returns 存储路径和访问URL
   */
  generateFilePath(originalName: string): { filePath: string; url: string } {
    // 获取文件扩展名
    const ext = extname(originalName);

    // 生成日期目录 (yyyy-MM-dd)
    const now = new Date();
    const dateDir = now.toISOString().split('T')[0]; // yyyy-MM-dd

    // 生成hash文件名
    const hash = createHash('md5')
      .update(originalName + now.getTime().toString())
      .digest('hex');

    const fileName = `${hash}${ext}`;
    const relativePath = join(dateDir, fileName);
    const filePath = join(this.uploadPath, relativePath);

    // 确保日期目录存在
    const dateDirPath = join(this.uploadPath, dateDir);
    if (!existsSync(dateDirPath)) {
      mkdirSync(dateDirPath, { recursive: true });
    }

    return {
      filePath,
      url: `/uploads/${relativePath}`,
    };
  }

  /**
   * 验证文件类型
   * @param mimetype MIME类型
   * @returns 是否为允许的文件类型
   */
  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedTypes.includes(mimetype);
  }

  /**
   * 验证文件大小
   * @param size 文件大小（字节）
   * @param maxSize 最大大小（字节，默认2MB）
   * @returns 是否为允许的文件大小
   */
  validateFileSize(size: number, maxSize: number = 2 * 1024 * 1024): boolean {
    return size <= maxSize;
  }
}
