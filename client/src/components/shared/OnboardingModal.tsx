import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Teaching Assistant',
      subtitle: 'Your evidence-based teaching companion',
      description: 'We help university instructors design better courses using pedagogical research and AI assistance. Every tool is grounded in learning science.',
      icon: AcademicCapIcon,
      color: 'scholarly-sage',
      features: [
        '16 pedagogical features backed by 50+ research studies',
        'Specialized AI agents for different teaching tasks',
        'Generate lectures, assessments, and activities',
        'All tools work independently or together',
      ],
    },
    {
      title: 'Two Ways to Work',
      subtitle: 'Choose your approach',
      description: 'You can use individual tools for quick tasks, or follow the full Lecture Builder workflow for comprehensive course design.',
      icon: RocketLaunchIcon,
      color: 'scholarly-terracotta',
      approaches: [
        {
          name: 'Quick Tools',
          icon: SparklesIcon,
          desc: 'Jump straight to any feature from the dashboard. Perfect for generating specific materials like polls, case studies, or review schedules.',
        },
        {
          name: 'Lecture Builder',
          icon: BookOpenIcon,
          desc: 'Follow our 5-phase guided workflow to create a complete lecture package with objectives, content, activities, and slides.',
        },
      ],
    },
    {
      title: 'Four Categories',
      subtitle: 'Organized by teaching goals',
      description: 'All our tools fall into four main categories to match your workflow.',
      icon: ChartBarIcon,
      color: 'scholarly-slate',
      categories: [
        {
          name: 'Course Planning',
          icon: AcademicCapIcon,
          desc: 'Syllabus analysis, learning outcomes, spaced repetition, cognitive load',
          color: 'scholarly-sage',
        },
        {
          name: 'Teaching Delivery',
          icon: UserGroupIcon,
          desc: 'Lecture builder, active learning, case studies, collaborative activities',
          color: 'scholarly-terracotta',
        },
        {
          name: 'Assessment',
          icon: BeakerIcon,
          desc: 'Question generator, formative polls, misconception tracking, transfer exercises',
          color: 'scholarly-slate',
        },
        {
          name: 'Analytics',
          icon: ChartBarIcon,
          desc: 'Growth mindset feedback, student perspective, learning science recommendations',
          color: 'scholarly-wine',
        },
      ],
    },
    {
      title: 'Tips for Success',
      subtitle: 'Get the most from the platform',
      description: 'Here are some best practices to help you create effective educational materials.',
      icon: SparklesIcon,
      color: 'brand-gold',
      tips: [
        'Start specific: The more detail you provide, the better the AI can help',
        'Use "Understand the Science" tabs to learn the pedagogy behind each feature',
        'Export and customize: AI outputs are starting points, not final products',
        'Combine tools: Use multiple features together for comprehensive design',
        'Iterate: Generate, review, refine. Don\'t expect perfection on first try',
      ],
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete in localStorage
      localStorage.setItem('teaching-app-onboarding-complete', 'true');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('teaching-app-onboarding-complete', 'true');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleSkip}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-brand-bg-warm to-brand-bg px-8 pt-8 pb-6">
                  <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 text-brand-text-light hover:text-brand-navy transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl bg-${currentStepData.color}/10`}>
                      <currentStepData.icon className={`h-8 w-8 text-${currentStepData.color}`} />
                    </div>
                    <div>
                      <Dialog.Title className="font-serif text-2xl font-semibold text-brand-navy">
                        {currentStepData.title}
                      </Dialog.Title>
                      <p className="text-sm text-brand-text-light mt-1">{currentStepData.subtitle}</p>
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex items-center space-x-2 mt-6">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-8 bg-brand-gold'
                            : index < currentStep
                            ? 'w-2 bg-brand-gold/50'
                            : 'w-2 bg-brand-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 min-h-[300px]">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-brand-text mb-6">{currentStepData.description}</p>

                    {currentStep === 0 && currentStepData.features && (
                      <div className="space-y-3">
                        {currentStepData.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-scholarly-sage flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-brand-text">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep === 1 && currentStepData.approaches && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentStepData.approaches.map((approach, index) => (
                          <div
                            key={index}
                            className="p-5 bg-brand-bg rounded-xl border border-brand-border-subtle"
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <approach.icon className="h-6 w-6 text-brand-navy" />
                              <h3 className="font-medium text-brand-navy">{approach.name}</h3>
                            </div>
                            <p className="text-sm text-brand-text-light">{approach.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep === 2 && currentStepData.categories && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentStepData.categories.map((category, index) => (
                          <div
                            key={index}
                            className={`p-4 bg-${category.color}/5 rounded-lg border border-${category.color}/20`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <category.icon className={`h-5 w-5 text-${category.color}`} />
                              <h3 className="font-medium text-brand-navy text-sm">{category.name}</h3>
                            </div>
                            <p className="text-xs text-brand-text-light">{category.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentStep === 3 && currentStepData.tips && (
                      <div className="space-y-3">
                        {currentStepData.tips.map((tip, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-brand-gold">{index + 1}</span>
                            </div>
                            <span className="text-sm text-brand-text">{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-brand-bg border-t border-brand-border-subtle flex items-center justify-between">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-brand-text-light hover:text-brand-navy transition-colors"
                  >
                    Skip tour
                  </button>

                  <div className="flex items-center space-x-3">
                    {currentStep > 0 && (
                      <button
                        onClick={handlePrevious}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-navy hover:bg-white rounded-lg transition-colors"
                      >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center px-6 py-2.5 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-navy-light transition-colors"
                    >
                      {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OnboardingModal;
