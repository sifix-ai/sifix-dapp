# SIFIX Design System

Complete design system documentation for SIFIX dApp - AI-Powered Wallet Security on 0G Chain.

---

## 🎨 Color Palette

### Primary Colors

```css
--canvas: #000000              /* Pure black background */
--ink: #fcfdff                 /* Primary text (white) */
--body: rgba(252, 253, 255, 0.86)  /* Body text (86% opacity) */
--charcoal: rgba(252, 253, 255, 0.7)  /* Secondary text (70% opacity) */
```

### Accent Colors

All accent colors use **blue spectrum only** for consistency:

```css
--accent-blue: #3b9eff         /* Primary accent (blue) */
--accent-purple: #3b9eff       /* Maps to blue */
--accent-pink: #3b9eff         /* Maps to blue */
```

**Other Accents** (for specific use cases):
```css
--accent-orange: #ff801f       /* Warnings */
--accent-yellow: #ffc53d       /* Highlights */
--accent-green: #11ff99        /* Success states */
--accent-red: #ff2047          /* Errors/Critical */
```

### Surface Colors

```css
--surface-card: #0a0a0c        /* Card backgrounds */
--surface-elevated: #101012    /* Elevated surfaces */
--surface-deep: #06060a        /* Deep backgrounds */
```

### Border Colors

```css
--hairline: rgba(255, 255, 255, 0.06)      /* Subtle borders */
--hairline-strong: rgba(255, 255, 255, 0.14)  /* Strong borders */
--divider-soft: rgba(255, 255, 255, 0.04)  /* Soft dividers */
```

### Glassmorphic Colors

```css
bg-white/[0.04]               /* Glass background */
border-white/15               /* Glass border */
backdrop-blur-md              /* Glass blur effect */
```

---

## 📐 Typography

### Font Families

```typescript
--font-inter: 'Inter', system-ui, sans-serif     /* Body text */
--font-display: 'Playfair Display', Georgia, serif  /* Headings */
```

### Font Sizes

```css
/* Display Sizes (Playfair Display) */
.text-display-xxl: 96px / 1.0 / -0.96px
.text-display-xl: 76.8px / 1.0 / -0.768px
.text-display-lg: 56px / 1.2 / -2.8px

/* Body Sizes (Inter) */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px
text-5xl: 48px
```

### Usage

```tsx
// Headings - Use Playfair Display
<h1 className="font-display text-4xl md:text-5xl font-bold text-white">
  Heading Text
</h1>

// Body - Use Inter (default)
<p className="text-lg text-body">
  Body text content
</p>
```

---

## 🎭 Components

### Glassmorphic Card

**Standard Pattern:**
```tsx
<div className="bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-xl p-4">
  {/* Content */}
</div>
```

**With Hover:**
```tsx
<div className="bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all">
  {/* Content */}
</div>
```

### Buttons

**Primary Button (Blue Gradient):**
```tsx
<button className="h-10 rounded-xl border border-white/15 bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white hover:shadow-lg hover:shadow-accent-blue/20 transition-all px-4">
  Button Text
</button>
```

**Ghost Button:**
```tsx
<button className="h-10 rounded-xl border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/30 transition-all px-4">
  Button Text
</button>
```

**Icon Button:**
```tsx
<button className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/80 to-accent-blue flex items-center justify-center hover:scale-110 transition-transform">
  <Icon className="w-5 h-5 text-white" />
</button>
```

### Badge Pills

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15">
  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
  <span className="text-sm text-white/60">Badge Text</span>
</div>
```

### Cards

**Standard Card:**
```tsx
<Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
  <div className="p-4">
    {/* Content */}
  </div>
</Card>
```

**Card with Icon Header:**
```tsx
<Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/20">
      <Icon className="w-4 h-4 text-accent-blue" />
    </div>
    <h3 className="text-lg font-semibold text-white">Card Title</h3>
  </div>
  {/* Content */}
