import { CreateShiftDto } from '@/shifts/dto/create-shift.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {}
