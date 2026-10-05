import { PrismaService } from '@/database/prisma.service';
import { CreateWorkplaceSettingDto } from '@/workplace-settings/dto/create-user-workplace-setting.dto';
import { WorkplaceResponseDto } from '@/workplace-settings/dto/workplace-response.dto';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class WorkplaceSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  //PATH POST/workplace
  async createWorkplace(
    userId: string,
    input: CreateWorkplaceSettingDto
  ): Promise<void> {
    try {
      await this.prisma.userWorkplaceSetting.create({
        data: {
          workplaceName: input.workplaceName,
          baseSalary: input.baseSalary,
          specialAllowance: input.specialAllowance,
          user: { connect: { id: userId } }
        }
      });
      console.log('Shift created successfully in database');
    } catch (error) {
      console.log('Database at Shift Error:', error);
      throw new InternalServerErrorException('Failed to create shift');
    }
  }

  //PATH GET/workplace
  async getWorkplaces(userId: string): Promise<WorkplaceResponseDto[]> {
    const workplaces = await this.prisma.userWorkplaceSetting.findMany({
      where: { userId }
    });

    return workplaces.map((wp) => ({
      id: wp.id,
      userId: wp.userId,
      workplaceName: wp.workplaceName,
      baseSalary: wp.baseSalary ? wp.baseSalary.toNumber() : null,
      specialAllowance: wp.specialAllowance
        ? wp.specialAllowance.toNumber()
        : null
    }));
  }

  //PATH PUT/workplace
  async updateWorkplaceSetting(
    id: string,
    userId: string,
    updateDto: CreateWorkplaceSettingDto
  ): Promise<WorkplaceResponseDto> {
    const workplaceId = Number(id);

    if (isNaN(workplaceId)) {
      throw new NotFoundException('Invalid workplace ID format');
    }

    const existingWorkplace = await this.prisma.userWorkplaceSetting.findUnique(
      {
        where: { id: workplaceId }
      }
    );

    if (!existingWorkplace) {
      throw new NotFoundException('Workplace setting not found');
    }

    if (existingWorkplace.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only update your own workplace settings'
      );
    }

    const updatedWorkplace = await this.prisma.userWorkplaceSetting.update({
      where: { id: workplaceId },
      data: {
        workplaceName: updateDto.workplaceName,
        baseSalary: updateDto.baseSalary,
        specialAllowance: updateDto.specialAllowance
      }
    });

    return {
      id: updatedWorkplace.id,
      workplaceName: updatedWorkplace.workplaceName,
      baseSalary: updatedWorkplace.baseSalary
        ? updatedWorkplace.baseSalary.toNumber()
        : null,
      specialAllowance: updatedWorkplace.specialAllowance
        ? updatedWorkplace.specialAllowance.toNumber()
        : null
    };
  }

  //PATH DELETE/workplace
  async removeWorkplaceSetting(
    id: string,
    userId: string
  ): Promise<WorkplaceResponseDto> {
    const workplaceId = Number(id);

    if (isNaN(workplaceId)) {
      throw new NotFoundException('Invalid workplace ID format');
    }

    const existingWorkplace = await this.prisma.userWorkplaceSetting.findUnique(
      {
        where: { id: workplaceId }
      }
    );

    if (!existingWorkplace) {
      throw new NotFoundException('Workplace setting not found');
    }

    if (existingWorkplace.userId !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only delete your own workplace settings'
      );
    }

    const deletedWorkplace = await this.prisma.userWorkplaceSetting.delete({
      where: { id: workplaceId }
    });

    return {
      id: deletedWorkplace.id,
      workplaceName: deletedWorkplace.workplaceName,
      baseSalary: deletedWorkplace.baseSalary
        ? deletedWorkplace.baseSalary.toNumber()
        : null,
      specialAllowance: deletedWorkplace.specialAllowance
        ? deletedWorkplace.specialAllowance.toNumber()
        : null
    };
  }
}
