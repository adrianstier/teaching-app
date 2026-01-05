import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  BeakerIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ArrowsPointingOutIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ResearchBasis, { researchData } from '../shared/ResearchBasis';
import ExportButton from '../shared/ExportButton';

interface Props {
  sessionId: string;
}

const Elaborative: React.FC<Props> = ({ sessionId }) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'causal' | 'connections'>('prompts');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [concept, setConcept] = useState('');
  const [promptType, setPromptType] = useState('why');
  const [results, setResults] = useState<any>(null);

  const generatePrompts = async () => {
    if (!content.trim() || !concept.trim()) {
      toast.error('Please enter both content and concept');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/elaboration/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetConcept: concept,
          type: promptType,
          scaffoldLevel: 'moderate'
        })
      });

      if (!response.ok) throw new Error('Failed to generate prompts');
      const data = await response.json();
      setResults(data);
      toast.success('Elaborative prompts generated!');
    } catch (error) {
      toast.error('Failed to generate prompts');
    } finally {
      setLoading(false);
    }
  };

  const generateCausalScaffold = async () => {
    if (!concept.trim()) {
      toast.error('Please enter a phenomenon');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/elaboration/causal-scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phenomenon: concept,
          domain: 'general',
          priorKnowledge: []
        })
      });

      if (!response.ok) throw new Error('Failed to generate scaffold');
      const data = await response.json();
      setResults(data);
      toast.success('Causal scaffold generated!');
    } catch (error) {
      toast.error('Failed to generate scaffold');
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
            <BeakerIcon className="h-7 w-7 text-scholarly-slate" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-brand-navy">"Why?" Questions</h1>
            <p className="text-brand-text mt-1">Create questions that help students think deeper</p>
          </div>
        </div>

        {/* Research Basis */}
        <ResearchBasis {...researchData.elaborativeInterrogation} color="slate" />
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'prompts', name: 'Why/How Prompts', icon: QuestionMarkCircleIcon },
          { id: 'causal', name: 'Causal Reasoning', icon: ArrowsPointingOutIcon },
          { id: 'connections', name: 'Connection Making', icon: LinkIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
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
          {activeTab === 'prompts' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Generate Elaborative Prompts
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create "why" and "how" questions that push students beyond surface
                understanding to deep processing.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content/Text
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the content students are learning..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Concept
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Osmosis"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'why', label: 'Why' },
                      { value: 'how', label: 'How' },
                      { value: 'what-if', label: 'What-if' },
                      { value: 'compare', label: 'Compare' },
                      { value: 'predict', label: 'Predict' },
                      { value: 'connect', label: 'Connect' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setPromptType(type.value)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                          promptType === type.value
                            ? 'bg-cyan-100 border-cyan-500 text-cyan-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={generatePrompts}
                disabled={loading}
                className="mt-6 w-full py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Prompts'}
              </button>
            </>
          )}

          {activeTab === 'causal' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Causal Reasoning Scaffold
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Create scaffolds that help students trace cause-and-effect relationships
                and understand mechanisms behind phenomena.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phenomenon to Explain
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g., Why do leaves change color in fall?"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prior Knowledge (one per line)
                  </label>
                  <textarea
                    placeholder="List what students already know..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={generateCausalScaffold}
                disabled={loading}
                className="mt-6 w-full py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Causal Scaffold'}
              </button>
            </>
          )}

          {activeTab === 'connections' && (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                Connection-Making Exercise
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Help students connect new concepts to what they already know,
                building on existing schemas for meaningful learning.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Concept
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Machine learning"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prior Concepts (one per line)
                  </label>
                  <textarea
                    placeholder="Statistics&#10;Pattern recognition&#10;Decision making"
                    className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="mt-6 w-full py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                Generate Connection Exercise
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
          {results && activeTab === 'prompts' && Array.isArray(results) && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-navy">
                  Elaborative Prompts
                </h2>
                <ExportButton data={results} filename="elaborative-prompts" title="Export" />
              </div>
              <div className="space-y-4">
                {results.map((prompt: any, i: number) => (
                  <div key={i} className="p-4 bg-cyan-50 rounded-xl">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 rounded mb-2">
                      {prompt.type}
                    </span>
                    <p className="font-medium text-brand-navy mb-3">{prompt.prompt}</p>

                    <div className="mt-3 space-y-2">
                      <details>
                        <summary className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700 font-medium">
                          Scaffolded versions
                        </summary>
                        <div className="mt-2 space-y-2 pl-4">
                          {prompt.scaffoldedVersions?.map((v: any, j: number) => (
                            <div key={j} className="p-2 bg-white rounded border border-cyan-200">
                              <span className="text-xs text-gray-500">{v.level}:</span>
                              <p className="text-sm text-gray-700">{v.prompt}</p>
                            </div>
                          ))}
                        </div>
                      </details>

                      <details>
                        <summary className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700 font-medium">
                          Exemplar response
                        </summary>
                        <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-cyan-200">
                          {prompt.exemplarResponse}
                        </p>
                      </details>

                      <details>
                        <summary className="text-sm text-cyan-600 cursor-pointer hover:text-cyan-700 font-medium">
                          Quality criteria
                        </summary>
                        <ul className="mt-2 text-sm text-gray-600 pl-4 space-y-1">
                          {prompt.responseQualityCriteria?.map((c: string, k: number) => (
                            <li key={k}>• {c}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {results && activeTab === 'causal' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-navy">
                  Causal Chain: {results.phenomenon}
                </h2>
                <ExportButton data={results} filename="causal-scaffold" title="Export" />
              </div>
              <div className="space-y-4">
                {results.causalChain?.map((link: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-red-700">Cause:</span>
                          <p className="text-gray-600">{link.cause}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Mechanism:</span>
                          <p className="text-gray-600">{link.mechanism}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Effect:</span>
                          <p className="text-gray-600">{link.effect}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Evidence: {link.evidence}
                      </p>
                    </div>
                    {i < results.causalChain.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-0.5 h-4 bg-cyan-300"></div>
                      </div>
                    )}
                  </div>
                ))}

                {results.discoveryPrompts && (
                  <div className="p-4 bg-cyan-50 rounded-xl">
                    <h4 className="font-medium text-cyan-800 mb-2">Discovery Prompts:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {results.discoveryPrompts.map((p: string, i: number) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.counterfactuals && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <h4 className="font-medium text-yellow-800 mb-2">Counterfactuals:</h4>
                    <div className="space-y-2">
                      {results.counterfactuals.map((cf: any, i: number) => (
                        <p key={i} className="text-sm text-gray-700">
                          <span className="font-medium">If not:</span> {cf.ifNot} →{' '}
                          <span className="font-medium">Then:</span> {cf.then}{' '}
                          <span className="text-gray-500">({cf.because})</span>
                        </p>
                      ))}
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
                Create prompts that encourage deep processing and meaningful connections.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Question Stems */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Good Question Starters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-cyan-700 mb-2">Get Students Thinking</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Why does this make sense?</li>
              <li>• How does this work?</li>
              <li>• What would happen if...?</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-cyan-700 mb-2">Comparison</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• How is X similar to Y?</li>
              <li>• What distinguishes X from Y?</li>
              <li>• What patterns do you see?</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <h4 className="font-medium text-cyan-700 mb-2">Application</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• How could X be used to...?</li>
              <li>• Where else might this apply?</li>
              <li>• What's a real-world example?</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Elaborative;
