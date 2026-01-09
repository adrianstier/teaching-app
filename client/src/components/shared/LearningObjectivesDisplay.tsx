import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  LightBulbIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface LearningObjective {
  id: string;
  objective: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  measurable: boolean;
  assessmentStrategy?: string;
}

interface LearningObjectivesDisplayProps {
  objectives: LearningObjective[];
  compact?: boolean;
  showAssessment?: boolean;
}

const LearningObjectivesDisplay: React.FC<LearningObjectivesDisplayProps> = ({
  objectives,
  compact = false,
  showAssessment = true,
}) => {
  const getBloomConfig = (level: string) => {
    const configs: Record<string, { icon: React.ElementType; color: string; label: string; description: string }> = {
      remember: {
        icon: AcademicCapIcon,
        color: 'text-gray-500 bg-gray-100 border-gray-200',
        label: 'Remember',
        description: 'Recall facts and basic concepts',
      },
      understand: {
        icon: LightBulbIcon,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        label: 'Understand',
        description: 'Explain ideas or concepts',
      },
      apply: {
        icon: BeakerIcon,
        color: 'text-scholarly-sage bg-scholarly-sage/10 border-scholarly-sage/30',
        label: 'Apply',
        description: 'Use information in new situations',
      },
      analyze: {
        icon: MagnifyingGlassIcon,
        color: 'text-brand-gold bg-brand-gold/10 border-brand-gold/30',
        label: 'Analyze',
        description: 'Draw connections among ideas',
      },
      evaluate: {
        icon: ScaleIcon,
        color: 'text-scholarly-terracotta bg-scholarly-terracotta/10 border-scholarly-terracotta/30',
        label: 'Evaluate',
        description: 'Justify decisions or arguments',
      },
      create: {
        icon: SparklesIcon,
        color: 'text-scholarly-wine bg-scholarly-wine/10 border-scholarly-wine/30',
        label: 'Create',
        description: 'Produce new or original work',
      },
    };
    return configs[level] || configs.remember;
  };

  if (compact) {
    return (
      <ul className="space-y-2">
        {objectives.map((obj, index) => {
          const config = getBloomConfig(obj.bloomLevel);
          return (
            <motion.li
              key={obj.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-3"
            >
              <span className={`mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded ${config.color}`}>
                {config.label}
              </span>
              <span className="text-sm text-brand-text">{obj.objective}</span>
            </motion.li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {objectives.map((obj, index) => {
        const config = getBloomConfig(obj.bloomLevel);
        const IconComponent = config.icon;

        return (
          <motion.div
            key={obj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-xl border border-brand-border-subtle hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg border ${config.color} flex-shrink-0`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.color}`}>
                    {config.label}
                  </span>
                  {obj.measurable && (
                    <span className="px-2 py-0.5 text-xs font-medium text-scholarly-sage bg-scholarly-sage/10 rounded">
                      Measurable
                    </span>
                  )}
                </div>
                <p className="text-sm text-brand-navy font-medium mb-1">
                  {obj.objective}
                </p>
                {showAssessment && obj.assessmentStrategy && (
                  <p className="text-xs text-brand-text-light">
                    Assessment: {obj.assessmentStrategy}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Bloom's Taxonomy Legend */}
      <div className="mt-6 p-4 bg-brand-bg rounded-lg">
        <p className="text-xs font-medium text-brand-navy mb-3">Bloom's Taxonomy Levels</p>
        <div className="flex flex-wrap gap-2">
          {['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'].map((level) => {
            const config = getBloomConfig(level);
            return (
              <div
                key={level}
                className="flex items-center space-x-1.5 text-xs"
                title={config.description}
              >
                <span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-').split(' ')[0]}`} />
                <span className="text-brand-text-light">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningObjectivesDisplay;
