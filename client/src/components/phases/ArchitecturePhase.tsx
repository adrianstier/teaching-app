import React from 'react';
import { motion } from 'framer-motion';

const ArchitecturePhase: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 2: Curriculum Architecture</h2>
      <p className="text-gray-600 mb-6">
        The Curriculum Architect is designing learning objectives and concept maps...
      </p>
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Processing architecture design...</p>
      </div>
    </motion.div>
  );
};

export default ArchitecturePhase;