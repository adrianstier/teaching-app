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
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const DesirableDifficulties: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'generation' | 'interleaving' | 'pretesting'>('generation');
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <FireIcon className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Desirable Difficulties</h1>
            <p className="text-gray-600">Create productive struggle that enhances long-term learning</p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-sm text-orange-800">
            <strong>Research Basis:</strong> Bjork's research shows that conditions making learning
            harder in the short term often enhance long-term retention and transfer.
            The key is difficulties that require deeper processing, not just extra work.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'generation', name: 'Generation Effect', icon: SparklesIcon },
          { id: 'interleaving', name: 'Interleaved Practice', icon: ArrowsRightLeftIcon },
          { id: 'pretesting', name: 'Pretesting', icon: QuestionMarkCircleIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white'
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
          {activeTab === 'generation' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generation Effect Activities
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create activities where students generate answers rather than simply reading them.
                Generating information strengthens memory traces significantly more than passive review.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic/Content
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The causes of the French Revolution"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'fill-blank', label: 'Fill-in-the-Blank', desc: 'Complete sentences with missing key terms' },
                      { value: 'prediction', label: 'Prediction', desc: 'Predict outcomes before learning' },
                      { value: 'explanation', label: 'Self-Explanation', desc: 'Explain concepts in own words' },
                      { value: 'elaboration', label: 'Elaborative Interrogation', desc: 'Answer why and how questions' },
                    ].map((type) => (
                      <label key={type.value} className="flex items-start space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer">
                        <input type="radio" name="genType" defaultChecked={type.value === 'fill-blank'} className="text-orange-600 mt-1" />
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
                onClick={generateActivity}
                disabled={loading}
                className="mt-6 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
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
              <p className="text-sm text-gray-600 mb-4">
                Mix different problem types or topics together instead of blocking practice.
                Harder in the moment, but much better for discrimination and transfer.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepts to Interleave (one per line)
                  </label>
                  <textarea
                    value={concepts}
                    onChange={(e) => setConcepts(e.target.value)}
                    placeholder="Addition of fractions&#10;Subtraction of fractions&#10;Multiplication of fractions&#10;Division of fractions"
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
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
                className="mt-6 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
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
              <p className="text-sm text-gray-600 mb-4">
                Test students before they learn material. Even failing the pretest
                improves subsequent learning (the "pretesting effect").
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upcoming Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Concepts to Cover
                  </label>
                  <textarea
                    placeholder="List main concepts that will be taught..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 resize-none"
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
                className="mt-6 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
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
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          {results && activeTab === 'generation' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generation Activity
              </h2>
              <div className="space-y-4">
                {results.activities?.map((activity: any, i: number) => (
                  <div key={i} className="p-4 bg-orange-50 rounded-xl">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded mb-2">
                      {activity.type}
                    </span>
                    <p className="font-medium text-brand-navy mb-2">{activity.prompt}</p>
                    <details className="mt-2">
                      <summary className="text-sm text-orange-600 cursor-pointer hover:text-orange-700">
                        Show answer
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-orange-200">
                        {activity.answer}
                      </p>
                    </details>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Instructor Notes:</h4>
                  <p className="text-sm text-gray-700">{results.instructorNotes}</p>
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
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-medium">
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
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <h4 className="font-medium text-orange-800 mb-2">Why This Order:</h4>
                    <p className="text-sm text-gray-700">{results.interleavingRationale}</p>
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
                Create activities that introduce desirable difficulties to enhance learning.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Desirable Difficulties Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100"
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
              <p className="text-xs text-gray-600 mb-2">{diff.desc}</p>
              <span className="text-xs font-medium text-green-600">{diff.effect}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Note: Difficulties must be desirable—they need to enhance learning, not just add work.
        </p>
      </motion.div>
    </div>
  );
};

export default DesirableDifficulties;
