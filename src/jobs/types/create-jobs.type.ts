import { JobStatus } from '@/database/generated/prisma/enums';

export type CreateJobInput = {
  title: string;
  location: string;
  aboutWord?: string;
  compensation: number;
  status: JobStatus;
  isHighlighted: boolean;
};

///not use
