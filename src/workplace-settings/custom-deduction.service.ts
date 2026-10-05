import { PrismaService } from '@/database/prisma.service';
import { CustomDeductionResponseDto } from '@/workplace-settings/dto/custom-deduction-response.dto';
import {
  CreateCustomDeductionDto,
  UpdateCustomDeductionDto
} from '@/workplace-settings/dto/custom-deduction.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class CustomDeductionService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREATE: เพิ่มข้อมูลการหักเงิน (โดยเช็คว่า workplace setting เป็นของ user จริงไหม)
  async createDeduction(
    userId: string,
    dto: CreateCustomDeductionDto
  ): Promise<CustomDeductionResponseDto> {
    const workplaceSetting = await this.prisma.userWorkplaceSetting.findUnique({
      where: { id: dto.workplaceSettingId }
    });

    if (!workplaceSetting) {
      throw new NotFoundException('Workplace setting not found');
    }

    if (workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only add deductions to your own workplaces'
      );
    }

    const deduction = await this.prisma.customDeduction.create({
      data: {
        workplaceSettingId: dto.workplaceSettingId,
        name: dto.name,
        amount: dto.amount,
        isPercent: dto.isPercent ?? false
      }
    });

    return {
      id: deduction.id,
      workplaceSettingId: deduction.workplaceSettingId,
      name: deduction.name,
      amount: deduction.amount.toNumber(),
      isPercent: deduction.isPercent
    };
  }

  // 2. READ: ดึงรายการหักเงินทั้งหมดของ Workplace นั้นๆ (หรือทั้งหมดของ User คนนี้)
  async findAllDeduction(
    userId: string,
    workplaceSettingId?: number
  ): Promise<CustomDeductionResponseDto[]> {
    // ถ้ามีการระบุ workplaceSettingId มา ให้เช็คความเป็นเจ้าของก่อน
    if (workplaceSettingId) {
      const workplaceSetting =
        await this.prisma.userWorkplaceSetting.findUnique({
          where: { id: workplaceSettingId }
        });

      if (!workplaceSetting || workplaceSetting.userId !== userId) {
        throw new ForbiddenException('Access denied or workplace not found');
      }
    }

    const deductions = await this.prisma.customDeduction.findMany({
      where: {
        ...(workplaceSettingId
          ? { workplaceSettingId }
          : {
              workplaceSetting: { userId } // ดึงทั้งหมดที่อยู่ภายใต้ workplace ของ user คนนี้
            })
      }
    });

    return deductions.map((item) => ({
      id: item.id,
      workplaceSettingId: item.workplaceSettingId,
      name: item.name,
      amount: item.amount.toNumber(),
      isPercent: item.isPercent
    }));
  }

  // 3. UPDATE: แก้ไขข้อมูลการหักเงิน
  async updateDeduction(
    id: number,
    userId: string,
    dto: UpdateCustomDeductionDto
  ): Promise<CustomDeductionResponseDto> {
    const deduction = await this.prisma.customDeduction.findUnique({
      where: { id },
      include: { workplaceSetting: true }
    });

    if (!deduction) {
      throw new NotFoundException('Custom deduction not found');
    }

    if (deduction.workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only update your own custom deductions'
      );
    }

    const updated = await this.prisma.customDeduction.update({
      where: { id },
      data: {
        name: dto.name,
        amount: dto.amount,
        isPercent: dto.isPercent
      }
    });

    return {
      id: updated.id,
      workplaceSettingId: updated.workplaceSettingId,
      name: updated.name,
      amount: updated.amount.toNumber(),
      isPercent: updated.isPercent
    };
  }

  // 4. DELETE: ลบข้อมูลการหักเงิน
  async removeDeduction(
    id: number,
    userId: string
  ): Promise<CustomDeductionResponseDto> {
    const deduction = await this.prisma.customDeduction.findUnique({
      where: { id },
      include: { workplaceSetting: true }
    });

    if (!deduction) {
      throw new NotFoundException('Custom deduction not found');
    }

    if (deduction.workplaceSetting.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only delete your own custom deductions'
      );
    }

    const deleted = await this.prisma.customDeduction.delete({
      where: { id }
    });

    return {
      id: deleted.id,
      workplaceSettingId: deleted.workplaceSettingId,
      name: deleted.name,
      amount: deleted.amount.toNumber(),
      isPercent: deleted.isPercent
    };
  }
}
