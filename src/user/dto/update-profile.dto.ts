import { Trim } from '@/common/decorators/trim.decorator';
import { Gender } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Trim()
  firstName?: string;

  @IsString()
  @IsOptional()
  @Trim()
  lastName?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
