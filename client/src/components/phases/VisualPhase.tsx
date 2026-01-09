import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLecture } from '../../context/LectureContext';
import CheckpointReview from '../shared/CheckpointReview';
import AgentProgress, { AgentInfo } from '../shared/AgentProgress';
import ErrorDisplay from '../shared/ErrorDisplay';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import {
  PresentationChartLineIcon,
  RectangleGroupIcon,
  PhotoIcon,
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface SlideContent {
  mainText?: string;
  bulletPoints?: string[];
  images?: { description: string; placement: string; caption?: string }[];
  diagrams?: { type: string; elements: string[]; relationships: string[] }[];
}

interface SlideSpecification {
  slideNumber: number;
  title: string;
  layout: string;
  content: SlideContent;
  speakerNotes: string;
  animations?: string[];
  timing: number;
}

const VisualPhase: React.FC = () => {
  const { lecturePackage, approveCheckpoint, isLoading, sessionId } = useLecture();
  const [slides, setSlides] = useState<SlideSpecification[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const { error, handleError, clearError } = useErrorHandler();
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'visual-designer',
      name: 'Visual Designer',
      description: 'Creating slide specifications and layouts',
      status: 'running',
      progress: 0,
    },
  ]);

  useEffect(() => {
    const generateSlides = async () => {
      if (!sessionId || !lecturePackage?.brief) return;

      try {
        // Simulate progress
        for (let i = 0; i <= 100; i += 5) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === 'visual-designer' ? { ...agent, progress: i } : agent
            )
          );
        }

        const brief = lecturePackage.brief;

      // Generate mock slides
      const mockSlides: SlideSpecification[] = [
        {
          slideNumber: 1,
          title: brief.title || 'Untitled Lecture',
          layout: 'title',
          content: {
            mainText: brief.title,
            bulletPoints: [
              `Topic: ${brief.topic}`,
              `Duration: ${brief.duration} minutes`,
              `Level: ${brief.audienceLevel}`,
            ],
          },
          speakerNotes:
            'Welcome students. Introduce yourself and the topic. Set expectations for the session.',
          timing: 60,
        },
        {
          slideNumber: 2,
          title: 'Learning Objectives',
          layout: 'content',
          content: {
            mainText: 'By the end of this session, you will be able to:',
            bulletPoints: brief.mainGoals || ['Understand key concepts', 'Apply principles'],
          },
          speakerNotes:
            'Review each objective clearly. Emphasize what students will gain. Connect to their existing knowledge.',
          timing: 90,
        },
        {
          slideNumber: 3,
          title: 'Roadmap',
          layout: 'process',
          content: {
            mainText: "Today's Journey",
            bulletPoints: [
              '1. Foundation & Context',
              '2. Core Principles',
              '3. Interactive Discussion',
              '4. Deep Dive',
              '5. Practice & Application',
              '6. Summary & Next Steps',
            ],
            diagrams: [
              {
                type: 'timeline',
                elements: ['Intro', 'Content', 'Activity', 'Deep Dive', 'Practice', 'Summary'],
                relationships: ['leads-to'],
              },
            ],
          },
          speakerNotes:
            'Give students a clear mental map of where we are going. This helps with cognitive load management.',
          timing: 60,
        },
        {
          slideNumber: 4,
          title: 'Core Foundations',
          layout: 'two-column',
          content: {
            mainText: 'Understanding the Basics',
            bulletPoints: [
              'Key terminology and definitions',
              'Historical context',
              'Fundamental principles',
              'Why this matters',
            ],
            images: [
              {
                description: 'Concept diagram showing relationships',
                placement: 'right-column',
                caption: 'Key concepts and their connections',
              },
            ],
          },
          speakerNotes:
            'Use concrete examples. Pause after key points. Check for questions before moving on.',
          timing: 180,
        },
        {
          slideNumber: 5,
          title: 'Think-Pair-Share',
          layout: 'content',
          content: {
            mainText: 'Interactive Reflection',
            bulletPoints: [
              'THINK: How does this connect to your experience? (1 min)',
              'PAIR: Discuss with a neighbor (2 min)',
              'SHARE: Volunteer insights (2 min)',
            ],
            images: [
              {
                description: 'Timer display',
                placement: 'bottom-right',
              },
            ],
          },
          speakerNotes:
            'Circulate during pair discussions. Note interesting perspectives. Keep strict time.',
          animations: ['Timer countdown'],
          timing: 300,
        },
        {
          slideNumber: 6,
          title: 'Key Principles',
          layout: 'content',
          content: {
            mainText: 'Deep Dive into Core Concepts',
            bulletPoints: [
              'Principle 1: Foundation',
              'Principle 2: Application',
              'Principle 3: Integration',
            ],
            diagrams: [
              {
                type: 'pyramid',
                elements: ['Foundation', 'Application', 'Integration'],
                relationships: ['builds-on'],
              },
            ],
          },
          speakerNotes:
            'This is the densest section. Use visuals extensively. Check for understanding midway.',
          timing: 300,
        },
        {
          slideNumber: 7,
          title: 'Real-World Application',
          layout: 'image-focus',
          content: {
            mainText: 'Case Study',
            bulletPoints: ['Context', 'Challenge', 'Solution', 'Outcome'],
            images: [
              {
                description: 'Case study illustration',
                placement: 'center',
                caption: 'How these principles apply in practice',
              },
            ],
          },
          speakerNotes:
            'Connect theory to practice. Use a relatable example. Ask students to identify the principles at work.',
          timing: 240,
        },
        {
          slideNumber: 8,
          title: 'Group Activity',
          layout: 'content',
          content: {
            mainText: 'Practice Exercise',
            bulletPoints: [
              'Form groups of 3-4',
              'Analyze the provided scenario',
              'Apply the framework we discussed',
              'Prepare to share your approach',
            ],
          },
          speakerNotes:
            'Distribute handouts. Assign roles. Visit each group briefly. Prepare debrief questions.',
          animations: ['Timer display'],
          timing: 480,
        },
        {
          slideNumber: 9,
          title: 'Key Takeaways',
          layout: 'content',
          content: {
            mainText: 'What We Learned Today',
            bulletPoints: brief.mainGoals?.map((goal) => `✓ ${goal}`) || ['Key learning points'],
          },
          speakerNotes:
            'Return to objectives. Highlight connections. Preview next session if applicable.',
          timing: 120,
        },
        {
          slideNumber: 10,
          title: 'Questions & Discussion',
          layout: 'title',
          content: {
            mainText: 'Thank You!',
            bulletPoints: ['Questions?', 'Comments?', 'Reflections?'],
          },
          speakerNotes:
            'Open floor for questions. Be prepared with follow-up resources. Thank students for participation.',
          timing: 300,
        },
      ];

        setSlides(mockSlides);
        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'completed', progress: 100 }))
        );
      } catch (err) {
        console.error('Slide generation error:', err);
        handleError(err);
        setAgents((prev) =>
          prev.map((agent) => ({ ...agent, status: 'error', progress: 0 }))
        );
      } finally {
        setIsGenerating(false);
      }
    };

    generateSlides();
  }, [sessionId, lecturePackage, handleError]);

  const retryGeneration = () => {
    setIsGenerating(true);
    setSlides([]);
    clearError();
    setAgents([
      {
        id: 'visual-designer',
        name: 'Visual Designer',
        description: 'Creating slide specifications and layouts',
        status: 'running',
        progress: 0,
      },
    ]);
  };

  const handleApprove = () => {
    approveCheckpoint('visual', true);
  };

  const handleRevision = (feedback: string) => {
    approveCheckpoint('visual', false, feedback);
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'title':
        return RectangleGroupIcon;
      case 'two-column':
        return Squares2X2Icon;
      case 'image-focus':
        return PhotoIcon;
      default:
        return PresentationChartLineIcon;
    }
  };

  const getLayoutColor = (layout: string) => {
    switch (layout) {
      case 'title':
        return 'bg-brand-navy text-white';
      case 'content':
        return 'bg-scholarly-sage/10 border-2 border-scholarly-sage/30';
      case 'two-column':
        return 'bg-brand-gold/10 border-2 border-brand-gold/30';
      case 'image-focus':
        return 'bg-scholarly-terracotta/10 border-2 border-scholarly-terracotta/30';
      case 'process':
        return 'bg-scholarly-wine/10 border-2 border-scholarly-wine/30';
      default:
        return 'bg-gray-100 border-2 border-gray-200';
    }
  };

  const currentSlide = slides[currentSlideIndex];

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-wine/10 mb-4">
            <PresentationChartLineIcon className="h-8 w-8 text-scholarly-wine" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
            Phase 4: Visual Design
          </h2>
          <p className="text-brand-text mb-2">Creating slide specifications and layouts</p>
          <p className="text-sm text-brand-text-light">
            Estimated time: 2-3 minutes
          </p>
        </div>

        <AgentProgress agents={agents} />

        <div className="mt-8 p-4 bg-brand-bg rounded-lg">
          <p className="text-sm text-brand-text-light text-center">
            The Visual Designer is crafting presentation slides optimized for learning...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!slides.length) {
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
            Failed to generate slide specifications. Please try again.
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
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-scholarly-wine/10 mb-4">
          <PresentationChartLineIcon className="h-8 w-8 text-scholarly-wine" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-brand-navy mb-2">
          Phase 4: Visual Design
        </h2>
        <p className="text-brand-text mb-6">Review the slide specifications for your lecture</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <PresentationChartLineIcon className="h-5 w-5 text-scholarly-wine flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Total Slides</p>
              <p className="text-sm font-medium text-brand-navy">{slides.length} created</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <ClockIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Duration</p>
              <p className="text-sm font-medium text-brand-navy">
                {Math.ceil(slides.reduce((sum, s) => sum + s.timing, 0) / 60)} minutes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <RectangleGroupIcon className="h-5 w-5 text-scholarly-sage flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Layouts</p>
              <p className="text-sm font-medium text-brand-navy">
                {new Set(slides.map((s) => s.layout)).size} types
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-brand-border-subtle">
            <PhotoIcon className="h-5 w-5 text-scholarly-terracotta flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-brand-text-light">Visuals</p>
              <p className="text-sm font-medium text-brand-navy">
                {slides.filter((s) => s.content.images?.length).length} slides
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-white rounded-xl p-4 border border-brand-border-subtle">
        <AgentProgress agents={agents} layout="horizontal" />
      </div>

      {/* View Toggle */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setViewMode('single')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'single'
              ? 'bg-brand-navy text-white'
              : 'bg-brand-bg text-brand-text hover:bg-brand-border'
          }`}
        >
          Single View
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'grid'
              ? 'bg-brand-navy text-white'
              : 'bg-brand-bg text-brand-text hover:bg-brand-border'
          }`}
        >
          Grid View
        </button>
      </div>

      {/* Slide Display */}
      {viewMode === 'single' && currentSlide && (
        <div className="bg-white rounded-xl border border-brand-border-subtle overflow-hidden">
          {/* Slide Preview */}
          <div className="p-8">
            <div
              className={`aspect-video rounded-xl p-8 flex flex-col ${getLayoutColor(currentSlide.layout)}`}
            >
              {/* Slide Content Preview */}
              <div className="flex-1 flex flex-col justify-center">
                <h3
                  className={`text-2xl font-serif font-semibold mb-4 ${
                    currentSlide.layout === 'title' ? 'text-white text-center' : 'text-brand-navy'
                  }`}
                >
                  {currentSlide.title}
                </h3>

                {currentSlide.content.mainText && currentSlide.layout !== 'title' && (
                  <p className="text-sm text-brand-text mb-4">{currentSlide.content.mainText}</p>
                )}

                {currentSlide.content.bulletPoints && (
                  <ul
                    className={`space-y-2 ${
                      currentSlide.layout === 'title' ? 'text-white/80 text-center' : ''
                    }`}
                  >
                    {currentSlide.content.bulletPoints.map((point, i) => (
                      <li
                        key={i}
                        className={`text-sm ${
                          currentSlide.layout === 'title' ? '' : 'flex items-start'
                        }`}
                      >
                        {currentSlide.layout !== 'title' && (
                          <span className="text-brand-gold mr-2">•</span>
                        )}
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {currentSlide.content.images && currentSlide.content.images.length > 0 && (
                  <div className="mt-4 p-4 bg-white/50 rounded-lg border border-dashed border-gray-300">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <PhotoIcon className="h-5 w-5" />
                      <span className="text-xs">
                        {currentSlide.content.images[0].description}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Number */}
              <div className="text-right mt-4">
                <span
                  className={`text-xs ${
                    currentSlide.layout === 'title' ? 'text-white/60' : 'text-brand-text-light'
                  }`}
                >
                  {currentSlide.slideNumber} / {slides.length}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-brand-text hover:text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlideIndex ? 'bg-brand-navy' : 'bg-brand-border'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-brand-text hover:text-brand-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Slide Details */}
          <div className="border-t border-brand-border-subtle p-6 bg-brand-bg/30">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                  Layout
                </h5>
                <div className="flex items-center space-x-2">
                  {React.createElement(getLayoutIcon(currentSlide.layout), {
                    className: 'h-4 w-4 text-brand-navy',
                  })}
                  <span className="text-sm text-brand-navy capitalize">{currentSlide.layout}</span>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                  Timing
                </h5>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-brand-navy" />
                  <span className="text-sm text-brand-navy">
                    {Math.floor(currentSlide.timing / 60)}:{String(currentSlide.timing % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2">
                  Animations
                </h5>
                <span className="text-sm text-brand-navy">
                  {currentSlide.animations?.length || 0} effects
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-2 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-1" />
                Speaker Notes
              </h5>
              <p className="text-sm text-brand-text italic bg-brand-gold/5 p-3 rounded-lg border-l-2 border-brand-gold">
                {currentSlide.speakerNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide, index) => (
            <motion.button
              key={slide.slideNumber}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setCurrentSlideIndex(index);
                setViewMode('single');
              }}
              className={`aspect-video rounded-lg p-4 text-left transition-all hover:shadow-lg ${getLayoutColor(slide.layout)} ${
                index === currentSlideIndex ? 'ring-2 ring-brand-navy ring-offset-2' : ''
              }`}
            >
              <div className="h-full flex flex-col">
                <h4
                  className={`text-xs font-medium truncate ${
                    slide.layout === 'title' ? 'text-white' : 'text-brand-navy'
                  }`}
                >
                  {slide.title}
                </h4>
                <div className="flex-1" />
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] ${
                      slide.layout === 'title' ? 'text-white/60' : 'text-brand-text-light'
                    }`}
                  >
                    Slide {slide.slideNumber}
                  </span>
                  <span
                    className={`text-[10px] ${
                      slide.layout === 'title' ? 'text-white/60' : 'text-brand-text-light'
                    }`}
                  >
                    {Math.floor(slide.timing / 60)}m
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Checkpoint Review */}
      <CheckpointReview
        title="Visual Design Review"
        description="Review the slide specifications before proceeding to final integration."
        onApprove={handleApprove}
        onRequestRevision={handleRevision}
        isLoading={isLoading}
      >
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">{slides.length}</p>
            <p className="text-xs text-brand-text-light mt-1">Total Slides</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {Math.ceil(slides.reduce((sum, s) => sum + s.timing, 0) / 60)}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Total Minutes</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {new Set(slides.map((s) => s.layout)).size}
            </p>
            <p className="text-xs text-brand-text-light mt-1">Layout Types</p>
          </div>
          <div className="p-4 bg-brand-bg rounded-lg">
            <p className="text-2xl font-serif font-semibold text-brand-navy">
              {slides.filter((s) => s.content.images?.length).length}
            </p>
            <p className="text-xs text-brand-text-light mt-1">With Visuals</p>
          </div>
        </div>
      </CheckpointReview>
    </motion.div>
  );
};

export default VisualPhase;
