// Backend test setup
process.env.USE_MOCK_AI = 'true';
process.env.NODE_ENV = 'test';

// Mock environment variables
process.env.ANTHROPIC_API_KEY = 'test-key';
process.env.OPENAI_API_KEY = 'test-key';
process.env.PORT = '5001';

// Extend Jest matchers
expect.extend({
  toBeValidSessionId(received: string) {
    const pass = typeof received === 'string' && received.startsWith('session-');
    return {
      message: () => `expected ${received} to be a valid session ID`,
      pass,
    };
  },
  toBeValidTimestamp(received: any) {
    const pass = !isNaN(Date.parse(received));
    return {
      message: () => `expected ${received} to be a valid timestamp`,
      pass,
    };
  },
});

// Global test utilities
(global as any).testTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
