import { Controller, Delete, Post, Put } from '@nestjs/common';

@Controller('jobs')
export class AdminController {
  @Post('')
  createJob() {}

  @Put('/jobs/:id')
  updateJob() {}

  @Delete('/jobs/:id')
  removeJob() {}

  @Post(':id/apply ')
  applyJob() {}
}
