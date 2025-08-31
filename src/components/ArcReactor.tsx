'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ArcReactorProps {
  isActive?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  isActive = false,
  isListening = false,
  isProcessing = false,
  onClick,
  className
}) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [ringRotation, setRingRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRingRotation(prev => (prev + 1) % 360);
      
      if (isListening) {
        setPulseIntensity(prev => (prev + 0.1) % 1);
      } else if (isProcessing) {
        setPulseIntensity(0.8);
      } else if (isActive) {
        setPulseIntensity(0.3);
      } else {
        setPulseIntensity(0.1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, isListening, isProcessing]);

  const getStatusColor = () => {
    if (isProcessing) return 'from-yellow-400 to-orange-500';
    if (isListening) return 'from-green-400 to-emerald-500';
    if (isActive) return 'from-cyan-400 to-blue-500';
    return 'from-gray-400 to-gray-600';
  };

  const getGlowColor = () => {
    if (isProcessing) return 'shadow-yellow-500/50';
    if (isListening) return 'shadow-green-500/50';
    if (isActive) return 'shadow-cyan-500/50';
    return 'shadow-gray-500/20';
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center cursor-pointer transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      {/* Outer Glow Ring */}
      <div 
        className={cn(
          "absolute w-64 h-64 rounded-full blur-xl transition-all duration-500",
          `bg-gradient-radial ${getStatusColor()}`,
          getGlowColor()
        )}
        style={{
          opacity: pulseIntensity * 0.6,
          transform: `scale(${1 + pulseIntensity * 0.2})`
        }}
      />

      {/* Rotating Outer Ring */}
      <div 
        className="absolute w-56 h-56 rounded-full border-2 border-cyan-500/30"
        style={{
          transform: `rotate(${ringRotation}deg)`,
          background: `conic-gradient(from 0deg, transparent, ${isActive ? '#06b6d4' : '#6b7280'}40, transparent)`
        }}
      >
        {/* Ring Segments */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-6 rounded-full transition-colors duration-300",
              isActive ? 'bg-cyan-400' : 'bg-gray-500'
            )}
            style={{
              top: '10px',
              left: '50%',
              transformOrigin: '50% 102px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              opacity: pulseIntensity > 0.5 ? 1 : 0.6
            }}
          />
        ))}
      </div>

      {/* Middle Ring */}
      <div 
        className={cn(
          "absolute w-40 h-40 rounded-full border transition-all duration-300",
          isActive ? 'border-cyan-400/60' : 'border-gray-500/40'
        )}
        style={{
          transform: `rotate(${-ringRotation * 0.7}deg) scale(${1 + pulseIntensity * 0.1})`,
          boxShadow: `inset 0 0 20px ${isActive ? '#06b6d4' : '#6b7280'}40`
        }}
      >
        {/* Inner Ring Segments */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-0.5 h-4 rounded-full transition-colors duration-300",
              isActive ? 'bg-cyan-300' : 'bg-gray-400'
            )}
            style={{
              top: '8px',
              left: '50%',
              transformOrigin: '50% 72px',
              transform: `translateX(-50%) rotate(${i * 45}deg)`
            }}
          />
        ))}
      </div>

      {/* Core Reactor */}
      <div 
        className={cn(
          "relative w-24 h-24 rounded-full transition-all duration-300",
          `bg-gradient-radial ${getStatusColor()}`,
          getGlowColor()
        )}
        style={{
          transform: `scale(${1 + pulseIntensity * 0.15})`,
          boxShadow: `0 0 40px ${isActive ? '#06b6d4' : '#6b7280'}60`
        }}
      >
        {/* Core Inner Glow */}
        <div 
          className={cn(
            "absolute inset-2 rounded-full transition-all duration-300",
            `bg-gradient-radial ${getStatusColor()}`
          )}
          style={{
            opacity: 0.8 + pulseIntensity * 0.2,
            filter: 'blur(2px)'
          }}
        />

        {/* Core Center */}
        <div 
          className={cn(
            "absolute inset-4 rounded-full transition-all duration-300",
            isActive ? 'bg-white' : 'bg-gray-300'
          )}
          style={{
            opacity: 0.9,
            boxShadow: `inset 0 0 10px ${isActive ? '#06b6d4' : '#6b7280'}80`
          }}
        />

        {/* Center Dot */}
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            isActive ? 'bg-cyan-400' : 'bg-gray-500'
          )}
          style={{
            opacity: 0.8 + pulseIntensity * 0.2,
            transform: `translate(-50%, -50%) scale(${1 + pulseIntensity * 0.5})`
          }}
        />
      </div>

      {/* Energy Particles */}
      {isActive && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.sin(ringRotation * 0.02 + i) * 30}%`,
                left: `${20 + Math.cos(ringRotation * 0.02 + i) * 30}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Status Text */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          "bg-black/50 backdrop-blur-sm border",
          isActive ? 'border-cyan-500/50 text-cyan-300' : 'border-gray-500/50 text-gray-400'
        )}>
          {isProcessing ? 'Processing...' : 
           isListening ? 'Listening...' : 
           isActive ? 'Ready' : 'Standby'}
        </div>
      </div>

      {/* Touch Ripple Effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300 pointer-events-none",
          "bg-gradient-radial from-transparent via-cyan-500/10 to-transparent"
        )}
        style={{
          opacity: isListening ? 0.6 : 0,
          transform: `scale(${isListening ? 1.5 : 1})`
        }}
      />
    </div>
  );
};

export default ArcReactor;