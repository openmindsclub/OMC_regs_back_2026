import { Request, Response, NextFunction } from 'express';

export function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    next();
    return;
  }

  const providedKey = req.headers['x-admin-key'] || req.query.adminKey;

  if (!providedKey || providedKey !== adminKey) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing x-admin-key header',
    });
    return;
  }

  next();
}
