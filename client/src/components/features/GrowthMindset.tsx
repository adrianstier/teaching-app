import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  RocketLaunchIcon,
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const GrowthMindset: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'feedback' | 'attribution'>('messages');
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-pink-100 rounded-xl">
            <RocketLaunchIcon className="h-8 w-8 text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Growth Mindset</h1>
            <p className="text-gray-600">Foster motivation and productive beliefs about learning</p>
          </div>
        </div>

        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
          <p className="text-sm text-pink-800">
            <strong>Research Basis:</strong> Dweck's research shows that beliefs about intelligence affect motivation
            and achievement. Students with a growth mindset (intelligence is malleable) outperform those
            with fixed mindsets, especially when facing challenges.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'messages', name: 'Struggle Messages', icon: HeartIcon },
          { id: 'feedback', name: 'Process Praise', icon: ChatBubbleLeftEllipsisIcon },
          { id: 'attribution', name: 'Attribution Training', icon: LightBulbIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-pink-600 text-white'
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
          {activeTab === 'messages' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Struggle Messages
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create messages that normalize struggle, frame challenges as growth opportunities,
                and encourage persistence without toxic positivity.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Struggle Context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the challenge students are facing... e.g., 'Students are frustrated after failing their first calculus exam'"
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'normalizing', label: 'Normalizing Struggle', desc: '"This is supposed to be hard"' },
                      { value: 'reframing', label: 'Reframing Failure', desc: '"Mistakes are learning data"' },
                      { value: 'not-yet', label: '"Not Yet" Language', desc: '"You haven\'t mastered it yet"' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-start space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-pink-50 cursor-pointer">
                        <input type="radio" name="messageType" defaultChecked={type.value === 'normalizing'} className="text-pink-600 mt-1" />
                        <div>
                          <span className="text-sm font-medium">{type.label}</span>
                          <p className="text-xs text-gray-500">{type.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateMessages}
                disabled={loading}
                className="mt-6 w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Messages'}
              </button>
            </>
          )}

          {activeTab === 'feedback' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Process Praise
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create feedback that praises effort, strategies, and progress rather than
                innate ability. Process praise builds growth mindset and resilience.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Work or Achievement
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe what the student accomplished... e.g., 'Student improved from 65% to 82% on the second exam'"
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <h4 className="font-medium text-yellow-800 mb-2">Praise to Avoid:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• "You're so smart!" (praises fixed trait)</li>
                    <li>• "You're a natural!" (suggests innate ability)</li>
                    <li>• "This was easy for you!" (devalues effort)</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={generateFeedback}
                disabled={loading}
                className="mt-6 w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Process Praise'}
              </button>
            </>
          )}

          {activeTab === 'attribution' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Attribution Training
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Help students attribute success and failure to controllable factors
                (effort, strategy) rather than uncontrollable ones (ability, luck).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario
                  </label>
                  <textarea
                    placeholder="Describe a success or failure scenario to analyze... e.g., 'Student says they did well because the test was easy'"
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Attribution Pattern
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500">
                    <option value="ability">Ability-focused ("I'm just not good at this")</option>
                    <option value="luck">Luck-focused ("I got lucky/unlucky")</option>
                    <option value="difficulty">Task difficulty ("It was too hard")</option>
                    <option value="external">External factors ("The teacher doesn't like me")</option>
                  </select>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                Generate Attribution Reframe
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
          {results && activeTab === 'messages' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Growth Mindset Messages
              </h2>
              <div className="space-y-4">
                {results.messages?.map((msg: any, i: number) => (
                  <div key={i} className="p-4 bg-pink-50 rounded-xl">
                    <p className="text-brand-navy font-medium mb-2">"{msg.message}"</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                        {msg.type}
                      </span>
                      <span>{msg.rationale}</span>
                    </div>
                  </div>
                ))}

                {results.whatToAvoid && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h4 className="font-medium text-red-800 mb-2">What to Avoid:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {results.whatToAvoid.map((item: string, i: number) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'feedback' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Process-Focused Feedback
              </h2>
              <div className="space-y-4">
                {results.feedback?.map((fb: any, i: number) => (
                  <div key={i} className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <p className="text-brand-navy font-medium mb-2">"{fb.praise}"</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Process highlighted:</span> {fb.processHighlighted}
                    </p>
                  </div>
                ))}

                {results.comparisonToAvoid && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">Compare:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-red-700 mb-1">Instead of:</p>
                        <p className="text-gray-600">{results.comparisonToAvoid}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-700 mb-1">Say:</p>
                        <p className="text-gray-600">{results.feedback?.[0]?.praise}</p>
                      </div>
                    </div>
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
                Create messages and feedback that foster a growth mindset in your students.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mindset Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Fixed vs. Growth Mindset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-xl border-l-4 border-red-400">
            <h4 className="font-medium text-red-700 mb-3">Fixed Mindset</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Avoids challenges</li>
              <li>• Gives up easily</li>
              <li>• Sees effort as fruitless</li>
              <li>• Ignores useful feedback</li>
              <li>• Threatened by others' success</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-xl border-l-4 border-green-400">
            <h4 className="font-medium text-green-700 mb-3">Growth Mindset</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Embraces challenges</li>
              <li>• Persists despite setbacks</li>
              <li>• Sees effort as path to mastery</li>
              <li>• Learns from criticism</li>
              <li>• Inspired by others' success</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GrowthMindset;
