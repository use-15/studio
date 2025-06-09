'use server';

/**
 * @fileOverview A health inquiry AI chatbot.
 *
 * - aiHealthChatbot - A function that handles health inquiries.
 * - AIHealthChatbotInput - The input type for the aiHealthChatbot function.
 * - AIHealthChatbotOutput - The return type for the aiHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIHealthChatbotInputSchema = z.object({
  inquiry: z.string().describe('The health inquiry from the user.'),
});
export type AIHealthChatbotInput = z.infer<typeof AIHealthChatbotInputSchema>;

const AIHealthChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the health inquiry.'),
});
export type AIHealthChatbotOutput = z.infer<typeof AIHealthChatbotOutputSchema>;

export async function aiHealthChatbot(input: AIHealthChatbotInput): Promise<AIHealthChatbotOutput> {
  return aiHealthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthChatbotPrompt',
  input: {schema: AIHealthChatbotInputSchema},
  output: {schema: AIHealthChatbotOutputSchema},
  prompt: `You are a helpful AI-powered chatbot that answers general health inquiries and provides basic guidance. Please remember to only provide general guidance and always recommend consulting with a healthcare professional for specific medical advice.\n\nUser Inquiry: {{{inquiry}}}`,
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: AIHealthChatbotInputSchema,
    outputSchema: AIHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
