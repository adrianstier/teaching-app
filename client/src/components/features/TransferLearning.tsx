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
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';

interface Props {
  sessionId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
    <motion.div
      className="max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-scholarly-sage/10 rounded-lg">
            <ArrowsRightLeftIcon className="h-7 w-7 text-scholarly-sage" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Transfer Learning</h1>
            <p className="text-brand-text mt-1">Help students apply knowledge to new contexts</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.transferLearning} color="sage" />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'activities', name: 'Transfer Activities', icon: ArrowsRightLeftIcon },
          { id: 'analogies', name: 'Analogical Reasoning', icon: PuzzlePieceIcon },
          { id: 'abstraction', name: 'Abstraction Ladder', icon: ArrowTrendingUpIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-brand-text hover:bg-brand-bg border border-brand-border-subtle'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'activities' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Transfer Activities
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create activities that help students apply concepts learned in one context
                to new, different contexts—the hallmark of real understanding.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Source Concept
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Feedback loops"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Original Context
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Biology (homeostasis)"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Transfer Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'near', label: 'Near Transfer', desc: 'Similar contexts' },
                      { value: 'far', label: 'Far Transfer', desc: 'Different domains' },
                    ].map((type) => (
                      <label key={type.value} className="flex flex-col p-3 border border-brand-border-subtle rounded-lg hover:bg-scholarly-sage/5 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="transferType" defaultChecked={type.value === 'near'} className="text-brand-navy focus:ring-brand-gold" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                        <span className="text-xs text-brand-text-light ml-6">{type.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateActivity}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
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
              <p className="text-sm text-brand-text mb-4">
                Create exercises that help students identify structural similarities
                across domains—the foundation of transfer and creative thinking.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Core Concept/Structure
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Competition for limited resources"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Source Domain (familiar)
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Sports competition"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Target Domain (to learn)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Market economics"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
              </div>
              <button
                onClick={generateAnalogy}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
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
              <p className="text-sm text-brand-text mb-4">
                Help students move up and down the abstraction ladder—from concrete
                examples to abstract principles and back again.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Concept to Abstract
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis in plants"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Starting Point
                  </label>
                  <div className="flex space-x-2">
                    {['Concrete Example', 'Abstract Principle'].map((point) => (
                      <button
                        key={point}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          point === 'Concrete Example'
                            ? 'bg-scholarly-sage/10 border-scholarly-sage text-scholarly-sage'
                            : 'border-brand-border-subtle text-brand-text hover:bg-brand-bg/50'
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
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
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
          className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle"
        >
          {results && activeTab === 'activities' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Transfer Activity
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-scholarly-sage/5 rounded-xl">
                  <h3 className="font-medium text-scholarly-sage mb-2">Source Context</h3>
                  <p className="text-sm text-brand-navy">{results.sourceExample}</p>
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
                    <p className="text-sm text-brand-navy">{target.applicationPrompt}</p>
                    <p className="text-xs text-brand-text-light mt-2">
                      Mapping: {target.structuralMapping}
                    </p>
                  </div>
                ))}

                {results.abstractPrinciple && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h4 className="font-medium text-yellow-800 mb-2">Underlying Principle:</h4>
                    <p className="text-sm text-brand-navy">{results.abstractPrinciple}</p>
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
                  <div className="p-4 bg-brand-bg/50 rounded-xl">
                    <h3 className="font-medium text-brand-navy mb-2">Source Domain</h3>
                    <p className="text-sm text-brand-text">{results.sourceAnalogy}</p>
                  </div>
                  <div className="p-4 bg-scholarly-sage/5 rounded-xl">
                    <h3 className="font-medium text-scholarly-sage mb-2">Target Domain</h3>
                    <p className="text-sm text-brand-text">{results.targetAnalogy}</p>
                  </div>
                </div>

                {results.mappings && (
                  <div>
                    <h3 className="font-medium text-brand-navy mb-2">Structural Mappings:</h3>
                    <div className="space-y-2">
                      {results.mappings.map((m: any, i: number) => (
                        <div key={i} className="p-3 bg-brand-bg/50 rounded-lg flex items-center">
                          <span className="flex-1 text-sm">{m.source}</span>
                          <ArrowsRightLeftIcon className="h-4 w-4 text-scholarly-sage mx-3" />
                          <span className="flex-1 text-sm">{m.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.limitations && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h4 className="font-medium text-red-800 mb-2">Where the Analogy Breaks Down:</h4>
                    <ul className="text-sm text-brand-navy space-y-1">
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
              <div className="p-4 bg-scholarly-sage/10 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-scholarly-sage" />
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm">
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
        className="mt-8 bg-gradient-to-r from-scholarly-sage/5 to-scholarly-sage/10 rounded-2xl p-6 border border-scholarly-sage/20"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Teaching for Transfer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-scholarly-sage mb-3">Low Road (Automatic)</h4>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Practice in varied conditions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Develop automaticity through repetition</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Works for well-defined skills</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-scholarly-sage mb-3">High Road (Mindful)</h4>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Explicitly abstract principles</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Compare across multiple examples</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage">•</span>
                <span>Prompt for connections to other domains</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransferLearning;
