import { JobStatus } from '@/database/generated/prisma/enums';

export class JobResponseDto {
  id: number;

  title: string;

  location: string;

  aboutWord: string | null;

  compensation: number;

  status: JobStatus;

  isHighlighted: boolean;

  createdAt: Date;

  updatedAt: Date;
}
