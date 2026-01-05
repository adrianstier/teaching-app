import express, { Request, Response } from 'express';
import { ActiveLearningAgent } from '../../agents/active-learning-agent';
import logger from '../../utils/logger';
import sessionStore from '../../services/session-store';

const router = express.Router();
const agent = new ActiveLearningAgent();

// POST /api/active-learning/:sessionId/generate
router.post('/:sessionId/generate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { type, topic, duration, classSize, specificQuestion, bloomLevel } = req.body;

    if (!type || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Activity type and topic are required',
      });
    }

    logger.info(`Generating ${type} activity for: ${topic}`);

    let result;
    try {
      result = await agent.execute({
        type,
        topic,
        duration: duration || 20,
        classSize: classSize || 30,
        specificQuestion,
        bloomLevel,
      });
    } catch (agentError) {
      logger.warn('Agent execution failed, using fallback template:', agentError);
      // Generate fallback directly if agent fails
      result = {
        name: type.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type,
        duration: { min: Math.floor((duration || 20) * 0.8), max: Math.ceil((duration || 20) * 1.2), flexible: true },
        classSize: { min: 10, max: 500, idealSize: 'Any size' },
        bloomLevel: ['understand', 'apply'],
        materials: {
          instructorScript: `Activity: ${type}\nTopic: ${topic}\nDuration: ${duration || 20} minutes\n\nIntroduce the topic and explain the activity structure.`,
          studentHandout: `Activity: ${type}\nTopic: ${topic}\n\nWork with your group to explore this topic.`,
          timingGuide: [
            { time: 2, action: 'Introduce activity', who: 'instructor' },
            { time: (duration || 20) - 4, action: 'Complete activity', who: 'students' },
            { time: 2, action: 'Debrief and summarize', who: 'instructor' }
          ],
          facilitationTips: [
            'Monitor groups for engagement',
            'Provide clear time warnings',
            'Ensure all students participate'
          ]
        },
        customizable: {
          topic,
          specificQuestion,
          groupSize: 3,
          assessmentMethod: 'Observation and discussion'
        }
      };
    }

    // Store in session (optional - don't fail if session doesn't exist)
    try {
      const session = sessionStore.getSession(sessionId);
      if (session) {
        const activities = (session.context as any).activities || [];
        activities.push(result);
        (session.context as any).activities = activities;
        await sessionStore.updateSession(sessionId, session);
      }
    } catch (sessionError) {
      logger.warn('Could not store activity in session:', sessionError);
      // Continue anyway - we still return the result
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error generating activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate activity',
    });
  }
});

// GET /api/active-learning/:sessionId/list
router.get('/:sessionId/list', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessionStore.getSession(sessionId);

    res.json({
      success: true,
      data: (session?.context as any)?.activities || [],
    });
  } catch (error) {
    logger.error('Error retrieving activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve activities',
    });
  }
});

// GET /api/active-learning/templates
router.get('/templates', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'think-pair-share',
        name: 'Think-Pair-Share',
        description: 'Students think individually, discuss in pairs, then share with class',
        duration: '6-10 minutes',
        bestFor: ['understand', 'apply', 'analyze'],
      },
      {
        id: 'peer-instruction',
        name: 'Peer Instruction',
        description: 'Conceptual question with individual voting, peer discussion, and revote',
        duration: '8-12 minutes',
        bestFor: ['understand', 'apply', 'analyze'],
      },
      {
        id: 'jigsaw',
        name: 'Jigsaw',
        description: 'Students become experts on sub-topics then teach each other',
        duration: '30-45 minutes',
        bestFor: ['understand', 'apply', 'analyze', 'evaluate'],
      },
      {
        id: 'case-study',
        name: 'Case Study Analysis',
        description: 'Analyze realistic scenarios and make recommendations',
        duration: '20-30 minutes',
        bestFor: ['apply', 'analyze', 'evaluate'],
      },
      {
        id: 'minute-paper',
        name: 'Minute Paper',
        description: 'Quick reflection on what was learned or what was confusing',
        duration: '3-5 minutes',
        bestFor: ['understand', 'analyze', 'evaluate'],
      },
      {
        id: 'concept-map',
        name: 'Concept Mapping',
        description: 'Visual diagram showing how concepts connect and relate',
        duration: '15-20 minutes',
        bestFor: ['understand', 'analyze', 'create'],
      },
      {
        id: 'problem-based-learning',
        name: 'Problem-Based Learning',
        description: 'Complex authentic problem requiring research and solution development',
        duration: '60-180 minutes',
        bestFor: ['apply', 'analyze', 'evaluate', 'create'],
      },
      {
        id: 'debate',
        name: 'Structured Debate',
        description: 'Students argue both sides of a debatable proposition',
        duration: '30-45 minutes',
        bestFor: ['analyze', 'evaluate', 'create'],
      },
    ],
  });
});

// DELETE /api/active-learning/:sessionId/:index
router.delete('/:sessionId/:index', async (req: Request, res: Response) => {
  try {
    const { sessionId, index } = req.params;
    const session = sessionStore.getSession(sessionId);

    if (session && (session.context as any)?.activities) {
      (session.context as any).activities.splice(parseInt(index), 1);
      await sessionStore.updateSession(sessionId, session);
    }

    res.json({
      success: true,
      message: 'Activity deleted',
    });
  } catch (error) {
    logger.error('Error deleting activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete activity',
    });
  }
});

export default router;
