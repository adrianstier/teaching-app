import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CpuChipIcon,
  AcademicCapIcon,
  PresentationChartBarIcon,
  Squares2X2Icon,
  BookOpenIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import ConceptExplainer, { conceptData } from '../shared/ConceptExplainer';
import ConceptDiagram from '../shared/ConceptDiagram';
import ExportButton from '../shared/ExportButton';

interface Props {
  sessionId: string;
}

const CognitiveLoad: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'worked' | 'analyze' | 'chunk'>('learn');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [problem, setProblem] = useState('');
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
          solution: 'Solution to be generated',
          targetFadingLevel: 'partial-1'
        })
      });

      if (!response.ok) throw new Error('Failed to generate worked example');
      const data = await response.json();
      setResults(data);
      toast.success('Worked example generated');
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
      toast.success('Slide analyzed');
    } catch (error) {
      toast.error('Failed to analyze slide');
    } finally {
      setLoading(false);
    }
  };

  // Research citations
  const citations = [
    {
      authors: 'Sweller, J.',
      year: '1988',
      title: 'Cognitive load during problem solving: Effects on learning',
      source: 'Cognitive Science, 12(2), 257-285',
      finding: 'Introduced cognitive load theory, showing that problem-solving during initial learning can overload working memory.'
    },
    {
      authors: 'Sweller, J., van Merriënboer, J., & Paas, F.',
      year: '1998',
      title: 'Cognitive architecture and instructional design',
      source: 'Educational Psychology Review, 10, 251-296',
      finding: 'Distinguished three types of cognitive load: intrinsic (complexity), extraneous (poor design), and germane (learning effort).'
    },
    {
      authors: 'Mayer, R. E.',
      year: '2009',
      title: 'Multimedia Learning (2nd ed.)',
      source: 'Cambridge University Press',
      finding: 'Established principles like the "split-attention effect"—learning suffers when students must integrate separated information.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-scholarly-slate/10 rounded-xl">
            <CpuChipIcon className="h-8 w-8 text-scholarly-slate" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">Cognitive Load Optimizer</h1>
            <p className="text-brand-text mt-1">Design materials that work with, not against, working memory</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'learn', name: 'Understand the Science', icon: BookOpenIcon },
          { id: 'worked', name: 'Worked Examples', icon: AcademicCapIcon },
          { id: 'analyze', name: 'Slide Analysis', icon: PresentationChartBarIcon },
          { id: 'chunk', name: 'Chunking', icon: Squares2X2Icon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResults(null); }}
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
      </div>

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
              The Three Types of Cognitive Load
            </h2>
            <p className="text-sm text-brand-text mb-6">
              Working memory has limited capacity. Understanding the three types of cognitive load helps you
              design instruction that maximizes learning while respecting these limits.
            </p>
            <div className="max-w-2xl mx-auto">
              <ConceptDiagram type="cognitiveLoadBars" animated={true} />
            </div>
          </div>

          {/* Load Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-brand-border-subtle shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                <div className="w-5 h-5 rounded bg-gray-500" />
              </div>
              <h3 className="font-semibold text-brand-navy mb-2">Intrinsic Load</h3>
              <p className="text-sm text-brand-text mb-3">
                The inherent complexity of the material itself. You can manage it by sequencing content
                and building on prior knowledge, but you cannot eliminate it.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Strategy: Build from simple to complex; activate prior knowledge first.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-terracotta/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                <div className="w-5 h-5 rounded bg-scholarly-terracotta" />
              </div>
              <h3 className="font-semibold text-scholarly-terracotta mb-2">Extraneous Load</h3>
              <p className="text-sm text-brand-text mb-3">
                Mental effort wasted on poor design—confusing layouts, unnecessary elements, or split attention.
                This is the load you should minimize.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Strategy: Remove distractions; integrate text with visuals; simplify.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-scholarly-sage/30 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                <div className="w-5 h-5 rounded bg-scholarly-sage" />
              </div>
              <h3 className="font-semibold text-scholarly-sage mb-2">Germane Load</h3>
              <p className="text-sm text-brand-text mb-3">
                Mental effort devoted to learning itself—making connections, building schemas, integrating knowledge.
                This is the "good" load you want to support.
              </p>
              <p className="text-xs text-brand-text-light italic">
                Strategy: Free up capacity by reducing extraneous load; prompt elaboration.
              </p>
            </div>
          </div>

          {/* Detailed Concept Explainer */}
          <ConceptExplainer
            {...conceptData.cognitiveLoad}
            citations={citations}
            color="slate"
            icon={<CpuChipIcon className="h-6 w-6 text-scholarly-slate" />}
          />

          {/* Quick Start CTA */}
          <div className="bg-gradient-to-r from-scholarly-slate/10 to-scholarly-slate/5 rounded-2xl p-6 border border-scholarly-slate/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy mb-2">
                  Ready to apply this?
                </h3>
                <p className="text-sm text-brand-text">
                  Create worked examples that scaffold learning or analyze your slides for cognitive load issues.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('worked')}
                className="flex items-center space-x-2 px-6 py-3 bg-scholarly-slate text-white rounded-xl font-medium hover:bg-scholarly-slate/90 transition-colors"
              >
                <span>Create Worked Example</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Worked Examples Tab */}
      {activeTab === 'worked' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
          >
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
                  ].map((level) => (
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle max-h-[700px] overflow-y-auto"
          >
            {results && activeTab === 'worked' ? (
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
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="p-4 bg-brand-bg rounded-full mb-4">
                  <DocumentTextIcon className="h-10 w-10 text-brand-text-light" />
                </div>
                <h3 className="font-medium text-brand-navy mb-2">
                  Create a Worked Example
                </h3>
                <p className="text-sm text-brand-text-light max-w-xs">
                  Guide students through problems step-by-step, gradually fading support as they build competence.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Slide Analysis Tab */}
      {activeTab === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
              Slide Complexity Analysis
            </h2>
            <p className="text-sm text-brand-text mb-4">
              Analyze your slides for cognitive load issues and get recommendations
              based on Mayer's multimedia learning principles.
            </p>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-brand-border rounded-lg p-4 text-center hover:border-brand-gold/50 transition-colors">
                <input
                  type="file"
                  accept=".pptx,.ppt,.pdf,.txt"
                  className="hidden"
                  id="slide-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      toast.success(`File "${file.name}" selected`);
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
          >
            {results && activeTab === 'analyze' ? (
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
                    { label: 'Intrinsic', value: results.metrics?.intrinsicLoad, color: 'bg-gray-500' },
                    { label: 'Extraneous', value: results.metrics?.extraneousLoad, color: 'bg-scholarly-terracotta' },
                    { label: 'Germane', value: results.metrics?.germaneLoad, color: 'bg-scholarly-sage' },
                  ].map((load) => (
                    <div key={load.label} className="text-center">
                      <p className="text-xs text-brand-text-light mb-1">{load.label}</p>
                      <div className="w-full bg-brand-bg rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full ${load.color}`}
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
                    {results.metrics?.totalEstimatedLoad <= 5 && ' — Well-balanced'}
                    {results.metrics?.totalEstimatedLoad > 5 && results.metrics?.totalEstimatedLoad <= 7 && ' — Consider simplifying'}
                    {results.metrics?.totalEstimatedLoad > 7 && ' — Likely overwhelming'}
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="p-4 bg-brand-bg rounded-full mb-4">
                  <PresentationChartBarIcon className="h-10 w-10 text-brand-text-light" />
                </div>
                <h3 className="font-medium text-brand-navy mb-2">
                  Analyze Your Slides
                </h3>
                <p className="text-sm text-brand-text-light max-w-xs">
                  Get feedback on cognitive load and multimedia learning principles.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Chunking Tab */}
      {activeTab === 'chunk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
          >
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-3">
              Content Chunking
            </h2>
            <p className="text-sm text-brand-text mb-4">
              Break complex content into digestible chunks that respect
              working memory limitations (4-7 items).
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6 border border-brand-border-subtle"
          >
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="p-4 bg-brand-bg rounded-full mb-4">
                <Squares2X2Icon className="h-10 w-10 text-brand-text-light" />
              </div>
              <h3 className="font-medium text-brand-navy mb-2">
                Chunk Your Content
              </h3>
              <p className="text-sm text-brand-text-light max-w-xs">
                Organize complex material into manageable pieces based on working memory limits.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-scholarly-slate/5 to-scholarly-slate/10 rounded-xl p-6 border border-scholarly-slate/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-scholarly-slate" />
          <h3 className="font-medium text-brand-navy">Design Principles for Reduced Load</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-text">
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Place labels directly on diagrams, not in separate legends</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Remove decorative images that do not support learning</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Present related information together in space and time</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Use narration with visuals rather than on-screen text</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Build complexity gradually; pre-train component skills</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-scholarly-slate mt-1">•</span>
              <span>Allow learner control of pacing when possible</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default CognitiveLoad;
