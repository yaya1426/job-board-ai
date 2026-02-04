import { Router } from 'express';
import { HRController } from '../controllers/hr.controller';
import { authenticate } from '../middleware/auth';
import { requireHR } from '../middleware/roleCheck';

const router = Router();

// All routes require HR authentication
router.use(authenticate, requireHR);

router.get('/applications', HRController.getAllApplications);
router.get('/applications/:id', HRController.getApplicationDetails);
router.put('/applications/:id/status', HRController.updateApplicationStatus);
router.get('/stats', HRController.getStats);

export default router;
