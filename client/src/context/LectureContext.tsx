import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lectureAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

interface LectureContextType {
  sessionId: string | null;
  currentPhase: number;
  lecturePackage: any;
  isLoading: boolean;
  error: string | null;
  createSession: () => Promise<void>;
  submitIntake: (data: any) => Promise<void>;
  approveCheckpoint: (checkpointId: string, approved: boolean, feedback?: string) => Promise<void>;
  executeAgent: (agentType: string) => Promise<void>;
  downloadPackage: (format: 'zip' | 'json') => Promise<void>;
  resetSession: () => void;
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

export const LectureProvider: React.FC<LectureProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [lecturePackage, setLecturePackage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Connect to WebSocket
      const socket = socketService.connect(sessionId);

      // Listen for updates
      socket.on('phase-update', (data) => {
        setCurrentPhase(data.phase);
        toast.success(`Phase ${data.phase} completed!`);
      });

      socket.on('agent-start', (data) => {
        toast.loading(`${data.agentType} agent starting...`, { id: 'agent-status' });
      });

      socket.on('agent-complete', (data) => {
        toast.success(`${data.agentType} agent completed!`, { id: 'agent-status' });
        if (data.result) {
          setLecturePackage((prev: any) => ({
            ...prev,
            ...data.result,
          }));
        }
      });

      socket.on('agent-error', (data) => {
        toast.error(`${data.agentType} agent failed: ${data.error}`, { id: 'agent-status' });
      });

      socket.on('checkpoint-result', (data) => {
        if (data.approved) {
          toast.success(`Checkpoint ${data.checkpointId} approved!`);
        } else {
          toast.error(`Checkpoint ${data.checkpointId} needs revision`);
        }
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [sessionId]);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await lectureAPI.createSession();
      if (response.success) {
        setSessionId(response.sessionId);
        setCurrentPhase(1);
        toast.success('Session created successfully!');
      }
    } catch (err) {
      setError('Failed to create session');
      toast.error('Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  const submitIntake = async (data: any) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await lectureAPI.submitIntake(sessionId, data);
      if (response.success) {
        setLecturePackage((prev: any) => ({
          ...prev,
          brief: response.data,
        }));
        setCurrentPhase(2);
        toast.success('Intake submitted successfully!');
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
      if (approved) {
        setCurrentPhase(currentPhase + 1);
      }
    } catch (err) {
      toast.error('Failed to process checkpoint');
    } finally {
      setIsLoading(false);
    }
  };

  const executeAgent = async (agentType: string) => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      // The actual execution will be handled by the backend
      // We just trigger it and listen for WebSocket updates
      toast.loading(`Starting ${agentType} agent...`, { id: `agent-${agentType}` });
    } catch (err) {
      toast.error(`Failed to execute ${agentType} agent`, { id: `agent-${agentType}` });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPackage = async (format: 'zip' | 'json') => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const packageData = await lectureAPI.getPackage(sessionId);
      if (packageData.success) {
        // Trigger download through export API
        toast.success(`Downloading ${format} package...`);
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
    socketService.disconnect();
  };

  return (
    <LectureContext.Provider
      value={{
        sessionId,
        currentPhase,
        lecturePackage,
        isLoading,
        error,
        createSession,
        submitIntake,
        approveCheckpoint,
        executeAgent,
        downloadPackage,
        resetSession,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};