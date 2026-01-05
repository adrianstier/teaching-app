import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowsRightLeftIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const TransferLearning: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'analogies' | 'abstraction'>('activities');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState('');
  const [context, setContext] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateActivity = async () => {
    if (!concept.trim()) {
      toast.error('Please enter a concept');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/transfer/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceConcept: concept,
          sourceContext: context || 'classroom',
          targetContexts: []
        })
      });

      if (!response.ok) throw new Error('Failed to generate activity');
      const data = await response.json();
      setResults(data);
      toast.success('Transfer activity generated!');
    } catch (error) {
      toast.error('Failed to generate activity');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalogy = async () => {
    if (!concept.trim()) {
      toast.error('Please enter a concept');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/transfer/analogical-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceDomain: context || 'familiar',
          targetDomain: 'new',
          sharedStructure: concept
        })
      });

      if (!response.ok) throw new Error('Failed to generate analogy');
      const data = await response.json();
      setResults(data);
      toast.success('Analogical exercise generated!');
    } catch (error) {
      toast.error('Failed to generate analogy');
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
          <div className="p-3 bg-emerald-100 rounded-xl">
            <ArrowsRightLeftIcon className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Transfer Learning</h1>
            <p className="text-gray-600">Help students apply knowledge to new contexts</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-800">
            <strong>Research Basis:</strong> Transfer is notoriously difficult to achieve. Perkins & Salomon
            identified two types: "low road" (automatic transfer of well-practiced skills) and "high road"
            (mindful abstraction and application). High road transfer requires explicit instruction.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'activities', name: 'Transfer Activities', icon: ArrowsRightLeftIcon },
          { id: 'analogies', name: 'Analogical Reasoning', icon: PuzzlePieceIcon },
          { id: 'abstraction', name: 'Abstraction Ladder', icon: ArrowTrendingUpIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
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
          {activeTab === 'activities' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Transfer Activities
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create activities that help students apply concepts learned in one context
                to new, different contexts—the hallmark of real understanding.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Concept
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Feedback loops"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Context
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Biology (homeostasis)"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'near', label: 'Near Transfer', desc: 'Similar contexts' },
                      { value: 'far', label: 'Far Transfer', desc: 'Different domains' },
                    ].map((type) => (
                      <label key={type.value} className="flex flex-col p-3 border border-gray-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="transferType" defaultChecked={type.value === 'near'} className="text-emerald-600" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-6">{type.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateActivity}
                disabled={loading}
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Transfer Activity'}
              </button>
            </>
          )}

          {activeTab === 'analogies' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Analogical Reasoning
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create exercises that help students identify structural similarities
                across domains—the foundation of transfer and creative thinking.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Core Concept/Structure
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Competition for limited resources"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Domain (familiar)
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Sports competition"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Domain (to learn)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Market economics"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={generateAnalogy}
                disabled={loading}
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Analogy Exercise'}
              </button>
            </>
          )}

          {activeTab === 'abstraction' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Abstraction Ladder
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Help students move up and down the abstraction ladder—from concrete
                examples to abstract principles and back again.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept to Abstract
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis in plants"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Point
                  </label>
                  <div className="flex space-x-2">
                    {['Concrete Example', 'Abstract Principle'].map((point) => (
                      <button
                        key={point}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          point === 'Concrete Example'
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Why Abstraction Matters:</h4>
                  <p className="text-sm text-blue-700">
                    Students who can identify abstract principles are better at
                    transferring knowledge. The ladder exercise builds this skill.
                  </p>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Generate Abstraction Exercise
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
          {results && activeTab === 'activities' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Transfer Activity
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <h3 className="font-medium text-emerald-800 mb-2">Source Context</h3>
                  <p className="text-sm text-gray-700">{results.sourceExample}</p>
                </div>

                {results.targetContexts?.map((target: any, i: number) => (
                  <div key={i} className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        target.transferDistance === 'near'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {target.transferDistance} transfer
                      </span>
                      <span className="text-sm font-medium text-blue-800">{target.context}</span>
                    </div>
                    <p className="text-sm text-gray-700">{target.applicationPrompt}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Mapping: {target.structuralMapping}
                    </p>
                  </div>
                ))}

                {results.abstractPrinciple && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h4 className="font-medium text-yellow-800 mb-2">Underlying Principle:</h4>
                    <p className="text-sm text-gray-700">{results.abstractPrinciple}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'analogies' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Analogical Mapping
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-700 mb-2">Source Domain</h3>
                    <p className="text-sm text-gray-600">{results.sourceAnalogy}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <h3 className="font-medium text-emerald-700 mb-2">Target Domain</h3>
                    <p className="text-sm text-gray-600">{results.targetAnalogy}</p>
                  </div>
                </div>

                {results.mappings && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Structural Mappings:</h3>
                    <div className="space-y-2">
                      {results.mappings.map((m: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg flex items-center">
                          <span className="flex-1 text-sm">{m.source}</span>
                          <ArrowsRightLeftIcon className="h-4 w-4 text-emerald-500 mx-3" />
                          <span className="flex-1 text-sm">{m.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.limitations && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h4 className="font-medium text-red-800 mb-2">Where the Analogy Breaks Down:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {results.limitations.map((l: string, i: number) => (
                        <li key={i}>• {l}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                Create activities that promote transfer of learning to new contexts.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Transfer Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Teaching for Transfer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-emerald-700 mb-3">Low Road (Automatic)</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Practice in varied conditions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Develop automaticity through repetition</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Works for well-defined skills</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-700 mb-3">High Road (Mindful)</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Explicitly abstract principles</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Compare across multiple examples</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>Prompt for connections to other domains</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransferLearning;
