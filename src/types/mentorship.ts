export type MentorshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  status: MentorshipStatus;
  createdAt: string;
  updatedAt: string;
  mentee?: {
    id: string;
    name: string;
    profile?: {
      profilePicture?: string;
      department?: string;
      semester?: number;
      bio?: string;
    };
  };
  mentor?: {
    id: string;
    name: string;
    profile?: {
      jobTitle?: string;
      company?: string;
      profilePicture?: string;
      bio?: string;
    };
  };
}

export interface Mentor {
  id: string;
  name: string;
  profile?: {
    jobTitle?: string;
    company?: string;
    profilePicture?: string;
    bio?: string;
  };
}

export interface MentorshipRequestsResponse {
  requests: MentorshipRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface MentorsResponse {
  mentors: Mentor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ActiveMentorshipsResponse {
  mentoring: MentorshipRequest[]; // As mentor
  beingMentored: MentorshipRequest[]; // As mentee
}
