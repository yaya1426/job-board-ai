import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'applicant' | 'hr';
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  status: 'active' | 'closed';
  created_by: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id: number | null;
  full_name: string;
  email: string;
  phone: string;
  resume_path: string;
  openai_file_id: string | null;
  ai_score: number | null;
  ai_feedback: string | null;
  status: 'pending' | 'evaluating' | 'rejected' | 'under_review' | 'accepted';
  created_at: string;
  evaluated_at: string | null;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'applicant' | 'hr';
  };
}

export interface AIEvaluationResult {
  score: number;
  feedback: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
}

export interface CreateApplicationDTO {
  job_id: number;
  full_name: string;
  email: string;
  phone: string;
}
