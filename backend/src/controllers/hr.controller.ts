import { Response } from 'express';
import { ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';
import { AuthRequest } from '../types';

export class HRController {
  /**
   * Get all applications with filters
   * GET /api/hr/applications
   */
  static async getAllApplications(req: AuthRequest, res: Response) {
    try {
      const { status, job_id } = req.query;

      let applications = await ApplicationModel.getWithJobDetails();

      // Filter by status if provided
      if (status) {
        applications = applications.filter((app: any) => app.status === status);
      }

      // Filter by job_id if provided
      if (job_id) {
        applications = applications.filter((app: any) => app.job_id === parseInt(job_id as string));
      }

      res.json({ applications, count: applications.length });
    } catch (error) {
      console.error('Get all applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  /**
   * Get single application details
   * GET /api/hr/applications/:id
   */
  static async getApplicationDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const applicationId = Array.isArray(id) ? id[0] : id;
      const application = await ApplicationModel.findById(parseInt(applicationId));

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Get job details
      const job = await JobModel.findById(application.job_id);

      res.json({
        application: {
          ...application,
          job: job ? {
            id: job.id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            location: job.location,
            salary_range: job.salary_range,
          } : null,
        },
      });
    } catch (error) {
      console.error('Get application details error:', error);
      res.status(500).json({ error: 'Failed to fetch application details' });
    }
  }

  /**
   * Update application status (accept/reject by HR)
   * PUT /api/hr/applications/:id/status
   */
  static async updateApplicationStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const applicationId = Array.isArray(id) ? id[0] : id;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const validStatuses = ['pending', 'evaluating', 'rejected', 'under_review', 'accepted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const application = await ApplicationModel.findById(parseInt(applicationId));
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      await ApplicationModel.updateStatus(parseInt(applicationId), status);

      res.json({
        message: 'Application status updated successfully',
        application_id: parseInt(applicationId),
        new_status: status,
      });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ error: 'Failed to update application status' });
    }
  }

  /**
   * Get dashboard statistics
   * GET /api/hr/stats
   */
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const allApplications = await ApplicationModel.getAll();
      const allJobs = await JobModel.getAll();

      const stats = {
        total_applications: allApplications.length,
        pending: allApplications.filter((app) => app.status === 'pending').length,
        evaluating: allApplications.filter((app) => app.status === 'evaluating').length,
        under_review: allApplications.filter((app) => app.status === 'under_review').length,
        accepted: allApplications.filter((app) => app.status === 'accepted').length,
        rejected: allApplications.filter((app) => app.status === 'rejected').length,
        total_jobs: allJobs.length,
        active_jobs: allJobs.filter((job) => job.status === 'active').length,
        average_ai_score: HRController.calculateAverageScore(allApplications),
      };

      res.json({ stats });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }

  /**
   * Helper to calculate average AI score
   */
  private static calculateAverageScore(applications: any[]): number | null {
    const scoredApps = applications.filter((app) => app.ai_score !== null);
    if (scoredApps.length === 0) return null;

    const totalScore = scoredApps.reduce((sum, app) => sum + app.ai_score, 0);
    return Math.round((totalScore / scoredApps.length) * 10) / 10; // Round to 1 decimal
  }
}
