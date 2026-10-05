import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '@/common/decorators/trim.decorator';

// อ้างอิง Enum จาก Prisma Schema ของคุณ
export enum ShiftCategory {
  ONE_SHIFT = 'ONE_SHIFT',
  TWO_SHIFT = 'TWO_SHIFT',
  THREE_SHIFT = 'THREE_SHIFT'
}

export class CreateCustomShiftRateDto {
  @IsNumber({}, { message: 'Workplace setting ID must be a number' })
  @Type(() => Number)
  workplaceSettingId: number;

  @IsEnum(ShiftCategory, { message: 'Invalid shift category' })
  category: ShiftCategory;

  @IsString()
  @IsNotEmpty({ message: 'Shift name is required' })
  @Trim()
  shiftName: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Pay rate must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Pay rate cannot be negative' })
  @Type(() => Number)
  payRate: number;
}

export class UpdateCustomShiftRateDto {
  @IsEnum(ShiftCategory, { message: 'Invalid shift category' })
  @IsOptional()
  category?: ShiftCategory;

  @IsString()
  @IsOptional()
  @Trim()
  shiftName?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Pay rate must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Pay rate cannot be negative' })
  @Type(() => Number)
  payRate?: number;
}
