import { validate } from '@/config/env.validation';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkplaceSettingsModule } from './workplace-settings/workplace-settings.module';
import { ShiftsModule } from './shifts/shifts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    WorkplaceSettingsModule,
    ShiftsModule,
    DashboardModule,
    JobsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
