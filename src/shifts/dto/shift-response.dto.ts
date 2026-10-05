import { ShiftSlot, ShiftStatus } from '@/database/generated/prisma/enums';

export class ShiftResponseDto {
  id: number;

  workplace: string;

  workplaceSettingId: number | null;

  startTime: Date;

  endTime: Date;

  shiftSlot: ShiftSlot | null;

  status: ShiftStatus;

  createdAt: Date;

  updatedAt: Date;
}
