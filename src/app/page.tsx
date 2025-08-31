'use client';

import { useState, useEffect } from 'react';
import { ArcReactor } from '@/components/ArcReactor';
import { VoiceControl } from '@/components/VoiceControl';
import { ChatInterface } from '@/components/ChatInterface';
import { SystemPanels } from '@/components/SystemPanels';
import { QuickActions } from '@/components/QuickActions';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useAIChat } from '@/hooks/useAIChat';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, MessageSquare, Settings, Power } from 'lucide-react';

export default function JarvisApp() {
  const [isActive, setIsActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSystemPanels, setShowSystemPanels] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported
  } = useVoiceRecognition();

  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useAIChat();

  const {
    systemStatus,
    refreshStatus
  } = useSystemStatus();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (transcript && transcript.toLowerCase().includes('hey jarvis')) {
      setIsActive(true);
      const command = transcript.replace(/hey jarvis/i, '').trim();
      if (command) {
        handleVoiceCommand(command);
      }
    }
  }, [transcript]);

  const handleVoiceCommand = async (command: string) => {
    if (!command) return;

    // Handle system commands
    if (command.toLowerCase().includes('show chat')) {
      setShowChat(true);
      return;
    }
    if (command.toLowerCase().includes('hide chat')) {
      setShowChat(false);
      return;
    }
    if (command.toLowerCase().includes('show system')) {
      setShowSystemPanels(true);
      return;
    }
    if (command.toLowerCase().includes('hide system')) {
      setShowSystemPanels(false);
      return;
    }

    // Send to AI for processing
    await sendMessage(command);
    setShowChat(true);
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setIsActive(true);
    }
  };

  const handleArcReactorClick = () => {
    setIsActive(!isActive);
    if (!isActive) {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 backdrop-blur-sm bg-slate-900/30 border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <Power className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              JARVIS
            </h1>
            <p className="text-xs text-cyan-300/70">Personal AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-cyan-300">
          <div className="text-right">
            <div className="font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-cyan-300/70">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {/* Arc Reactor Central Control */}
        <div className="relative mb-8">
          <ArcReactor 
            isActive={isActive}
            isListening={isListening}
            onClick={handleArcReactorClick}
            size="large"
          />
          
          {/* Status Text */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-cyan-300 font-medium">
              {isListening ? 'Listening...' : isActive ? 'Ready' : 'Tap to Activate'}
            </p>
            {transcript && (
              <p className="text-sm text-cyan-300/70 mt-1 max-w-xs truncate">
                "{transcript}"
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoiceListening}
            className={`border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 ${
              isListening ? 'bg-cyan-500/20' : ''
            }`}
            disabled={!isSupported}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSystemPanels(!showSystemPanels)}
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {systemStatus.battery}%
            </div>
            <div className="text-xs text-cyan-300/70">Battery</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">
              {systemStatus.connectivity}
            </div>
            <div className="text-xs text-cyan-300/70">Signal</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {systemStatus.temperature}°
            </div>
            <div className="text-xs text-cyan-300/70">Temp</div>
          </div>
        </div>

        {/* Voice Control Component */}
        <VoiceControl
          isListening={isListening}
          onVoiceCommand={handleVoiceCommand}
          className="mb-4"
        />

        {/* Quick Actions Panel */}
        <QuickActions 
          onAction={(action) => handleVoiceCommand(action)}
          className="w-full max-w-md"
        />
      </main>

      {/* Chat Interface Overlay */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-semibold text-cyan-300">JARVIS Chat</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-cyan-300 hover:bg-cyan-500/20"
              >
                ✕
              </Button>
            </div>
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onClear={clearMessages}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* System Panels Overlay */}
      {showSystemPanels && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-semibold text-cyan-300">System Status</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSystemPanels(false)}
                className="text-cyan-300 hover:bg-cyan-500/20"
              >
                ✕
              </Button>
            </div>
            <SystemPanels
              systemStatus={systemStatus}
              onRefresh={refreshStatus}
              className="flex-1 p-4"
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-t border-cyan-500/20 p-4">
        <div className="flex justify-center space-x-8">
          <button
            onClick={handleArcReactorClick}
            className="flex flex-col items-center space-y-1 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <Power className="w-4 h-4" />
            </div>
            <span className="text-xs">Power</span>
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex flex-col items-center space-y-1 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">Chat</span>
          </button>
          
          <button
            onClick={() => setShowSystemPanels(!showSystemPanels)}
            className="flex flex-col items-center space-y-1 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">System</span>
          </button>
        </div>
      </nav>
    </div>
  );
}