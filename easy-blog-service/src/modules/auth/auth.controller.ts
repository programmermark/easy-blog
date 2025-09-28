import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user123' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: '张三' },
            role: { type: 'string', example: 'READER' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '用户不存在' },
        error: { type: 'string', example: 'USER_NOT_FOUND' },
        statusCode: { type: 'number', example: 404 },
        details: { type: 'string', example: '邮箱 user@example.com 未注册' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid password',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '密码错误' },
        error: { type: 'string', example: 'INVALID_PASSWORD' },
        statusCode: { type: 'number', example: 401 },
        details: { type: 'string', example: '请检查密码是否正确' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // 设置 HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24小时
    });

    // 返回用户信息和 token
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user123' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: '张三' },
            role: { type: 'string', example: 'USER' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);

    // 设置 HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24小时
    });

    // 返回用户信息和 token
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: '张三' },
        avatarUrl: {
          type: 'string',
          example: 'https://example.com/avatar.jpg',
          nullable: true,
        },
        role: { type: 'string', example: 'USER' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    // 清除 cookie
    res.clearCookie('access_token');

    return {
      message: 'Logout successful',
    };
  }
}
