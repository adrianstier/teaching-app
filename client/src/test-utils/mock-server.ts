// MSW mock server for API mocking
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:5001/api';

// Mock handlers
export const handlers = [
  // Health check
  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }),

  // Create session
  http.post(`${API_BASE}/lectures/create`, () => {
    return HttpResponse.json({
      success: true,
      sessionId: `session-${Date.now()}`,
      message: 'Lecture session created successfully',
    });
  }),

  // Get session status
  http.get(`${API_BASE}/lectures/:sessionId/status`, ({ params }) => {
    const { sessionId } = params;
    return HttpResponse.json({
      success: true,
      status: {
        sessionId,
        currentPhase: 'intake',
        progress: 0,
        lastUpdated: new Date().toISOString(),
      },
    });
  }),

  // Submit intake
  http.post(`${API_BASE}/lectures/:sessionId/intake`, async ({ request, params }) => {
    const body = await request.json();
    const { sessionId } = params;

    return HttpResponse.json({
      success: true,
      message: 'Intake data saved successfully',
      sessionId,
    });
  }),

  // Get package
  http.get(`${API_BASE}/lectures/:sessionId/package`, ({ params }) => {
    const { sessionId } = params;
    return HttpResponse.json({
      success: true,
      package: {
        brief: {
          title: 'Test Lecture',
          topic: 'Testing',
          duration: 50,
          audienceLevel: 'beginner',
        },
        objectives: [],
        segments: [],
        activities: [],
      },
    });
  }),
];

// Create server instance
export const server = setupServer(...handlers);
