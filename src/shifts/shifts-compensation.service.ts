import { PrismaService } from '@/database/prisma.service';
import { ShiftCompensationResponseDto } from '@/shifts/dto/compensation-response.dto';
import {
  CreateShiftCompensationDto,
  UpdateShiftCompensationDto
} from '@/shifts/dto/compensation.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class ShiftCompensationService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREATE: เพิ่มข้อมูลค่าตอบแทนของเวร (อ้างอิงจาก Shift ของตัวเอง)
  async create(
    userId: string,
    dto: CreateShiftCompensationDto
  ): Promise<ShiftCompensationResponseDto> {
    // ตรวจสอบว่า Shift นี้มีอยู่จริง และเป็นของ User คนนี้หรือไม่
    const shift = await this.prisma.shift.findUnique({
      where: { id: dto.shiftId },
      include: { compensation: true }
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (shift.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only add compensation to your own shifts'
      );
    }

    if (shift.compensation) {
      throw new ConflictException('Compensation for this shift already exists');
    }

    const compensation = await this.prisma.shiftCompensation.create({
      data: {
        userId: userId,
        shiftId: dto.shiftId,
        payRate: dto.payRate,
        shiftType: dto.shiftType
      }
    });

    return {
      id: compensation.id,
      userId: compensation.userId,
      shiftId: compensation.shiftId,
      payRate: compensation.payRate.toNumber(),
      shiftType: compensation.shiftType
    };
  }

  // 2. READ: ดึงข้อมูลค่าตอบแทนทั้งหมดของ User
  async findAll(userId: string): Promise<ShiftCompensationResponseDto[]> {
    const compensations = await this.prisma.shiftCompensation.findMany({
      where: { userId }
    });

    return compensations.map((item) => ({
      id: item.id,
      userId: item.userId,
      shiftId: item.shiftId,
      payRate: item.payRate.toNumber(),
      shiftType: item.shiftType
    }));
  }

  // 3. UPDATE: แก้ไขข้อมูลค่าตอบแทนตาม ID ของ compensation
  async update(
    id: number,
    userId: string,
    dto: UpdateShiftCompensationDto
  ): Promise<ShiftCompensationResponseDto> {
    const compensation = await this.prisma.shiftCompensation.findUnique({
      where: { id }
    });

    if (!compensation) {
      throw new NotFoundException('Shift compensation not found');
    }

    if (compensation.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only update your own shift compensation'
      );
    }

    const updated = await this.prisma.shiftCompensation.update({
      where: { id },
      data: {
        payRate: dto.payRate,
        shiftType: dto.shiftType
      }
    });

    return {
      id: updated.id,
      userId: updated.userId,
      shiftId: updated.shiftId,
      payRate: updated.payRate.toNumber(),
      shiftType: updated.shiftType
    };
  }

  // 4. DELETE: ลบข้อมูลค่าตอบแทน
  async remove(
    id: number,
    userId: string
  ): Promise<ShiftCompensationResponseDto> {
    const compensation = await this.prisma.shiftCompensation.findUnique({
      where: { id }
    });

    if (!compensation) {
      throw new NotFoundException('Shift compensation not found');
    }

    if (compensation.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only delete your own shift compensation'
      );
    }

    const deleted = await this.prisma.shiftCompensation.delete({
      where: { id }
    });

    return {
      id: deleted.id,
      userId: deleted.userId,
      shiftId: deleted.shiftId,
      payRate: deleted.payRate.toNumber(),
      shiftType: deleted.shiftType
    };
  }
}
