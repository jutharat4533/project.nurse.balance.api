import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateShiftCompensationDto {
  @IsNumber({}, { message: 'Shift ID must be a number' })
  @Type(() => Number)
  shiftId: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Pay rate must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Pay rate cannot be negative' })
  @Type(() => Number)
  payRate: number;

  @IsString()
  @IsNotEmpty({ message: 'Shift type is required' })
  @Trim()
  shiftType: string;
}

export class UpdateShiftCompensationDto {
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Pay rate must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Pay rate cannot be negative' })
  @Type(() => Number)
  payRate?: number;

  @IsString()
  @IsOptional()
  @Trim()
  shiftType?: string;
}
