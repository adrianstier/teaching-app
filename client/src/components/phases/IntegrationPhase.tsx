import React from 'react';
import { motion } from 'framer-motion';
import { useLecture } from '../../context/LectureContext';
import { DocumentArrowDownIcon, FolderArrowDownIcon } from '@heroicons/react/24/outline';

const IntegrationPhase: React.FC = () => {
  const { downloadPackage, lecturePackage } = useLecture();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 5: Integration Complete!</h2>
      <p className="text-gray-600 mb-6">
        Your lecture package has been assembled and is ready for download.
      </p>

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Package Contents:</h3>
        <ul className="space-y-2 text-green-800">
          <li>✓ Complete lecture brief and metadata</li>
          <li>✓ Learning objectives with Bloom's taxonomy alignment</li>
          <li>✓ Concept map and knowledge structure</li>
          <li>✓ Detailed content segments with speaker notes</li>
          <li>✓ Interactive activities and assessments</li>
          <li>✓ Slide specifications and visual design</li>
          <li>✓ Instructor guide and timing checklist</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => downloadPackage('zip')}
          className="flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors"
        >
          <FolderArrowDownIcon className="h-5 w-5 mr-2" />
          Download ZIP Package
        </button>
        <button
          onClick={() => downloadPackage('json')}
          className="flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Download JSON
        </button>
      </div>

      {lecturePackage?.brief && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Lecture Summary</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Title:</strong> {lecturePackage.brief.title}</p>
            <p><strong>Topic:</strong> {lecturePackage.brief.topic}</p>
            <p><strong>Duration:</strong> {lecturePackage.brief.duration} minutes</p>
            <p><strong>Level:</strong> {lecturePackage.brief.audienceLevel}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IntegrationPhase;