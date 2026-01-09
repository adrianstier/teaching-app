import { SessionStore } from '../../services/session-store';
import type { LectureBrief, LecturePackage } from '../../types';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  describe('Session Management', () => {
    test('should create a new session', () => {
      const sessionId = store.createSession();

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId).toMatch(/^session-/);
    });

    test('should retrieve session by ID', () => {
      const sessionId = store.createSession();
      const session = store.getSession(sessionId);

      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
      expect(session?.createdAt).toBeInstanceOf(Date);
    });

    test('should return undefined for non-existent session', () => {
      const session = store.getSession('non-existent-id');
      expect(session).toBeUndefined();
    });

    test('should list all sessions', () => {
      const id1 = store.createSession();
      const id2 = store.createSession();
      const id3 = store.createSession();

      const sessions = store.getAllSessions();

      expect(sessions).toHaveLength(3);
      expect(sessions.map(s => s.id)).toContain(id1);
      expect(sessions.map(s => s.id)).toContain(id2);
      expect(sessions.map(s => s.id)).toContain(id3);
    });

    test('should delete a session', () => {
      const sessionId = store.createSession();
      const deleted = store.deleteSession(sessionId);

      expect(deleted).toBe(true);
      expect(store.getSession(sessionId)).toBeUndefined();
    });

    test('should return false when deleting non-existent session', () => {
      const deleted = store.deleteSession('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('Lecture Brief Management', () => {
    test('should save lecture brief', () => {
      const sessionId = store.createSession();
      const brief: LectureBrief = {
        title: 'Test Lecture',
        topic: 'Testing',
        duration: 50,
        audienceLevel: 'beginner',
        prerequisites: ['Basic knowledge'],
        mainGoals: ['Learn testing'],
        constraints: [],
        preferredStyle: 'Interactive',
        specialRequirements: [],
      };

      store.saveLectureBrief(sessionId, brief);
      const session = store.getSession(sessionId);

      expect(session?.brief).toEqual(brief);
    });

    test('should throw error when saving brief to non-existent session', () => {
      const brief: LectureBrief = {
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

      expect(() => {
        store.saveLectureBrief('non-existent', brief);
      }).toThrow();
    });

    test('should retrieve lecture brief', () => {
      const sessionId = store.createSession();
      const brief: LectureBrief = {
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

      store.saveLectureBrief(sessionId, brief);
      const retrieved = store.getLectureBrief(sessionId);

      expect(retrieved).toEqual(brief);
    });
  });

  describe('Phase Management', () => {
    test('should update current phase', () => {
      const sessionId = store.createSession();

      store.updatePhase(sessionId, 'architecture');
      const session = store.getSession(sessionId);

      expect(session?.currentPhase).toBe('architecture');
    });

    test('should track phase completion', () => {
      const sessionId = store.createSession();

      store.updatePhase(sessionId, 'architecture');
      store.completePhase(sessionId, 'architecture');

      const session = store.getSession(sessionId);

      expect(session?.completedPhases).toContain('architecture');
    });

    test('should not duplicate completed phases', () => {
      const sessionId = store.createSession();

      store.completePhase(sessionId, 'architecture');
      store.completePhase(sessionId, 'architecture');

      const session = store.getSession(sessionId);

      expect(session?.completedPhases).toHaveLength(1);
    });
  });

  describe('Package Management', () => {
    test('should save lecture package', () => {
      const sessionId = store.createSession();
      const pkg: Partial<LecturePackage> = {
        brief: {
          title: 'Test',
          topic: 'Test',
          duration: 50,
          audienceLevel: 'beginner',
          prerequisites: [],
          mainGoals: [],
          constraints: [],
          preferredStyle: '',
          specialRequirements: [],
        },
        objectives: ['Objective 1'],
        segments: [],
      };

      store.savePackage(sessionId, pkg);
      const session = store.getSession(sessionId);

      expect(session?.package).toEqual(pkg);
    });

    test('should retrieve lecture package', () => {
      const sessionId = store.createSession();
      const pkg: Partial<LecturePackage> = {
        brief: {
          title: 'Test',
          topic: 'Test',
          duration: 50,
          audienceLevel: 'beginner',
          prerequisites: [],
          mainGoals: [],
          constraints: [],
          preferredStyle: '',
          specialRequirements: [],
        },
      };

      store.savePackage(sessionId, pkg);
      const retrieved = store.getPackage(sessionId);

      expect(retrieved).toEqual(pkg);
    });

    test('should return null for non-existent package', () => {
      const sessionId = store.createSession();
      const pkg = store.getPackage(sessionId);

      expect(pkg).toBeNull();
    });
  });

  describe('Metadata Management', () => {
    test('should track last updated timestamp', () => {
      const sessionId = store.createSession();
      const session = store.getSession(sessionId);

      expect(session?.lastUpdated).toBeInstanceOf(Date);
    });

    test('should update timestamp on changes', async () => {
      const sessionId = store.createSession();
      const initial = store.getSession(sessionId)?.lastUpdated;

      await new Promise(resolve => setTimeout(resolve, 10));

      store.updatePhase(sessionId, 'architecture');
      const updated = store.getSession(sessionId)?.lastUpdated;

      expect(updated?.getTime()).toBeGreaterThan(initial!.getTime());
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid session operations gracefully', () => {
      expect(() => store.updatePhase('invalid', 'architecture')).toThrow();
      expect(() => store.completePhase('invalid', 'architecture')).toThrow();
      expect(() => store.savePackage('invalid', {})).toThrow();
    });

    test('should validate session IDs', () => {
      expect(store.getSession('')).toBeUndefined();
      expect(store.getSession(null as any)).toBeUndefined();
      expect(store.getSession(undefined as any)).toBeUndefined();
    });
  });

  describe('Memory Management', () => {
    test('should handle many sessions', () => {
      const ids: string[] = [];

      for (let i = 0; i < 1000; i++) {
        ids.push(store.createSession());
      }

      expect(store.getAllSessions()).toHaveLength(1000);

      // Clean up
      ids.forEach(id => store.deleteSession(id));
      expect(store.getAllSessions()).toHaveLength(0);
    });

    test('should not leak memory after deletions', () => {
      const ids: string[] = [];

      for (let i = 0; i < 100; i++) {
        ids.push(store.createSession());
      }

      ids.forEach(id => store.deleteSession(id));

      const remaining = store.getAllSessions();
      expect(remaining).toHaveLength(0);
    });
  });
});
