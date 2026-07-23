import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('workplace/settings')
export class WorkplaceSettingsController {
  @Get('')
  customFinancialPerHospital() {}

  @Post('')
  moneyManagement() {}

  @Put('/:id')
  updateFinancialSetting() {}

  @Delete('/:id')
  removeHospitalSetting() {}
}
