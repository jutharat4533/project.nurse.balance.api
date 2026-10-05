import { PrismaService } from '@/database/prisma.service';
import { CreateShiftDto } from '@/shifts/dto/create-shift.dto';
import { ShiftResponseDto } from '@/shifts/dto/shift-response.dto';
import { UpdateShiftDto } from '@/shifts/dto/update-shift.dto';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(shift: {
    id: number;
    workplace: string;
    workplaceSettingId: number | null;
    startTime: Date;
    endTime: Date;
    shiftSlot: ShiftResponseDto['shiftSlot'];
    status: ShiftResponseDto['status'];
    createdAt: Date;
    updatedAt: Date;
  }): ShiftResponseDto {
    return shift;
  }

  async createShift(
    userId: string,
    input: CreateShiftDto
  ): Promise<ShiftResponseDto> {
    try {
      const workplaceSetting = await this.prisma.userWorkplaceSetting.findFirst(
        {
          where: {
            id: input.workplaceSettingId,
            userId
          }
        }
      );

      if (!workplaceSetting) {
        throw new NotFoundException('Workplace setting not found');
      }

      const shift = await this.prisma.shift.create({
        data: {
          workplace: workplaceSetting.workplaceName,
          workplaceSettingId: workplaceSetting.id,
          startTime: input.startTime,
          endTime: input.endTime,
          shiftSlot: input.shiftSlot,
          status: input.status,
          userId
        }
      });
      return this.toResponse(shift);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('Database at Shift Error:', error);
      throw new InternalServerErrorException('Failed to create shift');
    }
  }

  //PATH GET/shift
  async getShiftsByUserId(userId: string): Promise<ShiftResponseDto[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' }
    });
    return shifts.map((shift) => this.toResponse(shift));
  }

  //PATH PUT/shift
  async updateShiftByUserId(
    id: string,
    userId: string,
    updateShiftDto: UpdateShiftDto
  ): Promise<ShiftResponseDto> {
    const shiftId = Number(id);
    if (Number.isNaN(shiftId)) {
      throw new NotFoundException('Invalid shift ID format');
    }

    const shift = await this.prisma.shift.findFirst({
      where: { id: shiftId, userId }
    });

    if (!shift) {
      throw new NotFoundException('Shift not found for this user');
    }

    let workplace = shift.workplace;
    let workplaceSettingId = shift.workplaceSettingId;

    if (updateShiftDto.workplaceSettingId !== undefined) {
      const workplaceSetting = await this.prisma.userWorkplaceSetting.findFirst(
        {
          where: { id: updateShiftDto.workplaceSettingId, userId }
        }
      );

      if (!workplaceSetting) {
        throw new NotFoundException('Workplace setting not found');
      }

      workplace = workplaceSetting.workplaceName;
      workplaceSettingId = workplaceSetting.id;
    }

    const updatedShift = await this.prisma.shift.update({
      where: { id: shiftId },
      data: {
        workplace,
        workplaceSettingId,
        startTime: updateShiftDto.startTime,
        endTime: updateShiftDto.endTime,
        shiftSlot: updateShiftDto.shiftSlot,
        status: updateShiftDto.status
      }
    });

    return this.toResponse(updatedShift);
  }

  //PATH DELETE/shift
  async deleteShiftById(
    shiftId: string,
    userId: string
  ): Promise<ShiftResponseDto> {
    const idNum = Number(shiftId);

    if (isNaN(idNum)) {
      throw new NotFoundException('Invalid shift ID format');
    }

    const shift = await this.prisma.shift.findUnique({
      where: { id: idNum }
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (shift.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only delete your own shifts'
      );
    }

    const deletedShift = await this.prisma.shift.delete({
      where: { id: idNum }
    });

    return deletedShift;
  }
}
