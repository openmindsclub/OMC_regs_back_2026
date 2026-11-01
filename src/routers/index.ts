import { Router, Request, Response } from 'express';
import registrationRouter from './registration.router';

const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OMC Registration Backend',
    uptime: process.uptime(),
  });
});

apiRouter.use('/registrations', registrationRouter);

export default apiRouter;
