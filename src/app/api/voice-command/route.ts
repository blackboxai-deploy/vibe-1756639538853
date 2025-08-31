import { NextRequest, NextResponse } from 'next/server';

interface VoiceCommand {
  command: string;
  confidence: number;
  timestamp: number;
}

interface CommandResponse {
  action: string;
  response: string;
  data?: any;
  success: boolean;
}

const COMMAND_PATTERNS = {
  greeting: /^(hello|hi|hey)\s*(jarvis)?$/i,
  time: /^(what\s+time|current\s+time|time\s+now)$/i,
  weather: /^(weather|temperature|forecast)$/i,
  battery: /^(battery|power\s+level)$/i,
  lights: /^(turn\s+(on|off)\s+lights?|lights?\s+(on|off))$/i,
  music: /^(play\s+music|start\s+music|music\s+on)$/i,
  stop: /^(stop|pause|halt)$/i,
  status: /^(system\s+status|status\s+report|how\s+are\s+you)$/i,
  help: /^(help|commands|what\s+can\s+you\s+do)$/i,
  shutdown: /^(shutdown|power\s+off|sleep\s+mode)$/i,
  volume: /^(volume\s+(up|down)|increase\s+volume|decrease\s+volume)$/i,
  wifi: /^(wifi\s+(on|off)|turn\s+(on|off)\s+wifi)$/i,
  bluetooth: /^(bluetooth\s+(on|off)|turn\s+(on|off)\s+bluetooth)$/i,
  search: /^(search\s+for|find|look\s+up)\s+(.+)$/i,
  reminder: /^(remind\s+me|set\s+reminder)\s+(.+)$/i,
  calculate: /^(calculate|compute|what\s+is)\s+(.+)$/i
};

