import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Trim } from '@/common/decorators/trim.decorator';

export class CreateSpecialIncomeDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;
}

export class UpdateSpecialIncomeDto extends PartialType(CreateSpecialIncomeDto) {}

export class SpecialIncomeResponseDto {
  id: number;
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
