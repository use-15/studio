'use server';
/**
 * @fileOverview Provides hospital and specialist suggestions based on user needs.
 *
 * - getHospitalSuggestions - A function to retrieve medical suggestions.
 * - HospitalSuggestionInput - The input type for the getHospitalSuggestions function.
 * - HospitalSuggestionOutput - The return type for the getHospitalSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const HospitalSuggestionInputSchema = z.object({
  symptomsOrNeeds: z.string().describe('A description of the user\'s symptoms or medical needs.'),
  preferredSpecialty: z.string().optional().describe('User\'s preferred medical specialty, if any.'),
  locationPreference: z.string().optional().describe('User\'s preferred location, if any.'),
});
export type HospitalSuggestionInput = z.infer<typeof HospitalSuggestionInputSchema>;

const SuggestedMedicalServiceSchema = z.object({
  serviceOrSpecialty: z.string().describe('The suggested hospital service or medical specialty (e.g., Cardiology, Emergency Room, Orthopedic Surgeon).'),
  reason: z.string().describe('A brief reason why this service/specialty is suggested based on the user\'s input.'),
  suggestedDoctorName: z.string().optional().describe('A suggested doctor\'s name, if a specific one can be identified as highly relevant.'),
  relevantHospitalName: z.string().optional().describe('A relevant hospital name, if applicable for the suggested service.'),
});

export const HospitalSuggestionOutputSchema = z.object({
  suggestions: z.array(SuggestedMedicalServiceSchema).describe('An array of up to 3 medical service or specialty suggestions.'),
  additionalAdvice: z.string().optional().describe('Any general additional advice for the user.'),
});
export type HospitalSuggestionOutput = z.infer<typeof HospitalSuggestionOutputSchema>;

export async function getHospitalSuggestions(input: HospitalSuggestionInput): Promise<HospitalSuggestionOutput> {
  return hospitalSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hospitalSuggestionPrompt',
  input: {schema: HospitalSuggestionInputSchema},
  output: {schema: HospitalSuggestionOutputSchema},
  prompt: `You are a helpful AI medical assistant. A user has described their health needs. Your goal is to provide helpful suggestions for hospital services, medical specialties, and potentially relevant doctors or hospitals.

User's Health Needs:
- Symptoms/Concerns: {{{symptomsOrNeeds}}}
{{#if preferredSpecialty}}- Preferred Specialty: {{{preferredSpecialty}}}{{/if}}
{{#if locationPreference}}- Location Preference: {{{locationPreference}}}{{/if}}

Available Hospital Information (Highly Simplified for this exercise - assume you have a broader knowledge base):
- City General Hospital: Services - Cardiology, Orthopedics, Emergency Care. Doctors - Dr. Emily Carter (Cardiology), Dr. Ben Adams (Orthopedics).
- Green Valley Community Clinic: Services - Pediatrics, Neurology. Doctors - Dr. Olivia Chen (Pediatrics), Dr. Marcus Green (Neurology).
- St. Luke's Medical Center: Services - Cardiology, Neurology, Oncology. Doctors - Dr. Emily Carter (Cardiology), Dr. Marcus Green (Neurology).

Based on the user's input and your general medical knowledge, please provide up to 3 suggestions.
For each suggestion, specify the 'serviceOrSpecialty'.
If a specific doctor from the provided list seems highly relevant, include 'suggestedDoctorName'.
If a specific hospital from the provided list is particularly suitable for the service, include 'relevantHospitalName'.
Provide a 'reason' for each suggestion, explaining how it addresses the user's needs.
Conclude with 'additionalAdvice', such as a reminder to consult a doctor for diagnosis or to check hospital availability.

Output should be in the format specified by the HospitalSuggestionOutputSchema.
Focus on matching the user's needs to appropriate services and specialties.
If location is mentioned, try to factor it in if possible, but broad matches are okay.
If symptoms are vague, suggest general consultation or an emergency room if symptoms sound urgent.
Prioritize direct matches to specialties mentioned or implied by symptoms.
`,
});


const hospitalSuggestionFlow = ai.defineFlow(
  {
    name: 'hospitalSuggestionFlow',
    inputSchema: HospitalSuggestionInputSchema,
    outputSchema: HospitalSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    if (!output) {
        return { suggestions: [], additionalAdvice: "I am sorry, I could not generate specific suggestions at this time. Please try rephrasing your request or consult a medical professional directly." };
    }
    
    // Ensure suggestions is an array, even if the LLM returns a single object or nothing
    const suggestions = Array.isArray(output.suggestions) ? output.suggestions : (output.suggestions ? [output.suggestions] : []);
    
    return {
        suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
        additionalAdvice: output.additionalAdvice || "Remember, this is general guidance. Always consult with a qualified healthcare professional for diagnosis and treatment. Check hospital and doctor availability directly."
    };
  }
);
