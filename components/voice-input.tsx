/**
 * Voice Input Component
 * Uses Web Speech API for voice-to-text
 * Bloomberg × McKinsey design
 */

'use client';

import { useState, useEffect } from 'react';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  placeholder?: string;
}

export default function VoiceInput({
  onTranscript,
  language = 'en-IN',
  placeholder = 'Click mic to start speaking...',
}: VoiceInputProps) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const instance = new SpeechRecognition();
    instance.lang = language;
    instance.continuous = true;
    instance.interimResults = true;

    instance.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    instance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    instance.onend = () => {
      setIsListening(false);
    };

    setRecognition(instance);

    return () => {
      instance.stop();
    };
  }, [language]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Failed to stop:', error);
      }
    }
  };

  const handleDone = () => {
    stopListening();
    if (transcript.trim()) {
      onTranscript(transcript.trim());
    }
  };

  if (!supported) {
    return (
      <div style={{ color: '#6b7280', fontSize: '14px' }}>
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button
          type="button"
          onClick={isListening ? stopListening : startListening}
          style={{
            backgroundColor: isListening ? '#ef4444' : '#92400e',
            color: '#F8F7F4',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isListening ? <StopCircle size={16} /> : <Mic size={16} />}
          {isListening ? 'Stop Recording' : 'Start Voice Input'}
        </Button>

        {transcript && (
          <Button
            type="button"
            onClick={handleDone}
            style={{
              backgroundColor: '#16a34a',
              color: '#F8F7F4',
            }}
          >
            Done
          </Button>
        )}
      </div>

      {transcript && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#1a1a2e',
            minHeight: '60px',
          }}
        >
          {transcript}
        </div>
      )}

      {!transcript && !isListening && (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {placeholder}
        </div>
      )}

      {isListening && (
        <div style={{ fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
          Listening...
        </div>
      )}
    </div>
  );
}
