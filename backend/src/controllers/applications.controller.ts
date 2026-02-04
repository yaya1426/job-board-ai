import { Response } from 'express';
import { validationResult } from 'express-validator';
import { ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';
import { OpenAIService } from '../services/openai.service';
import { evaluationQueue } from '../services/queue.service';
import { AuthRequest } from '../types';

export class ApplicationsController {
  /**
   * Submit job application with resume upload
   * POST /api/applications
   */
  static async submitApplication(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      const { job_id, full_name, email, phone } = req.body;

      // Verify job exists
      const job = await JobModel.findById(parseInt(job_id));
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.status !== 'active') {
        return res.status(400).json({ error: 'This job is no longer accepting applications' });
      }

      const applicant_id = req.user ? req.user.id : null;

      // Step 1: Create application record with pending status
      const application = await ApplicationModel.create(
        parseInt(job_id),
        applicant_id,
        full_name,
        email,
        phone,
        req.file.path
      );

      try {
        // Step 2: Upload to OpenAI Files API (wait for completion)
        console.log(`Uploading resume to OpenAI for application ${application.id}...`);
        const openaiFileId = await OpenAIService.uploadFile(req.file.path);

        // Step 3: Store OpenAI file ID
        await ApplicationModel.updateOpenAIFileId(application.id, openaiFileId);

        console.log(`OpenAI file uploaded: ${openaiFileId}`);
      } catch (error) {
        console.error('OpenAI upload failed:', error);
        // Continue anyway - we'll try to evaluate from local file
      }

      // Step 4: Add to evaluation queue (fire-and-forget)
      evaluationQueue.add(application.id);

      // Step 5: Return success response
      res.status(201).json({
        message: 'Application submitted successfully! Your application is being reviewed. Check back soon for feedback.',
        application: {
          id: application.id,
          job_id: application.job_id,
          full_name: application.full_name,
          email: application.email,
          status: application.status,
          created_at: application.created_at,
        },
      });
    } catch (error) {
      console.error('Submit application error:', error);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  }

  /**
   * Get applicant's own applications
   * GET /api/applications/my-applications
   */
  static async getMyApplications(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const applications = await ApplicationModel.getByApplicant(req.user.id);

      // Enrich with job details
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const job = await JobModel.findById(app.job_id);
          return {
            ...app,
            job: job ? {
              title: job.title,
              location: job.location,
              company: 'Company Name', // Could be extended
            } : null,
          };
        })
      );

      res.json({ applications: enrichedApplications });
    } catch (error) {
      console.error('Get my applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  /**
   * Get single application with AI feedback
   * GET /api/applications/:id
   */
  static async getApplication(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const applicationId = Array.isArray(id) ? id[0] : id;
      const application = await ApplicationModel.findById(parseInt(applicationId));

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Check authorization - applicant can only see their own
      if (req.user && req.user.role === 'applicant') {
        if (application.applicant_id !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      // Get job details
      const job = await JobModel.findById(application.job_id);

      res.json({
        application: {
          ...application,
          job: job ? {
            title: job.title,
            description: job.description,
            location: job.location,
          } : null,
        },
      });
    } catch (error) {
      console.error('Get application error:', error);
      res.status(500).json({ error: 'Failed to fetch application' });
    }
  }
}
