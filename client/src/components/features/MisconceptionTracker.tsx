import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const MisconceptionTracker: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'database' | 'diagnostic' | 'intervention'>('database');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateMisconceptions = async () => {
    if (!topic.trim() || !domain.trim()) {
      toast.error('Please enter both topic and domain');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/misconceptions/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          domain,
          gradeLevel: 'undergraduate'
        })
      });

      if (!response.ok) throw new Error('Failed to generate misconceptions');
      const data = await response.json();
      setResults(data);
      toast.success('Misconception database generated!');
    } catch (error) {
      toast.error('Failed to generate misconceptions');
    } finally {
      setLoading(false);
    }
  };

  const generateDiagnostic = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/misconception/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: topic,
          knownMisconceptions: []
        })
      });

      if (!response.ok) throw new Error('Failed to generate diagnostic');
      const data = await response.json();
      setResults(data);
      toast.success('Diagnostic questions generated!');
    } catch (error) {
      toast.error('Failed to generate diagnostic');
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
          <div className="p-3 bg-red-100 rounded-xl">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Misconception Tracker</h1>
            <p className="text-gray-600">Identify, diagnose, and address student misconceptions</p>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-800">
            <strong>Research Basis:</strong> Conceptual change theory (Posner et al., 1982) shows misconceptions
            are resistant to change and require explicit confrontation. Simply presenting correct information
            is often insufficient—students need to experience cognitive conflict.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'database', name: 'Misconception Database', icon: MagnifyingGlassIcon },
          { id: 'diagnostic', name: 'Diagnostic Questions', icon: AcademicCapIcon },
          { id: 'intervention', name: 'Interventions', icon: LightBulbIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
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
          {activeTab === 'database' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Misconception Database
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Identify common misconceptions students hold about a topic,
                including their sources and why they're compelling.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic/Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Evolution by natural selection"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., Biology"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <button
                onClick={generateMisconceptions}
                disabled={loading}
                className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Misconception Database'}
              </button>
            </>
          )}

          {activeTab === 'diagnostic' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Create Diagnostic Questions
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate questions designed to reveal whether students hold
                specific misconceptions, not just whether they know the right answer.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept to Diagnose
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Force and motion"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Format
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500">
                    <option value="two-tier">Two-Tier (answer + explanation)</option>
                    <option value="three-tier">Three-Tier (answer + explanation + confidence)</option>
                    <option value="open-ended">Open-Ended Prediction</option>
                    <option value="concept-inventory">Concept Inventory Style</option>
                  </select>
                </div>
              </div>
              <button
                onClick={generateDiagnostic}
                disabled={loading}
                className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Diagnostic Questions'}
              </button>
            </>
          )}

          {activeTab === 'intervention' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Design Interventions
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create conceptual change activities that help students
                confront and revise their misconceptions.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Misconception to Address
                  </label>
                  <textarea
                    placeholder="Describe the specific misconception..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Understanding
                  </label>
                  <textarea
                    placeholder="What should students understand instead..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Generate Intervention Activity
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 max-h-[700px] overflow-y-auto"
        >
          {results && activeTab === 'database' && results.misconceptions && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Misconceptions: {results.topic}
              </h2>
              <div className="space-y-4">
                {results.misconceptions.map((m: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border-l-4 border-red-500">
                    <h3 className="font-medium text-brand-navy mb-2">
                      {m.misconception}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Source: </span>
                        <span className="text-gray-600">{m.source}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Why compelling: </span>
                        <span className="text-gray-600">{m.whyCompelling}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Correct understanding: </span>
                        <span className="text-gray-600">{m.correctUnderstanding}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          m.prevalence === 'high' ? 'bg-red-100 text-red-700' :
                          m.prevalence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {m.prevalence} prevalence
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          m.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                          m.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {m.difficulty} to address
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {results && activeTab === 'diagnostic' && results.questions && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Diagnostic Questions
              </h2>
              <div className="space-y-4">
                {results.questions.map((q: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-brand-navy mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options?.map((opt: any, j: number) => (
                        <div
                          key={j}
                          className={`p-2 rounded-lg text-sm ${
                            opt.isCorrect
                              ? 'bg-green-50 border border-green-200'
                              : opt.misconceptionRevealed
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + j)}.</span> {opt.text}
                          {opt.misconceptionRevealed && (
                            <p className="text-xs text-red-600 mt-1">
                              Reveals: {opt.misconceptionRevealed}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
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
                Identify and address misconceptions that may be blocking student learning.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Conceptual Change Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Conceptual Change Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Reveal', desc: 'Surface existing beliefs through prediction tasks' },
            { step: 2, title: 'Confront', desc: 'Create cognitive conflict with anomalous data' },
            { step: 3, title: 'Reconstruct', desc: 'Guide construction of accurate understanding' },
            { step: 4, title: 'Apply', desc: 'Practice new understanding in varied contexts' },
          ].map((phase) => (
            <div key={phase.step} className="p-4 bg-white rounded-xl">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-red-700 font-bold">{phase.step}</span>
              </div>
              <h4 className="font-medium text-brand-navy">{phase.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{phase.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MisconceptionTracker;
