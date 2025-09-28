import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { InvalidPasswordException } from '../../common/exceptions/invalid-password.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('Validating user:', email);
    const user = await this.userService.findByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw new UserNotFoundException(email);
    }

    console.log('User passwordHash exists:', !!user.passwordHash);
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('用户已存在');
    }

    // 创建用户（用户服务内部会处理密码加密）
    const user = await this.userService.create({
      email,
      password,
      name,
    });

    // 生成 JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUserById(userId: string) {
    const user = await this.userService.findOne(userId);
    if (user) {
      const { passwordHash, ...result } = user as any;
      return result;
    }
    return null;
  }

  async getCurrentUser(userId: string) {
    const user = await this.userService.findOne(userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
