import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getBatteryLevel(): number {
  // Simulate battery level between 20-100%
  return Math.floor(Math.random() * 80) + 20
}

export function getSignalStrength(): number {
  // Simulate signal strength between 1-4 bars
  return Math.floor(Math.random() * 4) + 1
}

export function vibrate(pattern: number | number[] = 200): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export function playSound(frequency: number = 440, duration: number = 200): void {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function isValidCommand(command: string): boolean {
  const validCommands = [
    'time', 'date', 'weather', 'battery', 'help',
    'lights', 'music', 'volume', 'temperature',
    'status', 'hello', 'goodbye', 'thanks'
  ]
  
  return validCommands.some(cmd => 
    command.toLowerCase().includes(cmd)
  )
}

export function extractCommand(text: string): string {
  const cleanText = text.toLowerCase()
    .replace(/hey jarvis|jarvis/gi, '')
    .trim()
  
  return cleanText
}

export function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getDeviceInfo() {
  if (typeof window === 'undefined') return null
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  }
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

export function supportsVoiceRecognition(): boolean {
  return typeof window !== 'undefined' && 
         ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

export function supportsSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (!supportsSpeechSynthesis()) return []
  return speechSynthesis.getVoices()
}

export function findBestVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices()
  
  // Prefer English voices
  const englishVoices = voices.filter(voice => 
    voice.lang.startsWith('en')
  )
  
  // Prefer male voices for Jarvis
  const maleVoices = englishVoices.filter(voice =>
    voice.name.toLowerCase().includes('male') ||
    voice.name.toLowerCase().includes('david') ||
    voice.name.toLowerCase().includes('alex')
  )
  
  return maleVoices[0] || englishVoices[0] || voices[0] || null
}

export function calculateDistance(
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 21) return "Good evening"
  return "Good night"
}

export function getRandomJarvisResponse(): string {
  const responses = [
    "At your service, sir.",
    "How may I assist you today?",
    "I'm here to help.",
    "What can I do for you?",
    "Ready for your command.",
    "Standing by.",
    "How can I be of assistance?",
    "I'm listening.",
    "What do you need?",
    "At your command."
  ]
  
  return getRandomResponse(responses)
}