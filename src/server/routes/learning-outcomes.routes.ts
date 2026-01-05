import { Router, Request, Response } from 'express';
import { LearningOutcomesAgent } from '../../agents/learning-outcomes-agent';
import sessionStore from '../../services/session-store';
import logger from '../../utils/logger';

const router = Router();

// Generate new learning outcomes
router.post(
  '/:sessionId/generate',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { topic, courseLevel, duration } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      logger.info(`Generating learning outcomes for: ${topic}`);

      const agent = new LearningOutcomesAgent(session.context);
      const outcomes = await agent.execute({
        topic,
        courseLevel: courseLevel || 'undergraduate',
        duration: duration || 'course'
      });

      // Store in session
      session.context.learningOutcomes = outcomes;
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: outcomes,
        message: `Generated ${outcomes.length} learning outcomes`
      });

    } catch (error) {
      logger.error('Learning outcomes generation failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate learning outcomes',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Improve existing outcomes
router.post(
  '/:sessionId/improve',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { existingOutcomes, topic } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const agent = new LearningOutcomesAgent(session.context);
      const outcomes = await agent.improveExistingOutcomes(
        existingOutcomes,
        topic
      );

      session.context.learningOutcomes = outcomes;
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: outcomes,
        message: 'Learning outcomes improved'
      });

    } catch (error) {
      logger.error('Failed to improve outcomes', error);
      res.status(500).json({
        success: false,
        error: 'Failed to improve learning outcomes',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Analyze outcome coverage
router.post(
  '/:sessionId/analyze-coverage',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { outcomes, courseContent } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const agent = new LearningOutcomesAgent(session.context);
      const analyzedOutcomes = await agent.analyzeOutcomeCoverage(
        outcomes || session.context.learningOutcomes || [],
        courseContent
      );

      session.context.learningOutcomes = analyzedOutcomes;
      await sessionStore.updateSession(sessionId, session);

      res.json({
        success: true,
        data: analyzedOutcomes,
        message: 'Coverage analysis complete'
      });

    } catch (error) {
      logger.error('Coverage analysis failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze coverage',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get Bloom's balance report
router.get(
  '/:sessionId/bloom-balance',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const outcomes = session.context.learningOutcomes || [];
      if (outcomes.length === 0) {
        return res.json({
          success: true,
          data: null,
          message: 'No learning outcomes to analyze'
        });
      }

      const agent = new LearningOutcomesAgent(session.context);
      const report = await agent.generateBloomBalanceReport(outcomes);

      res.json({
        success: true,
        data: report
      });

    } catch (error) {
      logger.error('Bloom balance report failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate balance report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Suggest activities for an outcome
router.post(
  '/:sessionId/suggest-activities',
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { outcome } = req.body;

    try {
      const session = sessionStore.getSession(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const agent = new LearningOutcomesAgent(session.context);
      const activities = await agent.suggestActivitiesForOutcome(outcome);

      res.json({
        success: true,
        data: activities
      });

    } catch (error) {
      logger.error('Activity suggestion failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to suggest activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Validate outcome quality
router.post(
  '/validate',
  async (req: Request, res: Response) => {
    const { statement } = req.body;

    try {
      // Create temporary context for validation
      const tempContext = {
        lecturePackage: {},
        currentPhase: 0,
        checkpointsPassed: [],
        feedbackHistory: []
      };

      const agent = new LearningOutcomesAgent(tempContext);
      const validation = await agent.validateOutcomeQuality(statement);

      res.json({
        success: true,
        data: validation
      });

    } catch (error) {
      logger.error('Outcome validation failed', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate outcome',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get all learning outcomes for a session
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
    data: session.context.learningOutcomes || []
  });
});

export default router;