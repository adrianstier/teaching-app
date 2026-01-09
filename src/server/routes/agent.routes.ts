import { Router, Request, Response } from 'express';
import { OrchestratorAgent } from '../../agents/orchestrator-agent';
import { CurriculumArchitectAgent } from '../../agents/curriculum-architect-agent';
import { ContentDeveloperAgent } from '../../agents/content-developer-agent';
import { PedagogyDesignerAgent } from '../../agents/pedagogy-designer-agent';
import { VisualDesignerAgent } from '../../agents/visual-designer-agent';
import { IntegrationAgent } from '../../agents/integration-agent';
import { emitUpdate } from '../server';
import { activeSessions } from './lecture.routes';

const router = Router();

// Agent type definitions for consistent naming
const AGENT_TYPES = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator',
    phase: 1,
    description: 'Conducts intake interview and generates lecture brief',
    Class: OrchestratorAgent
  },
  architect: {
    id: 'architect',
    name: 'Curriculum Architect',
    phase: 2,
    description: 'Creates learning objectives, concept map, and lecture structure',
    Class: CurriculumArchitectAgent
  },
  'curriculum-architect': {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    phase: 2,
    description: 'Creates learning objectives, concept map, and lecture structure',
    Class: CurriculumArchitectAgent
  },
  content: {
    id: 'content',
    name: 'Content Developer',
    phase: 3,
    description: 'Develops detailed content for each segment',
    Class: ContentDeveloperAgent
  },
  'content-developer': {
    id: 'content-developer',
    name: 'Content Developer',
    phase: 3,
    description: 'Develops detailed content for each segment',
    Class: ContentDeveloperAgent
  },
  pedagogy: {
    id: 'pedagogy',
    name: 'Pedagogy Designer',
    phase: 3,
    description: 'Designs activities, assessments, and learning experiences',
    Class: PedagogyDesignerAgent
  },
  'pedagogy-designer': {
    id: 'pedagogy-designer',
    name: 'Pedagogy Designer',
    phase: 3,
    description: 'Designs activities, assessments, and learning experiences',
    Class: PedagogyDesignerAgent
  },
  visual: {
    id: 'visual',
    name: 'Visual Designer',
    phase: 4,
    description: 'Creates slide specifications and visual layouts',
    Class: VisualDesignerAgent
  },
  'visual-designer': {
    id: 'visual-designer',
    name: 'Visual Designer',
    phase: 4,
    description: 'Creates slide specifications and visual layouts',
    Class: VisualDesignerAgent
  },
  integration: {
    id: 'integration',
    name: 'Integration Specialist',
    phase: 5,
    description: 'Assembles complete lecture package',
    Class: IntegrationAgent
  },
  'integration-specialist': {
    id: 'integration-specialist',
    name: 'Integration Specialist',
    phase: 5,
    description: 'Assembles complete lecture package',
    Class: IntegrationAgent
  }
} as const;

type AgentType = keyof typeof AGENT_TYPES;

