# CLAUDE.md - Teaching App Development Guide

## Project Overview

**Teaching Assistant** is an evidence-based platform helping university instructors design better courses, lectures, and assessments using 28 specialized AI agents and pedagogical research principles.

**Tagline:** "Teaching, Elevated."

## Quick Start

```bash
# Install dependencies
npm install
cd client && npm install

# Start development (full stack)
npm run dev:full

# Or start separately:
npm run server:dev  # Backend on port 5000
npm run client      # Frontend on port 3000
```

## Architecture

```
teaching-app/
├── src/                    # Backend (Express + TypeScript)
│   ├── agents/             # 28 AI agents (orchestrator, curriculum, pedagogy, etc.)
│   ├── server/routes/      # API routes
│   ├── services/           # AI service, document parser, session store
│   ├── types/              # Zod schemas and TypeScript types
│   └── workflow/           # Workflow coordination
├── client/                 # Frontend (React 19 + TypeScript)
│   └── src/
│       ├── components/     # UI components
│       │   ├── features/   # 16 pedagogical feature components
│       │   └── phases/     # Lecture workflow phases
│       ├── context/        # LectureContext for state management
│       └── services/       # API client and WebSocket
└── docs/                   # Documentation
```

## Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript (ES2022)
- **Framework:** Express 5.1
- **Real-time:** Socket.io 4.8
- **AI:** Anthropic SDK, OpenAI SDK
- **Document Processing:** pdf-parse, mammoth (DOCX)
- **Validation:** Zod 4.1

### Frontend
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS 3.4 with custom brand theme
- **UI:** Headless UI, Heroicons, Framer Motion
- **Routing:** React Router 7
- **State:** Context API with LectureContext

## Key Development Commands

```bash
npm run dev:full      # Run full stack with hot reload
npm run server:dev    # Backend only with nodemon
npm run client        # Frontend only
npm run build         # Compile TypeScript
npm test              # Run tests with mock AI
```

## API Structure

**Base URL:** `http://localhost:5000/api`

### Core Endpoints
- `POST /lectures/create` - Create new session
- `POST /lectures/{sessionId}/intake` - Submit intake form
- `GET /lectures/{sessionId}/status` - Get session status
- `POST /agents/{sessionId}/execute/{agentType}` - Execute AI agent
- `POST /export/{sessionId}/download` - Export package (ZIP/JSON)

### Feature Endpoints
- `/exercises/*` - Exercise generation
- `/learning-outcomes/*` - Outcome management
- `/syllabus/*` - Syllabus analysis
- `/active-learning/*` - Activity generation
- `/pedagogical/*` - Pedagogical features

## Agent System

28 specialized AI agents handle different aspects:

**Workflow Agents:** orchestrator, curriculum-architect, content-developer, pedagogy-designer, visual-designer, integration

**Feature Agents:** learning-outcomes, exercise-generator, active-learning, syllabus-analyzer

**Pedagogical Agents:** spaced-repetition, formative-assessment, metacognitive, collaborative-learning, adaptive-difficulty, case-based-learning, misconception, inclusive-design, cognitive-load, growth-mindset, desirable-difficulties, elaborative-interrogation, transfer, multi-representation, student-perspective, learning-science

## Brand Identity

### Mission & Vision
**Mission:** To empower university educators with evidence-based tools that transform how courses are designed, delivered, and refined—honoring the craft of teaching while amplifying its impact.

**Vision:** A world where every instructor has access to the pedagogical research and intelligent assistance they need to create transformative learning experiences.

### Brand Voice (Three Words)
**Scholarly, Collegial, Assured**

### Voice Guidelines
- Sound like a knowledgeable colleague, not a salesperson
- Ground claims in research and evidence
- Respect instructor expertise and autonomy
- Use precise, purposeful language—no buzzwords or hyperbole
- Offer guidance, not mandates

