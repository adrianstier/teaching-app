import React from 'react';
import { motion } from 'framer-motion';

const VisualPhase: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 4: Visual Design</h2>
      <p className="text-gray-600 mb-6">
        The Visual Designer is creating slide specifications and layouts...
      </p>
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Designing slides and visual elements...</p>
      </div>
    </motion.div>
  );
};

export default VisualPhase;