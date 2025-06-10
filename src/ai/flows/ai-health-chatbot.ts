
'use server';

/**
 * @fileOverview A health inquiry AI chatbot.
 *
 * - aiHealthChatbot - A function that handles health inquiries (non-streaming).
 * - AIHealthChatbotInput - The input type for the aiHealthChatbot function.
 * - AIHealthChatbotOutput - The return type for the aiHealthChatbot function.
 * - aiHealthChatbotPrompt - The Genkit prompt for health inquiries, usable for streaming.
 * - AIHealthChatbotInputSchema - Zod schema for input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AIHealthChatbotInputSchema = z.object({
  inquiry: z.string().describe('The health inquiry from the user.'),
  photoDataUri: z.string().optional().describe(
    "An optional photo related to the inquiry, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AIHealthChatbotInput = z.infer<typeof AIHealthChatbotInputSchema>;

const AIHealthChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the health inquiry.'),
});
export type AIHealthChatbotOutput = z.infer<typeof AIHealthChatbotOutputSchema>;

// Existing non-streaming function
export async function aiHealthChatbot(input: AIHealthChatbotInput): Promise<AIHealthChatbotOutput> {
  return aiHealthChatbotFlow(input);
}

// Export the prompt so it can be used by the streaming API route
export const aiHealthChatbotPrompt = ai.definePrompt({
  name: 'aiHealthChatbotPrompt',
  input: {schema: AIHealthChatbotInputSchema},
  output: {schema: AIHealthChatbotOutputSchema},
  prompt: `You are a helpful AI-powered chatbot that answers general health inquiries and provides basic guidance.
Please remember to only provide general guidance and always recommend consulting with a healthcare professional for specific medical advice.

{{#if photoDataUri}}The user has attached an image related to their inquiry. Consider this image when formulating your response:
{{media url=photoDataUri}}
{{/if}}

User Inquiry: {{{inquiry}}}`,
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: AIHealthChatbotInputSchema,
    outputSchema: AIHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await aiHealthChatbotPrompt(input);
    return output!;
  }
);
