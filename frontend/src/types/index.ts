export type UserRole = 'applicant' | 'hr';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary_range?: string;
  status: 'active' | 'closed';
  created_by: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  applicant_id?: number;
  full_name: string;
  email: string;
  phone?: string;
  resume_path: string;
  openai_file_id?: string;
  ai_score?: number;
  ai_feedback?: string;
  status: 'pending' | 'evaluating' | 'rejected' | 'under_review' | 'accepted';
  created_at: string;
  evaluated_at?: string;
  job?: Job;
}

export interface HRStats {
  total_applications: number;
  pending_applications: number;
  under_review_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  total_jobs: number;
  active_jobs: number;
}
