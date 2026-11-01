export type RegistrationStatus = 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

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
  department?: string;
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
}
