import { Request, Response, NextFunction } from 'express';
import { registrationService } from '../services/registration.service';
import {
  DEPARTMENT_AFFINITIES,
  HunterDepartment,
} from '../types/registration.types';
import {
  createRegistrationSchema,
  updateRegistrationStatusSchema,
} from '../types/registration.schema';

export class RegistrationController {
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createRegistrationSchema.parse(req.body);
      const registration = await registrationService.createRegistration(validatedData);

      res.status(201).json({
        success: true,
        message: 'Hunter Registration completed successfully! Good luck with your exam.',
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, department, status, university, sortBy, sortOrder } = req.query;

      const result = await registrationService.getRegistrations({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        department: typeof department === 'string' ? department : undefined,
        status: typeof status === 'string' ? (status as any) : undefined,
        university: typeof university === 'string' ? university : undefined,
        sortBy: sortBy === 'department' ? 'department' : 'createdAt',
        sortOrder: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByDepartment(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await registrationService.getRegistrationsGroupedByDepartment();
      res.status(200).json({
        success: true,
        data: result.grouped,
        counts: result.counts,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        res.status(400).json({ success: false, message: 'Registration ID is required' });
        return;
      }

      const registration = await registrationService.getRegistrationById(id);

      if (!registration) {
        res.status(404).json({
          success: false,
          message: 'Candidate registration not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        res.status(400).json({ success: false, message: 'Registration ID is required' });
        return;
      }

      const { status, adminNotes } = updateRegistrationStatusSchema.parse(req.body);
      const updated = await registrationService.updateStatus(id, status, adminNotes);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Candidate registration not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Registration status updated to ${status}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { department, sortBy } = req.query;
      const records = await registrationService.getAllForExport({
        department: typeof department === 'string' ? department : undefined,
        sortBy: sortBy === 'department' ? 'department' : 'createdAt',
      });

      const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone Number',
        'Discord ID',
        'Specialty',
        'Level',
        'University',
        'Department (Path)',
        'Hunter Affinity',
        'GitHub',
        'LinkedIn',
        'Portfolio',
        'Status',
        'Submitted At',
      ];

      const escapeCsv = (str: any) => {
        if (str === null || str === undefined) return '""';
        const stringified = String(str).replace(/"/g, '""');
        return `"${stringified}"`;
      };

      const rows = records.map((r: any) => [
        escapeCsv(r.id || r._id?.toString()),
        escapeCsv(r.firstName),
        escapeCsv(r.lastName),
        escapeCsv(r.email),
        escapeCsv(r.phoneNumber),
        escapeCsv(r.discordId),
        escapeCsv(r.specialty),
        escapeCsv(r.currentLevel),
        escapeCsv(r.university),
        escapeCsv(r.department),
        escapeCsv(
          DEPARTMENT_AFFINITIES[r.department as HunterDepartment] || ''
        ),
        escapeCsv(r.githubUrl),
        escapeCsv(r.linkedinUrl),
        escapeCsv(r.portfolioUrl),
        escapeCsv(r.status),
        escapeCsv(r.createdAt ? new Date(r.createdAt).toISOString() : ''),
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join(
        '\r\n'
      );

      const filenameSuffix = department
        ? `_${String(department).toLowerCase()}`
        : sortBy === 'department'
        ? '_by_department'
        : '';

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="omc_hunter_registrations${filenameSuffix}_${new Date().toISOString().slice(0, 10)}.csv"`
      );
      res.status(200).send('\uFEFF' + csvContent);
    } catch (error) {
      next(error);
    }
  }

  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await registrationService.getStatistics();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const registrationController = new RegistrationController();
