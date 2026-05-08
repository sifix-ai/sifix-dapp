# SIFIX Premium Design System

## Overview

This website implements a **Resend-inspired** design system combined with SIFIX's violet/pink/indigo brand palette. The result is a premium, editorial-quality interface that feels like a developer tool with the typography of a design magazine.

## Design Philosophy

### Core Principles

1. **Editorial Typography** - DM Serif Display headlines at 76-96px create magazine-quality impact
2. **Pure Black Canvas** - `#0a0118` background (not near-black) for maximum contrast
3. **Atmospheric Depth** - Low-opacity radial glows instead of traditional shadows
4. **Translucent Borders** - Hairline borders with `rgba(255,255,255,0.06)` for subtle elevation
5. **Generous Whitespace** - 96px section padding for breathing room
6. **Scroll-Triggered Animations** - Blur-in effects with staggered delays

## Typography System

### Font Families

```typescript
Display: DM Serif Display (400 weight only)
Body: DM Sans (400, 500, 600)
UI: Inter (400, 500, 600)
Code: Geist Mono (400)
```

### Type Scale

| Token | Size | Weight | Use Case |
|-------|------|--------|----------|
| `text-9xl` | 96px | 400 | Hero headlines |
| `text-7xl` | 76px | 400 | Section headlines |
| `text-6xl` | 56px | 400 | Sub-headlines |
| `text-2xl` | 24px | 500 | Card titles |
| `text-lg` | 18px | 400 | Body copy |
| `text-base` | 16px | 400 | Default body |
| `text-sm` | 14px | 400 | Captions |

### Typography Rules

- Display headlines: `font-display` + `leading-none` + negative letter-spacing
- Body copy: `font-body` + `leading-relaxed`
- UI labels: `font-sans` (Inter) + `tracking-wide` for uppercase
- Code: `font-mono` + `leading-relaxed`

## Color System

### Brand Colors

```css
/* Primary Brand */
--violet-500: #8b5cf6
--pink-500: #ec4899
--indigo-500: #6366f1
--cyan-500: #06b6d4

/* Surface */
--background: #0a0118 (pure black with purple tint)
--surface-card: #1a1625 (one step lighter)
--surface-elevated: #2d1b4e (two steps lighter)

/* Text */
--foreground: #f8f7ff (off-white with purple tint)
--foreground-70: rgba(248, 247, 255, 0.7)
--foreground-60: rgba(248, 247, 255, 0.6)
```

### Gradient Utilities

```css
.gradient-text-brand {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glow-atmosphere-violet {
  background: radial-gradient(
    ellipse 800px 600px at 50% 0%,
    rgba(139, 92, 246, 0.15) 0%,
    transparent 60%
  );
}
```

## Component Patterns

### 1. Navbar (Floating Glassmorphism)

```tsx
<nav className="fixed top-0 glass-navbar rounded-3xl shadow-resend">
  {/* Logo centered with absolute positioning */}
  {/* Nav links left, CTA right */}
</nav>
```

**Key Features:**
- Backdrop blur: `backdrop-filter: blur(16px)`
- Translucent background: `rgba(10, 1, 24, 0.4)`
- Hairline border: `border: 1px solid rgba(248, 247, 255, 0.06)`
- Scale + fade entry animation

### 2. Hero (Full Viewport)

```tsx
<section className="min-h-screen flex items-center">
  {/* Full-bleed animated gradient background */}
  {/* Gradient overlay from bottom */}
  {/* Content: label → headline → subtitle → CTAs → scroll indicator */}
</section>
```

**Key Features:**
- Animated orbs with `blur-3xl` and `animate-pulse-slow`
- Grid overlay at 10% opacity
- Blur-in text animations with staggered delays
- Scroll indicator with animated line

### 3. Bento Grid Features

```tsx
<div className="grid grid-cols-4 gap-6">
  {/* 1 large card: col-span-2 row-span-2 */}
  {/* 4 small cards: standard grid cells */}
</div>
```

**Key Features:**
- Scroll-triggered reveal with 80ms stagger
- Gradient backgrounds: `from-violet-500/20 to-pink-500/20`
- Hover glow overlay
- Icon in rounded container with scale hover

### 4. Code Showcase (Split Layout)

```tsx
<div className="grid lg:grid-cols-2 gap-12">
  {/* Left: Content with feature list */}
  {/* Right: Code window with tabs */}
</div>
```

**Key Features:**
- Traffic light dots (red, yellow, green)
- Tab switcher with smooth transitions
- Copy button with success state
- Syntax highlighting via `font-mono`

### 5. Testimonials (Auto-Scrolling)

```tsx
<div className="flex gap-6">
  {/* Column 1: scroll down */}
  {/* Column 2: scroll up */}
  {/* Column 3: scroll down */}
</div>
```

**Key Features:**
- CSS keyframe animations: `translateY(0) → translateY(-50%)`
- Duplicate cards array for seamless loop
- Gradient masks top and bottom
- Pause on hover: `hover:animation-pause`

### 6. Newsletter (Full-Width Brand Color)

```tsx
<section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-pink-600">
  {/* Glassmorphism input with backdrop blur */}
  {/* Success state swap */}
</section>
```

**Key Features:**
- Rounded-full input with inline submit button
- Backdrop blur: `bg-white/20 backdrop-blur-md`
- Success state with check icon
- Animated orbs in background

### 7. Footer (Giant Watermark)

