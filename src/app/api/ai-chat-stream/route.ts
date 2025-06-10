
import {ai} from '@/ai/genkit';
import {aiHealthChatbotPrompt, AIHealthChatbotInputSchema} from '@/ai/flows/ai-health-chatbot';
import {NextResponse} from 'next/server';
import {z} from 'zod';

// Configure the body parser to allow larger request bodies (e.g., for image uploads)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit to 10MB
    },
  },
};

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

  } catch (error: unknown) {
    console.error('Error in AI chat stream API:', error);
    
    let errorTitle = 'Failed to process chat stream';
    let errorDetails = 'An unexpected error occurred. Please try again.';

    if (error instanceof z.ZodError) {
      errorTitle = 'Invalid Input';
      errorDetails = 'There was an issue with the data provided: ' + JSON.stringify(error.flatten());
    } else if (error instanceof Error) {
      // If error.message is blank or too generic, keep the default "An unexpected error..."
      if (error.message && error.message.toLowerCase() !== 'unknown error occurred' && error.message.trim() !== '') {
        errorDetails = error.message;
      }
      // Log stack for server-side debugging
      if (process.env.NODE_ENV === 'development' && error.stack) {
        console.error('Error Stack:', error.stack);
      }
    } else if (typeof error === 'string') {
      errorDetails = error;
    } else if (typeof error === 'object' && error !== null) {
        if ('toString' in error) {
            const errStr = error.toString();
            if (errStr !== '[object Object]') { // Avoid generic [object Object]
                 errorDetails = errStr;
            }
        }
    }
    
    return NextResponse.json({ error: errorTitle, details: errorDetails }, { status: 500 });
  }
}

