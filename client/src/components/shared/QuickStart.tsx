import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  LightBulbIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface QuickStartTemplate {
  id: string;
  title: string;
  timeEstimate: string;
  description: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  steps: {
    label: string;
    path: string;
    action: string;
  }[];
  discipline?: string;
}

const templates: QuickStartTemplate[] = [
  {
    id: 'before-class',
    title: 'Prep Before Class',
    timeEstimate: '10 min',
    description: 'Quick preparation for an upcoming class session',
    icon: ClockIcon,
    steps: [
      { label: 'Generate quiz', path: '/formative-assessment', action: 'Create 3 quick polls' },
      { label: 'Review slides', path: '/cognitive-load', action: 'Analyze complexity' },
    ]
  },
  {
    id: 'after-lecture',
    title: 'Post-Lecture Review',
    timeEstimate: '5 min',
    description: 'Create follow-up materials after teaching',
    icon: ChatBubbleLeftRightIcon,
    steps: [
      { label: 'Exit ticket', path: '/formative-assessment', action: 'Generate exit ticket' },
      { label: 'Schedule review', path: '/spaced-repetition', action: 'Set up review schedule' },
    ]
  },
  {
    id: 'new-unit',
    title: 'Planning New Unit',
    timeEstimate: '20 min',
    description: 'Design a complete learning sequence',
    icon: BookOpenIcon,
    steps: [
      { label: 'Outcomes', path: '/learning-outcomes', action: 'Define learning objectives' },
      { label: 'Misconceptions', path: '/misconceptions', action: 'Identify common gaps' },
      { label: 'Activities', path: '/active-learning', action: 'Design active exercises' },
      { label: 'Assessment', path: '/exercise-generator', action: 'Create aligned questions' },
    ]
  },
  {
    id: 'struggling-students',
    title: 'Help Struggling Students',
    timeEstimate: '15 min',
    description: 'Create targeted intervention materials',
    icon: LightBulbIcon,
    steps: [
      { label: 'Diagnose', path: '/misconceptions', action: 'Create diagnostic questions' },
      { label: 'Scaffolds', path: '/cognitive-load', action: 'Generate worked examples' },
      { label: 'Practice', path: '/spaced-repetition', action: 'Set up retrieval practice' },
    ]
  },
  {
    id: 'case-discussion',
    title: 'Case Discussion Prep',
    timeEstimate: '15 min',
    description: 'Prepare for case-based learning session',
    icon: AcademicCapIcon,
    discipline: 'Business, Law, Medicine, Ethics',
    steps: [
      { label: 'Generate case', path: '/case-based', action: 'Create authentic scenario' },
      { label: 'Discussion Qs', path: '/elaborative', action: 'Prepare probing questions' },
      { label: 'Group setup', path: '/collaborative', action: 'Design group activity' },
    ]
  },
  {
    id: 'exam-review',
    title: 'Exam Review Session',
    timeEstimate: '10 min',
    description: 'Create effective review materials',
    icon: ChartBarIcon,
    steps: [
      { label: 'Practice test', path: '/exercise-generator', action: 'Generate varied questions' },
      { label: 'Self-assessment', path: '/metacognition', action: 'Create calibration exercises' },
    ]
  },
];

interface QuickStartProps {
  onClose?: () => void;
  isModal?: boolean;
}

const QuickStart: React.FC<QuickStartProps> = ({ onClose, isModal = false }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<QuickStartTemplate | null>(null);

  const content = (
    <div className={isModal ? '' : 'bg-white rounded-xl shadow-card border border-brand-border-subtle p-6'}>
      {isModal && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl font-semibold text-brand-navy">Quick Start</h2>
            <p className="text-sm text-brand-text mt-1">Choose a workflow based on your time and needs</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-brand-text-light hover:text-brand-navy transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {!isModal && (
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold text-brand-navy">Quick Start Workflows</h2>
          <p className="text-sm text-brand-text mt-1">Common tasks with estimated time</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="text-left p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all group"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
                <template.icon className="h-5 w-5 text-brand-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-brand-navy text-sm">{template.title}</h3>
                  <span className="text-xs text-brand-text-light flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {template.timeEstimate}
                  </span>
                </div>
                <p className="text-xs text-brand-text mt-1">{template.description}</p>
                {template.discipline && (
                  <p className="text-xs text-brand-gold mt-2">{template.discipline}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <selectedTemplate.icon className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-brand-navy">{selectedTemplate.title}</h3>
                  <p className="text-xs text-brand-text-light flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {selectedTemplate.timeEstimate}
                  </p>
                </div>
              </div>

              <p className="text-sm text-brand-text mb-4">{selectedTemplate.description}</p>

              <div className="space-y-3">
                {selectedTemplate.steps.map((step, index) => (
                  <Link
                    key={index}
                    to={step.path}
                    onClick={() => {
                      setSelectedTemplate(null);
                      if (onClose) onClose();
                    }}
                    className="flex items-center space-x-3 p-3 bg-brand-bg/50 rounded-lg hover:bg-brand-gold/10 transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-navy group-hover:text-brand-gold transition-colors">
                        {step.label}
                      </p>
                      <p className="text-xs text-brand-text-light">{step.action}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => setSelectedTemplate(null)}
                className="mt-4 w-full py-2 text-sm text-brand-text-light hover:text-brand-navy transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return content;
};

export default QuickStart;
