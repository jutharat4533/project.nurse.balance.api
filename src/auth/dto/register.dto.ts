import { Trim } from '@/common/decorators/trim.decorator';
import { Gender } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  @Trim()
  @IsOptional()
  dob?: Date;

  @IsEnum(Gender)
  @Trim()
  @IsOptional()
  gender?: Gender;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  password: string;
}
