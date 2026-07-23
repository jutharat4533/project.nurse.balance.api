import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { AdminController } from './admin.controller';

@Module({
  controllers: [JobsController, AdminController]
})
export class JobsModule {}
