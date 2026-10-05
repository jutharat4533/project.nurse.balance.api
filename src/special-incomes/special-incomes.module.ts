import { Module } from '@nestjs/common';
import { SpecialIncomesController } from '@/special-incomes/special-incomes.controller';
import { SpecialIncomesService } from '@/special-incomes/special-incomes.service';

@Module({
  controllers: [SpecialIncomesController],
  providers: [SpecialIncomesService]
})
export class SpecialIncomesModule {}
