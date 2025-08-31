export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'voice' | 'text';
}

export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export interface SystemStatus {
  battery: {
    level: number;
    charging: boolean;
    timeRemaining?: number;
  };
  connectivity: {
    wifi: boolean;
    cellular: boolean;
    strength: number;
  };
  performance: {
    cpu: number;
    memory: number;
    temperature: number;
  };
  time: {
    current: Date;
    timezone: string;
    format: '12h' | '24h';
  };
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  action: () => void;
  category: 'system' | 'connectivity' | 'media' | 'security';
}

export interface JarvisSettings {
  voiceEnabled: boolean;
  wakeWordEnabled: boolean;
  wakeWord: string;
  voiceLanguage: string;
  responseVoice: string;
  theme: 'dark' | 'light' | 'auto';
  hapticFeedback: boolean;
  notifications: boolean;
  aiPersonality: 'professional' | 'casual' | 'technical';
}

export interface ConversationContext {
  sessionId: string;
  messages: Message[];
  userPreferences: Record<string, any>;
  lastActivity: Date;
  activeTopics: string[];
}

export interface VoiceRecognitionState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error?: string;
  supported: boolean;
}

export interface ArcReactorState {
  isActive: boolean;
  isPulsing: boolean;
  intensity: number;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  mode: 'idle' | 'listening' | 'processing' | 'responding' | 'error';
}

export interface AIResponse {
  content: string;
  type: 'text' | 'command' | 'information';
  actions?: {
    type: string;
    payload: any;
  }[];
  confidence: number;
  processingTime: number;
}

export interface DeviceCapabilities {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  vibration: boolean;
  geolocation: boolean;
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
  fullscreen: boolean;
}

export interface PanelState {
  activePanel: 'chat' | 'system' | 'actions' | 'settings' | null;
  isExpanded: boolean;
  previousPanel?: string;
}

export interface CommandSuggestion {
  text: string;
  category: string;
  frequency: number;
  lastUsed: Date;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  persistent: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

export type VoiceCommandType = 
  | 'system_control'
  | 'information_request'
  | 'conversation'
  | 'navigation'
  | 'media_control'
  | 'settings_change';

export type SystemTheme = 'dark' | 'light' | 'auto';

export type ResponseMode = 'voice' | 'text' | 'both';