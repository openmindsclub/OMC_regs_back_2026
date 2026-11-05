import { Registration, RegistrationDocument } from '../models/registration.model';
import { CreateRegistrationDTO } from '../types/registration.schema';
import {
  HUNTER_DEPARTMENTS,
  HunterDepartment,
  RegistrationQueryFilters,
  RegistrationStatus,
} from '../types/registration.types';

export class RegistrationService {
  async createRegistration(data: CreateRegistrationDTO): Promise<RegistrationDocument> {
    const existing = await Registration.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      const error: any = new Error(
        `An application with email "${data.email}" has already been submitted.`
      );
      error.statusCode = 409;
      throw error;
    }

    const registration = new Registration(data);
    return await registration.save();
  }

  async getRegistrations(filters: RegistrationQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.department) {
      query.department = { $regex: new RegExp(`^${filters.department}$`, 'i') };
    }

    if (filters.university) {
      query.university = { $regex: new RegExp(filters.university, 'i') };
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { discordId: searchRegex },
        { university: searchRegex },
        { specialty: searchRegex },
      ];
    }

    // Determine sort options
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (filters.sortBy === 'department') {
      // Sort department by department, and within each department from first registered to last
      const timeOrder = filters.sortOrder === 'desc' ? -1 : 1;
      sortOptions = { department: 1, createdAt: timeOrder };
    } else if (filters.sortOrder) {
      sortOptions = { createdAt: filters.sortOrder === 'asc' ? 1 : -1 };
    }

    const [items, total] = await Promise.all([
      Registration.find(query).sort(sortOptions).skip(skip).limit(limit),
      Registration.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRegistrationsGroupedByDepartment() {
    // Sort from first applicant to last within each department
    const all = await Registration.find().sort({ department: 1, createdAt: 1 });

    const grouped: Record<HunterDepartment, RegistrationDocument[]> = {
      IT: [],
      Design: [],
      Marketing: [],
      Multimedia: [],
      B2B: [],
    };

    const counts: Record<HunterDepartment, number> = {
      IT: 0,
      Design: 0,
      Marketing: 0,
      Multimedia: 0,
      B2B: 0,
    };

    for (const reg of all) {
      const dep = reg.department as HunterDepartment;
      if (grouped[dep]) {
        grouped[dep].push(reg);
        counts[dep]++;
      }
    }

    return {
      grouped,
      counts,
      total: all.length,
    };
  }

  async getRegistrationById(id: string): Promise<RegistrationDocument | null> {
    return await Registration.findById(id);
  }

  async updateStatus(
    id: string,
    status: RegistrationStatus,
    adminNotes?: string
  ): Promise<RegistrationDocument | null> {
    const updateData: Record<string, any> = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    return await Registration.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getAllForExport(options?: {
    department?: string;
    sortBy?: 'createdAt' | 'department';
  }): Promise<RegistrationDocument[]> {
    const query: Record<string, any> = {};
    if (options?.department) {
      query.department = { $regex: new RegExp(`^${options.department}$`, 'i') };
    }

    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (options?.sortBy === 'department') {
      // Sort dep by dep, and within each dep from first applicant to last
      sortOptions = { department: 1, createdAt: 1 };
    }

    return await Registration.find(query).sort(sortOptions);
  }

  async getStatistics() {
    const total = await Registration.countDocuments();

    const [statusStats, departmentStats, universityStats] = await Promise.all([
      Registration.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$university', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return {
      totalApplicants: total,
      byStatus: statusStats.reduce((acc, curr) => {
        acc[curr._id || 'unknown'] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      byDepartment: departmentStats.reduce((acc, curr) => {
        acc[curr._id || 'unspecified'] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      topUniversities: universityStats.map((item) => ({
        university: item._id || 'unspecified',
        count: item.count,
      })),
    };
  }
}

export const registrationService = new RegistrationService();
