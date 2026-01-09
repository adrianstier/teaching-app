import React, { useState, useEffect, useRef } from 'react';
import { useLecture } from '../context/LectureContext';
import IntakeForm from './phases/IntakeForm';
import ArchitecturePhase from './phases/ArchitecturePhase';
import DevelopmentPhase from './phases/DevelopmentPhase';
import VisualPhase from './phases/VisualPhase';
import IntegrationPhase from './phases/IntegrationPhase';
import ProgressIndicator from './ProgressIndicator';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  PresentationChartLineIcon,
  LightBulbIcon,
  FolderArrowDownIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const LectureWorkflow: React.FC = () => {
  const { sessionId, currentPhase, createSession, isLoading, resetSession } = useLecture();
  const [showIntro, setShowIntro] = useState(true);
  const sessionCreatedRef = useRef(false);

  useEffect(() => {
    if (!sessionId && !showIntro && !sessionCreatedRef.current && !isLoading) {
      sessionCreatedRef.current = true;
      createSession();
    }
  }, [sessionId, showIntro, createSession, isLoading]);

  // Reset the ref when session is reset
  useEffect(() => {
    if (!sessionId) {
      sessionCreatedRef.current = false;
    }
  }, [sessionId]);

  const phases = [
    {
      number: 1,
      title: 'Intake',
      description: 'Define your lecture requirements',
      icon: DocumentTextIcon,
    },
    {
      number: 2,
      title: 'Architecture',
      description: 'Design learning objectives and structure',
      icon: AcademicCapIcon,
    },
    {
      number: 3,
      title: 'Development',
      description: 'Create content and activities',
      icon: LightBulbIcon,
    },
    {
      number: 4,
      title: 'Visual Design',
      description: 'Generate slide specifications',
      icon: PresentationChartLineIcon,
    },
    {
      number: 5,
      title: 'Integration',
      description: 'Assemble final package',
      icon: FolderArrowDownIcon,
    },
  ];

  const renderPhase = () => {
    if (!sessionId && showIntro) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-gold/10 mb-6"
            >
              <SparklesIcon className="h-10 w-10 text-brand-gold" />
            </motion.div>
            <h1 className="font-serif text-4xl font-semibold text-brand-navy mb-4">
              Lecture Builder
            </h1>
            <p className="text-lg text-brand-text max-w-2xl mx-auto">
              Create comprehensive, evidence-based lecture packages with the help of specialized AI agents.
              Our workflow guides you through five phases to deliver professional educational content.
            </p>
          </div>

          {/* Phase Overview */}
          <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-8 mb-8">
            <h2 className="font-serif text-xl font-semibold text-brand-navy mb-6 text-center">
              Your Journey Through Five Phases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-3">
                      <phase.icon className="h-6 w-6 text-brand-navy" />
                    </div>
                    <span className="text-xs font-medium text-brand-gold mb-1">
                      Phase {phase.number}
                    </span>
                    <h3 className="text-sm font-medium text-brand-navy mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-brand-text-light">
                      {phase.description}
                    </p>
                  </div>
                  {index < phases.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ArrowRightIcon className="h-4 w-4 text-brand-border" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl border border-brand-border-subtle p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-scholarly-sage/10 flex items-center justify-center mb-4">
                <AcademicCapIcon className="h-5 w-5 text-scholarly-sage" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">Evidence-Based Design</h3>
              <p className="text-sm text-brand-text-light">
                Built on pedagogical research and Bloom's Taxonomy for effective learning outcomes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl border border-brand-border-subtle p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-4">
                <SparklesIcon className="h-5 w-5 text-brand-gold" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">AI-Powered Agents</h3>
              <p className="text-sm text-brand-text-light">
                Five specialized agents work together to create comprehensive lecture materials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl border border-brand-border-subtle p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-scholarly-terracotta/10 flex items-center justify-center mb-4">
                <FolderArrowDownIcon className="h-5 w-5 text-scholarly-terracotta" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">Complete Package</h3>
              <p className="text-sm text-brand-text-light">
                Receive slides, speaker notes, activities, and an instructor guide ready to use.
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <button
              onClick={() => setShowIntro(false)}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-brand-navy text-white font-medium rounded-xl shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Starting...' : 'Begin Creating Your Lecture'}</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <p className="mt-4 text-sm text-brand-text-light">
              Typically takes 10-15 minutes to complete all phases
            </p>
          </motion.div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-navy border-t-transparent mb-4" />
            <p className="text-brand-text">Initializing workflow...</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {sessionId && currentPhase > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ProgressIndicator />
          </motion.div>
        )}
        <div className="mt-4">
          {renderPhase()}
        </div>
      </div>
    </div>
  );
};

export default LectureWorkflow;
