"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Wifi, 
  Bluetooth, 
  Volume2, 
  VolumeX, 
  Flashlight, 
  FlashlightOff,
  Airplane,
  Battery,
  Signal,
  Moon,
  Sun,
  Settings,
  Power,
  RotateCcw
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
  isActive: boolean;
  color: string;
  description: string;
}

export default function QuickActions() {
  const [actions, setActions] = useState<QuickAction[]>([
    {
      id: 'wifi',
      label: 'Wi-Fi',
      icon: <Wifi className="w-6 h-6" />,
      iconActive: <Wifi className="w-6 h-6" />,
      isActive: true,
      color: 'from-blue-500 to-cyan-500',
      description: 'Connected to Network'
    },
    {
      id: 'bluetooth',
      label: 'Bluetooth',
      icon: <Bluetooth className="w-6 h-6" />,
      iconActive: <Bluetooth className="w-6 h-6" />,
      isActive: false,
      color: 'from-blue-600 to-indigo-600',
      description: 'Bluetooth Off'
    },
    {
      id: 'sound',
      label: 'Sound',
      icon: <VolumeX className="w-6 h-6" />,
      iconActive: <Volume2 className="w-6 h-6" />,
      isActive: true,
      color: 'from-green-500 to-emerald-500',
      description: 'Volume: 75%'
    },
    {
      id: 'flashlight',
      label: 'Flashlight',
      icon: <FlashlightOff className="w-6 h-6" />,
      iconActive: <Flashlight className="w-6 h-6" />,
      isActive: false,
      color: 'from-yellow-500 to-orange-500',
      description: 'Flashlight Off'
    },
    {
      id: 'airplane',
      label: 'Airplane',
      icon: <Airplane className="w-6 h-6" />,
      iconActive: <Airplane className="w-6 h-6" />,
      isActive: false,
      color: 'from-gray-500 to-slate-500',
      description: 'Airplane Mode Off'
    },
    {
      id: 'darkmode',
      label: 'Dark Mode',
      icon: <Sun className="w-6 h-6" />,
      iconActive: <Moon className="w-6 h-6" />,
      isActive: true,
      color: 'from-purple-500 to-violet-500',
      description: 'Dark Theme Active'
    }
  ]);

  const [systemStats] = useState({
    battery: 87,
    signal: 4,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  });

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === id) {
        const newActive = !action.isActive;
        let newDescription = action.description;
        
        switch (id) {
          case 'wifi':
            newDescription = newActive ? 'Connected to Network' : 'Wi-Fi Disconnected';
            break;
          case 'bluetooth':
            newDescription = newActive ? 'Bluetooth Connected' : 'Bluetooth Off';
            break;
          case 'sound':
            newDescription = newActive ? 'Volume: 75%' : 'Silent Mode';
            break;
          case 'flashlight':
            newDescription = newActive ? 'Flashlight On' : 'Flashlight Off';
            break;
          case 'airplane':
            newDescription = newActive ? 'Airplane Mode On' : 'Airplane Mode Off';
            break;
          case 'darkmode':
            newDescription = newActive ? 'Dark Theme Active' : 'Light Theme Active';
            break;
        }
        
        return { ...action, isActive: newActive, description: newDescription };
      }
      return action;
    }));

    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleSystemAction = (action: string) => {
    switch (action) {
      case 'settings':
        console.log('Opening settings...');
        break;
      case 'power':
        console.log('Power menu...');
        break;
      case 'restart':
        console.log('Restarting system...');
        break;
    }
    
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      {/* System Status Header */}
      <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 p-4">
        <div className="flex items-center justify-between text-cyan-400">
          <div className="flex items-center space-x-2">
            <Battery className="w-5 h-5" />
            <span className="text-sm font-medium">{systemStats.battery}%</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(systemStats.signal)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-cyan-400 rounded-full"
                style={{ height: `${(i + 1) * 3 + 6}px` }}
              />
            ))}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{systemStats.time}</div>
            <div className="text-xs text-cyan-300">{systemStats.date}</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Card
            key={action.id}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105
              ${action.isActive 
                ? 'bg-gradient-to-br ' + action.color + ' shadow-lg shadow-cyan-500/25' 
                : 'bg-black/40 border-gray-600/50 hover:border-cyan-500/50'
              }
              backdrop-blur-md border active:scale-95
            `}
            onClick={() => toggleAction(action.id)}
          >
            <div className="p-4 text-center">
              <div className={`
                flex justify-center mb-2 transition-all duration-300
                ${action.isActive ? 'text-white' : 'text-gray-400'}
              `}>
                {action.isActive ? action.iconActive : action.icon}
              </div>
              <div className={`
                text-sm font-medium mb-1
                ${action.isActive ? 'text-white' : 'text-gray-300'}
              `}>
                {action.label}
              </div>
              <div className={`
                text-xs
                ${action.isActive ? 'text-white/80' : 'text-gray-500'}
              `}>
                {action.description}
              </div>
            </div>
            
            {/* Active indicator */}
            {action.isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            
            {/* Glow effect */}
            {action.isActive && (
              <div className={`
                absolute inset-0 bg-gradient-to-br ${action.color} opacity-20 animate-pulse
              `} />
            )}
          </Card>
        ))}
      </div>

      {/* System Actions */}
      <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 p-4">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => handleSystemAction('settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => handleSystemAction('restart')}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs">Restart</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => handleSystemAction('power')}
          >
            <Power className="w-5 h-5" />
            <span className="text-xs">Power</span>
          </Button>
        </div>
      </Card>

      {/* Voice Command Suggestions */}
      <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 p-4">
        <h3 className="text-cyan-400 text-sm font-medium mb-3">Voice Commands</h3>
        <div className="space-y-2">
          {[
            '"Hey Jarvis, turn on Wi-Fi"',
            '"Toggle flashlight"',
            '"What\'s my battery level?"',
            '"Enable airplane mode"'
          ].map((command, index) => (
            <div
              key={index}
              className="text-xs text-gray-400 bg-black/20 rounded px-2 py-1 border border-gray-600/30"
            >
              {command}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}