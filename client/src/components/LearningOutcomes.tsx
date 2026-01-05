import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LearningOutcome {
  id: string;
  statement: string;
  bloomLevel: string;
  verb: string;
  object: string;
  status: 'over-covered' | 'adequate' | 'under-covered' | 'missing';
  suggestedActivities?: string[];
}

interface BloomBalance {
  distribution: Record<string, number>;
  recommendations: string[];
  idealDistribution: Record<string, number>;
}

const LearningOutcomes: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const [topic, setTopic] = useState('');
  const [courseLevel, setCourseLevel] = useState('undergraduate');
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
  const [bloomBalance, setBloomBalance] = useState<BloomBalance | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<LearningOutcome | null>(null);
  const [existingOutcomes, setExistingOutcomes] = useState('');
  const [mode, setMode] = useState<'generate' | 'improve'>('generate');

  const fetchOutcomes = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/learning-outcomes/${sessionId}/list`);
      const result = await response.json();

      if (result.success && result.data) {
        setOutcomes(result.data);
      }
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  };

  const fetchBloomBalance = async () => {
    if (outcomes.length === 0) return;

    try {
      const response = await fetch(`http://localhost:5001/api/learning-outcomes/${sessionId}/bloom-balance`);
      const result = await response.json();

      if (result.success && result.data) {
        setBloomBalance(result.data);
      }
    } catch (error) {
      console.error('Error fetching Bloom balance:', error);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, [sessionId]);

  useEffect(() => {
    if (outcomes.length > 0) {
      fetchBloomBalance();
    }
  }, [outcomes]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`http://localhost:5001/api/learning-outcomes/${sessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          courseLevel,
          duration: 'course'
        })
      });

      const result = await response.json();

      if (result.success) {
        setOutcomes(result.data);
      } else {
        alert('Failed to generate outcomes: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating outcomes:', error);
      alert('Failed to generate outcomes');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!existingOutcomes.trim() || !topic.trim()) {
      alert('Please enter both topic and existing outcomes');
      return;
    }

    setIsGenerating(true);

    const outcomesArray = existingOutcomes
      .split('\n')
      .filter(s => s.trim().length > 0);

    try {
      const response = await fetch(`http://localhost:5001/api/learning-outcomes/${sessionId}/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          existingOutcomes: outcomesArray
        })
      });

      const result = await response.json();

      if (result.success) {
        setOutcomes(result.data);
      } else {
        alert('Failed to improve outcomes: ' + result.error);
      }
    } catch (error) {
      console.error('Error improving outcomes:', error);
      alert('Failed to improve outcomes');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'adequate':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'over-covered':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'under-covered':
      case 'missing':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adequate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'over-covered':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under-covered':
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBloomColor = (level: string) => {
    const colors: Record<string, string> = {
      remember: 'bg-blue-100 text-blue-700',
      understand: 'bg-cyan-100 text-cyan-700',
      apply: 'bg-green-100 text-green-700',
      analyze: 'bg-yellow-100 text-yellow-700',
      evaluate: 'bg-orange-100 text-orange-700',
      create: 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <ClipboardDocumentListIcon className="h-8 w-8 mr-3 text-purple-600" />
          Learning Outcomes Assistant
        </h1>
        <p className="text-gray-600">
          Write measurable, actionable learning outcomes aligned with Bloom's taxonomy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setMode('generate')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'generate'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Generate New
              </button>
              <button
                onClick={() => setMode('improve')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'improve'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Improve Existing
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Marine Biology"
                />
              </div>

              {mode === 'generate' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Level
                    </label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="high-school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Generate Outcomes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Outcomes (one per line)
                    </label>
                    <textarea
                      value={existingOutcomes}
                      onChange={(e) => setExistingOutcomes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={6}
                      placeholder="Paste your existing learning outcomes here, one per line"
                    />
                  </div>

                  <button
                    onClick={handleImprove}
                    disabled={isGenerating}
                    className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Improve Outcomes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Bloom's Balance */}
            {bloomBalance && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Bloom's Balance
                </h3>

                <div className="space-y-2 mb-4">
                  {Object.entries(bloomBalance.distribution).map(([level, percentage]) => (
                    <div key={level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{level}</span>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {bloomBalance.recommendations.length > 0 && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-900 mb-2">Recommendations:</p>
                    <ul className="text-xs text-purple-800 space-y-1">
                      {bloomBalance.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Outcomes Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Learning Outcomes ({outcomes.length})
            </h2>

            {outcomes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardDocumentListIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No learning outcomes yet</p>
                <p className="text-sm">Generate or improve outcomes to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outcomes.map((outcome, index) => (
                  <motion.div
                    key={outcome.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedOutcome(outcome)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getBloomColor(outcome.bloomLevel)}`}>
                          {outcome.bloomLevel}
                        </span>
                        {outcome.status && (
                          <div className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(outcome.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(outcome.status)}
                              <span className="capitalize">{outcome.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-900 font-medium mb-2">
                      {outcome.statement}
                    </p>

                    {outcome.verb && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          <strong>Verb:</strong> {outcome.verb}
                        </span>
                        {outcome.object && (
                          <span>
                            <strong>Object:</strong> {outcome.object}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outcome Detail Modal */}
      {selectedOutcome && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOutcome(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getBloomColor(selectedOutcome.bloomLevel)}`}>
                    {selectedOutcome.bloomLevel}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Learning Outcome Details</h2>
              </div>
              <button
                onClick={() => setSelectedOutcome(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Statement:</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedOutcome.statement}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Action Verb:</h3>
                  <p className="text-gray-700">{selectedOutcome.verb}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Object:</h3>
                  <p className="text-gray-700">{selectedOutcome.object}</p>
                </div>
              </div>

              {selectedOutcome.suggestedActivities && selectedOutcome.suggestedActivities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Suggested Activities:</h3>
                  <ul className="space-y-2">
                    {selectedOutcome.suggestedActivities.map((activity, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LearningOutcomes;