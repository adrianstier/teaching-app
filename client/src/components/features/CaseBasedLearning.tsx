import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  BookOpenIcon,
  UserGroupIcon,
  ScaleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

interface Props {
  sessionId: string;
}

const CaseBasedLearning: React.FC<Props> = ({ sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState('');
  const [complexity, setComplexity] = useState('moderate');
  const [objectives, setObjectives] = useState('');
  const [caseStudy, setCaseStudy] = useState<any>(null);

  const generateCase = async () => {
    if (!topic.trim() || !domain.trim()) {
      toast.error('Please enter both topic and domain');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pedagogical/case-based/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          domain,
          complexity,
          learningObjectives: objectives.split('\n').filter(o => o.trim()),
          studentLevel: 'intermediate',
          includeEthicalDimensions: true
        })
      });

      if (!response.ok) throw new Error('Failed to generate case');
      const data = await response.json();
      setCaseStudy(data);
      toast.success('Case study generated!');
    } catch (error) {
      toast.error('Failed to generate case study');
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
          <div className="p-3 bg-amber-100 rounded-xl">
            <BookOpenIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Case-Based Learning</h1>
            <p className="text-gray-600">Generate authentic real-world scenarios for deep learning</p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-sm text-amber-800">
            <strong>Research Basis:</strong> Case-based learning develops professional reasoning skills
            (Kolodner, 1992). Authentic contexts improve transfer and motivation while developing
            critical thinking and decision-making abilities.
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-brand-navy mb-4">
            Generate Case Study
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic/Concept
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Supply chain disruption"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain/Field
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., Business Management"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'simplified', label: 'Simplified', desc: 'Clear problem, guided path' },
                  { value: 'moderate', label: 'Moderate', desc: 'Some ambiguity' },
                  { value: 'realistic', label: 'Realistic', desc: 'Real-world messiness' },
                  { value: 'messy', label: 'Messy', desc: 'High ambiguity, no clear answer' },
                ].map((level) => (
                  <label
                    key={level.value}
                    className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${
                      complexity === level.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="complexity"
                        value={level.value}
                        checked={complexity === level.value}
                        onChange={(e) => setComplexity(e.target.value)}
                        className="text-amber-600"
                      />
                      <span className="text-sm font-medium">{level.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 ml-6">{level.desc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learning Objectives (one per line)
              </label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Apply stakeholder analysis&#10;Evaluate decision trade-offs&#10;Develop evidence-based recommendations"
                className="w-full h-24 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-amber-600 rounded" />
              <span className="text-sm text-gray-700">Include ethical dimensions</span>
            </div>
          </div>
          <button
            onClick={generateCase}
            disabled={loading}
            className="mt-6 w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating Case Study...' : 'Generate Case Study'}
          </button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 max-h-[800px] overflow-y-auto"
        >
          {caseStudy ? (
            <>
              <h2 className="text-xl font-semibold text-brand-navy mb-4">
                {caseStudy.title}
              </h2>

              {/* Real World Context */}
              <div className="p-4 bg-amber-50 rounded-xl mb-4">
                <p className="text-sm text-amber-800">{caseStudy.realWorldContext}</p>
              </div>

              {/* Background */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Background</h3>
                <p className="text-sm text-gray-600">{caseStudy.scenario?.background}</p>
              </div>

              {/* Situation */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Current Situation</h3>
                <p className="text-sm text-gray-600">{caseStudy.scenario?.situation}</p>
              </div>

              {/* Stakeholders */}
              {caseStudy.scenario?.stakeholders && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Key Stakeholders</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {caseStudy.scenario.stakeholders.map((s: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserGroupIcon className="h-4 w-4 text-amber-600" />
                          <span className="font-medium text-brand-navy">{s.name}</span>
                          <span className="text-xs text-gray-500">({s.role})</span>
                        </div>
                        <p className="text-sm text-gray-600">{s.perspective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Point */}
              <div className="p-4 bg-blue-50 rounded-xl mb-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <ScaleIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Decision Point</h3>
                </div>
                <p className="text-sm text-gray-700">{caseStudy.scenario?.decision}</p>
              </div>

              {/* Analysis Prompts */}
              {caseStudy.analysisPrompts && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Analysis Prompts</h3>
                  <div className="space-y-2">
                    {caseStudy.analysisPrompts.map((p: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded mb-1">
                          {p.phase}
                        </span>
                        <p className="text-sm text-brand-navy">{p.prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Considerations */}
              {caseStudy.ethicalConsiderations && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h3 className="font-medium text-purple-800 mb-2">Ethical Considerations</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {caseStudy.ethicalConsiderations.map((e: string, i: number) => (
                      <li key={i}>• {e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <DocumentTextIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No case study generated yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Fill in the details to generate an authentic case study for your class.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Teaching Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100"
      >
        <h3 className="font-semibold text-brand-navy mb-4">Facilitating Case Discussions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-amber-700 mb-2">Preparation:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Assign reading before class</li>
              <li>• Have students write initial analysis</li>
              <li>• Form discussion groups in advance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-amber-700 mb-2">During Discussion:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Push for evidence-based reasoning</li>
              <li>• Explore multiple perspectives</li>
              <li>• Resist giving "the answer"</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseBasedLearning;
