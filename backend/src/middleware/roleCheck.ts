import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const requireHR = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'hr') {
    return res.status(403).json({ error: 'HR access required' });
  }

  next();
};

export const requireApplicant = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'applicant') {
    return res.status(403).json({ error: 'Applicant access required' });
  }

  next();
};
