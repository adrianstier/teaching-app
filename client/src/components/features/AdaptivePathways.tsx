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
            <AdjustmentsHorizontalIcon className="h-7 w-7 text-scholarly-sage" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Adaptive Pathways</h1>
            <p className="text-brand-text mt-1">Personalized learning paths based on student readiness</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.adaptivePathways} color="sage" />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'diagnostic', name: 'Diagnostic Assessment', icon: ChartBarIcon },
          { id: 'pathways', name: 'Learning Pathways', icon: MapIcon },
          { id: 'challenge', name: 'Challenge Problems', icon: SparklesIcon },
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
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'diagnostic' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Create Diagnostic Assessment
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate a diagnostic assessment to determine student readiness
                and identify prerequisite gaps before starting new material.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Target Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Quadratic Equations"
                    className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    value={prerequisites}
                    onChange={(e) => setPrerequisites(e.target.value)}
                    placeholder="Linear equations&#10;Order of operations&#10;Factoring basics"
                    className="w-full h-32 p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Assessment Purpose
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'placement', label: 'Placement' },
                      { value: 'prerequisite-check', label: 'Prerequisite Check' },
                      { value: 'readiness', label: 'Readiness Assessment' },
                      { value: 'gap-analysis', label: 'Gap Analysis' },
                    ].map((purpose) => (
                      <label key={purpose.value} className="flex items-center space-x-2 p-2 border border-brand-border-subtle rounded-lg hover:bg-scholarly-sage/5 cursor-pointer transition-colors">
                        <input type="radio" name="purpose" defaultChecked={purpose.value === 'placement'} className="text-brand-navy focus:ring-brand-gold" />
                        <span className="text-sm text-brand-text">{purpose.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateDiagnostic}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Diagnostic'}
              </button>
            </>
          )}

          {activeTab === 'pathways' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Learning Pathway
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create personalized learning pathways with branching based on
                student performance and preferences.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Learning Goal
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Master solving quadratic equations"
                    className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Starting Level
                  </label>
                  <div className="flex space-x-2">
                    {['Novice', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors text-sm ${
                          level === 'Intermediate'
                            ? 'bg-scholarly-sage/10 border-scholarly-sage text-scholarly-sage font-medium'
                            : 'border-brand-border-subtle text-brand-text hover:bg-brand-bg'
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
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Pathway'}
              </button>
            </>
          )}

          {activeTab === 'challenge' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Challenge Problem Generator
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Generate extension problems for students who have mastered
                the core material and need additional challenge.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Core Topic Mastered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Basic calculus derivatives"
                    className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Challenge Type
                  </label>
                  <select className="w-full p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50">
                    <option value="extension">Extension (deeper exploration)</option>
                    <option value="transfer">Transfer (new contexts)</option>
                    <option value="synthesis">Synthesis (combining topics)</option>
                    <option value="research">Research-oriented</option>
                  </select>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Challenge Problems
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {results && activeTab === 'diagnostic' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4">
                Diagnostic Assessment
              </h2>
              <div className="space-y-4">
                {results.questions?.map((q: any, i: number) => (
                  <div key={i} className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-scholarly-sage">
                        Q{i + 1}: {q.prerequisiteTested}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        q.difficulty === 'easy' ? 'bg-scholarly-sage/10 text-scholarly-sage' :
                        q.difficulty === 'medium' ? 'bg-brand-gold/10 text-brand-gold-dark' :
                        'bg-scholarly-terracotta/10 text-scholarly-terracotta'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-brand-navy text-sm">{q.question}</p>
                  </div>
                ))}
                {results.scoringGuide && (
                  <div className="p-4 bg-scholarly-sage/5 rounded-lg border-l-3 border-scholarly-sage">
                    <h4 className="font-medium text-scholarly-sage mb-2">Scoring Guide:</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(results.scoringGuide).map(([range, rec]: [string, any]) => (
                        <div key={range} className="flex justify-between">
                          <span className="text-brand-navy">{range}</span>
                          <span className="text-brand-text">{rec}</span>
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
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4">
                Learning Pathway
              </h2>
              <div className="space-y-4">
                {results.nodes?.map((node: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {i + 1}
                      </div>
                      <div className="flex-1 p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                        <h4 className="font-medium text-brand-navy text-sm">{node.title}</h4>
                        <p className="text-sm text-brand-text mt-1">{node.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-brand-text-light">
                          <span>Duration: {node.estimatedTime}</span>
                          <span>Mastery: {node.masteryThreshold}%</span>
                        </div>
                      </div>
                    </div>
                    {i < results.nodes.length - 1 && (
                      <div className="ml-4 h-4 w-0.5 bg-brand-border"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-scholarly-sage/10 rounded-full mb-4">
                <AdjustmentsHorizontalIcon className="h-10 w-10 text-scholarly-sage" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                Ready to Personalize Learning
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm mb-4">
                Create adaptive learning tools to personalize instruction for each student's readiness level.
              </p>
              <div className="flex items-center space-x-2 text-xs text-scholarly-sage">
                <span className="w-2 h-2 bg-scholarly-sage rounded-full animate-pulse"></span>
                <span>Based on Zone of Proximal Development research</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Differentiation Framework */}
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-r from-scholarly-sage/5 to-scholarly-sage/10 rounded-xl p-6 border border-scholarly-sage/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-sage" />
          <h3 className="font-medium text-brand-navy">Zone of Proximal Development</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center px-4 py-3 bg-white rounded-lg flex-1 mx-2 border border-brand-border-subtle">
            <ArrowTrendingUpIcon className="h-6 w-6 text-scholarly-sage mx-auto mb-1" />
            <p className="text-sm font-medium text-brand-navy">Can Do Alone</p>
            <p className="text-xs text-brand-text-light">Comfort Zone</p>
          </div>
          <div className="text-center px-4 py-3 bg-scholarly-sage/10 rounded-lg flex-1 mx-2 border-2 border-scholarly-sage">
            <SparklesIcon className="h-6 w-6 text-scholarly-sage mx-auto mb-1" />
            <p className="text-sm font-medium text-brand-navy">ZPD</p>
            <p className="text-xs text-scholarly-sage">Optimal Learning</p>
          </div>
          <div className="text-center px-4 py-3 bg-white rounded-lg flex-1 mx-2 border border-brand-border-subtle">
            <AcademicCapIcon className="h-6 w-6 text-scholarly-terracotta mx-auto mb-1" />
            <p className="text-sm font-medium text-brand-navy">Too Difficult</p>
            <p className="text-xs text-brand-text-light">Frustration Zone</p>
          </div>
        </div>
        <p className="text-sm text-brand-text mt-4 text-center">
          Adaptive pathways keep students in the ZPD—challenged but not frustrated—where learning is maximized.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AdaptivePathways;
