import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CustomDeductionService } from '@/workplace-settings/custom-deduction.service';
import { CustomShiftRateService } from '@/workplace-settings/custom-shift-rate.service';
import { CreateWorkplaceSettingDto } from '@/workplace-settings/dto/create-user-workplace-setting.dto';
import { CustomDeductionResponseDto } from '@/workplace-settings/dto/custom-deduction-response.dto';
import {
  CreateCustomDeductionDto,
  UpdateCustomDeductionDto
} from '@/workplace-settings/dto/custom-deduction.dto';
import { CustomShiftRateResponseDto } from '@/workplace-settings/dto/custom-shift-rate-response.dto';
import {
  CreateCustomShiftRateDto,
  UpdateCustomShiftRateDto
} from '@/workplace-settings/dto/custom-shift-rate.dto';
import { WorkplaceResponseDto } from '@/workplace-settings/dto/workplace-response.dto';
import { WorkplaceSettingsService } from '@/workplace-settings/workplace-settings.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';

@Controller('workplace/settings')
export class WorkplaceSettingsController {
  constructor(
    private readonly workplaceSettingsService: WorkplaceSettingsService,
    private readonly deductionService: CustomDeductionService,
    private readonly shiftRateService: CustomShiftRateService
  ) {}

  @Get('')
  async customFinancialPerHospital(
    @CurrentUser('sub') userId: string
  ): Promise<WorkplaceResponseDto[]> {
    return await this.workplaceSettingsService.getWorkplaces(userId);
  }

  @Post('')
  async moneyManagement(
    @CurrentUser('sub') userId: string,
    @Body() createWorkplaceSettingDto: CreateWorkplaceSettingDto
  ): Promise<MessageResponseDto> {
    await this.workplaceSettingsService.createWorkplace(
      userId,
      createWorkplaceSettingDto
    );
    return { message: 'WorkplaceSetting created successful' };
  }

  @Put('/:id')
  async updateFinancialSetting(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() updateWorkplaceDto: CreateWorkplaceSettingDto
  ): Promise<WorkplaceResponseDto> {
    const result = await this.workplaceSettingsService.updateWorkplaceSetting(
      id,
      userId,
      updateWorkplaceDto
    );
    return result;
  }

  @Delete('/:id')
  async removeHospitalSetting(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string
  ): Promise<WorkplaceResponseDto> {
    return await this.workplaceSettingsService.removeWorkplaceSetting(
      id,
      userId
    );
  }

  /////////////////////////////
  /////CustomDeduction/////////
  @Post('/deduction')
  async createDeduction(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCustomDeductionDto
  ): Promise<CustomDeductionResponseDto> {
    return await this.deductionService.createDeduction(userId, dto);
  }

  @Get('/deduction')
  async findAllDeduction(
    @CurrentUser('sub') userId: string,
    @Query('workplaceSettingId', new ParseIntPipe({ optional: true }))
    workplaceSettingId?: number
  ): Promise<CustomDeductionResponseDto[]> {
    return await this.deductionService.findAllDeduction(
      userId,
      workplaceSettingId
    );
  }

  @Put('/deduction/:id')
  async updateDeduction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateCustomDeductionDto
  ): Promise<CustomDeductionResponseDto> {
    return await this.deductionService.updateDeduction(id, userId, dto);
  }

  @Delete('/deduction/:id')
  async removeDeduction(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string
  ): Promise<CustomDeductionResponseDto> {
    return await this.deductionService.removeDeduction(id, userId);
  }

  ////////////////
  /////ShiftRate///////
  @Post('/rate')
  async createShiftRate(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCustomShiftRateDto
  ): Promise<CustomShiftRateResponseDto> {
    return await this.shiftRateService.createShiftRate(userId, dto);
  }

  @Get('/rate')
  async findAllShiftRate(
    @CurrentUser('sub') userId: string,
    @Query('workplaceSettingId', new ParseIntPipe({ optional: true }))
    workplaceSettingId?: number
  ): Promise<CustomShiftRateResponseDto[]> {
    return await this.shiftRateService.findAllShiftRate(
      userId,
      workplaceSettingId
    );
  }

  @Put('/rate/:id')
  async updateShiftRate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateCustomShiftRateDto
  ): Promise<CustomShiftRateResponseDto> {
    return await this.shiftRateService.updateShiftRate(id, userId, dto);
  }

  @Delete('/rate/:id')
  async removeShiftRate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: string
  ): Promise<CustomShiftRateResponseDto> {
    return await this.shiftRateService.removeShiftRate(id, userId);
  }
}
