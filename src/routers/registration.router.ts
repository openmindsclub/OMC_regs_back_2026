import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller';
import { requireAdminKey } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', (req, res, next) => registrationController.submit(req, res, next));

router.get('/stats', requireAdminKey, (req, res, next) =>
  registrationController.getStats(req, res, next)
);

router.get('/export/csv', requireAdminKey, (req, res, next) =>
  registrationController.exportCsv(req, res, next)
);

router.get('/by-department', requireAdminKey, (req, res, next) =>
  registrationController.getByDepartment(req, res, next)
);

router.get('/', requireAdminKey, (req, res, next) =>
  registrationController.getAll(req, res, next)
);

router.get('/:id', requireAdminKey, (req, res, next) =>
  registrationController.getById(req, res, next)
);

router.patch('/:id/status', requireAdminKey, (req, res, next) =>
  registrationController.updateStatus(req, res, next)
);

export default router;
