import { Response } from 'express';
import { validationResult } from 'express-validator';
import { JobModel } from '../models/job.model';
import { AuthRequest, CreateJobDTO } from '../types';

export class JobsController {
  // Public - Get all active jobs
  static async getActiveJobs(req: AuthRequest, res: Response) {
    try {
      const jobs = await JobModel.getActive();
      res.json({ jobs });
    } catch (error) {
      console.error('Get active jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  // Public - Get single job
  static async getJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const jobId = Array.isArray(id) ? id[0] : id;
      const job = await JobModel.findById(parseInt(jobId));

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ job });
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  }

  // HR Only - Get all jobs (including closed)
  static async getAllJobs(req: AuthRequest, res: Response) {
    try {
      const jobs = await JobModel.getAll();
      res.json({ jobs });
    } catch (error) {
      console.error('Get all jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  // HR Only - Create job
  static async createJob(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { title, description, requirements, location, salary_range }: CreateJobDTO = req.body;

      const job = await JobModel.create(
        title,
        description,
        requirements,
        location,
        salary_range,
        req.user.id
      );

      res.status(201).json({
        message: 'Job created successfully',
        job,
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  }

  // HR Only - Update job
  static async updateJob(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { title, description, requirements, location, salary_range, status } = req.body;
      const jobId = Array.isArray(id) ? id[0] : id;

      const existingJob = await JobModel.findById(parseInt(jobId));
      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const job = await JobModel.update(
        parseInt(jobId),
        title || existingJob.title,
        description || existingJob.description,
        requirements || existingJob.requirements,
        location || existingJob.location,
        salary_range || existingJob.salary_range,
        status || existingJob.status
      );

      res.json({
        message: 'Job updated successfully',
        job,
      });
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }

  // HR Only - Delete job
  static async deleteJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const jobId = Array.isArray(id) ? id[0] : id;

      const job = await JobModel.findById(parseInt(jobId));
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      const deleted = await JobModel.delete(parseInt(jobId));
      if (!deleted) {
        return res.status(500).json({ error: 'Failed to delete job' });
      }

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
}
