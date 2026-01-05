import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  DocumentPlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

interface Exercise {
  id: string;
  topic: string;
  questionType: string;
  bloomLevel: string;
  difficulty: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  solution: {
    steps: string[];
    explanation: string;
  };
}

const ExerciseGenerator: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [config, setConfig] = useState({
    topic: '',
    bloomLevel: 'understand',
    difficulty: 3,
    questionType: 'multiple-choice',
    purpose: 'practice',
    classType: 'STEM',
    variants: 1,
    includeRubric: false,
    includeSolution: true,
    includeDistractors: true
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleGenerate = async () => {
    if (!config.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`http://localhost:5001/api/exercises/${sessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const result = await response.json();

      if (result.success) {
        setExercises([...exercises, ...result.data]);
      } else {
        alert('Failed to generate exercise: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
      alert('Failed to generate exercise');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSet = async () => {
    if (!config.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`http://localhost:5001/api/exercises/${sessionId}/generate-set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: config.topic,
          count: 5,
          bloomLevel: config.bloomLevel,
          difficulty: config.difficulty
        })
      });

      const result = await response.json();

      if (result.success) {
        setExercises([...exercises, ...result.data]);
      } else {
        alert('Failed to generate set: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating set:', error);
      alert('Failed to generate exercise set');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    if (selectedExercise?.id === id) {
      setSelectedExercise(null);
    }
  };

  const exportExercises = () => {
    const data = JSON.stringify(exercises, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exercises-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <AcademicCapIcon className="h-8 w-8 mr-3 text-blue-600" />
          Exercise Generator
        </h1>
        <p className="text-gray-600">
          Create pedagogically-sound exercises aligned with Bloom's taxonomy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Exercise Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  value={config.topic}
                  onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Photosynthesis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bloom's Level
                </label>
                <select
                  value={config.bloomLevel}
                  onChange={(e) => setConfig({ ...config, bloomLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="remember">Remember</option>
                  <option value="understand">Understand</option>
                  <option value="apply">Apply</option>
                  <option value="analyze">Analyze</option>
                  <option value="evaluate">Evaluate</option>
                  <option value="create">Create</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty: {config.difficulty}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.difficulty}
                  onChange={(e) => setConfig({ ...config, difficulty: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Easy</span>
                  <span>Hard</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={config.questionType}
                  onChange={(e) => setConfig({ ...config, questionType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="essay">Essay</option>
                  <option value="calculation">Calculation</option>
                  <option value="data-interpretation">Data Interpretation</option>
                  <option value="coding">Coding</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <select
                  value={config.purpose}
                  onChange={(e) => setConfig({ ...config, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="practice">Practice</option>
                  <option value="formative">Formative Assessment</option>
                  <option value="summative">Summative Assessment</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeRubric"
                  checked={config.includeRubric}
                  onChange={(e) => setConfig({ ...config, includeRubric: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="includeRubric" className="text-sm text-gray-700">
                  Include grading rubric
                </label>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <DocumentPlusIcon className="h-5 w-5 mr-2" />
                      Generate Exercise
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateSet}
                  disabled={isGenerating}
                  className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate Set (5 varied)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Generated Exercises ({exercises.length})
              </h2>
              {exercises.length > 0 && (
                <button
                  onClick={exportExercises}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export All
                </button>
              )}
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No exercises generated yet</p>
                <p className="text-sm">Configure settings and click "Generate Exercise"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {exercise.bloomLevel}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            {exercise.questionType}
                          </span>
                          <span className="text-xs text-gray-500">
                            Difficulty: {exercise.difficulty}/5
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {exercise.topic}
                        </h3>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {exercise.question}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteExercise(exercise.id);
                        }}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExercise(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                    {selectedExercise.bloomLevel}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded">
                    {selectedExercise.questionType}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedExercise.topic}
                </h2>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Question:</h3>
                <p className="text-gray-700">{selectedExercise.question}</p>
              </div>

              {selectedExercise.options && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Options:</h3>
                  <div className="space-y-2">
                    {selectedExercise.options.map((option, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          option.includes(selectedExercise.correctAnswer)
                            ? 'bg-green-50 border-2 border-green-500'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {option.includes(selectedExercise.correctAnswer) && (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          )}
                          <span className="text-gray-700">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Solution:</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedExercise.solution.steps.map((step, i) => (
                      <li key={i} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                  <p className="mt-4 text-sm text-gray-600">
                    {selectedExercise.solution.explanation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExerciseGenerator;