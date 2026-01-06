import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';
import ExportButton from '../shared/ExportButton';

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

const Metacognition: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'strategies' | 'prompts' | 'calibration'>('strategies');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateStrategies = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/metacognition/study-strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          studentLevel: 'intermediate',
          contentType: 'conceptual'
        })
      });

      if (!response.ok) throw new Error('Failed to generate strategies');
      const data = await response.json();
      setResults(data);
      toast.success('Strategies generated!');
    } catch (error) {
      toast.error('Failed to generate strategies');
    } finally {
      setLoading(false);
    }
  };

  const generatePrompts = async () => {
    if (!context.trim()) {
      toast.error('Please enter context');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/metacognition/self-explanation-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: context,
          contentType: 'explanation'
        })
      });

      if (!response.ok) throw new Error('Failed to generate prompts');
      const data = await response.json();
      setResults(data);
      toast.success('Self-explanation prompts generated!');
    } catch (error) {
      toast.error('Failed to generate prompts');
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
          <div className="p-3 bg-scholarly-slate/10 rounded-lg">
            <QuestionMarkCircleIcon className="h-7 w-7 text-scholarly-slate" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Study Skills</h1>
            <p className="text-brand-text mt-1">Help students learn how to learn effectively</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.metacognition} color="slate" />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6 overflow-x-auto">
        {[
          { id: 'strategies', name: 'Study Strategies', icon: AcademicCapIcon },
          { id: 'prompts', name: 'Self-Explanation', icon: LightBulbIcon },
          { id: 'calibration', name: 'Calibration', icon: ChartBarIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'strategies' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Study Strategy Guide
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create personalized study strategy recommendations based on the
                topic and content type. Includes common ineffective strategies to avoid.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Topic or Subject
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Organic Chemistry, Statistics, Literary Analysis"
                    className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'conceptual', label: 'Conceptual Understanding' },
                      { value: 'procedural', label: 'Procedures/Steps' },
                      { value: 'factual', label: 'Facts/Vocabulary' },
                      { value: 'problem-solving', label: 'Problem Solving' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-center space-x-2 p-3 border border-brand-border-subtle rounded-lg hover:bg-scholarly-slate/5 cursor-pointer transition-colors">
                        <input type="radio" name="contentType" defaultChecked={type.value === 'conceptual'} className="text-brand-navy focus:ring-brand-gold" />
                        <span className="text-sm text-brand-text">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateStrategies}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Study Guide'}
              </button>
            </>
          )}

          {activeTab === 'prompts' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Self-Explanation Prompts
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate prompts that encourage students to explain material to themselves,
                one of the most effective learning strategies (Chi et al., 1989).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Content to Explain
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Paste the content, concept, or worked example that students should explain to themselves..."
                    className="w-full h-40 p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
              </div>
              <button
                onClick={generatePrompts}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Prompts'}
              </button>
            </>
          )}

          {activeTab === 'calibration' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Calibration Activities
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Help students accurately assess their own understanding. Poor calibration
                (thinking you know something when you don't) is a major barrier to learning.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Assessment Context
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Before exam on Chapter 5"
                    className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Key Topics
                  </label>
                  <textarea
                    placeholder="List the main topics to assess (one per line)"
                    className="w-full h-32 p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Calibration Activity
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {results && activeTab === 'strategies' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Study Strategy Guide
                </h2>
                <ExportButton data={results} filename="study-strategies" title="Export" />
              </div>
              <div className="space-y-4">
                {results.effectiveStrategies && (
                  <div>
                    <h3 className="font-medium text-scholarly-sage mb-2">
                      Effective Strategies:
                    </h3>
                    <div className="space-y-3">
                      {results.effectiveStrategies.map((strategy: any, i: number) => (
                        <div key={i} className="p-3 bg-scholarly-sage/5 rounded-lg border-l-3 border-scholarly-sage">
                          <p className="font-medium text-brand-navy">{strategy.name}</p>
                          <p className="text-sm text-brand-text mt-1">{strategy.howToImplement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.ineffectiveStrategies && (
                  <div>
                    <h3 className="font-medium text-scholarly-terracotta mb-2">
                      Strategies to Avoid:
                    </h3>
                    <div className="space-y-3">
                      {results.ineffectiveStrategies.map((strategy: any, i: number) => (
                        <div key={i} className="p-3 bg-scholarly-terracotta/5 rounded-lg border-l-3 border-scholarly-terracotta">
                          <p className="font-medium text-brand-navy">{strategy.name}</p>
                          <p className="text-sm text-brand-text mt-1">{strategy.whyIneffective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'prompts' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Self-Explanation Prompts
                </h2>
                <ExportButton data={results} filename="self-explanation-prompts" title="Export" />
              </div>
              <div className="space-y-3">
                {results.prompts?.map((prompt: any, i: number) => (
                  <div key={i} className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                    <p className="font-medium text-brand-navy text-sm">{prompt.prompt}</p>
                    <p className="text-sm text-brand-text-light mt-2">
                      <span className="font-medium text-brand-navy">Purpose:</span> {prompt.targetedMisunderstanding}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-scholarly-slate/10 rounded-full mb-4">
                <QuestionMarkCircleIcon className="h-10 w-10 text-scholarly-slate" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                Ready to Build Study Skills
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm mb-4">
                Generate metacognitive tools to help students become more effective, self-directed learners.
              </p>
              <div className="flex items-center space-x-2 text-xs text-scholarly-slate">
                <span className="w-2 h-2 bg-scholarly-slate rounded-full animate-pulse"></span>
                <span>Based on self-regulated learning research</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Metacognitive Framework */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-r from-scholarly-slate/5 to-scholarly-slate/10 rounded-xl p-6 border border-scholarly-slate/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-slate" />
          <h3 className="font-medium text-brand-navy">The Self-Regulated Learning Cycle</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <div className="w-10 h-10 bg-scholarly-slate/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-scholarly-slate font-bold">1</span>
            </div>
            <h4 className="font-medium text-brand-navy mb-1">Plan</h4>
            <p className="text-sm text-brand-text">
              "What do I already know? What strategies will I use? How much time do I need?"
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <div className="w-10 h-10 bg-scholarly-slate/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-scholarly-slate font-bold">2</span>
            </div>
            <h4 className="font-medium text-brand-navy mb-1">Monitor</h4>
            <p className="text-sm text-brand-text">
              "Am I understanding this? Is my strategy working? What's confusing?"
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <div className="w-10 h-10 bg-scholarly-slate/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-scholarly-slate font-bold">3</span>
            </div>
            <h4 className="font-medium text-brand-navy mb-1">Evaluate</h4>
            <p className="text-sm text-brand-text">
              "Did I meet my goals? What would I do differently? What did I learn about learning?"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Metacognition;
