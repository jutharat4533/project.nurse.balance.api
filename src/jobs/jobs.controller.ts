import { JobResponseDto } from '@/jobs/dto/job-response.dto';
import { JobsService } from '@/jobs/jobs.service';
import { Controller, Get } from '@nestjs/common';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('')
  async getAllJob(): Promise<JobResponseDto[]> {
    return await this.jobsService.getAllJobs();
  }
}
