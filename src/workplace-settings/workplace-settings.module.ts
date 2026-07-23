import { Module } from '@nestjs/common';
import { WorkplaceSettingsController } from './workplace-settings.controller';

@Module({
  controllers: [WorkplaceSettingsController]
})
export class WorkplaceSettingsModule {}
