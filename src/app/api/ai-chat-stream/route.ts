
import {ai} from '@/ai/genkit';
import {aiHealthChatbotPrompt, AIHealthChatbotInputSchema} from '@/ai/flows/ai-health-chatbot';
import {NextResponse} from 'next/server';
import {z} from 'zod';

export const dynamic = 'force-dynamic'; // Ensure dynamic execution for streaming

export async function POST(request: Request) {
  try {
    const rawInput = await request.json();
    const validatedInput = AIHealthChatbotInputSchema.safeParse(rawInput);

    if (!validatedInput.success) {
      return NextResponse.json({error: 'Invalid input', details: validatedInput.error.flatten()}, {status: 400});
    }

    const promptInput: z.infer<typeof AIHealthChatbotInputSchema> = {
        inquiry: validatedInput.data.inquiry
    };

    if (validatedInput.data.photoDataUri) {
        promptInput.photoDataUri = validatedInput.data.photoDataUri;
    }

    const {stream, response: flowResponsePromise} = ai.generateStream({
      prompt: aiHealthChatbotPrompt,
      input: promptInput,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          await flowResponsePromise; 
        } catch (error) {
          console.error("Error during stream processing:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Error in AI chat stream API:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof z.ZodError) {
        errorMessage = 'Invalid request payload.';
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({error: 'Failed to process chat stream', details: errorMessage}, {status: 500});
  }
}
