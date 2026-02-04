import { Router } from 'express';
import { JobsController } from '../controllers/jobs.controller';
import { authenticate } from '../middleware/auth';
import { requireHR } from '../middleware/roleCheck';
import { createJobValidation } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', JobsController.getActiveJobs);
router.get('/:id', JobsController.getJob);

// HR only routes
router.get('/all/list', authenticate, requireHR, JobsController.getAllJobs);
router.post('/', authenticate, requireHR, createJobValidation, JobsController.createJob);
router.put('/:id', authenticate, requireHR, JobsController.updateJob);
router.delete('/:id', authenticate, requireHR, JobsController.deleteJob);

export default router;
