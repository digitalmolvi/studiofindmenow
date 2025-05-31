import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import { config } from "dotenv";

config(); // Load environment variables from .env

// Fetch API key from environment
const apiKey = process.env.GENAI_API_KEY;

if (!apiKey) {
  throw new Error("GENAI_API_KEY is not set in .env");
}

export const ai = genkit({
  plugins: [googleAI({ apiKey })],
  model: "googleai/gemini-2.0-flash",
});
