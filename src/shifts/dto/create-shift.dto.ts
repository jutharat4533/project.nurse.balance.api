import { ShiftSlot, ShiftStatus } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShiftDto {
  @IsNumber()
  @Type(() => Number)
  workplaceSettingId: number;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  endTime: Date;

  @IsEnum(ShiftSlot)
  @IsNotEmpty()
  shiftSlot: ShiftSlot;

  @IsEnum(ShiftStatus)
  @IsNotEmpty()
  status: ShiftStatus;
}
