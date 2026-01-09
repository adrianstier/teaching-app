import React from 'react';
import { motion } from 'framer-motion';

interface ConceptNode {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  relatedConcepts: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

interface ConceptMapDisplayProps {
  concepts: ConceptNode[];
  compact?: boolean;
}

const ConceptMapDisplay: React.FC<ConceptMapDisplayProps> = ({ concepts, compact = false }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'bg-scholarly-sage/10 text-scholarly-sage border-scholarly-sage/30';
      case 'intermediate':
        return 'bg-brand-gold/10 text-brand-gold border-brand-gold/30';
      case 'advanced':
        return 'bg-scholarly-wine/10 text-scholarly-wine border-scholarly-wine/30';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'Basic';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return complexity;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium ${getComplexityColor(concept.complexity)}`}
          >
            {concept.name}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visual Map */}
      <div className="relative bg-brand-bg rounded-xl p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className={`p-4 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-shadow ${getComplexityColor(concept.complexity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-brand-navy text-sm">{concept.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getComplexityColor(concept.complexity)}`}>
                    {getComplexityBadge(concept.complexity)}
                  </span>
                </div>
                <p className="text-xs text-brand-text-light leading-relaxed mb-3">
                  {concept.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-text-light">
                    {concept.estimatedTime} min
                  </span>
                  {concept.prerequisites.length > 0 && (
                    <span className="text-brand-text-light">
                      Requires: {concept.prerequisites.length} concept(s)
                    </span>
                  )}
                </div>
              </div>

              {/* Connection Lines (decorative) */}
              {concept.prerequisites.length > 0 && index > 0 && (
                <div className="absolute -left-4 top-1/2 w-4 h-px bg-brand-border-subtle hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-brand-border-subtle flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-scholarly-sage/20 border border-scholarly-sage/40" />
            <span className="text-brand-text-light">Basic</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-brand-gold/20 border border-brand-gold/40" />
            <span className="text-brand-text-light">Intermediate</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-scholarly-wine/20 border border-scholarly-wine/40" />
            <span className="text-brand-text-light">Advanced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptMapDisplay;
