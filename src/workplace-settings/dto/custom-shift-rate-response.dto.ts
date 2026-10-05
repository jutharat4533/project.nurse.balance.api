import { ShiftCategory } from '@/database/generated/prisma/enums';

export class CustomShiftRateResponseDto {
  id: number;
  workplaceSettingId: number;
  category: ShiftCategory;
  shiftName: string;
  payRate: number;
}
