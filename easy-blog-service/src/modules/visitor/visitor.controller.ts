import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorLoginDto } from './dto/create-visitor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('visitor')
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @Post('login')
  @ApiOperation({ summary: '访客登录或注册' })
  @ApiResponse({
    status: 200,
    description: '访客登录成功',
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱已存在' })
  async login(@Body() loginDto: VisitorLoginDto) {
    const visitor = await this.visitorService.loginOrCreate(loginDto);

    return {
      success: true,
      message: '访客登录成功',
      data: visitor,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取访客信息' })
  @ApiParam({ name: 'id', description: '访客ID' })
  @ApiResponse({
    status: 200,
    description: '获取访客信息成功',
  })
  @ApiResponse({ status: 404, description: '访客不存在' })
  async findOne(@Param('id') id: string) {
    const visitor = await this.visitorService.findById(id);

    return {
      success: true,
      data: visitor,
    };
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新访客头像' })
  @ApiParam({ name: 'id', description: '访客ID' })
  @ApiResponse({
    status: 200,
    description: '头像更新成功',
  })
  @ApiResponse({ status: 404, description: '访客不存在' })
  async updateAvatar(
    @Param('id') id: string,
    @Body() body: { avatarUrl: string },
  ) {
    const visitor = await this.visitorService.updateAvatar(id, body.avatarUrl);

    return {
      success: true,
      message: '头像更新成功',
      data: visitor,
    };
  }
}
