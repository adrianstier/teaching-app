import express, { Request, Response } from 'express';
import { MultiRepresentationAgent } from '../../agents/multi-representation-agent';
import logger from '../../utils/logger';
import { sessionStore } from '../../services/session-store';

const router = express.Router();
const agent = new MultiRepresentationAgent();

// POST /api/multi-representation/:sessionId/generate
router.post('/:sessionId/generate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { concept, discipline, audienceLevel, includeHistorical, includeMathematical } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        error: 'Concept is required',
      });
    }

    logger.info(`Generating multi-representation for concept: ${concept}`);

    const result = await agent.execute({
      concept,
      discipline,
      audienceLevel,
      includeHistorical,
      includeMathematical,
    });

    // Store in session
    const sessionData = sessionStore.get(sessionId) || { representations: [] };
    if (!sessionData.representations) {
      sessionData.representations = [];
    }
    sessionData.representations.push(result);
    sessionStore.set(sessionId, sessionData);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error generating multi-representation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate multi-representation',
    });
  }
});

// GET /api/multi-representation/:sessionId/list
router.get('/:sessionId/list', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const sessionData = sessionStore.get(sessionId);

    res.json({
      success: true,
      data: sessionData?.representations || [],
    });
  } catch (error) {
    logger.error('Error retrieving representations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve representations',
    });
  }
});

// DELETE /api/multi-representation/:sessionId/:index
router.delete('/:sessionId/:index', (req: Request, res: Response) => {
  try {
    const { sessionId, index } = req.params;
    const sessionData = sessionStore.get(sessionId);

    if (sessionData?.representations) {
      sessionData.representations.splice(parseInt(index), 1);
      sessionStore.set(sessionId, sessionData);
    }

    res.json({
      success: true,
      message: 'Representation deleted',
    });
  } catch (error) {
    logger.error('Error deleting representation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete representation',
    });
  }
});

export default router;
