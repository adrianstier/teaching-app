import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLecture } from '../../context/LectureContext';
import AgentProgress, { AgentInfo } from '../shared/AgentProgress';
import ErrorDisplay from '../shared/ErrorDisplay';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import {
  DocumentArrowDownIcon,
  FolderArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  LightBulbIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface TimingChecklistItem {
  time: string;
  action: string;
  materials?: string[];
}

const IntegrationPhase: React.FC = () => {
  const { downloadPackage, lecturePackage, sessionId } = useLecture();
  const [isGenerating, setIsGenerating] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [instructorGuide, setInstructorGuide] = useState<string>('');
  const [timingChecklist, setTimingChecklist] = useState<TimingChecklistItem[]>([]);
  const { error, handleError, clearError } = useErrorHandler();
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'integration',
      name: 'Integration Agent',
      description: 'Assembling final lecture package',
      status: 'running',
      progress: 0,
    },
  ]);

  useEffect(() => {
    const generateIntegration = async () => {
      if (!sessionId || !lecturePackage?.brief) return;

      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === 'integration' ? { ...agent, progress: i } : agent
            )
          );
        }

        const brief = lecturePackage.brief;

      // Generate instructor guide
      const guide = `
# Instructor Guide: ${brief.title}

## Overview
This guide provides comprehensive instructions for delivering "${brief.title}" effectively. The lecture is designed for ${brief.audienceLevel} level students and covers ${brief.topic}.

## Pre-Session Preparation
1. **Review Materials**: Familiarize yourself with all slides and speaker notes
2. **Test Technology**: Ensure projector, microphone, and polling software work
3. **Prepare Handouts**: Print case studies and activity worksheets
4. **Set Up Room**: Arrange seating for group activities if possible

## Key Learning Objectives
${brief.mainGoals?.map((goal, i) => `${i + 1}. ${goal}`).join('\n') || '- Review objectives before session'}

## Delivery Tips
- **Pacing**: Monitor time carefully, especially during activities
- **Engagement**: Use names, make eye contact, encourage questions
- **Flexibility**: Be prepared to adjust based on student responses
- **Energy**: Start strong to capture attention

## Common Challenges & Solutions
- **Low participation**: Use think-pair-share to lower barriers
- **Running out of time**: Have clear priorities for what to cut
- **Technical issues**: Prepare backup activities that don't require technology
- **Confused students**: Build in multiple check-for-understanding moments

## Post-Session
1. Review minute papers for common questions
2. Note what worked and what to improve
3. Follow up on unanswered questions
4. Update materials based on experience
      `.trim();

      setInstructorGuide(guide);

      // Generate timing checklist
      const checklist: TimingChecklistItem[] = [
        { time: '0:00', action: 'Welcome and introduction', materials: ['Title slide'] },
        { time: '0:02', action: 'Present learning objectives', materials: ['Objectives slide'] },
        { time: '0:05', action: 'Opening poll to gauge prior knowledge', materials: ['Polling software'] },
        { time: '0:08', action: 'Core foundations content', materials: ['Content slides 4-5'] },
        { time: '0:18', action: 'Think-Pair-Share activity', materials: ['Timer', 'Discussion prompt slide'] },
        { time: '0:25', action: 'Deep dive content', materials: ['Content slides 6-7'] },
        { time: '0:35', action: 'Case study analysis', materials: ['Case study handout', 'Group worksheet'] },
        { time: '0:43', action: 'Group presentations and debrief' },
        { time: '0:48', action: 'Key takeaways and summary', materials: ['Summary slide'] },
        { time: '0:50', action: 'Questions and discussion', materials: ['Q&A slide'] },
        { time: `${brief.duration}:00`, action: 'Session ends' },
      ];

        setTimingChecklist(checklist);

        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'completed', progress: 100 }))
        );
      } catch (err) {
        console.error('Integration generation error:', err);
        handleError(err);
        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'error', progress: 0 }))
        );
      } finally {
        setIsGenerating(false);
      }
    };

    generateIntegration();
  }, [sessionId, lecturePackage, handleError]);

  const retryGeneration = () => {
    setIsGenerating(true);
    setInstructorGuide('');
    setTimingChecklist([]);
    clearError();
    setAgents([
      {
        id: 'integration',
        name: 'Integration Agent',
        description: 'Assembling final lecture package',
        status: 'running',
        progress: 0,
      },
    ]);
  };

  const packageContents = [
    {
      icon: DocumentTextIcon,
      title: 'Lecture Brief',
      description: 'Complete specifications and metadata',
      status: !!lecturePackage?.brief,
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning Objectives',
      description: "Bloom's taxonomy aligned objectives",
      status: true,
    },
    {
      icon: SparklesIcon,
      title: 'Concept Map',
      description: 'Knowledge structure and relationships',
      status: true,
    },
    {
      icon: BookOpenIcon,
      title: 'Content Segments',
      description: 'Detailed content with speaker notes',
      status: true,
    },
    {
      icon: LightBulbIcon,
      title: 'Interactive Activities',
      description: 'Engagement activities and assessments',
      status: true,
    },
    {
      icon: PresentationChartLineIcon,
      title: 'Slide Specifications',
      description: 'Visual design and layouts',
      status: true,
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Instructor Guide',
      description: 'Delivery tips and facilitation notes',
      status: true,
    },
    {
      icon: ClockIcon,
      title: 'Timing Checklist',
      description: 'Minute-by-minute pacing guide',
      status: true,
    },
  ];

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-sage/10 mb-4">
            <FolderArrowDownIcon className="h-8 w-8 text-scholarly-sage" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
            Phase 5: Integration
          </h2>
          <p className="text-brand-text mb-2">Assembling your complete lecture package</p>
          <p className="text-sm text-brand-text-light">
            Estimated time: 1-2 minutes
          </p>
        </div>

        <AgentProgress agents={agents} />

        <div className="mt-8 p-4 bg-brand-bg rounded-lg">
          <p className="text-sm text-brand-text-light text-center">
            Compiling all components into a cohesive lecture package...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!instructorGuide || !timingChecklist.length) {
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
            Integration Failed
          </h3>
          <p className="text-brand-text mb-6">
            Failed to assemble the complete package. Please try again.
          </p>
          <button
            onClick={retryGeneration}
            className="px-6 py-3 bg-brand-navy text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            Retry Integration
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
      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-scholarly-sage/10 mb-4"
        >
          <CheckCircleIcon className="h-10 w-10 text-scholarly-sage" />
        </motion.div>
        <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
          Your Lecture Package is Ready
        </h2>
        <p className="text-brand-text">
          All components have been generated and assembled
        </p>
      </div>

      {/* Agent Status */}
      <div className="bg-white rounded-xl p-4 border border-brand-border-subtle">
        <AgentProgress agents={agents} layout="horizontal" />
      </div>

      {/* Package Contents */}
      <div className="bg-white rounded-xl border border-brand-border-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border-subtle bg-brand-bg/50">
          <h3 className="font-medium text-brand-navy">Package Contents</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {packageContents.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-brand-border-subtle bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg bg-scholarly-sage/10">
                    <item.icon className="h-4 w-4 text-scholarly-sage" />
                  </div>
                  <CheckCircleIcon className="h-4 w-4 text-scholarly-sage" />
                </div>
                <h4 className="text-sm font-medium text-brand-navy">{item.title}</h4>
                <p className="text-xs text-brand-text-light mt-1">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Lecture Overview */}
        <div className="bg-white rounded-xl border border-brand-border-subtle overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'overview' ? null : 'overview')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-bg/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-5 w-5 text-brand-navy" />
              <span className="font-medium text-brand-navy">Lecture Overview</span>
            </div>
            {expandedSection === 'overview' ? (
              <ChevronUpIcon className="h-5 w-5 text-brand-text-light" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-brand-text-light" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'overview' && lecturePackage?.brief && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-brand-border-subtle"
              >
                <div className="p-6 bg-brand-bg/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-brand-text-light uppercase tracking-wide mb-1">Title</p>
                      <p className="text-sm font-medium text-brand-navy">{lecturePackage.brief.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text-light uppercase tracking-wide mb-1">Topic</p>
                      <p className="text-sm font-medium text-brand-navy">{lecturePackage.brief.topic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text-light uppercase tracking-wide mb-1">Duration</p>
                      <p className="text-sm font-medium text-brand-navy">{lecturePackage.brief.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text-light uppercase tracking-wide mb-1">Level</p>
                      <p className="text-sm font-medium text-brand-navy capitalize">{lecturePackage.brief.audienceLevel}</p>
                    </div>
                  </div>
                  {lecturePackage.brief.mainGoals && (
                    <div className="mt-6">
                      <p className="text-xs text-brand-text-light uppercase tracking-wide mb-2">Learning Goals</p>
                      <ul className="space-y-1">
                        {lecturePackage.brief.mainGoals.map((goal, i) => (
                          <li key={i} className="text-sm text-brand-text flex items-start">
                            <span className="text-scholarly-sage mr-2">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timing Checklist */}
        <div className="bg-white rounded-xl border border-brand-border-subtle overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'timing' ? null : 'timing')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-bg/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-5 w-5 text-brand-navy" />
              <span className="font-medium text-brand-navy">Timing Checklist</span>
            </div>
            {expandedSection === 'timing' ? (
              <ChevronUpIcon className="h-5 w-5 text-brand-text-light" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-brand-text-light" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'timing' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-brand-border-subtle"
              >
                <div className="p-6 bg-brand-bg/30">
                  <div className="space-y-3">
                    {timingChecklist.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-3 bg-white rounded-lg border border-brand-border-subtle"
                      >
                        <span className="flex-shrink-0 w-16 text-sm font-mono font-medium text-brand-navy">
                          {item.time}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-brand-text">{item.action}</p>
                          {item.materials && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.materials.map((material, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-[10px] bg-brand-gold/10 text-brand-gold rounded"
                                >
                                  {material}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructor Guide */}
        <div className="bg-white rounded-xl border border-brand-border-subtle overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'guide' ? null : 'guide')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-brand-bg/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ClipboardDocumentListIcon className="h-5 w-5 text-brand-navy" />
              <span className="font-medium text-brand-navy">Instructor Guide</span>
            </div>
            {expandedSection === 'guide' ? (
              <ChevronUpIcon className="h-5 w-5 text-brand-text-light" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-brand-text-light" />
            )}
          </button>
          <AnimatePresence>
            {expandedSection === 'guide' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-brand-border-subtle"
              >
                <div className="p-6 bg-brand-bg/30">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-brand-text font-sans bg-white p-4 rounded-lg border border-brand-border-subtle">
                      {instructorGuide}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Download Actions */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 rounded-2xl p-8 text-center">
        <h3 className="font-serif text-xl font-semibold text-white mb-2">
          Download Your Package
        </h3>
        <p className="text-white/80 text-sm mb-6">
          Choose your preferred format to download the complete lecture package
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => downloadPackage('zip')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-brand-navy font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            <FolderArrowDownIcon className="h-5 w-5" />
            <span>Download ZIP Package</span>
          </button>
          <button
            onClick={() => downloadPackage('json')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Download JSON Data</span>
          </button>
        </div>
      </div>

      {/* Success Stats */}
      <div className="bg-white rounded-xl border border-brand-border-subtle p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <p className="text-3xl font-serif font-semibold text-brand-navy">5</p>
            <p className="text-xs text-brand-text-light mt-1">Phases Completed</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-brand-navy">5</p>
            <p className="text-xs text-brand-text-light mt-1">AI Agents Used</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-brand-navy">
              {lecturePackage?.brief?.duration || 50}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Minutes of Content</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-brand-navy">10</p>
            <p className="text-xs text-brand-text-light mt-1">Slides Generated</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-semibold text-brand-navy">8</p>
            <p className="text-xs text-brand-text-light mt-1">Components Ready</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntegrationPhase;
