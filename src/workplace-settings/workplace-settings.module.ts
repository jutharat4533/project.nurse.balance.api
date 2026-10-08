import { Module } from '@nestjs/common';
import { WorkplaceSettingsController } from './workplace-settings.controller';
import { WorkplaceSettingsService } from './workplace-settings.service';
import { CustomDeductionService } from './custom-deduction.service';
import { CustomShiftRateService } from './custom-shift-rate.service';

@Module({
  controllers: [WorkplaceSettingsController],
  providers: [
    WorkplaceSettingsService,
    CustomDeductionService,
    CustomShiftRateService
  ]
})
export class WorkplaceSettingsModule {}
