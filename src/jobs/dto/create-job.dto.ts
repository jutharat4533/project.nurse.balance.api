import { Trim } from '@/common/decorators/trim.decorator';
import { JobStatus } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  location: string;

  @IsString()
  @Trim()
  @IsOptional()
  aboutWord?: string;

  @IsNumber()
  @Min(0, { message: 'Compensation must be at least 0' })
  @Type(() => Number)
  compensation: number;

  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;

  @IsBoolean()
  @Type(() => Boolean)
  isHighlighted: boolean;
}
