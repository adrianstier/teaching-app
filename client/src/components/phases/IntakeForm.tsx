import React, { useState } from 'react';
import { useLecture } from '../../context/LectureContext';
import { motion } from 'framer-motion';
import MultiFileUpload from '../MultiFileUpload';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

const IntakeForm: React.FC = () => {
  const { submitIntake, isLoading, sessionId } = useLecture();

  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    duration: 50,
    audienceLevel: 'beginner',
    prerequisites: '',
    mainGoals: '',
    constraints: '',
    preferredStyle: '',
    specialRequirements: '',
  });

  const [showApplySuggestions, setShowApplySuggestions] = useState(false);
  const [suggestedData, setSuggestedData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuggestedIntake = (suggestions: any) => {
    setSuggestedData(suggestions);
    setShowApplySuggestions(true);
  };

  const applySuggestions = () => {
    if (!suggestedData) return;

    setFormData(prev => ({
      title: suggestedData.title || prev.title,
      topic: suggestedData.topic || prev.topic,
      duration: suggestedData.duration || prev.duration,
      audienceLevel: prev.audienceLevel, // Keep user preference
      prerequisites: suggestedData.prerequisites?.join(', ') || prev.prerequisites,
      mainGoals: suggestedData.mainGoals?.join(', ') || prev.mainGoals,
      constraints: prev.constraints, // Keep user constraints
      preferredStyle: prev.preferredStyle, // Keep user style
      specialRequirements: prev.specialRequirements,
    }));

    setShowApplySuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const processedData = {
      ...formData,
      duration: Number(formData.duration),
      prerequisites: formData.prerequisites.split(',').map(s => s.trim()).filter(s => s),
      mainGoals: formData.mainGoals.split(',').map(s => s.trim()).filter(s => s),
      constraints: formData.constraints ? formData.constraints.split(',').map(s => s.trim()).filter(s => s) : [],
      specialRequirements: formData.specialRequirements ? formData.specialRequirements.split(',').map(s => s.trim()).filter(s => s) : [],
    };

    await submitIntake(processedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 1: Lecture Intake</h2>
      <p className="text-gray-600 mb-6">
        Let's gather information about your lecture. The Orchestrator Agent will process this to create a comprehensive brief.
      </p>

      {/* Document Upload Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
          Upload Existing Materials (Optional)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Have existing slides or lecture outlines? Upload multiple documents and AI will parse and merge them to auto-fill the form and provide context to our agents.
        </p>
        <MultiFileUpload
          sessionId={sessionId || undefined}
          onSuggestedIntake={handleSuggestedIntake}
        />
        {showApplySuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              type="button"
              onClick={applySuggestions}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Suggestions to Form
            </button>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Introduction to Machine Learning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Machine Learning Fundamentals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="10"
              max="180"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audience Level *
            </label>
            <select
              name="audienceLevel"
              value={formData.audienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prerequisites * (comma-separated)
          </label>
          <textarea
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Basic programming, Statistics fundamentals"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Learning Goals * (comma-separated)
          </label>
          <textarea
            name="mainGoals"
            value={formData.mainGoals}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Understand ML basics, Identify ML problems, Know key algorithms"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Constraints (optional, comma-separated)
          </label>
          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., No coding required, Must include group work"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Teaching Style (optional)
          </label>
          <input
            type="text"
            name="preferredStyle"
            value={formData.preferredStyle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Interactive with examples"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements (optional, comma-separated)
          </label>
          <textarea
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Include case studies, Focus on practical applications"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Submit Intake'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default IntakeForm;