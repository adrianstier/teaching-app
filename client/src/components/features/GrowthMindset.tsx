import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  RocketLaunchIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  LightBulbIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  BoltIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import ConceptExplainer, { conceptData } from '../shared/ConceptExplainer';
import ConceptDiagram from '../shared/ConceptDiagram';
import ExportButton from '../shared/ExportButton';

interface Props {
  sessionId: string;
}

const GrowthMindset: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'messages' | 'feedback' | 'attribution'>('learn');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateMessages = async () => {
    if (!context.trim()) {
      toast.error('Please enter a context');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/growth-mindset/struggle-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          struggleContext: context,
          studentProfile: { mindsetIndicators: 'mixed' },
          messageType: 'normalizing-struggle'
        })
      });

      if (!response.ok) throw new Error('Failed to generate messages');
      const data = await response.json();
      setResults(data);
      toast.success('Messages generated!');
    } catch (error) {
      toast.error('Failed to generate messages');
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = async () => {
    if (!context.trim()) {
      toast.error('Please enter work to give feedback on');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/growth-mindset/praise-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentWork: context,
          processElements: []
        })
      });

      if (!response.ok) throw new Error('Failed to generate feedback');
      const data = await response.json();
      setResults(data);
      toast.success('Feedback generated!');
    } catch (error) {
      toast.error('Failed to generate feedback');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-scholarly-wine/10 rounded-xl">
            <RocketLaunchIcon className="h-8 w-8 text-scholarly-wine" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Growth Mindset</h1>
            <p className="text-brand-text mt-1">Foster motivation and productive beliefs about learning</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'learn', name: 'Understand the Science', icon: BookOpenIcon },
          { id: 'messages', name: 'Struggle Messages', icon: HeartIcon },
          { id: 'feedback', name: 'Process Praise', icon: ChatBubbleLeftEllipsisIcon },
          { id: 'attribution', name: 'Attribution Training', icon: LightBulbIcon },
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

      {/* Learn Tab - Enhanced Concept Presentation */}
      {activeTab === 'learn' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Visual Diagram */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle">
            <h2 className="font-serif text-xl font-semibold text-brand-navy mb-4">
              Fixed vs. Growth Mindset
            </h2>
            <p className="text-sm text-brand-text mb-6">
              Carol Dweck's research shows that beliefs about intelligence are powerful. Students who believe abilities can be developed
              through effort and learning outperform those who think intelligence is fixed.
            </p>
            <div className="max-w-2xl mx-auto">
              <ConceptDiagram type="growthMindsetComparison" animated={true} />
            </div>
          </div>

          {/* Key Strategies Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-scholarly-wine/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-wine/10 flex items-center justify-center mb-3">
                <HeartIcon className="h-5 w-5 text-scholarly-wine" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Normalize Struggle</h3>
              <p className="text-sm text-brand-text mb-3">
                Help students see that struggle is not a sign of failure, but a normal and necessary part of learning something new.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: "This is supposed to be hard—that's how brains grow."
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-sage/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-sage/10 flex items-center justify-center mb-3">
                <BoltIcon className="h-5 w-5 text-scholarly-sage" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Praise the Process</h3>
              <p className="text-sm text-brand-text mb-3">
                Praise effort, strategy, and progress rather than innate ability. "You're so smart" can actually undermine motivation.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: "Your strategy of breaking it into steps really worked."
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-terracotta/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-terracotta/10 flex items-center justify-center mb-3">
                <AcademicCapIcon className="h-5 w-5 text-scholarly-terracotta" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Use "Not Yet"</h3>
              <p className="text-sm text-brand-text mb-3">
                Adding "yet" to statements reframes failure as temporary: "I don't understand this" becomes "I don't understand this yet."
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: "You haven't mastered it yet—what's your next step?"
              </p>
            </div>
          </div>

          {/* Detailed Concept Explainer */}
          <ConceptExplainer
            {...conceptData.growthMindset}
            color="wine"
            icon={<RocketLaunchIcon className="h-6 w-6 text-scholarly-wine" />}
          />

          {/* Quick Start CTA */}
          <div className="bg-gradient-to-r from-scholarly-wine/10 to-scholarly-wine/5 rounded-2xl p-6 border border-scholarly-wine/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
                  Ready to apply this?
                </h3>
                <p className="text-sm text-brand-text">
                  Generate messages that normalize struggle or create feedback that praises the learning process.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('messages')}
                className="flex items-center space-x-2 px-6 py-3 bg-scholarly-wine text-white rounded-xl font-medium hover:bg-scholarly-wine/90 transition-colors"
              >
                <span>Create Struggle Messages</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {activeTab !== 'learn' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'messages' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Struggle Messages
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create messages that normalize struggle, frame challenges as growth opportunities,
                and encourage persistence without toxic positivity.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Struggle Context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the challenge students are facing... e.g., 'Students are frustrated after failing their first calculus exam'"
                    className="w-full h-32 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Message Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'normalizing', label: 'Normalizing Struggle', desc: '"This is supposed to be hard"' },
                      { value: 'reframing', label: 'Reframing Failure', desc: '"Mistakes are learning data"' },
                      { value: 'not-yet', label: '"Not Yet" Language', desc: '"You haven\'t mastered it yet"' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-start space-x-3 p-3 border border-brand-border-subtle rounded-lg hover:bg-brand-bg/50 cursor-pointer transition-colors group">
                        <input type="radio" name="messageType" defaultChecked={type.value === 'normalizing'} className="text-brand-navy focus:ring-brand-gold mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-brand-navy group-hover:text-brand-navy-light transition-colors">{type.label}</span>
                          <p className="text-xs text-brand-text-light">{type.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateMessages}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Messages'}
              </button>
            </>
          )}

          {activeTab === 'feedback' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Process Praise
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create feedback that praises effort, strategies, and progress rather than
                innate ability. Process praise builds growth mindset and resilience.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Student Work or Achievement
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe what the student accomplished... e.g., 'Student improved from 65% to 82% on the second exam'"
                    className="w-full h-32 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div className="p-4 bg-scholarly-terracotta/10 rounded-lg border border-scholarly-terracotta/20">
                  <h4 className="font-medium text-scholarly-terracotta mb-2 text-sm">Praise to Avoid:</h4>
                  <ul className="text-sm text-brand-text space-y-1">
                    <li className="flex items-start space-x-2">
                      <span className="text-scholarly-terracotta mt-0.5">•</span>
                      <span>"You're so smart!" (praises fixed trait)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-scholarly-terracotta mt-0.5">•</span>
                      <span>"You're a natural!" (suggests innate ability)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-scholarly-terracotta mt-0.5">•</span>
                      <span>"This was easy for you!" (devalues effort)</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={generateFeedback}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Process Praise'}
              </button>
            </>
          )}

          {activeTab === 'attribution' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Attribution Training
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Help students attribute success and failure to controllable factors
                (effort, strategy) rather than uncontrollable ones (ability, luck).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Scenario
                  </label>
                  <textarea
                    placeholder="Describe a success or failure scenario to analyze... e.g., 'Student says they did well because the test was easy'"
                    className="w-full h-32 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Current Attribution Pattern
                  </label>
                  <select className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50">
                    <option value="ability">Ability-focused ("I'm just not good at this")</option>
                    <option value="luck">Luck-focused ("I got lucky/unlucky")</option>
                    <option value="difficulty">Task difficulty ("It was too hard")</option>
                    <option value="external">External factors ("The teacher doesn't like me")</option>
                  </select>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Attribution Reframe
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {results && activeTab === 'messages' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Growth Mindset Messages
                </h2>
                <ExportButton data={results} filename="growth-mindset-messages" title="Export" />
              </div>
              <div className="space-y-4">
                {results.messages?.map((msg: any, i: number) => (
                  <div key={i} className="p-4 bg-scholarly-wine/10 rounded-lg border border-scholarly-wine/20">
                    <p className="text-brand-navy font-medium mb-2">"{msg.message}"</p>
                    <div className="flex items-center space-x-2 text-sm text-brand-text-light">
                      <span className="px-2 py-0.5 bg-scholarly-wine/15 text-scholarly-wine rounded text-xs font-medium">
                        {msg.type}
                      </span>
                      <span>{msg.rationale}</span>
                    </div>
                  </div>
                ))}

                {results.whatToAvoid && (
                  <div className="p-4 bg-scholarly-terracotta/10 rounded-lg border border-scholarly-terracotta/20">
                    <h4 className="font-medium text-scholarly-terracotta mb-2 text-sm">What to Avoid:</h4>
                    <ul className="text-sm text-brand-text space-y-1">
                      {results.whatToAvoid.map((item: string, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-scholarly-terracotta mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'feedback' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Process-Focused Feedback
                </h2>
                <ExportButton data={results} filename="process-praise" title="Export" />
              </div>
              <div className="space-y-4">
                {results.feedback?.map((fb: any, i: number) => (
                  <div key={i} className="p-4 bg-scholarly-sage/10 rounded-lg border-l-3 border-scholarly-sage">
                    <p className="text-brand-navy font-medium mb-2">"{fb.praise}"</p>
                    <p className="text-sm text-brand-text-light">
                      <span className="font-medium text-brand-text">Process highlighted:</span> {fb.processHighlighted}
                    </p>
                  </div>
                ))}

                {results.comparisonToAvoid && (
                  <div className="p-4 bg-brand-bg/50 rounded-lg border border-brand-border-subtle">
                    <h4 className="font-medium text-brand-navy mb-3 text-sm">Compare:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-scholarly-terracotta/10 rounded-lg border border-scholarly-terracotta/20">
                        <p className="font-medium text-scholarly-terracotta mb-1 text-xs uppercase tracking-wide">Instead of:</p>
                        <p className="text-brand-text">{results.comparisonToAvoid}</p>
                      </div>
                      <div className="p-3 bg-scholarly-sage/10 rounded-lg border border-scholarly-sage/20">
                        <p className="font-medium text-scholarly-sage mb-1 text-xs uppercase tracking-wide">Say:</p>
                        <p className="text-brand-text">{results.feedback?.[0]?.praise}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-scholarly-wine/10 rounded-full mb-4">
                <SparklesIcon className="h-10 w-10 text-scholarly-wine" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                Ready to Foster Growth Mindset
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm mb-4">
                Create messages and feedback that help students see challenges as opportunities for growth, not threats to their ability.
              </p>
              <div className="flex items-center space-x-2 text-xs text-scholarly-wine">
                <span className="w-2 h-2 bg-scholarly-wine rounded-full animate-pulse"></span>
                <span>Based on Carol Dweck's research</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      )}

      {/* Mindset Comparison - only show on non-learn tabs */}
      {activeTab !== 'learn' && (
      <motion.div
        variants={itemVariants}
        className="mt-8 bg-gradient-to-r from-scholarly-wine/5 to-scholarly-wine/10 rounded-xl p-6 border border-scholarly-wine/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-wine" />
          <h3 className="font-medium text-brand-navy">Fixed vs. Growth Mindset</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg border-l-3 border-scholarly-terracotta">
            <h4 className="font-medium text-scholarly-terracotta mb-3 text-sm">Fixed Mindset</h4>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-terracotta mt-0.5">•</span>
                <span>Avoids challenges</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-terracotta mt-0.5">•</span>
                <span>Gives up easily</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-terracotta mt-0.5">•</span>
                <span>Sees effort as fruitless</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-terracotta mt-0.5">•</span>
                <span>Ignores useful feedback</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-terracotta mt-0.5">•</span>
                <span>Threatened by others' success</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg border-l-3 border-scholarly-sage">
            <h4 className="font-medium text-scholarly-sage mb-3 text-sm">Growth Mindset</h4>
            <ul className="space-y-2 text-sm text-brand-text">
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage mt-0.5">•</span>
                <span>Embraces challenges</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage mt-0.5">•</span>
                <span>Persists despite setbacks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage mt-0.5">•</span>
                <span>Sees effort as path to mastery</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage mt-0.5">•</span>
                <span>Learns from criticism</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-scholarly-sage mt-0.5">•</span>
                <span>Inspired by others' success</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      )}
    </motion.div>
  );
};

export default GrowthMindset;