### Vocabulary Preferences
| Instead of... | Use... |
|---------------|--------|
| Cutting-edge | Evidence-based |
| Users | Instructors, educators |
| AI-powered | Intelligent assistance |
| Easy, simple | Streamlined, efficient |
| Solution | Tool, approach |
| Transform | Enhance, refine |

### Color Palette
```
Deep Navy:    #0A1A2A  (brand-navy)    - Primary buttons, headers, authority
Muted Gold:   #C6A667  (brand-gold)    - Accents, highlights, warmth
Soft Gray:    #F1F3F5  (brand-bg)      - Page backgrounds, calm
Slate:        #4B5563  (brand-text)    - Body text, readability
White:        #FFFFFF                   - Cards, content areas
```

### Typography
- **Inter** (Sans): UI elements, buttons, labels, navigation
- **Source Serif 4** (Serif): Body copy, explanations, educational content
- **JetBrains Mono** (Mono): Code blocks, technical output

### Component Design Patterns
```css
/* Cards */
.card: rounded-2xl shadow-card border border-gray-100 bg-white p-6

/* Primary Buttons */
.btn-primary: rounded-xl px-8 py-4 bg-brand-navy text-white hover:bg-opacity-90

/* Secondary Buttons */
.btn-secondary: rounded-xl px-6 py-3 border-2 border-brand-navy text-brand-navy

/* Accent Elements */
.accent: text-brand-gold or bg-brand-gold

/* Spacing Philosophy */
- Generous whitespace (mb-16 between sections)
- Comfortable padding (p-6 to p-8)
- Visual breathing room reflects calm, scholarly aesthetic
```

### UI Copy Standards
- **No exclamation points** in product UI
- **No emojis** unless specifically user-facing celebrations
- **Avoid hyperbole**: "effective" not "revolutionary"
- **Active voice** preferred
- **Oxford comma** always

### Full Brand Guidelines
See [BRAND-VOICE-GUIDELINES.md](BRAND-VOICE-GUIDELINES.md) for comprehensive voice, tone, and messaging documentation.

## File Conventions

### Components
- PascalCase for component files: `Dashboard.tsx`, `LectureWorkflow.tsx`
- Feature components in `client/src/components/features/`
- Phase components in `client/src/components/phases/`

### Backend
- kebab-case for agent files: `curriculum-architect-agent.ts`
- Routes in `src/server/routes/` with `.routes.ts` suffix
- Types/schemas in `src/types/`

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4-turbo-preview
PORT=5000
```

### Frontend (client/.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```

## Testing

```bash
# Run with mock AI (no API calls)
USE_MOCK_AI=true npm test

# E2E tests with Playwright
npx playwright test
```

## Common Tasks

### Adding a New Feature Component
1. Create component in `client/src/components/features/`
2. Add route in `client/src/App.tsx`
3. Add navigation link in `client/src/components/Navigation.tsx`
4. Create backend route if needed in `src/server/routes/`
5. Create agent if needed in `src/agents/`

### Adding a New Agent
1. Create agent file in `src/agents/` extending `BaseAgent`
2. Register in orchestrator if part of main workflow
3. Add API endpoint in appropriate route file
4. Create frontend component to interact with agent

## WebSocket Events

**Server → Client:**
- `phase-update` - Phase completion
- `agent-start/complete/error` - Agent lifecycle
- `checkpoint-result` - Approval results

**Client → Server:**
- `join-session` / `leave-session` - Session room management

## Important Files

- `src/server.ts` - Express server setup
- `src/agents/orchestrator-agent.ts` - Main workflow coordinator
- `client/src/context/LectureContext.tsx` - Global state
- `client/src/services/api.ts` - API client
- `client/src/components/Dashboard.tsx` - Home page
- `tailwind.config.js` - Brand theme configuration

## Documentation

- `README.md` - Project overview
- `COMPREHENSIVE-PRD.md` - Full product requirements
- `IMPLEMENTATION-STATUS.md` - Feature tracker
- `BRAND-IMPLEMENTATION.md` - Brand guidelines
