import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { AdminController } from './admin.controller';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController, AdminController],
  providers: [JobsService]
})
export class JobsModule {}
