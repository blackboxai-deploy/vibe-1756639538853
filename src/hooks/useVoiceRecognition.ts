import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceRecognitionHook {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setWakeWordEnabled: (enabled: boolean) => void;
  isWakeWordEnabled: boolean;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const useVoiceRecognition = (): VoiceRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isWakeWordEnabled, setIsWakeWordEnabled] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const WAKE_WORDS = ['hey jarvis', 'jarvis', 'hey j.a.r.v.i.s'];
  const SILENCE_TIMEOUT = 3000;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcriptPart;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        // Check for wake words if enabled
        if (isWakeWordEnabled && finalTranscript) {
          const lowerTranscript = finalTranscript.toLowerCase().trim();
          const hasWakeWord = WAKE_WORDS.some(word => 
            lowerTranscript.includes(word)
          );

          if (hasWakeWord) {
            // Remove wake word from transcript
            let cleanTranscript = lowerTranscript;
            WAKE_WORDS.forEach(word => {
              cleanTranscript = cleanTranscript.replace(word, '').trim();
            });
            setTranscript(cleanTranscript || finalTranscript);
            
            // Trigger wake word detection event
            window.dispatchEvent(new CustomEvent('jarvis-wake-word', {
              detail: { transcript: cleanTranscript || finalTranscript }
            }));
          }
        }

        // Reset silence timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          if (isListening) {
            stopListening();
          }
        }, SILENCE_TIMEOUT);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
        
        // Auto-restart on certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (isWakeWordEnabled) {
              startListening();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        
        // Auto-restart if wake word is enabled
        if (isWakeWordEnabled && !error) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };

    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isWakeWordEnabled, error, isListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      setError(null);
      setTranscript('');
      setConfidence(0);
      recognitionRef.current.start();
    } catch (err) {
      setError('Failed to start voice recognition');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } catch (err) {
      setError('Failed to stop voice recognition');
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  const setWakeWordEnabledCallback = useCallback((enabled: boolean) => {
    setIsWakeWordEnabled(enabled);
    
    if (enabled && !isListening) {
      startListening();
    } else if (!enabled && isListening) {
      stopListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setWakeWordEnabled: setWakeWordEnabledCallback,
    isWakeWordEnabled,
  };
};