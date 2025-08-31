import { useState, useCallback, useRef } from 'react';
import { Message, ChatResponse } from '@/types';

interface UseAIChatOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
  isTyping: boolean;
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const lastUserMessageRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    systemPrompt = "You are JARVIS, an advanced AI assistant inspired by Tony Stark's AI. You are sophisticated, helpful, and have a slight wit. Respond concisely but informatively. Address the user as 'Sir' or 'Boss' occasionally. Keep responses mobile-friendly and conversational.",
    maxTokens = 500,
    temperature = 0.7
  } = options;

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    lastUserMessageRef.current = content.trim();
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          systemPrompt,
          maxTokens,
          temperature
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled, don't show error
      }
      
      const errorMessage = err.message || 'Failed to get response from JARVIS';
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, Sir. I'm experiencing technical difficulties: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, systemPrompt, maxTokens, temperature]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current && !isLoading) {
      // Remove the last assistant message if it was an error
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage?.isError) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      
      await sendMessage(lastUserMessageRef.current);
    }
  }, [sendMessage, isLoading]);

  const clearMessages = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsTyping(false);
    lastUserMessageRef.current = '';
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isTyping
  };
}