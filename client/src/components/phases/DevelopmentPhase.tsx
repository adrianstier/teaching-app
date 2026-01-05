import React from 'react';
import { motion } from 'framer-motion';

const DevelopmentPhase: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 3: Parallel Development</h2>
      <p className="text-gray-600 mb-6">
        Content Developer and Pedagogy Designer agents are working in parallel...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Content Developer</h3>
          <p className="text-gray-600 text-sm">Building segments, examples, and transitions...</p>
          <div className="mt-4">
            <div className="animate-pulse bg-blue-200 h-2 rounded"></div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Pedagogy Designer</h3>
          <p className="text-gray-600 text-sm">Creating activities and assessments...</p>
          <div className="mt-4">
            <div className="animate-pulse bg-green-200 h-2 rounded"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevelopmentPhase;