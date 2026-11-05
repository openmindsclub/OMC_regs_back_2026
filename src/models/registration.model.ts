import mongoose, { Document, Schema } from 'mongoose';
import { IRegistration } from '../types/registration.types';

export interface RegistrationDocument extends Omit<IRegistration, 'id'>, Document {}

const registrationSchema = new Schema<RegistrationDocument>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    discordId: {
      type: String,
      required: [true, 'Discord ID is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    currentLevel: {
      type: String,
      required: [true, 'Current level of study is required'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['IT', 'Design', 'Marketing', 'Multimedia', 'B2B'],
      trim: true,
      index: true,
    },
    secondaryDepartment: {
      type: String,
      trim: true,
      default: '',
    },
    pathDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

registrationSchema.index({ firstName: 'text', email: 'text', university: 'text' });
registrationSchema.index({ department: 1, createdAt: 1 });

export const Registration = mongoose.model<RegistrationDocument>(
  'Registration',
  registrationSchema
);
