import { Router, Request, Response } from 'express';
import { ExerciseGeneratorAgent } from '../../agents/exercise-generator-agent';
import sessionStore from '../../services/session-store';
import logger from '../../utils/logger';
import { ExerciseConfigSchema } from '../../types/extended-types';

const router = Router();

// Generate exercises
router.post(
  '/:sessionId/generate',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const timer = logger.startTimer('exercise-generation');

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      // Validate exercise config
      const config = ExerciseConfigSchema.parse(req.body);

      logger.info(`Generating exercises for session ${sessionId}`);

      const agent = new ExerciseGeneratorAgent(session.context);
      const exercises = await agent.execute(config);

      // Store exercises in session
      if (!session.context.exercises) {
        session.context.exercises = [];
      }
      session.context.exercises.push(...exercises);
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: exercises,
        message: `Generated ${exercises.length} exercise(s)`
      });

    } catch (error) {
      logger.error('Exercise generation failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate exercises',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      timer();
    }
  }
);

// Generate exercise set
router.post(
  '/:sessionId/generate-set',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { topic, count, ...config } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const agent = new ExerciseGeneratorAgent(session.context);
      const exercises = await agent.generateExerciseSet(
        topic,
        config,
        count || 5
      );

      // Store in session
      if (!session.context.exercises) {
        session.context.exercises = [];
      }
      session.context.exercises.push(...exercises);
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: exercises,
        message: `Generated set of ${exercises.length} exercises`
      });

    } catch (error) {
      logger.error('Exercise set generation failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate exercise set',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Generate complete assessment
router.post(
  '/:sessionId/generate-assessment',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { topic, totalPoints, bloomDistribution } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const agent = new ExerciseGeneratorAgent(session.context);
      const exercises = await agent.generateAssessment(
        topic,
        totalPoints || 100,
        bloomDistribution
      );

      // Store in session
      if (!session.context.assessments) {
        session.context.assessments = [];
      }
      session.context.assessments.push({
        id: `assessment-${Date.now()}`,
        topic,
        totalPoints: totalPoints || 100,
        exercises,
        createdAt: new Date()
      });
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: exercises,
        message: `Generated assessment with ${exercises.length} questions`
      });

    } catch (error) {
      logger.error('Assessment generation failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate assessment',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get all exercises for a session
router.get('/:sessionId/list', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    data: session.context.exercises || [],
    assessments: session.context.assessments || []
  });
});

// Delete exercise
router.delete('/:sessionId/exercise/:exerciseId', async (req: Request, res: Response) => {
  const { sessionId, exerciseId } = req.params;

  try {
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (session.context.exercises) {
      session.context.exercises = session.context.exercises.filter(
        (ex: any) => ex.id !== exerciseId
      );
      await sessionStore.updateSession(sessionId, session);
    }

    res.json({
      success: true,
      message: 'Exercise deleted'
    });

  } catch (error) {
    logger.error('Failed to delete exercise', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete exercise'
    });
  }
});

export default router;