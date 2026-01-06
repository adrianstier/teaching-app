import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  BeakerIcon,
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

const LearningScience: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'recommendations' | 'pd'>('analyze');
  const [loading, setLoading] = useState(false);
  const [courseDescription, setCourseDescription] = useState('');
  const [challenge, setChallenge] = useState('');
  const [results, setResults] = useState<any>(null);

  const analyzeCourse = async () => {
    if (!courseDescription.trim()) {
      toast.error('Please describe your course');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/learning-science/analyze-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseDescription,
          assessmentTypes: [],
          teachingMethods: []
        })
      });

      if (!response.ok) throw new Error('Failed to analyze course');
      const data = await response.json();
      setResults(data);
      toast.success('Course analyzed!');
    } catch (error) {
      toast.error('Failed to analyze course');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (!challenge.trim()) {
      toast.error('Please describe your challenge');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/learning-science/intervention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeDescription: challenge,
          context: {},
          constraints: []
        })
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      const data = await response.json();
      setResults(data);
      toast.success('Recommendations generated!');
    } catch (error) {
      toast.error('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-brand-gold/10 rounded-lg">
            <SparklesIcon className="h-7 w-7 text-brand-gold" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Teaching Tips</h1>
            <p className="text-brand-text mt-1">Get practical suggestions to help your students learn better</p>
          </div>
        </div>

        <div className="bg-brand-gold/5 rounded-xl p-4 border border-brand-gold/20">
          <p className="text-sm text-brand-text">
            <strong className="text-brand-navy">How it works:</strong> Describe your course or a teaching challenge, and get practical
            suggestions based on what research shows helps students learn. No jargon—just clear,
            actionable ideas you can try.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex space-x-2 mb-6">
        {[
          { id: 'analyze', name: 'Course Analysis', icon: ChartBarIcon },
          { id: 'recommendations', name: 'Get Recommendations', icon: LightBulbIcon },
          { id: 'pd', name: 'PD Resources', icon: BookOpenIcon },
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
          {activeTab === 'analyze' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Analyze Your Course
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Describe your course and teaching practices to get a research-based
                analysis of what's working and opportunities for improvement.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Course Description
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Describe your course, typical class session, and main teaching methods..."
                    className="w-full h-32 p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Assessment Types Used
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Exams', 'Quizzes', 'Papers', 'Projects', 'Presentations', 'Discussions'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 p-2 border border-brand-border-subtle rounded-lg hover:bg-brand-gold/5 cursor-pointer">
                        <input type="checkbox" className="text-brand-gold rounded" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={analyzeCourse}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Course'}
              </button>
            </>
          )}

          {activeTab === 'recommendations' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Get Targeted Recommendations
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Describe a specific teaching challenge and get evidence-based
                suggestions for addressing it.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Teaching Challenge
                  </label>
                  <textarea
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="e.g., Students aren't retaining information from one week to the next"
                    className="w-full h-32 p-3 border border-brand-border-subtle rounded-xl focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Constraints
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      'Large class (100+)',
                      'Limited time',
                      'Online/hybrid',
                      'Fixed curriculum',
                    ].map((constraint) => (
                      <label key={constraint} className="flex items-center space-x-2 p-2 border border-brand-border-subtle rounded-lg hover:bg-brand-gold/5 cursor-pointer">
                        <input type="checkbox" className="text-brand-gold rounded" />
                        <span>{constraint}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={getRecommendations}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Get Recommendations'}
              </button>
            </>
          )}

          {activeTab === 'pd' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Professional Development
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Get curated learning science resources and professional development
                recommendations based on your interests.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Topics of Interest
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Active Learning',
                      'Assessment Design',
                      'Inclusive Teaching',
                      'Student Motivation',
                      'Memory & Retention',
                      'Feedback Practices',
                      'Course Design',
                      'Technology Integration',
                    ].map((topic) => (
                      <label key={topic} className="flex items-center space-x-2 p-2 border border-brand-border-subtle rounded-lg hover:bg-brand-gold/5 cursor-pointer">
                        <input type="checkbox" className="text-brand-gold rounded" />
                        <span className="text-sm">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Preferred Format
                  </label>
                  <div className="flex space-x-2">
                    {['Books', 'Articles', 'Videos', 'Workshops'].map((format) => (
                      <button
                        key={format}
                        className="flex-1 py-2 px-3 text-sm rounded-lg border border-brand-border-subtle text-brand-text hover:bg-brand-bg/50"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                Get PD Recommendations
              </button>
            </>
          )}
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-brand-border-subtle max-h-[700px] overflow-y-auto"
        >
          {results && activeTab === 'analyze' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Course Analysis
              </h2>
              <div className="space-y-4">
                {results.strengths && (
                  <div className="p-4 bg-scholarly-sage/5 rounded-xl">
                    <h3 className="font-medium text-scholarly-sage mb-2">Strengths</h3>
                    <ul className="space-y-1 text-sm text-brand-navy">
                      {results.strengths.map((s: string, i: number) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.opportunities && (
                  <div className="p-4 bg-brand-gold/5 rounded-xl">
                    <h3 className="font-medium text-brand-navy mb-2">Opportunities</h3>
                    <ul className="space-y-1 text-sm text-brand-navy">
                      {results.opportunities.map((o: string, i: number) => (
                        <li key={i}>• {o}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.recommendations && (
                  <div>
                    <h3 className="font-medium text-brand-navy mb-2">Recommendations</h3>
                    <div className="space-y-3">
                      {results.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="p-3 bg-brand-bg/50 rounded-lg">
                          <p className="font-medium text-brand-navy">{rec.recommendation}</p>
                          <p className="text-sm text-brand-text mt-1">{rec.rationale}</p>
                          <p className="text-xs text-brand-gold mt-2">
                            Research: {rec.researchBasis}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {results && activeTab === 'recommendations' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Evidence-Based Interventions
              </h2>
              <div className="space-y-4">
                {results.interventions?.map((int: any, i: number) => (
                  <div key={i} className="p-4 bg-brand-bg/50 rounded-xl border-l-4 border-brand-gold">
                    <h3 className="font-medium text-brand-navy mb-2">{int.name}</h3>
                    <p className="text-sm text-brand-text mb-2">{int.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Research-backed
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {int.implementationEase}
                      </span>
                    </div>
                    <details className="mt-2">
                      <summary className="text-sm text-brand-gold cursor-pointer font-medium">
                        Implementation steps
                      </summary>
                      <ol className="mt-2 text-sm text-brand-text pl-4 space-y-1 list-decimal">
                        {int.steps?.map((step: string, j: number) => (
                          <li key={j}>{step}</li>
                        ))}
                      </ol>
                    </details>
                  </div>
                ))}

                {results.citations && (
                  <div className="p-4 bg-brand-bg/50 rounded-xl">
                    <h4 className="font-medium text-brand-navy mb-2">Key Research:</h4>
                    <ul className="text-xs text-brand-text space-y-1">
                      {results.citations.map((c: string, i: number) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {!results && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-brand-gold/10 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-brand-gold" />
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">
                No analysis yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-sm">
                Get personalized, research-backed recommendations for your teaching.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Key Research Areas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/20"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Simple Changes That Make a Difference</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Quiz Often', benefit: 'Helps memory', desc: 'Low-stakes tests help students remember' },
            { title: 'Spread Reviews', benefit: 'Lasts longer', desc: 'Space out practice over time' },
            { title: 'Quick Feedback', benefit: 'Faster progress', desc: 'Tell students how they did soon' },
            { title: 'Teach Self-Checking', benefit: 'Independence', desc: 'Help students know what they know' },
          ].map((practice) => (
            <div key={practice.title} className="p-4 bg-white rounded-xl">
              <h4 className="font-medium text-brand-navy">{practice.title}</h4>
              <p className="text-xs text-brand-text-light mb-1">{practice.desc}</p>
              <span className="text-xs font-medium text-brand-gold">{practice.benefit}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-text-light mt-4 text-center">
          These approaches consistently help students learn more effectively.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LearningScience;
