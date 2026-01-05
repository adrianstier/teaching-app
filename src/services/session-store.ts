import * as fs from 'fs/promises';
import * as path from 'path';
import { LecturePackage } from '../types';
import logger from '../utils/logger';

interface Session {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  context: {
    lecturePackage: Partial<LecturePackage>;
    currentPhase: number;
    checkpointsPassed: string[];
    feedbackHistory: any[];
  };
}

class SessionStore {
  private sessions: Map<string, Session> = new Map();
  private storageDir: string;
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.storageDir = path.join(process.cwd(), 'sessions');
    this.initializeStorage();

    // Auto-save sessions every 5 minutes
    this.autoSaveInterval = setInterval(() => {
      this.saveAllSessions().catch(err => {
        logger.error('Failed to auto-save sessions', err);
      });
    }, 5 * 60 * 1000);
  }

  private async initializeStorage() {
    try {
      // Create sessions directory if it doesn't exist
      await fs.mkdir(this.storageDir, { recursive: true });

      // Load existing sessions
      await this.loadSessions();
    } catch (error) {
      logger.error('Failed to initialize session storage', error);
    }
  }

  private async loadSessions() {
    try {
      const files = await fs.readdir(this.storageDir);
      const sessionFiles = files.filter(f => f.endsWith('.json'));

      for (const file of sessionFiles) {
        try {
          const filePath = path.join(this.storageDir, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const session = JSON.parse(data, this.reviver);

          // Only load sessions less than 24 hours old
          const age = Date.now() - new Date(session.updatedAt).getTime();
          if (age < 24 * 60 * 60 * 1000) {
            this.sessions.set(session.id, session);
            logger.info(`Loaded session: ${session.id}`);
          } else {
            // Delete old session files
            await fs.unlink(filePath);
            logger.info(`Deleted expired session: ${session.id}`);
          }
        } catch (err) {
          logger.error(`Failed to load session file: ${file}`, err);
        }
      }

      logger.info(`Loaded ${this.sessions.size} active sessions`);
    } catch (error) {
      logger.error('Failed to load sessions', error);
    }
  }

  private reviver(key: string, value: any) {
    // Convert date strings back to Date objects
    if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  async createSession(id: string): Session {
    const session: Session = {
      id,
      status: 'initialized',
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        lecturePackage: {},
        currentPhase: 0,
        checkpointsPassed: [],
        feedbackHistory: []
      }
    };

    this.sessions.set(id, session);
    await this.saveSession(id);

    logger.info(`Created session: ${id}`);
    return session;
  }

  getSession(id: string): Session | undefined {
    const session = this.sessions.get(id);
    if (session) {
      // Update last accessed time
      session.updatedAt = new Date();
    }
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | null> {
    const session = this.sessions.get(id);
    if (!session) {
      logger.warn(`Session not found: ${id}`);
      return null;
    }

    // Merge updates
    Object.assign(session, updates);
    session.updatedAt = new Date();

    await this.saveSession(id);
    logger.debug(`Updated session: ${id}`);

    return session;
  }

  async deleteSession(id: string): Promise<boolean> {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      try {
        const filePath = path.join(this.storageDir, `${id}.json`);
        await fs.unlink(filePath);
        logger.info(`Deleted session: ${id}`);
      } catch (err) {
        logger.error(`Failed to delete session file: ${id}`, err);
      }
    }
    return deleted;
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  async saveSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (!session) return;

    try {
      const filePath = path.join(this.storageDir, `${id}.json`);
      const data = JSON.stringify(session, null, 2);
      await fs.writeFile(filePath, data, 'utf-8');
      logger.debug(`Saved session: ${id}`);
    } catch (error) {
      logger.error(`Failed to save session: ${id}`, error);
      throw error;
    }
  }

  async saveAllSessions(): Promise<void> {
    const savePromises = Array.from(this.sessions.keys()).map(id =>
      this.saveSession(id).catch(err => {
        logger.error(`Failed to save session ${id}`, err);
      })
    );

    await Promise.all(savePromises);
    logger.info(`Saved ${this.sessions.size} sessions`);
  }

  // Clean up old sessions
  async cleanupSessions(maxAgeHours: number = 24): Promise<number> {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    const toDelete: string[] = [];

    for (const [id, session] of this.sessions) {
      if (new Date(session.updatedAt).getTime() < cutoff) {
        toDelete.push(id);
      }
    }

    for (const id of toDelete) {
      await this.deleteSession(id);
    }

    logger.info(`Cleaned up ${toDelete.length} expired sessions`);
    return toDelete.length;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    await this.saveAllSessions();
    logger.info('Session store shut down gracefully');
  }

  // Get session statistics
  getStatistics() {
    const sessions = Array.from(this.sessions.values());
    const now = Date.now();

    return {
      total: sessions.length,
      byStatus: sessions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPhase: sessions.reduce((acc, s) => {
        const phase = s.context.currentPhase;
        acc[phase] = (acc[phase] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
      averageAge: sessions.reduce((sum, s) =>
        sum + (now - new Date(s.createdAt).getTime()), 0
      ) / (sessions.length || 1) / 1000 / 60, // in minutes
      oldestSession: sessions.reduce((oldest, s) =>
        !oldest || new Date(s.createdAt) < new Date(oldest.createdAt) ? s : oldest,
        null as Session | null
      )
    };
  }
}

// Singleton instance
const sessionStore = new SessionStore();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down session store...');
  await sessionStore.shutdown();
});

export default sessionStore;