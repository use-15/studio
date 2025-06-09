
"use client";

import AppLayout from '@/components/AppLayout';
import ChatInterface from '@/components/ChatInterface';

export default function ChatbotPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">AI Health Chatbot</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Get general guidance on your health inquiries. This is not a substitute for professional medical advice.
          </p>
        </header>
        <ChatInterface />
      </div>
    </AppLayout>
  );
}
