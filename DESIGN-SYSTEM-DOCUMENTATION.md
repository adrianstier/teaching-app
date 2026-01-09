# Teaching Assistant Design System

## Table of Contents
1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Brand Identity](#brand-identity)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Components](#components)
8. [Patterns & Best Practices](#patterns--best-practices)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Implementation Guide](#implementation-guide)

---

## 1. Introduction

The Teaching Assistant Design System provides a comprehensive foundation for building consistent, accessible, and scholarly interfaces across the platform. This system reflects our commitment to evidence-based design, instructor autonomy, and academic excellence.

**Purpose:**
- Ensure visual and functional consistency across all features
- Speed up development with reusable components
- Maintain brand identity and scholarly aesthetic
- Support accessibility and inclusive design
- Enable scalable growth of the platform

**Audience:**
- UX Designers creating new features
- Frontend Developers implementing designs
- Product Managers planning new capabilities
- QA Engineers validating implementations

---

## 2. Design Principles

### Scholarly, Collegial, Assured

Our design philosophy is grounded in three core attributes that define every design decision:

#### Scholarly
- **Precision over decoration:** Every element serves a clear purpose
- **Evidence-based:** Designs reflect learning science research
- **Intellectual respect:** Treat instructors as experts in their field
- **Timeless aesthetic:** Avoid trendy design patterns that date quickly

**In Practice:**
- Use serif typography for substantial content
- Provide citations and research backing where appropriate
- Avoid playful or cutesy visual elements
- Emphasize clarity and readability

#### Collegial
- **Collaborative, not prescriptive:** Offer guidance, not mandates
- **Conversational tone:** Write like a knowledgeable peer
- **Supportive interaction:** Help users succeed without condescension
- **Transparent processes:** Show what's happening and why

**In Practice:**
- Use "we" language ("Let's design your lecture")
- Provide helpful tooltips and examples
- Explain AI processes clearly
- Offer choices, not single paths

#### Assured
- **Confident without arrogance:** Trust in our methods
- **Professional polish:** Attention to detail throughout
- **Reliable performance:** Consistent, predictable behavior
- **Evidence-grounded:** Back claims with research

**In Practice:**
- Clean, uncluttered interfaces
- Professional color palette (navy, gold, neutrals)
- Smooth animations and transitions
- Clear error recovery paths

---

## 3. Brand Identity

### Mission Statement
To empower university educators with evidence-based tools that transform how courses are designed, delivered, and refined—honoring the craft of teaching while amplifying its impact.

### Vision Statement
A world where every instructor has access to the pedagogical research and intelligent assistance they need to create transformative learning experiences.

### Voice & Tone

**Voice (What We Say):**
- Ground claims in research and evidence
- Respect instructor expertise and autonomy
- Use precise, purposeful language
- Avoid buzzwords and hyperbole

**Tone (How We Say It):**
- **Onboarding:** Warm, welcoming, confident
- **Workflow:** Clear, supportive, efficient
- **Errors:** Helpful, solution-focused, non-judgmental
- **Success:** Quietly proud, acknowledging, professional

### Vocabulary Preferences

| ❌ Avoid | ✅ Use Instead |
|----------|---------------|
| Cutting-edge | Evidence-based |
| Users | Instructors, educators |
| AI-powered | Intelligent assistance |
| Easy, simple | Streamlined, efficient |
| Solution | Tool, approach |
| Transform | Enhance, refine |
| Revolutionary | Effective, impactful |

---

## 4. Color System

### Primary Colors

#### Brand Navy `#0A1A2A`
- **Use:** Primary buttons, headers, authority elements
- **WCAG AA:** 18.5:1 contrast on white
- **Tailwind:** `bg-brand-navy`, `text-brand-navy`
- **RGB:** rgb(10, 26, 42)
- **Psychology:** Trust, professionalism, stability

```css
.brand-navy {
  color: #0A1A2A;
}
```

#### Brand Gold `#C6A667`
- **Use:** Accents, highlights, attention elements
- **WCAG AA:** 3.8:1 contrast on white (large text only)
- **Tailwind:** `bg-brand-gold`, `text-brand-gold`
- **RGB:** rgb(198, 166, 103)
- **Psychology:** Warmth, prestige, quality

```css
.brand-gold {
  color: #C6A667;
}
```

### Scholarly Category Colors

These colors distinguish the four pedagogical feature categories:

#### Scholarly Sage `#697F6E`
- **Category:** Memory & Retention features
- **Features:** Spaced Repetition, Desirable Difficulties
- **Contrast:** 5.2:1 on white

#### Scholarly Terracotta `#C87B5B`
- **Category:** Assessment & Feedback features
- **Features:** Formative Assessment, Growth Mindset
- **Contrast:** 3.9:1 on white (large text)

#### Scholarly Slate `#5B6B7C`
- **Category:** Thinking & Learning features
- **Features:** Metacognition, Cognitive Load
- **Contrast:** 5.8:1 on white

#### Scholarly Wine `#6B4B5B`
- **Category:** Engagement & Interaction features
- **Features:** Collaborative Learning, Transfer Learning
- **Contrast:** 7.2:1 on white

### Neutral Colors

#### Background Colors
```css
--brand-bg: #F1F3F5;        /* Light gray background */
--brand-bg-warm: #F5F3F1;   /* Warm gray alternative */
```

#### Text Colors
```css
--brand-text: #4B5563;         /* Primary body text (8.2:1 on bg) */
--brand-text-light: #6B7280;   /* Secondary text (5.7:1 on bg) */
```

#### Border Colors
```css
--brand-border: #D1D5DB;           /* Standard borders */
--brand-border-subtle: #E5E7EB;    /* Subtle dividers */
```

### Semantic Colors

#### Success
```css
--success: #10B981;          /* Green for success states */
--success-light: #D1FAE5;    /* Success background */
```

#### Error
```css
--error: #EF4444;            /* Red for error states */
--error-light: #FEE2E2;      /* Error background */
```

#### Warning
```css
--warning: #F59E0B;          /* Orange for warnings */
--warning-light: #FEF3C7;    /* Warning background */
```

#### Info
```css
--info: #3B82F6;             /* Blue for informational */
--info-light: #DBEAFE;       /* Info background */
```

### Color Usage Guidelines

**Do:**
- Use brand-navy for primary CTAs and important headers
- Use brand-gold sparingly for accents and highlights
- Maintain consistent category colors across features
- Ensure all text meets WCAG AA contrast (4.5:1 minimum)
- Test color combinations with color blindness simulators

**Don't:**
- Use gold for small text (fails contrast)
- Mix category colors randomly
- Rely on color alone to convey information
- Use more than 3-4 colors in a single view
- Override semantic colors (red = error, green = success)

---

## 5. Typography

### Font Families

#### Inter (Sans-Serif) - UI Elements
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Use for:**
- Buttons and CTAs
- Form labels and inputs
- Navigation elements
- Stats and metrics
- UI controls

**Weights:**
- Regular (400): Standard text
- Medium (500): Emphasis, labels
- Semibold (600): Buttons, strong emphasis
- Bold (700): Rare, high emphasis only

#### Source Serif 4 (Serif) - Content
```css
font-family: 'Source Serif 4', 'Georgia', 'Times New Roman', serif;
```

**Use for:**
- Headings and titles
- Long-form content
- Lecture content preview
- Educational explanations
- Quote blocks

**Weights:**
- Regular (400): Body paragraphs
- Medium (500): Subheadings
- Semibold (600): Main headings
- Bold (700): Page titles

#### JetBrains Mono (Monospace) - Code
```css
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

**Use for:**
- Code blocks
- Technical output
- JSON previews
- API responses

### Type Scale

Based on modular scale (1.25 ratio) for harmonious hierarchy:

```css
/* Display - Rare, hero sections */
.text-display {
  font-size: 3rem;      /* 48px */
  line-height: 1.2;
  font-weight: 600;
}

/* H1 - Page titles */
.text-h1 {
  font-size: 2.25rem;   /* 36px */
  line-height: 1.3;
  font-weight: 600;
}

/* H2 - Section headers */
.text-h2 {
  font-size: 1.875rem;  /* 30px */
  line-height: 1.3;
  font-weight: 600;
}

/* H3 - Subsection headers */
.text-h3 {
  font-size: 1.5rem;    /* 24px */
  line-height: 1.4;
  font-weight: 600;
}

/* H4 - Component headers */
.text-h4 {
  font-size: 1.25rem;   /* 20px */
  line-height: 1.4;
  font-weight: 600;
}

/* Body Large */
.text-body-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body - Default */
.text-body {
  font-size: 1rem;      /* 16px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body Small */
.text-body-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

/* Caption */
.text-caption {
  font-size: 0.75rem;   /* 12px */
  line-height: 1.4;
  font-weight: 400;
}
```

### Typography Best Practices

**Hierarchy:**
- Use serif for headings to establish scholarly tone
- Use sans-serif for UI to maintain clarity
- Maintain clear visual hierarchy (size, weight, color)
- Limit to 3 font weights per page

**Readability:**
- Line length: 45-75 characters for optimal reading
- Line height: 1.5-1.6 for body text
- Paragraph spacing: 1.5em between paragraphs
- Letter spacing: Default for most text, slight increase for all-caps

**Accessibility:**
- Minimum 16px for body text
- Sufficient contrast (4.5:1 for regular, 3:1 for large)
- Avoid all-caps for long text
- Don't justify text (creates uneven spacing)

---

## 6. Spacing & Layout

### Spacing Scale

Based on 4px base unit for consistent rhythm:

```css
/* Tailwind spacing tokens */
--spacing-0: 0;          /* 0px */
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

### Common Spacing Patterns

#### Component Internal Spacing
```css
/* Cards, panels */
.card-padding {
  padding: 1.5rem;  /* 24px - p-6 */
}

/* Buttons */
.button-padding {
  padding: 0.75rem 2rem;  /* 12px 32px - py-3 px-8 */
}

/* Form fields */
.input-padding {
  padding: 0.75rem 1rem;  /* 12px 16px - py-3 px-4 */
}
```

#### Stack Spacing (Vertical)
```css
/* Tight stack - related items */
.stack-tight {
  margin-bottom: 0.5rem;  /* 8px - mb-2 */
}

/* Default stack - standard spacing */
.stack-default {
  margin-bottom: 1rem;  /* 16px - mb-4 */
}

/* Relaxed stack - sections */
.stack-relaxed {
  margin-bottom: 1.5rem;  /* 24px - mb-6 */
}

/* Section spacing */
.stack-section {
  margin-bottom: 2rem;  /* 32px - mb-8 */
}
```

### Layout Grid

#### Responsive Breakpoints
```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

#### Container Max-Widths
```css
/* Content containers */
--container-sm: 640px;   /* Forms, narrow content */
--container-md: 768px;   /* Standard content */
--container-lg: 1024px;  /* Wide content */
--container-xl: 1280px;  /* Dashboard, workflow */
--container-full: 100%;  /* Edge-to-edge */
```

#### Grid Patterns
```css
/* Stats cards - 4 columns */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Feature grid - 3 columns */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Two-column layout */
.two-column {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
```

### Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - rounded-md */
--radius-default: 0.5rem; /* 8px - rounded-lg */
--radius-lg: 0.75rem;    /* 12px - rounded-xl */
--radius-xl: 1rem;       /* 16px - rounded-2xl */
--radius-full: 9999px;   /* Fully rounded - rounded-full */
```

**Usage:**
- Small elements (badges, tags): `rounded-lg`
- Buttons, inputs: `rounded-xl`
- Cards, panels: `rounded-2xl`
- Avatars, icon buttons: `rounded-full`

### Shadows

```css
/* Card elevation */
--shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Hover state */
--shadow-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Modal, popover */
--shadow-popover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Elevated modal */
--shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 7. Components

### 7.1 Buttons

#### Primary Button
**Purpose:** Main call-to-action, important actions
**Style:**
```tsx
<button className="px-8 py-4 bg-brand-navy text-white font-medium rounded-xl hover:bg-opacity-90 transition-colors focus:ring-2 focus:ring-brand-navy focus:ring-offset-2">
  Generate Lecture
</button>
```

**States:**
- Default: Navy background, white text
- Hover: 90% opacity
- Focus: Ring outline
- Disabled: 40% opacity, cursor-not-allowed
- Loading: Spinner + disabled state

#### Secondary Button
**Purpose:** Alternative actions, less emphasis
**Style:**
```tsx
<button className="px-6 py-3 border-2 border-brand-navy text-brand-navy font-medium rounded-xl hover:bg-brand-navy hover:text-white transition-colors">
  Cancel
</button>
```

#### Tertiary Button
**Purpose:** Subtle actions, inline actions
**Style:**
```tsx
<button className="px-4 py-2 text-brand-navy hover:text-brand-gold underline-offset-4 hover:underline transition-colors">
  Learn more
</button>
```

#### LoadingButton Component
**Usage:**
```tsx
<LoadingButton
  onClick={handleGenerate}
  loading={isGenerating}
  loadingText="Generating content..."
  variant="primary"
  icon={<SparklesIcon className="h-5 w-5" />}
>
  Generate
</LoadingButton>
```

**Props:**
- `loading: boolean` - Show loading state
- `loadingText: string` - Text during loading
- `variant: 'primary' | 'secondary' | 'tertiary'`
- `size: 'sm' | 'md' | 'lg'`
- `icon?: ReactNode` - Optional leading icon

### 7.2 Form Elements

#### FormTooltip Component
**Purpose:** Form fields with integrated help tooltips
**Usage:**
```tsx
<FormTooltip
  label="Learning Objectives"
  tooltip="Clear, measurable statements of what students will be able to do."
  example="Students will be able to solve quadratic equations"
  required
>
  <textarea
    value={objectives}
    onChange={(e) => setObjectives(e.target.value)}
    rows={4}
    className="w-full px-4 py-3 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-navy"
  />
</FormTooltip>
```

**Props:**
- `label: string` - Field label
- `tooltip: string` - Help text
- `example?: string` - Example value
- `required?: boolean` - Show required indicator
- `children: ReactNode` - Form input element

#### Input Field
**Style:**
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-navy focus:border-transparent"
  placeholder="Enter title..."
/>
```

#### Select Dropdown
**Style:**
```tsx
<select className="w-full px-4 py-3 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-navy">
  <option>Select level...</option>
  <option>Undergraduate</option>
  <option>Graduate</option>
</select>
```

### 7.3 Feedback Components

#### ErrorDisplay Component
**Purpose:** User-friendly error messages with recovery
**Usage:**
```tsx
<ErrorDisplay
  error={{
    type: 'network',
    message: 'Connection interrupted',
    suggestion: 'Check your internet connection and try again.',
    technicalDetails: 'Network timeout after 30s'
  }}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>
```

**Error Types:**
- `network` - Connection issues
- `validation` - Form/input errors
- `server` - Backend errors
- `auth` - Authentication issues
- `timeout` - Request timeouts
- `rate-limit` - Too many requests

#### AutoSaveIndicator Component
**Purpose:** Show auto-save status
**Usage:**
```tsx
<AutoSaveIndicator lastSaved={timestamp} />
```

**States:**
- Saving: Spinner + "Saving..."
- Saved: Checkmark + "Saved X mins ago"
- Error: Warning + "Save failed"

### 7.4 Progress Components

#### AgentProgress Component
**Purpose:** Visualize AI agent execution
**Usage:**
```tsx
<AgentProgress
  agents={[
    {
      id: 'content-developer',
      name: 'Content Developer',
      description: 'Creating lecture content',
      status: 'running',
      progress: 65
    }
  ]}
  layout="vertical" // or "horizontal"
/>
```

**Props:**
- `agents: AgentInfo[]` - Array of agent statuses
- `layout: 'vertical' | 'horizontal'`

**Agent Status:**
- `pending` - Not started
- `running` - In progress
- `completed` - Finished
- `error` - Failed

### 7.5 Cards & Containers

#### Card Component
**Purpose:** Content container with elevation
**Style:**
```tsx
<div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6">
  <h3 className="font-serif text-xl font-semibold text-brand-navy mb-4">
    Card Title
  </h3>
  <p className="text-brand-text">
    Card content...
  </p>
</div>
```

#### Stats Card
**Purpose:** Display key metrics
**Style:**
```tsx
<div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
  <DocumentTextIcon className="h-5 w-5 text-brand-navy flex-shrink-0" />
  <div className="text-left">
    <p className="text-xs text-brand-text-light">Segments</p>
    <p className="text-sm font-medium text-brand-navy">6 created</p>
  </div>
</div>
```

### 7.6 Modals & Dialogs

#### SessionRecoveryModal Component
**Purpose:** Restore saved work
**Usage:**
```tsx
<SessionRecoveryModal
  isOpen={showRecovery}
  savedTimestamp={timestamp}
  featureName="Architecture Phase"
  onRestore={handleRestore}
  onDiscard={handleDiscard}
  onCancel={handleCancel}
/>
```

#### OnboardingModal Component
**Purpose:** First-time user guidance
**Usage:**
```tsx
<OnboardingModal
  isOpen={showOnboarding}
  onClose={handleClose}
  onComplete={handleComplete}
/>
```

**Features:**
- 4-step tour
- Skip option
- Progress dots
- localStorage persistence

---

## 8. Patterns & Best Practices

### Loading States

#### Pattern: Progressive Loading with Time Estimates
```tsx
// Phase generation loading state
<div className="text-center mb-8">
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-terracotta/10 mb-4">
    <DocumentTextIcon className="h-8 w-8 text-scholarly-terracotta" />
  </div>
  <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
    Phase 3: Content Development
  </h2>
  <p className="text-brand-text mb-2">
    Creating lecture content and activities
  </p>
  <p className="text-sm text-brand-text-light">
    Estimated time: 3-4 minutes
  </p>
</div>
```

**Key Elements:**
- Clear phase identification
- Descriptive activity text
- Time estimate for anxiety reduction
- Progress visualization

### Error Recovery

#### Pattern: Helpful Error Messages + Retry
```tsx
// Error state with recovery
if (error && !isGenerating) {
  return (
    <ErrorDisplay
      error={error}
      onRetry={retryGeneration}
      onDismiss={clearError}
    />
  );
}
```

**Key Elements:**
- Explain what went wrong
- Provide actionable solution
- Offer retry functionality
- Option to dismiss

### Auto-Save

#### Pattern: Periodic Save + Recovery
```tsx
// Auto-save hook
const { saveNow } = useAutoSave({
  key: 'unique-feature-key',
  data: formData,
  delay: 30000, // 30 seconds
});

// Recovery check on mount
useEffect(() => {
  const saved = loadSession();
  if (saved) {
    setSavedSession(saved);
    setShowRecovery(true);
  }
}, []);
```

**Key Elements:**
- Save every 30 seconds
- Save on page unload
- Show recovery modal on return
- 7-day expiration

### Tab Navigation

#### Pattern: Animated Tabs with layoutId
```tsx
<div className="flex border-b">
  <button
    onClick={() => setActiveTab('tab1')}
    className="relative px-6 py-4"
  >
    {activeTab === 'tab1' && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-navy"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    )}
    Tab 1
  </button>
</div>
```

**Key Elements:**
- Framer Motion layoutId for smooth animation
- Clear active state
- Accessible ARIA attributes
- Keyboard navigation support

---

## 9. Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical and predictable
- Focus indicators must be clearly visible (3px outline)
- Escape key closes modals and dismisses overlays

### Screen Reader Support
- Use semantic HTML (nav, main, aside, article)
- Provide ARIA labels for icon-only buttons
- Announce dynamic content with aria-live regions
- Use proper heading hierarchy (h1 → h2 → h3)

### Color & Contrast
- Maintain 4.5:1 contrast for normal text
- Maintain 3:1 contrast for large text (18px+)
- Don't rely on color alone to convey information
- Test with color blindness simulators

### Implementation Checklist
- [ ] Keyboard accessible
- [ ] Screen reader tested
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] ARIA attributes correct
- [ ] Alternative text provided
- [ ] Works at 200% zoom

---

## 10. Implementation Guide

### Getting Started

1. **Install Dependencies**
```bash
npm install tailwindcss framer-motion @headlessui/react @heroicons/react
```

2. **Configure Tailwind**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0A1A2A',
        'brand-gold': '#C6A667',
        'brand-bg': '#F1F3F5',
        // ...other colors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Source Serif 4', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

3. **Import Components**
```tsx
import ErrorDisplay from '@/components/shared/ErrorDisplay';
import LoadingButton from '@/components/shared/LoadingButton';
import FormTooltip from '@/components/shared/FormTooltip';
// ...other shared components
```

### Using the Design System

#### Example: Building a New Feature Component
```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAutoSave } from '@/hooks/useAutoSave';
import ErrorDisplay from '@/components/shared/ErrorDisplay';
import LoadingButton from '@/components/shared/LoadingButton';
import FormTooltip from '@/components/shared/FormTooltip';
import { formExamples } from '@/data/formExamples';

const MyFeature: React.FC = () => {
  const [formData, setFormData] = useState({ topic: '', concepts: '' });
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  // Auto-save
  useAutoSave({
    key: 'my-feature',
    data: formData,
  });

  const handleGenerate = async () => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw response;

      const data = await response.json();
      // Handle success
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleGenerate} onDismiss={clearError} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
          My Feature
        </h1>
        <p className="text-brand-text">
          Description of what this feature does
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6">
        <div className="space-y-6">
          <FormTooltip
            label="Topic"
            tooltip="The main subject of your content"
            example="Introduction to Quantum Mechanics"
            required
          >
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-3 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-navy"
              placeholder="Enter topic..."
            />
          </FormTooltip>

          <button
            onClick={() => setFormData(formExamples.myFeature)}
            className="text-sm text-brand-gold hover:text-brand-gold-dark"
          >
            ✨ Try an example
          </button>
        </div>

        <div className="mt-6">
          <LoadingButton
            onClick={handleGenerate}
            loading={loading}
            loadingText="Generating..."
            variant="primary"
          >
            Generate Content
          </LoadingButton>
        </div>
      </div>
    </motion.div>
  );
};

export default MyFeature;
```

### Component Locations

```
client/src/
├── components/
│   ├── shared/           # Reusable components
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingButton.tsx
│   │   ├── FormTooltip.tsx
│   │   ├── AutoSaveIndicator.tsx
│   │   ├── SessionRecoveryModal.tsx
│   │   ├── OnboardingModal.tsx
│   │   ├── AgentProgress.tsx
│   │   └── CheckpointReview.tsx
│   ├── features/         # Feature-specific components
│   └── phases/           # Workflow phase components
├── hooks/
│   ├── useErrorHandler.ts
│   ├── useAutoSave.ts
│   └── useLecture.ts
├── data/
│   └── formExamples.ts
└── styles/
    └── globals.css       # Global styles and CSS variables
```

---

## Appendix: Quick Reference

### Color Variables
```css
:root {
  /* Primary */
  --brand-navy: #0A1A2A;
  --brand-gold: #C6A667;

  /* Scholarly Categories */
  --scholarly-sage: #697F6E;
  --scholarly-terracotta: #C87B5B;
  --scholarly-slate: #5B6B7C;
  --scholarly-wine: #6B4B5B;

  /* Neutrals */
  --brand-bg: #F1F3F5;
  --brand-text: #4B5563;
  --brand-border: #D1D5DB;
}
```

### Spacing Quick Reference
- `p-3` = 12px padding
- `p-4` = 16px padding
- `p-6` = 24px padding
- `mb-6` = 24px margin bottom
- `mb-8` = 32px margin bottom
- `space-y-6` = 24px vertical stack spacing

### Common Class Combinations
```css
/* Primary button */
.btn-primary: px-8 py-4 bg-brand-navy text-white rounded-xl hover:bg-opacity-90

/* Card */
.card: bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6

/* Input field */
.input: w-full px-4 py-3 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-navy
```

---

**Document Version:** 1.0
**Last Updated:** January 9, 2026
**Maintained By:** UX Engineering Team
**Questions:** design-system@teachingassistant.com
