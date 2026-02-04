import { Router } from 'express';
import { ApplicationsController } from '../controllers/applications.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createApplicationValidation } from '../utils/validation';

const router = Router();

// Submit application (public or authenticated)
router.post(
  '/',
  optionalAuth,
  upload.single('resume'),
  createApplicationValidation,
  ApplicationsController.submitApplication
);

// Get applicant's own applications (authenticated)
router.get('/my-applications', authenticate, ApplicationsController.getMyApplications);

// Get single application (authenticated)
router.get('/:id', authenticate, ApplicationsController.getApplication);

export default router;
