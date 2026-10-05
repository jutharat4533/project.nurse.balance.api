import { AccessTokenService } from '@/auth/access-token.service';
import { LoginResponseDto } from '@/auth/dto/login-response.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { BcryptService } from '@/infrastructure/hash/bcrypt.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UserService } from '@/user/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    await this.userService.createUser(dto);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.bcryptService.compare(
      dto.password,
      user.password
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.accessTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        gender: user.gender,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  async getMe(id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
