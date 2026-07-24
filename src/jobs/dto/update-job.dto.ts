import { CreateJobDto } from '@/jobs/dto/create-job.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
