import { Controller, Get, Patch } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Patch('/me/profile')
  editProfile() {}

  @Get('/:userId/profile')
  getUserProfile() {}
}
