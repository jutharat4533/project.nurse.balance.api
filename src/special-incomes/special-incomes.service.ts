import { PrismaService } from '@/database/prisma.service';
import {
  CreateSpecialIncomeDto,
  SpecialIncomeResponseDto,
  UpdateSpecialIncomeDto
} from '@/special-incomes/dto/special-income.dto';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SpecialIncomesService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(income: {
    id: number;
    name: string;
    amount: { toNumber(): number };
    createdAt: Date;
    updatedAt: Date;
  }): SpecialIncomeResponseDto {
    return { ...income, amount: income.amount.toNumber() };
  }

  async findAll(userId: string): Promise<SpecialIncomeResponseDto[]> {
    const incomes = await this.prisma.specialIncome.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return incomes.map((income) => this.toResponse(income));
  }

  async create(
    userId: string,
    dto: CreateSpecialIncomeDto
  ): Promise<SpecialIncomeResponseDto> {
    const income = await this.prisma.specialIncome.create({
      data: { userId, name: dto.name, amount: dto.amount }
    });
    return this.toResponse(income);
  }

  async update(
    id: number,
    userId: string,
    dto: UpdateSpecialIncomeDto
  ): Promise<SpecialIncomeResponseDto> {
    const income = await this.prisma.specialIncome.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Special income not found');
    if (income.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.specialIncome.update({
      where: { id },
      data: dto
    });
    return this.toResponse(updated);
  }

  async remove(id: number, userId: string): Promise<void> {
    const income = await this.prisma.specialIncome.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Special income not found');
    if (income.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.specialIncome.delete({ where: { id } });
  }
}
