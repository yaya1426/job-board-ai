import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../utils/validation';

const router = Router();

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.get('/me', authenticate, AuthController.me);

export default router;
