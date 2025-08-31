/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        jarvis: {
          blue: '#00d4ff',
          cyan: '#00ffff',
          electric: '#0099ff',
          dark: '#0a0a0a',
          darker: '#050505',
          glow: '#00d4ff80',
          panel: '#1a1a1a',
          border: '#333333',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
            opacity: '0.8'
          },
        },
        'arc-pulse': {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)'
          },
          '70%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(0, 212, 255, 0)'
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(0, 212, 255, 0)'
          }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'bounce-glow': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0,0,0)',
            boxShadow: '0 0 20px #00d4ff'
          },
          '40%, 43%': {
            transform: 'translate3d(0, -30px, 0)',
            boxShadow: '0 0 40px #00d4ff'
          },
          '70%': {
            transform: 'translate3d(0, -15px, 0)',
            boxShadow: '0 0 30px #00d4ff'
          },
          '90%': {
            transform: 'translate3d(0,-4px,0)',
            boxShadow: '0 0 25px #00d4ff'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "arc-pulse": "arc-pulse 2s infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-in",
        "spin-slow": "spin-slow 3s linear infinite",
        "bounce-glow": "bounce-glow 2s infinite"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'jarvis-gradient': 'linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #00ffff 100%)',
        'arc-gradient': 'radial-gradient(circle, #00d4ff 0%, #0099ff 50%, transparent 70%)',
      },
      boxShadow: {
        'jarvis': '0 0 20px rgba(0, 212, 255, 0.5)',
        'jarvis-lg': '0 0 40px rgba(0, 212, 255, 0.6)',
        'jarvis-xl': '0 0 60px rgba(0, 212, 255, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}