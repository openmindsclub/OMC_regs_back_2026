import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }

  if (err && err.code === 11000) {
    const duplicateFields = Object.keys(err.keyPattern || err.keyValue || {});
    const fieldName = duplicateFields[0] || 'Email';

    res.status(409).json({
      success: false,
      message: `A registration with this ${fieldName} already exists! If you already submitted, your application is safe.`,
      duplicateField: fieldName,
    });
    return;
  }

  if (err && err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid format for resource ID: ${err.value}`,
    });
    return;
  }

  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
