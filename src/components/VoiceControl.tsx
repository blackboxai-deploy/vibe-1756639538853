'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useAIChat } from '@/hooks/useAIChat';

interface VoiceControlProps {
  onCommand?: (command: string) => void;
  onResponse?: (response: string) => void;
  isActive?: boolean;
  className?: string;
}

export default function VoiceControl({ 
  onCommand, 
  onResponse, 
  isActive = false,
  className = '' 
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [lastCommand, setLastCommand] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const wakeWordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessage, isLoading } = useAIChat();
  const { 
    isSupported, 
    startListening, 
    stopListening, 
    transcript,
    isListening: hookIsListening,
    confidence: hookConfidence 
  } = useVoiceRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US'
  });

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Handle transcript changes
  useEffect(() => {
    if (transcript && transcript.trim()) {
      const command = transcript.toLowerCase().trim();
      setLastCommand(command);
      setConfidence(hookConfidence);
      
      // Check for wake word
      if (isWakeWordActive && (command.includes('hey jarvis') || command.includes('jarvis'))) {
        handleWakeWord(command);
      } else if (isListening && !isWakeWordActive) {
        handleVoiceCommand(command);
      }
    }
  }, [transcript, hookConfidence, isWakeWordActive, isListening]);

  // Sync listening state
  useEffect(() => {
    setIsListening(hookIsListening);
  }, [hookIsListening]);

  const handleWakeWord = async (command: string) => {
    if (!voiceEnabled) return;
    
    setIsWakeWordActive(false);
    setIsListening(true);
    
    // Provide audio feedback
    await speak("Yes, I'm listening.");
    
    // Extract command after wake word
    const cleanCommand = command
      .replace(/hey jarvis/gi, '')
      .replace(/jarvis/gi, '')
      .trim();
    
    if (cleanCommand) {
      await handleVoiceCommand(cleanCommand);
    }
    
    // Reset wake word after timeout
    if (wakeWordTimeoutRef.current) {
      clearTimeout(wakeWordTimeoutRef.current);
    }
    
    wakeWordTimeoutRef.current = setTimeout(() => {
      setIsWakeWordActive(true);
      setIsListening(false);
      stopListening();
    }, 10000); // 10 second timeout
  };

  const handleVoiceCommand = async (command: string) => {
    if (!command || isLoading) return;
    
    onCommand?.(command);
    
    try {
      // Process special commands
      if (command.includes('stop listening') || command.includes('sleep')) {
        await speak("Going to sleep mode. Say 'Hey Jarvis' to wake me up.");
        setIsWakeWordActive(true);
        setIsListening(false);
        stopListening();
        return;
      }
      
      if (command.includes('mute') || command.includes('quiet')) {
        setVoiceEnabled(false);
        await speak("Voice responses disabled.");
        return;
      }
      
      if (command.includes('unmute') || command.includes('speak')) {
        setVoiceEnabled(true);
        await speak("Voice responses enabled.");
        return;
      }
      
      // Send to AI for processing
      const response = await sendMessage(command);
      
      if (response && voiceEnabled) {
        await speak(response);
        onResponse?.(response);
      }
      
    } catch (error) {
      console.error('Voice command error:', error);
      if (voiceEnabled) {
        await speak("I'm sorry, I encountered an error processing that command.");
      }
    }
  };

  const speak = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current || !voiceEnabled || !text.trim()) {
        resolve();
        return;
      }
      
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      synthRef.current.speak(utterance);
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      setIsWakeWordActive(true);
    } else {
      startListening();
      setIsListening(true);
      setIsWakeWordActive(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-400 text-sm">
          Voice recognition not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className={`voice-control ${className}`}>
      {/* Voice Control Buttons */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          onClick={toggleListening}
          variant={isListening ? "default" : "outline"}
          size="lg"
          className={`
            relative overflow-hidden transition-all duration-300
            ${isListening 
              ? 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50' 
              : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6 mr-2" />
              Stop Listening
              {isListening && (
                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
              )}
            </>
          ) : (
            <>
              <Mic className="w-6 h-6 mr-2" />
              Start Listening
            </>
          )}
        </Button>
        
        <Button
          onClick={toggleVoice}
          variant="outline"
          size="lg"
          className={`
            border-cyan-500 text-cyan-400 hover:bg-cyan-500/10
            ${!voiceEnabled ? 'opacity-50' : ''}
          `}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="w-6 h-6 mr-2" />
              Voice On
            </>
          ) : (
            <>
              <VolumeX className="w-6 h-6 mr-2" />
              Voice Off
            </>
          )}
        </Button>
      </div>
      
      {/* Status Indicators */}
      <div className="text-center space-y-2">
        {isWakeWordActive && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">
              Say "Hey Jarvis" to activate
            </span>
          </div>
        )}
        
        {isListening && !isWakeWordActive && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-sm">
              Listening for commands...
            </span>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm">
              Speaking...
            </span>
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm">
              Processing...
            </span>
          </div>
        )}
      </div>
      
      {/* Last Command Display */}
      {lastCommand && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-cyan-500/30">
          <div className="text-xs text-gray-400 mb-1">Last Command:</div>
          <div className="text-cyan-300 text-sm">{lastCommand}</div>
          {confidence > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          )}
        </div>
      )}
      
      {/* Voice Commands Help */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div className="font-medium text-gray-400">Voice Commands:</div>
        <div>• "Hey Jarvis" - Wake up</div>
        <div>• "Stop listening" - Sleep mode</div>
        <div>• "Mute/Unmute" - Toggle voice</div>
        <div>• Ask questions or give commands</div>
      </div>
    </div>
  );
}