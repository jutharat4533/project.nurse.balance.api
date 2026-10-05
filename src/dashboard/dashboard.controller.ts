import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { DashboardService } from '@/dashboard/dashboard.service';
import { DashboardSummaryResponseDto } from '@/dashboard/dto/dashboard-summary-response.dto';
import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async incomeSummary(
    @CurrentUser('sub') userId: string
  ): Promise<DashboardSummaryResponseDto> {
    return await this.dashboardService.getSummary(userId);
  }
}
