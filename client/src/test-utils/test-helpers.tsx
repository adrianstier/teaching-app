import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LectureProvider } from '../context/LectureContext';

// Custom render function that includes all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <LectureProvider>{children}</LectureProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper to wait for async updates
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 100));

// Helper to create mock functions with better typing
export const createMockFn = <T extends (...args: any[]) => any>() =>
  jest.fn<ReturnType<T>, Parameters<T>>();

// Helper to mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

// Helper to mock WebSocket
export const mockWebSocket = () => {
  const listeners: Record<string, Function[]> = {};

  return {
    on: jest.fn((event: string, handler: Function) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    }),
    emit: jest.fn((event: string, ...args: any[]) => {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(...args));
      }
    }),
    disconnect: jest.fn(),
    connected: true,
  };
};

// Mock data generators
export const generateMockBrief = () => ({
  title: 'Test Lecture',
  topic: 'Testing Fundamentals',
  duration: 60,
  audienceLevel: 'intermediate' as const,
  prerequisites: ['Basic programming'],
  mainGoals: ['Learn testing', 'Write tests'],
  constraints: [],
  preferredStyle: 'Interactive',
  specialRequirements: [],
});

export const generateMockSegment = (id: string) => ({
  id,
  title: `Segment ${id}`,
  duration: 15,
  type: 'lecture',
  content: 'Test content',
  examples: ['Example 1'],
  activities: ['Activity 1'],
  speakerNotes: 'Test notes',
});

export const generateMockActivity = (id: string) => ({
  id,
  name: `Activity ${id}`,
  type: 'think-pair-share' as const,
  duration: 10,
  description: 'Test activity',
  instructions: 'Test instructions',
  materials: [],
  expectedOutcomes: ['Outcome 1'],
  facilitation: 'Facilitation notes',
});
