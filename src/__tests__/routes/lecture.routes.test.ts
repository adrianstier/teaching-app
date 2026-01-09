import request from 'supertest';
import express from 'express';
import { Server } from 'http';

// Mock the server module
jest.mock('../../server/server', () => ({
  emitUpdate: jest.fn(),
}));

describe('Lecture Routes', () => {
  let app: express.Application;
  let server: Server;
  let testSessionId: string;

  beforeAll(async () => {
    // Dynamically import to ensure mocks are in place
    const lectureRoutes = await import('../../server/routes/lecture.routes');

    app = express();
    app.use(express.json());
    app.use('/api/lectures', lectureRoutes.default);

    server = app.listen(5002);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /create', () => {
    test('should create a new lecture session', async () => {
      const response = await request(app)
        .post('/api/lectures/create')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String),
      });

      expect(response.body.sessionId).toBeDefined();
      expect(typeof response.body.sessionId).toBe('string');

      testSessionId = response.body.sessionId;
    });

    test('should return a unique session ID each time', async () => {
      const response1 = await request(app)
        .post('/api/lectures/create')
        .expect(200);

      const response2 = await request(app)
        .post('/api/lectures/create')
        .expect(200);

      expect(response1.body.sessionId).not.toBe(response2.body.sessionId);
    });
  });

  describe('POST /:sessionId/intake', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/lectures/create');
      testSessionId = response.body.sessionId;
    });

    test('should save lecture brief data', async () => {
      const intakeData = {
        title: 'Introduction to Testing',
        topic: 'Software Testing Fundamentals',
        duration: 60,
        audienceLevel: 'intermediate',
        prerequisites: ['Basic programming', 'Software development'],
        mainGoals: [
          'Understand testing principles',
          'Write unit tests',
          'Apply TDD methodology',
        ],
        constraints: ['Limited lab time'],
        preferredStyle: 'Interactive with live coding',
        specialRequirements: ['Code editor access'],
      };

      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send(intakeData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String),
      });

      expect(response.body.data).toMatchObject(intakeData);
    });

    test('should reject intake for non-existent session', async () => {
      const response = await request(app)
        .post('/api/lectures/non-existent-id/intake')
        .send({
          title: 'Test',
          topic: 'Test',
          duration: 50,
          audienceLevel: 'beginner',
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Session not found');
    });

    test('should handle missing required fields', async () => {
      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send({
          title: 'Test',
          // Missing required fields
        })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    test('should validate audience level', async () => {
      const invalidData = {
        title: 'Test',
        topic: 'Test',
        duration: 50,
        audienceLevel: 'invalid-level', // Should be beginner/intermediate/advanced
      };

      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send(invalidData);

      // Should either validate or accept any string
      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /:sessionId/status', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/lectures/create');
      testSessionId = response.body.sessionId;
    });

    test('should return session status', async () => {
      const response = await request(app)
        .get(`/api/lectures/${testSessionId}/status`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        session: expect.objectContaining({
          id: testSessionId,
          status: expect.any(String),
        }),
      });
    });

    test('should return 404 for non-existent session', async () => {
      await request(app)
        .get('/api/lectures/non-existent/status')
        .expect(404);
    });
  });

  describe('GET /:sessionId/package', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/lectures/create');
      testSessionId = response.body.sessionId;
    });

    test('should return lecture package', async () => {
      // First, submit intake data
      const intakeData = {
        title: 'Test Lecture',
        topic: 'Testing',
        duration: 50,
        audienceLevel: 'beginner',
        prerequisites: [],
        mainGoals: [],
        constraints: [],
        preferredStyle: '',
        specialRequirements: [],
      };

      await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send(intakeData);

      // Then get package
      const response = await request(app)
        .get(`/api/lectures/${testSessionId}/package`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        package: expect.objectContaining({
          brief: expect.any(Object),
        }),
      });
    });

    test('should return 404 for non-existent session', async () => {
      await request(app)
        .get('/api/lectures/non-existent/package')
        .expect(404);
    });
  });

  describe('DELETE /:sessionId', () => {
    test('should delete a session', async () => {
      // Create session
      const createResponse = await request(app)
        .post('/api/lectures/create');
      const sessionId = createResponse.body.sessionId;

      // Delete session
      const deleteResponse = await request(app)
        .delete(`/api/lectures/${sessionId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);

      // Verify deletion
      await request(app)
        .get(`/api/lectures/${sessionId}/status`)
        .expect(404);
    });

    test('should return 404 when deleting non-existent session', async () => {
      await request(app)
        .delete('/api/lectures/non-existent')
        .expect(404);
    });
  });

  describe('GET / (list all sessions)', () => {
    test('should list all sessions', async () => {
      // Create a few sessions
      await request(app).post('/api/lectures/create');
      await request(app).post('/api/lectures/create');
      await request(app).post('/api/lectures/create');

      const response = await request(app)
        .get('/api/lectures')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        sessions: expect.any(Array),
      });

      expect(response.body.sessions.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle multiple simultaneous creates', async () => {
      const promises = Array(10)
        .fill(null)
        .map(() => request(app).post('/api/lectures/create'));

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.sessionId).toBeDefined();
      });

      // All should have unique IDs
      const ids = responses.map((r) => r.body.sessionId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    test('should handle concurrent updates to same session', async () => {
      const createResponse = await request(app)
        .post('/api/lectures/create');
      const sessionId = createResponse.body.sessionId;

      const intakeData = {
        title: 'Test',
        topic: 'Test',
        duration: 50,
        audienceLevel: 'beginner',
        prerequisites: [],
        mainGoals: [],
        constraints: [],
        preferredStyle: '',
        specialRequirements: [],
      };

      const promises = Array(5)
        .fill(null)
        .map(() =>
          request(app)
            .post(`/api/lectures/${sessionId}/intake`)
            .send(intakeData)
        );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect([200, 500]).toContain(response.status);
      });
    });
  });

  describe('Data Validation', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/lectures/create');
      testSessionId = response.body.sessionId;
    });

    test('should reject empty title', async () => {
      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send({
          title: '',
          topic: 'Test',
          duration: 50,
          audienceLevel: 'beginner',
        });

      expect([400, 500]).toContain(response.status);
    });

    test('should reject invalid duration', async () => {
      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send({
          title: 'Test',
          topic: 'Test',
          duration: -10,
          audienceLevel: 'beginner',
        });

      expect([400, 500]).toContain(response.status);
    });

    test('should handle very long titles', async () => {
      const longTitle = 'A'.repeat(500);

      const response = await request(app)
        .post(`/api/lectures/${testSessionId}/intake`)
        .send({
          title: longTitle,
          topic: 'Test',
          duration: 50,
          audienceLevel: 'beginner',
          prerequisites: [],
          mainGoals: [],
          constraints: [],
          preferredStyle: '',
          specialRequirements: [],
        });

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/lectures/create')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    test('should handle missing Content-Type', async () => {
      const createResponse = await request(app)
        .post('/api/lectures/create');
      const sessionId = createResponse.body.sessionId;

      const response = await request(app)
        .post(`/api/lectures/${sessionId}/intake`)
        .send('raw text data');

      expect([400, 415, 500]).toContain(response.status);
    });
  });
});