```tsx
<footer className="relative">
  {/* Giant "SIFIX" text at 200-400px, opacity 5% */}
  {/* 4-column grid: brand + 3 link columns */}
  {/* Social icons in rounded circles */}
</footer>
```

**Key Features:**
- Watermark: `text-[400px] opacity-5` positioned absolute
- Social icons: `rounded-full bg-foreground/5 hover:bg-violet-500/20`
- Border-top separator
- Bottom bar with copyright + policy links

## Animation System

### Scroll-Triggered Reveals

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )
  
  if (sectionRef.current) {
    observer.observe(sectionRef.current)
  }
}, [])
```

**States:**
- Hidden: `opacity-0 scale-95 blur-[12px] translate-y-2`
- Visible: `opacity-100 scale-100 blur-0 translate-y-0`
- Duration: `700ms`
- Easing: `ease-out`

### Blur-In Animation

```css
@keyframes blur-in {
  0% { 
    filter: blur(12px); 
    opacity: 0; 
    transform: translateY(8px); 
  }
  100% { 
    filter: blur(0); 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.animate-blur-in {
  animation: blur-in 0.8s ease-out forwards;
}
```

**Usage:**
- Apply to section headlines
- Stagger with `animation-delay`: 0.2s, 0.4s, 0.6s
- Start with `opacity-0`

### Auto-Scroll Testimonials

```css
@keyframes scroll-down {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

.animate-scroll-down {
  animation: scroll-down 30s linear infinite;
}
```

**Implementation:**
- Duplicate cards array (spread twice)
- Column 1 & 3: scroll down
- Column 2: scroll up
- Hover: `animation-play-state: paused`

## Shadow System

### Multi-Layered Shadows (Resend Style)

```css
.shadow-resend {
  box-shadow:
    rgba(139, 92, 246, 0.04) 0px 0px 0px 1px,
    rgba(10, 1, 24, 0.04) 0px 1px 1px -0.5px,
    rgba(10, 1, 24, 0.04) 0px 3px 3px -1.5px,
    rgba(10, 1, 24, 0.04) 0px 6px 6px -3px,
    rgba(139, 92, 246, 0.04) 0px 12px 12px -6px,
    rgba(139, 92, 246, 0.04) 0px 24px 24px -12px;
}

.shadow-resend-lg {
  /* Same pattern, doubled values */
}
```

**Usage:**
- Cards: `shadow-resend`
- Navbar on scroll: `shadow-resend-lg`
- Code windows: `shadow-resend-lg`
- Never use `shadow-lg` or `shadow-xl`

## Spacing System

```css
py-24: 96px vertical (section padding)
px-6 lg:px-8: Horizontal container padding
gap-6: 24px gap between grid items
gap-12: 48px gap for larger layouts
mb-16: 64px margin bottom for section headers
```

## Border Radius Scale

```css
rounded-3xl: 24px (cards, containers, navbar)
rounded-full: 9999px (pills, avatars, buttons)
rounded-2xl: 16px (icon containers)
rounded-xl: 12px (medium containers)
```

## Responsive Breakpoints

```css
Mobile: < 768px
  - Hero: text-5xl (60px)
  - Section padding: py-16 (64px)
  - Grid: 1 column

Tablet: 768px - 1023px
  - Hero: text-7xl (76px)
  - Grid: 2 columns

Desktop: ≥ 1024px
  - Hero: text-9xl (96px)
  - Grid: 4 columns
  - Max width: 1200px
```

## Accessibility

### WCAG Compliance

- All interactive elements: minimum 44px touch target on mobile
- Color contrast: 4.5:1 minimum (foreground on background)
- Focus visible: 2px solid outline with 2px offset
- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<footer>`
- ARIA labels on icon-only buttons

### Keyboard Navigation

- Tab order follows visual hierarchy
- Skip links for main content
- Focus trap in mobile menu
- Escape key closes modals

## Performance Optimizations

### CSS Animations

- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Disconnect IntersectionObserver after trigger

### Image Optimization

- Next.js Image component for all images
- WebP format with fallbacks
- Lazy loading below fold
- Blur placeholder for LCP images

### Code Splitting

- Each section is its own component
- Dynamic imports for heavy components
- Lazy load testimonials and newsletter

## Component Checklist

- [x] Navbar floats with glassmorphism
- [x] Hero fills viewport with animated background
- [x] Every section animates on scroll
- [x] Text uses blur-in animation
- [x] Cards use multi-layered shadows
- [x] Testimonials auto-scroll in alternating directions
- [x] Code window has traffic lights and tabs
- [x] Footer has giant watermark text
- [x] All corners rounded-3xl
- [x] Works beautifully on mobile

## File Structure

```
components/sifix/
├── navbar.tsx          # Floating glassmorphism nav
├── hero.tsx            # Full-viewport hero
├── stats.tsx           # Animated counter stats
├── bento-features.tsx  # Bento grid layout
├── code-showcase.tsx   # Split layout with code window
├── testimonials.tsx    # Auto-scrolling columns
├── newsletter.tsx      # Lead capture form
├── cta-banner.tsx      # Full-width CTA
└── footer.tsx          # Giant watermark footer
```

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

## Credits

Design system inspired by:
- [Resend](https://resend.com) - Editorial typography and dark canvas
- [Linear](https://linear.app) - Glassmorphism and subtle animations
- [Stripe](https://stripe.com) - Code showcase patterns

Built with:
- Next.js 16
- TypeScript
- Tailwind CSS 4
- Framer Motion (minimal usage)
- Lucide React (icons)
