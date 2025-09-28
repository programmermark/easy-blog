import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ProfileService } from './profile.service';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  wechat?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  avatarBase64?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  @ApiOperation({ summary: 'Get public profile' })
  getProfile() {
    return this.profileService.get();
  }

  @Put()
  @ApiOperation({ summary: 'Update public profile' })
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}


