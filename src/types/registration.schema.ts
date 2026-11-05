import { z } from 'zod';
import { HUNTER_DEPARTMENTS, HunterDepartment } from './registration.types';

export const RegistrationStatusEnum = z.enum([
  'pending',
  'reviewed',
  'interview',
  'accepted',
  'rejected',
]);

export const hunterDepartmentSchema = z
  .string()
  .trim()
  .min(1, 'Which department would you like to join? (Required)')
  .superRefine((val, ctx) => {
    if (/^hr\b/i.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'HR is part of the Association but is not selectable.',
      });
      return;
    }
    const matched = HUNTER_DEPARTMENTS.find((dep) =>
      new RegExp(`^${dep}(\\s|$)`, 'i').test(val)
    );
    if (!matched) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid department. Must be one of: ${HUNTER_DEPARTMENTS.join(', ')}`,
      });
    }
  })
  .transform((val) => {
    const matched = HUNTER_DEPARTMENTS.find((dep) =>
      new RegExp(`^${dep}(\\s|$)`, 'i').test(val)
    );
    return matched as HunterDepartment;
  });

const urlOrUsernameSchema = z.string().trim().optional();

export const createRegistrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().optional(),
  phoneNumber: z
    .string()
    .trim()
    .min(6, 'Please enter a valid phone number'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  discordId: z
    .string()
    .trim()
    .min(2, 'Discord username/ID must be at least 2 characters'),
  specialty: z
    .string()
    .trim()
    .min(2, 'Specialty must be at least 2 characters'),
  currentLevel: z
    .string()
    .trim()
    .min(1, 'Current level of study is required'),
  university: z
    .string()
    .trim()
    .min(2, 'University must be at least 2 characters'),
  department: hunterDepartmentSchema,
  secondaryDepartment: z.string().trim().optional(),
  pathDetails: z.record(z.string(), z.any()).optional(),
  githubUrl: urlOrUsernameSchema,
  linkedinUrl: urlOrUsernameSchema,
  portfolioUrl: urlOrUsernameSchema,
});

export const updateRegistrationStatusSchema = z.object({
  status: RegistrationStatusEnum,
  adminNotes: z.string().trim().optional(),
});

export const updateRegistrationSchema = createRegistrationSchema.partial();

export type CreateRegistrationDTO = z.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationDTO = z.infer<typeof updateRegistrationSchema>;
