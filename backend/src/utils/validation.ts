import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').notEmpty().withMessage('Full name is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createJobValidation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('requirements').notEmpty().withMessage('Job requirements are required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('salary_range').notEmpty().withMessage('Salary range is required'),
];

export const createApplicationValidation = [
  body('job_id').isInt().withMessage('Valid job ID is required'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().withMessage('Phone number must be a string'),
];