function processVoiceCommand(command: string): CommandResponse {
  const normalizedCommand = command.toLowerCase().trim();

  // Greeting commands
  if (COMMAND_PATTERNS.greeting.test(normalizedCommand)) {
    return {
      action: 'greeting',
      response: 'Hello! I am Jarvis, your personal AI assistant. How may I help you today?',
      success: true
    };
  }

  // Time commands
  if (COMMAND_PATTERNS.time.test(normalizedCommand)) {
    const currentTime = new Date().toLocaleTimeString();
    return {
      action: 'time',
      response: `The current time is ${currentTime}`,
      data: { time: currentTime },
      success: true
    };
  }

  // Weather commands
  if (COMMAND_PATTERNS.weather.test(normalizedCommand)) {
    return {
      action: 'weather',
      response: 'The weather is currently 72°F with partly cloudy skies. Perfect conditions, sir.',
      data: { temperature: 72, condition: 'partly cloudy' },
      success: true
    };
  }

  // Battery status
  if (COMMAND_PATTERNS.battery.test(normalizedCommand)) {
    const batteryLevel = Math.floor(Math.random() * 30) + 70; // 70-100%
    return {
      action: 'battery',
      response: `Battery level is at ${batteryLevel}%. All systems operating normally.`,
      data: { batteryLevel },
      success: true
    };
  }

  // Light controls
  const lightMatch = normalizedCommand.match(COMMAND_PATTERNS.lights);
  if (lightMatch) {
    const action = lightMatch[1] || lightMatch[3];
    return {
      action: 'lights',
      response: `Lights have been turned ${action}`,
      data: { lightsOn: action === 'on' },
      success: true
    };
  }

  // Music controls
  if (COMMAND_PATTERNS.music.test(normalizedCommand)) {
    return {
      action: 'music',
      response: 'Playing your favorite playlist. Enjoy the music!',
      data: { musicPlaying: true },
      success: true
    };
  }

  // Stop/Pause commands
  if (COMMAND_PATTERNS.stop.test(normalizedCommand)) {
    return {
      action: 'stop',
      response: 'All media playback has been stopped.',
      data: { stopped: true },
      success: true
    };
  }

  // System status
  if (COMMAND_PATTERNS.status.test(normalizedCommand)) {
    return {
      action: 'status',
      response: 'All systems are operating at optimal capacity. Network connectivity is stable, power levels are good.',
      data: {
        cpu: '15%',
        memory: '68%',
        network: 'connected',
        temperature: 'normal'
      },
      success: true
    };
  }

  // Help commands
  if (COMMAND_PATTERNS.help.test(normalizedCommand)) {
    return {
      action: 'help',
      response: 'I can help you with time, weather, system status, controlling lights and music, setting reminders, calculations, and much more. Just speak naturally!',
      data: {
        availableCommands: [
          'time', 'weather', 'battery', 'lights', 'music', 
          'status', 'volume', 'wifi', 'bluetooth', 'search', 'reminders'
        ]
      },
      success: true
    };
  }

  // Shutdown commands
  if (COMMAND_PATTERNS.shutdown.test(normalizedCommand)) {
    return {
      action: 'shutdown',
      response: 'Initiating sleep mode. I will be here when you need me.',
      data: { shutdownInitiated: true },
      success: true
    };
  }

  // Volume controls
  const volumeMatch = normalizedCommand.match(COMMAND_PATTERNS.volume);
  if (volumeMatch) {
    const direction = volumeMatch[1] || (normalizedCommand.includes('increase') ? 'up' : 'down');
    return {
      action: 'volume',
      response: `Volume ${direction === 'up' ? 'increased' : 'decreased'}`,
      data: { volumeDirection: direction },
      success: true
    };
  }

  // WiFi controls
  const wifiMatch = normalizedCommand.match(COMMAND_PATTERNS.wifi);
  if (wifiMatch) {
    const state = wifiMatch[1] || wifiMatch[3];
    return {
      action: 'wifi',
      response: `WiFi has been turned ${state}`,
      data: { wifiEnabled: state === 'on' },
      success: true
    };
  }

  // Bluetooth controls
  const bluetoothMatch = normalizedCommand.match(COMMAND_PATTERNS.bluetooth);
  if (bluetoothMatch) {
    const state = bluetoothMatch[1] || bluetoothMatch[3];
    return {
      action: 'bluetooth',
      response: `Bluetooth has been turned ${state}`,
      data: { bluetoothEnabled: state === 'on' },
      success: true
    };
  }

  // Search commands
  const searchMatch = normalizedCommand.match(COMMAND_PATTERNS.search);
  if (searchMatch) {
    const query = searchMatch[2];
    return {
      action: 'search',
      response: `Searching for "${query}". I'll display the results for you.`,
      data: { searchQuery: query },
      success: true
    };
  }

  // Reminder commands
  const reminderMatch = normalizedCommand.match(COMMAND_PATTERNS.reminder);
  if (reminderMatch) {
    const reminder = reminderMatch[2];
    return {
      action: 'reminder',
      response: `Reminder set: "${reminder}". I'll notify you at the appropriate time.`,
      data: { reminderText: reminder, timestamp: Date.now() },
      success: true
    };
  }

  // Calculation commands
  const calculateMatch = normalizedCommand.match(COMMAND_PATTERNS.calculate);
  if (calculateMatch) {
    const expression = calculateMatch[2];
    try {
      // Simple math evaluation (in production, use a proper math parser)
      const result = eval(expression.replace(/[^0-9+\-*/().\s]/g, ''));
      return {
        action: 'calculate',
        response: `The result is ${result}`,
        data: { expression, result },
        success: true
      };
    } catch (error) {
      return {
        action: 'calculate',
        response: `I couldn't calculate that expression. Please try a simpler mathematical operation.`,
        success: false
      };
    }
  }

  // Default response for unrecognized commands
  return {
    action: 'unknown',
    response: 'I didn\'t quite understand that command. Could you please rephrase or say "help" to see what I can do?',
    success: false
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command, confidence = 0.8 } = body as VoiceCommand;

    if (!command) {
      return NextResponse.json(
        { error: 'Voice command is required' },
        { status: 400 }
      );
    }

    // Process the voice command
    const response = processVoiceCommand(command);

    // Add metadata
    const result = {
      ...response,
      originalCommand: command,
      confidence,
      timestamp: Date.now(),
      processingTime: Date.now() - (body.timestamp || Date.now())
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Voice command processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process voice command',
        success: false,
        response: 'I encountered an error processing your command. Please try again.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Jarvis Voice Command API is operational',
    availableCommands: [
      'greeting', 'time', 'weather', 'battery', 'lights', 'music',
      'stop', 'status', 'help', 'shutdown', 'volume', 'wifi',
      'bluetooth', 'search', 'reminder', 'calculate'
    ],
    usage: 'POST /api/voice-command with { command: string, confidence?: number }'
  });
}