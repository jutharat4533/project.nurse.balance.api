import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('shifts')
export class ShiftsController {
  @Get('')
  getAllShift() {}

  @Post('')
  addNewShift() {}

  @Put('/:id')
  updateShift() {}

  @Delete('id')
  removeShift() {}
}
