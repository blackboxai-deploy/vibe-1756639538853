import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simulate system status data
    const systemStatus = {
      battery: {
        level: Math.floor(Math.random() * 100) + 1,
        charging: Math.random() > 0.5,
        timeRemaining: Math.floor(Math.random() * 480) + 60, // 1-8 hours in minutes
      },
      connectivity: {
        wifi: {
          connected: true,
          strength: Math.floor(Math.random() * 4) + 1, // 1-4 bars
          network: 'JARVIS_NET',
        },
        cellular: {
          connected: Math.random() > 0.3,
          strength: Math.floor(Math.random() * 5) + 1, // 1-5 bars
          carrier: 'Stark Industries',
          type: '5G',
        },
        bluetooth: Math.random() > 0.4,
      },
      system: {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 30) + 35, // 35-65°C
        uptime: Math.floor(Math.random() * 86400), // seconds
      },
      time: {
        current: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        format: new Date().toLocaleString(),
      },
      weather: {
        temperature: Math.floor(Math.random() * 35) + 10, // 10-45°C
        condition: ['sunny', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 30),
        location: 'Malibu, CA',
      },
      security: {
        status: 'secure',
        lastScan: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        threatsDetected: 0,
        firewallActive: true,
      },
      notifications: {
        unread: Math.floor(Math.random() * 10),
        priority: Math.floor(Math.random() * 3),
        lastUpdate: new Date(Date.now() - Math.random() * 1800000).toISOString(),
      },
      jarvisStatus: {
        mode: 'active',
        voiceRecognition: true,
        aiModel: 'Claude Sonnet 4',
        responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
        conversationsToday: Math.floor(Math.random() * 50),
      },
    };

    return NextResponse.json({
      success: true,
      data: systemStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('System status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve system status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, component, value } = body;

    // Simulate system control actions
    const controlActions = {
      wifi: (enabled: boolean) => ({ wifi: enabled, message: `WiFi ${enabled ? 'enabled' : 'disabled'}` }),
      bluetooth: (enabled: boolean) => ({ bluetooth: enabled, message: `Bluetooth ${enabled ? 'enabled' : 'disabled'}` }),
      brightness: (level: number) => ({ brightness: level, message: `Brightness set to ${level}%` }),
      volume: (level: number) => ({ volume: level, message: `Volume set to ${level}%` }),
      airplane: (enabled: boolean) => ({ airplane: enabled, message: `Airplane mode ${enabled ? 'enabled' : 'disabled'}` }),
      dnd: (enabled: boolean) => ({ doNotDisturb: enabled, message: `Do not disturb ${enabled ? 'enabled' : 'disabled'}` }),
      flashlight: (enabled: boolean) => ({ flashlight: enabled, message: `Flashlight ${enabled ? 'on' : 'off'}` }),
      hotspot: (enabled: boolean) => ({ hotspot: enabled, message: `Mobile hotspot ${enabled ? 'enabled' : 'disabled'}` }),
    };

    if (action === 'toggle' && component && controlActions[component as keyof typeof controlActions]) {
      const result = controlActions[component as keyof typeof controlActions](value);
      return NextResponse.json({
        success: true,
        action: 'toggle',
        component,
        result,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'restart') {
      return NextResponse.json({
        success: true,
        action: 'restart',
        message: 'System restart initiated',
        estimatedTime: '30 seconds',
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'scan') {
      return NextResponse.json({
        success: true,
        action: 'scan',
        result: {
          threatsFound: 0,
          filesScanned: Math.floor(Math.random() * 10000) + 5000,
          scanTime: Math.floor(Math.random() * 30) + 10,
          status: 'clean',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action or component',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('System control error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute system control',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}