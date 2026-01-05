import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  GlobeAltIcon,
  UserGroupIcon,
  LanguageIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  EyeIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const InclusiveDesign: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'examples' | 'udl'>('audit');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<any>(null);

  const runAudit = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to audit');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/inclusive/check-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          contentType: 'lecture',
          checkDimensions: ['cultural', 'accessibility', 'representation', 'language']
        })
      });

      if (!response.ok) throw new Error('Failed to run audit');
      const data = await response.json();
      setResults(data);
      toast.success('Inclusivity audit complete!');
    } catch (error) {
      toast.error('Failed to complete audit');
    } finally {
      setLoading(false);
    }
  };

  const generateExamples = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/inclusive/diverse-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: topic,
          domain: 'general',
          diversityDimensions: ['cultural', 'geographic', 'historical', 'gender', 'socioeconomic']
        })
      });

      if (!response.ok) throw new Error('Failed to generate examples');
      const data = await response.json();
      setResults(data);
      toast.success('Diverse examples generated!');
    } catch (error) {
      toast.error('Failed to generate examples');
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
          <div className="p-3 bg-teal-100 rounded-xl">
            <GlobeAltIcon className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Inclusive Design</h1>
            <p className="text-gray-600">Create materials that work for all learners</p>
          </div>
        </div>

        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-sm text-teal-800">
            <strong>Research Basis:</strong> Universal Design for Learning (CAST, 2018) shows that
            designing for diverse learners from the start benefits everyone. Inclusive practices
            improve outcomes across student populations, not just marginalized groups.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'audit', name: 'Content Audit', icon: CheckCircleIcon },
          { id: 'examples', name: 'Diverse Examples', icon: UserGroupIcon },
          { id: 'udl', name: 'UDL Guidelines', icon: EyeIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white'
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
          {activeTab === 'audit' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Inclusivity Audit
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Check your content for potential barriers, representation gaps,
                and opportunities to be more inclusive.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content to Audit
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your lecture content, syllabus section, or assignment description..."
                    className="w-full h-48 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'cultural', label: 'Cultural Inclusivity' },
                      { value: 'accessibility', label: 'Accessibility' },
                      { value: 'representation', label: 'Representation' },
                      { value: 'language', label: 'Inclusive Language' },
                    ].map((dim) => (
                      <label key={dim.value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-teal-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="text-teal-600 rounded" />
                        <span className="text-sm">{dim.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={runAudit}
                disabled={loading}
                className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run Inclusivity Audit'}
              </button>
            </>
          )}

          {activeTab === 'examples' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Diverse Examples
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create examples that reflect diverse cultures, perspectives,
                and lived experiences to help all students see themselves in the material.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept/Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Supply and demand"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diversity Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Cultural', 'Geographic', 'Historical', 'Gender', 'Socioeconomic', 'Ability'].map((dim) => (
                      <label key={dim} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-teal-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="text-teal-600 rounded" />
                        <span className="text-sm">{dim}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generateExamples}
                disabled={loading}
                className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Diverse Examples'}
              </button>
            </>
          )}

          {activeTab === 'udl' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                UDL Guidelines
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Apply Universal Design for Learning principles to create flexible
                learning experiences that accommodate all learners.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Learning Activity
                  </label>
                  <textarea
                    placeholder="Describe the activity you want to make more inclusive..."
                    className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UDL Principle Focus
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'engagement', label: 'Engagement', desc: 'Multiple ways to engage learners' },
                      { value: 'representation', label: 'Representation', desc: 'Multiple ways to present content' },
                      { value: 'expression', label: 'Action & Expression', desc: 'Multiple ways to demonstrate learning' },
                    ].map((principle) => (
                      <label key={principle.value} className="flex items-start space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-teal-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="text-teal-600 rounded mt-1" />
                        <div>
                          <span className="text-sm font-medium">{principle.label}</span>
                          <p className="text-xs text-gray-500">{principle.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                Generate UDL Recommendations
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
          {results && activeTab === 'audit' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Audit Results
              </h2>
              <div className="mb-4 p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-teal-800">Overall Score</span>
                  <span className={`text-2xl font-bold ${
                    results.overallScore >= 80 ? 'text-green-600' :
                    results.overallScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {results.overallScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      results.overallScore >= 80 ? 'bg-green-500' :
                      results.overallScore >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${results.overallScore}%` }}
                  />
                </div>
              </div>

              {results.issues && results.issues.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Issues Found:</h3>
                  <div className="space-y-2">
                    {results.issues.map((issue: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg border-l-4 ${
                        issue.severity === 'high' ? 'bg-red-50 border-red-500' :
                        issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <p className="font-medium text-gray-800">{issue.issue}</p>
                        <p className="text-sm text-gray-600 mt-1">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.strengths && results.strengths.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Strengths:</h3>
                  <div className="space-y-2">
                    {results.strengths.map((s: string, i: number) => (
                      <div key={i} className="p-3 bg-green-50 rounded-lg flex items-start space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {results && activeTab === 'examples' && results.examples && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Diverse Examples: {results.concept}
              </h2>
              <div className="space-y-4">
                {results.examples.map((ex: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded">
                        {ex.diversityDimension}
                      </span>
                      <span className="text-sm text-gray-500">{ex.culturalContext}</span>
                    </div>
                    <p className="text-brand-navy">{ex.example}</p>
                    <p className="text-sm text-gray-600 mt-2">{ex.connectionToContent}</p>
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
                Create more inclusive materials that work for all your students.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* UDL Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Universal Design for Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <HandRaisedIcon className="h-5 w-5 text-teal-600" />
              <h4 className="font-medium text-brand-navy">Engagement</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Offer choices in how to approach tasks</li>
              <li>• Foster collaboration and community</li>
              <li>• Provide mastery-oriented feedback</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <EyeIcon className="h-5 w-5 text-teal-600" />
              <h4 className="font-medium text-brand-navy">Representation</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Offer multiple formats (text, audio, visual)</li>
              <li>• Clarify vocabulary and symbols</li>
              <li>• Highlight patterns and relationships</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <LanguageIcon className="h-5 w-5 text-teal-600" />
              <h4 className="font-medium text-brand-navy">Action & Expression</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Vary methods for response</li>
              <li>• Provide scaffolds for practice</li>
              <li>• Support planning and strategy</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InclusiveDesign;
