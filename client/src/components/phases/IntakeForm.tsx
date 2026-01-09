import React, { useState, useEffect } from 'react';
import { useLecture } from '../../context/LectureContext';
import { motion } from 'framer-motion';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useAutoSave, useLoadSavedSession } from '../../hooks/useAutoSave';
import { formExamples } from '../../data/formExamples';
import MultiFileUpload from '../MultiFileUpload';
import ErrorDisplay from '../shared/ErrorDisplay';
import LoadingButton from '../shared/LoadingButton';
import FormTooltip from '../shared/FormTooltip';
import SessionRecoveryModal from '../shared/SessionRecoveryModal';
import AutoSaveIndicator from '../shared/AutoSaveIndicator';
import {
  InformationCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const IntakeForm: React.FC = () => {
  const { submitIntake, isLoading, sessionId } = useLecture();
  const { error, handleError, clearError } = useErrorHandler();

  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    duration: 50,
    audienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    prerequisites: '',
    mainGoals: '',
    constraints: '',
    preferredStyle: '',
    specialRequirements: '',
  });

  const [showApplySuggestions, setShowApplySuggestions] = useState(false);
  const [suggestedData, setSuggestedData] = useState<any>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [savedSession, setSavedSession] = useState<any>(null);

  // Auto-save
  const { saveNow } = useAutoSave({
    key: 'lecture-intake-form',
    data: formData,
  });

  // Load saved session
  const { loadSession, clearSession } = useLoadSavedSession('lecture-intake-form');

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSavedSession(saved);
      setShowRecovery(true);
    }
  }, [loadSession]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
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
      audienceLevel: prev.audienceLevel,
      prerequisites: suggestedData.prerequisites?.join(', ') || prev.prerequisites,
      mainGoals: suggestedData.mainGoals?.join(', ') || prev.mainGoals,
      constraints: prev.constraints,
      preferredStyle: prev.preferredStyle,
      specialRequirements: prev.specialRequirements,
    }));

    setShowApplySuggestions(false);
  };

  const loadExample = () => {
    setFormData({
      title: 'Introduction to Quantum Mechanics',
      topic: 'Wave-particle duality and uncertainty principle',
      duration: 75,
      audienceLevel: 'intermediate',
      prerequisites: 'Classical mechanics, Basic wave theory, Linear algebra',
      mainGoals:
        'Understand wave-particle duality, Apply Heisenberg uncertainty principle, Interpret quantum wavefunctions',
      constraints: 'Must include visual demonstrations, Avoid heavy mathematics initially',
      preferredStyle: 'Interactive with live demos and thought experiments',
      specialRequirements: 'Include historical context from Einstein-Bohr debates',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!formData.title.trim()) {
      handleError({
        type: 'validation',
        message: 'Please complete required fields',
        details: 'Lecture title is required.',
        suggestion: 'Enter a descriptive title for your lecture.',
      });
      return;
    }

    if (!formData.topic.trim()) {
      handleError({
        type: 'validation',
        message: 'Please complete required fields',
        details: 'Topic is required.',
        suggestion: 'Specify the main topic or subject area of your lecture.',
      });
      return;
    }

    if (!formData.prerequisites.trim()) {
      handleError({
        type: 'validation',
        message: 'Please complete required fields',
        details: 'Prerequisites are required.',
        suggestion: 'List what students need to know before this lecture, or enter "None".',
      });
      return;
    }

    if (!formData.mainGoals.trim()) {
      handleError({
        type: 'validation',
        message: 'Please complete required fields',
        details: 'Learning goals are required.',
        suggestion: 'Describe what students should be able to do after this lecture.',
      });
      return;
    }

    const processedData = {
      ...formData,
      duration: Number(formData.duration),
      prerequisites: formData.prerequisites
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      mainGoals: formData.mainGoals
        .split(',')
        .map(s => s.trim())
        .filter(s => s),
      constraints: formData.constraints
        ? formData.constraints
            .split(',')
            .map(s => s.trim())
            .filter(s => s)
        : [],
      specialRequirements: formData.specialRequirements
        ? formData.specialRequirements
            .split(',')
            .map(s => s.trim())
            .filter(s => s)
        : [],
    };

    try {
      await submitIntake(processedData);
      // Clear saved session after successful submission
      clearSession();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {/* Session Recovery Modal */}
      <SessionRecoveryModal
        isOpen={showRecovery}
        savedTimestamp={savedSession?.timestamp || Date.now()}
        featureName="Lecture Intake Form"
        onRestore={() => {
          setFormData(savedSession.data);
          setShowRecovery(false);
        }}
        onDiscard={() => {
          clearSession();
          setShowRecovery(false);
        }}
        onCancel={() => setShowRecovery(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-brand-navy/5 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-brand-navy" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-brand-navy">
                  Phase 1: Lecture Intake
                </h2>
                <p className="text-sm text-brand-text-light mt-1">
                  Define your lecture requirements and learning objectives
                </p>
              </div>
            </div>
            <AutoSaveIndicator lastSaved={savedSession?.timestamp} />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
              <ClockIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
              <div>
                <p className="text-xs text-brand-text-light">Estimated Time</p>
                <p className="text-sm font-medium text-brand-navy">3-5 minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
              <UserGroupIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
              <div>
                <p className="text-xs text-brand-text-light">For</p>
                <p className="text-sm font-medium text-brand-navy">Any course level</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-brand-bg rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-brand-gold flex-shrink-0" />
              <div>
                <p className="text-xs text-brand-text-light">Output</p>
                <p className="text-sm font-medium text-brand-navy">Structured brief</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} onRetry={handleSubmit} onDismiss={clearError} />
          </div>
        )}

        {/* Document Upload Section */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <InformationCircleIcon className="h-6 w-6 text-brand-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-brand-navy mb-1">
                Upload Existing Materials (Optional)
              </h3>
              <p className="text-sm text-brand-text-light">
                Have existing slides or outlines? Upload documents and AI will auto-fill the
                form.
              </p>
            </div>
          </div>

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
              <LoadingButton
                onClick={applySuggestions}
                loading={false}
                variant="secondary"
                size="sm"
              >
                Apply Suggestions to Form
              </LoadingButton>
            </motion.div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-brand-navy">Lecture Details</h3>
              <button
                type="button"
                onClick={loadExample}
                className="text-sm text-brand-gold hover:text-brand-gold-dark font-medium transition-colors"
              >
                ✨ Try an example
              </button>
            </div>

            <div className="space-y-6">
              {/* Title and Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTooltip
                  label="Lecture Title"
                  tooltip="A clear, descriptive title for your lecture. This will appear in your course materials."
                  example="Introduction to Quantum Mechanics"
                  required
                >
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                    placeholder="e.g., Introduction to..."
                  />
                </FormTooltip>

                <FormTooltip
                  label="Topic"
                  tooltip="The specific subject or theme of this lecture. Be as specific as possible for better AI-generated content."
                  example="Wave-particle duality and uncertainty principle"
                  required
                >
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                    placeholder="e.g., Main concepts..."
                  />
                </FormTooltip>
              </div>

              {/* Duration and Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTooltip
                  label="Duration (minutes)"
                  tooltip="The total length of your lecture in minutes. This helps determine how much content to generate."
                  example="50 minutes (standard class period)"
                  required
                >
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="10"
                    max="180"
                    className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                  />
                </FormTooltip>

                <FormTooltip
                  label="Audience Level"
                  tooltip="The experience level of your students. This affects the depth and complexity of generated content."
                  example="Intermediate: Some prior knowledge assumed"
                  required
                >
                  <select
                    name="audienceLevel"
                    value={formData.audienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors bg-white"
                  >
                    <option value="beginner">Beginner - No prior knowledge</option>
                    <option value="intermediate">Intermediate - Some background</option>
                    <option value="advanced">Advanced - Significant expertise</option>
                  </select>
                </FormTooltip>
              </div>

              {/* Prerequisites */}
              <FormTooltip
                label="Prerequisites"
                tooltip="List what students need to know before this lecture. Separate with commas. If none, enter 'None'."
                example="Classical mechanics, Basic wave theory, Linear algebra"
                required
              >
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                  placeholder="e.g., Classical mechanics, Basic calculus"
                />
              </FormTooltip>

              {/* Main Goals */}
              <FormTooltip
                label="Main Learning Goals"
                tooltip="What should students be able to do after this lecture? Use action verbs (understand, apply, analyze). Separate with commas."
                example="Understand wave-particle duality, Apply Heisenberg uncertainty principle, Interpret quantum wavefunctions"
                required
              >
                <textarea
                  name="mainGoals"
                  value={formData.mainGoals}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                  placeholder="e.g., Students will be able to..."
                />
              </FormTooltip>

              {/* Optional Fields */}
              <div className="border-t border-brand-border pt-6">
                <h4 className="text-sm font-medium text-brand-navy mb-4">
                  Optional Details
                </h4>

                <div className="space-y-6">
                  <FormTooltip
                    label="Constraints"
                    tooltip="Any limitations or requirements for the lecture (time limits for activities, required demonstrations, etc.). Separate with commas."
                    example="Must include visual demonstrations, Avoid heavy mathematics initially"
                  >
                    <textarea
                      name="constraints"
                      value={formData.constraints}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                      placeholder="e.g., Limited lab equipment, 50-minute period"
                    />
                  </FormTooltip>

                  <FormTooltip
                    label="Preferred Teaching Style"
                    tooltip="How you prefer to teach (lecture-based, interactive, flipped classroom, etc.)."
                    example="Interactive with live demos and thought experiments"
                  >
                    <input
                      type="text"
                      name="preferredStyle"
                      value={formData.preferredStyle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                      placeholder="e.g., Interactive, discussion-based"
                    />
                  </FormTooltip>

                  <FormTooltip
                    label="Special Requirements"
                    tooltip="Anything else we should know? Cultural considerations, accessibility needs, specific examples to include."
                    example="Include historical context from Einstein-Bohr debates"
                  >
                    <textarea
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                      placeholder="e.g., Must accommodate students with disabilities"
                    />
                  </FormTooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-brand-text-light">
              Next: Architecture Phase (learning objectives & structure)
            </p>
            <LoadingButton
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Processing your lecture details..."
              variant="primary"
              size="lg"
              icon={<SparklesIcon className="h-5 w-5" />}
            >
              Continue to Architecture Phase
            </LoadingButton>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default IntakeForm;
