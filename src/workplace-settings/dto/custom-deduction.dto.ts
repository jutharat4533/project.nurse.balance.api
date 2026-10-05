import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateCustomDeductionDto {
  @IsNumber({}, { message: 'Workplace setting ID must be a number' })
  @Type(() => Number)
  workplaceSettingId: number;

  @IsString()
  @IsNotEmpty({ message: 'Deduction name is required' })
  @Trim()
  name: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Amount cannot be negative' })
  @Type(() => Number)
  amount: number;

  @IsBoolean({ message: 'Is percent must be a boolean' })
  @IsOptional()
  @Type(() => Boolean)
  isPercent?: boolean;
}

export class UpdateCustomDeductionDto {
  @IsString()
  @IsOptional()
  @Trim()
  name?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with up to 2 decimal places' }
  )
  @Min(0, { message: 'Amount cannot be negative' })
  @Type(() => Number)
  amount?: number;

  @IsBoolean({ message: 'Is percent must be a boolean' })
  @IsOptional()
  @Type(() => Boolean)
  isPercent?: boolean;
}
