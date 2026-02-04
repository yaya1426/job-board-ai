import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

function createOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('WARNING: OPENAI_API_KEY is not set. AI evaluation will not work.');
    return null;
  }

  const config: { apiKey: string; organization?: string } = {
    apiKey,
  };

  // Only include organization if provided
  if (process.env.OPENAI_ORG_ID) {
    config.organization = process.env.OPENAI_ORG_ID;
  }

  return new OpenAI(config);
}

export const openai = createOpenAIClient();

export const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
export const aiScoreThreshold = parseInt(process.env.AI_SCORE_THRESHOLD || '5', 10);
