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
   * Evaluate resume against job requirements using GPT-4o-mini
   */
  static async evaluateResume(
    resumeText: string,
    job: Job
  ): Promise<AIEvaluationResult> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = `
Evaluate this candidate's resume against the following job requirements:

Job Title: ${job.title}
Requirements: ${job.requirements}
Description: ${job.description}
Location: ${job.location}

Resume Content:
${resumeText}

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
}
`;

      const completion = await openai.chat.completions.create({
        model: openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR recruiter evaluating candidate resumes. Provide honest, constructive feedback in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
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

  /**
   * Retrieve file content from OpenAI
   */
  static async retrieveFileContent(fileId: string): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const fileContent = await openai.files.content(fileId);
      const buffer = Buffer.from(await fileContent.arrayBuffer());
      return buffer.toString('utf-8');
    } catch (error) {
      console.error('OpenAI file retrieval error:', error);
      // If retrieval fails, return a fallback
      throw new Error('Failed to retrieve file from OpenAI');
    }
  }

  /**
   * Extract text from file (simplified version)
   * In production, you'd want to use pdf-parse or similar
   */
  static async extractTextFromFile(filePath: string): Promise<string> {
    try {
      // For now, just read as text
      // In production, add proper PDF/DOCX parsing
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } catch (error) {
      // If reading as text fails, try to read as buffer and convert
      try {
        const buffer = fs.readFileSync(filePath);
        return buffer.toString('utf-8', 0, Math.min(10000, buffer.length)); // First 10KB
      } catch (e) {
        console.error('Text extraction error:', error);
        return 'Unable to extract text from resume file';
      }
    }
  }
}
