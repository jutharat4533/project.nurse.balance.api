import { Module } from '@nestjs/common';
import { WorkplaceSettingsController } from './workplace-settings.controller';
import { WorkplaceSettingsService } from './workplace-settings.service';

@Module({
  controllers: [WorkplaceSettingsController],
  providers: [WorkplaceSettingsService]
})
export class WorkplaceSettingsModule {}
