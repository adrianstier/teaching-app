import { Router, Request, Response } from 'express';
import { OrchestratorAgent } from '../../agents/orchestrator-agent';
import { CurriculumArchitectAgent } from '../../agents/curriculum-architect-agent';
import { ContentDeveloperAgent } from '../../agents/content-developer-agent';
import { PedagogyDesignerAgent } from '../../agents/pedagogy-designer-agent';
import { VisualDesignerAgent } from '../../agents/visual-designer-agent';
import { IntegrationAgent } from '../../agents/integration-agent';
import { emitUpdate } from '../server';

const router = Router();

// Execute specific agent phase
router.post('/:sessionId/execute/:agentType', async (req: Request, res: Response) => {
  const { sessionId, agentType } = req.params;
  const { context, input } = req.body;

  try {
    let result: any;

    // Emit start event
    emitUpdate(sessionId, 'agent-start', { agentType });

    switch (agentType) {
      case 'orchestrator':
        const orchestrator = new OrchestratorAgent(context);
        result = await orchestrator.execute(input);
        break;

      case 'architect':
        const architect = new CurriculumArchitectAgent(context);
        result = await architect.execute(input);
        break;

      case 'content':
        const contentDev = new ContentDeveloperAgent(context);
        result = await contentDev.execute(input);
        break;

      case 'pedagogy':
        const pedagogy = new PedagogyDesignerAgent(context);
        result = await pedagogy.execute(input);
        break;

      case 'visual':
        const visual = new VisualDesignerAgent(context);
        result = await visual.execute(input);
        break;

      case 'integration':
        const integration = new IntegrationAgent(context);
        result = await integration.execute(input);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid agent type'
        });
    }

    // Emit completion event
    emitUpdate(sessionId, 'agent-complete', {
      agentType,
      result
    });

    res.json({
      success: true,
      agentType,
      result
    });

  } catch (error) {
    // Emit error event
    emitUpdate(sessionId, 'agent-error', {
      agentType,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      success: false,
      error: 'Agent execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get agent information
router.get('/info', (req: Request, res: Response) => {
  const agents = [
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      phase: 1,
      description: 'Conducts intake interview and generates lecture brief',
      status: 'available'
    },
    {
      id: 'architect',
      name: 'Curriculum Architect',
      phase: 2,
      description: 'Creates learning objectives and concept map',
      status: 'available'
    },
    {
      id: 'content',
      name: 'Content Developer',
      phase: 3,
      description: 'Develops detailed content for each segment',
      status: 'available'
    },
    {
      id: 'pedagogy',
      name: 'Pedagogy Designer',
      phase: 3,
      description: 'Designs activities and assessments',
      status: 'available'
    },
    {
      id: 'visual',
      name: 'Visual Designer',
      phase: 4,
      description: 'Creates slide specifications',
      status: 'available'
    },
    {
      id: 'integration',
      name: 'Integration Specialist',
      phase: 5,
      description: 'Assembles complete package',
      status: 'available'
    }
  ];

  res.json({
    success: true,
    agents
  });
});

export default router;