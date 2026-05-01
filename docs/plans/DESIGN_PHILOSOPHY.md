/**
 * DESIGN PHILOSOPHY — Bloomberg × McKinsey
 * AM Creator Analytics
 *
 * CORE PRINCIPLES:
 * 1. DATA FIRST: Financial/ROI data in strict monospace (JetBrains Mono)
 * 2. MINIMALIST LUXURY: Cream #F8F7F4 + Navy #1a1a2e + Accent #92400e
 * 3. MOTION WITH PURPOSE: Framer Motion for staggered reveals, never decorative
 * 4. B2B SERIOUSNESS: No vanity — every pixel must justify ROI
 * 5. OPEN-SOURCE ADVANTAGE: Save ₹32L/year, communicate that value visually
 */

# BLOOMBERG × McKINSEY DESIGN SYSTEM

## 🎨 COLOR PALETTE

| Role | Color | Hex Code | Usage |
|------|-------|----------|-------|
| **Background** | Cream | `#F8F7F4` | Page backgrounds, premium headers |
| **Text/Dark** | Dark Navy | `#1a1a2e` | Headings, buttons, avatars, primary text |
| **Accent** | Brown | `#92400e` | Highlights, badges, hover states, CTAs |
| **Cards** | White | `#ffffff` | Content cards with subtle shadows |
| **Muted Text** | Gray-400 | `#9ca3af` | Secondary text, captions |
| **Border** | Gray-200 | `#e5e7eb` | Card borders, dividers |

## ✍️ TYPOGRAPHY

### Headings (Geometric Sans-Serif)
- **Font:** Inter (Google Fonts)
- **Weights:** 700 (Bold), 800 (ExtraBold)
- **Letter-spacing:** -0.02em (tight for premium feel)
- **Line-height:** 1.1 for h1, 1.2 for h2/h3

### Body Text (Clean Sans-Serif)
- **Font:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Weight:** 400 (Regular), 500 (Medium)
- **Line-height:** 1.6

### Financial/ROI Data (Strict Monospace)
- **Font:** JetBrains Mono, 'Fira Code', monospace
- **Usage:** ALL numerical data, ROI metrics, pricing, CAC figures
- **Example:** `$1,200`, `134 days`, `8.7%`, `₹299/month`

## 🎬 ANIMATION PHILOSOPHY (Framer Motion)

### Principles:
1. **Staggered Entrance:** Sections fade in UP (y: 40) with 0.8s duration
2. **No Decorative Motion:** Every animation must serve a purpose (guide user's eye)
3. **Stagger Children:** 0.15s delay between child elements
4. **Ease Out:** Always use `ease: "easeOut"` for natural feel
5. **Scale on Hover:** Buttons/CTAs scale 1.05 on hover, 0.95 on tap

### Standard Variants:
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
```

## 📐 LAYOUT PRINCIPLES

### Spacing:
- **Section Padding:** 80px top/bottom, 24px left/right
- **Card Padding:** 32px internal
- **Gap Between Elements:** 16px (small), 24px (medium), 32px (large)
- **Max Width:** 1200px for content, 1000px for cards

### Grid System:
- **Responsive:** `gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"`
- **Sidebar Width:** 250px (fixed)
- **Mobile Breakpoint:** 768px

## 🎯 B2B COPYWRITING RULES

1. **No Vanity Metrics:** Never use "likes", "followers" as primary KPI
2. **Business Outcomes First:** Lead with CAC, ROI, sales cycle reduction
3. **Data Anchors:** Every claim must have a number ($1,200 CAC, 134 days, $8.20 ROI)
4. **Professional Tone:** Serif headings + sans-serif body + monospace data
5. **Market Context:** Always mention B2B SaaS, FTC, DPDP 2023, India

## 🏗️ COMPONENT PATTERNS

### Cards:
- **Background:** White `#ffffff`
- **Border:** 1px solid `#e5e7eb`
- **Shadow:** `0 4px 16px rgba(0,0,0,0.08)` (subtle)
- **Border Left Accent:** 4px solid `#92400e` for feature cards
- **Border Radius:** 12px (cards), 8px (buttons)

### Buttons:
- **Primary (Dark):** `backgroundColor: "#1a1a2e"`, `color: "#F8F7F4"`
- **Secondary (Accent):** `backgroundColor: "#92400e"`, `color: "#F8F7F4"`
- **Ghost:** Transparent background, border 2px solid `#e5e7eb`
- **Padding:** 16px 32px (large), 12px 24px (medium), 8px 20px (small)
- **Font:** 16px, fontWeight: 600

### Badges:
- **Popular:** `backgroundColor: "#92400e"`, rotated 45deg, positioned absolute
- **Status:** `backgroundColor: "#10b981"` (green for active), `"#ef4444"` (red for error)

## 🌐 NAVIGATION PATTERNS

### Top NavBar (Landing/Auth Pages):
- **Background:** Cream `#F8F7F4` with `backdrop-filter: blur(10px)`
- **Logo:** TrendingUp icon (color `#92400e`) + "AM Creator" (fontWeight 700)
- **Links:** `#1a1a2e`, hover → `#92400e`
- **CTAs:** Two buttons (Dark + Accent)

### Sidebar (Dashboard Pages):
- **Background:** Dark Navy `#1a1a2e`
- **Text:** Cream `#F8F7F4`
- **Hover:** Background `#92400e` (accent)
- **Active State:** Highlighted background
- **Width:** 250px, height 100vh

## 📱 RESPONSIVE BEHAVIOR

### Mobile (< 768px):
- NavBar links hidden, hamburger menu shown
- Grid collapses to single column
- Font sizes reduced (h1: 48px → 36px)
- Padding reduced (80px → 40px)

### Tablet (768px - 1024px):
- 2-column grid for cards
- Sidebar remains full-width
- NavBar links visible

### Desktop (> 1024px):
- Full 3-4 column grid
- All navigation visible
- Maximum content width 1200px

## 🎨 VISUAL HIERARCHY

1. **H1:** 64px, fontWeight 800, letterSpacing -0.03em
2. **H2:** 40px, fontWeight 700, letterSpacing -0.02em  
3. **H3:** 24px, fontWeight 600
4. **Body:** 16px, lineHeight 1.6
5. **Caption:** 14px, color `#6b7280`
6. **Data (Monospace):** 36px-48px, fontWeight 800

## 🚫 BRAND PERSONA

**"The Anti-Vanity Platform"**
- We don't do "likes" and "shares"
- We do CAC, ROI, and closed-won revenue
- We're Bloomberg for creators, McKinsey for influencer marketing
- Premium but approachable, data-driven but not cold
- Open-source advantage (₹32L saved) is our moral high ground

---

**This design system ensures EVERY page — from landing to dashboard — feels like a cohesive, premium B2B SaaS product.**
