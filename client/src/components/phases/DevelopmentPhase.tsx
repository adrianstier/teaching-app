import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLecture } from '../../context/LectureContext';
import CheckpointReview from '../shared/CheckpointReview';
import AgentProgress, { AgentInfo } from '../shared/AgentProgress';
import ErrorDisplay from '../shared/ErrorDisplay';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import {
  DocumentTextIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
  BeakerIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface LectureSegment {
  id: string;
  title: string;
  duration: number;
  type: string;
  content: string;
  speakerNotes: string;
  visualElements?: string[];
  activities?: string[];
}

interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
  instructions: string;
  materials?: string[];
  expectedOutcomes: string[];
  facilitation: string;
}

interface DevelopmentData {
  segments: LectureSegment[];
  activities: Activity[];
}

const DevelopmentPhase: React.FC = () => {
  const { lecturePackage, approveCheckpoint, isLoading, sessionId } = useLecture();
  const [developmentData, setDevelopmentData] = useState<DevelopmentData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'segments' | 'activities'>('segments');
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const { error, handleError, clearError } = useErrorHandler();
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'content-developer',
      name: 'Content Developer',
      description: 'Creating lecture content and speaker notes',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'pedagogy-designer',
      name: 'Pedagogy Designer',
      description: 'Designing interactive activities',
      status: 'pending',
      progress: 0,
    },
  ]);

  useEffect(() => {
    const generateContent = async () => {
      if (!sessionId || !lecturePackage?.brief) return;

      // Start content developer agent
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === 'content-developer' ? { ...agent, status: 'running', progress: 0 } : agent
        )
      );

      // Simulate parallel agent execution
      const contentPromise = simulateContentGeneration();

      // Start pedagogy designer after a short delay
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === 'pedagogy-designer' ? { ...agent, status: 'running', progress: 0 } : agent
          )
        );
      }, 1000);

      const activityPromise = simulateActivityGeneration();

      try {
        const [segments, activities] = await Promise.all([contentPromise, activityPromise]);

        setDevelopmentData({ segments, activities });

        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'completed', progress: 100 }))
        );
      } catch (err) {
        console.error('Development generation error:', err);
        handleError(err);
        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'error', progress: 0 }))
        );
      } finally {
        setIsGenerating(false);
      }
    };

    const simulateContentGeneration = async (): Promise<LectureSegment[]> => {
      const brief = lecturePackage?.brief;
      if (!brief) return [];

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === 'content-developer' ? { ...agent, progress: i } : agent
          )
        );
      }

      // Generate mock segments
      return [
        {
          id: 'seg-1',
          title: 'Introduction & Overview',
          duration: 5,
          type: 'introduction',
          content: `Welcome to today's session on ${brief.topic}. We'll explore the fundamental concepts and practical applications that will help you ${brief.mainGoals?.[0] || 'achieve your learning objectives'}.`,
          speakerNotes: `Start with a warm welcome. Make eye contact with the room. Ask a brief opening question to gauge prior knowledge. Preview the session structure.`,
          visualElements: ['Title slide', 'Learning objectives overview'],
        },
        {
          id: 'seg-2',
          title: 'Core Foundations',
          duration: Math.floor((brief.duration || 50) * 0.25),
          type: 'content',
          content: `Let's begin by establishing the foundational concepts of ${brief.topic}. Understanding these basics is essential for everything that follows.\n\nKey concepts include:\n- The fundamental principles\n- Core terminology and definitions\n- Historical context and evolution\n- Why these concepts matter`,
          speakerNotes: `Use concrete examples to illustrate abstract concepts. Pause after key points to check for understanding. Reference the concept map on the previous slide.`,
          visualElements: ['Concept diagram', 'Key terminology table', 'Timeline visualization'],
        },
        {
          id: 'seg-3',
          title: 'Interactive Discussion',
          duration: 10,
          type: 'activity',
          content: `Think-Pair-Share: How might these foundational concepts apply to your own experience? Take 1 minute to think, 2 minutes to discuss with a partner, then we'll share as a group.`,
          speakerNotes: `Circulate during pair discussions. Listen for interesting perspectives to highlight. Manage time carefully - use a visible timer.`,
          activities: ['Think-Pair-Share discussion'],
        },
        {
          id: 'seg-4',
          title: 'Deep Dive: Key Principles',
          duration: Math.floor((brief.duration || 50) * 0.3),
          type: 'content',
          content: `Now that we've established the foundations, let's examine the key principles in depth.\n\nPrinciple 1: [Core principle with detailed explanation]\nPrinciple 2: [Second principle with examples]\nPrinciple 3: [Third principle with applications]\n\nThese principles work together to create a comprehensive understanding of ${brief.topic}.`,
          speakerNotes: `This is the densest content section. Use visual aids extensively. Provide real-world examples for each principle. Check for questions midway through.`,
          visualElements: ['Principle diagram', 'Case study slides', 'Comparison table'],
        },
        {
          id: 'seg-5',
          title: 'Practical Application',
          duration: 10,
          type: 'activity',
          content: `Problem-solving exercise: Apply what you've learned to the following scenario...\n\nWork in small groups to analyze the problem and propose a solution using the principles we've discussed.`,
          speakerNotes: `Distribute the exercise handout. Group students strategically. Visit each group briefly to check progress. Prepare to facilitate the debrief.`,
          activities: ['Group problem-solving', 'Solution presentation'],
        },
        {
          id: 'seg-6',
          title: 'Summary & Takeaways',
          duration: 5,
          type: 'summary',
          content: `Let's recap what we've covered today:\n\n✓ ${brief.mainGoals?.[0] || 'First learning objective'}\n✓ ${brief.mainGoals?.[1] || 'Second learning objective'}\n✓ ${brief.mainGoals?.[2] || 'Third learning objective'}\n\nFor next time, consider how you might apply these concepts in your own context.`,
          speakerNotes: `Return to the learning objectives slide. Highlight connections between concepts. Preview what's coming next. Leave time for final questions.`,
          visualElements: ['Summary slide', 'Next steps slide'],
        },
      ];
    };

    const simulateActivityGeneration = async (): Promise<Activity[]> => {
      const brief = lecturePackage?.brief;
      if (!brief) return [];

      // Simulate progress updates with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      for (let i = 0; i <= 100; i += 15) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === 'pedagogy-designer' ? { ...agent, progress: i } : agent
          )
        );
      }

      return [
        {
          id: 'act-1',
          name: 'Opening Poll',
          type: 'poll',
          duration: 2,
          instructions: `Quick poll: On a scale of 1-5, how familiar are you with ${brief.topic}? Use your phones to respond.`,
          materials: ['Polling software link', 'QR code slide'],
          expectedOutcomes: ['Gauge prior knowledge', 'Engage students immediately'],
          facilitation: 'Display results in real-time. Use to calibrate your pacing.',
        },
        {
          id: 'act-2',
          name: 'Think-Pair-Share: Connecting Concepts',
          type: 'think-pair-share',
          duration: 5,
          instructions: `Think: How do these concepts connect to what you already know? (1 min)\nPair: Share your thoughts with a neighbor (2 min)\nShare: Let's hear from a few pairs (2 min)`,
          materials: ['Timer display'],
          expectedOutcomes: ['Deep processing of material', 'Peer learning', 'Active engagement'],
          facilitation: 'Circulate during pair time. Note interesting responses to call on.',
        },
        {
          id: 'act-3',
          name: 'Case Analysis',
          type: 'problem-solving',
          duration: 8,
          instructions: `In your groups, analyze the following case using the framework we discussed. Identify: (1) Key issues, (2) Applicable principles, (3) Your recommendation.`,
          materials: ['Case study handout', 'Analysis worksheet'],
          expectedOutcomes: ['Application of concepts', 'Collaborative learning', 'Critical thinking'],
          facilitation: 'Assign roles within groups (recorder, presenter, timekeeper). Provide scaffolding questions if groups get stuck.',
        },
        {
          id: 'act-4',
          name: 'Minute Paper',
          type: 'reflection',
          duration: 3,
          instructions: `Take one minute to write: What was the most important concept you learned today? What question do you still have?`,
          materials: ['Index cards or digital form'],
          expectedOutcomes: ['Metacognitive reflection', 'Formative feedback for instructor'],
          facilitation: 'Collect responses. Use to inform next session or follow-up.',
        },
      ];
    };

    generateContent();
  }, [sessionId, lecturePackage, handleError]);

  const retryGeneration = () => {
    setIsGenerating(true);
    setDevelopmentData(null);
    clearError();
    setAgents([
      {
        id: 'content-developer',
        name: 'Content Developer',
        description: 'Creating lecture content and speaker notes',
        status: 'pending',
        progress: 0,
      },
      {
        id: 'pedagogy-designer',
        name: 'Pedagogy Designer',
        description: 'Designing interactive activities',
        status: 'pending',
        progress: 0,
      },
    ]);
  };

  const handleApprove = () => {
    approveCheckpoint('development', true);
  };

  const handleRevision = (feedback: string) => {
    approveCheckpoint('development', false, feedback);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'think-pair-share':
        return UserGroupIcon;
      case 'poll':
        return ChatBubbleLeftRightIcon;
      case 'problem-solving':
        return BeakerIcon;
      case 'reflection':
        return PencilSquareIcon;
      default:
        return LightBulbIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'introduction':
        return 'bg-brand-navy/10 text-brand-navy';
      case 'content':
        return 'bg-scholarly-sage/10 text-scholarly-sage';
      case 'activity':
        return 'bg-brand-gold/10 text-brand-gold';
      case 'summary':
        return 'bg-scholarly-terracotta/10 text-scholarly-terracotta';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Error state - show error display with retry
  if (error && !isGenerating) {
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

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card p-8 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-terracotta/10 mb-4">
            <DocumentTextIcon className="h-8 w-8 text-scholarly-terracotta" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
            Phase 3: Parallel Development
          </h2>
          <p className="text-brand-text mb-2">
            Content Developer and Pedagogy Designer working in parallel
          </p>
          <p className="text-sm text-brand-text-light">
            Estimated time: 3-4 minutes
          </p>
        </div>

        <AgentProgress agents={agents} />

        <div className="mt-8 p-4 bg-brand-bg rounded-lg">
          <p className="text-sm text-brand-text-light text-center">
            Two agents are working simultaneously to create comprehensive content and engaging activities...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!developmentData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-brand-navy mb-2">
            Generation Failed
          </h3>
          <p className="text-brand-text mb-6">
            Failed to generate content. Please try again.
          </p>
          <button
            onClick={retryGeneration}
            className="px-6 py-3 bg-brand-navy text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            Retry Generation
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-terracotta/10 mb-4">
          <DocumentTextIcon className="h-8 w-8 text-scholarly-terracotta" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
          Phase 3: Content Development
        </h2>
        <p className="text-brand-text mb-6">
          Review the lecture content and interactive activities
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <DocumentTextIcon className="h-5 w-5 text-scholarly-terracotta flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Segments</p>
              <p className="text-sm font-medium text-brand-navy">
                {developmentData.segments.length} created
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <LightBulbIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Activities</p>
              <p className="text-sm font-medium text-brand-navy">
                {developmentData.activities.length} designed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <ClockIcon className="h-5 w-5 text-scholarly-sage flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Duration</p>
              <p className="text-sm font-medium text-brand-navy">
                {developmentData.segments.reduce((sum, seg) => sum + seg.duration, 0)} minutes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <UserGroupIcon className="h-5 w-5 text-scholarly-wine flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Interactive</p>
              <p className="text-sm font-medium text-brand-navy">
                {developmentData.segments.filter((s) => s.type === 'activity').length} segments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-white rounded-xl p-4 border border-brand-border-subtle">
        <AgentProgress agents={agents} layout="horizontal" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-brand-border-subtle overflow-hidden shadow-card">
        <div className="flex border-b border-brand-border-subtle bg-brand-bg/30">
          <button
            onClick={() => setActiveTab('segments')}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'segments'
                ? 'text-brand-navy bg-white'
                : 'text-brand-text-light hover:text-brand-navy hover:bg-white/50'
            }`}
          >
            {activeTab === 'segments' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-navy"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <DocumentTextIcon className="h-5 w-5" />
            <span>Lecture Segments</span>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              activeTab === 'segments'
                ? 'bg-brand-navy/10 text-brand-navy'
                : 'bg-brand-bg text-brand-text-light'
            }`}>
              {developmentData.segments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'activities'
                ? 'text-brand-navy bg-white'
                : 'text-brand-text-light hover:text-brand-navy hover:bg-white/50'
            }`}
          >
            {activeTab === 'activities' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-navy"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <LightBulbIcon className="h-5 w-5" />
            <span>Activities</span>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              activeTab === 'activities'
                ? 'bg-brand-gold/10 text-brand-gold'
                : 'bg-brand-bg text-brand-text-light'
            }`}>
              {developmentData.activities.length}
            </span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'segments' && (
            <div className="space-y-4">
              {developmentData.segments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-brand-border-subtle rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedSegment(expandedSegment === segment.id ? null : segment.id)
                    }
                    className="w-full flex items-center justify-between p-5 hover:bg-brand-bg/30 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-navy to-brand-navy/80 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                        {index + 1}
                      </span>
                      <div className="text-left">
                        <h4 className="font-semibold text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                          {segment.title}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1.5">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${getTypeColor(segment.type)}`}>
                            {segment.type}
                          </span>
                          <span className="text-xs text-brand-text-light flex items-center font-medium">
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            {segment.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedSegment === segment.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-brand-navy" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-brand-text-light group-hover:text-brand-navy transition-colors" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedSegment === segment.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-brand-border-subtle"
                      >
                        <div className="p-6 space-y-4 bg-brand-bg/30">
                          <div>
                            <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                              Content
                            </h5>
                            <div className="prose prose-sm max-w-none text-brand-text">
                              {segment.content.split('\n').map((para, i) => (
                                <p key={i} className="mb-2">{para}</p>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-brand-border-subtle">
                            <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                              Speaker Notes
                            </h5>
                            <p className="text-sm text-brand-text italic bg-brand-gold/5 p-3 rounded-lg border-l-2 border-brand-gold">
                              {segment.speakerNotes}
                            </p>
                          </div>

                          {segment.visualElements && segment.visualElements.length > 0 && (
                            <div className="pt-4 border-t border-brand-border-subtle">
                              <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                                Visual Elements
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {segment.visualElements.map((element, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 text-xs bg-white border border-brand-border-subtle rounded-full"
                                  >
                                    {element}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              {developmentData.activities.map((activity, index) => {
                const IconComponent = getTypeIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-brand-border-subtle rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedActivity(expandedActivity === activity.id ? null : activity.id)
                      }
                      className="w-full flex items-center justify-between p-5 hover:bg-brand-bg/30 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold/80 flex items-center justify-center shadow-sm">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-brand-navy group-hover:text-brand-navy/80 transition-colors">
                            {activity.name}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1.5">
                            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-brand-gold/10 text-brand-gold capitalize">
                              {activity.type.replace('-', ' ')}
                            </span>
                            <span className="text-xs text-brand-text-light flex items-center font-medium">
                              <ClockIcon className="h-3.5 w-3.5 mr-1" />
                              {activity.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedActivity === activity.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-brand-navy" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-brand-text-light group-hover:text-brand-navy transition-colors" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedActivity === activity.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-brand-border-subtle"
                        >
                          <div className="p-6 space-y-4 bg-brand-bg/30">
                            <div>
                              <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                                Instructions
                              </h5>
                              <p className="text-sm text-brand-text">{activity.instructions}</p>
                            </div>

                            {activity.materials && activity.materials.length > 0 && (
                              <div className="pt-4 border-t border-brand-border-subtle">
                                <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                                  Materials Needed
                                </h5>
                                <ul className="list-disc list-inside text-sm text-brand-text">
                                  {activity.materials.map((material, i) => (
                                    <li key={i}>{material}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="pt-4 border-t border-brand-border-subtle">
                              <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                                Expected Outcomes
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {activity.expectedOutcomes.map((outcome, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 text-xs bg-scholarly-sage/10 text-scholarly-sage rounded-full"
                                  >
                                    {outcome}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-brand-border-subtle">
                              <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                                Facilitation Tips
                              </h5>
                              <p className="text-sm text-brand-text italic bg-brand-gold/5 p-3 rounded-lg border-l-2 border-brand-gold">
                                {activity.facilitation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Checkpoint Review */}
      <CheckpointReview
        title="Content Review"
        description="Review the lecture segments and activities before proceeding to visual design."
        onApprove={handleApprove}
        onRequestRevision={handleRevision}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {developmentData.segments.length}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Segments</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {developmentData.activities.length}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Activities</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {developmentData.segments.reduce((sum, seg) => sum + seg.duration, 0)}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Total Minutes</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {developmentData.segments.filter((s) => s.type === 'activity').length}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Interactive</p>
          </div>
        </div>
      </CheckpointReview>
    </motion.div>
  );
};

export default DevelopmentPhase;
