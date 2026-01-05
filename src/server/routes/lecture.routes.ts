import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowCoordinator } from '../../workflow/coordinator';
import { LectureBrief, LecturePackage } from '../../types';
import { emitUpdate } from '../server';

const router = Router();

// Store active sessions
const activeSessions = new Map<string, any>();

// Create a new lecture development session
router.post('/create', async (req: Request, res: Response) => {
  try {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      status: 'initialized',
      createdAt: new Date(),
      context: {
        lecturePackage: {},
        currentPhase: 0,
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

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Update session with intake data
    session.context.lecturePackage.brief = intakeData;
    session.status = 'intake-complete';

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
  const session = activeSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    session: {
      id: session.id,
      status: session.status,
      currentPhase: session.context.currentPhase,
      checkpointsPassed: session.context.checkpointsPassed,
      createdAt: session.createdAt
    }
  });
});

// Approve checkpoint
router.post('/:sessionId/checkpoint/:checkpointId/approve', (req: Request, res: Response) => {
  const { sessionId, checkpointId } = req.params;
  const { approved, feedback } = req.body;

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  if (approved) {
    session.context.checkpointsPassed.push(checkpointId);
  }

  if (feedback) {
    session.context.feedbackHistory.push({
      role: 'user',
      content: feedback
    });
  }

  emitUpdate(sessionId, 'checkpoint-result', {
    checkpointId,
    approved,
    feedback
  });

  res.json({
    success: true,
    message: 'Checkpoint processed'
  });
});

// Get complete lecture package
router.get('/:sessionId/package', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    package: session.context.lecturePackage
  });
});

// List all sessions
router.get('/', (req: Request, res: Response) => {
  const sessions = Array.from(activeSessions.values()).map(session => ({
    id: session.id,
    status: session.status,
    createdAt: session.createdAt,
    title: session.context.lecturePackage?.brief?.title || 'Untitled'
  }));

  res.json({
    success: true,
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

export default router;