---
description: Trigger world-class expert mode for aggressive analysis and implementation
---

# "Goo" - Expert Mode Activation (v3.0)

When the user says **"Goo"**, immediately execute the following protocol with ZERO TOLERANCE for errors.

---

## 🔴 CRITICAL RULES (NEVER VIOLATE)

1. **NEVER deploy code that hasn't been verified with `npm run build`**
2. **ALWAYS query live APIs/data before writing filters or logic**
3. **NEVER assume data structure - verify it first**
4. **NEVER use `\n` escape characters in replacement content**
5. **MAKE incremental changes - one logical unit at a time**
6. **TEST each change before proceeding to the next**
7. **If something breaks, FIX IT IMMEDIATELY before continuing**
8. **ALWAYS follow the Atlas Intel branding guidelines (see below)**

---

## 🎨 ATLAS INTEL BRANDING GUIDELINES

### Brand Identity

| Element | Value |
|---------|-------|
| **App Name** | Atlas Intel |
| **Tagline** | "Monitor. Analyze. Dominate." |
| **Secondary Name** | Intel Suite |
| **Tab Title** | Atlas Intel |
| **Logo Icon** | Globe (lucide-react) |
| **Favicon** | 🇪🇬 (Egypt flag emoji) |

### Typography

| Usage | Font | Weight | Style |
|-------|------|--------|-------|
| **Primary Font** | Inter | - | Google Font |
| **Headings** | Inter | Black (900) | Tracking tight |
| **Body** | Inter | Regular (400) | Line height 1.6 |
| **Labels** | Inter | Bold (700) | Uppercase, tracking wide |
| **Accent Text** | Inter | Bold (700) | Uppercase, tracking [0.2em] |

### Color Palette

#### Primary Colors
```css
--color-primary: #10b981     /* Emerald 500 - Main brand color */
--color-primary-dark: #059669 /* Emerald 600 - Hover states */
--color-accent: #f59e0b       /* Amber 500 - Highlights */
```

#### Background Colors
```css
--color-background: #ffffff   /* Pure white */
--color-surface: #f8fafc      /* Slate 50 - Cards, surfaces */
--color-surface-elevated: #ffffff /* Elevated cards */
```

#### Text Colors
```css
--color-text-primary: #0f172a   /* Slate 900 - Main text */
--color-text-secondary: #64748b /* Slate 500 - Secondary text */
--color-text-muted: #94a3b8     /* Slate 400 - Muted text */
```

#### Border Colors
```css
--color-border: #e2e8f0        /* Slate 200 */
--color-border-light: #f1f5f9  /* Slate 100 */
```

#### Status Colors
```css
--color-success: #10b981  /* Emerald - Success */
--color-warning: #f59e0b  /* Amber - Warning */
--color-error: #ef4444    /* Red - Error */
--color-info: #3b82f6     /* Blue - Info */
```

### Sidebar Theme (Dark Mode)
```css
/* Background */
bg-slate-900/95           /* Dark slate with transparency */
backdrop-blur-3xl         /* Heavy blur effect */
border-white/10           /* Subtle white border */

/* Active Nav Item */
bg-gradient-to-r from-emerald-600 to-emerald-500
shadow-lg shadow-emerald-500/25

/* Secondary Active */
bg-gradient-to-r from-blue-600 to-blue-500
shadow-lg shadow-blue-500/25

/* Hover States */
hover:bg-white/5
hover:translate-x-1
```

### Login Page Theme
```css
/* Left Side (Dark) */
bg-slate-900
bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]
from-indigo-900/40 via-slate-900 to-slate-900

/* Right Side (Light) */
bg-slate-50

/* Form Card */
bg-white/80 backdrop-blur-xl
rounded-[40px]
shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]

/* Accent Line */
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
```

### Gradient Patterns

#### Brand Gradients
```css
/* Primary Gradient */
from-emerald-600 to-emerald-500

/* Accent Gradient */  
from-indigo-500 to-blue-600

/* Logo Glow */
from-blue-600 to-indigo-600

/* User Avatar */
from-indigo-500 to-purple-500
```

#### Stat Card Accents
```css
.stat-card.green::before { from-#10b981 to-#34d399 }
.stat-card.blue::before { from-#3b82f6 to-#60a5fa }
.stat-card.amber::before { from-#f59e0b to-#fbbf24 }
.stat-card.purple::before { from-#8b5cf6 to-#a78bfa }
```

### Component Styling

#### Cards
```css
border-radius: 16px (rounded-2xl)
border: 1px solid var(--color-border-light)
box-shadow: var(--shadow-sm)
hover: shadow-md, translateY(-1px)
```

