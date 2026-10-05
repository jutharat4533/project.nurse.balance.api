import { PrismaService } from '@/database/prisma.service';
import { CustomShiftRateResponseDto } from '@/workplace-settings/dto/custom-shift-rate-response.dto';
import {
  CreateCustomShiftRateDto,
  UpdateCustomShiftRateDto
} from '@/workplace-settings/dto/custom-shift-rate.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class CustomShiftRateService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREATE: เพิ่มเรทกะงานใหม่ (เช็คสิทธิ์ Workplace ว่าเป็นของ User จริงไหม)
  async createShiftRate(
    userId: string,
    dto: CreateCustomShiftRateDto
  ): Promise<CustomShiftRateResponseDto> {
    const workplaceSetting = await this.prisma.userWorkplaceSetting.findUnique({
      where: { id: dto.workplaceSettingId }
    });

    if (!workplaceSetting) {
      throw new NotFoundException('Workplace setting not found');
    }

    if (workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only add shift rates to your own workplaces'
      );
    }

    const shiftRate = await this.prisma.customShiftRate.create({
      data: {
        workplaceSettingId: dto.workplaceSettingId,
        category: dto.category,
        shiftName: dto.shiftName,
        payRate: dto.payRate
      }
    });

    return {
      id: shiftRate.id,
      workplaceSettingId: shiftRate.workplaceSettingId,
      category: shiftRate.category,
      shiftName: shiftRate.shiftName,
      payRate: shiftRate.payRate.toNumber()
    };
  }

  // 2. READ: ดึงข้อมูลเรทกะงานทั้งหมด (กรองตาม Workplace หรือดึงทั้งหมดของ User)
  async findAllShiftRate(
    userId: string,
    workplaceSettingId?: number
  ): Promise<CustomShiftRateResponseDto[]> {
    if (workplaceSettingId) {
      const workplaceSetting =
        await this.prisma.userWorkplaceSetting.findUnique({
          where: { id: workplaceSettingId }
        });

      if (!workplaceSetting || workplaceSetting.userId !== userId) {
        throw new ForbiddenException('Access denied or workplace not found');
      }
    }

    const shiftRates = await this.prisma.customShiftRate.findMany({
      where: {
        ...(workplaceSettingId
          ? { workplaceSettingId }
          : {
              workplaceSetting: { userId }
            })
      }
    });

    return shiftRates.map((item) => ({
      id: item.id,
      workplaceSettingId: item.workplaceSettingId,
      category: item.category,
      shiftName: item.shiftName,
      payRate: item.payRate.toNumber()
    }));
  }

  // 3. UPDATE: แก้ไขข้อมูลเรทกะงาน
  async updateShiftRate(
    id: number,
    userId: string,
    dto: UpdateCustomShiftRateDto
  ): Promise<CustomShiftRateResponseDto> {
    const shiftRate = await this.prisma.customShiftRate.findUnique({
      where: { id },
      include: { workplaceSetting: true }
    });

    if (!shiftRate) {
      throw new NotFoundException('Custom shift rate not found');
    }

    if (shiftRate.workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only update your own custom shift rates'
      );
    }

    const updated = await this.prisma.customShiftRate.update({
      where: { id },
      data: {
        category: dto.category,
        shiftName: dto.shiftName,
        payRate: dto.payRate
      }
    });

    return {
      id: updated.id,
      workplaceSettingId: updated.workplaceSettingId,
      category: updated.category,
      shiftName: updated.shiftName,
      payRate: updated.payRate.toNumber()
    };
  }

  // 4. DELETE: ลบข้อมูลเรทกะงาน
  async removeShiftRate(
    id: number,
    userId: string
  ): Promise<CustomShiftRateResponseDto> {
    const shiftRate = await this.prisma.customShiftRate.findUnique({
      where: { id },
      include: { workplaceSetting: true }
    });

    if (!shiftRate) {
      throw new NotFoundException('Custom shift rate not found');
    }

    if (shiftRate.workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only delete your own custom shift rates'
      );
    }

    const deleted = await this.prisma.customShiftRate.delete({
      where: { id }
    });

    return {
      id: deleted.id,
      workplaceSettingId: deleted.workplaceSettingId,
      category: deleted.category,
      shiftName: deleted.shiftName,
      payRate: deleted.payRate.toNumber()
    };
  }
}
