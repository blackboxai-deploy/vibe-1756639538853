'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { 
  Battery, 
  Wifi, 
  Signal, 
  Clock, 
  Thermometer, 
  Activity,
  Settings,
  Power,
  Volume2,
  Bluetooth,
  Airplane,
  Moon,
  Sun,
  Shield,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';

interface SystemPanelsProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SystemPanels: React.FC<SystemPanelsProps> = ({ isVisible, onClose }) => {
  const { systemStatus, updateStatus } = useSystemStatus();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePanel, setActivePanel] = useState<'status' | 'controls' | 'performance'>('status');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalStrength = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 bg-current transition-all duration-300 ${
          i < bars ? 'h-3 opacity-100' : 'h-1 opacity-30'
        }`}
        style={{ marginLeft: i > 0 ? '2px' : '0' }}
      />
    ));
  };

  const toggleSetting = (setting: string) => {
    updateStatus({ [setting]: !systemStatus[setting as keyof typeof systemStatus] });
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-gray-900/95 backdrop-blur-lg border-t border-cyan-500/30 rounded-t-3xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">System Control</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Panel Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'status', label: 'Status', icon: Activity },
            { id: 'controls', label: 'Controls', icon: Settings },
            { id: 'performance', label: 'Performance', icon: Cpu }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                activePanel === id
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Status Panel */}
        {activePanel === 'status' && (
          <div className="space-y-4">
            {/* Time and Date */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-3">
                <Clock className="text-cyan-400" size={20} />
                <div>
                  <div className="text-white font-mono text-lg">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* System Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Battery */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex items-center space-x-3">
                  <Battery className={getBatteryColor(systemStatus.batteryLevel)} size={20} />
                  <div>
                    <div className={`font-semibold ${getBatteryColor(systemStatus.batteryLevel)}`}>
                      {systemStatus.batteryLevel}%
                    </div>
                    <div className="text-gray-400 text-xs">
                      {systemStatus.isCharging ? 'Charging' : 'Battery'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* WiFi */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex items-center space-x-3">
                  <Wifi className="text-green-400" size={20} />
                  <div>
                    <div className="text-white font-semibold">Connected</div>
                    <div className="text-gray-400 text-xs">WiFi Strong</div>
                  </div>
                </div>
              </Card>

              {/* Signal */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-end space-x-0.5 text-green-400">
                    {getSignalStrength(systemStatus.signalStrength)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">5G</div>
                    <div className="text-gray-400 text-xs">Excellent</div>
                  </div>
                </div>
              </Card>

              {/* Temperature */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex items-center space-x-3">
                  <Thermometer className="text-blue-400" size={20} />
                  <div>
                    <div className="text-white font-semibold">
                      {systemStatus.temperature}°C
                    </div>
                    <div className="text-gray-400 text-xs">Normal</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Controls Panel */}
        {activePanel === 'controls' && (
          <div className="space-y-4">
            {/* Quick Toggles */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'wifiEnabled', icon: Wifi, label: 'WiFi' },
                { key: 'bluetoothEnabled', icon: Bluetooth, label: 'Bluetooth' },
                { key: 'airplaneMode', icon: Airplane, label: 'Airplane' },
                { key: 'darkMode', icon: Moon, label: 'Dark Mode' },
                { key: 'doNotDisturb', icon: Shield, label: 'DND' },
                { key: 'lowPowerMode', icon: Battery, label: 'Low Power' }
              ].map(({ key, icon: Icon, label }) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all duration-200 p-4 ${
                    systemStatus[key as keyof typeof systemStatus]
                      ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                  onClick={() => toggleSetting(key)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon
                      size={24}
                      className={
                        systemStatus[key as keyof typeof systemStatus]
                          ? 'text-cyan-400'
                          : 'text-gray-400'
                      }
                    />
                    <span className="text-xs text-center text-gray-300">{label}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Volume Control */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-4">
                <Volume2 className="text-cyan-400" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Volume</span>
                    <span>{systemStatus.volume}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStatus.volume}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Brightness Control */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-4">
                <Sun className="text-yellow-400" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Brightness</span>
                    <span>{systemStatus.brightness}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStatus.brightness}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Performance Panel */}
        {activePanel === 'performance' && (
          <div className="space-y-4">
            {/* CPU Usage */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-4">
                <Cpu className="text-purple-400" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>CPU Usage</span>
                    <span>{systemStatus.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStatus.cpuUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Memory Usage */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-4">
                <MemoryStick className="text-green-400" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Memory</span>
                    <span>{systemStatus.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStatus.memoryUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Storage */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <div className="flex items-center space-x-4">
                <HardDrive className="text-blue-400" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Storage</span>
                    <span>{systemStatus.storageUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStatus.storageUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Network Speed */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="text-center">
                  <div className="text-green-400 text-lg font-bold">
                    {systemStatus.networkSpeed?.download || 0} Mbps
                  </div>
                  <div className="text-gray-400 text-xs">Download</div>
                </div>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="text-center">
                  <div className="text-orange-400 text-lg font-bold">
                    {systemStatus.networkSpeed?.upload || 0} Mbps
                  </div>
                  <div className="text-gray-400 text-xs">Upload</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Power Button */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
            onClick={() => {
              if (confirm('Are you sure you want to power down?')) {
                // Power down simulation
                console.log('Power down initiated');
              }
            }}
          >
            <Power size={16} className="mr-2" />
            Power Down
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemPanels;