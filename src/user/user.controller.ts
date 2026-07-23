import { Controller, Get, Patch } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Patch('/me/avatar')
  uploadAvatar() {}

  @Get('/:userId/profile')
  getUserProfile() {}
}
