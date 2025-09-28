import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: '用户不存在',
        error: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
        details: `邮箱 ${email} 未注册`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
