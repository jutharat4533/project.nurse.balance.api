import { AuthService } from '@/auth/auth.service';
import { LoginResponseDto } from '@/auth/dto/login-response.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<MessageResponseDto> {
    await this.authService.register(registerDto);
    return { message: 'Registered successful' };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getMe(@CurrentUser('sub') id: string): Promise<UserResponseDto> {
    return this.authService.getMe(id);
  }
}
