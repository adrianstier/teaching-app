import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  AdjustmentsHorizontalIcon,
  MapIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const AdaptivePathways: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'pathways' | 'challenge'>('diagnostic');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateDiagnostic = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/adaptive/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          prerequisites: prerequisites.split('\n').filter(p => p.trim()),
          diagnosticPurpose: 'placement'
        })
      });

      if (!response.ok) throw new Error('Failed to generate diagnostic');
      const data = await response.json();
      setResults(data);
      toast.success('Diagnostic generated!');
    } catch (error) {
      toast.error('Failed to generate diagnostic');
    } finally {
      setLoading(false);
    }
  };

  const generatePathway = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/adaptive/pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learningGoal: topic,
          currentLevel: 'intermediate',
          studentProfile: {}
        })
      });

      if (!response.ok) throw new Error('Failed to generate pathway');
      const data = await response.json();
      setResults(data);
      toast.success('Learning pathway generated!');
    } catch (error) {
      toast.error('Failed to generate pathway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <AdjustmentsHorizontalIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Adaptive Pathways</h1>
            <p className="text-gray-600">Personalized learning paths based on student readiness</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Research Basis:</strong> Based on Vygotsky's Zone of Proximal Development and
            mastery learning principles. Adaptive instruction can improve outcomes by 1-2 standard
            deviations when students work at their optimal challenge level.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'diagnostic', name: 'Diagnostic Assessment', icon: ChartBarIcon },
          { id: 'pathways', name: 'Learning Pathways', icon: MapIcon },
          { id: 'challenge', name: 'Challenge Problems', icon: SparklesIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          {activeTab === 'diagnostic' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Create Diagnostic Assessment
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate a diagnostic assessment to determine student readiness
                and identify prerequisite gaps before starting new material.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quadratic Equations"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    placeholder="Linear equations&#10;Order of operations&#10;Factoring basics"
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Purpose
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'placement', label: 'Placement' },
                      { value: 'prerequisite-check', label: 'Prerequisite Check' },
                      { value: 'readiness', label: 'Readiness Assessment' },
                      { value: 'gap-analysis', label: 'Gap Analysis' },
                    ].map((purpose) => (
                      <label key={purpose.value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                        <input type="radio" name="purpose" defaultChecked={purpose.value === 'placement'} className="text-blue-600" />
                        <span className="text-sm">{purpose.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateDiagnostic}
                disabled={loading}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Diagnostic'}
              </button>
            </>
          )}

          {activeTab === 'pathways' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Learning Pathway
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create personalized learning pathways with branching based on
                student performance and preferences.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Goal
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Master solving quadratic equations"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Level
                  </label>
                  <div className="flex space-x-2">
                    {['Novice', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          level === 'Intermediate'
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generatePathway}
                disabled={loading}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Pathway'}
              </button>
            </>
          )}

          {activeTab === 'challenge' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Challenge Problem Generator
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate extension problems for students who have mastered
                the core material and need additional challenge.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Core Topic Mastered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Basic calculus derivatives"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge Type
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option value="extension">Extension (deeper exploration)</option>
                    <option value="transfer">Transfer (new contexts)</option>
                    <option value="synthesis">Synthesis (combining topics)</option>
                    <option value="research">Research-oriented</option>
                  </select>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Generate Challenge Problems
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          {results && activeTab === 'diagnostic' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Diagnostic Assessment
              </h2>
              <div className="space-y-4">
                {results.questions?.map((q: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">
                        Q{i + 1}: {q.prerequisiteTested}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-brand-navy">{q.question}</p>
                  </div>
                ))}
                {results.scoringGuide && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-700 mb-2">Scoring Guide:</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(results.scoringGuide).map(([range, rec]: [string, any]) => (
                        <div key={range} className="flex justify-between">
                          <span className="text-gray-700">{range}</span>
                          <span className="text-gray-600">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'pathways' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Learning Pathway
              </h2>
              <div className="space-y-4">
                {results.nodes?.map((node: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {i + 1}
                      </div>
                      <div className="flex-1 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium text-brand-navy">{node.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Duration: {node.estimatedTime}</span>
                          <span>Mastery: {node.masteryThreshold}%</span>
                        </div>
                      </div>
                    </div>
                    {i < results.nodes.length - 1 && (
                      <div className="ml-4 h-4 w-0.5 bg-blue-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Create adaptive learning tools to personalize instruction for each student.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Differentiation Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Zone of Proximal Development</h3>
        <div className="flex items-center justify-between">
          <div className="text-center px-4 py-3 bg-green-100 rounded-xl flex-1 mx-2">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-800">Can Do Alone</p>
            <p className="text-xs text-green-600">Comfort Zone</p>
          </div>
          <div className="text-center px-4 py-3 bg-blue-200 rounded-xl flex-1 mx-2 border-2 border-blue-500">
            <SparklesIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-blue-800">ZPD</p>
            <p className="text-xs text-blue-600">Optimal Learning</p>
          </div>
          <div className="text-center px-4 py-3 bg-red-100 rounded-xl flex-1 mx-2">
            <AcademicCapIcon className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-red-800">Too Difficult</p>
            <p className="text-xs text-red-600">Frustration Zone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Adaptive pathways keep students in the ZPD—challenged but not frustrated—where learning is maximized.
        </p>
      </motion.div>
    </div>
  );
};

export default AdaptivePathways;
