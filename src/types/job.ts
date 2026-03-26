export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    profilePicture?: string;
    bio?: string;
    department?: string;
    semester?: number;
    jobTitle?: string;
    company?: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  type: JobType;
  salary?: string;
  postedBy: User;
  applications?: Application[];
  _count?: {
    applications: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  user: User;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface JobFilters {
  type?: JobType;
  company?: string;
  search?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: PaginationInfo;
}

export interface ApplicationsResponse {
  applications: Application[];
  pagination: PaginationInfo;
}
