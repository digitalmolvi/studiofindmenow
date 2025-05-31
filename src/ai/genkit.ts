// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const apiKey = process.env.GENAI_API_KEY;

if (!apiKey) {
  throw new Error('❌ GENAI_API_KEY is not set. Please define it in .env.local');
}

// Initialize Genkit with Gemini provider
export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: 'googleai/gemini-2.0-flash', // or 'googleai/gemini-1.5-pro-latest'
});
