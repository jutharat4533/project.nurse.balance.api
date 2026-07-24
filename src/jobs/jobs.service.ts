import { PrismaService } from '@/database/prisma.service';
import { CreateJobDto } from '@/jobs/dto/create-job.dto';
import { JobResponseDto } from '@/jobs/dto/job-response.dto';
import { UpdateJobDto } from '@/jobs/dto/update-job.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  //PATH POST/jobs
  async createJobByAdmin(input: CreateJobDto): Promise<void> {
    try {
      await this.prisma.jobDemand.create({
        data: {
          title: input.title,
          location: input.location,
          aboutWord: input.aboutWord,
          compensation: input.compensation,
          status: input.status,
          isHighlighted: input.isHighlighted
        }
      });
      console.log('Job created successfully in database');
    } catch (error) {
      console.error('Database Error:', error);
      throw new InternalServerErrorException('Failed to create job demand');
    }
  }

  //PATH GET/jobs
  async getAllJobs(): Promise<JobResponseDto[]> {
    const jobs = await this.prisma.jobDemand.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return jobs;
  }

  //PATH PUT/jobs
  async updateJobByAdmin(
    id: string,
    updateJobDto: UpdateJobDto
  ): Promise<JobResponseDto> {
    const jobId = Number(id);

    if (isNaN(jobId)) {
      throw new NotFoundException(`Invalid Job ID format`);
    }

    const existingJob = await this.prisma.jobDemand.findUnique({
      where: { id: jobId }
    });

    if (!existingJob) {
      throw new NotFoundException(`Job demand with ID ${id} not found`);
    }

    try {
      const updatedJob = await this.prisma.jobDemand.update({
        where: { id: jobId },
        data: updateJobDto
      });

      return updatedJob;
    } catch {
      throw new InternalServerErrorException('Failed to update job demand');
    }
  }

  //PATH DELETE/jobs
  async removeJobByAdmin(id: string): Promise<{ message: string }> {
    const jobId = Number(id);
    if (isNaN(jobId)) {
      throw new NotFoundException('Invalid Job ID format');
    }

    const existingJob = await this.prisma.jobDemand.findUnique({
      where: { id: jobId }
    });

    if (!existingJob) {
      throw new NotFoundException(`Job demand with ID ${id} not found`);
    }

    try {
      await this.prisma.jobDemand.delete({
        where: { id: jobId }
      });

      return {
        message: `Job demand with ID ${id} has been successfully deleted`
      };
    } catch {
      throw new InternalServerErrorException('Failed to delete job demand');
    }
  }
}
