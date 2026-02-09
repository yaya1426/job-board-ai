import { ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';
import { OpenAIService } from './openai.service';
import { aiScoreThreshold } from '../config/openai';

/**
 * Simple in-memory queue for processing resume evaluations
 */
class EvaluationQueue {
  private processing = false;
  private queue: number[] = []; // application IDs

  /**
   * Add application to evaluation queue
   */
  async add(applicationId: number): Promise<void> {
    this.queue.push(applicationId);
    console.log(`Application ${applicationId} added to queue. Queue size: ${this.queue.length}`);

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process all applications in the queue
   */
  private async processQueue(): Promise<void> {
    this.processing = true;
    console.log('Starting queue processing...');

    while (this.queue.length > 0) {
      const applicationId = this.queue.shift();
      if (applicationId) {
        await this.evaluateApplication(applicationId);
      }
    }

    this.processing = false;
    console.log('Queue processing completed');
  }

  /**
   * Evaluate a single application
   */
  private async evaluateApplication(applicationId: number): Promise<void> {
    try {
      console.log(`Evaluating application ${applicationId}...`);

      // Update status to evaluating
      await ApplicationModel.updateStatus(applicationId, 'evaluating');

      // Get application and job details
      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        console.error(`Application ${applicationId} not found`);
        return;
      }

      const job = await JobModel.findById(application.job_id);
      if (!job) {
        console.error(`Job ${application.job_id} not found for application ${applicationId}`);
        await ApplicationModel.updateStatus(applicationId, 'rejected');
        return;
      }

      // Evaluate resume using the OpenAI file ID
      if (!application.openai_file_id) {
        throw new Error(`Application ${applicationId} has no OpenAI file ID`);
      }

      console.log(`Evaluating with OpenAI file ID: ${application.openai_file_id}`);
      const evaluation = await OpenAIService.evaluateResume(application.openai_file_id, job);

      // Determine status based on score and threshold
      let newStatus: 'rejected' | 'under_review' = 'under_review';
      if (evaluation.score < aiScoreThreshold) {
        newStatus = 'rejected';
      }

      // Update application with evaluation results
      await ApplicationModel.updateEvaluation(
        applicationId,
        evaluation.score,
        evaluation.feedback,
        newStatus
      );

      console.log(
        `Application ${applicationId} evaluated: Score ${evaluation.score}/10 - Status: ${newStatus}`
      );
    } catch (error) {
      console.error(`Error evaluating application ${applicationId}:`, error);

      // Update to rejected on error
      await ApplicationModel.updateEvaluation(
        applicationId,
        0,
        'An error occurred during evaluation. Please contact support.',
        'rejected'
      );
    }
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is processing
   */
  isProcessing(): boolean {
    return this.processing;
  }
}

// Export singleton instance
export const evaluationQueue = new EvaluationQueue();
