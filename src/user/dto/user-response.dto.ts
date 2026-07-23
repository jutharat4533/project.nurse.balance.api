import { Gender } from '@/database/generated/prisma/enums';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  dob: Date | null;

  gender: Gender | null;

  avatarUrl: string | null;

  createdAt: Date;

  updatedAt: Date;
}