</Card>
```

---

## 🎬 Animations

### Keyframes

```css
@keyframes gradient {
  0%, 100% { background-position: left center; }
  50% { background-position: right center; }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes aurora {
  from { background-position: 50% 50%; }
  to { background-position: 350% 50%; }
}
```

### Usage

```tsx
// Framer Motion - Fade In
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>

// CSS Animation
<div className="animate-pulse">Pulsing element</div>
<div className="animate-float">Floating element</div>
```

---

## 🎯 Spacing System

### Padding/Margin Scale

```css
p-1: 4px
p-2: 8px
p-3: 12px
p-4: 16px    /* Standard card padding */
p-6: 24px
p-8: 32px
p-12: 48px
p-16: 64px
p-24: 96px
```

### Gap Scale

```css
gap-1: 4px
gap-2: 8px
gap-3: 12px
gap-4: 16px   /* Standard gap */
gap-6: 24px
gap-8: 32px
```

---

## 🔲 Border Radius

```css
rounded-lg: 12px     /* Standard */
rounded-xl: 16px     /* Large */
rounded-2xl: 24px    /* Extra large */
rounded-full: 9999px /* Pills/Circles */
```

---

## 🌟 Shadows & Glows

### Box Shadows

```css
/* Premium shadows */
shadow-premium: 0 0 0 1px rgba(139, 92, 246, 0.1), 
                0 2px 4px rgba(0, 0, 0, 0.3), 
                0 12px 24px rgba(0, 0, 0, 0.4)

shadow-premium-lg: 0 0 0 1px rgba(139, 92, 246, 0.15), 
                   0 8px 16px rgba(0, 0, 0, 0.4), 
                   0 24px 48px rgba(139, 92, 246, 0.2)
```

### Glow Effects

```css
/* Blue glow */
shadow-lg shadow-accent-blue/20

/* Icon glow */
shadow-[0_0_8px_rgba(59,158,255,0.6)]
```

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Usage

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🎨 Gradient Patterns

### Blue Gradient (Primary)

```tsx
// Background gradient
className="bg-gradient-to-r from-accent-blue/80 to-accent-blue"

// Text gradient
className="bg-gradient-to-r from-accent-blue to-accent-blue bg-clip-text text-transparent"

// Icon background gradient
className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5"
```

### Atmospheric Gradients

```tsx
// Top to bottom fade
className="bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent"

// Radial glow
className="bg-[radial-gradient(circle_at_top,_var(--accent-blue-glow)_0%,_transparent_60%)]"
```

---

## 🎭 States & Interactions

### Hover States

```tsx
// Card hover
hover:bg-white/[0.06] hover:border-white/20

// Button hover
hover:shadow-lg hover:shadow-accent-blue/20

// Icon hover
hover:scale-110 transition-transform

// Text hover
hover:text-white transition-colors
```

### Active States

```tsx
// Active navigation
className="bg-gradient-to-r from-accent-blue to-accent-blue text-white shadow-lg shadow-accent-blue/20"

// Active button
active:scale-[0.98]
```

### Disabled States

```tsx
// Disabled button
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 🎯 Icon System

### Icon Sizes

```tsx
w-3 h-3: 12px   /* Extra small */
w-4 h-4: 16px   /* Small */
w-5 h-5: 20px   /* Medium (standard) */
w-6 h-6: 24px   /* Large */
w-8 h-8: 32px   /* Extra large */
w-12 h-12: 48px /* Hero icons */
```

### Icon with Background

```tsx
<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/20">
  <Icon className="w-4 h-4 text-accent-blue" />
</div>
```

---

## 🎨 Special Effects

### Aurora Background

```tsx
import { AuroraBackground } from '@/components/ui/aurora-background'

<AuroraBackground>
  {/* Content */}
</AuroraBackground>
```

### Marquee Animation

```tsx
import { Marquee } from '@/components/ui/marquee'

<Marquee pauseOnHover className="[--duration:40s]">
  {items.map((item) => (
    <div key={item.id}>{item.content}</div>
  ))}
</Marquee>
```

### Animated Beams

```tsx
import { AnimatedBeam } from '@/components/ui/animated-beam'

<AnimatedBeam
  containerRef={containerRef}
  fromRef={fromRef}
  toRef={toRef}
  curvature={75}
  pathColor="rgba(59, 158, 255, 0.2)"
/>
```

---

## 📋 Layout Patterns

### Page Layout

```tsx
<div className="space-y-6">
  {/* Header */}
  <div>
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
      <Icon className="w-6 h-6 text-accent-blue" />
      Page Title
    </h2>
    <p className="text-white/60">Page description</p>
  </div>

  {/* Content */}
  <Card>
    {/* Card content */}
  </Card>
</div>
```

### Grid Layouts

```tsx
// 2-column responsive
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// 3-column responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 4-column responsive
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

---

## 🎯 Best Practices

### DO ✅

- Use `font-display` for all headings
- Use blue gradients for primary actions
- Use glassmorphic styling for cards
- Use `backdrop-blur-md` with transparent backgrounds
- Use `transition-all` for smooth interactions
- Use Lucide React icons (no emojis)
- Use `space-y-6` for vertical spacing
- Use `gap-4` for grid spacing

### DON'T ❌

- Don't use green colors (except for success states)
- Don't use purple/pink gradients (all map to blue)
- Don't use emojis (use Lucide icons)
- Don't use `p-6` for cards (use `p-4`)
- Don't use full-screen layouts for "not connected" states
- Don't mix different gradient colors

---

## 🎨 Color Usage Guide

### When to Use Each Color

**Blue (`accent-blue`):**
- Primary buttons
- Active states
- Links
- Primary icons
- Gradients

**Green (`accent-green`):**
- Success messages
- "Live" indicators
- Positive stats

**Orange (`accent-orange`):**
- Warnings
- Medium risk levels

**Red (`accent-red`):**
- Errors
- Critical threats
- Destructive actions

**Yellow (`accent-yellow`):**
- Highlights
- Important notices

---

## 📦 Component Library

### Core Components

```
components/
├── ui/
│   ├── button.tsx           # Button variants
│   ├── card.tsx             # Card component
│   ├── badge.tsx            # Badge component
│   ├── aurora-background.tsx # Aurora effect
│   ├── marquee.tsx          # Marquee animation
│   ├── animated-beam.tsx    # Beam animation
│   └── glassmorphic-navbar.tsx # Navbar
├── blocks/
│   ├── features-grid.tsx    # Feature cards
│   ├── pipeline-flowchart.tsx # Pipeline diagram
│   ├── why-sifix.tsx        # Benefits section
│   └── partners-section.tsx # Partner logos
└── connect-button.tsx       # Wallet connection
```

---

## 🎯 Accessibility

### Color Contrast

All text colors meet WCAG AA standards:
- White text on black: 21:1 ratio
- `text-body` (86% opacity): 18:1 ratio
- `text-charcoal` (70% opacity): 14.7:1 ratio

### Focus States

```tsx
focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-canvas
```

### Screen Reader Support

```tsx
<button aria-label="Descriptive label">
  <Icon aria-hidden="true" />
</button>
```

---

## 📝 Code Examples

### Complete Card Example

```tsx
<Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/20">
      <Shield className="w-4 h-4 text-accent-blue" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">Card Title</h3>
      <p className="text-xs text-white/40">Subtitle</p>
    </div>
  </div>
  
  <div className="space-y-3">
    <p className="text-sm text-white/80">Card content goes here</p>
    
    <button className="w-full h-10 rounded-xl bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white hover:shadow-lg hover:shadow-accent-blue/20 transition-all">
      Action Button
    </button>
  </div>
</Card>
```

---

## 🚀 Quick Start

1. **Import utilities:**
```tsx
import { cn } from '@/lib/utils'
```

2. **Use glassmorphic pattern:**
```tsx
className={cn(
  "bg-white/[0.04] backdrop-blur-md border border-white/15",
  "hover:bg-white/[0.06] hover:border-white/20",
  "transition-all duration-200"
)}
```

3. **Add blue gradient:**
```tsx
className="bg-gradient-to-r from-accent-blue/80 to-accent-blue"
```

4. **Add motion:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

---

## 📚 Resources

- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **Lucide Icons:** https://lucide.dev
- **Radix UI:** https://www.radix-ui.com
- **shadcn/ui:** https://ui.shadcn.com

---

**Built with ❤️ for 0G Chain APAC Hackathon 2026**
