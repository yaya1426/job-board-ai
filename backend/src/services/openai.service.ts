import fs from 'fs';
import { openai, openaiModel } from '../config/openai';
import { AIEvaluationResult, Job } from '../types';

export class OpenAIService {
  /**
   * Upload resume file to OpenAI Files API
   */
  static async uploadFile(filePath: string): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const fileStream = fs.createReadStream(filePath);
      
      const file = await openai.files.create({
        file: fileStream,
        purpose: 'assistants',
      });

      return file.id;
    } catch (error) {
      console.error('OpenAI file upload error:', error);
      throw new Error('Failed to upload file to OpenAI');
    }
  }

  /**
   * Evaluate resume against job requirements by passing the file ID
   * directly to the chat completions API - OpenAI handles parsing the file.
   */
  static async evaluateResume(
    openaiFileId: string,
    job: Job
  ): Promise<AIEvaluationResult> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = `Evaluate this candidate's resume against the following job requirements:

Job Title: ${job.title}
Requirements: ${job.requirements}
Description: ${job.description}
Location: ${job.location}

Please provide:
1. A score from 1-10 (10 being perfect match)
2. Brief feedback (2-3 sentences) explaining the score

Focus on:
- Relevant skills and experience
- Education background
- Cultural fit indicators
- Years of experience match

Format your response as JSON:
{
  "score": <number>,
  "feedback": "<string>"
}`;

      const completion = await openai.chat.completions.create({
        model: openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR recruiter evaluating candidate resumes. Provide honest, constructive feedback in JSON format.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'file',
                file: {
                  file_id: openaiFileId,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) {
        throw new Error('Empty response from OpenAI');
      }

      const result = JSON.parse(responseText) as AIEvaluationResult;

      // Validate score is between 1-10
      if (result.score < 1 || result.score > 10) {
        result.score = Math.max(1, Math.min(10, result.score));
      }

      return result;
    } catch (error) {
      console.error('OpenAI evaluation error:', error);
      throw new Error('Failed to evaluate resume');
    }
  }
}