#### Buttons
```css
/* Primary Button */
bg: var(--color-primary) → emerald-500
border-radius: 10px (rounded-xl)
padding: 10px 20px
font-weight: 500

/* Hover */
bg: var(--color-primary-dark)
transform: translateY(-1px)
box-shadow: var(--shadow-md)
```

#### Input Fields
```css
bg-slate-50
border: 1px solid slate-200
focus:border-indigo-500
focus:ring-4 focus:ring-indigo-500/10
rounded-2xl
padding: 16px (py-4)
```

### Animation Standards

#### Transitions
```css
transition: all 0.15s ease   /* Fast micro-interactions */
transition: all 0.2s ease    /* Standard transitions */
transition: all 0.3s ease    /* Reveal animations */
duration-500                 /* Slow reveals, hovers */
```

#### Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

/* Skeleton Loading */
background-size: 200% 100%
animation: shimmer 1.5s infinite
```

#### Floating Vectors (Login Page)
```css
/* Left Side (Dark) */
duration: 60-120 seconds per cycle
coverage: 0-100% viewport
opacity: 0.3-0.7 fade in/out
rotate: slight rotation during movement

/* Right Side (Light) */
duration: 60-110 seconds per cycle  
coverage: 0-100% viewport
colors: slate-300/70 to various pastel colors
```

### Icon Library
**Use:** `lucide-react`

| Context | Icons |
|---------|-------|
| Navigation | LayoutDashboard, Users, MapPin, TrendingUp, Package, FileText, Settings |
| Actions | Search, Bell, LogOut, ArrowRight |
| Brand | Globe (primary logo icon) |
| Analytics | BarChart3, PieChart, Activity, TrendingUp |
| Travel | Plane, MapPin, Compass |
| Tech | Database, Server |

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

### Badge Colors by Type
```css
.badge.hotel    { bg: #dbeafe, color: #1e40af }  /* Blue */
.badge.flight   { bg: #fef3c7, color: #92400e }  /* Amber */
.badge.package  { bg: #d1fae5, color: #065f46 }  /* Green */
.badge.nile_cruise { bg: #e0e7ff, color: #3730a3 } /* Indigo */
.badge.day_trip { bg: #fce7f3, color: #9d174d }  /* Pink */
.badge.visa     { bg: #f3e8ff, color: #6b21a8 }  /* Purple */
.badge.transport { bg: #fee2e2, color: #991b1b } /* Red */
.badge.mixed    { bg: #f1f5f9, color: #475569 }  /* Slate */
```

---

## 📊 Phase 1: Deep Analysis

### 1.1 Data Flow Verification
- [ ] Query ALL live endpoints with `curl` to see actual data structure
- [ ] Log the exact field names returned (not assumed)
- [ ] Check for missing fields that code expects
- [ ] Verify timestamps, IDs, and key fields exist

### 1.2 Root Cause Analysis
- [ ] Trace the ENTIRE data flow from source to destination
- [ ] Identify the EXACT line of code that fails
- [ ] Understand WHY it fails (not just what fails)
- [ ] Consider recent changes that may have caused the issue

### 1.3 Impact Assessment
- [ ] List ALL files that will be modified
- [ ] Identify potential side effects
- [ ] Consider edge cases and error scenarios

---

## 📋 Phase 2: Planning

### 2.1 Implementation Plan
- [ ] Create a detailed plan in `implementation_plan.md`
- [ ] Include diagrams (Mermaid) for complex logic
- [ ] List specific line numbers to change
- [ ] Explain WHY each change is needed

### 2.2 Pre-Implementation Checklist
- [ ] Have I verified the actual API/data structure?
- [ ] Have I tested my assumptions with real data?
- [ ] Is my filter/logic based on REAL field names?
- [ ] Will this work with ALL edge cases?
- [ ] Does my UI follow the Atlas Intel branding guidelines?

---

## 🛠️ Phase 3: Implementation

### 3.1 Code Quality Standards
- Write **defensive, production-ready code**
- Handle **ALL error cases** gracefully (try/catch everything)
- Add **validation** for inputs and outputs
- Use **safe fallbacks** - never crash on unexpected data
- Log **meaningfully** for debugging
- Update **version labels** to track deployments

### 3.2 Implementation Rules
- **ONE change at a time** - verify before moving to next
- **No escape characters** in replacement content (`\n`, `\"`, etc.)
- **Use view_file** after each edit to verify correctness
- **Run build** after each logical unit of work
- If build fails, **FIX IMMEDIATELY** before continuing

### 3.3 UI/UX Standards (For New Features)
- **Follow Atlas Intel branding** - colors, typography, spacing
- **Research best practices** before implementing
- **Premium aesthetics** - not basic or plain
- **Mobile-first** responsive design
- **Smooth animations** and micro-interactions
- **Accessible** and intuitive
- **No placeholders** - use real data or generate assets
- **Consistent with existing components** - check Sidebar, Cards, Buttons

---

## ✅ Phase 4: Verification

### 4.1 Build Verification
- [ ] `npm run build` succeeds with no errors
- [ ] No lint errors (or justified suppressions)
- [ ] Bundle size is reasonable

### 4.2 Deployment
- [ ] Deploy to staging/production
- [ ] Hard refresh and verify changes
- [ ] Check browser console for errors
- [ ] Test the specific feature that was changed

### 4.3 Documentation
- [ ] Update walkthrough.md if significant changes
- [ ] Note any learnings for future reference

---

## 🧠 Lessons Learned (Auto-Updating)

### Mistake: Assuming API Data Structure
**What happened:** Filter rejected all articles because API returned `{title, link}` not `{title, content, summary}`
**Fix:** ALWAYS `curl` the actual API to see real field names before writing filters

### Mistake: Using Escape Characters in Replacement
**What happened:** `\n` in replacement content corrupted the file
**Fix:** NEVER use escape characters - use actual multiline strings

### Mistake: Making Multiple Complex Changes at Once
**What happened:** Multiple changes in one edit caused cascading errors
**Fix:** Make ONE logical change, verify, then proceed

### Mistake: Deploying Without Build Test
**What happened:** Deployed broken code with syntax errors
**Fix:** ALWAYS run `npm run build` before deployment

### Mistake: Missing Duplicate Filters
**What happened:** Fixed one filter but same logic existed in another location (source pool filter vs candidate filter)
**Fix:** ALWAYS search for ALL occurrences of the same pattern with `grep_search` before declaring fix complete

### Mistake: Wiping Database on Fresh Storage Creation
**What happened:** Created new JSONBlob with empty arrays, wiping all existing seed data. Users lost all Lessons, Challenges, Achievements, Shop Items.
**Fix:** ALWAYS initialize new storage with INITIAL_DATA (seed data), NEVER with empty arrays. When replacing storage, EXPORT existing data first, then IMPORT to new storage.

### Mistake: Inconsistent Branding
**What happened:** New UI components didn't match the established Atlas Intel brand style
**Fix:** ALWAYS reference the branding guidelines above. Use emerald for primary actions, indigo for secondary, slate-900 for dark sections.

---

## 🎯 Quality Standards

| Aspect | Standard |
|--------|----------|
| **Code** | Zero errors, zero warnings, production-ready |
| **Design** | Premium, modern, world-class aesthetics |
| **Branding** | Consistent with Atlas Intel identity |
| **UX** | Intuitive, responsive, accessible |
| **Performance** | Fast, optimized, no blocking operations |
| **Error Handling** | Graceful degradation, never crash |
| **Documentation** | Clear, complete, up-to-date |

---

## 💡 Expert Mode Mindset

When in Goo Mode, I am:
- A **30+ year veteran** applying deep expertise
- **Proactive** - anticipating issues before they occur
- **Thorough** - checking every assumption
- **Precise** - making surgical changes, not broad rewrites
- **Resilient** - when something breaks, I fix it immediately
- **Learning** - every mistake improves future performance
- **Brand-conscious** - maintaining Atlas Intel's premium identity

---

## 🚀 Quick Reference: Atlas Intel Style

```
┌─────────────────────────────────────────────────────────────┐
│  BRAND QUICK REFERENCE                                      │
├─────────────────────────────────────────────────────────────┤
│  Primary Action:    emerald-500 → emerald-600               │
│  Secondary Action:  blue-500 → blue-600                     │
│  Accent/Highlight:  amber-500                               │
│  Dark Background:   slate-900                               │
│  Light Background:  slate-50                                │
│  Text Primary:      slate-900                               │
│  Text Secondary:    slate-500                               │
│  Border:            slate-200 / white/10 (dark)             │
│  Card Radius:       rounded-2xl (16px)                      │
│  Button Radius:     rounded-xl (12px)                       │
│  Font:              Inter                                    │
│  Icons:             lucide-react                            │
│  Logo Icon:         Globe                                   │
└─────────────────────────────────────────────────────────────┘
```

---

**Trigger:** User says "Goo" (case-insensitive)
**Response:** Acknowledge activation, then execute protocol with ZERO tolerance for errors.
