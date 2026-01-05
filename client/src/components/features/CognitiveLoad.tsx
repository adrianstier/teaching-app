import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CpuChipIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PresentationChartBarIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const CognitiveLoad: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'worked' | 'analyze' | 'chunk'>('worked');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [slideContent, setSlideContent] = useState('');
  const [results, setResults] = useState<any>(null);

  const generateWorkedExample = async () => {
    if (!topic.trim() || !problem.trim()) {
      toast.error('Please enter topic and problem');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/cognitive-load/worked-example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          problemType: 'procedural',
          problem,
          solution: solution || 'Solution to be generated',
          targetFadingLevel: 'partial-1'
        })
      });

      if (!response.ok) throw new Error('Failed to generate worked example');
      const data = await response.json();
      setResults(data);
      toast.success('Worked example generated!');
    } catch (error) {
      toast.error('Failed to generate worked example');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSlide = async () => {
    if (!slideContent.trim()) {
      toast.error('Please enter slide content');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/cognitive-load/slide-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideContent,
          slideNumber: 1,
          hasImages: false,
          hasAnimations: false
        })
      });

      if (!response.ok) throw new Error('Failed to analyze slide');
      const data = await response.json();
      setResults(data);
      toast.success('Slide analyzed!');
    } catch (error) {
      toast.error('Failed to analyze slide');
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
          <div className="p-3 bg-violet-100 rounded-xl">
            <CpuChipIcon className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Cognitive Load Optimizer</h1>
            <p className="text-gray-600">Design materials that don't overwhelm working memory</p>
          </div>
        </div>

        <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
          <p className="text-sm text-violet-800">
            <strong>Research Basis:</strong> Sweller's Cognitive Load Theory (2011) identifies three types of load:
            intrinsic (inherent complexity), extraneous (poor design), and germane (learning itself).
            Good instruction minimizes extraneous load while optimizing intrinsic and germane load.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'worked', name: 'Worked Examples', icon: AcademicCapIcon },
          { id: 'analyze', name: 'Slide Analysis', icon: PresentationChartBarIcon },
          { id: 'chunk', name: 'Chunking', icon: Squares2X2Icon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
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
          {activeTab === 'worked' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Worked Example
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create worked examples with fading support that guide students
                from full examples to independent problem-solving.
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
                    placeholder="e.g., Solving quadratic equations"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g., Solve x² + 5x + 6 = 0"
                    className="w-full h-20 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fading Level
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { value: 'full', label: 'Full' },
                      { value: 'partial-1', label: 'Partial 1' },
                      { value: 'partial-2', label: 'Partial 2' },
                      { value: 'completion', label: 'Completion' },
                      { value: 'problem-only', label: 'Problem Only' },
                    ].map((level, i) => (
                      <button
                        key={level.value}
                        className={`py-2 px-2 text-xs rounded-lg border transition-colors ${
                          level.value === 'partial-1'
                            ? 'bg-violet-100 border-violet-500 text-violet-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                    <span>More support</span>
                    <span>Less support</span>
                  </div>
                </div>
              </div>
              <button
                onClick={generateWorkedExample}
                disabled={loading}
                className="mt-6 w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Worked Example'}
              </button>
            </>
          )}

          {activeTab === 'analyze' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Slide Complexity Analysis
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Analyze your slides for cognitive load issues and get recommendations
                based on Mayer's multimedia learning principles.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slide Content
                  </label>
                  <textarea
                    value={slideContent}
                    onChange={(e) => setSlideContent(e.target.value)}
                    placeholder="Paste your slide content here..."
                    className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-violet-600 rounded" />
                    <span className="text-sm text-gray-700">Has images</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="text-violet-600 rounded" />
                    <span className="text-sm text-gray-700">Has animations</span>
                  </label>
                </div>
              </div>
              <button
                onClick={analyzeSlide}
                disabled={loading}
                className="mt-6 w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Slide'}
              </button>
            </>
          )}

          {activeTab === 'chunk' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Content Chunking
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Break complex content into digestible chunks that respect
                working memory limitations (7±2 items).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content to Chunk
                  </label>
                  <textarea
                    placeholder="Paste the content you want to organize into chunks..."
                    className="w-full h-48 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <div className="flex space-x-2">
                    {['Novice', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          level === 'Intermediate'
                            ? 'bg-violet-100 border-violet-500 text-violet-700'
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
                disabled={loading}
                className="mt-6 w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                Generate Chunking Recommendations
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
          {results && activeTab === 'worked' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Worked Example: {results.topic}
              </h2>
              <div className="p-4 bg-violet-50 rounded-xl mb-4">
                <p className="font-medium text-violet-800">{results.problem}</p>
              </div>

              <h3 className="font-medium text-gray-700 mb-3">Solution Steps:</h3>
              <div className="space-y-3">
                {results.solution?.map((step: any, i: number) => {
                  const isFaded = results.fadedSteps?.includes(step.stepNumber);
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        isFaded
                          ? 'bg-yellow-50 border-yellow-200 border-dashed'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isFaded ? 'bg-yellow-200 text-yellow-700' : 'bg-violet-100 text-violet-700'
                        }`}>
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {step.subgoalLabel}
                          </span>
                          {isFaded ? (
                            <p className="text-yellow-700 italic">
                              [Student completes this step]
                            </p>
                          ) : (
                            <>
                              <p className="font-medium text-brand-navy">{step.action}</p>
                              <p className="text-sm text-gray-600 mt-1">{step.explanation}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {results.selfExplanationPrompts && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Self-Explanation Prompts:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {results.selfExplanationPrompts.map((p: any, i: number) => (
                      <li key={i}>After step {p.afterStep}: "{p.prompt}"</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {results && activeTab === 'analyze' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Slide Analysis Results
              </h2>

              {/* Load Meters */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Intrinsic', value: results.metrics?.intrinsicLoad, color: 'blue' },
                  { label: 'Extraneous', value: results.metrics?.extraneousLoad, color: 'red' },
                  { label: 'Germane', value: results.metrics?.germaneLoad, color: 'green' },
                ].map((load) => (
                  <div key={load.label} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{load.label}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full bg-${load.color}-500`}
                        style={{ width: `${(load.value || 5) * 10}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium">{load.value}/10</p>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl mb-4 ${
                results.metrics?.totalEstimatedLoad <= 5 ? 'bg-green-50' :
                results.metrics?.totalEstimatedLoad <= 7 ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <p className="font-medium">
                  Total Load: {results.metrics?.totalEstimatedLoad}/10
                  {results.metrics?.totalEstimatedLoad <= 5 && ' - Good'}
                  {results.metrics?.totalEstimatedLoad > 5 && results.metrics?.totalEstimatedLoad <= 7 && ' - Consider simplifying'}
                  {results.metrics?.totalEstimatedLoad > 7 && ' - Too complex'}
                </p>
              </div>

              {results.issues && results.issues.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Issues:</h3>
                  <div className="space-y-2">
                    {results.issues.map((issue: any, i: number) => (
                      <div key={i} className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium text-red-800">{issue.type}</p>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <p className="text-sm text-green-700 mt-1">Fix: {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.multimediaPrinciples && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Multimedia Principles:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(results.multimediaPrinciples).map(([principle, met]) => (
                      <div
                        key={principle}
                        className={`p-2 rounded text-center text-xs ${
                          met ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {principle}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                Optimize your materials for cognitive load to improve learning outcomes.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cognitive Load Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Understanding Cognitive Load</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-blue-700 mb-2">Intrinsic Load</h4>
            <p className="text-sm text-gray-600">
              Inherent complexity of the content. Manage by sequencing and scaffolding.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-red-700 mb-2">Extraneous Load</h4>
            <p className="text-sm text-gray-600">
              Poor design that wastes cognitive resources. Minimize through good design.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-green-700 mb-2">Germane Load</h4>
            <p className="text-sm text-gray-600">
              Effort devoted to learning itself. Optimize by freeing resources.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CognitiveLoad;
