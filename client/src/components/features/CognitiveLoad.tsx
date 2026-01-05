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
  BookOpenIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';
import ExportButton from '../shared/ExportButton';

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
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-scholarly-slate/10 rounded-lg">
            <CpuChipIcon className="h-7 w-7 text-scholarly-slate" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Cognitive Load Optimizer</h1>
            <p className="text-brand-text mt-1">Design materials that don't overwhelm working memory</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.cognitiveLoad} color="slate" />
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
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
        >
          {activeTab === 'worked' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Generate Worked Example
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Create worked examples with fading support that guide students
                from full examples to independent problem-solving.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Case brief analysis, Patient assessment, Statistical hypothesis testing"
                    className="w-full p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g., Analyze the argument structure in this passage..."
                    className="w-full h-20 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
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
                            ? 'bg-scholarly-slate/10 border-scholarly-slate text-scholarly-slate'
                            : 'border-brand-border text-brand-text hover:bg-brand-bg'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-brand-text-light mt-1 px-1">
                    <span>More support</span>
                    <span>Less support</span>
                  </div>
                </div>
              </div>
              <button
                onClick={generateWorkedExample}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Worked Example'}
              </button>
            </>
          )}

          {activeTab === 'analyze' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Slide Complexity Analysis
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Analyze your slides for cognitive load issues and get recommendations
                based on Mayer's multimedia learning principles.
              </p>
              <div className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-brand-border rounded-lg p-4 text-center hover:border-brand-gold/50 transition-colors">
                  <input
                    type="file"
                    accept=".pptx,.ppt,.pdf,.txt"
                    className="hidden"
                    id="slide-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.success(`File "${file.name}" selected. Text extraction coming soon.`);
                      }
                    }}
                  />
                  <label htmlFor="slide-upload" className="cursor-pointer">
                    <ArrowUpTrayIcon className="h-8 w-8 text-brand-text-light mx-auto mb-2" />
                    <p className="text-sm font-medium text-brand-navy">Upload slides</p>
                    <p className="text-xs text-brand-text-light mt-1">
                      PowerPoint, PDF, or text file (or paste below)
                    </p>
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
                    <span className="bg-white px-2 text-xs text-brand-text-light">or paste content</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Slide Content
                  </label>
                  <textarea
                    value={slideContent}
                    onChange={(e) => setSlideContent(e.target.value)}
                    placeholder="Paste your slide content here..."
                    className="w-full h-32 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="text-brand-navy focus:ring-brand-gold rounded" />
                    <span className="text-sm text-brand-text group-hover:text-brand-navy transition-colors">Has images</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="text-brand-navy focus:ring-brand-gold rounded" />
                    <span className="text-sm text-brand-text group-hover:text-brand-navy transition-colors">Has animations</span>
                  </label>
                </div>
              </div>
              <button
                onClick={analyzeSlide}
                disabled={loading}
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Slide'}
              </button>
            </>
          )}

          {activeTab === 'chunk' && (
            <>
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
                Content Chunking
              </h2>
              <p className="text-sm text-brand-text mb-4">
                Break complex content into digestible chunks that respect
                working memory limitations (7±2 items).
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">
                    Content to Chunk
                  </label>
                  <textarea
                    placeholder="Paste the content you want to organize into chunks..."
                    className="w-full h-48 p-3 text-sm border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all resize-none bg-brand-bg/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Target Audience
                  </label>
                  <div className="flex space-x-2">
                    {['Novice', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                          level === 'Intermediate'
                            ? 'bg-scholarly-slate/10 border-scholarly-slate text-scholarly-slate'
                            : 'border-brand-border text-brand-text hover:bg-brand-bg'
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
                className="mt-6 w-full py-3 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle max-h-[700px] overflow-y-auto"
        >
          {results && activeTab === 'worked' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Worked Example: {results.topic}
                </h2>
                <ExportButton data={results} filename="worked-example" title="Export" />
              </div>
              <div className="p-4 bg-scholarly-slate/10 rounded-lg mb-4">
                <p className="font-medium text-scholarly-slate">{results.problem}</p>
              </div>

              <h3 className="font-medium text-brand-navy mb-3">Solution Steps:</h3>
              <div className="space-y-3">
                {results.solution?.map((step: any, i: number) => {
                  const isFaded = results.fadedSteps?.includes(step.stepNumber);
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        isFaded
                          ? 'bg-brand-gold-light border-brand-gold/30 border-dashed'
                          : 'bg-brand-bg/50 border-brand-border-subtle'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                          isFaded ? 'bg-brand-gold/20 text-brand-gold' : 'bg-scholarly-slate/10 text-scholarly-slate'
                        }`}>
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-brand-text-light uppercase tracking-wide">
                            {step.subgoalLabel}
                          </span>
                          {isFaded ? (
                            <p className="text-brand-gold italic text-sm">
                              [Student completes this step]
                            </p>
                          ) : (
                            <>
                              <p className="font-medium text-brand-navy text-sm">{step.action}</p>
                              <p className="text-sm text-brand-text mt-1">{step.explanation}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {results.selfExplanationPrompts && (
                <div className="mt-4 p-4 bg-scholarly-sage/10 rounded-lg border border-scholarly-sage/20">
                  <h4 className="font-medium text-scholarly-sage mb-2 text-sm">Self-Explanation Prompts:</h4>
                  <ul className="space-y-1 text-sm text-brand-text">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-brand-navy">
                  Slide Analysis Results
                </h2>
                <ExportButton data={results} filename="slide-analysis" title="Export" />
              </div>

              {/* Load Meters */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Intrinsic', value: results.metrics?.intrinsicLoad, color: 'scholarly-slate' },
                  { label: 'Extraneous', value: results.metrics?.extraneousLoad, color: 'scholarly-terracotta' },
                  { label: 'Germane', value: results.metrics?.germaneLoad, color: 'scholarly-sage' },
                ].map((load) => (
                  <div key={load.label} className="text-center">
                    <p className="text-xs text-brand-text-light mb-1">{load.label}</p>
                    <div className="w-full bg-brand-bg rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full bg-${load.color}`}
                        style={{ width: `${(load.value || 5) * 10}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium text-brand-navy">{load.value}/10</p>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-lg mb-4 ${
                results.metrics?.totalEstimatedLoad <= 5 ? 'bg-scholarly-sage/10 border border-scholarly-sage/20' :
                results.metrics?.totalEstimatedLoad <= 7 ? 'bg-brand-gold-light border border-brand-gold/20' : 'bg-scholarly-terracotta/10 border border-scholarly-terracotta/20'
              }`}>
                <p className="font-medium text-brand-navy text-sm">
                  Total Load: {results.metrics?.totalEstimatedLoad}/10
                  {results.metrics?.totalEstimatedLoad <= 5 && ' - Good'}
                  {results.metrics?.totalEstimatedLoad > 5 && results.metrics?.totalEstimatedLoad <= 7 && ' - Consider simplifying'}
                  {results.metrics?.totalEstimatedLoad > 7 && ' - Too complex'}
                </p>
              </div>

              {results.issues && results.issues.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-brand-navy mb-2 text-sm">Issues:</h3>
                  <div className="space-y-2">
                    {results.issues.map((issue: any, i: number) => (
                      <div key={i} className="p-3 bg-scholarly-terracotta/10 rounded-lg border border-scholarly-terracotta/20">
                        <p className="font-medium text-scholarly-terracotta text-sm">{issue.type}</p>
                        <p className="text-sm text-brand-text">{issue.description}</p>
                        <p className="text-sm text-scholarly-sage mt-1">Fix: {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.multimediaPrinciples && (
                <div>
                  <h3 className="font-medium text-brand-navy mb-2 text-sm">Multimedia Principles:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(results.multimediaPrinciples).map(([principle, met]) => (
                      <div
                        key={principle}
                        className={`p-2 rounded-lg text-center text-xs font-medium ${
                          met ? 'bg-scholarly-sage/10 text-scholarly-sage' : 'bg-scholarly-terracotta/10 text-scholarly-terracotta'
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
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-brand-bg rounded-full mb-4">
                <DocumentTextIcon className="h-10 w-10 text-brand-text-light" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                No content generated yet
              </h3>
              <p className="text-sm text-brand-text-light max-w-xs">
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
        className="mt-8 bg-gradient-to-r from-scholarly-slate/5 to-scholarly-slate/10 rounded-xl p-6 border border-scholarly-slate/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-slate" />
          <h3 className="font-medium text-brand-navy">Understanding Cognitive Load</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <h4 className="font-medium text-scholarly-slate mb-2 text-sm">Intrinsic Load</h4>
            <p className="text-sm text-brand-text">
              Inherent complexity of the content. Manage by sequencing and scaffolding.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <h4 className="font-medium text-scholarly-terracotta mb-2 text-sm">Extraneous Load</h4>
            <p className="text-sm text-brand-text">
              Poor design that wastes cognitive resources. Minimize through good design.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-brand-border-subtle">
            <h4 className="font-medium text-scholarly-sage mb-2 text-sm">Germane Load</h4>
            <p className="text-sm text-brand-text">
              Effort devoted to learning itself. Optimize by freeing resources.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CognitiveLoad;
