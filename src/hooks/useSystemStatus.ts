import { useState, useEffect } from 'react';

export interface SystemStatus {
  battery: {
    level: number;
    charging: boolean;
    timeRemaining: string;
  };
  network: {
    type: string;
    strength: number;
    connected: boolean;
  };
  device: {
    temperature: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    storage: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  time: {
    current: string;
    timezone: string;
    uptime: string;
  };
  location: {
    latitude: number;
    longitude: number;
    city: string;
    weather: {
      temperature: number;
      condition: string;
      humidity: number;
    };
  };
  notifications: number;
  activeApps: string[];
}

export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>({
    battery: {
      level: 85,
      charging: false,
      timeRemaining: '6h 23m'
    },
    network: {
      type: '5G',
      strength: 4,
      connected: true
    },
    device: {
      temperature: 32,
      memory: {
        used: 4.2,
        total: 8,
        percentage: 52
      },
      storage: {
        used: 128,
        total: 256,
        percentage: 50
      }
    },
    time: {
      current: new Date().toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      uptime: '2d 14h 32m'
    },
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      weather: {
        temperature: 22,
        condition: 'Partly Cloudy',
        humidity: 65
      }
    },
    notifications: 3,
    activeApps: ['Jarvis', 'Messages', 'Music']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        battery: {
          ...prev.battery,
          level: Math.max(0, prev.battery.level + (Math.random() - 0.5) * 2),
          timeRemaining: `${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m`
        },
        network: {
          ...prev.network,
          strength: Math.max(1, Math.min(5, prev.network.strength + (Math.random() - 0.5)))
        },
        device: {
          ...prev.device,
          temperature: Math.max(25, Math.min(45, prev.device.temperature + (Math.random() - 0.5) * 2)),
          memory: {
            ...prev.device.memory,
            percentage: Math.max(0, Math.min(100, prev.device.memory.percentage + (Math.random() - 0.5) * 5))
          }
        },
        time: {
          ...prev.time,
          current: new Date().toLocaleTimeString()
        },
        notifications: Math.max(0, prev.notifications + (Math.random() > 0.8 ? 1 : 0))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get battery info from Battery API if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setStatus(prev => ({
            ...prev,
            battery: {
              level: Math.round(battery.level * 100),
              charging: battery.charging,
              timeRemaining: battery.charging 
                ? `${Math.floor(battery.chargingTime / 3600)}h ${Math.floor((battery.chargingTime % 3600) / 60)}m`
                : `${Math.floor(battery.dischargingTime / 3600)}h ${Math.floor((battery.dischargingTime % 3600) / 60)}m`
            }
          }));
        };

        updateBattery();
        battery.addEventListener('chargingchange', updateBattery);
        battery.addEventListener('levelchange', updateBattery);
      });
    }
  }, []);

  // Get network info if available
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateConnection = () => {
        setStatus(prev => ({
          ...prev,
          network: {
            type: connection.effectiveType || '4G',
            strength: connection.downlink ? Math.min(5, Math.floor(connection.downlink / 10)) : 4,
            connected: navigator.onLine
          }
        }));
      };

      updateConnection();
      connection.addEventListener('change', updateConnection);
      window.addEventListener('online', updateConnection);
      window.addEventListener('offline', updateConnection);
    }
  }, []);

  // Get location and weather
  const updateLocation = async () => {
    setIsLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Simulate weather API call
            const weatherData = {
              temperature: Math.round(15 + Math.random() * 20),
              condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
              humidity: Math.round(40 + Math.random() * 40)
            };

            setStatus(prev => ({
              ...prev,
              location: {
                latitude,
                longitude,
                city: 'Current Location',
                weather: weatherData
              }
            }));
          },
          (error) => {
            setError('Location access denied');
          }
        );
      }
    } catch (err) {
      setError('Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh system status
  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/system-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      setError('Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle system features
  const toggleFeature = (feature: string, enabled: boolean) => {
    setStatus(prev => ({
      ...prev,
      [feature]: { ...prev[feature as keyof SystemStatus], enabled }
    }));
  };

  // Get status color based on values
  const getStatusColor = (type: 'battery' | 'memory' | 'storage' | 'temperature') => {
    switch (type) {
      case 'battery':
        if (status.battery.level > 50) return 'text-green-400';
        if (status.battery.level > 20) return 'text-yellow-400';
        return 'text-red-400';
      case 'memory':
        if (status.device.memory.percentage < 70) return 'text-green-400';
        if (status.device.memory.percentage < 90) return 'text-yellow-400';
        return 'text-red-400';
      case 'storage':
        if (status.device.storage.percentage < 80) return 'text-green-400';
        if (status.device.storage.percentage < 95) return 'text-yellow-400';
        return 'text-red-400';
      case 'temperature':
        if (status.device.temperature < 35) return 'text-green-400';
        if (status.device.temperature < 40) return 'text-yellow-400';
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  return {
    status,
    isLoading,
    error,
    updateLocation,
    refreshStatus,
    toggleFeature,
    getStatusColor
  };
};