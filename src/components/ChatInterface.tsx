"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { aiHealthChatbot } from '@/ai/flows/ai-health-chatbot';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add an initial greeting from the bot
  useEffect(() => {
    setMessages([
      {
        id: 'initial-greeting',
        text: "Hello! I'm Aramiyot's AI Health Assistant. How can I help you today? Please remember, I provide general guidance and not medical advice. For specific medical concerns, please consult a healthcare professional.",
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  }, []);


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
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await aiHealthChatbot({ inquiry: userMessage.text });
      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponse.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        text: "Sorry, I encountered an error. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] bg-card shadow-xl rounded-lg border">
      <header className="p-4 border-b flex items-center">
        <Bot className="h-6 w-6 text-primary mr-2" />
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
              <AvatarImage src={msg.sender === 'user' ? undefined : "https://placehold.co/40x40/228B22/E5F5E0.png?text=AI"} />
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
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
         {isLoading && (
          <div className="flex items-end gap-2 max-w-[85%] mr-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40/228B22/E5F5E0.png?text=AI" />
               <AvatarFallback className='bg-primary text-primary-foreground'>
                <Bot size={18} />
              </AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-lg shadow-sm text-sm bg-muted text-muted-foreground rounded-bl-none">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
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
