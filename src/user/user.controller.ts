import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UpdateProfileDto } from '@/user/dto/update-profile.dto';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch
} from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/me/profile')
  async editProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto
  ): Promise<UserResponseDto> {
    return await this.userService.updateProfile(userId, dto);
  }

  @Get('/:userId/profile')
  async getUserProfile(
    @Param('userId') userId: string
  ): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
