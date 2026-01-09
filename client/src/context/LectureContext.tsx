import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { lectureAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

// Agent status types
export type AgentStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentState {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  progress: number;
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

// Phase data types
export interface LearningObjective {
  id: string;
  objective: string;
  bloomLevel: string;
  measurable: boolean;
  assessmentStrategy: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  relatedConcepts: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

export interface StructureSegment {
  title: string;
  duration: number;
  type: string;
  description: string;
}

export interface ContentSegment {
  id: string;
  title: string;
  duration: number;
  type: string;
  keyPoints: string[];
  details: string;
  teachingNotes: string;
  transitionNote: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
  description: string;
  materials: string[];
  instructions: string[];
  assessmentCriteria: string[];
}

export interface SlideSpec {
  id: string;
  slideNumber: number;
  title: string;
  layout: string;
  content: {
    headline?: string;
    bullets?: string[];
    visual?: string;
    speakerNotes: string;
  };
  duration: number;
  animations?: string[];
}

export interface LectureBrief {
  topic: string;
  title?: string;
  courseContext?: string;
  targetAudience?: string;
  audienceLevel: string;
  duration: number;
  format?: string;
  mainGoals: string[];
  prerequisites?: string[];
  priorKnowledge?: string;
  constraints?: string[];
  preferredStyle?: string;
  specialRequirements?: string[];
  additionalNotes?: string;
  keywords?: string[];
}

export interface ArchitectureData {
  learningObjectives: LearningObjective[];
  conceptMap: Concept[];
  proposedStructure: {
    segments: StructureSegment[];
    totalDuration: number;
  };
}

export interface DevelopmentData {
  contentSegments: ContentSegment[];
  activities: Activity[];
  assessments?: any[];
}

export interface VisualData {
  slides: SlideSpec[];
  theme?: {
    primaryColor: string;
    fontFamily: string;
    style: string;
  };
}

export interface IntegrationData {
  packageContents: {
    slides: boolean;
    instructorGuide: boolean;
    handouts: boolean;
    activities: boolean;
    assessments: boolean;
  };
  instructorGuide?: any;
  exportFormats: string[];
}

export interface LecturePackage {
  brief?: LectureBrief;
  architecture?: ArchitectureData;
  development?: DevelopmentData;
  visual?: VisualData;
  integration?: IntegrationData;
}

export interface CheckpointState {
  id: string;
  phase: number;
  approved: boolean;
  feedback?: string;
  approvedAt?: Date;
}

interface LectureContextType {
  // Session state
  sessionId: string | null;
  currentPhase: number;
  lecturePackage: LecturePackage;
  isLoading: boolean;
  error: string | null;

  // Agent state
  agents: Record<string, AgentState>;
  activeAgents: string[];

  // Checkpoint state
  checkpoints: Record<string, CheckpointState>;

  // Phase-specific data
  architectureData: ArchitectureData | null;
  developmentData: DevelopmentData | null;
  visualData: VisualData | null;
  integrationData: IntegrationData | null;

  // Actions
  createSession: () => Promise<void>;
  submitIntake: (data: LectureBrief) => Promise<void>;
  approveCheckpoint: (checkpointId: string, approved: boolean, feedback?: string) => Promise<void>;
  executeAgent: (agentType: string, context?: any) => Promise<any>;
  executeAgentsInParallel: (agentTypes: string[], context?: any) => Promise<any[]>;
  downloadPackage: (format: 'zip' | 'json') => Promise<void>;
  resetSession: () => void;

  // Phase navigation
  goToPhase: (phase: number) => void;
  canProceedToPhase: (phase: number) => boolean;

  // Data setters for mock/demo mode
  setArchitectureData: (data: ArchitectureData) => void;
  setDevelopmentData: (data: DevelopmentData) => void;
  setVisualData: (data: VisualData) => void;
  setIntegrationData: (data: IntegrationData) => void;
}

const LectureContext = createContext<LectureContextType | undefined>(undefined);

export const useLecture = () => {
  const context = useContext(LectureContext);
  if (!context) {
    throw new Error('useLecture must be used within a LectureProvider');
  }
  return context;
};

interface LectureProviderProps {
  children: ReactNode;
}

// Initial agent states
const initialAgents: Record<string, AgentState> = {
  'curriculum-architect': {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    description: 'Designing learning objectives and structure',
    status: 'pending',
    progress: 0,
  },
  'content-developer': {
    id: 'content-developer',
    name: 'Content Developer',
    description: 'Creating detailed content segments',
    status: 'pending',
    progress: 0,
  },
  'pedagogy-designer': {
    id: 'pedagogy-designer',
    name: 'Pedagogy Designer',
    description: 'Designing activities and assessments',
    status: 'pending',
    progress: 0,
  },
  'visual-designer': {
    id: 'visual-designer',
    name: 'Visual Designer',
    description: 'Creating slide specifications',
    status: 'pending',
    progress: 0,
  },
  'integration-specialist': {
    id: 'integration-specialist',
    name: 'Integration Specialist',
    description: 'Assembling final package',
    status: 'pending',
    progress: 0,
  },
};

export const LectureProvider: React.FC<LectureProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [lecturePackage, setLecturePackage] = useState<LecturePackage>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Agent state
  const [agents, setAgents] = useState<Record<string, AgentState>>(initialAgents);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);

  // Checkpoint state
  const [checkpoints, setCheckpoints] = useState<Record<string, CheckpointState>>({});

  // Phase-specific data
  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null);
  const [developmentData, setDevelopmentData] = useState<DevelopmentData | null>(null);
  const [visualData, setVisualData] = useState<VisualData | null>(null);
  const [integrationData, setIntegrationData] = useState<IntegrationData | null>(null);

  // Update agent status helper
  const updateAgentStatus = useCallback((agentId: string, updates: Partial<AgentState>) => {
    setAgents(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        ...updates,
      },
    }));
  }, []);

  // WebSocket connection and event handling
  useEffect(() => {
    if (sessionId) {
      const socket = socketService.connect(sessionId);

      socket.on('phase-update', (data) => {
        setCurrentPhase(data.phase);
        if (data.status === 'complete') {
          toast.success(`Phase ${data.phase} completed`);
        }
      });

      socket.on('agent-start', (data) => {
        const { agentType } = data;
        updateAgentStatus(agentType, {
          status: 'running',
          progress: 0,
          startedAt: new Date(),
        });
        setActiveAgents(prev => [...prev, agentType]);
      });

      socket.on('agent-progress', (data) => {
        const { agentType, progress } = data;
        updateAgentStatus(agentType, { progress });
      });

      socket.on('agent-complete', (data) => {
        const { agentType, result } = data;
        updateAgentStatus(agentType, {
          status: 'completed',
          progress: 100,
          result,
          completedAt: new Date(),
        });
        setActiveAgents(prev => prev.filter(id => id !== agentType));

        // Update lecture package with result
        if (result) {
          setLecturePackage(prev => ({
            ...prev,
            ...result,
          }));
        }
      });

      socket.on('agent-error', (data) => {
        const { agentType, error: agentError } = data;
        updateAgentStatus(agentType, {
          status: 'error',
          error: agentError,
        });
        setActiveAgents(prev => prev.filter(id => id !== agentType));
        toast.error(`${agentType} failed: ${agentError}`);
      });

      socket.on('checkpoint-result', (data) => {
        const { checkpointId, approved, feedback } = data;
        setCheckpoints(prev => ({
          ...prev,
          [checkpointId]: {
            id: checkpointId,
            phase: currentPhase,
            approved,
            feedback,
            approvedAt: approved ? new Date() : undefined,
          },
        }));
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [sessionId, currentPhase, updateAgentStatus]);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lectureAPI.createSession();
      if (response.success) {
        setSessionId(response.sessionId);
        setCurrentPhase(1);
        // Reset all state for new session
        setAgents(initialAgents);
        setActiveAgents([]);
        setCheckpoints({});
        setArchitectureData(null);
        setDevelopmentData(null);
        setVisualData(null);
        setIntegrationData(null);
        setLecturePackage({});
        toast.success('Session created');
      }
    } catch (err) {
      setError('Failed to create session');
      toast.error('Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  const submitIntake = async (data: LectureBrief) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await lectureAPI.submitIntake(sessionId, data);
      if (response.success) {
        setLecturePackage(prev => ({
          ...prev,
          brief: response.data || data,
        }));
        setCurrentPhase(2);
        toast.success('Intake submitted');
      }
    } catch (err) {
      setError('Failed to submit intake');
      toast.error('Failed to submit intake');
    } finally {
      setIsLoading(false);
    }
  };

  const approveCheckpoint = async (checkpointId: string, approved: boolean, feedback?: string) => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      await lectureAPI.approveCheckpoint(sessionId, checkpointId, approved, feedback);

      setCheckpoints(prev => ({
        ...prev,
        [checkpointId]: {
          id: checkpointId,
          phase: currentPhase,
          approved,
          feedback,
          approvedAt: approved ? new Date() : undefined,
        },
      }));

      if (approved) {
        setCurrentPhase(prev => prev + 1);
        toast.success('Proceeding to next phase');
      } else {
        toast('Revision requested', { icon: '📝' });
      }
    } catch (err) {
      toast.error('Failed to process checkpoint');
    } finally {
      setIsLoading(false);
    }
  };

  const executeAgent = async (agentType: string, context?: any) => {
    if (!sessionId) return null;

    // Map frontend agent names to backend agent types
    const agentTypeMap: Record<string, string> = {
      'curriculum-architect': 'architect',
      'content-developer': 'content',
      'pedagogy-designer': 'pedagogy',
      'visual-designer': 'visual',
      'integration-specialist': 'integration',
    };

    const backendAgentType = agentTypeMap[agentType] || agentType;

    try {
      updateAgentStatus(agentType, {
        status: 'running',
        progress: 0,
        startedAt: new Date(),
      });
      setActiveAgents(prev => [...prev, agentType]);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/agents/${sessionId}/execute/${backendAgentType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: context || lecturePackage,
            input: lecturePackage.brief,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        updateAgentStatus(agentType, {
          status: 'completed',
          progress: 100,
          result: data.result,
          completedAt: new Date(),
        });
        setActiveAgents(prev => prev.filter(id => id !== agentType));
        return data.result;
      } else {
        throw new Error(data.error || 'Agent execution failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      updateAgentStatus(agentType, {
        status: 'error',
        error: errorMessage,
      });
      setActiveAgents(prev => prev.filter(id => id !== agentType));
      return null;
    }
  };

  const executeAgentsInParallel = async (agentTypes: string[], context?: any) => {
    if (!sessionId) return [];

    const promises = agentTypes.map(agentType => executeAgent(agentType, context));
    return Promise.all(promises);
  };

  const downloadPackage = async (format: 'zip' | 'json') => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/export/${sessionId}/download?format=${format}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lecture-package.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Downloaded ${format.toUpperCase()} package`);
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      toast.error('Failed to download package');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSessionId(null);
    setCurrentPhase(0);
    setLecturePackage({});
    setError(null);
    setAgents(initialAgents);
    setActiveAgents([]);
    setCheckpoints({});
    setArchitectureData(null);
    setDevelopmentData(null);
    setVisualData(null);
    setIntegrationData(null);
    socketService.disconnect();
  };

  const goToPhase = (phase: number) => {
    if (canProceedToPhase(phase)) {
      setCurrentPhase(phase);
    }
  };

  const canProceedToPhase = (phase: number) => {
    // Phase 1 always accessible
    if (phase === 1) return true;

    // Check if previous phase checkpoint is approved
    const previousCheckpoint = Object.values(checkpoints).find(
      cp => cp.phase === phase - 1
    );

    // Allow proceeding if previous checkpoint approved or if we have the required data
    if (previousCheckpoint?.approved) return true;

    // Check if we have data for the previous phase
    switch (phase) {
      case 2:
        return !!lecturePackage.brief;
      case 3:
        return !!architectureData || !!lecturePackage.architecture;
      case 4:
        return !!developmentData || !!lecturePackage.development;
      case 5:
        return !!visualData || !!lecturePackage.visual;
      default:
        return false;
    }
  };

  return (
    <LectureContext.Provider
      value={{
        // Session state
        sessionId,
        currentPhase,
        lecturePackage,
        isLoading,
        error,

        // Agent state
        agents,
        activeAgents,

        // Checkpoint state
        checkpoints,

        // Phase-specific data
        architectureData,
        developmentData,
        visualData,
        integrationData,

        // Actions
        createSession,
        submitIntake,
        approveCheckpoint,
        executeAgent,
        executeAgentsInParallel,
        downloadPackage,
        resetSession,

        // Phase navigation
        goToPhase,
        canProceedToPhase,

        // Data setters
        setArchitectureData,
        setDevelopmentData,
        setVisualData,
        setIntegrationData,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};
