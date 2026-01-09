import sessionStore from '../../services/session-store';
import type { LectureBrief, LecturePackage } from '../../types';

describe('SessionStore', () => {
  let testSessionIds: string[] = [];

  // Clean up test sessions after each test
  afterEach(async () => {
    for (const id of testSessionIds) {
      await sessionStore.deleteSession(id);
    }
    testSessionIds = [];
  });

  describe('Session Management', () => {
    test('should create a new session with provided ID', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      const session = await sessionStore.createSession(sessionId);

      expect(session).toBeDefined();
      expect(session.id).toBe(sessionId);
      expect(session.status).toBe('initialized');
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    test('should retrieve session by ID', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);
      const session = sessionStore.getSession(sessionId);

      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
      expect(session?.createdAt).toBeInstanceOf(Date);
    });

    test('should return undefined for non-existent session', () => {
      const session = sessionStore.getSession('non-existent-id');
      expect(session).toBeUndefined();
    });

    test('should list all sessions', async () => {
      const id1 = `test-session-1-${Date.now()}`;
      const id2 = `test-session-2-${Date.now()}`;
      const id3 = `test-session-3-${Date.now()}`;
      testSessionIds.push(id1, id2, id3);

      await sessionStore.createSession(id1);
      await sessionStore.createSession(id2);
      await sessionStore.createSession(id3);

      const sessions = sessionStore.getAllSessions();

      expect(sessions.length).toBeGreaterThanOrEqual(3);
      expect(sessions.map((s: any) => s.id)).toContain(id1);
      expect(sessions.map((s: any) => s.id)).toContain(id2);
      expect(sessions.map((s: any) => s.id)).toContain(id3);
    });

    test('should delete a session', async () => {
      const sessionId = `test-session-${Date.now()}`;

      await sessionStore.createSession(sessionId);
      const deleted = await sessionStore.deleteSession(sessionId);

      expect(deleted).toBe(true);
      expect(sessionStore.getSession(sessionId)).toBeUndefined();
    });

    test('should return false when deleting non-existent session', async () => {
      const deleted = await sessionStore.deleteSession('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('Session Updates', () => {
    test('should update session properties', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);
      const updated = await sessionStore.updateSession(sessionId, {
        status: 'in-progress'
      });

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('in-progress');
    });

    test('should return null when updating non-existent session', async () => {
      const updated = await sessionStore.updateSession('non-existent-id', {
        status: 'completed'
      });
      expect(updated).toBeNull();
    });

    test('should update session timestamp on modification', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      const session = await sessionStore.createSession(sessionId);
      const originalTime = session.updatedAt.getTime();

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await sessionStore.updateSession(sessionId, { status: 'updated' });
      const updatedSession = sessionStore.getSession(sessionId);

      expect(updatedSession?.updatedAt.getTime()).toBeGreaterThan(originalTime);
    });
  });

  describe('Lecture Package Management', () => {
    test('should save and retrieve lecture package', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);

      const pkg: Partial<LecturePackage> = {
        brief: {
          title: 'Test Lecture',
          topic: 'Testing',
          duration: 60,
          audienceLevel: 'intermediate',
          prerequisites: ['Basic knowledge'],
          mainGoals: ['Learn testing'],
        },
        learningObjectives: [],
        conceptMap: [],
        segments: [],
        activities: [],
      };

      // Update session with lecture package via updateSession
      const session = sessionStore.getSession(sessionId);
      if (session) {
        session.context.lecturePackage = pkg;
        await sessionStore.updateSession(sessionId, session);
      }

      const updated = sessionStore.getSession(sessionId);
      expect(updated?.context.lecturePackage).toBeDefined();
      expect(updated?.context.lecturePackage.brief).toEqual(pkg.brief);
    });

    test('should initialize with empty package', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);
      const session = sessionStore.getSession(sessionId);

      expect(session?.context.lecturePackage).toEqual({});
    });
  });

  describe('Phase Management', () => {
    test('should update current phase', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);
      await sessionStore.updateSession(sessionId, {
        context: {
          lecturePackage: {},
          currentPhase: 1,
          checkpointsPassed: [],
          feedbackHistory: []
        }
      });

      const session = sessionStore.getSession(sessionId);
      expect(session?.context.currentPhase).toBe(1);
    });

    test('should track phase completion', async () => {
      const sessionId = `test-session-${Date.now()}`;
      testSessionIds.push(sessionId);

      await sessionStore.createSession(sessionId);

      const session = sessionStore.getSession(sessionId);
      if (session) {
        session.context.checkpointsPassed.push('architecture');
        await sessionStore.updateSession(sessionId, session);
      }

      const updated = sessionStore.getSession(sessionId);
      expect(updated?.context.checkpointsPassed).toContain('architecture');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid session ID gracefully', () => {
      const session = sessionStore.getSession('');
      expect(session).toBeUndefined();
    });

    test('should validate session ID format', () => {
      const session = sessionStore.getSession('invalid-format');
      expect(session).toBeUndefined();
    });
  });

  describe('Memory Management', () => {
    test('should handle multiple sessions', async () => {
      const ids: string[] = [];

      // Create 10 test sessions
      for (let i = 0; i < 10; i++) {
        const id = `test-bulk-${i}-${Date.now()}`;
        ids.push(id);
        testSessionIds.push(id);
        await sessionStore.createSession(id);
      }

      const sessions = sessionStore.getAllSessions();
      expect(sessions.length).toBeGreaterThanOrEqual(10);

      // Clean up
      for (const id of ids) {
        await sessionStore.deleteSession(id);
      }
    });
  });
});
