# Comprehensive Testing Setup

## Overview

This document outlines the comprehensive testing strategy for the Teaching Assistant platform, targeting 80% test coverage across backend, frontend, and integration tests.

## Test Stack

### Backend Testing
- **Framework:** Jest (via tsx)
- **HTTP Testing:** Supertest
- **Mocking:** Built-in Jest mocks
- **Coverage:** Istanbul (nyc)

### Frontend Testing
- **Framework:** Jest + React Testing Library
- **Component Testing:** @testing-library/react
- **User Interactions:** @testing-library/user-event
- **Mocking:** MSW (Mock Service Worker) for API mocks

### E2E Testing
- **Framework:** Playwright (already installed)
- **Coverage:** Full workflow testing

## Test Categories

### 1. Backend Unit Tests (40% coverage target)
- Agent logic tests
- Service layer tests (AI service, document parser, session store)
- Utility function tests
- Validation middleware tests

### 2. Backend Integration Tests (20% coverage target)
- API route tests
- WebSocket communication tests
- Database/session persistence tests
- Error handling tests

### 3. Frontend Unit Tests (20% coverage target)
- Component rendering tests
- Hook tests (useErrorHandler, useAutoSave)
- Context tests (LectureContext)
- Service tests (API client, Socket client)

### 4. Frontend Integration Tests (10% coverage target)
- Phase workflow tests
- Form submission tests
- Real-time update tests
- Error recovery tests

### 5. E2E Tests (10% coverage target)
- Complete lecture creation workflow
- User journey tests
- Cross-browser compatibility
- Performance testing

## File Structure

```
teaching-app/
├── src/
│   ├── __tests__/
│   │   ├── agents/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── tests/
│       ├── test-suite.ts (existing)
│       ├── backend.test.ts (new)
│       └── integration.test.ts (new)
├── client/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── context/
│   │   └── test-utils/
│   │       ├── test-helpers.tsx
│   │       ├── mock-data.ts
│   │       └── mock-server.ts
└── e2e/
    ├── lecture-workflow.spec.ts
    └── user-journeys.spec.ts
```

## Running Tests

```bash
# Backend tests
npm test                    # Run basic test suite
npm run test:unit           # Run unit tests only
npm run test:integration    # Run integration tests
npm run test:coverage       # Run with coverage report

# Frontend tests
cd client && npm test       # Run all frontend tests
npm test -- --coverage      # With coverage

# E2E tests
npm run test:e2e           # Run Playwright tests
npm run test:e2e:headed    # Run with browser UI

# All tests
npm run test:all           # Run entire test suite
```

## Coverage Goals

| Category | Target | Current | Status |
|----------|--------|---------|--------|
| Backend Routes | 90% | TBD | ⏳ |
| Backend Services | 85% | TBD | ⏳ |
| Backend Agents | 70% | TBD | ⏳ |
| Frontend Components | 80% | TBD | ⏳ |
| Frontend Hooks | 90% | TBD | ⏳ |
| Frontend Services | 85% | TBD | ⏳ |
| Integration | 75% | TBD | ⏳ |
| **Overall** | **80%** | **TBD** | **⏳** |

## Next Steps

1. Install dependencies
2. Set up Jest configuration
3. Create test utilities and mocks
4. Write backend tests
5. Write frontend tests
6. Write E2E tests
7. Run coverage analysis
8. Fix failures and optimize