// Execute specific agent phase
router.post('/:sessionId/execute/:agentType', async (req: Request, res: Response) => {
  const { sessionId, agentType } = req.params;
  const { context, input } = req.body;

  // Validate agent type
  if (!(agentType in AGENT_TYPES)) {
    return res.status(400).json({
      success: false,
      error: `Invalid agent type: ${agentType}`,
      availableTypes: Object.keys(AGENT_TYPES)
    });
  }

  const agentConfig = AGENT_TYPES[agentType as AgentType];

  try {
    // Emit start event
    emitUpdate(sessionId, 'agent-start', {
      agentType,
      agentName: agentConfig.name,
      phase: agentConfig.phase
    });

    // Get session context if not provided
    let agentContext = context;
    if (!agentContext && sessionId) {
      const session = activeSessions.get(sessionId);
      if (session) {
        agentContext = session.context.lecturePackage;
      }
    }

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      const progress = Math.floor(Math.random() * 20) + 10;
      emitUpdate(sessionId, 'agent-progress', {
        agentType,
        progress: Math.min(progress, 90)
      });
    }, 1000);

    // Create and execute agent
    const AgentClass = agentConfig.Class;
    const agent = new AgentClass(agentContext);
    const result = await agent.execute(input || agentContext?.brief);

    // Clear progress interval
    clearInterval(progressInterval);

    // Store result in session
    const session = activeSessions.get(sessionId);
    if (session && result) {
      // Map result to appropriate package section
      switch (agentConfig.phase) {
        case 2:
          session.context.lecturePackage.architecture = result;
          break;
        case 3:
          if (agentType.includes('content')) {
            session.context.lecturePackage.development = {
              ...session.context.lecturePackage.development,
              contentSegments: result.segments || result.contentSegments,
            };
          } else if (agentType.includes('pedagogy')) {
            session.context.lecturePackage.development = {
              ...session.context.lecturePackage.development,
              activities: result.activities,
              assessments: result.assessments,
            };
          }
          break;
        case 4:
          session.context.lecturePackage.visual = result;
          break;
        case 5:
          session.context.lecturePackage.integration = result;
          break;
      }
      session.updatedAt = new Date();
    }

    // Emit completion event
    emitUpdate(sessionId, 'agent-complete', {
      agentType,
      agentName: agentConfig.name,
      phase: agentConfig.phase,
      result
    });

    res.json({
      success: true,
      agentType,
      agentName: agentConfig.name,
      phase: agentConfig.phase,
      result
    });

  } catch (error) {
    // Emit error event
    emitUpdate(sessionId, 'agent-error', {
      agentType,
      agentName: agentConfig.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      success: false,
      error: 'Agent execution failed',
      agentType,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute multiple agents in parallel
router.post('/:sessionId/execute-parallel', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { agentTypes, context, input } = req.body;

  if (!Array.isArray(agentTypes) || agentTypes.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'agentTypes must be a non-empty array'
    });
  }

  // Validate all agent types
  const invalidTypes = agentTypes.filter(t => !(t in AGENT_TYPES));
  if (invalidTypes.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid agent types: ${invalidTypes.join(', ')}`,
      availableTypes: Object.keys(AGENT_TYPES)
    });
  }

  try {
    // Get session context if not provided
    let agentContext = context;
    if (!agentContext && sessionId) {
      const session = activeSessions.get(sessionId);
      if (session) {
        agentContext = session.context.lecturePackage;
      }
    }

    // Execute agents in parallel
    const promises = agentTypes.map(async (agentType: string) => {
      const agentConfig = AGENT_TYPES[agentType as AgentType];

      emitUpdate(sessionId, 'agent-start', {
        agentType,
        agentName: agentConfig.name,
        phase: agentConfig.phase
      });

      try {
        const AgentClass = agentConfig.Class;
        const agent = new AgentClass(agentContext);
        const result = await agent.execute(input || agentContext?.brief);

        emitUpdate(sessionId, 'agent-complete', {
          agentType,
          agentName: agentConfig.name,
          result
        });

        return { agentType, success: true, result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        emitUpdate(sessionId, 'agent-error', {
          agentType,
          agentName: agentConfig.name,
          error: errorMessage
        });

        return { agentType, success: false, error: errorMessage };
      }
    });

    const results = await Promise.all(promises);

    // Update session with combined results
    const session = activeSessions.get(sessionId);
    if (session) {
      results.forEach(({ agentType, success, result }) => {
        if (success && result) {
          const agentConfig = AGENT_TYPES[agentType as AgentType];
          switch (agentConfig.phase) {
            case 3:
              if (agentType.includes('content')) {
                session.context.lecturePackage.development = {
                  ...session.context.lecturePackage.development,
                  contentSegments: result.segments || result.contentSegments,
                };
              } else if (agentType.includes('pedagogy')) {
                session.context.lecturePackage.development = {
                  ...session.context.lecturePackage.development,
                  activities: result.activities,
                  assessments: result.assessments,
                };
              }
              break;
          }
        }
      });
      session.updatedAt = new Date();
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Parallel agent execution failed',
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
      id: 'curriculum-architect',
      aliases: ['architect'],
      name: 'Curriculum Architect',
      phase: 2,
      description: 'Creates learning objectives, concept map, and lecture structure',
      status: 'available'
    },
    {
      id: 'content-developer',
      aliases: ['content'],
      name: 'Content Developer',
      phase: 3,
      description: 'Develops detailed content for each segment',
      status: 'available'
    },
    {
      id: 'pedagogy-designer',
      aliases: ['pedagogy'],
      name: 'Pedagogy Designer',
      phase: 3,
      description: 'Designs activities, assessments, and learning experiences',
      status: 'available'
    },
    {
      id: 'visual-designer',
      aliases: ['visual'],
      name: 'Visual Designer',
      phase: 4,
      description: 'Creates slide specifications and visual layouts',
      status: 'available'
    },
    {
      id: 'integration-specialist',
      aliases: ['integration'],
      name: 'Integration Specialist',
      phase: 5,
      description: 'Assembles complete lecture package',
      status: 'available'
    }
  ];

  res.json({
    success: true,
    agents,
    totalAgents: agents.length
  });
});

// Get agent status for a session
router.get('/:sessionId/status', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  // Determine which agents have completed based on package contents
  const agentStatus = {
    orchestrator: !!session.context.lecturePackage.brief,
    'curriculum-architect': !!session.context.lecturePackage.architecture,
    'content-developer': !!session.context.lecturePackage.development?.contentSegments,
    'pedagogy-designer': !!session.context.lecturePackage.development?.activities,
    'visual-designer': !!session.context.lecturePackage.visual,
    'integration-specialist': !!session.context.lecturePackage.integration,
  };

  res.json({
    success: true,
    sessionId,
    currentPhase: session.context.currentPhase,
    agentStatus
  });
});

export default router;
