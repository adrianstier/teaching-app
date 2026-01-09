import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LectureBrief, LecturePackage } from '../../types';
import { emitUpdate } from '../server';

const router = Router();

// Session store interface
interface SessionData {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  context: {
    lecturePackage: Partial<LecturePackage>;
    currentPhase: number;
    checkpointsPassed: string[];
    feedbackHistory: Array<{ role: string; content: string; timestamp: Date }>;
  };
}

// Store active sessions (in production, use Redis or a database)
const activeSessions = new Map<string, SessionData>();

// Helper to get session or return 404
const getSessionOrFail = (sessionId: string, res: Response): SessionData | null => {
  const session = activeSessions.get(sessionId);
  if (!session) {
    res.status(404).json({
      success: false,
      error: 'Session not found'
    });
    return null;
  }
  return session;
};

// Create a new lecture development session
router.post('/create', async (req: Request, res: Response) => {
  try {
    const sessionId = uuidv4();
    const session: SessionData = {
      id: sessionId,
      status: 'initialized',
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        lecturePackage: {},
        currentPhase: 1,
        checkpointsPassed: [],
        feedbackHistory: []
      }
    };

    activeSessions.set(sessionId, session);

    res.json({
      success: true,
      sessionId,
      message: 'Lecture development session created'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create session'
    });
  }
});

// Submit intake information
router.post('/:sessionId/intake', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const intakeData: LectureBrief = req.body;

    const session = getSessionOrFail(sessionId, res);
    if (!session) return;

    // Update session with intake data
    session.context.lecturePackage.brief = intakeData;
    session.context.currentPhase = 2;
    session.status = 'intake-complete';
    session.updatedAt = new Date();

    // Emit update to connected clients
    emitUpdate(sessionId, 'phase-update', {
      phase: 1,
      status: 'complete',
      data: intakeData
    });

    res.json({
      success: true,
      message: 'Intake data submitted',
      data: intakeData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit intake data'
    });
  }
});

// Get session status
router.get('/:sessionId/status', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  res.json({
    success: true,
    session: {
      id: session.id,
      status: session.status,
      currentPhase: session.context.currentPhase,
      checkpointsPassed: session.context.checkpointsPassed,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }
  });
});

// Get full session context (for agent execution)
router.get('/:sessionId/context', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  res.json({
    success: true,
    context: session.context
  });
});

// Update session phase data
router.post('/:sessionId/phase/:phase', (req: Request, res: Response) => {
  const { sessionId, phase } = req.params;
  const phaseData = req.body;

  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  const phaseNum = parseInt(phase);

  // Update phase-specific data
  switch (phaseNum) {
    case 2:
      session.context.lecturePackage.architecture = phaseData;
      break;
    case 3:
      session.context.lecturePackage.development = phaseData;
      break;
    case 4:
      session.context.lecturePackage.visual = phaseData;
      break;
    case 5:
      session.context.lecturePackage.integration = phaseData;
      break;
  }

  session.updatedAt = new Date();

  // Emit update
  emitUpdate(sessionId, 'phase-update', {
    phase: phaseNum,
    status: 'updated',
    data: phaseData
  });

  res.json({
    success: true,
    message: `Phase ${phase} data updated`
  });
});

// Approve checkpoint
router.post('/:sessionId/checkpoint/:checkpointId/approve', (req: Request, res: Response) => {
  const { sessionId, checkpointId } = req.params;
  const { approved, feedback } = req.body;

  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  if (approved) {
    session.context.checkpointsPassed.push(checkpointId);

    // Advance to next phase based on checkpoint
    const phaseMap: Record<string, number> = {
      'intake': 2,
      'architecture': 3,
      'development': 4,
      'visual': 5,
      'integration': 5 // Final phase
    };

    if (phaseMap[checkpointId]) {
      session.context.currentPhase = phaseMap[checkpointId];
    }
  }

  if (feedback) {
    session.context.feedbackHistory.push({
      role: 'user',
      content: feedback,
      timestamp: new Date()
    });
  }

  session.updatedAt = new Date();
  session.status = approved ? `${checkpointId}-approved` : `${checkpointId}-revision-requested`;

  emitUpdate(sessionId, 'checkpoint-result', {
    checkpointId,
    approved,
    feedback,
    nextPhase: approved ? session.context.currentPhase : null
  });

  res.json({
    success: true,
    message: 'Checkpoint processed',
    approved,
    nextPhase: session.context.currentPhase
  });
});

// Get complete lecture package
router.get('/:sessionId/package', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  res.json({
    success: true,
    package: session.context.lecturePackage
  });
});

// Update lecture package (merge data)
router.patch('/:sessionId/package', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const updates = req.body;

  const session = getSessionOrFail(sessionId, res);
  if (!session) return;

  // Deep merge the updates
  session.context.lecturePackage = {
    ...session.context.lecturePackage,
    ...updates
  };
  session.updatedAt = new Date();

  res.json({
    success: true,
    message: 'Package updated',
    package: session.context.lecturePackage
  });
});

// List all sessions
router.get('/', (req: Request, res: Response) => {
  const sessions = Array.from(activeSessions.values()).map(session => ({
    id: session.id,
    status: session.status,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    currentPhase: session.context.currentPhase,
    title: session.context.lecturePackage?.brief?.topic || 'Untitled'
  }));

  res.json({
    success: true,
    count: sessions.length,
    sessions
  });
});

// Delete a session
router.delete('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (activeSessions.has(sessionId)) {
    activeSessions.delete(sessionId);
    res.json({
      success: true,
      message: 'Session deleted'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }
});

// Export session store for use by agent routes
export { activeSessions };

export default router;
