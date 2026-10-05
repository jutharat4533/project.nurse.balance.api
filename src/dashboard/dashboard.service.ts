import { PrismaService } from '@/database/prisma.service';
import { DashboardSummaryResponseDto } from '@/dashboard/dto/dashboard-summary-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string): Promise<DashboardSummaryResponseDto> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [shifts, specialIncomes, workplaceSettings] = await Promise.all([
      this.prisma.shift.findMany({
        where: { userId, startTime: { gte: periodStart, lt: periodEnd } },
        include: { compensation: true }
      }),
      this.prisma.specialIncome.findMany({
        where: { userId, createdAt: { gte: periodStart, lt: periodEnd } }
      }),
      this.prisma.userWorkplaceSetting.findMany({
        where: { userId },
        include: { deductions: true }
      })
    ]);

    const shiftIncome = shifts.reduce(
      (sum, shift) => sum + (shift.compensation?.payRate.toNumber() ?? 0),
      0
    );

    const specialIncomeTotal = specialIncomes.reduce(
      (sum, income) => sum + income.amount.toNumber(),
      0
    );

    const baseSalaryTotal = workplaceSettings.reduce(
      (sum, workplace) => sum + (workplace.baseSalary?.toNumber() ?? 0),
      0
    );

    const totalDeductions = workplaceSettings.reduce((sum, workplace) => {
      const baseSalary = workplace.baseSalary?.toNumber() ?? 0;
      const workplaceDeductions = workplace.deductions.reduce(
        (deductionSum, deduction) =>
          deductionSum +
          (deduction.isPercent
            ? (baseSalary * deduction.amount.toNumber()) / 100
            : deduction.amount.toNumber()),
        0
      );
      return sum + workplaceDeductions;
    }, 0);

    const totalIncome = baseSalaryTotal + shiftIncome + specialIncomeTotal;

    return {
      periodStart,
      periodEnd,
      shiftCount: shifts.length,
      baseSalaryTotal,
      shiftIncome,
      specialIncomeTotal,
      totalDeductions,
      totalIncome,
      netIncome: totalIncome - totalDeductions
    };
  }
}
