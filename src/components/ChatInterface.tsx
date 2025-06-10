
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, Paperclip, XCircle } from 'lucide-react';
import { LeafIcon } from '@/components/Logo';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';


const CHAT_HISTORY_KEY = 'aramiyot_chat_history';
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as ChatMessage[];
          setMessages(parsedHistory.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([
            {
              id: 'initial-greeting',
              text: "Hello! I'm Aramiyot's AI Health Assistant. How can I help you today? You can also attach an image if it helps describe your inquiry. Please remember, I provide general guidance and not medical advice.",
              sender: 'ai',
              timestamp: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to load chat history from localStorage:", error);
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

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      if (!(messages.length === 1 && messages[0].id.startsWith('initial-greeting'))) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "File Too Large",
          description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        setSelectedFile(null);
        setFilePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!file.type.startsWith('image/')) {
         toast({
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, GIF).",
          variant: "destructive",
        });
        setSelectedFile(null);
        setFilePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() === '' && !selectedFile) || isLoading) return;

    setIsLoading(true);
    
    let attachmentPayload: ChatMessage['attachment'] | undefined = undefined;
    let photoDataUriForApi: string | undefined = undefined;

    if (selectedFile && filePreview) {
      attachmentPayload = {
        type: 'image',
        url: filePreview, // This is already a data URI
        name: selectedFile.name,
      };
      photoDataUriForApi = filePreview;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      ...(attachmentPayload && { attachment: attachmentPayload }),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    const currentInput = inputValue;
    setInputValue('');
    clearAttachment(); // Clear file after including in message

    const aiMessageId = Date.now().toString() + '-ai';
    const aiPlaceholderMessage: ChatMessage = {
      id: aiMessageId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, aiPlaceholderMessage]);

    try {
      const requestBody: { inquiry: string; photoDataUri?: string } = { inquiry: currentInput };
      if (photoDataUriForApi) {
        requestBody.photoDataUri = photoDataUriForApi;
      }

      const response = await fetch('/api/ai-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
          msg.id === aiMessageId ? { ...msg, text: errorText, attachment: undefined } : msg // Ensure error messages don't have attachments
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
            <Avatar className="h-8 w-8 self-end">
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
              {msg.attachment && msg.attachment.type === 'image' && msg.attachment.url && (
                <div className="mb-2 max-w-[200px] max-h-[200px] overflow-hidden rounded-md">
                    <Image 
                        src={msg.attachment.url} 
                        alt={msg.attachment.name || "Attached image"} 
                        width={200} 
                        height={200}
                        className="object-contain w-full h-full"
                        data-ai-hint="user uploaded image"
                    />
                </div>
              )}
              {msg.text === '' && msg.sender === 'ai' && !msg.attachment ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
              {(msg.text || msg.attachment) && (
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        {filePreview && (
          <div className="mb-2 flex items-center gap-2 p-2 border rounded-md bg-muted/50">
            <Image src={filePreview} alt="Selected preview" width={40} height={40} className="rounded object-cover h-10 w-10" data-ai-hint="image preview"/>
            <span className="text-xs text-muted-foreground truncate flex-grow">{selectedFile?.name}</span>
            <Button variant="ghost" size="icon" onClick={clearAttachment} className="h-7 w-7 text-muted-foreground hover:text-destructive">
              <XCircle size={16} />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*" 
            disabled={isLoading}
          />
          <Input
            type="text"
            placeholder="Ask a health question or describe image..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
            aria-label="Health inquiry"
          />
          <Button type="submit" size="icon" disabled={isLoading || (inputValue.trim() === '' && !selectedFile)} aria-label="Send message">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
