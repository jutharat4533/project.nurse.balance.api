import { Trim } from '@/common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class CreateWorkplaceSettingDto {
  @IsString()
  @IsNotEmpty({ message: 'Workplace name is required' })
  @Trim()
  workplaceName: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Base salary must be a valid number with up to 2 decimal places'
    }
  )
  @Min(0, { message: 'Base salary cannot be negative' })
  @Type(() => Number)
  baseSalary?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Special allowance must be a valid number with up to 2 decimal places'
    }
  )
  @Min(0, { message: 'Special allowance cannot be negative' })
  @Type(() => Number)
  specialAllowance?: number;
}
