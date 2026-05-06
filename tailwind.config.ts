import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Premium DARK Theme - Soft Dark (bukan pure black)
        background: '#0f172a', // slate-900 - lebih soft dari #07080a
        foreground: '#f1f5f9', // slate-100 - text terang
        
        primary: {
          DEFAULT: '#6366f1', // indigo - premium accent
          dark: '#4f46e5',
          light: '#818cf8',
          foreground: '#ffffff',
        },
        
        secondary: {
          DEFAULT: '#1e293b', // slate-800
          foreground: '#f1f5f9', // slate-100
        },
        
        accent: {
          DEFAULT: '#8b5cf6', // violet - elegant
          foreground: '#ffffff',
        },
        
        // Brand colors - refined
        coral: {
          DEFAULT: '#f43f5e', // rose-500
          dark: '#e11d48',
          light: '#fb7185',
          foreground: '#ffffff',
        },
        
        teal: {
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0d9488',
          light: '#2dd4bf',
          foreground: '#ffffff',
        },
        
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        
        // UI elements - dark theme
        border: '#334155', // slate-700
        input: '#1e293b', // slate-800
        ring: '#6366f1',
        muted: '#94a3b8', // slate-400
        card: '#1e293b', // slate-800
        surface: '#0f172a', // slate-900
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-1000px 0',
          },
          '100%': {
            'background-position': '1000px 0',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(99, 102, 241, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.4)',
        'premium-lg': '0 0 0 1px rgba(99, 102, 241, 0.15), 0 8px 16px rgba(0, 0, 0, 0.4), 0 24px 48px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
