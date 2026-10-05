import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ShiftCompensationResponseDto } from '@/shifts/dto/compensation-response.dto';
import {
  CreateShiftCompensationDto,
  UpdateShiftCompensationDto
} from '@/shifts/dto/compensation.dto';
import { CreateShiftDto } from '@/shifts/dto/create-shift.dto';
import { ShiftResponseDto } from '@/shifts/dto/shift-response.dto';
import { UpdateShiftDto } from '@/shifts/dto/update-shift.dto';
import { ShiftCompensationService } from '@/shifts/shifts-compensation.service';
import { ShiftsService } from '@/shifts/shifts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';

@Controller('shifts')
export class ShiftsController {
  constructor(
    private readonly shiftService: ShiftsService,
    private readonly shiftCompensationService: ShiftCompensationService
  ) {}

  @Get('')
  async getMyShifts(
    @CurrentUser('sub') userId: string
  ): Promise<ShiftResponseDto[]> {
    return await this.shiftService.getShiftsByUserId(userId);
  }

  @Post('')
  async addNewShift(
    @CurrentUser('sub') userId: string,
    @Body() createShiftDto: CreateShiftDto
  ): Promise<ShiftResponseDto> {
    return await this.shiftService.createShift(userId, createShiftDto);
  }

  @Put('/:id')
  async updateShiftByUserId(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateShiftDto: UpdateShiftDto
  ): Promise<ShiftResponseDto> {
    const result = await this.shiftService.updateShiftByUserId(
      id,
      userId,
      updateShiftDto
    );
    return result;
  }

  @Delete('/:id')
  async removeShift(
    @Param('id') shiftId: string,
    @CurrentUser('sub') userId: string
  ): Promise<ShiftResponseDto> {
    return await this.shiftService.deleteShiftById(shiftId, userId);
  }
  ///////////////////////
  ///ShiftCompensation///
  @Post('/compensation')
  async createShiftCompensation(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateShiftCompensationDto
  ): Promise<ShiftCompensationResponseDto> {
    return await this.shiftCompensationService.create(userId, dto);
  }

  @Get('/compensation')
  async findAllShiftCompensation(
    @CurrentUser('sub') userId: string
  ): Promise<ShiftCompensationResponseDto[]> {
    return await this.shiftCompensationService.findAll(userId);
  }

  @Put('/compensation:id')
  async updateShiftCompensation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateShiftCompensationDto
  ): Promise<ShiftCompensationResponseDto> {
    return await this.shiftCompensationService.update(id, userId, dto);
  }

  @Delete('/compensation:id')
  async removeShiftCompensation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string
  ): Promise<ShiftCompensationResponseDto> {
    return await this.shiftCompensationService.remove(id, userId);
  }
}
