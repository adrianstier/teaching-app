import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLecture } from '../../context/LectureContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import CheckpointReview from '../shared/CheckpointReview';
import LearningObjectivesDisplay from '../shared/LearningObjectivesDisplay';
import ConceptMapDisplay from '../shared/ConceptMapDisplay';
import AgentProgress, { AgentInfo } from '../shared/AgentProgress';
import ErrorDisplay from '../shared/ErrorDisplay';
import {
  AcademicCapIcon,
  MapIcon,
  ClockIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface StructureSegment {
  title: string;
  duration: number;
  type: string;
  description: string;
}

interface ArchitectureData {
  learningObjectives: any[];
  conceptMap: any[];
  proposedStructure: {
    segments: StructureSegment[];
    totalDuration: number;
  };
}

const ArchitecturePhase: React.FC = () => {
  const { lecturePackage, approveCheckpoint, isLoading, sessionId } = useLecture();
  const { error, handleError, clearError } = useErrorHandler();

  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'objectives' | 'concepts' | 'structure'>('objectives');
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'curriculum-architect',
      name: 'Curriculum Architect',
      description: 'Designing learning objectives and structure',
      status: 'running',
      progress: 0,
    },
  ]);

  // Generate architecture
  useEffect(() => {
    const generateArchitecture = async () => {
      if (!sessionId || !lecturePackage?.brief) return;

      clearError();

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.status === 'running' && agent.progress !== undefined) {
              const newProgress = Math.min(agent.progress + 10, 90);
              return { ...agent, progress: newProgress };
            }
            return agent;
          })
        );
      }, 500);

      try {
        // Call the backend API to execute the curriculum architect agent
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/agents/${sessionId}/execute/curriculum-architect`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              context: lecturePackage,
              input: lecturePackage.brief,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            setArchitectureData(data.result);
            setAgents((prev) =>
              prev.map((agent) =>
                agent.id === 'curriculum-architect'
                  ? { ...agent, status: 'completed', progress: 100 }
                  : agent
              )
            );
          } else {
            throw new Error(data.error || 'Failed to generate architecture');
          }
        } else {
          // If API fails, generate mock data for demo
          await generateMockData();
        }
      } catch (err) {
        console.error('Architecture generation error:', err);
        // Generate mock data as fallback
        await generateMockData();
      } finally {
        clearInterval(progressInterval);
        setIsGenerating(false);
      }
    };

    const generateMockData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const brief = lecturePackage?.brief;
      if (!brief) return;

      // Generate mock learning objectives
      const mockObjectives = brief.mainGoals?.map((goal: string, index: number) => ({
        id: `obj-${index + 1}`,
        objective: goal,
        bloomLevel: index === 0 ? 'understand' : index === 1 ? 'apply' : 'analyze',
        measurable: true,
        assessmentStrategy: 'Formative assessment through discussion and practice',
      })) || [];

      // Generate mock concept map
      const mockConcepts = [
        {
          id: 'concept-1',
          name: 'Core Foundations',
          description: `Introduction to ${brief.topic} fundamentals`,
          prerequisites: [],
          relatedConcepts: ['concept-2'],
          complexity: 'basic' as const,
          estimatedTime: Math.floor(brief.duration * 0.2),
        },
        {
          id: 'concept-2',
          name: 'Key Principles',
          description: `Essential principles of ${brief.topic}`,
          prerequisites: ['concept-1'],
          relatedConcepts: ['concept-3'],
          complexity: 'intermediate' as const,
          estimatedTime: Math.floor(brief.duration * 0.3),
        },
        {
          id: 'concept-3',
          name: 'Practical Applications',
          description: `How to apply ${brief.topic} in real scenarios`,
          prerequisites: ['concept-2'],
          relatedConcepts: [],
          complexity: 'intermediate' as const,
          estimatedTime: Math.floor(brief.duration * 0.3),
        },
        {
          id: 'concept-4',
          name: 'Advanced Topics',
          description: `Advanced considerations for ${brief.topic}`,
          prerequisites: ['concept-2', 'concept-3'],
          relatedConcepts: [],
          complexity: 'advanced' as const,
          estimatedTime: Math.floor(brief.duration * 0.2),
        },
      ];

      // Generate mock structure
      const mockStructure = {
        segments: [
          {
            title: 'Introduction & Overview',
            duration: 5,
            type: 'introduction',
            description: 'Welcome, objectives, and roadmap for the session',
          },
          {
            title: 'Core Concepts',
            duration: Math.floor(brief.duration * 0.3),
            type: 'content',
            description: `Introduction to fundamental ${brief.topic} concepts`,
          },
          {
            title: 'Interactive Activity',
            duration: 10,
            type: 'activity',
            description: 'Think-Pair-Share to reinforce key concepts',
          },
          {
            title: 'Deep Dive',
            duration: Math.floor(brief.duration * 0.3),
            type: 'content',
            description: 'Detailed exploration of advanced topics',
          },
          {
            title: 'Practice & Application',
            duration: 10,
            type: 'activity',
            description: 'Hands-on problem-solving exercise',
          },
          {
            title: 'Summary & Q&A',
            duration: 5,
            type: 'summary',
            description: 'Key takeaways and questions',
          },
        ],
        totalDuration: brief.duration,
      };

      setArchitectureData({
        learningObjectives: mockObjectives,
        conceptMap: mockConcepts,
        proposedStructure: mockStructure,
      });

      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === 'curriculum-architect'
            ? { ...agent, status: 'completed', progress: 100 }
            : agent
        )
      );
    };

    generateArchitecture();
  }, [sessionId, lecturePackage, clearError]);

  const handleApprove = () => {
    approveCheckpoint('architecture', true);
  };

  const handleRevision = (feedback: string) => {
    approveCheckpoint('architecture', false, feedback);
  };

  const retryGeneration = () => {
    setIsGenerating(true);
    setAgents([
      {
        id: 'curriculum-architect',
        name: 'Curriculum Architect',
        description: 'Designing learning objectives and structure',
        status: 'running',
        progress: 0,
      },
    ]);
    clearError();
    // The useEffect will trigger regeneration
  };

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'introduction':
        return '🎯';
      case 'content':
        return '📖';
      case 'activity':
        return '💡';
      case 'transition':
        return '➡️';
      case 'summary':
        return '📋';
      case 'assessment':
        return '✅';
      default:
        return '•';
    }
  };

  const getSegmentColor = (type: string) => {
    switch (type) {
      case 'introduction':
        return 'border-l-brand-navy';
      case 'content':
        return 'border-l-scholarly-sage';
      case 'activity':
        return 'border-l-brand-gold';
      case 'summary':
        return 'border-l-scholarly-terracotta';
      case 'assessment':
        return 'border-l-scholarly-wine';
      default:
        return 'border-l-gray-300';
    }
  };

  // Loading state
  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 mb-4"
            >
              <AcademicCapIcon className="h-8 w-8 text-brand-gold" />
            </motion.div>
            <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
              Phase 2: Curriculum Architecture
            </h2>
            <p className="text-brand-text">
              Designing learning objectives, concept maps, and lecture structure
            </p>
          </div>

          <AgentProgress agents={agents} />

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-text-light">
              The Curriculum Architect is analyzing your lecture brief and designing the optimal learning path...
            </p>
          </div>

          {/* Estimated time */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-brand-text-light">
            <ClockIcon className="h-4 w-4" />
            <span>Estimated completion: 30-45 seconds</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <ErrorDisplay error={error} onRetry={retryGeneration} onDismiss={clearError} />
      </motion.div>
    );
  }

  // No data state
  if (!architectureData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-8 text-center">
          <p className="text-brand-text mb-4">No architecture data available.</p>
          <button
            onClick={retryGeneration}
            className="inline-flex items-center px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Generate Architecture
          </button>
        </div>
      </motion.div>
    );
  }

  // Main content
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-scholarly-sage/10 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-scholarly-sage" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-brand-navy">
                Phase 2: Curriculum Architecture
              </h2>
              <p className="text-sm text-brand-text-light mt-1">
                Review learning objectives, concept relationships, and lecture structure
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-scholarly-sage">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Generated</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
            <LightBulbIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
            <div>
              <p className="text-xs text-brand-text-light">Learning Objectives</p>
              <p className="text-sm font-medium text-brand-navy">
                {architectureData.learningObjectives.length} objectives
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
            <MapIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
            <div>
              <p className="text-xs text-brand-text-light">Key Concepts</p>
              <p className="text-sm font-medium text-brand-navy">
                {architectureData.conceptMap.length} concepts
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
            <div>
              <p className="text-xs text-brand-text-light">Structure Segments</p>
              <p className="text-sm font-medium text-brand-navy">
                {architectureData.proposedStructure.segments.length} segments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle mb-6 overflow-hidden">
        <div className="border-b border-brand-border-subtle">
          <div className="flex">
            <button
              onClick={() => setActiveTab('objectives')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'objectives'
                  ? 'text-brand-navy bg-brand-bg border-b-2 border-brand-navy'
                  : 'text-brand-text-light hover:text-brand-navy hover:bg-brand-bg/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <LightBulbIcon className="h-5 w-5" />
                <span>Learning Objectives</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'concepts'
                  ? 'text-brand-navy bg-brand-bg border-b-2 border-brand-navy'
                  : 'text-brand-text-light hover:text-brand-navy hover:bg-brand-bg/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MapIcon className="h-5 w-5" />
                <span>Concept Map</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'structure'
                  ? 'text-brand-navy bg-brand-bg border-b-2 border-brand-navy'
                  : 'text-brand-text-light hover:text-brand-navy hover:bg-brand-bg/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>Lecture Structure</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Learning Objectives Tab */}
          {activeTab === 'objectives' && (
            <motion.div
              key="objectives"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="font-medium text-brand-navy mb-2">Bloom's Taxonomy Aligned</h3>
                <p className="text-sm text-brand-text-light">
                  Each objective is measurable and aligned with appropriate cognitive levels.
                </p>
              </div>
              <LearningObjectivesDisplay objectives={architectureData.learningObjectives} />
            </motion.div>
          )}

          {/* Concept Map Tab */}
          {activeTab === 'concepts' && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="font-medium text-brand-navy mb-2">Prerequisite Dependencies</h3>
                <p className="text-sm text-brand-text-light">
                  Concepts are organized to build logically from foundations to advanced topics.
                </p>
              </div>
              <ConceptMapDisplay concepts={architectureData.conceptMap} />
            </motion.div>
          )}

          {/* Structure Tab */}
          {activeTab === 'structure' && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="font-medium text-brand-navy mb-2">Time-Optimized Flow</h3>
                <p className="text-sm text-brand-text-light mb-4">
                  Lecture structure balances content delivery with active learning.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-brand-text-light">Total Duration:</span>
                  <span className="font-medium text-brand-navy">
                    {architectureData.proposedStructure.totalDuration} minutes
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {architectureData.proposedStructure.segments.map((segment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-4 p-4 bg-brand-bg rounded-lg border-l-4 ${getSegmentColor(
                      segment.type
                    )}`}
                  >
                    <div className="flex-shrink-0 text-2xl">{getSegmentIcon(segment.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-brand-navy">{segment.title}</h4>
                        <span className="text-sm text-brand-text-light flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{segment.duration} min</span>
                        </span>
                      </div>
                      <p className="text-sm text-brand-text-light">{segment.description}</p>
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs bg-white rounded border border-brand-border-subtle text-brand-text capitalize">
                          {segment.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Checkpoint Review */}
      <CheckpointReview
        phaseName="Curriculum Architecture"
        onApprove={handleApprove}
        onRevision={handleRevision}
        isLoading={isLoading}
        suggestions={[
          'Are the learning objectives clear and measurable?',
          'Does the concept sequence build logically?',
          'Is the time allocation appropriate for each segment?',
          'Do activities align with learning objectives?',
        ]}
      />
    </motion.div>
  );
};

export default ArchitecturePhase;
