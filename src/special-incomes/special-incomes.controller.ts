import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
  CreateSpecialIncomeDto,
  SpecialIncomeResponseDto,
  UpdateSpecialIncomeDto
} from '@/special-incomes/dto/special-income.dto';
import { SpecialIncomesService } from '@/special-incomes/special-incomes.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

@Controller('special-incomes')
export class SpecialIncomesController {
  constructor(private readonly specialIncomesService: SpecialIncomesService) {}

  @Get('')
  findAll(@CurrentUser('sub') userId: string): Promise<SpecialIncomeResponseDto[]> {
    return this.specialIncomesService.findAll(userId);
  }

  @Post('')
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateSpecialIncomeDto
  ): Promise<SpecialIncomeResponseDto> {
    return this.specialIncomesService.create(userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateSpecialIncomeDto
  ): Promise<SpecialIncomeResponseDto> {
    return this.specialIncomesService.update(id, userId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string
  ): Promise<void> {
    await this.specialIncomesService.remove(id, userId);
  }
}
