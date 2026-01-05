import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  EyeIcon,
  UserIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const StudentPerspective: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'mental-model' | 'readability' | 'confusion'>('mental-model');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<any>(null);

  const analyzeContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/student-perspective/novice-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'General',
          expertContent: content,
          studentLevel: 'novice'
        })
      });

      if (!response.ok) throw new Error('Failed to analyze');
      const data = await response.json();
      setResults(data);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const analyzeReadability = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/student-perspective/readability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetAudience: 'undergraduate',
          contentType: 'instructional'
        })
      });

      if (!response.ok) throw new Error('Failed to analyze');
      const data = await response.json();
      setResults(data);
      toast.success('Readability analyzed!');
    } catch (error) {
      toast.error('Failed to analyze readability');
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
          <div className="p-3 bg-slate-100 rounded-xl">
            <EyeIcon className="h-8 w-8 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Student Lens</h1>
            <p className="text-gray-600">See your content through a novice's eyes</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-800">
            <strong>Research Basis:</strong> Expert blind spot (Nathan & Petrosino, 2003) causes instructors
            to underestimate the difficulty of material. This tool helps bridge the gap between
            expert and novice understanding by simulating how students might perceive your content.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'mental-model', name: 'Novice Mental Model', icon: UserIcon },
          { id: 'readability', name: 'Readability Analysis', icon: DocumentTextIcon },
          { id: 'confusion', name: 'Confusion Prediction', icon: QuestionMarkCircleIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-600 text-white'
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
          {activeTab === 'mental-model' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Novice Mental Model Analysis
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Understand how a novice might interpret your expert-level content.
                Identify assumptions, jargon, and prerequisite gaps.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your lecture notes, explanation, or instructional text..."
                    className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Level
                  </label>
                  <div className="flex space-x-2">
                    {['Complete Novice', 'Some Background', 'Intermediate'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                          level === 'Complete Novice'
                            ? 'bg-slate-100 border-slate-500 text-slate-700'
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
                onClick={analyzeContent}
                disabled={loading}
                className="mt-6 w-full py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Through Student Lens'}
              </button>
            </>
          )}

          {activeTab === 'readability' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Readability Analysis
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Analyze the reading level of your content and get suggestions
                for making it more accessible to your target audience.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content to Analyze
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste text from your syllabus, assignment, or lecture notes..."
                    className="w-full h-48 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500">
                    <option value="undergraduate">Undergraduate (Year 1-2)</option>
                    <option value="upper-undergraduate">Upper Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="general">General Public</option>
                  </select>
                </div>
              </div>
              <button
                onClick={analyzeReadability}
                disabled={loading}
                className="mt-6 w-full py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Readability'}
              </button>
            </>
          )}

          {activeTab === 'confusion' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Confusion Prediction
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Predict where students are likely to get confused and get
                preemptive strategies to address potential misconceptions.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Content
                  </label>
                  <textarea
                    placeholder="Describe or paste the content you plan to teach..."
                    className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Known Problem Areas (optional)
                  </label>
                  <textarea
                    placeholder="Any areas where students have struggled in the past?"
                    className="w-full h-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Predict Confusion Points
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
          {results && activeTab === 'mental-model' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Novice Perspective: {results.topic}
              </h2>
              <div className="space-y-4">
                {results.noviceMentalModel && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-medium text-blue-800 mb-2">How a Novice Might See This:</h3>
                    <p className="text-sm text-gray-700">{results.noviceMentalModel}</p>
                  </div>
                )}

                {results.prerequisiteGaps && results.prerequisiteGaps.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h3 className="font-medium text-yellow-800 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 inline mr-1" />
                      Prerequisite Gaps
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {results.prerequisiteGaps.map((gap: any, i: number) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-yellow-600">•</span>
                          <div>
                            <span className="font-medium">{gap.concept}:</span> {gap.whyDifficult}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.jargonIdentified && results.jargonIdentified.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h3 className="font-medium text-red-800 mb-2">Jargon/Technical Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.jargonIdentified.map((term: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results.suggestedScaffolding && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h3 className="font-medium text-green-800 mb-2">Suggested Scaffolding</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {results.suggestedScaffolding.map((s: string, i: number) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'readability' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Readability Report
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-brand-navy">
                      {results.readabilityScore || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">Flesch-Kincaid Grade</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className={`text-3xl font-bold ${
                      results.appropriateForAudience ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {results.appropriateForAudience ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-500">Appropriate for Audience</p>
                  </div>
                </div>

                {results.issues && results.issues.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Issues Found:</h3>
                    <div className="space-y-2">
                      {results.issues.map((issue: any, i: number) => (
                        <div key={i} className="p-3 bg-yellow-50 rounded-lg">
                          <p className="font-medium text-yellow-800">{issue.type}</p>
                          <p className="text-sm text-gray-600">"{issue.original}"</p>
                          <p className="text-sm text-green-700 mt-1">→ {issue.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.simplifiedVersion && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h3 className="font-medium text-green-800 mb-2">Simplified Version:</h3>
                    <p className="text-sm text-gray-700">{results.simplifiedVersion}</p>
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
                No analysis yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                See your content from a student's perspective to identify potential barriers.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Expert Blind Spot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">The Expert Blind Spot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Why Experts Struggle to Teach Novices:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Automated skills feel "obvious"</li>
              <li>• Forgotten what it was like not to know</li>
              <li>• Rich connections mask underlying difficulty</li>
              <li>• Jargon becomes invisible</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">How to Bridge the Gap:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Watch students work through problems</li>
              <li>• Ask students to explain their thinking</li>
              <li>• Use this tool to simulate novice view</li>
              <li>• Collect and analyze student questions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentPerspective;
