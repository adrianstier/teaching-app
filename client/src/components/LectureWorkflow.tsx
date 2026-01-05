import React, { useState, useEffect, useRef } from 'react';
import { useLecture } from '../context/LectureContext';
import IntakeForm from './phases/IntakeForm';
import ArchitecturePhase from './phases/ArchitecturePhase';
import DevelopmentPhase from './phases/DevelopmentPhase';
import VisualPhase from './phases/VisualPhase';
import IntegrationPhase from './phases/IntegrationPhase';
import ProgressIndicator from './ProgressIndicator';
import { motion } from 'framer-motion';

const LectureWorkflow: React.FC = () => {
  const { sessionId, currentPhase, createSession, isLoading } = useLecture();
  const [showIntro, setShowIntro] = useState(true);
  const sessionCreatedRef = useRef(false);

  useEffect(() => {
    if (!sessionId && !showIntro && !sessionCreatedRef.current && !isLoading) {
      sessionCreatedRef.current = true;
      createSession();
    }
  }, [sessionId, showIntro, createSession, isLoading]);

  const renderPhase = () => {
    if (!sessionId && showIntro) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Lecture Development Workflow
          </h2>
          <p className="text-gray-600 mb-6">
            You'll be guided through 5 phases to create a comprehensive lecture package.
            Each phase is handled by specialized AI agents working together to deliver
            professional educational content.
          </p>
          <button
            onClick={() => setShowIntro(false)}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Begin Development'}
          </button>
        </motion.div>
      );
    }

    switch (currentPhase) {
      case 1:
        return <IntakeForm />;
      case 2:
        return <ArchitecturePhase />;
      case 3:
        return <DevelopmentPhase />;
      case 4:
        return <VisualPhase />;
      case 5:
        return <IntegrationPhase />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading workflow...</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {sessionId && <ProgressIndicator />}
      <div className="mt-8">
        {renderPhase()}
      </div>
    </div>
  );
};

export default LectureWorkflow;