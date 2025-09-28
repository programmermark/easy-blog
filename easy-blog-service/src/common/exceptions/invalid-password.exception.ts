import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super(
      {
        message: '密码错误',
        error: 'INVALID_PASSWORD',
        statusCode: HttpStatus.UNAUTHORIZED,
        details: '请检查密码是否正确',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
