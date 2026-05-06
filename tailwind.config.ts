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
        background: '#07080a',
        foreground: '#f9f9f9',
        primary: {
          DEFAULT: '#FF6363',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#18191a',
          foreground: '#f9f9f9',
        },
        accent: {
          DEFAULT: '#55b3ff',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#FF6363',
          foreground: '#ffffff',
        },
        border: '#252829',
        input: '#252829',
        ring: '#FF6363',
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
