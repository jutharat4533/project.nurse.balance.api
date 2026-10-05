import { Roles } from '@/common/@roles/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { Role } from '@/database/generated/prisma/enums';
import { CreateJobDto } from '@/jobs/dto/create-job.dto';
import { JobResponseDto } from '@/jobs/dto/job-response.dto';
import { UpdateJobDto } from '@/jobs/dto/update-job.dto';
import { JobsService } from '@/jobs/jobs.service';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';

@Controller('jobs')
export class AdminController {
  constructor(private readonly jobsService: JobsService) {}

  @Roles(Role.ADMIN)
  @Post('')
  async createJob(
    @Body() createJobDto: CreateJobDto
  ): Promise<MessageResponseDto> {
    await this.jobsService.createJobByAdmin(createJobDto);
    return { message: 'Job demand created successful' };
  }

  @Roles(Role.ADMIN)
  @Put('/:id')
  async updateJobByAdmin(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto
  ): Promise<JobResponseDto> {
    return await this.jobsService.updateJobByAdmin(id, updateJobDto);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  async removeJob(@Param('id') id: string): Promise<{ message: string }> {
    return await this.jobsService.removeJobByAdmin(id);
  }

  @Post('/:id/apply')
  async applyJob(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string
  ): Promise<MessageResponseDto> {
    return await this.jobsService.applyToJob(userId, id);
  }
}
