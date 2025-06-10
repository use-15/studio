
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { LeafIcon } from '@/components/Logo';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

const CHAT_HISTORY_KEY = 'aramiyot_chat_history';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, []);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as ChatMessage[];
          // Convert string timestamps back to Date objects
          setMessages(parsedHistory.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          // Add initial greeting only if there's no history
          setMessages([
            {
              id: 'initial-greeting',
              text: "Hello! I'm Aramiyot's AI Health Assistant. How can I help you today? Please remember, I provide general guidance and not medical advice. For specific medical concerns, please consult a healthcare professional.",
              sender: 'ai',
              timestamp: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to load chat history from localStorage:", error);
        // Fallback to initial greeting
         setMessages([
            {
              id: 'initial-greeting-error',
              text: "Hello! I'm Aramiyot's AI Health Assistant. How can I help you today?",
              sender: 'ai',
              timestamp: new Date(),
            }
          ]);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
       // Don't save if it's just the initial greeting and nothing else has happened
      if (messages.length === 1 && messages[0].id.startsWith('initial-greeting')) {
        // Or if history was just loaded, avoid immediate re-save unless content changes
      } else {
        try {
          localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
          console.error("Failed to save chat history to localStorage:", error);
        }
      }
    }
  }, [messages]);


  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    const currentInput = inputValue; // Capture current input value
    setInputValue('');
    setIsLoading(true);

    // Add a placeholder for the AI's message to update incrementally
    const aiMessageId = Date.now().toString() + '-ai';
    const aiPlaceholderMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, aiPlaceholderMessage]);

    try {
      const response = await fetch('/api/ai-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry: currentInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.detail || ''}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamedText = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamedText += decoder.decode(value, { stream: true });
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
            )
          );
        }
      } else {
         throw new Error("Response body is null");
      }

    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again later.";
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMessageId ? { ...msg, text: errorText } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] bg-card shadow-xl rounded-lg border">
      <header className="p-4 border-b flex items-center">
        <LeafIcon className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-lg font-semibold font-headline">AI Health Assistant</h2>
      </header>
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 max-w-[85%] animate-in fade-in duration-300",
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender === 'user' ? undefined : "https://placehold.co/40x40/228B22/E5F5E0.png?text=AI"} data-ai-hint="ai avatar" />
              <AvatarFallback className={cn(msg.sender === 'user' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground')}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-3 rounded-lg shadow-sm text-sm",
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              {msg.text === '' && msg.sender === 'ai' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
        <Input
          type="text"
          placeholder="Ask a health question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
          aria-label="Health inquiry"
        />
        <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} aria-label="Send message">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
}
