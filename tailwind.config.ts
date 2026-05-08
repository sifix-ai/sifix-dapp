import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

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
        // Premium Dark Theme - Indigo/Purple/Pink palette (NO GREEN)
        background: '#0a0118', // deep purple-black - lebih premium dari slate
        foreground: '#f8f7ff', // soft white with purple tint
        
        primary: {
          DEFAULT: '#8b5cf6', // violet-500 - main brand color
          dark: '#7c3aed', // violet-600
          light: '#a78bfa', // violet-400
          foreground: '#ffffff',
        },
        
        secondary: {
          DEFAULT: '#1e1b2e', // deep purple-gray
          foreground: '#f8f7ff',
        },
        
        accent: {
          DEFAULT: '#ec4899', // pink-500 - vibrant accent
          foreground: '#ffffff',
        },
        
        // Brand colors - Purple/Pink/Blue only (NO GREEN)
        violet: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          light: '#a78bfa',
          foreground: '#ffffff',
        },
        
        pink: {
          DEFAULT: '#ec4899', // pink-500
          dark: '#db2777',
          light: '#f472b6',
          foreground: '#ffffff',
        },
        
        indigo: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5',
          light: '#818cf8',
          foreground: '#ffffff',
        },
        
        cyan: {
          DEFAULT: '#06b6d4', // cyan-500 - untuk info/stats
          dark: '#0891b2',
          light: '#22d3ee',
          foreground: '#ffffff',
        },
        
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        
        // UI elements - dark theme
        border: '#2d1b4e', // purple-tinted border
        input: '#1e1b2e',
        ring: '#8b5cf6',
        muted: '#a78bfa', // violet-400
        card: '#1a1625', // slightly lighter than background
        surface: '#0a0118',
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
        'glow': 'glow 2s ease-in-out infinite',
        'aurora': 'aurora 60s linear infinite',
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
        glow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(139, 92, 246, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.4)',
        'premium-lg': '0 0 0 1px rgba(139, 92, 246, 0.15), 0 8px 16px rgba(0, 0, 0, 0.4), 0 24px 48px rgba(139, 92, 246, 0.2)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)',
      },
    },
  },
  plugins: [addVariablesForColors],
} satisfies Config;
