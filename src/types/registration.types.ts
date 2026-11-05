export type RegistrationStatus = 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

export const HUNTER_DEPARTMENTS = [
  'IT',
  'Design',
  'Marketing',
  'Multimedia',
  'B2B',
] as const;

export type HunterDepartment = (typeof HUNTER_DEPARTMENTS)[number];

export const DEPARTMENT_AFFINITIES: Record<HunterDepartment, string> = {
  IT: 'The Enhancers',
  Design: 'The Transmuters',
  Marketing: 'The Specialists',
  Multimedia: 'The Manipulators',
  B2B: 'The Conjurers',
};

export interface IRegistration {
  id?: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  email: string;
  discordId: string;
  specialty: string;
  currentLevel: string;
  university: string;
  department: HunterDepartment;
  secondaryDepartment?: string;
  pathDetails?: Record<string, any>;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: RegistrationStatus;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegistrationQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: RegistrationStatus;
  university?: string;
  sortBy?: 'createdAt' | 'department';
  sortOrder?: 'asc' | 'desc';
}
