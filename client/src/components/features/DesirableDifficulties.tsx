import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FireIcon,
  ArrowsRightLeftIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  SparklesIcon,
  BookOpenIcon,
  ChevronRightIcon,
  PuzzlePieceIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import ConceptExplainer, { conceptData } from '../shared/ConceptExplainer';

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

const DesirableDifficulties: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'generation' | 'interleaving' | 'pretesting'>('learn');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [concepts, setConcepts] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateActivity = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/desirable-difficulties/generation-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: topic,
          contentType: 'concept'
        })
      });

      if (!response.ok) throw new Error('Failed to generate activity');
      const data = await response.json();
      setResults(data);
      toast.success('Generation activity created!');
    } catch (error) {
      toast.error('Failed to generate activity');
    } finally {
      setLoading(false);
    }
  };

  const generateInterleaving = async () => {
    if (!concepts.trim()) {
      toast.error('Please enter concepts');
      return;
    }

    setLoading(true);
    try {
      const conceptList = concepts.split('\n').filter(c => c.trim());
      const response = await fetch('/api/pedagogical/desirable-difficulties/interleaved-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concepts: conceptList,
          domain: 'general'
        })
      });

      if (!response.ok) throw new Error('Failed to generate interleaving');
      const data = await response.json();
      setResults(data);
      toast.success('Interleaved practice created!');
    } catch (error) {
      toast.error('Failed to generate interleaved practice');
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
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-scholarly-terracotta/10 rounded-xl">
            <FireIcon className="h-8 w-8 text-scholarly-terracotta" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Desirable Difficulties</h1>
            <p className="text-brand-text mt-1">Create productive struggle that enhances long-term learning</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'learn', name: 'Understand the Science', icon: BookOpenIcon },
          { id: 'generation', name: 'Generation Effect', icon: SparklesIcon },
          { id: 'interleaving', name: 'Interleaved Practice', icon: ArrowsRightLeftIcon },
          { id: 'pretesting', name: 'Pretesting', icon: QuestionMarkCircleIcon },
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
          {/* Visual Overview */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle">
            <h2 className="font-serif text-xl font-semibold text-brand-navy mb-4">
              The Paradox of Desirable Difficulties
            </h2>
            <p className="text-sm text-brand-text mb-6">
              Making learning harder in the short term can dramatically improve long-term retention and transfer.
              The key is introducing difficulties that engage deeper processing—not just busy work.
            </p>

            {/* Difficulty Types Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Generation', effect: '+25%', desc: 'Produce vs recognize', icon: SparklesIcon, color: 'terracotta' },
                { title: 'Interleaving', effect: '+43%', desc: 'Mix problem types', icon: ArrowsRightLeftIcon, color: 'sage' },
                { title: 'Spacing', effect: '+200%', desc: 'Distribute practice', icon: ClockIcon, color: 'wine' },
                { title: 'Variation', effect: '+30%', desc: 'Vary conditions', icon: PuzzlePieceIcon, color: 'slate' },
              ].map((item) => (
                <div key={item.title} className={`p-4 rounded-xl border border-scholarly-${item.color}/30 bg-scholarly-${item.color}/5 text-center`}>
                  <item.icon className={`h-8 w-8 text-scholarly-${item.color} mx-auto mb-2`} />
                  <h4 className="font-semibold text-brand-navy">{item.title}</h4>
                  <p className="text-xs text-brand-text mb-2">{item.desc}</p>
                  <span className="text-sm font-bold text-scholarly-sage">{item.effect} retention</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Techniques Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-scholarly-terracotta/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-terracotta/10 flex items-center justify-center mb-3">
                <SparklesIcon className="h-5 w-5 text-scholarly-terracotta" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Generation Effect</h3>
              <p className="text-sm text-brand-text mb-3">
                Having students generate answers rather than read them strengthens memory traces
                through effortful retrieval and encoding.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: Fill-in-blank notes instead of complete slides.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-sage/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-sage/10 flex items-center justify-center mb-3">
                <ArrowsRightLeftIcon className="h-5 w-5 text-scholarly-sage" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Interleaving</h3>
              <p className="text-sm text-brand-text mb-3">
                Mixing different problem types during practice forces discrimination and prevents
                "autopilot" practicing on similar problems.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: Mix topics in homework instead of blocking by chapter.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-wine/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-scholarly-wine/10 flex items-center justify-center mb-3">
                <QuestionMarkCircleIcon className="h-5 w-5 text-scholarly-wine" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Pretesting</h3>
              <p className="text-sm text-brand-text mb-3">
                Testing before learning primes the brain for incoming information. Even wrong
                answers enhance subsequent learning.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Try: Quiz on upcoming content before teaching it.
              </p>
            </div>
          </div>

          {/* Detailed Concept Explainer */}
          <ConceptExplainer
            {...conceptData.desirableDifficulties}
            color="terracotta"
            icon={<FireIcon className="h-6 w-6 text-scholarly-terracotta" />}
          />

          {/* Quick Start CTA */}
          <div className="bg-gradient-to-r from-scholarly-terracotta/10 to-scholarly-terracotta/5 rounded-2xl p-6 border border-scholarly-terracotta/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
                  Ready to apply this?
                </h3>
                <p className="text-sm text-brand-text">
                  Create generation activities, interleaved practice sets, or pretests for your specific content.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('generation')}
                className="flex items-center space-x-2 px-6 py-3 bg-scholarly-terracotta text-white rounded-xl font-medium hover:bg-scholarly-terracotta/90 transition-colors"
              >
                <span>Create Generation Activity</span>
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
          {activeTab === 'generation' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generation Effect Activities
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create activities where students generate answers rather than simply reading them.
                Generating information strengthens memory traces significantly more than passive review.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Topic/Content
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The causes of the French Revolution"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Activity Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'fill-blank', label: 'Fill-in-the-Blank', desc: 'Complete sentences with missing key terms' },
                      { value: 'prediction', label: 'Prediction', desc: 'Predict outcomes before learning' },
                      { value: 'explanation', label: 'Self-Explanation', desc: 'Explain concepts in own words' },
                      { value: 'elaboration', label: 'Elaborative Interrogation', desc: 'Answer why and how questions' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-start space-x-2 p-3 border border-brand-border-subtle rounded-lg hover:bg-scholarly-terracotta/5 cursor-pointer">
                        <input type="radio" name="genType" defaultChecked={type.value === 'fill-blank'} className="text-brand-navy focus:ring-brand-gold mt-1" />
                        <div>
                          <span className="text-sm font-medium">{type.label}</span>
                          <p className="text-xs text-brand-text-light">{type.desc}</p>
                        </div>
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
                {loading ? 'Generating...' : 'Create Generation Activity'}
              </button>
            </>
          )}

          {activeTab === 'interleaving' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Interleaved Practice
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Mix different problem types or topics together instead of blocking practice.
                Harder in the moment, but much better for discrimination and transfer.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Concepts to Interleave (one per line)
                  </label>
                  <textarea
                    value={concepts}
                    onChange={(e) => setConcepts(e.target.value)}
                    placeholder="Addition of fractions&#10;Subtraction of fractions&#10;Multiplication of fractions&#10;Division of fractions"
                    className="w-full h-32 p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Why Interleaving Works:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Forces discrimination between problem types</li>
                    <li>• Prevents "autopilot" practicing</li>
                    <li>• Better mimics real-world application</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={generateInterleaving}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Create Interleaved Practice'}
              </button>
            </>
          )}

          {activeTab === 'pretesting' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Pretesting
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Test students before they learn material. Even failing the pretest
                improves subsequent learning (the "pretesting effect").
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Upcoming Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis"
                    className="w-full p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Key Concepts to Cover
                  </label>
                  <textarea
                    placeholder="List main concepts that will be taught..."
                    className="w-full h-24 p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                  />
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <h4 className="font-medium text-yellow-800 mb-2">Important:</h4>
                  <p className="text-sm text-yellow-700">
                    Tell students the pretest is for learning, not grades. Normalize not knowing—that's the point!
                  </p>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                Generate Pretest
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
          {results && activeTab === 'generation' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generation Activity
              </h2>
              <div className="space-y-4">
                {results.activities?.map((activity: any, i: number) => (
                  <div key={i} className="p-4 bg-scholarly-terracotta/5 rounded-xl">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-scholarly-terracotta/10 text-scholarly-terracotta rounded mb-2">
                      {activity.type}
                    </span>
                    <p className="font-medium text-brand-navy mb-2">{activity.prompt}</p>
                    <details className="mt-2">
                      <summary className="text-sm text-brand-navy focus:ring-brand-gold cursor-pointer hover:text-scholarly-terracotta">
                        Show answer
                      </summary>
                      <p className="mt-2 text-sm text-brand-text pl-4 border-l-2 border-scholarly-terracotta/20">
                        {activity.answer}
                      </p>
                    </details>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Instructor Notes:</h4>
                  <p className="text-sm text-brand-navy">{results.instructorNotes}</p>
                </div>
              </div>
            </>
          )}

          {results && activeTab === 'interleaving' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Interleaved Practice Sequence
              </h2>
              <div className="space-y-3">
                {results.sequence?.map((item: any, i: number) => (
                  <div key={i} className="p-4 bg-brand-bg/50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-8 h-8 bg-scholarly-terracotta/10 rounded-full flex items-center justify-center text-scholarly-terracotta font-medium">
                        {i + 1}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {item.concept}
                      </span>
                    </div>
                    <p className="text-brand-navy">{item.problem}</p>
                  </div>
                ))}

                {results.interleavingRationale && (
                  <div className="p-4 bg-scholarly-terracotta/5 rounded-xl">
                    <h4 className="font-medium text-scholarly-terracotta mb-2">Why This Order:</h4>
                    <p className="text-sm text-brand-navy">{results.interleavingRationale}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-scholarly-terracotta/10 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-scholarly-terracotta" />
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm">
                Create activities that introduce desirable difficulties to enhance learning.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      )}

      {/* Desirable Difficulties Overview - only show on non-learn tabs */}
      {activeTab !== 'learn' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-scholarly-terracotta/5 to-scholarly-terracotta/10 rounded-2xl p-6 border border-scholarly-terracotta/20"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Types of Desirable Difficulties</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Generation', desc: 'Produce answers rather than recognize them', effect: '+25% retention' },
            { title: 'Interleaving', desc: 'Mix problem types during practice', effect: '+43% transfer' },
            { title: 'Spacing', desc: 'Distribute practice over time', effect: '+200% retention' },
            { title: 'Variation', desc: 'Practice in varying conditions', effect: '+30% transfer' },
          ].map((diff) => (
            <div key={diff.title} className="p-4 bg-white rounded-xl">
              <h4 className="font-medium text-brand-navy mb-1">{diff.title}</h4>
              <p className="text-xs text-brand-text mb-2">{diff.desc}</p>
              <span className="text-xs font-medium text-green-600">{diff.effect}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-text-light mt-4 text-center">
          Note: Difficulties must be desirable—they need to enhance learning, not just add work.
        </p>
      </motion.div>
      )}
    </motion.div>
  );
};

export default DesirableDifficulties;
