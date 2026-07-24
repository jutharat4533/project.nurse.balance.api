import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { AdminController } from './admin.controller';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '@/common/superGuard/jwt-auth.guard';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [JobsController, AdminController],
  providers: [JobsService, JwtAuthGuard]
})
export class JobsModule {}
