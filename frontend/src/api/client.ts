import axios, { AxiosError } from 'axios';
import type { User, Job, Application, HRStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post<{ message: string; token: string; user: User }>('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<{ message: string; token: string; user: User }>('/api/auth/login', data),
  
  me: () => api.get<User>('/api/auth/me'),
};

// Jobs endpoints
export const jobsAPI = {
  getAll: () => api.get<{ jobs: Job[] }>('/api/jobs'),
  
  getAllList: () => api.get<{ jobs: Job[] }>('/api/jobs/all/list'),
  
  getById: (id: number) => api.get<{ job: Job }>(`/api/jobs/${id}`),
  
  create: (data: Omit<Job, 'id' | 'created_by' | 'created_at'>) =>
    api.post<{ job: Job; message: string }>('/api/jobs', data),
  
  update: (id: number, data: Partial<Job>) =>
    api.put<{ job: Job; message: string }>(`/api/jobs/${id}`, data),
  
  delete: (id: number) => api.delete<{ message: string }>(`/api/jobs/${id}`),
};

// Applications endpoints
export const applicationsAPI = {
  create: (formData: FormData) =>
    api.post<{ application: Application; message: string }>('/api/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getMyApplications: () => api.get<{ applications: Application[] }>('/api/applications/my-applications'),
  
  getById: (id: number) => api.get<{ application: Application }>(`/api/applications/${id}`),
};

// HR endpoints
export const hrAPI = {
  getApplications: (params?: { status?: string; job_id?: number }) =>
    api.get<{ applications: Application[]; count: number }>('/api/hr/applications', { params }),
  
  getApplicationById: (id: number) =>
    api.get<{ application: Application }>(`/api/hr/applications/${id}`),
  
  updateApplicationStatus: (
    id: number,
    data: { status: Application['status'] }
  ) => api.put<{ message: string; application_id: number; status: Application['status'] }>(`/api/hr/applications/${id}/status`, data),
  
  getStats: () => api.get<{ stats: HRStats }>('/api/hr/stats'),
};
