'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a case summary report.
 *
 * - generateCaseSummary - A function that generates a case summary report based on input data.
 * - CaseSummaryInput - The input type for the generateCaseSummary function.
 * - CaseSummaryOutput - The return type for the generateCaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the case summary
const CaseSummaryInputSchema = z.object({
  full_name: z.string().describe('Full name of the missing person.'),
  age: z.number().describe('Age of the missing person.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('Gender of the missing person.'),
  last_known_location: z
    .string()
    .describe(
      'Last known location of the missing person. Should include latitude and longitude.'
    ),
  date_last_seen: z.string().describe('Date the missing person was last seen.'),
  clothing_description: z.string().describe('Description of the clothing worn by the missing person.'),
  appearance_description: z
    .string()
    .optional()
    .describe('Description of the appearance of the missing person.'),
  photoDataUri:
    z.string()
    .optional()
    .describe(
      "A photo of the missing person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  distinguishing_features:
    z.string()
    .optional()
    .describe('Distinguishing features of the missing person (e.g., tattoos, conditions).'),
  consent: z.boolean().describe('Consent for data processing.'),
});
export type CaseSummaryInput = z.infer<typeof CaseSummaryInputSchema>;

// Define the output schema for the case summary
const CaseSummaryOutputSchema = z.object({
  case_summary: z.string().describe('A detailed summary of the missing person case.'),
  priority_level: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The priority level of the case based on the details provided.'),
  recommendations: z.string().describe('Recommendations for the case.'),
});
export type CaseSummaryOutput = z.infer<typeof CaseSummaryOutputSchema>;

// Define the main function to generate the case summary
export async function generateCaseSummary(
  input: CaseSummaryInput
): Promise<CaseSummaryOutput> {
  return generateCaseSummaryFlow(input);
}

// Define the prompt for generating the case summary
const caseSummaryPrompt = ai.definePrompt({
  name: 'caseSummaryPrompt',
  input: {schema: CaseSummaryInputSchema},
  output: {schema: CaseSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating a case summary for missing persons.

  Based on the information provided, create a detailed summary of the case, determine the appropriate priority level (High, Medium, or Low), and provide recommendations for the case.

  Missing Person Details:
  - Full Name: {{{full_name}}}
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Last Known Location: {{{last_known_location}}}
  - Date Last Seen: {{{date_last_seen}}}
  - Clothing Description: {{{clothing_description}}}
  {{#if appearance_description}}
  - Appearance Description: {{{appearance_description}}}
  {{/if}}
  {{#if photoDataUri}}
  - Photo: {{media url=photoDataUri}}
  {{/if}}
  {{#if distinguishing_features}}
  - Distinguishing Features: {{{distinguishing_features}}}
  {{/if}}

  Consent: {{{consent}}}

  Consider all available information to assess what details are most relevant for efficient resource allocation.

  Output:
  - case_summary: A concise yet detailed summary of the case.
  - priority_level: The priority level of the case (High, Medium, or Low).
  - recommendations: Specific recommendations for the case.
  `,
});

// Define the Genkit flow for generating the case summary
const generateCaseSummaryFlow = ai.defineFlow(
  {
    name: 'generateCaseSummaryFlow',
    inputSchema: CaseSummaryInputSchema,
    outputSchema: CaseSummaryOutputSchema,
  },
  async input => {
    const {output} = await caseSummaryPrompt(input);
    return output!;
  }
);
