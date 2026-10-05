import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { ShiftCompensationService } from './shifts-compensation.service';

@Module({
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftCompensationService]
})
export class ShiftsModule {}
