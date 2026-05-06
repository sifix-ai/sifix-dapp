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
        background: '#0a0a0f',
        foreground: '#e5e5e5',
        primary: {
          DEFAULT: '#ff6b6b',
          dark: '#e55a5a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#18191a',
          foreground: '#e5e5e5',
        },
        accent: {
          DEFAULT: '#4ecdc4',
          foreground: '#ffffff',
        },
        teal: {
          DEFAULT: '#4ecdc4',
          dark: '#3db8b0',
          foreground: '#ffffff',
        },
        coral: {
          DEFAULT: '#ff6b6b',
          dark: '#e55a5a',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ff6b6b',
          foreground: '#ffffff',
        },
        border: '#252829',
        input: '#252829',
        ring: '#ff6b6b',
        muted: '#9CA3AF',
        card: '#101111',
        surface: '#07080a',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
